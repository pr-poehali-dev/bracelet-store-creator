import json
import os
import uuid
import urllib.request
import base64
import psycopg2


HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handle_webhook(body: dict) -> dict:
    """Обработка уведомления от Юкассы."""
    event_type = body.get("type")
    payment_obj = body.get("object", {})

    if event_type != "notification":
        return {"statusCode": 200, "headers": HEADERS, "body": "ok"}

    payment_id = payment_obj.get("id")
    status = payment_obj.get("status")
    metadata = payment_obj.get("metadata", {})
    order_id = metadata.get("order_id")

    if not payment_id or not order_id:
        return {"statusCode": 200, "headers": HEADERS, "body": "ok"}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "UPDATE t_p51841735_bracelet_store_creat.cart_orders SET payment_status = %s WHERE id = %s AND payment_id = %s",
        (status, int(order_id), payment_id),
    )
    if status == "succeeded":
        cur.execute(
            "UPDATE t_p51841735_bracelet_store_creat.cart_orders SET status = %s WHERE id = %s",
            ("confirmed", int(order_id)),
        )
    conn.commit()
    cur.close()
    conn.close()

    return {"statusCode": 200, "headers": HEADERS, "body": "ok"}


def handler(event: dict, context) -> dict:
    """Создаёт платёж в Юкассе по СБП. POST / — создание платежа, POST /webhook — уведомление от Юкассы."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")

    if path.endswith("/webhook"):
        return handle_webhook(body)

    shop_id = os.environ.get("YOOKASSA_SHOP_ID", "")
    secret_key = os.environ.get("YOOKASSA_SECRET_KEY", "")

    if not shop_id or not secret_key:
        return {
            "statusCode": 503,
            "headers": HEADERS,
            "body": json.dumps({"ok": False, "error": "Платёжный сервис не настроен"}, ensure_ascii=False),
        }

    order_id = body.get("order_id")
    total_price = body.get("total_price")
    description = body.get("description", "Заказ украшений ручной работы")
    return_url = body.get("return_url", "https://poehali.dev")

    if not order_id or not total_price:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"ok": False, "error": "Не указан order_id или total_price"}, ensure_ascii=False),
        }

    idempotence_key = str(uuid.uuid4())
    credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()

    payload = json.dumps({
        "amount": {"value": f"{total_price:.2f}", "currency": "RUB"},
        "payment_method_data": {"type": "sbp"},
        "confirmation": {"type": "redirect", "return_url": return_url},
        "capture": True,
        "description": f"{description} #{order_id}",
        "metadata": {"order_id": str(order_id)},
    }, ensure_ascii=False).encode()

    req = urllib.request.Request(
        "https://api.yookassa.ru/v3/payments",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {credentials}",
            "Idempotence-Key": idempotence_key,
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read())

    payment_id = result["id"]
    confirmation_url = result.get("confirmation", {}).get("confirmation_url", "")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "UPDATE t_p51841735_bracelet_store_creat.cart_orders SET payment_id = %s, payment_status = %s WHERE id = %s",
        (payment_id, "pending", order_id),
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({
            "ok": True,
            "payment_id": payment_id,
            "confirmation_url": confirmation_url,
        }, ensure_ascii=False),
    }

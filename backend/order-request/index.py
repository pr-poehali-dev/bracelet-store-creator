import json
import os
import urllib.request
import psycopg2


def send_max_notification(order_id: int, product_name: str, name: str, phone: str, birth_date: str, request_text: str) -> bool:
    """Отправка уведомления о новой заявке в мессенджер MAX."""
    token = os.environ.get("MAX_BOT_TOKEN", "")
    user_id = os.environ.get("MAX_USER_ID", "")
    if not token or not user_id:
        return False

    msg = (
        f"📋 Новая заявка #{order_id}\n\n"
        f"🛍 Товар: {product_name}\n"
        f"👤 Имя: {name}\n"
        f"📞 Телефон: {phone}\n"
        + (f"🎂 Дата рождения: {birth_date}\n" if birth_date else "")
        + (f"\n💬 Пожелания: {request_text}" if request_text else "")
    )

    payload = json.dumps({"text": msg}, ensure_ascii=False).encode()
    url = f"https://platform-api.max.ru/messages?user_id={user_id}"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception:
        return False


def handler(event: dict, context) -> dict:
    """Приём заявки на браслет по запросу (амулеты и индивидуальные браслеты)."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    if event.get("httpMethod") == "GET":
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "SELECT id, product_name, name, phone, birth_date, request_text, created_at "
            "FROM t_p51841735_bracelet_store_creat.order_requests ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [
            {
                "id": r[0],
                "product_name": r[1],
                "name": r[2],
                "phone": r[3],
                "birth_date": r[4],
                "request_text": r[5],
                "created_at": r[6].isoformat() if r[6] else None,
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(result, ensure_ascii=False)}

    body = json.loads(event.get("body") or "{}")
    product_name = body.get("product_name", "")
    product_id = body.get("product_id", 0)
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    birth_date = body.get("birth_date", "").strip()
    request_text = body.get("request_text", "").strip()

    if not name or not phone or not product_name:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Заполните имя, телефон и выберите товар"}, ensure_ascii=False),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p51841735_bracelet_store_creat.order_requests "
        "(product_name, product_id, name, phone, birth_date, request_text) "
        "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
        (product_name, product_id, name, phone, birth_date, request_text),
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    send_max_notification(new_id, product_name, name, phone, birth_date, request_text)

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True, "id": new_id}, ensure_ascii=False),
    }
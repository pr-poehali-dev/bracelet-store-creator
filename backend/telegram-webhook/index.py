import json
import os
import urllib.request
import psycopg2


def tg_request(token: str, method: str, payload: dict):
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def handler(event: dict, context) -> dict:
    """Webhook для Telegram — обрабатывает нажатие кнопок Подтвердить/Отменить заказ."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": ""}

    body = json.loads(event.get("body") or "{}")
    callback = body.get("callback_query")
    if not callback:
        return {"statusCode": 200, "body": "ok"}

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    callback_id = callback["id"]
    data = callback.get("data", "")
    chat_id = callback["message"]["chat"]["id"]
    message_id = callback["message"]["message_id"]
    original_text = callback["message"].get("text", "")

    if data.startswith("confirm_"):
        order_id = int(data.split("_")[1])
        new_status = "confirmed"
        status_label = "✅ Подтверждён"
        answer_text = "Заказ подтверждён!"
    elif data.startswith("cancel_"):
        order_id = int(data.split("_")[1])
        new_status = "cancelled"
        status_label = "❌ Отменён"
        answer_text = "Заказ отменён"
    else:
        tg_request(token, "answerCallbackQuery", {"callback_query_id": callback_id})
        return {"statusCode": 200, "body": "ok"}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "UPDATE t_p51841735_bracelet_store_creat.cart_orders SET status = %s WHERE id = %s",
        (new_status, order_id),
    )
    conn.commit()
    cur.close()
    conn.close()

    tg_request(token, "answerCallbackQuery", {
        "callback_query_id": callback_id,
        "text": answer_text,
    })

    new_text = original_text + f"\n\n<b>Статус: {status_label}</b>"
    tg_request(token, "editMessageText", {
        "chat_id": chat_id,
        "message_id": message_id,
        "text": new_text,
        "parse_mode": "HTML",
        "reply_markup": {"inline_keyboard": []},
    })

    return {"statusCode": 200, "body": "ok"}

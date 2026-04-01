import json
import os
import urllib.request


HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def tg_request(token: str, method: str, payload: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def handler(event: dict, context) -> dict:
    """Уведомление в Telegram при добавлении товара в корзину с личными данными пользователя."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    product_name = body.get("product_name", "").strip()
    product_price = body.get("product_price", 0)

    if not name or not phone or not product_name:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"error": "Укажите имя, телефон и товар"}, ensure_ascii=False),
        }

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

    if token and chat_id:
        msg = (
            f"🛍 <b>Товар добавлен в корзину</b>\n\n"
            f"👤 <b>Имя:</b> {name}\n"
            f"📞 <b>Телефон:</b> {phone}\n\n"
            f"🧿 <b>Товар:</b> {product_name}\n"
            f"💰 <b>Цена:</b> {product_price:,} ₽"
        )
        try:
            tg_request(token, "sendMessage", {
                "chat_id": chat_id,
                "text": msg,
                "parse_mode": "HTML",
            })
        except Exception:
            pass  # не блокируем пользователя при ошибке отправки

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({"ok": True}, ensure_ascii=False),
    }

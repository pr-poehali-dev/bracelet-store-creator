import json
import os
import urllib.request
import psycopg2


HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def tg_request(token: str, method: str, payload: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def send_order_notification(order_id: int, name: str, phone: str, comment: str, items: list, custom_designs: list, total_price: int) -> int | None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")
    if not token or not chat_id:
        return None

    items_text = "\n".join(
        f"  • {i.get('name', '?')} × {i.get('quantity', 1)} — {i.get('price', 0) * i.get('quantity', 1):,} ₽"
        for i in items
    )
    designs_text = ""
    if custom_designs:
        lines = "\n".join(
            f"  ✦ {d.get('name', 'Браслет')} — {d.get('stones_count', '?')} камней, размер {d.get('size', '?')} см, застёжка: {d.get('clasp', '?')} — {d.get('price', 0):,} ₽"
            for d in custom_designs
        )
        designs_text = f"\n\n<b>Браслеты из конструктора:</b>\n{lines}"

    msg = (
        f"🛒 <b>Новый заказ #{order_id}</b>\n\n"
        f"👤 <b>Имя:</b> {name}\n"
        f"📞 <b>Телефон:</b> {phone}\n\n"
        + (f"<b>Товары из каталога:</b>\n{items_text}" if items_text else "")
        + designs_text + "\n\n"
        f"💰 <b>Итого: {total_price:,} ₽</b>"
        + (f"\n\n💬 <b>Комментарий:</b> {comment}" if comment else "")
    )

    keyboard = {
        "inline_keyboard": [[
            {"text": "✅ Подтвердить", "callback_data": f"confirm_{order_id}"},
            {"text": "❌ Отменить", "callback_data": f"cancel_{order_id}"},
        ]]
    }

    result = tg_request(token, "sendMessage", {
        "chat_id": chat_id,
        "text": msg,
        "parse_mode": "HTML",
        "reply_markup": keyboard,
    })
    return result.get("result", {}).get("message_id")


def handler(event: dict, context) -> dict:
    """Оформление заказа из корзины — сохранение в БД и уведомление в Telegram с кнопками. GET — список всех заказов."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    if event.get("httpMethod") == "GET":
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, phone, comment, items, total_price, status, created_at "
            "FROM t_p51841735_bracelet_store_creat.cart_orders ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [
            {
                "id": r[0],
                "name": r[1],
                "phone": r[2],
                "comment": r[3],
                "items": r[4] if isinstance(r[4], list) else json.loads(r[4] or "[]"),
                "total_price": r[5],
                "status": r[6],
                "created_at": r[7].isoformat() if r[7] else None,
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps(result, ensure_ascii=False)}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    comment = body.get("comment", "").strip()
    items = body.get("items", [])
    custom_designs = body.get("custom_designs", [])
    total_price = body.get("total_price", 0)

    if not name or not phone or (not items and not custom_designs):
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"error": "Заполните имя, телефон и добавьте товары"}, ensure_ascii=False),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p51841735_bracelet_store_creat.cart_orders "
        "(name, phone, comment, items, total_price) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (name, phone, comment, json.dumps(items, ensure_ascii=False), total_price),
    )
    new_id = cur.fetchone()[0]
    conn.commit()

    message_id = send_order_notification(new_id, name, phone, comment, items, custom_designs, total_price)

    if message_id:
        cur.execute(
            "UPDATE t_p51841735_bracelet_store_creat.cart_orders SET tg_message_id = %s WHERE id = %s",
            (message_id, new_id),
        )
        conn.commit()

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({"ok": True, "id": new_id}, ensure_ascii=False),
    }
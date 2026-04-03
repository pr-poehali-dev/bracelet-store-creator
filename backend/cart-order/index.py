import json
import os
import urllib.request
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def tg_request(token: str, method: str, payload: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"[TG ERROR] {e}")
        return {}


def send_max_notification(order_id: int, name: str, phone: str, comment: str, items: list, custom_designs: list, total_price: int) -> bool:
    """Отправка уведомления о новом заказе в мессенджер MAX."""
    token = os.environ.get("MAX_BOT_TOKEN", "")
    user_id = os.environ.get("MAX_USER_ID", "")
    if not token or not user_id:
        return False

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
        designs_text = f"\n\nБраслеты из конструктора:\n{lines}"

    msg = (
        f"🛒 Новый заказ #{order_id}\n\n"
        f"👤 Имя: {name}\n"
        f"📞 Телефон: {phone}\n\n"
        + (f"Товары из каталога:\n{items_text}" if items_text else "")
        + designs_text + "\n\n"
        f"💰 Итого: {total_price:,} ₽"
        + (f"\n\n💬 Комментарий: {comment}" if comment else "")
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


def send_email_notification(order_id: int, name: str, phone: str, comment: str, items: list, custom_designs: list, total_price: int) -> bool:
    smtp_password = os.environ.get("MAIL_SMTP_PASSWORD", "")
    if not smtp_password:
        return False

    sender = "Lida.tetyush@mail.ru"
    recipient = "Lida.tet@yandex.ru"

    items_html = "".join(
        f"<li>{i.get('name', '?')} × {i.get('quantity', 1)} — {i.get('price', 0) * i.get('quantity', 1):,} ₽</li>"
        for i in items
    )
    designs_html = ""
    if custom_designs:
        lines = "".join(
            f"<li>✦ {d.get('name', 'Браслет')} — {d.get('stones_count', '?')} камней, размер {d.get('size', '?')} см, застёжка: {d.get('clasp', '?')} — {d.get('price', 0):,} ₽</li>"
            for d in custom_designs
        )
        designs_html = f"<p><b>Браслеты из конструктора:</b></p><ul>{lines}</ul>"

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #7a5c3a;">🛒 Новый заказ #{order_id}</h2>
        <p><b>Имя:</b> {name}</p>
        <p><b>Телефон:</b> <a href="tel:{phone}">{phone}</a></p>
        {f'<p><b>Комментарий:</b> {comment}</p>' if comment else ''}
        {'<p><b>Товары из каталога:</b></p><ul>' + items_html + '</ul>' if items_html else ''}
        {designs_html}
        <p style="font-size: 18px;"><b>Итого: {total_price:,} ₽</b></p>
        <hr style="border-color: #e0d0c0;">
        <p style="color: #999; font-size: 12px;">Украшения ручной работы</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новый заказ #{order_id} — {name}, {total_price:,} ₽"
    msg["From"] = sender
    msg["To"] = recipient
    msg.attach(MIMEText(html, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL("smtp.mail.ru", 465) as smtp:
            smtp.login(sender, smtp_password)
            smtp.sendmail(sender, recipient, msg.as_string())
        return True
    except Exception:
        return False


def send_buyer_email(order_id: int, buyer_email: str, name: str, phone: str, comment: str, items: list, custom_designs: list, total_price: int) -> bool:
    """Отправка подтверждения заказа покупателю."""
    smtp_password = os.environ.get("MAIL_SMTP_PASSWORD", "")
    if not smtp_password or not buyer_email:
        return False

    sender = "Lida.tetyush@mail.ru"

    items_html = "".join(
        f"<tr><td style='padding:6px 8px; border-bottom:1px solid #f0e8de;'>{i.get('name', '?')} × {i.get('quantity', 1)}</td>"
        f"<td style='padding:6px 8px; border-bottom:1px solid #f0e8de; text-align:right; white-space:nowrap;'>{i.get('price', 0) * i.get('quantity', 1):,} ₽</td></tr>"
        for i in items
    )
    designs_html = ""
    if custom_designs:
        rows = "".join(
            f"<tr><td style='padding:6px 8px; border-bottom:1px solid #f0e8de;'>✦ {d.get('name', 'Браслет')} — {d.get('stones_count', '?')} камней, {d.get('size', '?')} см, застёжка: {d.get('clasp', '?')}</td>"
            f"<td style='padding:6px 8px; border-bottom:1px solid #f0e8de; text-align:right; white-space:nowrap;'>{d.get('price', 0):,} ₽</td></tr>"
            for d in custom_designs
        )
        designs_html = rows

    all_rows_html = items_html + designs_html

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #fff;">
      <div style="background: #7a5c3a; padding: 28px 32px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 2px;">УКРАШЕНИЯ РУЧНОЙ РАБОТЫ</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #7a5c3a; font-weight: 400; margin-top: 0;">Заказ #{order_id} принят!</h2>
        <p style="color: #555; line-height: 1.6;">Привет, <b>{name}</b>! 🌸<br>
        Мы получили ваш заказ и свяжемся с вами в течение дня для подтверждения и обсуждения доставки.</p>

        <h3 style="color: #7a5c3a; font-weight: 400; border-bottom: 1px solid #e0d0c0; padding-bottom: 8px;">Ваш заказ</h3>
        <table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">
          {all_rows_html}
          <tr>
            <td style="padding: 10px 8px; font-weight: bold; color: #333;">Итого</td>
            <td style="padding: 10px 8px; font-weight: bold; color: #7a5c3a; text-align: right; font-size: 18px;">{total_price:,} ₽</td>
          </tr>
        </table>

        {f'<p style="color:#555;"><b>Комментарий:</b> {comment}</p>' if comment else ''}

        <div style="background: #fdf8f3; border-left: 3px solid #7a5c3a; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #7a5c3a; font-size: 14px;">📞 Мастер свяжется с вами по номеру <b>{phone}</b> для подтверждения и выбора удобного способа оплаты.</p>
        </div>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px; border-top: 1px solid #f0e8de; padding-top: 16px;">
          Если у вас есть вопросы — просто ответьте на это письмо.<br>
          С любовью, мастерская украшений ручной работы 🌿
        </p>
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Заказ #{order_id} принят — {total_price:,} ₽"
    msg["From"] = f"Украшения ручной работы <{sender}>"
    msg["To"] = buyer_email
    msg.attach(MIMEText(html, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL("smtp.mail.ru", 465) as smtp:
            smtp.login(sender, smtp_password)
            smtp.sendmail(sender, buyer_email, msg.as_string())
        return True
    except Exception as e:
        print(f"[EMAIL BUYER ERROR] {e}")
        return False


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

        # Режим повторной отправки пропущенных уведомлений
        if event.get("queryStringParameters", {}).get("resend") == "1":
            cur.execute(
                "SELECT id, name, phone, comment, items, total_price "
                "FROM t_p51841735_bracelet_store_creat.cart_orders "
                "WHERE tg_message_id IS NULL ORDER BY created_at ASC"
            )
            missed = cur.fetchall()
            sent = []
            for r in missed:
                order_id, name, phone, comment, items_raw, total_price = r
                items = items_raw if isinstance(items_raw, list) else json.loads(items_raw or "[]")
                msg_id = send_order_notification(order_id, name, phone, comment or "", items, [], total_price)
                if msg_id:
                    cur.execute(
                        "UPDATE t_p51841735_bracelet_store_creat.cart_orders SET tg_message_id = %s WHERE id = %s",
                        (msg_id, order_id),
                    )
                    sent.append(order_id)
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True, "sent": sent}, ensure_ascii=False)}

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
    email = body.get("email", "").strip()
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

    send_email_notification(new_id, name, phone, comment, items, custom_designs, total_price)
    send_max_notification(new_id, name, phone, comment, items, custom_designs, total_price)
    if email:
        send_buyer_email(new_id, email, name, phone, comment, items, custom_designs, total_price)

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({"ok": True, "id": new_id}, ensure_ascii=False),
    }
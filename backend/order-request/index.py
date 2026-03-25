import json
import os
import psycopg2


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

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True, "id": new_id}, ensure_ascii=False),
    }

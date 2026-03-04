from app.core.database import get_connection


def save_message(user_id: str, role: str, content: str):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO messages (user_id, role, content)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (user_id, role, content))
    conn.commit()

    cursor.close()
    conn.close()


def get_recent_messages(user_id: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT role, content, created_at
    FROM messages
    WHERE user_id = %s
    ORDER BY created_at DESC
    LIMIT 3
    """

    cursor.execute(query, (user_id,))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return results
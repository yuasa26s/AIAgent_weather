# backend/app/services/memory.py

def save_message(user_id: str, role: str, content: str):
    """DBがないため、保存せずにログ出力だけ行います"""
    print(f"Memory Log: [{role}] {content}")
    return

def get_recent_messages(user_id: str):
    """履歴の代わりに空のリストを返します"""
    return []
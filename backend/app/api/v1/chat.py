from fastapi import APIRouter
from pydantic import BaseModel
from app.services.memory import save_message, get_recent_messages
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(req: ChatRequest):
    user_id = "demo-user"  # 仮UUID

    # ユーザー発言保存
    save_message(user_id, "user", req.message)

    # 仮AIレスポンス（あとでLLMに置き換え）
    ai_response = "コーデ提案です！"

    # AI発言保存
    save_message(user_id, "assistant", ai_response)

    # 直近3件取得
    history = get_recent_messages(user_id)

    return {
        "response": ai_response,
        "recent_history": history
    }
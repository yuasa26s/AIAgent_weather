from fastapi import APIRouter
from pydantic import BaseModel
from app.services.memory import save_message, get_recent_messages
from app.services.rag_service import search_fashion_trends, RAG_PROMPT_TEMPLATE
from openai import OpenAI
import os

router = APIRouter()

# OpenAIクライアントの初期化
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    city: str = "東京"  # デフォルト値を設定
    weather: str = "晴れ"

@router.post("/chat")
def chat(req: ChatRequest):
    user_id = "demo-user"

    # 1. ユーザー発言を保存
    save_message(user_id, "user", req.message)

    # 2. RAGロジックで外部情報と独自ナレッジを取得
    # (rag_service.py で作成した関数を呼び出す)
    context = search_fashion_trends(req.city, req.weather, req.message)

    # 3. プロンプトの組み立て
    final_prompt = RAG_PROMPT_TEMPLATE.format(context=context, query=req.message)

    # 4. OpenAI API を叩く
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは親切で具体的な提案ができるファッションアドバイザーです。"},
                {"role": "user", "content": final_prompt}
            ]
        )
        ai_response = completion.choices[0].message.content
    except Exception as e:
        print(f"OpenAIエラー: {e}")
        ai_response = "申し訳ありません、現在アドバイスを生成できません。"

    # 5. AI発言を保存
    save_message(user_id, "assistant", ai_response)

    # 6. 直近の履歴を取得
    history = get_recent_messages(user_id)

    return {
        "response": ai_response,
        "recent_history": history
    }
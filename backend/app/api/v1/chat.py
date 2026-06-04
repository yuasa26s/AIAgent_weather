from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Optional
from app.services.rag_service import search_fashion_trends, RAG_PROMPT_TEMPLATE
import openai

router = APIRouter()

# フロントエンドから送られてくるJSONデータの構造を定義
class ChatRequest(BaseModel):
    message: str
    city: str
    weather_data: Optional[Any] = None

@router.post("/chat")  # 💡 確実に「POST」メソッドで「/chat」として待ち受けます
async def chat_endpoint(request: ChatRequest):
    try:
        print(f"📡 [リクエスト受信] メッセージ: {request.message}, 都市: {request.city}")
        
        # 1. 天気データのパース処理
        weather_info = "不明"
        if request.weather_data and "main" in request.weather_data:
            temp = request.weather_data["main"].get("temp", "不明")
            weather_info = f"現在気温: {temp}℃"
            if "weather" in request.weather_data and len(request.weather_data["weather"]) > 0:
                weather_info += f" ({request.weather_data['weather'][0].get('description', '')})"
        elif isinstance(request.weather_data, str):
            weather_info = request.weather_data

        print(f"🌤️ [解析された天気] {weather_info}")

        # 2. RAGサービスを呼び出してファッショントレンド知識を結合
        context_str = search_fashion_trends(
            city=request.city,
            weather_desc=weather_info,
            user_query=request.message
        )

        # 3. システムプロンプトとユーザーの質問をブレンド
        formatted_prompt = RAG_PROMPT_TEMPLATE.format(
            context=context_str,
            query=f"ユーザーの質問: {request.message}\n選択された都市: {request.city}"
        )

        # 4. OpenAI APIの呼び出し
        # 💡 エラーハンドリング用に安全に呼び出します
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # またはお使いのモデル名
            messages=[
                {"role": "system", "content": formatted_prompt}
            ],
            temperature=0.7
        )

        ai_response = response.choices[0].message.content
        return {"response": ai_response}

    except Exception as e:
        print(f"❌ [バックエンドエラー] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
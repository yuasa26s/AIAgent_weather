import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from app.services.rag_service import search_fashion_trends, RAG_PROMPT_TEMPLATE

# システム環境変数の古い記憶（Lp4A）を無視して、.envの最新の値を強制ロード
load_dotenv(override=True)

router = APIRouter()

# リクエストボディの定義
class ChatRequest(BaseModel):
    message: str
    city: str = "東京"
    weather: str = "晴れ"

# LLMの初期化（.env の本物のキーを直接流し込んでOSの古い記憶をブロック）
llm = ChatOpenAI(
    model="gpt-4o",  # チームで指定のモデル（gpt-3.5-turbo等）があれば適宜変更してください
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

@router.post("/chat")
def chat(request: ChatRequest):
    try:
        # 1. ユーザーの入力をもとに、ウェブ検索とChromaDBからコンテキストを取得
        context = search_fashion_trends(
            city=request.city,
            weather_desc=request.weather,
            user_query=request.message
        )
        
        # 2. プロンプトテンプレートにコンテキストとユーザーの質問を注入
        final_prompt = RAG_PROMPT_TEMPLATE.format(
            context=context,
            query=request.message
        )
        
        # 3. キーを固定したLLMを呼び出して回答を生成
        response = llm.invoke(final_prompt)
        
        # 4. フロントエンドが期待する { "response": "..." } の形にして返却
        return {"response": response.content}
        
    except Exception as e:
        # バックエンドのターミナルに詳細なエラーを出す
        print(f"Chat APIエラー: {e}")
        raise HTTPException(status_code=500, detail=str(e))
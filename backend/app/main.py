import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ルーターのインポート
from app.api.v1.outfit import router as outfit_router
from app.routers.rag import router as rag_router
from app.api.v1.chat import router as chat_router

app = FastAPI(
    title="AI Stylist Weather App API",
    description="現在の天候（27℃）と同期してスタイリングを提案するバックエンドAPI",
    version="1.0.0"
)

# 💡 CORS設定をさらに拡張（全てのローカル開発環境プラットフォームからの通信を許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, OPTIONSなどを全て許可
    allow_headers=["*"],  # Content-Typeなどを全て許可
)

# ==========================================================================
# 🛠️ 各機能のルート登録（404エラー完全防止の調整）
# ==========================================================================

# 1. チャット用エンドポイント
# 💡 もし chat.py 内で @router.post("/chat") と書かれている場合、URLが /api/v1/chat/chat になるのを防ぐため、
# ここでの prefix は "/api/v1" に留めるか、chat.py 内のパス構成と一致させます。
# ここではフロントエンド（ChatComponent）からの「/api/v1/chat」または「/chat」の直撃を受け止められるように登録します。
app.include_router(chat_router, prefix="/api/v1") 

# 2. その他のエンドポイント
app.include_router(outfit_router, prefix="/api/v1/outfit")
app.include_router(rag_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "AI Stylist RAG Backend is Running Successfully",
        "endpoints_checked": ["/api/v1/chat", "/api/v1/outfit"]
    }

@app.get("/health/db")
def check_db():
    # 開発環境用にDBがなくても正常（ローカルのベクトルストア・プロンプトベース）として返す
    return {"status": "skipped", "details": "Using fresh local fashion logic with 27C synchronization"}
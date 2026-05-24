import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# DB接続に依存しないようにコメントアウト
# from app.core.database import get_connection
from app.api.v1.outfit import router as outfit_router
from app.routers.rag import router as rag_router
from app.api.v1.chat import router as chat_router

app = FastAPI()

# CORS設定（Next.jsからの通信を許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", # 念のため数字バージョンも追加
        "http://localhost:3001"
        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 各機能のルートを登録
app.include_router(outfit_router, prefix="/api/v1/outfit")
app.include_router(chat_router, prefix="/api/v1/chat")
app.include_router(rag_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "RAG Backend is Running"}

@app.get("/health/db")
def check_db():
    # DBがなくても正常と返すように変更
    return {"status": "skipped", "details": "Using local vector store for RAG"}
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import get_connection
from app.api.v1.outfit import router as outfit_router
from app.routers.rag import router as rag_router
from app.api.v1.chat import router as chat_router


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 追加（ルーター登録）
app.include_router(outfit_router, prefix="/api/v1/outfit")
app.include_router(chat_router, prefix="/api/v1/chat")
app.include_router(rag_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "OK"}

@app.get("/health/db")
def check_db():
    try:
        conn = get_connection()
        conn.close()
        return {"status": "DB connected successfully"}
    except Exception as e:
        return {"error": str(e)}
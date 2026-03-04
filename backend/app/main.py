from fastapi import FastAPI
from app.core.database import get_connection
from app.api.v1.chat import router as chat_router

app = FastAPI()

app.include_router(chat_router, prefix="/api/v1")

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
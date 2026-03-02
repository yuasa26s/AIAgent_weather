from fastapi import FastAPI
from app.core.database import get_connection
from app.api.v1.outfit import router as outfit_router

app = FastAPI()

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


app.include_router(outfit_router, prefix="/api/v1")
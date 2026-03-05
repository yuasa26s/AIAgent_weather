from fastapi import APIRouter
from pydantic import BaseModel
from app.services.outfit_service import generate_outfit

router = APIRouter()

# リクエスト
class OutfitRequest(BaseModel):
    uuid: str # strは文字列
    latitude: float #小数ありの数字
    longitude: float
    date: str

# レスポンス
class OutfitResponse(BaseModel):
    temperature: float
    humidity: int # 整数
    weather: str
    wind_speed: float
    outfit_recommendation: str

@router.post("/outfit-recommendation",
    response_model=OutfitResponse)
def outfit_recommendation(data: OutfitRequest):
    return generate_outfit(data)
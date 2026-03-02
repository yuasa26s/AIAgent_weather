from fastapi import APIRouter
from pydantic import BaseModel
from app.services.outfit_service import generate_outfit

router = APIRouter()

class OutfitRequest(BaseModel):
    uuid: str
    latitude: float
    longitude: float
    date: str

@router.post("/outfit-recommendation")
def outfit_recommendation(data: OutfitRequest):
    result = generate_outfit(data)
    return result
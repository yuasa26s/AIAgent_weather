# backend/app/routers/rag.py
from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.config import get_settings
from app.services.weather_api import WeatherAPI
from app.services.search_api import SearchAPI
from app.services.context_builder import ContextBuilder
from app.usecases.build_rag_context import BuildRagContextUsecase, BuildRagContextInput

router = APIRouter(prefix="/rag", tags=["rag"])


@router.get("/context")
async def build_context(
    q: str = Query(..., description="ユーザーの質問"),
    city: str = Query("Fukuyama", description="天気取得する都市"),
    max_results: int = Query(5, ge=1, le=10),
):
    settings = get_settings()

    # 依存を組み立て（DIの最小版）
    weather_api = WeatherAPI(api_key=settings.openweather_api_key)
    search_api = SearchAPI(api_key=settings.tavily_api_key)
    context_builder = ContextBuilder()

    usecase = BuildRagContextUsecase(weather_api, search_api, context_builder)

    ctx = await usecase.execute(
        BuildRagContextInput(
            user_query=q,
            city=city,
            country_code="JP",
            max_results=max_results,
        )
    )

    return {
        "system_context": ctx.system_context,
        "user_context": ctx.user_context,
    }
# backend/app/usecases/build_rag_context.py
from __future__ import annotations

from dataclasses import dataclass

from app.services.weather_api import WeatherAPI, WeatherResult
from app.services.search_api import SearchAPI, SearchHit
from app.services.context_builder import ContextBuilder, BuiltContext


@dataclass
class BuildRagContextInput:
    user_query: str
    city: str
    country_code: str = "JP"
    max_results: int = 5


class BuildRagContextUsecase:
    def __init__(self, weather_api: WeatherAPI, search_api: SearchAPI, context_builder: ContextBuilder):
        self.weather_api = weather_api
        self.search_api = search_api
        self.context_builder = context_builder

    async def execute(self, inp: BuildRagContextInput) -> BuiltContext:
        # 外部I/Oはここにまとめる
        weather: WeatherResult = await self.weather_api.get_current_by_city(inp.city, country_code=inp.country_code)
        hits: list[SearchHit] = await self.search_api.search(inp.user_query, max_results=inp.max_results)

        # LLMに渡す文脈を整形
        ctx = self.context_builder.build(
            user_query=inp.user_query,
            weather=weather,
            hits=hits,
        )
        return ctx
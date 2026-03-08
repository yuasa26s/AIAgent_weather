# backend/app/services/context_builder.py
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .weather_api import WeatherResult
from .search_api import SearchHit


@dataclass
class BuiltContext:
    """
    LLMへ渡すためのコンテキスト本体。
    """
    system_context: str
    user_context: str


class ContextBuilder:
    """
    Combine weather + web search hits into a compact context.
    """

    def build(
        self,
        *,
        user_query: str,
        weather: Optional[WeatherResult] = None,
        hits: Optional[list[SearchHit]] = None,
    ) -> BuiltContext:
        hits = hits or []

        parts: list[str] = []

        # 1) Weather block
        if weather:
            parts.append(self._format_weather(weather))

        # 2) Search block
        if hits:
            parts.append(self._format_search_hits(hits))

        # 3) Guidance block (LLMの暴走を抑える)
        system_context = (
            "あなたは外部情報を含むコンテキストを使って回答するアシスタントです。"
            "与えられたコンテキストに根拠がある内容を優先し、断定できない場合は不確かだと述べてください。"
        )

        context_text = "\n\n".join(parts) if parts else "(コンテキストなし)"

        user_context = (
            f"ユーザーの質問:\n{user_query}\n\n"
            f"参考コンテキスト:\n{context_text}"
        )

        return BuiltContext(system_context=system_context, user_context=user_context)

    def _format_weather(self, w: WeatherResult) -> str:
        loc = f"{w.city}" + (f" ({w.country})" if w.country else "")
        return (
            "【天気情報】\n"
            f"- 場所: {loc}\n"
            f"- 天気: {w.weather_main} / {w.weather_description}\n"
            f"- 気温: {w.temp_c:.1f}℃ (体感 {w.feels_like_c:.1f}℃)\n"
            f"- 湿度: {w.humidity}%\n"
            f"- 風速: {w.wind_speed} m/s\n"
            f"- 座標: {w.lat}, {w.lon}\n"
            f"- 情報元: {w.source}"
        )

    def _format_search_hits(self, hits: list[SearchHit]) -> str:
        lines = ["【検索結果】"]
        for i, h in enumerate(hits, start=1):
            snippet = (h.snippet or "").strip().replace("\n", " ")
            if len(snippet) > 240:
                snippet = snippet[:240] + "…"
            lines.append(f"{i}. {h.title}\n   - {h.url}\n   - {snippet}\n   - source: {h.source}")
        return "\n".join(lines)
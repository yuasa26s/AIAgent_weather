# backend/app/core/config.py
from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    openweather_api_key: str
    tavily_api_key: str


def get_settings() -> Settings:
    ow = os.getenv("OPENWEATHER_API_KEY", "").strip()
    tv = os.getenv("TAVILY_API_KEY", "").strip()

    # ここで早期にエラーにしておくとデバッグが楽
    if not ow:
        raise RuntimeError("OPENWEATHER_API_KEY is not set.")
    if not tv:
        raise RuntimeError("TAVILY_API_KEY is not set.")

    return Settings(openweather_api_key=ow, tavily_api_key=tv)
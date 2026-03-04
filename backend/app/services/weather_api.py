# backend/app/services/weather_api.py
from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Optional

import httpx


@dataclass
class WeatherResult:
    city: str
    country: Optional[str]
    lat: float
    lon: float
    weather_main: str
    weather_description: str
    temp_c: float
    feels_like_c: float
    humidity: int
    wind_speed: float
    source: str = "openweathermap"


class WeatherAPIError(RuntimeError):
    pass


class WeatherAPI:
    """
    OpenWeatherMap Current Weather API wrapper.

    Env:
      - OPENWEATHER_API_KEY
      - OPENWEATHER_BASE_URL (optional) default: https://api.openweathermap.org
    """

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, timeout: float = 10.0):
        self.api_key = api_key or os.getenv("OPENWEATHER_API_KEY")
        if not self.api_key:
            raise WeatherAPIError("OPENWEATHER_API_KEY is not set.")
        self.base_url = (base_url or os.getenv("OPENWEATHER_BASE_URL") or "https://api.openweathermap.org").rstrip("/")
        self.timeout = timeout

    async def get_current_by_city(self, city: str, country_code: Optional[str] = None) -> WeatherResult:
        """
        city: "Tokyo" / "Fukuyama" etc.
        country_code: "JP" (optional) -> query like "Tokyo,JP"
        """
        q = f"{city},{country_code}" if country_code else city
        url = f"{self.base_url}/data/2.5/weather"
        params = {
            "q": q,
            "appid": self.api_key,
            "units": "metric",  # Celsius
            "lang": "ja",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            r = await client.get(url, params=params)
        if r.status_code != 200:
            raise WeatherAPIError(f"OpenWeather error: {r.status_code} {r.text}")

        data: dict[str, Any] = r.json()

        weather0 = (data.get("weather") or [{}])[0]
        main = data.get("main") or {}
        wind = data.get("wind") or {}
        coord = data.get("coord") or {}
        sys = data.get("sys") or {}

        return WeatherResult(
            city=str(data.get("name") or city),
            country=str(sys.get("country")) if sys.get("country") else None,
            lat=float(coord.get("lat") or 0.0),
            lon=float(coord.get("lon") or 0.0),
            weather_main=str(weather0.get("main") or ""),
            weather_description=str(weather0.get("description") or ""),
            temp_c=float(main.get("temp") or 0.0),
            feels_like_c=float(main.get("feels_like") or 0.0),
            humidity=int(main.get("humidity") or 0),
            wind_speed=float(wind.get("speed") or 0.0),
        )
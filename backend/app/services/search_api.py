# backend/app/services/search_api.py
from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Optional

import httpx


@dataclass
class SearchHit:
    title: str
    url: str
    snippet: str
    source: str = "tavily"


class SearchAPIError(RuntimeError):
    pass


class SearchAPI:
    """
    Simple web search wrapper (Tavily).

    Env:
      - TAVILY_API_KEY
      - TAVILY_BASE_URL (optional) default: https://api.tavily.com
    """

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, timeout: float = 15.0):
        self.api_key = api_key or os.getenv("TAVILY_API_KEY")
        if not self.api_key:
            raise SearchAPIError("TAVILY_API_KEY is not set.")
        self.base_url = (base_url or os.getenv("TAVILY_BASE_URL") or "https://api.tavily.com").rstrip("/")
        self.timeout = timeout

    async def search(self, query: str, max_results: int = 5) -> list[SearchHit]:
        """
        Returns compact hits for RAG context building.
        """
        url = f"{self.base_url}/search"
        payload = {
            "api_key": self.api_key,
            "query": query,
            "max_results": max_results,
            "search_depth": "basic",  # "advanced" も可
            "include_answer": False,
            "include_images": False,
            "include_raw_content": False,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            r = await client.post(url, json=payload)

        if r.status_code != 200:
            raise SearchAPIError(f"Tavily error: {r.status_code} {r.text}")

        data: dict[str, Any] = r.json()
        results = data.get("results") or []

        hits: list[SearchHit] = []
        for item in results[:max_results]:
            hits.append(
                SearchHit(
                    title=str(item.get("title") or ""),
                    url=str(item.get("url") or ""),
                    snippet=str(item.get("content") or item.get("snippet") or ""),
                    source="tavily",
                )
            )
        return hits
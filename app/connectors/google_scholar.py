import os
from typing import Any, Dict
from fastapi import HTTPException
from .base import BaseConnector


class GoogleScholarConnector(BaseConnector):
    provider = "google_scholar"

    async def authenticate(self) -> str:
        # Google Scholar scraping does not support OAuth
        return ""

    async def handle_callback(self, code: str) -> None:
        # No callback necessary
        pass

    async def sync_profile(self) -> Dict[str, Any]:
        # Placeholder using scholarly library if available
        try:
            from scholarly import scholarly
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"scholarly not available: {exc}")

        query = os.getenv("SCHOLAR_QUERY", "")
        if not query:
            raise HTTPException(status_code=400, detail="SCHOLAR_QUERY not set")

        search = scholarly.search_author(query)
        author = next(search, None)
        if not author:
            raise HTTPException(status_code=404, detail="Author not found")
        return scholarly.fill(author)

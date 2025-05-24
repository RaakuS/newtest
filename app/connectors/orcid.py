import os
from typing import Any, Dict
from fastapi import HTTPException
from .base import BaseConnector


class ORCIDConnector(BaseConnector):
    provider = "orcid"

    @property
    def client_id(self) -> str:
        return os.getenv("ORCID_CLIENT_ID", "")

    @property
    def client_secret(self) -> str:
        return os.getenv("ORCID_CLIENT_SECRET", "")

    @property
    def redirect_uri(self) -> str:
        return os.getenv("ORCID_REDIRECT_URI", "http://localhost:8000/callback/orcid")

    async def authenticate(self) -> str:
        params = {
            "client_id": self.client_id,
            "response_type": "code",
            "scope": "/authenticate",
            "redirect_uri": self.redirect_uri,
        }
        base = "https://orcid.org/oauth/authorize"
        query = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{base}?{query}"

    async def handle_callback(self, code: str) -> None:
        import httpx

        token_url = "https://orcid.org/oauth/token"
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to obtain token")
            self.token_store[self.provider] = resp.json()

    async def sync_profile(self) -> Dict[str, Any]:
        import httpx

        token = self.token_store.get(self.provider, {}).get("access_token")
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")

        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {token}"}
            resp = await client.get("https://pub.orcid.org/v3.0/expanded-search" , headers=headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch profile")
            return resp.json()

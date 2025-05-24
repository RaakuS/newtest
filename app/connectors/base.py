from typing import Any, Dict

class BaseConnector:
    """Base class for profile connectors."""

    provider: str

    def __init__(self, token_store: Dict[str, Any]):
        self.token_store = token_store

    async def authenticate(self) -> str:
        """Initiate authentication flow. Returns redirect URL."""
        raise NotImplementedError

    async def handle_callback(self, code: str) -> None:
        """Handle OAuth callback and store tokens."""
        raise NotImplementedError

    async def sync_profile(self) -> Dict[str, Any]:
        """Fetch latest profile data."""
        raise NotImplementedError

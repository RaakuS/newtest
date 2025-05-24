from typing import Dict
from .base import BaseConnector
from .orcid import ORCIDConnector
from .google_scholar import GoogleScholarConnector
from .researchgate import ResearchGateConnector

CONNECTOR_CLASSES = {
    ORCIDConnector.provider: ORCIDConnector,
    GoogleScholarConnector.provider: GoogleScholarConnector,
    ResearchGateConnector.provider: ResearchGateConnector,
}


def get_connector(provider: str, token_store: Dict) -> BaseConnector:
    cls = CONNECTOR_CLASSES.get(provider)
    if not cls:
        raise ValueError(f"Unknown provider {provider}")
    return cls(token_store)

import os
import json
from typing import Dict
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from mindsdb_sdk.mindsdb import MindsDB
from .connectors.adapter_registry import get_connector, CONNECTOR_CLASSES

app = FastAPI(title="Research Profile Aggregator")

TOKEN_STORE_PATH = "tokens.json"


def load_tokens() -> Dict:
    if os.path.exists(TOKEN_STORE_PATH):
        with open(TOKEN_STORE_PATH, "r") as f:
            return json.load(f)
    return {}


def save_tokens(tokens: Dict) -> None:
    with open(TOKEN_STORE_PATH, "w") as f:
        json.dump(tokens, f)


token_store = load_tokens()

mindsdb = MindsDB()

class QueryRequest(BaseModel):
    query: str


@app.get("/auth/{provider}")
async def auth_provider(provider: str):
    connector = get_connector(provider, token_store)
    redirect_url = await connector.authenticate()
    if not redirect_url:
        raise HTTPException(status_code=400, detail="Authentication not supported")
    return RedirectResponse(url=redirect_url)


@app.get("/callback/{provider}")
async def callback_provider(provider: str, request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")
    connector = get_connector(provider, token_store)
    await connector.handle_callback(code)
    save_tokens(token_store)
    return {"status": "connected", "provider": provider}


@app.post("/query")
async def query_mindsdb(req: QueryRequest):
    result = mindsdb.sql(req.query)
    return result


@app.post("/profiles/{provider}/sync")
async def sync_profile(provider: str):
    connector = get_connector(provider, token_store)
    data = await connector.sync_profile()
    return data


@app.get("/status")
async def status():
    return {
        "mindsdb_status": True,
        "active_connectors": list(token_store.keys()),
    }

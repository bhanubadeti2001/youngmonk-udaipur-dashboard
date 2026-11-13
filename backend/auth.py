import os
import secrets
import hashlib
import time
from typing import Optional
from fastapi import HTTPException, Security, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

# Master Client Access Key (can be rotated in environment)
DEFAULT_ACCESS_TOKEN = os.getenv("DASHBOARD_ACCESS_TOKEN", "udaipur-hostel-key-2026")

# In-memory active session store: session_token -> { "created_at": timestamp, "expires_at": timestamp }
ACTIVE_SESSIONS = {}
SESSION_TTL_SECONDS = 7 * 24 * 3600  # 7 days

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def create_session() -> str:
    token = generate_session_token()
    now = time.time()
    ACTIVE_SESSIONS[token] = {
        "created_at": now,
        "expires_at": now + SESSION_TTL_SECONDS
    }
    return token

def validate_session(token: str) -> bool:
    if not token or token not in ACTIVE_SESSIONS:
        return False
    session = ACTIVE_SESSIONS[token]
    if time.time() > session["expires_at"]:
        del ACTIVE_SESSIONS[token]
        return False
    return True

def revoke_session(token: str) -> bool:
    if token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
        return True
    return False

def verify_access_key(key: str) -> bool:
    if not key:
        return False
    valid_key = os.getenv("DASHBOARD_ACCESS_TOKEN", DEFAULT_ACCESS_TOKEN)
    return secrets.compare_digest(key.strip(), valid_key.strip())

async def require_auth(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> bool:
    # 1. Check Bearer Token in Authorization Header
    if credentials and credentials.credentials:
        token = credentials.credentials
        if validate_session(token) or verify_access_key(token):
            return True

    # 2. Check HttpOnly Cookie
    cookie_token = request.cookies.get("udaipur_session")
    if cookie_token and validate_session(cookie_token):
        return True

    # 3. Check Query parameter token for direct link access
    param_token = request.query_params.get("token")
    if param_token and (verify_access_key(param_token) or validate_session(param_token)):
        return True

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized access. Please provide a valid protected dashboard link."
    )

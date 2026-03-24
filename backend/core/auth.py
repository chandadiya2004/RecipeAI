from __future__ import annotations

import base64
from dataclasses import dataclass
from threading import Lock
from typing import Any

import jwt
from fastapi import Header, HTTPException
from jwt import PyJWKClient

from core.config import settings

_jwks_clients: dict[str, PyJWKClient] = {}
_jwks_lock = Lock()


@dataclass
class AuthenticatedUser:
    user_id: str
    session_id: str | None = None
    email: str | None = None


def _get_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")

    return token


def _build_jwks_url(unverified_claims: dict[str, Any]) -> str:
    if settings.CLERK_JWKS_URL:
        return settings.CLERK_JWKS_URL

    issuer = unverified_claims.get("iss")
    if not issuer:
        raise HTTPException(status_code=401, detail="Token is missing issuer claim")

    return f"{issuer.rstrip('/')}/.well-known/jwks.json"


def _url_from_publishable_key() -> str | None:
    publishable_key = settings.CLERK_PUBLISHABLE_KEY
    if not publishable_key:
        return None

    if not (publishable_key.startswith("pk_test_") or publishable_key.startswith("pk_live_")):
        return None

    try:
        encoded_host = publishable_key.split("_", 2)[2]
        padding = "=" * (-len(encoded_host) % 4)
        decoded = base64.urlsafe_b64decode((encoded_host + padding).encode("utf-8")).decode("utf-8")
        host = decoded[:-1] if decoded.endswith("$") else decoded
        host = host.strip()
        if not host:
            return None
        if host.startswith("http://") or host.startswith("https://"):
            return host.rstrip("/")
        return f"https://{host.rstrip('/')}"
    except Exception:
        return None


def _jwks_url_candidates(unverified_claims: dict[str, Any]) -> list[str]:
    candidates: list[str] = []

    if settings.CLERK_JWKS_URL:
        candidates.append(settings.CLERK_JWKS_URL.rstrip("/"))

    issuer = unverified_claims.get("iss")
    if isinstance(issuer, str) and issuer.strip():
        candidates.append(f"{issuer.rstrip('/')}/.well-known/jwks.json")

    if settings.CLERK_FRONTEND_API_URL:
        candidates.append(f"{settings.CLERK_FRONTEND_API_URL.rstrip('/')}/.well-known/jwks.json")

    publishable_base = _url_from_publishable_key()
    if publishable_base:
        candidates.append(f"{publishable_base.rstrip('/')}/.well-known/jwks.json")

    unique_candidates: list[str] = []
    for candidate in candidates:
        normalized = candidate.strip()
        if normalized and normalized not in unique_candidates:
            unique_candidates.append(normalized)

    return unique_candidates


def _get_jwks_client(jwks_url: str) -> PyJWKClient:
    with _jwks_lock:
        existing = _jwks_clients.get(jwks_url)
        if existing:
            return existing

        client = PyJWKClient(jwks_url)
        _jwks_clients[jwks_url] = client
        return client


def verify_clerk_token(token: str) -> AuthenticatedUser:
    try:
        unverified_claims = jwt.decode(
            token,
            options={"verify_signature": False, "verify_exp": False, "verify_aud": False},
        )
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    try:
        unverified_header = jwt.get_unverified_header(token)
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid token header") from exc

    token_algorithm = unverified_header.get("alg")
    if not token_algorithm:
        raise HTTPException(status_code=401, detail="Token is missing algorithm header")

    decode_options = {"verify_aud": bool(settings.CLERK_JWT_AUDIENCE)}
    issuer = unverified_claims.get("iss")

    if token_algorithm.startswith("HS"):
        if not settings.CLERK_SECRET_KEY:
            raise HTTPException(status_code=401, detail="CLERK_SECRET_KEY is required for symmetric token verification")

        try:
            decoded = jwt.decode(
                token,
                settings.CLERK_SECRET_KEY,
                algorithms=[token_algorithm],
                issuer=issuer,
                audience=settings.CLERK_JWT_AUDIENCE,
                options=decode_options,
            )
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Token verification failed") from exc
    else:
        jwks_candidates = _jwks_url_candidates(unverified_claims)
        signing_key = None
        last_error: Exception | None = None

        for jwks_url in jwks_candidates:
            try:
                signing_key = _get_jwks_client(jwks_url).get_signing_key_from_jwt(token).key
                break
            except Exception as exc:
                last_error = exc
                continue

        if signing_key is None:
            raise HTTPException(
                status_code=401,
                detail="Unable to resolve token signing key. Configure CLERK_JWKS_URL or CLERK_FRONTEND_API_URL for your Clerk instance.",
            ) from last_error

        try:
            decoded = jwt.decode(
                token,
                signing_key,
                algorithms=[token_algorithm],
                issuer=issuer,
                audience=settings.CLERK_JWT_AUDIENCE,
                options=decode_options,
            )
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Token verification failed") from exc

    user_id = decoded.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is missing subject claim")

    return AuthenticatedUser(
        user_id=user_id,
        session_id=decoded.get("sid"),
        email=decoded.get("email"),
    )


def get_authenticated_user(authorization: str | None = Header(default=None)) -> AuthenticatedUser:
    token = _get_bearer_token(authorization)
    return verify_clerk_token(token)

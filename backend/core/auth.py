from __future__ import annotations

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
        jwks_url = _build_jwks_url(unverified_claims)

        try:
            signing_key = _get_jwks_client(jwks_url).get_signing_key_from_jwt(token).key
        except Exception as exc:
            raise HTTPException(
                status_code=401,
                detail="Unable to resolve token signing key. Configure CLERK_JWKS_URL for your Clerk instance.",
            ) from exc

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

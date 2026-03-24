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


def _get_jwks_client(jwks_url: str) -> PyJWKClient:
    with _jwks_lock:
        existing = _jwks_clients.get(jwks_url)
        if existing:
            return existing

        client = PyJWKClient(jwks_url)
        _jwks_clients[jwks_url] = client
        return client


def _clerk_jwks_candidates(unverified_claims: dict[str, Any]) -> list[str]:
    candidates: list[str] = []

    if settings.CLERK_JWKS_URL:
        candidates.append(settings.CLERK_JWKS_URL.rstrip("/"))

    if settings.CLERK_FRONTEND_API:
        candidates.append(f"{settings.CLERK_FRONTEND_API.rstrip('/')}/.well-known/jwks.json")

    if settings.CLERK_ISSUER:
        candidates.append(f"{settings.CLERK_ISSUER.rstrip('/')}/.well-known/jwks.json")

    issuer = unverified_claims.get("iss")
    if isinstance(issuer, str) and issuer.strip():
        candidates.append(f"{issuer.rstrip('/')}/.well-known/jwks.json")

    unique_candidates: list[str] = []
    for candidate in candidates:
        normalized = candidate.strip()
        if normalized and normalized not in unique_candidates:
            unique_candidates.append(normalized)

    return unique_candidates


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

    decode_options = {"verify_aud": bool(settings.CLERK_AUDIENCE)}

    issuer = settings.CLERK_ISSUER or unverified_claims.get("iss")
    if not issuer:
        raise HTTPException(status_code=401, detail="Unable to determine token issuer")

    if token_algorithm.startswith("HS"):
        if not settings.CLERK_SECRET_KEY:
            raise HTTPException(
                status_code=401,
                detail="CLERK_SECRET_KEY is required for symmetric token verification",
            )

        try:
            decoded = jwt.decode(
                token,
                settings.CLERK_SECRET_KEY,
                algorithms=[token_algorithm],
                issuer=issuer,
                audience=settings.CLERK_AUDIENCE,
                options=decode_options,
            )
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Token verification failed") from exc
    else:
        jwks_candidates = _clerk_jwks_candidates(unverified_claims)
        if not jwks_candidates:
            raise HTTPException(
                status_code=401,
                detail="No JWKS URL candidates available. Set CLERK_JWKS_URL or CLERK_FRONTEND_API.",
            )

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
            tried = ", ".join(jwks_candidates)
            raise HTTPException(
                status_code=401,
                detail=(
                    "Unable to resolve Clerk token signing key. "
                    f"alg={token_algorithm}. Tried JWKS: {tried}. "
                    "Configure CLERK_JWKS_URL or CLERK_FRONTEND_API and ensure frontend token comes from this Clerk instance."
                ),
            ) from last_error

        try:
            decoded = jwt.decode(
                token,
                signing_key,
                algorithms=[token_algorithm],
                issuer=issuer,
                audience=settings.CLERK_AUDIENCE,
                options=decode_options,
            )
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Token verification failed") from exc

    user_id = decoded.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is missing subject claim")

    return AuthenticatedUser(
        user_id=user_id,
        session_id=decoded.get("sid") or decoded.get("session_id"),
        email=decoded.get("email"),
    )


def get_authenticated_user(authorization: str | None = Header(default=None)) -> AuthenticatedUser:
    token = _get_bearer_token(authorization)
    return verify_clerk_token(token)

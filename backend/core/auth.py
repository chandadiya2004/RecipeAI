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


def _supabase_jwks_candidates(unverified_claims: dict[str, Any]) -> list[str]:
    candidates: list[str] = []

    if settings.SUPABASE_JWKS_URL:
        candidates.append(settings.SUPABASE_JWKS_URL.rstrip("/"))

    if settings.SUPABASE_URL:
        candidates.append(f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json")

    issuer = unverified_claims.get("iss")
    if isinstance(issuer, str) and issuer.strip():
        candidates.append(f"{issuer.rstrip('/')}/.well-known/jwks.json")

    unique_candidates: list[str] = []
    for candidate in candidates:
        normalized = candidate.strip()
        if normalized and normalized not in unique_candidates:
            unique_candidates.append(normalized)

    return unique_candidates


def verify_supabase_token(token: str) -> AuthenticatedUser:
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

    decode_options = {"verify_aud": bool(settings.SUPABASE_JWT_AUDIENCE)}
    issuer = unverified_claims.get("iss")

    if token_algorithm.startswith("HS"):
        if not settings.SUPABASE_JWT_SECRET:
            raise HTTPException(
                status_code=401,
                detail="SUPABASE_JWT_SECRET is required for symmetric token verification",
            )

        try:
            decoded = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=[token_algorithm],
                issuer=issuer,
                audience=settings.SUPABASE_JWT_AUDIENCE,
                options=decode_options,
            )
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Token verification failed") from exc
    else:
        jwks_candidates = _supabase_jwks_candidates(unverified_claims)
        if not jwks_candidates:
            raise HTTPException(
                status_code=401,
                detail="No JWKS URL candidates available. Set SUPABASE_URL or SUPABASE_JWKS_URL.",
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
                    "Unable to resolve Supabase token signing key. "
                    f"alg={token_algorithm}. Tried JWKS: {tried}. "
                    "Configure SUPABASE_JWKS_URL or SUPABASE_URL and ensure frontend token comes from this Supabase project."
                ),
            ) from last_error

        try:
            decoded = jwt.decode(
                token,
                signing_key,
                algorithms=[token_algorithm],
                issuer=issuer,
                audience=settings.SUPABASE_JWT_AUDIENCE,
                options=decode_options,
            )
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Token verification failed") from exc

    user_id = decoded.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is missing subject claim")

    return AuthenticatedUser(
        user_id=user_id,
        session_id=decoded.get("session_id") or decoded.get("sid"),
        email=decoded.get("email"),
    )


def get_authenticated_user(authorization: str | None = Header(default=None)) -> AuthenticatedUser:
    token = _get_bearer_token(authorization)
    return verify_supabase_token(token)

from __future__ import annotations

from dataclasses import dataclass
import json
from threading import Lock
from typing import Any
from urllib.request import urlopen

import jwt
from fastapi import Header, HTTPException
from jwt import PyJWKClient
from jwt.exceptions import MissingCryptographyError

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


def _fetch_jwks_keys(jwks_url: str) -> list[dict[str, Any]]:
    with urlopen(jwks_url, timeout=5) as response:
        payload = json.loads(response.read().decode("utf-8"))

    keys = payload.get("keys")
    if not isinstance(keys, list):
        raise ValueError("JWKS response did not include a valid 'keys' array")

    return [key for key in keys if isinstance(key, dict)]


def _resolve_signing_key(jwks_url: str, token: str, token_algorithm: str) -> Any:
    try:
        return _get_jwks_client(jwks_url).get_signing_key_from_jwt(token).key
    except MissingCryptographyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Missing 'cryptography' dependency required for ES256 Supabase token verification.",
        ) from exc
    except Exception:
        pass

    unverified_header = jwt.get_unverified_header(token)
    token_kid = unverified_header.get("kid")

    keys = _fetch_jwks_keys(jwks_url)

    matching_keys = [
        key
        for key in keys
        if (not token_kid or key.get("kid") == token_kid)
        and key.get("alg", token_algorithm) == token_algorithm
    ]
    if not matching_keys:
        matching_keys = [
            key for key in keys if (not token_kid or key.get("kid") == token_kid)
        ]

    for key_dict in matching_keys:
        try:
            signing_key = jwt.PyJWK.from_dict(key_dict).key
            jwt.decode(
                token,
                signing_key,
                algorithms=[token_algorithm],
                options={
                    "verify_signature": True,
                    "verify_exp": False,
                    "verify_iat": False,
                    "verify_nbf": False,
                    "verify_iss": False,
                    "verify_aud": False,
                },
            )
            return signing_key
        except MissingCryptographyError as exc:
            raise HTTPException(
                status_code=500,
                detail="Missing 'cryptography' dependency required for ES256 Supabase token verification.",
            ) from exc
        except jwt.InvalidTokenError:
            continue
        except Exception:
            continue

    raise ValueError("No matching signing key found in JWKS")


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
                signing_key = _resolve_signing_key(jwks_url, token, token_algorithm)
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
                    "Configure SUPABASE_JWKS_URL or SUPABASE_URL and ensure frontend token comes from this Supabase project/ref."
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

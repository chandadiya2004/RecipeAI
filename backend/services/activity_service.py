from __future__ import annotations

import logging
import importlib
from typing import Any

try:
    psycopg = importlib.import_module("psycopg")
    Json = importlib.import_module("psycopg.types.json").Json
except ModuleNotFoundError:
    psycopg = None
    Json = None

from core.config import settings

logger = logging.getLogger(__name__)

CREATE_ACTIVITY_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS user_activity_history (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status TEXT NOT NULL,
    request_payload JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"""

CREATE_ACTIVITY_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_user_activity_history_user_id_created_at
ON user_activity_history (user_id, created_at DESC);
"""


def _connect() -> Any | None:
    if psycopg is None:
        return None

    if not settings.SUPABASE_DB_URL:
        return None

    return psycopg.connect(settings.SUPABASE_DB_URL, autocommit=True)


def initialize_activity_store() -> None:
    try:
        if psycopg is None:
            logger.warning("psycopg is not installed; Supabase activity logging is disabled")
            return

        connection = _connect()
        if connection is None:
            logger.info("SUPABASE_DB_URL not configured; activity logging is disabled")
            return

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(CREATE_ACTIVITY_TABLE_SQL)
                cursor.execute(CREATE_ACTIVITY_INDEX_SQL)
    except Exception as exc:
        logger.warning("Unable to initialize Supabase activity store: %s", exc)


def log_user_activity(
    *,
    user_id: str,
    activity_type: str,
    endpoint: str,
    status: str,
    request_payload: dict[str, Any] | None = None,
    error_message: str | None = None,
) -> None:
    try:
        if psycopg is None or Json is None:
            return

        connection = _connect()
        if connection is None:
            return

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO user_activity_history
                        (user_id, activity_type, endpoint, status, request_payload, error_message)
                    VALUES
                        (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user_id,
                        activity_type,
                        endpoint,
                        status,
                        Json(request_payload) if request_payload is not None else None,
                        error_message,
                    ),
                )
    except Exception as exc:
        logger.warning("Unable to write activity log: %s", exc)


def get_user_activity_history(*, user_id: str, limit: int = 50) -> list[dict[str, Any]]:
    try:
        if psycopg is None:
            return []

        connection = _connect()
        if connection is None:
            return []

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, activity_type, endpoint, status, request_payload, error_message, created_at
                    FROM user_activity_history
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    LIMIT %s
                    """,
                    (user_id, limit),
                )
                rows = cursor.fetchall()

        history: list[dict[str, Any]] = []
        for row in rows:
            history.append(
                {
                    "id": row[0],
                    "activity_type": row[1],
                    "endpoint": row[2],
                    "status": row[3],
                    "request_payload": row[4],
                    "error_message": row[5],
                    "created_at": row[6].isoformat() if row[6] else "",
                }
            )
        return history
    except Exception as exc:
        logger.warning("Unable to fetch activity history: %s", exc)
        return []


def clear_user_activity_history(*, user_id: str) -> int:
    try:
        if psycopg is None:
            return 0

        connection = _connect()
        if connection is None:
            return 0

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM user_activity_history
                    WHERE user_id = %s
                    RETURNING id
                    """,
                    (user_id,),
                )
                rows = cursor.fetchall()

        return len(rows)
    except Exception as exc:
        logger.warning("Unable to clear activity history: %s", exc)
        return 0

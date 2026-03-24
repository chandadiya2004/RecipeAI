from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    GROQ_API_KEY: str
    CLERK_SECRET_KEY: str | None = None
    CLERK_PUBLISHABLE_KEY: str | None = None
    CLERK_FRONTEND_API_URL: str | None = None
    CLERK_JWKS_URL: str | None = None
    CLERK_JWT_AUDIENCE: str | None = None
    SUPABASE_DB_URL: str | None = None
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

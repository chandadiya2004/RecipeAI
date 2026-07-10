from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
from services.activity_service import initialize_activity_store
from core.config import settings

app = FastAPI(title="Recipe Maker AI Backend")

# Allow origins from backend/.env (comma-separated); fallback to local frontend origins.
allowed_origins_env = (settings.ALLOWED_ORIGINS or "").strip()

if allowed_origins_env:
    origins = [
        origin.strip().strip('"').strip("'")
        for origin in allowed_origins_env.split(",")
        if origin.strip().strip('"').strip("'")
    ]
else:
    origins = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    initialize_activity_store()

@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Welcome to Recipe Maker AI Backend!"}

@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "healthy"}

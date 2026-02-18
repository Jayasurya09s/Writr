import os
from fastapi import FastAPI
from routes import posts, ai, auth, comments, users
from fastapi.middleware.cors import CORSMiddleware
from config import ALLOWED_ORIGINS

app = FastAPI(title="Smart Blog Editor API", version="1.0.0")

# Production-aware CORS configuration
allowed_origins = [origin.strip() for origin in ALLOWED_ORIGINS.split(",") if origin.strip()]
if not allowed_origins:
    allowed_origins = ["*"]

allow_credentials = "*" not in allowed_origins
if not allow_credentials:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Writr API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(ai.router)
app.include_router(comments.router)
app.include_router(users.router)

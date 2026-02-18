import os
from fastapi import FastAPI
from routes import posts, ai, auth, comments, users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Blog Editor API", version="1.0.0")

# Production-aware CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
if "*" not in allowed_origins:
    allowed_origins = [origin.strip() for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "SyncDraft AI API",
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

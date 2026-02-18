from fastapi import FastAPI
from routes import posts, ai, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Blog Editor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)
app.include_router(ai.router)
app.include_router(auth.router)

from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL
import sys

if not MONGO_URL:
    print("ERROR: MONGO_URL environment variable not set!", file=sys.stderr)
    raise ValueError("MONGO_URL is required but not set in environment")

try:
    client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    db = client.smart_blog_db
    print("MongoDB connection initialized", file=sys.stderr)
except Exception as e:
    print(f"ERROR: Failed to connect to MongoDB: {e}", file=sys.stderr)
    raise

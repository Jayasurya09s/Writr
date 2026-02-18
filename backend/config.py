import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

from jose import jwt
from config import JWT_SECRET
from datetime import datetime, timedelta

ALGO = "HS256"

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=24)
    data.update({"exp": expire})
    return jwt.encode(data, JWT_SECRET, algorithm=ALGO)

def verify_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[ALGO])

from jose import jwt, JWTError
from config import JWT_SECRET
from datetime import datetime, timedelta
from fastapi import HTTPException

ALGO = "HS256"

def create_access_token(data: dict, hours: int = 24):
    expire = datetime.utcnow() + timedelta(hours=hours)
    payload = {**data, "exp": expire, "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGO)

def create_refresh_token(data: dict, days: int = 7):
    expire = datetime.utcnow() + timedelta(days=days)
    payload = {**data, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGO)

def verify_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[ALGO])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

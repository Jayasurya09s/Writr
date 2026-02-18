from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from db.connection import db
from utils.jwt_handler import verify_token

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")

    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {"id": user.get("id"), "name": user.get("name", ""), "email": user.get("email")}

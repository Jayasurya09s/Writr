from fastapi import APIRouter, HTTPException
from db.connection import db
import bcrypt
from utils.jwt_handler import create_access_token, create_refresh_token, verify_token
from schemas.user_schema import UserCreate, UserLogin
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
async def signup(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    # Hash password with bcrypt
    password_bytes = user.password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "name": user.full_name,
        "email": user.email,
        "password": hashed_password.decode('utf-8')
    }

    await db.users.insert_one(new_user)

    access_token = create_access_token({"userId": user_id})
    refresh_token = create_refresh_token({"userId": user_id})

    return {
        "user": {"id": user_id, "full_name": user.full_name, "email": user.email},
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password with bcrypt
    password_bytes = user.password.encode('utf-8')
    stored_password = db_user["password"].encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, stored_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"userId": db_user["id"]})
    refresh_token = create_refresh_token({"userId": db_user["id"]})

    return {
        "user": {"id": db_user["id"], "full_name": db_user.get("name", ""), "email": db_user["email"]},
        "access_token": access_token,
        "refresh_token": refresh_token
    }


@router.post("/refresh")
async def refresh_token(payload: dict):
    token = payload.get("refresh_token")
    if not token:
        raise HTTPException(status_code=400, detail="Missing refresh token")

    decoded = verify_token(token)
    user_id = decoded.get("userId")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token({"userId": user_id})
    refresh_token = create_refresh_token({"userId": user_id})
    return {"access_token": access_token, "refresh_token": refresh_token}

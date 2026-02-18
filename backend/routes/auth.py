from fastapi import APIRouter, HTTPException
from db.connection import db
from passlib.context import CryptContext
from utils.jwt_handler import create_token
import uuid

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"])

@router.post("/signup")
async def signup(user: dict):
    user["id"] = str(uuid.uuid4())
    user["password"] = pwd.hash(user["password"])

    await db.users.insert_one(user)
    return {"msg": "User created"}

@router.post("/login")
async def login(user: dict):
    db_user = await db.users.find_one({"email": user["email"]})

    if not db_user or not pwd.verify(user["password"], db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"userId": db_user["id"]})
    return {"token": token}

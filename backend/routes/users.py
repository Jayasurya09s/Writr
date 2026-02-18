from fastapi import APIRouter, Depends, HTTPException
from db.connection import db
from utils.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None


# 🟢 GET USER PROFILE
@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["id"]})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.get("id"),
        "full_name": user.get("name", ""),
        "email": user.get("email"),
        "bio": user.get("bio", ""),
        "avatar": user.get("avatar", "")
    }


# 🟢 UPDATE USER PROFILE
@router.patch("/profile")
async def update_profile(profile: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {}
    
    if profile.full_name is not None:
        update_data["name"] = profile.full_name
    
    if profile.bio is not None:
        update_data["bio"] = profile.bio
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": current_user["id"]})
    
    return {
        "id": updated_user.get("id"),
        "full_name": updated_user.get("name", ""),
        "email": updated_user.get("email"),
        "bio": updated_user.get("bio", ""),
        "avatar": updated_user.get("avatar", ""),
        "message": "Profile updated successfully"
    }

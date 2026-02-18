from fastapi import APIRouter
from db.connection import db
from schemas.post_schema import PostCreate, PostUpdate
from datetime import datetime
import uuid

router = APIRouter()


# 🟢 CREATE NEW DRAFT
@router.post("/api/posts/")
async def create_post(post: PostCreate):
    post_id = str(uuid.uuid4())

    new_post = {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "status": "draft",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    await db.posts.insert_one(new_post)

    # IMPORTANT: don't return Mongo _id
    return {
        "id": post_id,
        "title": post.title,
        "status": "draft",
        "message": "Draft created successfully"
    }


# 🟢 AUTO SAVE UPDATE (debounce will hit this)
@router.patch("/api/posts/{id}")
async def update_post(id: str, post: PostUpdate):
    await db.posts.update_one(
        {"id": id},
        {
            "$set": {
                "content": post.content,
                "updatedAt": datetime.utcnow()
            }
        }
    )

    return {"message": "Auto-saved successfully"}


# 🟢 PUBLISH BLOG
@router.post("/api/posts/{id}/publish")
async def publish_post(id: str):
    await db.posts.update_one(
        {"id": id},
        {"$set": {"status": "published"}}
    )

    return {"message": "Post published successfully"}


# 🟢 GET ALL DRAFTS (for sidebar list)
@router.get("/api/posts/")
async def get_all_posts():
    posts = []
    cursor = db.posts.find()

    async for post in cursor:
        posts.append({
            "id": post.get("id"),
            "title": post.get("title"),
            "status": post.get("status"),
            "updatedAt": post.get("updatedAt")
        })

    return posts


# 🟢 GET SINGLE POST (load into editor)
@router.get("/api/posts/{id}")
async def get_single_post(id: str):
    post = await db.posts.find_one({"id": id})

    if not post:
        return {"error": "Post not found"}

    return {
        "id": post.get("id"),
        "title": post.get("title"),
        "content": post.get("content"),
        "status": post.get("status")
    }

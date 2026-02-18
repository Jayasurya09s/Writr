from fastapi import APIRouter, Depends
from db.connection import db
from schemas.post_schema import PostCreate, PostUpdate
from datetime import datetime
import uuid
from utils.auth import get_current_user

router = APIRouter(prefix="/api", tags=["posts"])


# 🟢 CREATE NEW DRAFT
@router.post("/posts/")
async def create_post(post: PostCreate, current_user: dict = Depends(get_current_user)):
    post_id = str(uuid.uuid4())

    new_post = {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "authorId": current_user["id"],
        "status": "draft",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "publishedAt": None
    }

    await db.posts.insert_one(new_post)

    # IMPORTANT: don't return Mongo _id
    return {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "authorId": new_post["authorId"],
        "status": "draft",
        "createdAt": new_post["createdAt"],
        "updatedAt": new_post["updatedAt"],
        "publishedAt": new_post["publishedAt"],
        "message": "Draft created successfully"
    }


# 🟢 AUTO SAVE UPDATE (debounce will hit this)
@router.patch("/posts/{id}")
async def update_post(id: str, post: PostUpdate, current_user: dict = Depends(get_current_user)):
    updates = {
        "content": post.content,
        "updatedAt": datetime.utcnow()
    }

    if post.title is not None:
        updates["title"] = post.title

    result = await db.posts.update_one(
        {"id": id, "authorId": current_user["id"]},
        {"$set": updates}
    )

    if result.matched_count == 0:
        return {"error": "Post not found"}

    updated = await db.posts.find_one({"id": id, "authorId": current_user["id"]})

    return {
        "id": updated.get("id"),
        "title": updated.get("title"),
        "content": updated.get("content"),
        "authorId": updated.get("authorId"),
        "status": updated.get("status"),
        "createdAt": updated.get("createdAt"),
        "updatedAt": updated.get("updatedAt"),
        "publishedAt": updated.get("publishedAt")
    }


# 🟢 PUBLISH BLOG
@router.post("/posts/{id}/publish")
async def publish_post(id: str, current_user: dict = Depends(get_current_user)):
    result = await db.posts.update_one(
        {"id": id, "authorId": current_user["id"]},
        {"$set": {"status": "published", "updatedAt": datetime.utcnow(), "publishedAt": datetime.utcnow()}}
    )

    if result.matched_count == 0:
        return {"error": "Post not found"}

    return {"message": "Post published successfully"}


# 🟢 UNPUBLISH BLOG
@router.post("/posts/{id}/unpublish")
async def unpublish_post(id: str, current_user: dict = Depends(get_current_user)):
    result = await db.posts.update_one(
        {"id": id, "authorId": current_user["id"]},
        {"$set": {"status": "draft", "updatedAt": datetime.utcnow()}}
    )

    if result.matched_count == 0:
        return {"error": "Post not found"}

    return {"message": "Post unpublished successfully"}


# 🟢 DELETE POST
@router.delete("/posts/{id}")
async def delete_post(id: str, current_user: dict = Depends(get_current_user)):
    result = await db.posts.delete_one({"id": id, "authorId": current_user["id"]})

    if result.deleted_count == 0:
        return {"error": "Post not found"}

    return {"message": "Post deleted successfully"}


# 🟢 GET ALL DRAFTS (for sidebar list)
@router.get("/posts/")
async def get_all_posts(current_user: dict = Depends(get_current_user)):
    posts = []
    cursor = db.posts.find({"authorId": current_user["id"]})

    async for post in cursor:
        posts.append({
            "id": post.get("id"),
            "title": post.get("title"),
            "authorId": post.get("authorId"),
            "status": post.get("status"),
            "updatedAt": post.get("updatedAt"),
            "publishedAt": post.get("publishedAt")
        })

    return posts


# 🟢 GET SINGLE POST (load into editor)
@router.get("/posts/{id}")
async def get_single_post(id: str, current_user: dict = Depends(get_current_user)):
    post = await db.posts.find_one({"id": id, "authorId": current_user["id"]})

    if not post:
        return {"error": "Post not found"}

    return {
        "id": post.get("id"),
        "title": post.get("title"),
        "content": post.get("content"),
        "authorId": post.get("authorId"),
        "status": post.get("status"),
        "createdAt": post.get("createdAt"),
        "updatedAt": post.get("updatedAt"),
        "publishedAt": post.get("publishedAt")
    }


# 🟢 PUBLIC: GET ALL PUBLISHED POSTS
@router.get("/public/posts")
async def get_published_posts():
    posts = []
    cursor = db.posts.find({"status": "published"}).sort("publishedAt", -1)

    async for post in cursor:
        author = await db.users.find_one({"id": post.get("authorId")})
        posts.append({
            "id": post.get("id"),
            "title": post.get("title"),
            "content": post.get("content"),
            "authorId": post.get("authorId"),
            "author": {
                "id": post.get("authorId"),
                "full_name": author.get("name", "") if author else "",
            } if author else None,
            "status": post.get("status"),
            "createdAt": post.get("createdAt"),
            "updatedAt": post.get("updatedAt"),
            "publishedAt": post.get("publishedAt")
        })

    return posts


# 🟢 PUBLIC: GET ONE PUBLISHED POST
@router.get("/public/posts/{id}")
async def get_public_post(id: str):
    post = await db.posts.find_one({"id": id, "status": "published"})

    if not post:
        return {"error": "Post not found"}

    author = await db.users.find_one({"id": post.get("authorId")})

    return {
        "id": post.get("id"),
        "title": post.get("title"),
        "content": post.get("content"),
        "authorId": post.get("authorId"),
        "author": {
            "id": post.get("authorId"),
            "full_name": author.get("name", "") if author else "",
        } if author else None,
        "status": post.get("status"),
        "createdAt": post.get("createdAt"),
        "updatedAt": post.get("updatedAt"),
        "publishedAt": post.get("publishedAt")
    }

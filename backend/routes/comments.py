from fastapi import APIRouter, Depends, HTTPException
from db.connection import db
from schemas.comment_schema import CommentCreate
from datetime import datetime
import uuid
from utils.auth import get_current_user

router = APIRouter(prefix="/api", tags=["comments"])


# 🟢 CREATE COMMENT (authenticated)
@router.post("/posts/{post_id}/comments")
async def create_comment(post_id: str, payload: CommentCreate, current_user: dict = Depends(get_current_user)):
    post = await db.posts.find_one({"id": post_id, "status": "published"})
    if not post:
        return {"error": "Post not found"}

    comment_id = str(uuid.uuid4())
    new_comment = {
        "id": comment_id,
        "postId": post_id,
        "authorId": current_user["id"],
        "body": payload.body,
        "createdAt": datetime.utcnow()
    }

    await db.comments.insert_one(new_comment)

    return {
        "id": comment_id,
        "postId": post_id,
        "authorId": current_user["id"],
        "authorName": current_user.get("name", ""),
        "body": payload.body,
        "createdAt": new_comment["createdAt"]
    }


# 🟢 GET COMMENTS FOR PUBLISHED POST (public)
@router.get("/public/posts/{post_id}/comments")
async def get_comments(post_id: str):
    comments = []
    cursor = db.comments.find({"postId": post_id}).sort("createdAt", -1)

    async for comment in cursor:
        user = await db.users.find_one({"id": comment.get("authorId")})
        comments.append({
            "id": comment.get("id"),
            "postId": comment.get("postId"),
            "authorId": comment.get("authorId"),
            "authorName": user.get("name", "") if user else "",
            "body": comment.get("body"),
            "createdAt": comment.get("createdAt")
        })

    return comments


# 🟢 DELETE COMMENT (authenticated - author only)
@router.delete("/posts/{post_id}/comments/{comment_id}")
async def delete_comment(post_id: str, comment_id: str, current_user: dict = Depends(get_current_user)):
    comment = await db.comments.find_one({"id": comment_id, "postId": post_id})
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Only comment author can delete their comment
    if comment.get("authorId") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    result = await db.comments.delete_one({"id": comment_id, "postId": post_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment deleted successfully"}

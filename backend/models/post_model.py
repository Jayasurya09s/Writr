from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class Post(BaseModel):
    title: str
    content: Dict  # Lexical JSON
    status: str = "draft"
    createdAt: datetime = datetime.utcnow()
    updatedAt: datetime = datetime.utcnow()
    userId: str

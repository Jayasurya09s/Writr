from pydantic import BaseModel
from typing import Any, Optional

class PostCreate(BaseModel):
    title: str
    content: Any

class PostUpdate(BaseModel):
    content: Any
    title: Optional[str] = None

from pydantic import BaseModel
from typing import Dict

class PostCreate(BaseModel):
    title: str
    content: Dict

class PostUpdate(BaseModel):
    content: Dict

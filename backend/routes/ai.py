from fastapi import APIRouter
from utils.ai_client import generate_summary

router = APIRouter()

@router.post("/api/ai/generate")
async def ai_generate(data: dict):
    text = data.get("text", "")
    result = await generate_summary(text)
    return {"result": result}

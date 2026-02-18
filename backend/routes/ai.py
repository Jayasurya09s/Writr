from fastapi import APIRouter, HTTPException
from utils.ai_client import generate_summary, fix_grammar
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["ai"])

class AIRequest(BaseModel):
    text: str
    mode: str  # "summary" or "grammar"

@router.post("/ai/generate")
async def ai_generate(request: AIRequest):
    """
    Generate AI content based on mode:
    - summary: Create a professional summary of the text
    - grammar: Fix grammar and improve clarity
    """
    
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if request.mode not in ["summary", "grammar"]:
        raise HTTPException(status_code=400, detail="Mode must be 'summary' or 'grammar'")
    
    try:
        if request.mode == "summary":
            result = await generate_summary(request.text)
        else:  # grammar
            result = await fix_grammar(request.text)
        
        return {"result": result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

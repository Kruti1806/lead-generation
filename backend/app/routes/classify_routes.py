from fastapi import APIRouter
from pydantic import BaseModel
from ..services.llm_service import llm_service

router = APIRouter()

class ClassifyRequest(BaseModel):
    message: str

class ClassifyResponse(BaseModel):
    classification: str
    suggested_reply: str

@router.post("/classify", response_model=ClassifyResponse)
def classify_message(request: ClassifyRequest):
    result = llm_service.classify_and_reply(request.message)
    return result

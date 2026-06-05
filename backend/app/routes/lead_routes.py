from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from ..database.database import get_db
from ..models.lead import Lead
from ..services.llm_service import llm_service

router = APIRouter()

class LeadBase(BaseModel):
    name: str
    email: str
    phone: str
    message: str
    source: str

class LeadDisplay(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    message: str
    source: str
    classification: str
    suggested_reply: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/lead", response_model=dict)
def create_lead(lead_in: LeadBase, db: Session = Depends(get_db)):
    # Check if lead already exists to prevent duplicates (same email and message)
    existing_lead = db.query(Lead).filter(
        Lead.email == lead_in.email,
        Lead.message == lead_in.message
    ).first()
    
    if existing_lead:
        return {"message": "Lead already exists", "id": existing_lead.id}

    # 1. Classification & Reply Generation via LLM
    result = llm_service.classify_and_reply(lead_in.message)
    
    # 2. Store in Database
    db_lead = Lead(
        name=lead_in.name,
        email=lead_in.email,
        phone=lead_in.phone,
        message=lead_in.message,
        source=lead_in.source,
        classification=result.get("classification", "Cold"),
        suggested_reply=result.get("suggested_reply", ""),
        status="Pending"
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    return {"message": "Lead Stored Successfully", "id": db_lead.id}

@router.get("/leads", response_model=List[LeadDisplay])
def get_leads(db: Session = Depends(get_db)):
    return db.query(Lead).all()

@router.put("/lead/{lead_id}/contacted")
def mark_as_contacted(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead.status = "Contacted"
    db.commit()
    return {"message": "Lead Updated"}

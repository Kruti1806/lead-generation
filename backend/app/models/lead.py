from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from ..database.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    source = Column(String)
    message = Column(Text)
    classification = Column(String) # Hot, Warm, Cold
    suggested_reply = Column(Text)
    status = Column(String, default="Pending") # Pending, Contacted
    created_at = Column(DateTime, default=datetime.utcnow)

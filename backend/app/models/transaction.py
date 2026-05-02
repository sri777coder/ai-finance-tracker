from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    date        = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    amount      = Column(Float, nullable=False)
    category    = Column(String)
    is_anomaly  = Column(Boolean, default=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
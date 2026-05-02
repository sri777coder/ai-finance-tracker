from pydantic import BaseModel
from datetime import date
from typing import Optional

class TransactionOut(BaseModel):
    id: int
    date: date
    description: str
    amount: float
    category: Optional[str]
    is_anomaly: bool
    class Config:
        from_attributes = True
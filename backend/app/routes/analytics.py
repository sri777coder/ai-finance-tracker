from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.services.ml_service import forecast_next_month
from app.routes.upload import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary")
def get_summary(db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    txns = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    if not txns:
        return {"message": "No transactions yet"}

    total_spent   = sum(t.amount for t in txns)
    anomaly_count = sum(1 for t in txns if t.is_anomaly)

    cat_totals = defaultdict(float)
    for t in txns:
        cat_totals[t.category] += t.amount
    top_category = max(cat_totals, key=cat_totals.get)

    monthly = defaultdict(float)
    for t in txns:
        key = f"{t.date.year}-{t.date.month:02d}"
        monthly[key] += t.amount

    monthly_values = [monthly[k] for k in sorted(monthly.keys())]
    forecast = forecast_next_month(monthly_values)

    return {
        "total_spent":         round(total_spent, 2),
        "avg_monthly":         round(sum(monthly_values)/len(monthly_values), 2),
        "top_category":        top_category,
        "anomaly_count":       anomaly_count,
        "forecast_next_month": round(forecast, 2),
        "category_breakdown":  dict(cat_totals),
        "monthly_trend":       monthly
    }

@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    return db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.date.desc()).limit(50).all()

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    return db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_anomaly == True
    ).all()
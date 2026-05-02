from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.services.ml_service import classify_transaction, detect_anomaly
from app.core.security import decode_token
from fastapi.security import OAuth2PasswordBearer
import pandas as pd
import io

router = APIRouter(prefix="/upload", tags=["upload"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return db.query(User).filter(User.id == int(payload["sub"])).first()

@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")))

    # Validate columns
    if not {"date", "description", "amount"}.issubset(df.columns):
        raise HTTPException(status_code=400,
            detail="CSV must have: date, description, amount columns")

    # ── Clear old transactions for this user ──────────────
    # So old 2023 data doesn't mix with new upload
    db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).delete()
    db.commit()

    df['date'] = pd.to_datetime(df['date'])

    # Use absolute amounts (handles negative expense values)
    df['amount'] = df['amount'].abs()

    # Calculate category means for anomaly detection
    category_means = df.groupby(
        df['description'].str.upper())['amount'].mean().to_dict()

    saved = 0
    for _, row in df.iterrows():
        amount   = float(row['amount'])
        category = classify_transaction(row['description'])

        cat_mean    = category_means.get(row['description'].upper(), amount)
        amt_vs_mean = (amount - cat_mean) / (cat_mean + 1)

        is_anomaly = detect_anomaly(
            amount=amount,
            category_encoded=0,
            month=row['date'].month,
            day_of_week=row['date'].dayofweek,
            amount_vs_mean=amt_vs_mean
        )

        db.add(Transaction(
            user_id=current_user.id,
            date=row['date'].date(),
            description=row['description'],
            amount=amount,
            category=category,
            is_anomaly=is_anomaly
        ))
        saved += 1

    db.commit()
    return {"message": f"✅ Uploaded {saved} transactions", "count": saved}
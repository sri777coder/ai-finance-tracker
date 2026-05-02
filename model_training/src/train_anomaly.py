import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH  = os.path.join(BASE_DIR, "data", "processed_transactions.csv")
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("=" * 50)
print("🧠 TRAINING MODEL 3: Anomaly Detector")
print("=" * 50)

df = pd.read_csv(DATA_PATH)
df['date'] = pd.to_datetime(df['date'])

features = pd.DataFrame({
    'amount':           df['amount'],
    'category_encoded': df['category_encoded'],
    'month':            df['month'],
    'day_of_week':      df['day_of_week'],
    'amount_vs_category_mean': df.groupby('category')['amount'].transform(
        lambda x: (x - x.mean()) / (x.std() + 1)
    ).fillna(0)
})

scaler   = StandardScaler()
X_scaled = scaler.fit_transform(features)

# contamination=0.02 means only flag TOP 2% most unusual
# Previously 0.05 was flagging too many
model = IsolationForest(
    contamination=0.02,
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

print("\n⏳ Training...")
model.fit(X_scaled)

predictions   = model.predict(X_scaled)
anomaly_count = (predictions == -1).sum()
print(f"✅ Anomaly rate: {anomaly_count/len(predictions)*100:.1f}% ({anomaly_count} flagged)")

joblib.dump(model,  os.path.join(MODELS_DIR, "anomaly_detector.pkl"))
joblib.dump(scaler, os.path.join(MODELS_DIR, "anomaly_scaler.pkl"))
print("✅ Saved anomaly_detector.pkl + anomaly_scaler.pkl")
print("🎉 Model 3 done!")
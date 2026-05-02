# preprocess.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import re
import os
import pickle

# ── Fix paths ──────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH     = os.path.join(BASE_DIR, "data", "transactions.csv")
SAVE_DATA     = os.path.join(BASE_DIR, "data", "processed_transactions.csv")
SAVE_SPLIT    = os.path.join(BASE_DIR, "data", "train_test_split.pkl")
SAVE_ENCODER  = os.path.join(BASE_DIR, "saved_models", "label_encoder.pkl")

os.makedirs(os.path.join(BASE_DIR, "saved_models"), exist_ok=True)

# ── Load ───────────────────────────────────────────────
df = pd.read_csv(DATA_PATH)
print(f"✅ Loaded {len(df)} rows")

# ── Clean Text ─────────────────────────────────────────
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'#\d+', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    return text.strip()

df['clean_description'] = df['description'].apply(clean_text)
print("✅ Cleaned text descriptions")

# ── Date Features ──────────────────────────────────────
df['date'] = pd.to_datetime(df['date'])
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek
df['year_month'] = df['date'].dt.to_period('M').astype(str)
print("✅ Extracted date features")

# ── Encode Categories ──────────────────────────────────
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])
joblib.dump(le, SAVE_ENCODER)
print(f"✅ Encoded categories: {list(le.classes_)}")

# ── Split ──────────────────────────────────────────────
X = df['clean_description']
y = df['category_encoded']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n✅ Split complete:")
print(f"   Training: {len(X_train)} samples")
print(f"   Testing:  {len(X_test)} samples")

# ── Save ───────────────────────────────────────────────
df.to_csv(SAVE_DATA, index=False)

with open(SAVE_SPLIT, "wb") as f:
    pickle.dump((X_train, X_test, y_train, y_test), f)

print(f"\n✅ Saved processed data")
print(f"✅ Saved train/test split")
print("\n🎉 Preprocessing complete! Ready to train models.")
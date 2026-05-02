# train_classifier.py
# MODEL 1: Transaction Category Classifier
# Input:  "zomato order"  → Output: "Food & Dining"

import pickle
import joblib
import os
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# ── Fix paths ──────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPLIT_PATH   = os.path.join(BASE_DIR, "data", "train_test_split.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "saved_models", "label_encoder.pkl")
SAVE_PATH    = os.path.join(BASE_DIR, "saved_models", "classifier.pkl")

# ── Load Data ──────────────────────────────────────────
with open(SPLIT_PATH, "rb") as f:
    X_train, X_test, y_train, y_test = pickle.load(f)

le = joblib.load(ENCODER_PATH)
print(f"✅ Loaded {len(X_train)} training samples")

# ── Build Model Pipeline ───────────────────────────────
model = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        min_df=2
    )),
    ('clf', RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ))
])

# ── Train ──────────────────────────────────────────────
print("\n⏳ Training... (30-60 seconds)")
model.fit(X_train, y_train)
print("✅ Training complete!")

# ── Evaluate ───────────────────────────────────────────
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n🎯 Accuracy: {accuracy * 100:.2f}%")
print("\n📊 Detailed Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# ── Manual Tests ───────────────────────────────────────
print("\n🧪 Manual Tests:")
tests = [
    "zomato order",
    "uber trip",
    "amazon purchase",
    "netflix subscription",
    "electricity bill",
    "pharmacy medicine"
]

for desc in tests:
    pred = le.inverse_transform(model.predict([desc]))[0]
    print(f"   '{desc}' → {pred}")

# ── Save ───────────────────────────────────────────────
joblib.dump(model, SAVE_PATH)
print(f"\n✅ Model saved to saved_models/classifier.pkl")
print(f"🎉 Model 1 complete! Accuracy: {accuracy * 100:.2f}%")
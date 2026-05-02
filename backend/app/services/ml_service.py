import joblib
import torch
import torch.nn as nn
import numpy as np
import json
import os
import re

# ── Path to saved models ──────────────────────────────
MODELS_DIR = os.path.join(
    os.path.dirname(__file__),
    "..", "..", "..",
    "model_training", "saved_models"
)
MODELS_DIR = os.path.abspath(MODELS_DIR)

print(f"⏳ Loading models from: {MODELS_DIR}")

classifier     = joblib.load(os.path.join(MODELS_DIR, "classifier.pkl"))
label_encoder  = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
anomaly_model  = joblib.load(os.path.join(MODELS_DIR, "anomaly_detector.pkl"))
anomaly_scaler = joblib.load(os.path.join(MODELS_DIR, "anomaly_scaler.pkl"))

with open(os.path.join(MODELS_DIR, "forecaster_norm.json")) as f:
    norm_params = json.load(f)

with open(os.path.join(MODELS_DIR, "forecaster_config.json")) as f:
    model_config = json.load(f)

class SpendingLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers,
                            batch_first=True, dropout=dropout)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        return self.fc(self.dropout(out[:, -1, :]))

forecaster = SpendingLSTM()
forecaster.load_state_dict(torch.load(
    os.path.join(MODELS_DIR, "forecaster.pt"),
    map_location=torch.device("cpu")
))
forecaster.eval()
print("✅ All ML models loaded!")

def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r'#\d+', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    return text.strip()

def classify_transaction(description: str) -> str:
    cleaned = clean_text(description)
    pred_num = classifier.predict([cleaned])[0]
    return label_encoder.inverse_transform([pred_num])[0]

def detect_anomaly(amount, category_encoded, month, day_of_week, amount_vs_mean) -> bool:
    features = np.array([[amount, category_encoded, month, day_of_week, amount_vs_mean]])
    scaled = anomaly_scaler.transform(features)
    return anomaly_model.predict(scaled)[0] == -1

def forecast_next_month(monthly_totals: list) -> float:
    look_back = model_config["look_back"]
    data_min  = norm_params["min"]
    data_max  = norm_params["max"]
    if len(monthly_totals) < look_back:
        return float(np.mean(monthly_totals))
    recent = monthly_totals[-look_back:]
    normalized = [(x - data_min) / (data_max - data_min) for x in recent]
    tensor = torch.FloatTensor(normalized).unsqueeze(0).unsqueeze(-1)
    with torch.no_grad():
        pred_norm = forecaster(tensor).item()
    return pred_norm * (data_max - data_min) + data_min
# train_forecaster.py
# MODEL 2: Spending Forecaster (LSTM Neural Network)
# Input:  Last 3 months spending
# Output: Next month prediction

import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import joblib
import json
import os

# ── Fix paths ──────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH   = os.path.join(BASE_DIR, "data", "processed_transactions.csv")
MODELS_DIR  = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("=" * 50)
print("🧠 TRAINING MODEL 2: Spending Forecaster (LSTM)")
print("=" * 50)

# ── Prepare Monthly Data ───────────────────────────────
df = pd.read_csv(DATA_PATH)
df['date'] = pd.to_datetime(df['date'])

monthly = df.groupby(df['date'].dt.to_period('M'))['amount'].sum()
monthly = monthly.sort_index()
values = monthly.values.astype(float)

print(f"✅ {len(values)} months of spending data")
print(f"   Min:  ₹{values.min():,.0f}")
print(f"   Max:  ₹{values.max():,.0f}")
print(f"   Mean: ₹{values.mean():,.0f}")

# ── Normalize ──────────────────────────────────────────
# Scale values to 0-1 range for neural network
data_min = values.min()
data_max = values.max()
normalized = (values - data_min) / (data_max - data_min)

# Save normalization params — needed later for predictions
norm_params = {"min": float(data_min), "max": float(data_max)}
with open(os.path.join(MODELS_DIR, "forecaster_norm.json"), "w") as f:
    json.dump(norm_params, f)
print("✅ Saved normalization params")

# ── Create Sequences ───────────────────────────────────
# LOOK_BACK=3 means: use 3 months to predict 1 month
# Example: [Jan, Feb, Mar] → predict Apr
LOOK_BACK = 3

def create_sequences(data, look_back):
    X, y = [], []
    for i in range(len(data) - look_back):
        X.append(data[i:i + look_back])
        y.append(data[i + look_back])
    return np.array(X), np.array(y)

X, y = create_sequences(normalized, LOOK_BACK)
print(f"✅ Created {len(X)} training sequences")

# Convert to PyTorch tensors
X_tensor = torch.FloatTensor(X).unsqueeze(-1)
y_tensor = torch.FloatTensor(y).unsqueeze(-1)

# ── Define LSTM Neural Network ─────────────────────────
class SpendingLSTM(nn.Module):
    """
    Your custom LSTM neural network
    Input  → LSTM (64 units) → Dropout → Linear → Output
    """
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, dropout=0.2):
        super(SpendingLSTM, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_output = lstm_out[:, -1, :]
        out = self.dropout(last_output)
        return self.fc(out)

# ── Train ──────────────────────────────────────────────
model = SpendingLSTM()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

EPOCHS = 100
print("\n⏳ Training LSTM neural network...")

for epoch in range(EPOCHS):
    model.train()
    optimizer.zero_grad()
    output = model(X_tensor)
    loss = criterion(output, y_tensor)
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 20 == 0:
        print(f"   Epoch {epoch+1}/{EPOCHS} | Loss: {loss.item():.6f}")

print("✅ Training complete!")

# ── Test Prediction ────────────────────────────────────
model.eval()
with torch.no_grad():
    last_seq = torch.FloatTensor(normalized[-LOOK_BACK:]).unsqueeze(0).unsqueeze(-1)
    pred_norm = model(last_seq).item()

# Denormalize back to rupees
pred_amount = pred_norm * (data_max - data_min) + data_min
actual_last = values[-1]

print(f"\n🔮 Forecast Test:")
print(f"   Last month actual:    ₹{actual_last:,.0f}")
print(f"   Next month predicted: ₹{pred_amount:,.0f}")

# ── Save ───────────────────────────────────────────────
torch.save(model.state_dict(), os.path.join(MODELS_DIR, "forecaster.pt"))

model_config = {
    "input_size": 1,
    "hidden_size": 64,
    "num_layers": 2,
    "dropout": 0.2,
    "look_back": LOOK_BACK
}
with open(os.path.join(MODELS_DIR, "forecaster_config.json"), "w") as f:
    json.dump(model_config, f)

print(f"\n✅ Model saved to saved_models/forecaster.pt")
print("🎉 Model 2 complete!")
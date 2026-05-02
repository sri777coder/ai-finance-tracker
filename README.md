# 💰 FinanceAI — AI-Powered Expense Tracker

A full-stack web application that uses custom trained machine learning models to analyze your financial transactions.

## 🧠 Custom ML Models (Trained from Scratch)

- **Transaction Classifier** — TF-IDF + Random Forest that categorizes transactions into 8 categories
- **Spending Forecaster** — Custom LSTM neural network (PyTorch) that predicts next month's spending
- **Anomaly Detector** — Isolation Forest model that flags unusual transactions automatically

## 🛠️ Tech Stack

**Backend:** FastAPI · SQLAlchemy · SQLite · JWT Auth  
**Frontend:** React · Vite · Tailwind CSS · Recharts  
**ML/AI:** scikit-learn · PyTorch · Pandas · NumPy  

## ✨ Features

- Upload any bank CSV and get instant AI insights
- Auto-categorize transactions using NLP classifier
- Predict future spending with LSTM neural network
- Detect anomalous transactions automatically
- Beautiful analytics dashboard with charts
- Secure JWT authentication

## 🚀 Run Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📊 CSV Format

```csv
date,description,amount
2024-01-15,ZOMATO ORDER,450.00
2024-01-16,UBER RIDE,230.00
```

## 👨‍💻 Built By

Sri Lakshmi R — [GitHub](https://github.com/sri777coder)

# explore_data.py
# WHAT THIS DOES:
# - Loads the CSV
# - Shows shape, columns, sample rows
# - Shows category distribution & amount statistics
# - Saves 3 charts as PNG files

import pandas as pd
import matplotlib.pyplot as plt
import os

# ── Fix paths ──────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "transactions.csv")
CHARTS_DIR = os.path.join(BASE_DIR, "src", "charts")
os.makedirs(CHARTS_DIR, exist_ok=True)

# ── Load Data ──────────────────────────────────────────
df = pd.read_csv(DATA_PATH)

print("=" * 50)
print("📊 DATASET OVERVIEW")
print("=" * 50)
print(f"\n📐 Shape: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"\n📋 Columns:\n{df.dtypes}")
print(f"\n👀 Sample rows:\n{df.head()}")
print(f"\n❌ Missing values:\n{df.isnull().sum()}")
print(f"\n📊 Transactions per category:\n{df['category'].value_counts()}")
print(f"\n💰 Amount statistics:\n{df.groupby('category')['amount'].describe()}")

# ── Chart 1: Category distribution ────────────────────
plt.figure(figsize=(10, 5))
df['category'].value_counts().plot(kind='bar', color='steelblue')
plt.title('Transactions by Category')
plt.xlabel('Category')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, 'category_distribution.png'))
print("\n✅ Saved: category_distribution.png")

# ── Chart 2: Average amount per category ──────────────
plt.figure(figsize=(10, 5))
df.groupby('category')['amount'].mean().plot(kind='bar', color='coral')
plt.title('Average Transaction Amount by Category')
plt.ylabel('Average Amount (₹)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, 'avg_amount.png'))
print("✅ Saved: avg_amount.png")

# ── Chart 3: Monthly spending trend ───────────────────
df['date'] = pd.to_datetime(df['date'])
df['month'] = df['date'].dt.to_period('M')
monthly = df.groupby('month')['amount'].sum()

plt.figure(figsize=(12, 5))
monthly.plot(kind='line', marker='o', color='green')
plt.title('Monthly Total Spending')
plt.ylabel('Total Amount (₹)')
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, 'monthly_trend.png'))
print("✅ Saved: monthly_trend.png")

plt.close('all')
print(f"\n✅ All charts saved to: {CHARTS_DIR}")
print("\n🎉 Exploration complete! Ready for preprocessing.")
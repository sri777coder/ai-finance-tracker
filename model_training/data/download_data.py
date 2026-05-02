import pandas as pd
import numpy as np
import random
import os
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
SAVE_PATH = os.path.join(BASE_DIR, "transactions.csv")

categories = {
    "Food & Dining": [
        "ZOMATO ORDER", "SWIGGY DELIVERY", "RESTAURANT DINNER",
        "RESTAURANT LUNCH", "COFFEE SHOP", "CAFE VISIT",
        "DOMINOS PIZZA", "KFC ORDER", "MCDONALDS", "SUBWAY",
        "FOOD DELIVERY", "BAKERY", "JUICE BAR", "TEA STALL",
        "VALENTINE DINNER", "BIRTHDAY DINNER", "HOTEL RESTAURANT"
    ],
    "Transport": [
        "OLA RIDE", "UBER RIDE", "UBER TRIP", "RAPIDO BIKE",
        "PETROL", "FUEL", "PETROL PUMP", "DIESEL",
        "METRO RECHARGE", "BUS PASS", "AUTO RICKSHAW",
        "FLIGHT TICKETS", "IRCTC TICKET", "CAB SERVICE", "PARKING FEE"
    ],
    "Shopping": [
        "AMAZON PURCHASE", "AMAZON ORDER", "FLIPKART PURCHASE",
        "CLOTHING PURCHASE", "CLOTHING STORE", "MYNTRA FASHION",
        "BOOK PURCHASE", "ELECTRONICS STORE", "DECATHLON",
        "FURNITURE STORE", "IKEA", "MEESHO ORDER", "AJIO",
        "SUPERMARKET", "ONLINE SHOPPING", "NYKAA", "LIFESTYLE STORE"
    ],
    "Bills & Utilities": [
        "ELECTRICITY BILL", "INTERNET BILL", "MOBILE RECHARGE",
        "HOUSE RENT", "RENT PAYMENT", "INSURANCE PREMIUM",
        "WATER BILL", "GAS BILL", "DTH RECHARGE", "EMI PAYMENT",
        "MAINTENANCE FEE", "BROADBAND BILL", "PROPERTY TAX",
        "HOME LOAN EMI", "CAR LOAN EMI"
    ],
    "Entertainment": [
        "NETFLIX SUBSCRIPTION", "SPOTIFY SUBSCRIPTION",
        "AMAZON PRIME", "HOTSTAR PREMIUM", "YOUTUBE PREMIUM",
        "MOVIE TICKET", "BOOKMYSHOW", "GAMING PURCHASE",
        "DISNEY PLUS", "APPLE MUSIC", "ZEE5", "CONCERT TICKET",
        "AMUSEMENT PARK", "SPORTS EVENT"
    ],
    "Health": [
        "MEDICAL EXPENSE", "PHARMACY BILL", "DOCTOR CONSULTATION",
        "GYM MEMBERSHIP", "LAB TEST", "HOSPITAL BILL",
        "YOGA CLASS", "MEDICINE ORDER", "DENTAL CLINIC",
        "HEALTH INSURANCE", "EYE CLINIC", "PHYSIOTHERAPY"
    ],
    "Income": [
        "SALARY CREDIT", "FREELANCE PAYMENT", "BONUS CREDIT",
        "DIVIDEND INCOME", "ONLINE TRANSFER RECEIVED",
        "INTEREST CREDIT", "REFUND CREDIT", "CASHBACK",
        "RENTAL INCOME", "COMMISSION CREDIT", "INCENTIVE CREDIT"
    ],
    "Finance & ATM": [
        "ATM WITHDRAWAL", "CASH WITHDRAWAL", "BANK TRANSFER",
        "MUTUAL FUND", "STOCK PURCHASE", "FD DEPOSIT",
        "RD INSTALLMENT", "PPF DEPOSIT", "NPS CONTRIBUTION",
        "CREDIT CARD PAYMENT", "LOAN PAYMENT"
    ]
}

amount_ranges = {
    "Food & Dining":    (50,  2500),
    "Transport":        (30,  15000),
    "Shopping":         (200, 10000),
    "Bills & Utilities":(100, 20000),
    "Entertainment":    (99,  2000),
    "Health":           (100, 5000),
    "Income":           (5000, 100000),
    "Finance & ATM":    (500, 50000),
}

rows = []
start_date = datetime(2024, 1, 1)

for i in range(3000):
    category    = random.choice(list(categories.keys()))
    description = random.choice(categories[category])
    min_amt, max_amt = amount_ranges[category]
    amount = round(random.uniform(min_amt, max_amt), 2)
    date   = start_date + timedelta(days=random.randint(0, 540))
    rows.append({
        "date": date.strftime("%Y-%m-%d"),
        "description": description,
        "amount": amount,
        "category": category
    })

df = pd.DataFrame(rows).sort_values("date").reset_index(drop=True)
df.to_csv(SAVE_PATH, index=False)

print(f"✅ Created {len(df)} transactions")
print(f"📊 Categories:\n{df['category'].value_counts()}")
print(f"✅ Saved to {SAVE_PATH}")
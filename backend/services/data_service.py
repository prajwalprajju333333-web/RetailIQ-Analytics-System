import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from models.database import Transaction, SessionLocal
from models.models import DatasetSummary, TransactionModel
import io

def process_uploaded_file(file_content: bytes) -> DatasetSummary:
    # Read CSV
    df = pd.read_csv(io.BytesIO(file_content))
    
    # Clean data
    df.dropna(inplace=True)
    df.drop_duplicates(inplace=True)
    
    # Validate dates
    df['transaction_date'] = pd.to_datetime(df['transaction_date'], errors='coerce')
    df.dropna(subset=['transaction_date'], inplace=True)
    
    # Store in DB
    db = SessionLocal()
    try:
        # Clear old transactions and add new ones
        db.query(Transaction).delete()
        db.commit()
        
        for _, row in df.iterrows():
            transaction = Transaction(
                customer_id=row['customer_id'],
                invoice_id=row['invoice_id'],
                product_name=row['product_name'],
                quantity=int(row['quantity']),
                unit_price=float(row['unit_price']),
                total_amount=float(row['total_amount']),
                transaction_date=row['transaction_date'],
                country=row['country']
            )
            db.add(transaction)
        db.commit()
    finally:
        db.close()
    
    # Summary
    summary = DatasetSummary(
        total_transactions=len(df),
        total_customers=df['customer_id'].nunique(),
        total_countries=df['country'].nunique(),
        date_range=f"{df['transaction_date'].min()} to {df['transaction_date'].max()}"
    )
    return summary
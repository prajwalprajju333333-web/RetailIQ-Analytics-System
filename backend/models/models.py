from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TransactionModel(BaseModel):
    customer_id: str
    invoice_id: str
    product_name: str
    quantity: int
    unit_price: float
    total_amount: float
    transaction_date: datetime
    country: str

class DatasetSummary(BaseModel):
    total_transactions: int
    total_customers: int
    total_countries: int
    date_range: str

class RFMModel(BaseModel):
    customer_id: str
    recency: float
    frequency: float
    monetary: float

class ClusterInsight(BaseModel):
    cluster: int
    avg_recency: float
    avg_frequency: float
    avg_monetary: float
    customer_count: int

class RecommendationModel(BaseModel):
    cluster: int
    strategy: str

class CountryAnalysis(BaseModel):
    country: str
    total_spending: float
    avg_frequency: float
    customer_count: int
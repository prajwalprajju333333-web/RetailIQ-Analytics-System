from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = "sqlite:///./retail_iq.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    invoice_id = Column(String, index=True)
    product_name = Column(String)
    quantity = Column(Integer)
    unit_price = Column(Float)
    total_amount = Column(Float)
    transaction_date = Column(DateTime)
    country = Column(String)

class RFMData(Base):
    __tablename__ = "rfm_data"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    recency = Column(Float)
    frequency = Column(Float)
    monetary = Column(Float)

class ClusterResult(Base):
    __tablename__ = "cluster_results"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    cluster = Column(Integer)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    cluster = Column(Integer)
    strategy = Column(String)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
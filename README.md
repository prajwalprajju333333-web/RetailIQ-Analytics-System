# RetailIQ Analytics System

A full-stack web application for customer segmentation and marketing optimization using transaction data.

## Features

- Data upload and processing
- RFM analysis
- K-Means clustering for customer segmentation
- Marketing recommendation engine
- Multinational analysis
- Interactive visualizations

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: React + Vite + Tailwind CSS
- Database: SQLite
- ML: scikit-learn, pandas, numpy
- Charts: Recharts

## Setup Instructions

1. Clone the repository
2. Backend setup:
   - cd backend
   - pip install -r requirements.txt
   - python main.py
3. Frontend setup:
   - cd frontend
   - npm install
   - npm run dev
4. Generate synthetic data:
   - python utils/synthetic_data_generator.py

## API Endpoints

- POST /upload: Upload CSV data
- GET /rfm: Get RFM data
- GET /clusters: Get cluster insights
- GET /recommendations: Get marketing strategies
- GET /country-analysis: Get country-wise analysis

## Sample CSV Format

customer_id,invoice_id,product_name,quantity,unit_price,total_amount,transaction_date,country
CUST0001,INV123456,Laptop,1,999.99,999.99,2023-01-01 10:00:00,USA
...

## Methodology

### RFM Analysis
- Recency: Days since last purchase
- Frequency: Number of purchases
- Monetary: Total spending

### Clustering
K-Means algorithm with optimal cluster selection.

### Recommendations
Tailored strategies based on cluster profiles.
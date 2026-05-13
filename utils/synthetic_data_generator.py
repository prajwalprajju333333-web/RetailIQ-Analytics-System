import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_synthetic_data(num_customers=1000, num_transactions=5000):
    customers = [f'CUST{i:04d}' for i in range(1, num_customers + 1)]
    countries = ['USA', 'UK', 'Germany', 'France', 'Canada', 'Australia']
    products = ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Mouse', 'Keyboard']
    
    data = []
    for _ in range(num_transactions):
        customer = random.choice(customers)
        invoice = f'INV{random.randint(100000, 999999)}'
        product = random.choice(products)
        quantity = random.randint(1, 5)
        unit_price = round(random.uniform(10, 1000), 2)
        total_amount = quantity * unit_price
        transaction_date = datetime.now() - timedelta(days=random.randint(0, 365))
        country = random.choice(countries)
        
        data.append({
            'customer_id': customer,
            'invoice_id': invoice,
            'product_name': product,
            'quantity': quantity,
            'unit_price': unit_price,
            'total_amount': total_amount,
            'transaction_date': transaction_date.strftime('%Y-%m-%d %H:%M:%S'),
            'country': country
        })
    
    df = pd.DataFrame(data)
    df.to_csv('../data/synthetic_retail_data.csv', index=False)
    print("Synthetic dataset generated: data/synthetic_retail_data.csv")

if __name__ == "__main__":
    generate_synthetic_data()
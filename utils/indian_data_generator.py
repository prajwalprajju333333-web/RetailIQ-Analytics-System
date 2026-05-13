import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_indian_data(filename, num_customers=1000, num_transactions=5000, region="India"):
    customers = [f'CUST{i:04d}' for i in range(1, num_customers + 1)]
    indian_cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat']
    indian_products = {
        'Electronics': ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Smartwatch', 'TV', 'Refrigerator', 'Washing Machine'],
        'Fashion': ['T-Shirt', 'Jeans', 'Saree', 'Kurti', 'Shoes', 'Watch', 'Handbag', 'Jewelry'],
        'Groceries': ['Rice', 'Wheat Flour', 'Tea', 'Coffee', 'Spices', 'Oil', 'Sugar', 'Milk Powder'],
        'Home & Kitchen': ['Pressure Cooker', 'Mixer Grinder', 'Utensils', 'Furniture', 'Bedding', 'Decor'],
        'Books & Media': ['Book', 'Magazine', 'DVD', 'Gaming Console', 'Headphones']
    }
    categories = list(indian_products.keys())
    
    data = []
    for _ in range(num_transactions):
        customer = random.choice(customers)
        invoice = f'INV{random.randint(100000, 999999)}'
        category = random.choice(categories)
        product = random.choice(indian_products[category])
        quantity = random.randint(1, 5)
        unit_price = round(random.uniform(100, 50000), 2)  # INR prices
        total_amount = quantity * unit_price
        transaction_date = datetime.now() - timedelta(days=random.randint(0, 365))
        country = region
        city = random.choice(indian_cities)
        
        data.append({
            'customer_id': customer,
            'invoice_id': invoice,
            'product_name': product,
            'category': category,
            'quantity': quantity,
            'unit_price': unit_price,
            'total_amount': total_amount,
            'transaction_date': transaction_date.strftime('%Y-%m-%d %H:%M:%S'),
            'country': country,
            'city': city
        })
    
    df = pd.DataFrame(data)
    df.to_csv(f'../data/{filename}', index=False)
    print(f"Indian dataset generated: data/{filename}")

# Generate multiple datasets
generate_indian_data('indian_retail_electronics.csv', num_customers=800, num_transactions=4000)
generate_indian_data('indian_retail_fashion.csv', num_customers=1200, num_transactions=6000)
generate_indian_data('indian_retail_groceries.csv', num_customers=1500, num_transactions=8000)
generate_indian_data('indian_retail_home_kitchen.csv', num_customers=1000, num_transactions=5000)
generate_indian_data('indian_retail_books_media.csv', num_customers=600, num_transactions=3000)
generate_indian_data('indian_retail_mumbai.csv', num_customers=1000, num_transactions=5000)  # Focus on Mumbai
generate_indian_data('indian_retail_delhi.csv', num_customers=1000, num_transactions=5000)   # Focus on Delhi
generate_indian_data('indian_retail_bangalore.csv', num_customers=1000, num_transactions=5000)  # Focus on Bangalore
generate_indian_data('indian_retail_recent.csv', num_customers=1000, num_transactions=5000)  # Recent transactions
generate_indian_data('indian_retail_large.csv', num_customers=2000, num_transactions=10000)  # Larger dataset
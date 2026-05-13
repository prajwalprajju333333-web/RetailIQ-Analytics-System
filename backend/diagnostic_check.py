#!/usr/bin/env python
from models.database import SessionLocal, Transaction, RFMData, ClusterResult
from services.ml_service import compute_rfm, perform_clustering
import sys

db = SessionLocal()
try:
    tx_count = db.query(Transaction).count()
    rfm_count = db.query(RFMData).count()
    cluster_count = db.query(ClusterResult).count()
    
    print(f"Transactions: {tx_count}")
    print(f"RFM Data: {rfm_count}")
    print(f"Clusters: {cluster_count}")
    
    if tx_count == 0:
        print("\n⚠️  No transaction data found - analytics won't work")
        print("   → Upload a CSV file via the Upload page")
    else:
        print(f"\n✓ {tx_count} transactions found")
        if rfm_count == 0:
            print("   Computing RFM...")
            rfm = compute_rfm()
            print(f"   ✓ Generated {len(rfm)} RFM records")
        else:
            print(f"   ✓ {rfm_count} RFM records exist")
            
        if cluster_count == 0:
            print("   Computing clusters...")
            clusters = perform_clustering()
            print(f"   ✓ Generated {len(clusters)} clusters")
        else:
            print(f"   ✓ {cluster_count} cluster memberships exist")
        
finally:
    db.close()

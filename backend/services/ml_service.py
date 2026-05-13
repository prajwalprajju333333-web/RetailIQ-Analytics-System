import pandas as pd
from datetime import datetime
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from models.database import Transaction, RFMData, ClusterResult, Recommendation, SessionLocal
from models.models import RFMModel, ClusterInsight, RecommendationModel, CountryAnalysis
from typing import List
import numpy as np

def compute_rfm() -> List[RFMModel]:
    db = SessionLocal()
    try:
        # Fetch transactions
        transactions = db.query(Transaction).all()
        if not transactions:
            db.query(RFMData).delete()
            db.commit()
            return []

        df = pd.DataFrame([{
            'customer_id': t.customer_id,
            'transaction_date': t.transaction_date,
            'total_amount': t.total_amount
        } for t in transactions])
        
        # Current date
        current_date = datetime.now()
        
        # RFM calculation
        rfm = df.groupby('customer_id').agg({
            'transaction_date': lambda x: (current_date - x.max()).days,
            'customer_id': 'count',
            'total_amount': 'sum'
        }).rename(columns={
            'transaction_date': 'recency',
            'customer_id': 'frequency',
            'total_amount': 'monetary'
        })
        
        if rfm.empty:
            db.query(RFMData).delete()
            db.commit()
            return []

        # Store RFM
        db.query(RFMData).delete()
        for customer_id, row in rfm.iterrows():
            rfm_data = RFMData(
                customer_id=customer_id,
                recency=row['recency'],
                frequency=row['frequency'],
                monetary=row['monetary']
            )
            db.add(rfm_data)
        db.commit()
        
        return [RFMModel(customer_id=customer_id, recency=row['recency'], frequency=row['frequency'], monetary=row['monetary']) for customer_id, row in rfm.iterrows()]
    finally:
        db.close()

def perform_clustering() -> List[ClusterInsight]:
    db = SessionLocal()
    try:
        # Fetch RFM
        rfm_data = db.query(RFMData).all()
        if not rfm_data:
            db.query(ClusterResult).delete()
            db.commit()
            return []

        df = pd.DataFrame([{
            'customer_id': r.customer_id,
            'recency': r.recency,
            'frequency': r.frequency,
            'monetary': r.monetary
        } for r in rfm_data])
        if df.empty:
            db.query(ClusterResult).delete()
            db.commit()
            return []

        # Scale
        scaler = StandardScaler()
        X = scaler.fit_transform(df[['recency', 'frequency', 'monetary']])
        
        n_samples = X.shape[0]
        if n_samples == 0:
            db.query(ClusterResult).delete()
            db.commit()
            return []

        # Choose a safe cluster size based on sample count
        k_opt = min(4, n_samples)
        if k_opt < 1:
            db.query(ClusterResult).delete()
            db.commit()
            return []

        if n_samples == 1:
            clusters = np.array([0])
        else:
            distortions = []
            for k in range(2, min(11, n_samples + 1)):
                kmeans = KMeans(n_clusters=k, random_state=42)
                kmeans.fit(X)
                distortions.append(kmeans.inertia_)
            k_opt = min(4, n_samples)
            kmeans = KMeans(n_clusters=k_opt, random_state=42)
            clusters = kmeans.fit_predict(X)
        
        # Store clusters
        db.query(ClusterResult).delete()
        for i, customer_id in enumerate(df['customer_id']):
            cluster_result = ClusterResult(customer_id=customer_id, cluster=int(clusters[i]))
            db.add(cluster_result)
        db.commit()
        
        # Insights
        df['cluster'] = clusters
        insights = []
        for cluster in range(k_opt):
            cluster_data = df[df['cluster'] == cluster]
            insight = ClusterInsight(
                cluster=cluster,
                avg_recency=cluster_data['recency'].mean() if not cluster_data.empty else 0.0,
                avg_frequency=cluster_data['frequency'].mean() if not cluster_data.empty else 0.0,
                avg_monetary=cluster_data['monetary'].mean() if not cluster_data.empty else 0.0,
                customer_count=len(cluster_data)
            )
            insights.append(insight)
        
        return insights
    finally:
        db.close()

def generate_recommendations() -> List[RecommendationModel]:
    db = SessionLocal()
    try:
        # Fetch insights
        insights = perform_clustering()
        if not insights:
            db.query(Recommendation).delete()
            db.commit()
            return []
        
        db.query(Recommendation).delete()
        recommendations = []
        avg_monetaries = np.array([i.avg_monetary for i in insights])
        avg_frequencies = np.array([i.avg_frequency for i in insights])
        avg_recencies = np.array([i.avg_recency for i in insights])

        for insight in insights:
            if insight.avg_monetary > np.percentile(avg_monetaries, 75):
                strategy = "Premium offers and personalized services"
            elif insight.avg_frequency > np.percentile(avg_frequencies, 75):
                strategy = "Loyalty rewards and exclusive memberships"
            elif insight.avg_recency > np.percentile(avg_recencies, 75):
                strategy = "Re-engagement campaigns and special discounts"
            else:
                strategy = "Price-sensitive promotions and bundle deals"
            
            rec = Recommendation(cluster=insight.cluster, strategy=strategy)
            db.add(rec)
            recommendations.append(RecommendationModel(cluster=insight.cluster, strategy=strategy))
        
        db.commit()
        return recommendations
    finally:
        db.close()

def country_analysis() -> List[CountryAnalysis]:
    db = SessionLocal()
    try:
        transactions = db.query(Transaction).all()
        if not transactions:
            return []

        df = pd.DataFrame([{
            'customer_id': t.customer_id,
            'country': t.country,
            'total_amount': t.total_amount
        } for t in transactions])
        if df.empty:
            return []
        
        # Group by country
        country_stats = df.groupby('country').agg({
            'total_amount': 'sum',
            'customer_id': 'nunique'
        }).rename(columns={'customer_id': 'customer_count'})
        
        # Frequency per customer
        freq = df.groupby(['country', 'customer_id']).size().groupby('country').mean()
        country_stats['avg_frequency'] = freq
        
        return [CountryAnalysis(
            country=country,
            total_spending=row['total_amount'],
            avg_frequency=row['avg_frequency'],
            customer_count=row['customer_count']
        ) for country, row in country_stats.iterrows()]
    finally:
        db.close()
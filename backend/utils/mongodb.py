from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "retailiq_db"

client = None
db = None

def connect_to_mongo():
    global client, db
    try:
        client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Verify connection
        client.admin.command('ping')
        db = client[DATABASE_NAME]
        print("✓ Connected to MongoDB")
        return db
    except ConnectionFailure:
        print("⚠ MongoDB not available. Using fallback mode.")
        print("Install MongoDB: https://www.mongodb.com/try/download/community")
        return None

def get_db():
    global db
    if db is None:
        connect_to_mongo()
    return db

def init_collections():
    """Initialize MongoDB collections"""
    db = get_db()
    if db is not None:
        # Create users collection
        if "users" not in db.list_collection_names():
            db.create_collection("users")
            db["users"].create_index("email", unique=True)
        
        # Create recommendations collection
        if "recommendations" not in db.list_collection_names():
            db.create_collection("recommendations")

# Connect on module import
connect_to_mongo()
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from utils.mongodb import get_db
from models.user_models import UserRegister, UserLogin, UserProfile
import os
from bson.objectid import ObjectId

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # Bcrypt has 72 byte limit
    password = password[:72]
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Bcrypt has 72 byte limit
    plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def register_user(user: UserRegister) -> dict:
    db = get_db()
    if db is None:
        return {"error": "Database not connected"}
    
    users_collection = db["users"]
    
    # Check if user exists
    if users_collection.find_one({"email": user.email}):
        return {"error": "Email already registered"}
    
    # Hash password and create user
    user_data = {
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "password": hash_password(user.password),
        "created_at": datetime.utcnow()
    }
    
    result = users_collection.insert_one(user_data)
    
    return {
        "id": str(result.inserted_id),
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number
    }

def login_user(credentials: UserLogin) -> Optional[dict]:
    db = get_db()
    if db is None:
        return None
    
    users_collection = db["users"]
    user = users_collection.find_one({"email": credentials.email})
    
    if not user:
        return None
    
    if not verify_password(credentials.password, user["password"]):
        return None
    
    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "phone_number": user["phone_number"]
        }
    }

def get_user_profile(email: str) -> Optional[dict]:
    db = get_db()
    if db is None:
        return None
    
    users_collection = db["users"]
    user = users_collection.find_one({"email": email})
    
    if not user:
        return None
    
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone_number": user["phone_number"]
    }

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None
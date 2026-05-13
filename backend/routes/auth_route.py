from fastapi import APIRouter, HTTPException, Depends, Header
from models.user_models import UserRegister, UserLogin
from services.auth_service import register_user, login_user, get_user_profile, verify_token
from typing import Optional

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    result = register_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login")
async def login(credentials: UserLogin):
    result = login_user(credentials)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return result

@router.get("/profile")
async def get_profile(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization token")
    
    try:
        token = authorization.replace("Bearer ", "")
        email = verify_token(token)
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_data = get_user_profile(email)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_data
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional
from services.ml_service import generate_recommendations
from services.auth_service import verify_token

router = APIRouter()

@router.get("/recommendations")
async def get_recommendations(authorization: Optional[str] = Header(None)):
    # Verify token
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    token = authorization.replace("Bearer ", "")
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    return generate_recommendations()
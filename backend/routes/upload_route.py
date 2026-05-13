from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, Header
from typing import Optional
from services.data_service import process_uploaded_file
from services.auth_service import verify_token
from services import ml_service

router = APIRouter()

@router.post("/upload")
async def upload_data(file: UploadFile = File(...), authorization: Optional[str] = Header(None)):
    # Verify token
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    token = authorization.replace("Bearer ", "")
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    try:
        content = await file.read()
        summary = process_uploaded_file(content)
        
        # Recompute ML analytics after new data upload
        ml_service.compute_rfm()
        ml_service.perform_clustering()
        ml_service.generate_recommendations()
        ml_service.country_analysis()
        
        return summary
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
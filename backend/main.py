from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import create_tables
from routes.upload_route import router as upload_router
from routes.rfm_route import router as rfm_router
from routes.clusters_route import router as clusters_router
from routes.recommendations_route import router as recommendations_router
from routes.country_analysis_route import router as country_analysis_router
from routes.auth_route import router as auth_router
from utils.mongodb import init_collections

app = FastAPI(title="RetailIQ Analytics System", description="Customer Segmentation and Marketing Optimization")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(upload_router, prefix="/api")
app.include_router(rfm_router, prefix="/api")
app.include_router(clusters_router, prefix="/api")
app.include_router(recommendations_router, prefix="/api")
app.include_router(country_analysis_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    create_tables()
    init_collections()

@app.get("/")
def read_root():
    return {"message": "RetailIQ Analytics System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
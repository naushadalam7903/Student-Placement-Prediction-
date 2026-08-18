from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/features")
def get_features_intelligence():
    return analytics_service.get_features()

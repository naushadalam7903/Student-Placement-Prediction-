from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/model-info")
def get_model_info():
    return analytics_service.get_model_info()

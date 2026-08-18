from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/metrics")
def get_model_metrics():
    return analytics_service.get_metrics()

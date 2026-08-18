from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/analytics")
def get_analytics():
    return analytics_service.get_analytics_dashboard_data()

@router.get("/data-explorer")
def get_data_explorer():
    return analytics_service.get_data_explorer_data()

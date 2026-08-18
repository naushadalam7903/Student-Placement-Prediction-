from fastapi import APIRouter
import datetime
from backend.app.schemas.analytics_schema import HealthResponse
from backend.app.services.prediction_service import prediction_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health_status():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        model_loaded=prediction_service.model is not None,
        preprocessor_loaded=prediction_service.preprocessor is not None
    )

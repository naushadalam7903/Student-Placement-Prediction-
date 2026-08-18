from fastapi import APIRouter
from backend.app.api.health import router as health_router
from backend.app.api.model_info import router as model_info_router
from backend.app.api.metrics import router as metrics_router
from backend.app.api.features import router as features_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.predict import router as predict_router

api_router = APIRouter(prefix="/api")

api_router.include_router(health_router, tags=["Health"])
api_router.include_router(model_info_router, tags=["Model Info"])
api_router.include_router(metrics_router, tags=["Metrics"])
api_router.include_router(features_router, tags=["Features"])
api_router.include_router(analytics_router, tags=["Analytics"])
api_router.include_router(predict_router, tags=["Prediction"])

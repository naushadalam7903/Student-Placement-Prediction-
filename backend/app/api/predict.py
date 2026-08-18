from fastapi import APIRouter, HTTPException
from backend.app.schemas.predict_schema import StudentPredictionInput, PredictionResponse
from backend.app.services.prediction_service import prediction_service

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict_placement(student_data: StudentPredictionInput):
    try:
        result = prediction_service.predict_student(student_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

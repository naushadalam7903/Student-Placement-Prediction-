from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from backend.app.api.router import api_router

app = FastAPI(
    title="Student Placement Prediction & Intelligence System API",
    description="Production-quality ML prediction and analytics system based on student historical placement data.",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include aggregate API router
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "message": "Student Placement Prediction & Intelligence API is running.",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

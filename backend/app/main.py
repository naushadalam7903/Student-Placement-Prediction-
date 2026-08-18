import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Mount frontend build if it exists
BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Mount assets folder
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    # Catch-all route to serve the React SPA
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or Swagger docs
        if full_path.startswith("api/") or full_path in ["docs", "redoc", "openapi.json"]:
            return None
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "message": "Student Placement Prediction & Intelligence API is running.",
            "docs": "/docs",
            "health": "/api/health"
        }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)

import subprocess
import sys
import time
import os
import signal
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def main():
    print("=" * 60)
    print(" Student Placement Prediction & Intelligence System")
    print("=" * 60)

    # 1. Start FastAPI Backend
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000"
    ]
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(BASE_DIR)
    )

    # 2. Start Vite Frontend
    frontend_dir = BASE_DIR / "frontend"
    frontend_cmd = "npm run dev -- --host 127.0.0.1 --port 5173"
    print("[2/2] Starting Frontend on http://127.0.0.1:5173 ...")
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(frontend_dir),
        shell=True
    )

    print("\n" + "=" * 60)
    print(" Application Successfully Launched!")
    print(" Frontend Web UI: http://127.0.0.1:5173")
    print(" Backend REST API: http://127.0.0.1:8000")
    print(" Interactive API Docs: http://127.0.0.1:8000/docs")
    print("=" * 60)
    print("Press Ctrl+C to stop both servers.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Servers stopped.")

if __name__ == "__main__":
    main()

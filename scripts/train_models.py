import sys
import os
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.ml.trainer import train_and_evaluate_all

if __name__ == "__main__":
    print("Starting ML Pipeline Execution...")
    train_and_evaluate_all()
    print("ML Pipeline Finished Successfully!")

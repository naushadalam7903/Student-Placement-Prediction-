import subprocess
import sys
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
DIST_DIR = FRONTEND_DIR / "dist"

def run(cmd, cwd=None):
    print(f">> Running: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd or str(BASE_DIR), check=True)
    return res

def main():
    print("=" * 60)
    print(" Deploying Student Placement Predictor to GitHub Pages")
    print("=" * 60)
    
    print("[1/3] Building production bundle...")
    run("npm run build", cwd=str(FRONTEND_DIR))
    
    # Create .nojekyll in dist
    (DIST_DIR / ".nojekyll").write_text("# No Jekyll\n", encoding="utf-8")
    
    print("[2/3] Initializing git in dist and pushing to gh-pages...")
    dist_git = DIST_DIR / ".git"
    if dist_git.exists():
        shutil.rmtree(dist_git, ignore_errors=True)
        
    run("git init", cwd=str(DIST_DIR))
    run("git remote add origin https://github.com/Suryapratap-59/Student-Prediction-.git", cwd=str(DIST_DIR))
    run("git checkout -B gh-pages", cwd=str(DIST_DIR))
    run("git add -A", cwd=str(DIST_DIR))
    run('git commit -m "Deploy production build to GitHub Pages"', cwd=str(DIST_DIR))
    run("git push -f origin gh-pages", cwd=str(DIST_DIR))
    
    if dist_git.exists():
        shutil.rmtree(dist_git, ignore_errors=True)
        
    print("\n" + "=" * 60)
    print(" 🎉 Successfully Deployed to GitHub Pages!")
    print(" Live URL: https://suryapratap-59.github.io/Student-Prediction-/")
    print("=" * 60)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Setup script for KOMEZA BANK project with new model integration
This script helps set up the project with the new model from GitHub repository
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def setup_project():
    """Setup the KOMEZA BANK project with new model integration"""
    print("🏦 Setting up KOMEZA BANK project with new model integration...\n")
    
    # Check if we're in the right directory
    if not os.path.exists("komeza-bank-ui") or not os.path.exists("model-api"):
        print("❌ Please run this script from the KOMEZA BANK project root directory")
        return False
    
    print("📋 Project structure verified")
    
    # Setup frontend dependencies
    print("\n🎨 Setting up frontend...")
    if not run_command("cd komeza-bank-ui && npm install", "Installing frontend dependencies"):
        return False
    
    # Setup backend dependencies
    print("\n🔧 Setting up backend...")
    if not run_command("cd model-api && pip install -r requirements.txt", "Installing backend dependencies"):
        return False
    
    # Create models directory
    print("\n📁 Creating models directory...")
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Create a README for the models directory
    models_readme = models_dir / "README.md"
    with open(models_readme, "w") as f:
        f.write("""# Models Directory

This directory contains the machine learning models for the KOMEZA BANK churn prediction system.

## Model Files

The following model files should be placed in this directory:

- `best_churn_model.pkl` - The trained churn prediction model
- `scaler.pkl` - The feature scaler used during training

## Getting the Models

The models are available in the [BK_PULSE GitHub repository](https://github.com/shyakx/BK_PULSE.git).

To download the models:

1. Clone the repository: `git clone https://github.com/shyakx/BK_PULSE.git`
2. Copy the model files to this directory
3. Update the model paths in `model-api/app.py` if needed

## Model Integration

The models are automatically loaded by the FastAPI backend when the server starts.
The model API will use dummy models for development if the actual models are not found.
""")
    
    print("✅ Models directory created with documentation")
    
    # Create environment files
    print("\n⚙️ Creating environment configuration...")
    
    # Frontend .env
    frontend_env = Path("komeza-bank-ui/.env")
    with open(frontend_env, "w") as f:
        f.write("""# KOMEZA BANK Frontend Environment Variables
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=BK Pulse
VITE_DEBUG_MODE=true
VITE_MOCK_DATA=false
""")
    
    # Backend .env
    backend_env = Path("model-api/.env")
    with open(backend_env, "w") as f:
        f.write("""# KOMEZA BANK Backend Environment Variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=komeza_bank
DB_USER=postgres
DB_PASSWORD=your_password_here
""")
    
    print("✅ Environment files created")
    
    # Create startup scripts
    print("\n🚀 Creating startup scripts...")
    
    # Frontend startup script
    frontend_start = Path("start_frontend.bat")
    with open(frontend_start, "w") as f:
        f.write("""@echo off
echo Starting KOMEZA BANK Frontend...
cd komeza-bank-ui
npm run dev
""")
    
    # Backend startup script
    backend_start = Path("start_backend.bat")
    with open(backend_start, "w") as f:
        f.write("""@echo off
echo Starting KOMEZA BANK Backend...
cd model-api
uvicorn app:app --reload --host 0.0.0.0 --port 8000
""")
    
    print("✅ Startup scripts created")
    
    # Final instructions
    print("\n🎉 KOMEZA BANK project setup completed!")
    print("\n📋 Next steps:")
    print("1. Download the new model files from the GitHub repository")
    print("2. Place the model files in the 'models' directory")
    print("3. Update the database connection settings in model-api/.env")
    print("4. Run 'start_backend.bat' to start the API server")
    print("5. Run 'start_frontend.bat' to start the frontend")
    print("\n🔗 GitHub Repository: https://github.com/shyakx/BK_PULSE.git")
    
    return True

if __name__ == "__main__":
    success = setup_project()
    if success:
        print("\n✅ Setup completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Setup failed!")
        sys.exit(1)

#!/bin/bash
# Activate the Python virtual environment
source ./.venv/bin/activate

cd server/app

# Start the FastAPI server with uvicorn
python3 -m uvicorn main:app --reload

#!/usr/bin/env bash
set -e

# Create virtual environment if not exists
if [ ! -d venv ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "Dependencies installed. Activate with 'source venv/bin/activate'"

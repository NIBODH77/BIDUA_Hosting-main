#!/bin/bash

# RAMAERA Hosting Platform - Quick Start Script
# This script helps you get started quickly

set -e

echo "=============================================="
echo "  RAMAERA Hosting Platform - Quick Start"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project directory
cd "$(dirname "$0")"

echo -e "${YELLOW}Step 1: Checking virtual environment...${NC}"
if [ ! -d "venv" ]; then
    echo -e "${RED}❌ Virtual environment not found!${NC}"
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
echo -e "${GREEN}✅ Virtual environment ready${NC}"
echo ""

echo -e "${YELLOW}Step 2: Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✅ Virtual environment activated${NC}"
echo ""

echo -e "${YELLOW}Step 3: Checking dependencies...${NC}"
if ! python -c "import fastapi" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -r requirements_clean.txt
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi
echo ""

echo -e "${YELLOW}Step 4: Testing database connection...${NC}"
echo "Running connection test..."
python test_connection.py
echo ""

echo "=============================================="
echo -e "${GREEN}Next Steps:${NC}"
echo "=============================================="
echo ""
echo "1. Make sure your .env file has correct database credentials"
echo "2. Run database migrations:"
echo "   ${YELLOW}alembic revision --autogenerate -m \"Initial setup\"${NC}"
echo "   ${YELLOW}alembic upgrade head${NC}"
echo ""
echo "3. Start the application:"
echo "   ${YELLOW}uvicorn app.main:app --reload${NC}"
echo ""
echo "4. Access the API:"
echo "   - API: http://localhost:8000"
echo "   - Docs: http://localhost:8000/docs"
echo ""
echo -e "${GREEN}For detailed instructions, see:${NC}"
echo "  - SETUP_SUMMARY.md"
echo "  - DATABASE_SETUP.md"
echo ""

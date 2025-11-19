#!/bin/bash
# Start backend on fixed port 8000 and frontend on any available port
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKEND_PID_FILE=/tmp/bidua_backend.pid
FRONTEND_PID_FILE=/tmp/bidua_frontend.pid
BACKEND_LOG=/tmp/bidua_backend.log
FRONTEND_LOG=/tmp/bidua_frontend.log

is_running() { local pid=$1; [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; }

stop_backend() {
  if [ -f "$BACKEND_PID_FILE" ]; then kill -9 "$(cat "$BACKEND_PID_FILE")" 2>/dev/null || true; rm -f "$BACKEND_PID_FILE"; fi
  lsof -ti:8000 | xargs kill -9 2>/dev/null || true
}

start_backend() {
  echo -e "${BLUE}➡️  Starting backend on port 8000...${NC}"
  (
    cd backend_template
    source venv/bin/activate
    nohup uvicorn app.main:app --reload --port 8000 >"$BACKEND_LOG" 2>&1 & echo $! >"$BACKEND_PID_FILE"
  )
}

start_frontend() {
  echo -e "${BLUE}➡️  Starting frontend (dynamic port)...${NC}"
  (
    cd BIDUA_Hosting-main
    nohup npm run dev >"$FRONTEND_LOG" 2>&1 & echo $! >"$FRONTEND_PID_FILE"
  )
}

get_backend_port() {
  echo 8000
}

get_frontend_url() {
  [ -f "$FRONTEND_LOG" ] && grep -oE "http://localhost:[0-9]+" "$FRONTEND_LOG" | head -n1
}

# Run
stop_backend || true
start_backend
start_frontend
sleep 2

BPORT=$(get_backend_port)
FURL=$(get_frontend_url)

echo -e "${GREEN}✅ Backend: http://localhost:${BPORT}${NC}"
echo -e "${GREEN}✅ Frontend: ${FURL}${NC}"

# Open browser (macOS)
if command -v open >/dev/null 2>&1; then
  open "http://localhost:${BPORT}" 2>/dev/null || true
  [ -n "$FURL" ] && open "$FURL" 2>/dev/null || true
fi

#!/bin/bash
# Start both servers on any available ports, then print and open their URLs
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

get_backend_port() {
  local pid=$(cat "$BACKEND_PID_FILE" 2>/dev/null || true)
  if is_running "$pid"; then
    lsof -Pan -p "$pid" -iTCP -sTCP:LISTEN 2>/dev/null | awk -F: '/LISTEN/ {print $NF; exit}' | sed 's/ (LISTEN)//'
    return
  fi
  [ -f "$BACKEND_LOG" ] && grep -Eo 'Uvicorn running on http://127\.0\.0\.1:[0-9]+' "$BACKEND_LOG" | head -n1 | awk -F: '{print $NF}'
}

get_frontend_url() {
  [ -f "$FRONTEND_LOG" ] && grep -oE "http://localhost:[0-9]+" "$FRONTEND_LOG" | head -n1
}

start_backend() {
  echo -e "${BLUE}➡️  Starting backend...${NC}"
  (
    cd backend_template
    source venv/bin/activate
    nohup uvicorn app.main:app --reload --port 0 >"$BACKEND_LOG" 2>&1 & echo $! >"$BACKEND_PID_FILE"
  )
}

start_frontend() {
  echo -e "${BLUE}➡️  Starting frontend...${NC}"
  (
    cd BIDUA_Hosting-main
    nohup npm run dev >"$FRONTEND_LOG" 2>&1 & echo $! >"$FRONTEND_PID_FILE"
  )
}

# Start
start_backend
start_frontend
sleep 2

BPORT=$(get_backend_port)
FURL=$(get_frontend_url)

echo -e "${GREEN}✅ Backend: http://localhost:${BPORT}${NC}"
echo -e "${GREEN}✅ Frontend: ${FURL}${NC}"

# Attempt to open in default browser (macOS)
if command -v open >/dev/null 2>&1; then
  [ -n "$BPORT" ] && open "http://localhost:${BPORT}" || true
  [ -n "$FURL" ] && open "$FURL" || true
fi

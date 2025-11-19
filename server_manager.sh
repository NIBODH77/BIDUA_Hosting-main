#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_PID_FILE=/tmp/bidua_backend.pid
FRONTEND_PID_FILE=/tmp/bidua_frontend.pid
BACKEND_LOG=/tmp/bidua_backend.log
FRONTEND_LOG=/tmp/bidua_frontend.log

echo -e "${BLUE}🚀 BIDUA Hosting - Server Manager${NC}"
echo ""

# Helpers
is_running() {
    local pid=$1
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        return 0
    fi
    return 1
}

get_backend_pid() {
    if [ -f "$BACKEND_PID_FILE" ]; then
        cat "$BACKEND_PID_FILE"
    fi
}

get_backend_port() {
    local pid=$(get_backend_pid)
    if is_running "$pid"; then
        lsof -Pan -p "$pid" -iTCP -sTCP:LISTEN 2>/dev/null | awk -F: '/LISTEN/ {print $NF; exit}' | sed 's/ (LISTEN)//'
        return
    fi
    # Fallback: parse logs
    if [ -f "$BACKEND_LOG" ]; then
        grep -Eo 'Uvicorn running on http://127\.0\.0\.1:[0-9]+' "$BACKEND_LOG" | head -n1 | awk -F: '{print $NF}'
    fi
}

get_frontend_pid() {
    if [ -f "$FRONTEND_PID_FILE" ]; then
        cat "$FRONTEND_PID_FILE"
    fi
}

get_frontend_url() {
    # Prefer logs (Vite prints the URL)
    if [ -f "$FRONTEND_LOG" ]; then
        local url=$(grep -oE "http://localhost:[0-9]+" "$FRONTEND_LOG" | head -n1)
        if [ -n "$url" ]; then
            echo "$url"
            return
        fi
    fi
    # Fallback: detect node listener port
    local pid=$(get_frontend_pid)
    if is_running "$pid"; then
        local port=$(lsof -Pan -p "$pid" -iTCP -sTCP:LISTEN 2>/dev/null | awk -F: '/LISTEN/ {gsub(/\)$/,"",$NF); print $NF; exit}')
        if [ -n "$port" ]; then
            echo "http://localhost:$port"
        fi
    fi
}

print_status() {
    local bpid=$(get_backend_pid)
    local fpid=$(get_frontend_pid)
    local bport=$(get_backend_port)
    local furl=$(get_frontend_url)

    if is_running "$bpid" && [ -n "$bport" ]; then
        echo -e "${GREEN}✅ Backend running (PID: $bpid) at http://localhost:$bport${NC}"
    else
        echo -e "${RED}❌ Backend not running${NC}"
    fi

    if is_running "$fpid" && [ -n "$furl" ]; then
        echo -e "${GREEN}✅ Frontend running (PID: $fpid) at $furl${NC}"
    else
        echo -e "${RED}❌ Frontend not running${NC}"
    fi
}

start_backend() {
    echo -e "${BLUE}➡️  Starting backend on port 8000...${NC}"
    (
        cd backend_template || exit 1
        source venv/bin/activate
        nohup uvicorn app.main:app --reload --port 8000 >"$BACKEND_LOG" 2>&1 &
        echo $! >"$BACKEND_PID_FILE"
    )
    sleep 1
}

start_frontend() {
    echo -e "${BLUE}➡️  Starting frontend (dynamic port)...${NC}"
    (
        cd BIDUA_Hosting-main || exit 1
        nohup npm run dev >"$FRONTEND_LOG" 2>&1 &
        echo $! >"$FRONTEND_PID_FILE"
    )
    sleep 1
}

stop_backend() {
    local pid=$(get_backend_pid)
    if is_running "$pid"; then
        kill -9 "$pid" 2>/dev/null || true
        rm -f "$BACKEND_PID_FILE"
    fi
    # Also try legacy port kills
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
}

stop_frontend() {
    local pid=$(get_frontend_pid)
    if is_running "$pid"; then
        kill -9 "$pid" 2>/dev/null || true
        rm -f "$FRONTEND_PID_FILE"
    fi
    # Also try legacy port kills
    lsof -ti:4333 | xargs kill -9 2>/dev/null || true
    lsof -ti:7777 | xargs kill -9 2>/dev/null || true
}

open_urls() {
    local bport=$(get_backend_port)
    local furl=$(get_frontend_url)
    if [ -n "$bport" ]; then
        echo -e "${YELLOW}Opening backend: http://localhost:$bport${NC}"
        open "http://localhost:$bport" 2>/dev/null || true
    fi
    if [ -n "$furl" ]; then
        echo -e "${YELLOW}Opening frontend: $furl${NC}"
        open "$furl" 2>/dev/null || true
    fi
}

echo -e "${BLUE}📊 Checking current server status...${NC}"
print_status

echo ""
echo "What would you like to do?"
echo "1) Start both servers"
echo "2) Stop both servers"
echo "3) Restart both servers"
echo "4) Clear cache and restart"
echo "5) Check status only"
echo "6) Open running URLs in browser"
echo "7) Exit"
echo ""
read -p "Enter choice [1-7]: " choice

case $choice in
    1)
        echo -e "${BLUE}� Starting servers...${NC}"
        start_backend
        start_frontend
        sleep 2
        print_status
        ;;
    2)
        echo -e "${BLUE}🛑 Stopping servers...${NC}"
        stop_backend
        stop_frontend
        echo -e "${GREEN}✅ All servers stopped${NC}"
        ;;
    3)
        echo -e "${BLUE}🔄 Restarting servers...${NC}"
        stop_backend
        stop_frontend
        sleep 1
        start_backend
        start_frontend
        sleep 2
        print_status
        ;;
    4)
        echo -e "${BLUE}🧹 Clearing cache and restarting...${NC}"
        # Clear caches
        (
            cd BIDUA_Hosting-main && rm -rf node_modules/.vite dist .vite 2>/dev/null || true
        )
        (
            cd backend_template && find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null && find . -name "*.pyc" -delete 2>/dev/null || true
        )
        echo -e "${GREEN}✅ Cache cleared${NC}"
        # Restart
        stop_backend
        stop_frontend
        sleep 1
        start_backend
        start_frontend
        sleep 2
        print_status
        ;;
    5)
        echo -e "${BLUE}📊 Current status:${NC}"
        print_status
        ;;
    6)
        open_urls
        ;;
    7)
        echo -e "${BLUE}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        ;;
esac

#!/bin/bash

# Master Test Script
# Runs all tests for the Ace#1 e-commerce system

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      Ace#1 E-Commerce Complete System Test                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

section() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

# Check prerequisites
section "Checking Prerequisites"

PREREQ_OK=true

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js installed: $NODE_VERSION"
else
    error "Node.js not installed"
    PREREQ_OK=false
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "npm installed: $NPM_VERSION"
else
    error "npm not installed"
    PREREQ_OK=false
fi

if command -v mysql &> /dev/null; then
    success "MySQL client installed"
else
    error "MySQL client not installed"
    PREREQ_OK=false
fi

if ! $PREREQ_OK; then
    echo ""
    error "Prerequisites not met. Please install missing components."
    exit 1
fi

# Test Frontend
section "Running Frontend Tests"

chmod +x test-frontend.sh
if ./test-frontend.sh; then
    FRONTEND_RESULT="PASSED"
else
    FRONTEND_RESULT="FAILED"
fi

# Test Backend
section "Running Backend Tests"

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    info "Installing backend dependencies..."
    npm install
fi

chmod +x scripts/test-system.js
if node scripts/test-system.js; then
    BACKEND_RESULT="PASSED"
else
    BACKEND_RESULT="FAILED"
fi

cd ..

# Final Summary
section "Complete Test Results"

echo ""
echo "┌────────────────────────────────────────────────────────────┐"
echo "│                    Test Results                            │"
echo "├────────────────────────────────────────────────────────────┤"

if [ "$FRONTEND_RESULT" = "PASSED" ]; then
    echo -e "│  Frontend Tests:        ${GREEN}✅ PASSED${NC}                        │"
else
    echo -e "│  Frontend Tests:        ${RED}❌ FAILED${NC}                        │"
fi

if [ "$BACKEND_RESULT" = "PASSED" ]; then
    echo -e "│  Backend Tests:         ${GREEN}✅ PASSED${NC}                        │"
else
    echo -e "│  Backend Tests:         ${RED}❌ FAILED${NC}                        │"
fi

echo "└────────────────────────────────────────────────────────────┘"
echo ""

if [ "$FRONTEND_RESULT" = "PASSED" ] && [ "$BACKEND_RESULT" = "PASSED" ]; then
    success "All tests passed! Your system is ready! 🎉"
    echo ""
    info "Next Steps:"
    info "1. Start the backend:"
    info "   cd backend && npm start"
    echo ""
    info "2. Open the frontend:"
    info "   open docs/index.html"
    info "   or"
    info "   python3 -m http.server 8080 --directory docs"
    echo ""
    info "3. Access the website:"
    info "   Frontend: http://localhost:8080"
    info "   Backend API: http://localhost:3000"
    info "   Admin Panel: http://localhost:8080/admin-dashboard.html"
    echo ""
else
    error "Some tests failed. Please review the output above."
    echo ""
    info "Common Issues:"
    info "1. Database not running: brew services start mysql"
    info "2. Redis not running: brew services start redis"
    info "3. Missing .env file: cp backend/.env.example backend/.env"
    info "4. Database not created: node backend/scripts/setup-database.js"
    info "5. Migrations not run: node backend/migrations/run.js"
    echo ""
fi

# Exit with appropriate code
if [ "$FRONTEND_RESULT" = "PASSED" ] && [ "$BACKEND_RESULT" = "PASSED" ]; then
    exit 0
else
    exit 1
fi

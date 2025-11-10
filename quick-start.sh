#!/bin/bash

# Quick Start Script for Ace#1 E-Commerce System
# This script helps you get the system up and running quickly

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      Ace#1 E-Commerce Quick Start Setup                   ║"
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

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

section() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

# Step 1: Check Prerequisites
section "Step 1: Checking Prerequisites"

PREREQ_OK=true

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js installed: $NODE_VERSION"
else
    error "Node.js not installed"
    info "Install from: https://nodejs.org/"
    PREREQ_OK=false
fi

if command -v mysql &> /dev/null; then
    success "MySQL client installed"
else
    warning "MySQL client not found"
    info "Install with: brew install mysql"
fi

if command -v redis-cli &> /dev/null; then
    success "Redis client installed"
else
    warning "Redis client not found (optional)"
    info "Install with: brew install redis"
fi

if ! $PREREQ_OK; then
    echo ""
    error "Please install missing prerequisites first"
    exit 1
fi

# Step 2: Install Backend Dependencies
section "Step 2: Installing Backend Dependencies"

cd backend

if [ ! -d "node_modules" ]; then
    info "Installing npm packages..."
    npm install
    if [ $? -eq 0 ]; then
        success "Dependencies installed"
    else
        error "Failed to install dependencies"
        exit 1
    fi
else
    success "Dependencies already installed"
fi

# Check for uuid package
if ! npm list uuid &> /dev/null; then
    info "Installing uuid package..."
    npm install uuid
fi

cd ..

# Step 3: Setup Environment
section "Step 3: Setting Up Environment"

if [ ! -f "backend/.env" ]; then
    info "Creating .env file from template..."
    cp backend/.env.example backend/.env
    success "Created backend/.env"
    warning "Please edit backend/.env with your configuration"
else
    success ".env file exists"
fi

# Step 4: Generate Encryption Key
section "Step 4: Generating Encryption Key"

if grep -q "your_32_character_encryption_key_here" backend/.env; then
    info "Generating encryption key..."
    cd backend
    ./scripts/setup-encryption.sh
    cd ..
else
    success "Encryption key already configured"
fi

# Step 5: Check Services
section "Step 5: Checking Services"

# Check MySQL
if pgrep -x "mysqld" > /dev/null; then
    success "MySQL is running"
else
    warning "MySQL is not running"
    info "Start with: brew services start mysql"
    info "Or: mysql.server start"
fi

# Check Redis
if pgrep -x "redis-server" > /dev/null; then
    success "Redis is running"
else
    warning "Redis is not running (optional)"
    info "Start with: brew services start redis"
fi

# Step 6: Setup Database
section "Step 6: Database Setup"

echo ""
read -p "Do you want to setup the database now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Setting up database..."
    cd backend
    node scripts/setup-database.js
    
    if [ $? -eq 0 ]; then
        success "Database setup complete"
        
        echo ""
        read -p "Run database migrations? (y/N): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            info "Running migrations..."
            node migrations/run.js
            
            if [ $? -eq 0 ]; then
                success "Migrations complete"
            else
                warning "Migrations failed - you may need to run them manually"
            fi
        fi
    else
        warning "Database setup failed - you may need to do this manually"
    fi
    cd ..
else
    info "Skipping database setup"
    info "Run manually: node backend/scripts/setup-database.js"
fi

# Step 7: Run Tests
section "Step 7: Running Tests"

echo ""
read -p "Do you want to run tests now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./test-all.sh
else
    info "Skipping tests"
    info "Run manually: ./test-all.sh"
fi

# Final Instructions
section "Setup Complete!"

echo ""
success "Your Ace#1 e-commerce system is ready!"
echo ""
info "Next Steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "2. Open the frontend:"
echo "   Option A: open docs/index.html"
echo "   Option B: python3 -m http.server 8080 --directory docs"
echo ""
echo "3. Access the website:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:3000"
echo "   Admin Panel: http://localhost:8080/admin-dashboard.html"
echo ""
echo "4. Test the system:"
echo "   ./test-all.sh"
echo ""
info "Documentation:"
echo "   - README.md - Project overview"
echo "   - TESTING_GUIDE.md - Testing instructions"
echo "   - backend/ENCRYPTION_GUIDE.md - Encryption usage"
echo "   - backend/README.md - Backend documentation"
echo ""
success "Happy coding! 🚀"
echo ""

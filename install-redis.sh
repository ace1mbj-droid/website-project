#!/bin/bash

# Redis Installation Script for macOS
# This script automates Redis installation for Ace#1 project

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Redis Installation for Ace#1 E-Commerce           ║"
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

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    error "This script is for macOS only"
    exit 1
fi

# Step 1: Check Homebrew
section "Step 1: Checking Homebrew"

if command -v brew &> /dev/null; then
    success "Homebrew installed"
else
    error "Homebrew not found"
    info "Please install Homebrew first: https://brew.sh"
    exit 1
fi

# Step 2: Check if Redis is already installed
section "Step 2: Checking Redis Installation"

if command -v redis-server &> /dev/null; then
    REDIS_VERSION=$(redis-server --version | head -1)
    success "Redis already installed: $REDIS_VERSION"
    
    echo ""
    read -p "Redis is already installed. Do you want to reinstall? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Skipping Redis installation"
        SKIP_INSTALL=true
    else
        info "Reinstalling Redis..."
        brew reinstall redis
        SKIP_INSTALL=false
    fi
else
    SKIP_INSTALL=false
fi

# Step 3: Install Redis
if [ "$SKIP_INSTALL" = false ]; then
    section "Step 3: Installing Redis"
    
    info "Updating Homebrew..."
    brew update
    
    info "Installing Redis..."
    brew install redis
    
    if [ $? -eq 0 ]; then
        success "Redis installed successfully"
        REDIS_VERSION=$(redis-server --version | head -1)
        info "Version: $REDIS_VERSION"
    else
        error "Failed to install Redis"
        exit 1
    fi
fi

# Step 4: Start Redis
section "Step 4: Starting Redis Service"

# Check if Redis is already running
if pgrep -x "redis-server" > /dev/null; then
    success "Redis is already running"
else
    info "Starting Redis service..."
    brew services start redis
    
    # Wait for Redis to start
    info "Waiting for Redis to start..."
    sleep 3
    
    if pgrep -x "redis-server" > /dev/null; then
        success "Redis service started"
    else
        error "Failed to start Redis service"
        info "Try manually: brew services start redis"
        exit 1
    fi
fi

# Step 5: Test Redis Connection
section "Step 5: Testing Redis Connection"

info "Testing Redis connection..."

# Test with redis-cli
if redis-cli ping > /dev/null 2>&1; then
    RESPONSE=$(redis-cli ping)
    success "Redis connection successful: $RESPONSE"
else
    error "Redis connection failed"
    info "Check if Redis is running: brew services list"
    exit 1
fi

# Test set/get
redis-cli set test_key "test_value" > /dev/null 2>&1
TEST_VALUE=$(redis-cli get test_key)

if [ "$TEST_VALUE" = "test_value" ]; then
    success "Redis read/write test passed"
    redis-cli del test_key > /dev/null 2>&1
else
    warning "Redis read/write test failed"
fi

# Step 6: Configuration
section "Step 6: Redis Configuration"

info "Redis is configured with default settings"
echo ""
info "Configuration file: /opt/homebrew/etc/redis.conf"
info "Data directory: /opt/homebrew/var/db/redis/"
info "Log file: /opt/homebrew/var/log/redis.log"
echo ""

# Check .env file
if [ -f "backend/.env" ]; then
    if grep -q "^REDIS_HOST=" backend/.env; then
        success "Redis configuration already in .env"
    else
        info "Adding Redis configuration to .env..."
        echo "" >> backend/.env
        echo "# Redis Configuration" >> backend/.env
        echo "REDIS_HOST=127.0.0.1" >> backend/.env
        echo "REDIS_PORT=6379" >> backend/.env
        echo "REDIS_PASSWORD=" >> backend/.env
        success "Added Redis configuration to .env"
    fi
else
    warning ".env file not found - please configure Redis manually"
fi

# Final Summary
section "Installation Complete!"

echo ""
success "Redis is installed and running! 🎉"
echo ""
info "Redis Details:"
echo "  Host: 127.0.0.1 (or localhost)"
echo "  Port: 6379"
echo "  Password: (none - default)"
echo ""
info "Useful Commands:"
echo "  Start Redis:   brew services start redis"
echo "  Stop Redis:    brew services stop redis"
echo "  Restart Redis: brew services restart redis"
echo "  Connect:       redis-cli"
echo "  Test:          redis-cli ping"
echo ""
info "Redis CLI Commands:"
echo "  SET key value  - Set a key"
echo "  GET key        - Get a key"
echo "  DEL key        - Delete a key"
echo "  KEYS *         - List all keys"
echo "  FLUSHALL       - Clear all data"
echo "  INFO           - Server information"
echo ""
info "Next Steps:"
echo "  1. Test the system: ./test-all.sh"
echo "  2. Start backend: cd backend && npm start"
echo "  3. Redis will be used for:"
echo "     - Session storage"
echo "     - Rate limiting"
echo "     - Caching"
echo ""
success "You're ready to go! 🚀"
echo ""

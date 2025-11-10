#!/bin/bash

# Comprehensive Website Testing Script
# Tests functionality, security, and completeness

echo "🧪 Starting Comprehensive Website Testing..."
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

# Test function
test_item() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAIL++))
        return 1
    fi
}

warn_item() {
    local warn_name="$1"
    echo -e "${YELLOW}⚠ WARNING: $warn_name${NC}"
    ((WARN++))
}

echo "📁 1. FILE STRUCTURE TESTS"
echo "----------------------------"

test_item "Backend directory exists" "[ -d 'backend' ]"
test_item "Frontend directory exists" "[ -d 'docs' ]"
test_item "Package.json exists" "[ -f 'backend/package.json' ]"
test_item "Environment example exists" "[ -f 'backend/.env.example' ]"
test_item "Migrations directory exists" "[ -d 'backend/migrations' ]"
test_item "Routes directory exists" "[ -d 'backend/src/routes' ]"
test_item "Models directory exists" "[ -d 'backend/src/models' ]"
test_item "Middleware directory exists" "[ -d 'backend/src/middleware' ]"

echo ""
echo "🔒 2. SECURITY FILES TESTS"
echo "----------------------------"

test_item ".htaccess exists (docs)" "[ -f 'docs/.htaccess' ]"
test_item ".htaccess exists (website)" "[ -f 'website/.htaccess' ]"
test_item ".gitignore exists" "[ -f 'backend/.gitignore' ]"
test_item "Encryption utility exists" "[ -f 'backend/src/utils/encryption.js' ]"
test_item "Auth middleware exists" "[ -f 'backend/src/middleware/auth.js' ]"
test_item "Rate limit middleware exists" "[ -f 'backend/src/middleware/rateLimit.js' ]"
test_item "Validation middleware exists" "[ -f 'backend/src/middleware/validation.js' ]"

echo ""
echo "🗄️ 3. DATABASE TESTS"
echo "----------------------------"

test_item "Database config exists" "[ -f 'backend/src/config/database.js' ]"
test_item "Migration 001 exists" "[ -f 'backend/migrations/001_create_users.sql' ]"
test_item "Migration 002 exists" "[ -f 'backend/migrations/002_create_products.sql' ]"
test_item "Migration 003 exists" "[ -f 'backend/migrations/003_create_orders.sql' ]"
test_item "Migration runner exists" "[ -f 'backend/migrations/run.js' ]"

# Check if MySQL is running
if command -v mysql &> /dev/null; then
    if mysql -u root -e "SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✓ MySQL is running${NC}"
        ((PASS++))
    else
        warn_item "MySQL not accessible (may need password)"
    fi
else
    warn_item "MySQL command not found"
fi

echo ""
echo "🎨 4. FRONTEND FILES TESTS"
echo "----------------------------"

test_item "Index page exists" "[ -f 'docs/index.html' ]"
test_item "Shop page exists" "[ -f 'docs/shop.html' ]"
test_item "Cart page exists" "[ -f 'docs/cart.html' ]"
test_item "Contact page exists" "[ -f 'docs/contact-us.html' ]"
test_item "Admin dashboard exists" "[ -f 'docs/admin-dashboard.html' ]"
test_item "Config.js exists" "[ -f 'docs/assets/js/config.js' ]"
test_item "Main CSS exists" "[ -f 'docs/assets/css/main.css' ]"

echo ""
echo "🔌 5. API ROUTES TESTS"
echo "----------------------------"

test_item "Auth routes exist" "[ -f 'backend/src/routes/auth.js' ]"
test_item "Products routes exist" "[ -f 'backend/src/routes/products.js' ]"
test_item "Cart routes exist" "[ -f 'backend/src/routes/cart.js' ]"
test_item "Orders routes exist" "[ -f 'backend/src/routes/orders.js' ]"
test_item "Main app.js exists" "[ -f 'backend/src/app.js' ]"

echo ""
echo "📦 6. MODELS TESTS"
echo "----------------------------"

test_item "User model exists" "[ -f 'backend/src/models/User.js' ]"
test_item "Product model exists" "[ -f 'backend/src/models/Product.js' ]"
test_item "Order model exists" "[ -f 'backend/src/models/Order.js' ]"
test_item "Cart model exists" "[ -f 'backend/src/models/Cart.js' ]"
test_item "Session model exists" "[ -f 'backend/src/models/Session.js' ]"
test_item "Rating model exists" "[ -f 'backend/src/models/Rating.js' ]"

echo ""
echo "🔐 7. SECURITY CONFIGURATION TESTS"
echo "----------------------------"

# Check .htaccess for security headers
if [ -f "docs/.htaccess" ]; then
    if grep -q "X-Frame-Options" docs/.htaccess; then
        echo -e "${GREEN}✓ X-Frame-Options header configured${NC}"
        ((PASS++))
    else
        warn_item "X-Frame-Options header missing"
    fi
    
    if grep -q "X-Content-Type-Options" docs/.htaccess; then
        echo -e "${GREEN}✓ X-Content-Type-Options header configured${NC}"
        ((PASS++))
    else
        warn_item "X-Content-Type-Options header missing"
    fi
    
    if grep -q "Content-Security-Policy" docs/.htaccess; then
        echo -e "${GREEN}✓ Content-Security-Policy configured${NC}"
        ((PASS++))
    else
        warn_item "Content-Security-Policy missing"
    fi
fi

# Check if .env file exists (should not be in git)
if [ -f "backend/.env" ]; then
    warn_item ".env file exists (ensure it's in .gitignore)"
else
    echo -e "${GREEN}✓ No .env file in repository (good)${NC}"
    ((PASS++))
fi

echo ""
echo "📝 8. CONFIGURATION TESTS"
echo "----------------------------"

# Check package.json for required dependencies
if [ -f "backend/package.json" ]; then
    if grep -q "express" backend/package.json; then
        echo -e "${GREEN}✓ Express dependency found${NC}"
        ((PASS++))
    fi
    
    if grep -q "mysql2" backend/package.json; then
        echo -e "${GREEN}✓ MySQL2 dependency found${NC}"
        ((PASS++))
    fi
    
    if grep -q "bcrypt" backend/package.json; then
        echo -e "${GREEN}✓ Bcrypt dependency found${NC}"
        ((PASS++))
    fi
    
    if grep -q "jsonwebtoken" backend/package.json; then
        echo -e "${GREEN}✓ JWT dependency found${NC}"
        ((PASS++))
    fi
fi

echo ""
echo "🌐 9. DEPLOYMENT READINESS TESTS"
echo "----------------------------"

test_item "Railway config exists" "[ -f 'backend/railway.json' ]"
test_item "Render config exists" "[ -f 'backend/render.yaml' ]"
test_item "Deployment script exists" "[ -f 'start-backend-local.sh' ]"
test_item "README exists" "[ -f 'README.md' ]"

echo ""
echo "📊 10. CODE QUALITY CHECKS"
echo "----------------------------"

# Check for console.log in production code (should use proper logging)
if grep -r "console\.log" backend/src --exclude-dir=node_modules | grep -v "winston" > /dev/null; then
    warn_item "console.log found in backend code (consider using winston logger)"
else
    echo -e "${GREEN}✓ No console.log in backend code${NC}"
    ((PASS++))
fi

# Check for hardcoded credentials
if grep -r "password.*=.*['\"]" backend/src --exclude-dir=node_modules | grep -v "process.env" > /dev/null; then
    warn_item "Possible hardcoded credentials found"
else
    echo -e "${GREEN}✓ No hardcoded credentials detected${NC}"
    ((PASS++))
fi

echo ""
echo "=========================================="
echo "📈 TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo ""

TOTAL=$((PASS + FAIL))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASS * 100 / TOTAL))
    echo "Success Rate: $PERCENTAGE%"
fi

echo ""
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: ./start-backend-local.sh"
    echo "2. Visit: https://ace1.in"
    echo "3. Test user registration and login"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the issues above.${NC}"
    exit 1
fi

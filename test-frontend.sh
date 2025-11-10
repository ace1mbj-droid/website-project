#!/bin/bash

# Frontend Testing Script
# Tests the frontend website files and structure

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Ace#1 Frontend Test Suite                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

section() {
    echo ""
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo ""
}

# Test counters
TOTAL=0
PASSED=0
FAILED=0

test_file() {
    TOTAL=$((TOTAL + 1))
    if [ -f "$1" ]; then
        success "$1 exists"
        PASSED=$((PASSED + 1))
        return 0
    else
        error "$1 not found"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Test HTML Files
section "Testing HTML Files"

test_file "docs/index.html"
test_file "docs/ace-products.html"
test_file "docs/ace-gallery.html"
test_file "docs/ace-about.html"
test_file "docs/ace-contact.html"
test_file "docs/ace-cart.html"
test_file "docs/ace-checkout.html"
test_file "docs/ace-login.html"
test_file "docs/ace-register.html"
test_file "docs/ace-profile.html"
test_file "docs/admin-dashboard.html"

# Test CSS Files
section "Testing CSS Files"

test_file "docs/assets/css/style.css"
test_file "docs/assets/css/admin.css"

# Test JavaScript Files
section "Testing JavaScript Files"

test_file "docs/assets/js/auth.js"
test_file "docs/assets/js/cart.js"
test_file "docs/assets/js/products.js"
test_file "docs/assets/js/checkout.js"
test_file "docs/assets/js/profile.js"
test_file "docs/assets/js/admin.js"
test_file "docs/assets/js/admin-analytics.js"

# Test Images
section "Testing Image Assets"

if [ -d "docs/assets/images" ]; then
    IMAGE_COUNT=$(find docs/assets/images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" \) | wc -l)
    success "Found $IMAGE_COUNT images in assets/images"
    PASSED=$((PASSED + 1))
else
    warning "assets/images directory not found"
fi
TOTAL=$((TOTAL + 1))

# Test Security Files
section "Testing Security Configuration"

if [ -f "website/.htaccess" ]; then
    success ".htaccess file exists"
    PASSED=$((PASSED + 1))
    
    # Check for security headers
    if grep -q "X-Frame-Options" website/.htaccess; then
        success "Security headers configured"
        PASSED=$((PASSED + 1))
    else
        warning "Security headers not found in .htaccess"
        FAILED=$((FAILED + 1))
    fi
else
    error ".htaccess file not found"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 2))

# Test for sensitive files
section "Checking for Sensitive Files"

SENSITIVE_FOUND=0

if [ -d "DO-NOT-UPLOAD" ]; then
    warning "DO-NOT-UPLOAD directory exists (should not be deployed)"
    SENSITIVE_FOUND=1
fi

if find . -name "*CREDENTIALS*" -type f 2>/dev/null | grep -q .; then
    warning "Credential files found (should not be in repository)"
    SENSITIVE_FOUND=1
fi

if [ $SENSITIVE_FOUND -eq 0 ]; then
    success "No sensitive files found in public directories"
fi

# Check .gitignore
section "Testing .gitignore Configuration"

if [ -f ".gitignore" ]; then
    success ".gitignore exists"
    PASSED=$((PASSED + 1))
    
    if grep -q "DO-NOT-UPLOAD" .gitignore; then
        success ".gitignore includes DO-NOT-UPLOAD"
        PASSED=$((PASSED + 1))
    else
        warning ".gitignore missing DO-NOT-UPLOAD pattern"
        FAILED=$((FAILED + 1))
    fi
    
    if grep -q "node_modules" .gitignore; then
        success ".gitignore includes node_modules"
        PASSED=$((PASSED + 1))
    else
        warning ".gitignore missing node_modules"
        FAILED=$((FAILED + 1))
    fi
else
    error ".gitignore not found"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 3))

# Test JavaScript Syntax
section "Testing JavaScript Syntax"

if command -v node &> /dev/null; then
    JS_FILES=$(find docs/assets/js -name "*.js" 2>/dev/null)
    
    for file in $JS_FILES; do
        TOTAL=$((TOTAL + 1))
        if node -c "$file" 2>/dev/null; then
            success "$(basename $file) syntax OK"
            PASSED=$((PASSED + 1))
        else
            error "$(basename $file) has syntax errors"
            FAILED=$((FAILED + 1))
        fi
    done
else
    warning "Node.js not found - skipping JS syntax check"
fi

# Test for API configuration
section "Testing API Configuration"

API_FOUND=0
for file in docs/assets/js/*.js; do
    if [ -f "$file" ]; then
        if grep -q "localhost:3000" "$file" 2>/dev/null; then
            info "$(basename $file) uses localhost:3000 API"
            API_FOUND=1
        fi
    fi
done

if [ $API_FOUND -eq 1 ]; then
    success "API endpoints configured"
else
    warning "No API endpoints found - frontend may be using localStorage only"
fi

# Generate Summary
section "Test Summary"

echo ""
echo -e "${CYAN}Total Tests: $TOTAL${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    success "All frontend tests passed! ✨"
    echo ""
    info "To view the website:"
    info "1. Open docs/index.html in your browser"
    info "2. Or use: python3 -m http.server 8080 --directory docs"
    info "3. Then visit: http://localhost:8080"
else
    warning "Some tests failed. Please review the issues above."
fi

echo ""

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi

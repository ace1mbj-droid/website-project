#!/bin/bash

# MySQL Installation Script for macOS
# This script automates MySQL installation and setup for Ace#1 project

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         MySQL Installation for Ace#1 E-Commerce           ║"
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
    BREW_VERSION=$(brew --version | head -1)
    success "Homebrew installed: $BREW_VERSION"
else
    error "Homebrew not found"
    echo ""
    info "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if [ $? -eq 0 ]; then
        success "Homebrew installed successfully"
    else
        error "Failed to install Homebrew"
        exit 1
    fi
fi

# Step 2: Check if MySQL is already installed
section "Step 2: Checking MySQL Installation"

if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version)
    success "MySQL already installed: $MYSQL_VERSION"
    
    echo ""
    read -p "MySQL is already installed. Do you want to reinstall? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Skipping MySQL installation"
        SKIP_INSTALL=true
    else
        info "Reinstalling MySQL..."
        brew reinstall mysql
        SKIP_INSTALL=false
    fi
else
    SKIP_INSTALL=false
fi

# Step 3: Install MySQL
if [ "$SKIP_INSTALL" = false ]; then
    section "Step 3: Installing MySQL"
    
    info "Updating Homebrew..."
    brew update
    
    info "Installing MySQL..."
    brew install mysql
    
    if [ $? -eq 0 ]; then
        success "MySQL installed successfully"
        MYSQL_VERSION=$(mysql --version)
        info "Version: $MYSQL_VERSION"
    else
        error "Failed to install MySQL"
        exit 1
    fi
fi

# Step 4: Start MySQL
section "Step 4: Starting MySQL Service"

# Check if MySQL is already running
if pgrep -x "mysqld" > /dev/null; then
    success "MySQL is already running"
else
    info "Starting MySQL service..."
    brew services start mysql
    
    # Wait for MySQL to start
    info "Waiting for MySQL to start..."
    sleep 5
    
    if pgrep -x "mysqld" > /dev/null; then
        success "MySQL service started"
    else
        error "Failed to start MySQL service"
        info "Try manually: brew services start mysql"
        exit 1
    fi
fi

# Step 5: Secure Installation
section "Step 5: MySQL Security Setup"

echo ""
warning "You will now be prompted to secure your MySQL installation"
info "Recommendations:"
echo "  - Set a strong root password"
echo "  - Remove anonymous users: Yes"
echo "  - Disallow root login remotely: Yes"
echo "  - Remove test database: Yes"
echo "  - Reload privilege tables: Yes"
echo ""

read -p "Run mysql_secure_installation now? (Y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    mysql_secure_installation
else
    warning "Skipping security setup"
    info "Run manually later: mysql_secure_installation"
fi

# Step 6: Create Database and User
section "Step 6: Creating Database and User"

echo ""
info "We'll now create the database and user for Ace#1"
echo ""

read -p "Enter MySQL root password: " -s ROOT_PASSWORD
echo ""

# Generate a random password for ace1_user
ACE1_PASSWORD=$(openssl rand -base64 12)

info "Creating database and user..."

mysql -u root -p"$ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS ace1_development;
CREATE USER IF NOT EXISTS 'ace1_user'@'localhost' IDENTIFIED BY '$ACE1_PASSWORD';
GRANT ALL PRIVILEGES ON ace1_development.* TO 'ace1_user'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    success "Database and user created successfully"
    echo ""
    success "Database: ace1_development"
    success "Username: ace1_user"
    success "Password: $ACE1_PASSWORD"
    echo ""
    warning "Save this password! You'll need it for the .env file"
else
    error "Failed to create database and user"
    info "You may need to create them manually"
fi

# Step 7: Update .env file
section "Step 7: Updating Configuration"

if [ -f "backend/.env" ]; then
    info "Updating backend/.env file..."
    
    # Backup existing .env
    cp backend/.env backend/.env.backup
    success "Backed up existing .env to .env.backup"
    
    # Update database credentials
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/^DB_HOST=.*/DB_HOST=localhost/" backend/.env
        sed -i '' "s/^DB_PORT=.*/DB_PORT=3306/" backend/.env
        sed -i '' "s/^DB_NAME=.*/DB_NAME=ace1_development/" backend/.env
        sed -i '' "s/^DB_USER=.*/DB_USER=ace1_user/" backend/.env
        sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=$ACE1_PASSWORD/" backend/.env
    fi
    
    success "Updated .env file with database credentials"
else
    warning ".env file not found"
    info "Creating .env from .env.example..."
    
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/^DB_HOST=.*/DB_HOST=localhost/" backend/.env
            sed -i '' "s/^DB_PORT=.*/DB_PORT=3306/" backend/.env
            sed -i '' "s/^DB_NAME=.*/DB_NAME=ace1_development/" backend/.env
            sed -i '' "s/^DB_USER=.*/DB_USER=ace1_user/" backend/.env
            sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=$ACE1_PASSWORD/" backend/.env
        fi
        
        success "Created and configured .env file"
    else
        error ".env.example not found"
    fi
fi

# Step 8: Test Connection
section "Step 8: Testing Database Connection"

if [ -f "backend/scripts/test-connection.js" ]; then
    info "Testing database connection..."
    cd backend
    node scripts/test-connection.js
    
    if [ $? -eq 0 ]; then
        success "Database connection successful!"
    else
        warning "Connection test failed - you may need to check credentials"
    fi
    cd ..
else
    warning "Test script not found - skipping connection test"
fi

# Step 9: Run Migrations
section "Step 9: Database Migrations"

echo ""
read -p "Do you want to run database migrations now? (Y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    if [ -f "backend/migrations/run.js" ]; then
        info "Running migrations..."
        cd backend
        node migrations/run.js
        
        if [ $? -eq 0 ]; then
            success "Migrations completed successfully"
        else
            warning "Migrations failed - you may need to run them manually"
        fi
        cd ..
    else
        warning "Migration script not found"
    fi
else
    info "Skipping migrations"
    info "Run manually: node backend/migrations/run.js"
fi

# Final Summary
section "Installation Complete!"

echo ""
success "MySQL is installed and configured! 🎉"
echo ""
info "Database Details:"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  Database: ace1_development"
echo "  Username: ace1_user"
echo "  Password: $ACE1_PASSWORD"
echo ""
warning "Important: Save your database password!"
echo ""
info "Useful Commands:"
echo "  Start MySQL:   brew services start mysql"
echo "  Stop MySQL:    brew services stop mysql"
echo "  Restart MySQL: brew services restart mysql"
echo "  Connect:       mysql -u ace1_user -p ace1_development"
echo ""
info "Next Steps:"
echo "  1. Test the system: ./test-all.sh"
echo "  2. Start backend: cd backend && npm start"
echo "  3. Open frontend: open docs/index.html"
echo ""
info "Documentation:"
echo "  - INSTALL_MYSQL.md - Complete MySQL guide"
echo "  - TESTING_GUIDE.md - Testing instructions"
echo "  - backend/DATABASE_SETUP_GUIDE.md - Database details"
echo ""
success "You're ready to go! 🚀"
echo ""

#!/bin/bash

# Quick MySQL Database Setup for Ace#1
# Run this after MySQL is installed

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Ace#1 Database Setup                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Generate secure password
ACE1_PASSWORD=$(openssl rand -base64 12 | tr -d '=+/' | cut -c1-16)

info "Creating database and user..."
echo ""

# Create database and user (MySQL 9.5 has no root password by default)
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS ace1_development;
CREATE USER IF NOT EXISTS 'ace1_user'@'localhost' IDENTIFIED BY '$ACE1_PASSWORD';
GRANT ALL PRIVILEGES ON ace1_development.* TO 'ace1_user'@'localhost';
FLUSH PRIVILEGES;
SELECT 'Database created successfully!' AS Status;
EOF

if [ $? -eq 0 ]; then
    echo ""
    success "Database setup complete!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Database Credentials"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Host:     localhost"
    echo "  Port:     3306"
    echo "  Database: ace1_development"
    echo "  Username: ace1_user"
    echo "  Password: $ACE1_PASSWORD"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    warning "Save this password! Updating .env file..."
    
    # Update .env file
    if [ -f "backend/.env" ]; then
        # Backup
        cp backend/.env backend/.env.backup.$(date +%Y%m%d_%H%M%S)
        
        # Update credentials
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=$ACE1_PASSWORD/" backend/.env
        else
            sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$ACE1_PASSWORD/" backend/.env
        fi
        
        success "Updated backend/.env with database password"
    else
        warning ".env file not found - please update manually"
    fi
    
    echo ""
    info "Next steps:"
    echo "  1. Run migrations: cd backend && node migrations/run.js"
    echo "  2. Test connection: cd backend && node scripts/test-connection.js"
    echo "  3. Start backend: cd backend && npm start"
    echo ""
else
    echo ""
    warning "Failed to create database"
    info "Try running: mysql -u root"
    info "Then manually run the SQL commands"
fi

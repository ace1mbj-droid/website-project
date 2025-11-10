#!/bin/bash

# FTP Upload Preparation Script
# This script creates a clean directory with only files needed for FTP upload

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Preparing Files for FTP Upload                    ║"
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

# Create FTP upload directory
FTP_DIR="ftp-upload"
BACKEND_DIR="$FTP_DIR/backend"
FRONTEND_DIR="$FTP_DIR/public_html"

info "Creating FTP upload directory structure..."

# Remove old FTP directory if exists
if [ -d "$FTP_DIR" ]; then
    rm -rf "$FTP_DIR"
fi

# Create directories
mkdir -p "$BACKEND_DIR"
mkdir -p "$FRONTEND_DIR"

success "Created directory structure"

# Copy Frontend Files (public_html)
info "Copying frontend files..."

# Copy HTML files
cp docs/*.html "$FRONTEND_DIR/" 2>/dev/null || true

# Copy assets
cp -r docs/assets "$FRONTEND_DIR/" 2>/dev/null || true

# Copy .htaccess (important for security)
cp website/.htaccess "$FRONTEND_DIR/" 2>/dev/null || true

# Create .htaccess if it doesn't exist
if [ ! -f "$FRONTEND_DIR/.htaccess" ]; then
    cat > "$FRONTEND_DIR/.htaccess" << 'EOF'
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"

# Content Security Policy
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';"

# HSTS (only enable after testing HTTPS)
# Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
EOF
    success "Created .htaccess file"
fi

success "Frontend files copied"

# Copy Backend Files
info "Copying backend files..."

# Copy source code
cp -r backend/src "$BACKEND_DIR/"
cp -r backend/migrations "$BACKEND_DIR/"
cp -r backend/scripts "$BACKEND_DIR/"

# Copy configuration files
cp backend/package.json "$BACKEND_DIR/"
cp backend/package-lock.json "$BACKEND_DIR/" 2>/dev/null || true
cp backend/.env.example "$BACKEND_DIR/"

# Create production .env template
cat > "$BACKEND_DIR/.env.production" << 'EOF'
# Production Environment Configuration
# IMPORTANT: Update these values for your production server

# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ace1_production
DB_USER=your_db_user
DB_PASSWORD=your_secure_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_min_32_characters_change_this
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_min_32_characters_change_this
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Paytm Configuration
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBPROD
PAYTM_INDUSTRY_TYPE=Retail
PAYTM_CHANNEL_ID=WEB
PAYTM_CALLBACK_URL=https://yourdomain.com/api/payment/callback

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com

# Security
ENCRYPTION_KEY=generate_32_character_key_here_exactly
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_LOGIN_MAX=5

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=info
EOF

success "Backend files copied"

# Create README for FTP upload
cat > "$FTP_DIR/README.md" << 'EOF'
# FTP Upload Instructions

## Directory Structure

```
ftp-upload/
├── public_html/          # Upload to your web root (public_html, www, or htdocs)
│   ├── assets/          # CSS, JS, images
│   ├── *.html           # Website pages
│   └── .htaccess        # Security configuration
└── backend/             # Upload to a separate directory (e.g., /home/user/backend)
    ├── src/             # Application code
    ├── migrations/      # Database migrations
    ├── scripts/         # Setup scripts
    ├── package.json     # Dependencies
    └── .env.production  # Configuration template
```

## Upload Instructions

### 1. Frontend (public_html)

Upload the contents of `public_html/` to your web server's public directory:
- cPanel: `/public_html/` or `/www/`
- Other hosts: `/var/www/html/` or similar

**Files to upload:**
- All HTML files
- assets/ directory (CSS, JS, images)
- .htaccess file

### 2. Backend

Upload the contents of `backend/` to a directory OUTSIDE your public_html:
- Recommended: `/home/yourusername/backend/`
- Or: `/var/www/backend/`

**Important:** Backend should NOT be in public_html for security!

### 3. Configuration

1. **Rename .env.production to .env**
   ```bash
   mv .env.production .env
   ```

2. **Edit .env with your production values:**
   - Database credentials
   - JWT secrets (generate new ones!)
   - Paytm credentials
   - Email settings
   - Encryption key (exactly 32 characters)

3. **Install dependencies:**
   ```bash
   cd /path/to/backend
   npm install --production
   ```

4. **Setup database:**
   ```bash
   node scripts/setup-database.js
   node migrations/run.js up
   ```

5. **Start backend:**
   ```bash
   npm start
   # Or use PM2 for production:
   pm2 start src/app.js --name ace1-api
   ```

### 4. Update Frontend API URLs

Edit the JavaScript files in `public_html/assets/js/` to point to your backend:

```javascript
// Change from:
const API_URL = 'http://localhost:3000/api';

// To:
const API_URL = 'https://yourdomain.com/api';
```

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Generate new JWT secrets (32+ characters)
- [ ] Generate new encryption key (exactly 32 characters)
- [ ] Update Paytm credentials with production keys
- [ ] Configure SMTP with real email account
- [ ] Enable HTTPS (SSL certificate)
- [ ] Test all security headers
- [ ] Remove any test/debug code
- [ ] Set NODE_ENV=production
- [ ] Configure firewall rules
- [ ] Setup database backups
- [ ] Test payment flow with real Paytm account

## File Permissions

Set correct permissions after upload:

```bash
# Frontend
chmod 644 public_html/*.html
chmod 644 public_html/.htaccess
chmod 755 public_html/assets

# Backend
chmod 600 backend/.env
chmod 755 backend/src
chmod 755 backend/scripts/*.js
```

## Testing After Upload

1. Visit your website: https://yourdomain.com
2. Check security headers: https://securityheaders.com
3. Test SSL: https://www.ssllabs.com/ssltest/
4. Test API: https://yourdomain.com/api/health
5. Test registration and login
6. Test product browsing
7. Test cart and checkout
8. Test admin panel

## Troubleshooting

### Frontend not loading
- Check file permissions
- Verify .htaccess is uploaded
- Check browser console for errors

### Backend not connecting
- Verify database credentials in .env
- Check if Node.js is installed
- Verify backend is running: `ps aux | grep node`
- Check logs: `tail -f logs/error.log`

### Database errors
- Verify MySQL is running
- Check database exists
- Run migrations: `node migrations/run.js up`
- Check connection: `node scripts/test-connection.js`

## Support

For issues:
1. Check error logs
2. Verify all configuration
3. Test locally first
4. Contact your hosting provider for server-specific issues

## Important Notes

- **Never upload .git directory**
- **Never upload node_modules (install on server)**
- **Never upload .env with real credentials to public areas**
- **Always use HTTPS in production**
- **Keep backend outside public_html**
- **Regular backups are essential**
EOF

success "Created README.md"

# Create deployment checklist
cat > "$FTP_DIR/DEPLOYMENT_CHECKLIST.txt" << 'EOF'
╔════════════════════════════════════════════════════════════╗
║              DEPLOYMENT CHECKLIST                          ║
╚════════════════════════════════════════════════════════════╝

PRE-DEPLOYMENT
□ Test everything locally
□ Run all tests: ./test-all.sh
□ Backup current production (if updating)
□ Generate new JWT secrets
□ Generate new encryption key (32 chars)
□ Update Paytm to production credentials
□ Configure production email SMTP

UPLOAD FILES
□ Upload public_html/ to web root
□ Upload backend/ outside public_html
□ Verify .htaccess is uploaded
□ Check file permissions (644 for files, 755 for dirs)

BACKEND SETUP
□ SSH into server
□ Navigate to backend directory
□ Run: npm install --production
□ Copy .env.production to .env
□ Edit .env with production values
□ Run: node scripts/setup-database.js
□ Run: node migrations/run.js up
□ Test: node scripts/test-connection.js
□ Start: npm start (or PM2)

FRONTEND CONFIGURATION
□ Update API URLs in JavaScript files
□ Change localhost:3000 to production domain
□ Test all pages load
□ Verify images load
□ Check console for errors

SECURITY
□ Enable HTTPS (SSL certificate)
□ Test security headers
□ Verify .htaccess working
□ Test rate limiting
□ Check CORS settings
□ Verify authentication works
□ Test admin panel access

DATABASE
□ Create production database
□ Run all migrations
□ Verify all tables created
□ Test database connection
□ Setup automated backups

TESTING
□ Test user registration
□ Test user login
□ Test product browsing
□ Test add to cart
□ Test checkout process
□ Test payment (with test mode first!)
□ Test admin dashboard
□ Test order management
□ Test email notifications

POST-DEPLOYMENT
□ Monitor error logs
□ Check server resources
□ Verify backups running
□ Test from different devices
□ Test from different browsers
□ Monitor payment transactions
□ Check email delivery

MONITORING
□ Setup uptime monitoring
□ Configure error alerts
□ Monitor database performance
□ Check disk space
□ Monitor API response times
□ Review security logs

DOCUMENTATION
□ Document server details
□ Save all credentials securely
□ Document deployment process
□ Create rollback plan
□ Update team on changes

═══════════════════════════════════════════════════════════
                    READY TO DEPLOY!
═══════════════════════════════════════════════════════════
EOF

success "Created deployment checklist"

# Create .gitignore for FTP directory
cat > "$FTP_DIR/.gitignore" << 'EOF'
# Don't commit FTP upload directory to git
*
!.gitignore
!README.md
!DEPLOYMENT_CHECKLIST.txt
EOF

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  PREPARATION COMPLETE!                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
success "FTP upload files prepared in: $FTP_DIR/"
echo ""
info "Directory structure:"
echo "  $FTP_DIR/"
echo "  ├── public_html/          → Upload to web root"
echo "  ├── backend/              → Upload outside public_html"
echo "  ├── README.md             → Upload instructions"
echo "  └── DEPLOYMENT_CHECKLIST.txt → Deployment steps"
echo ""
info "Next steps:"
echo "  1. Review: $FTP_DIR/README.md"
echo "  2. Follow: $FTP_DIR/DEPLOYMENT_CHECKLIST.txt"
echo "  3. Upload public_html/ to your web server"
echo "  4. Upload backend/ to a secure location"
echo "  5. Configure .env on server"
echo "  6. Run setup scripts on server"
echo ""
warning "Important reminders:"
echo "  • Backend must be OUTSIDE public_html"
echo "  • Update .env with production values"
echo "  • Generate new secrets for production"
echo "  • Enable HTTPS before going live"
echo "  • Test everything before announcing"
echo ""
success "Ready for FTP upload! 🚀"
echo ""

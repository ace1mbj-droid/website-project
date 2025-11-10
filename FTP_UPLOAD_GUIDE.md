# 📤 FTP Upload Guide - Ace#1 E-Commerce

## ✅ Files Prepared Successfully!

Your production-ready files are organized in the `ftp-upload/` directory, separated from development files.

## 📁 Directory Structure

```
ftp-upload/                          ← FTP-ready files ONLY
├── public_html/                     ← Upload to web root
│   ├── *.html                       (18 HTML pages)
│   ├── assets/
│   │   ├── css/                     (Stylesheets)
│   │   ├── js/                      (JavaScript files)
│   │   └── images/                  (Product images)
│   └── .htaccess                    (Security configuration)
│
├── backend/                         ← Upload OUTSIDE public_html
│   ├── src/                         (Application code)
│   ├── migrations/                  (Database setup)
│   ├── scripts/                     (Setup scripts)
│   ├── package.json                 (Dependencies)
│   └── .env.production              (Config template)
│
├── README.md                        (Detailed instructions)
└── DEPLOYMENT_CHECKLIST.txt         (Step-by-step guide)

Development Files (NOT for FTP):
├── backend/.env                     ← Local config (DO NOT UPLOAD)
├── backend/node_modules/            ← Install on server
├── .git/                            ← Version control (DO NOT UPLOAD)
├── DO-NOT-UPLOAD/                   ← Sensitive files
├── test-*.sh                        ← Test scripts
└── *.md                             ← Documentation
```

## 🚀 Quick Upload Instructions

### Step 1: Upload Frontend (public_html)

**Upload to:** Your web server's public directory
- cPanel: `/public_html/` or `/www/`
- Plesk: `/httpdocs/`
- Other: `/var/www/html/`

**Files to upload from `ftp-upload/public_html/`:**
```
✅ All .html files (18 pages)
✅ assets/ directory (complete folder)
✅ .htaccess file (IMPORTANT for security!)
```

**Using FTP Client (FileZilla, Cyberduck, etc.):**
1. Connect to your FTP server
2. Navigate to public_html (or www)
3. Drag and drop contents of `ftp-upload/public_html/`
4. Verify .htaccess uploaded (enable "Show hidden files")

### Step 2: Upload Backend (OUTSIDE public_html)

**Upload to:** A directory OUTSIDE your web root
- Recommended: `/home/yourusername/backend/`
- Or: `/home/yourusername/api/`
- **NEVER:** `/public_html/backend/` ❌

**Files to upload from `ftp-upload/backend/`:**
```
✅ src/ directory
✅ migrations/ directory
✅ scripts/ directory
✅ package.json
✅ .env.production (rename to .env after upload)
```

**Using SSH/Terminal:**
```bash
# Upload via SCP
scp -r ftp-upload/backend/* username@yourserver.com:/home/username/backend/

# Or use FTP client to upload to /home/username/backend/
```

## 🔧 Server Configuration

### After Upload - Backend Setup

**1. SSH into your server:**
```bash
ssh username@yourserver.com
```

**2. Navigate to backend directory:**
```bash
cd /home/username/backend
```

**3. Install dependencies:**
```bash
npm install --production
```

**4. Configure environment:**
```bash
# Rename config file
mv .env.production .env

# Edit with your production values
nano .env
```

**5. Setup database:**
```bash
# Create database and run migrations
node scripts/setup-database.js
node migrations/run.js up
```

**6. Test connection:**
```bash
node scripts/test-connection.js
```

**7. Start the server:**
```bash
# Option A: Direct start
npm start

# Option B: PM2 (recommended for production)
npm install -g pm2
pm2 start src/app.js --name ace1-api
pm2 save
pm2 startup
```

### After Upload - Frontend Configuration

**Update API URLs in JavaScript files:**

Edit these files in `public_html/assets/js/`:
- `auth.js`
- `cart.js`
- `admin-analytics.js`
- Any other JS files that call the API

**Change:**
```javascript
const API_URL = 'http://localhost:3000/api';
```

**To:**
```javascript
const API_URL = 'https://yourdomain.com/api';
// or
const API_URL = 'https://api.yourdomain.com';
```

## 🔐 Security Configuration

### 1. Generate Production Secrets

**JWT Secret (32+ characters):**
```bash
openssl rand -base64 32
```

**Encryption Key (exactly 32 characters):**
```bash
openssl rand -base64 32 | cut -c1-32
```

### 2. Update .env File

```bash
# Edit on server
nano /home/username/backend/.env
```

**Required changes:**
```env
NODE_ENV=production
DB_PASSWORD=your_actual_db_password
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret
ENCRYPTION_KEY=exactly_32_characters_here_ok
PAYTM_MERCHANT_ID=your_production_merchant_id
PAYTM_MERCHANT_KEY=your_production_key
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_email_password
FRONTEND_URL=https://yourdomain.com
```

### 3. Set File Permissions

```bash
# Frontend
chmod 644 public_html/*.html
chmod 644 public_html/.htaccess
chmod 755 public_html/assets

# Backend
chmod 600 /home/username/backend/.env
chmod 755 /home/username/backend/src
chmod 755 /home/username/backend/scripts
```

### 4. Enable HTTPS

**Using cPanel:**
1. Go to SSL/TLS section
2. Install Let's Encrypt certificate
3. Enable "Force HTTPS Redirect"

**Using Certbot (command line):**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📋 Pre-Deployment Checklist

### Before Upload
- [ ] Test everything locally
- [ ] Run `./test-all.sh` successfully
- [ ] Backup current production (if updating)
- [ ] Generate new production secrets
- [ ] Update Paytm to production credentials

### During Upload
- [ ] Upload public_html/ to web root
- [ ] Upload backend/ outside public_html
- [ ] Verify .htaccess uploaded
- [ ] Check file permissions

### After Upload
- [ ] Install npm packages on server
- [ ] Configure .env with production values
- [ ] Run database migrations
- [ ] Update API URLs in frontend
- [ ] Test database connection
- [ ] Start backend server

### Testing
- [ ] Visit website (HTTPS)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout
- [ ] Test admin panel
- [ ] Test payment (sandbox first!)

## 🌐 Domain Configuration

### DNS Settings

Point your domain to your server:
```
A Record:  @  →  Your Server IP
A Record:  www  →  Your Server IP
```

### Nginx Configuration (if applicable)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    root /home/username/public_html;
    index index.html;
    
    # SSL certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Troubleshooting

### Frontend Issues

**Pages not loading:**
```bash
# Check file permissions
ls -la public_html/

# Verify .htaccess exists
ls -la public_html/.htaccess

# Check Apache/Nginx error logs
tail -f /var/log/apache2/error.log
```

**Images not showing:**
```bash
# Check assets directory uploaded
ls -la public_html/assets/images/

# Verify permissions
chmod 755 public_html/assets
chmod 644 public_html/assets/images/*
```

### Backend Issues

**Cannot connect to database:**
```bash
# Test connection
cd /home/username/backend
node scripts/test-connection.js

# Check MySQL running
systemctl status mysql

# Verify credentials
cat .env | grep DB_
```

**Backend not starting:**
```bash
# Check Node.js installed
node --version

# Check for errors
npm start

# View logs
tail -f logs/error.log

# Check if port in use
lsof -i :3000
```

**API not accessible:**
```bash
# Check backend running
ps aux | grep node

# Test locally
curl http://localhost:3000/api/health

# Check firewall
sudo ufw status
```

## 📊 Monitoring

### Check Backend Status

```bash
# Using PM2
pm2 status
pm2 logs ace1-api

# Check process
ps aux | grep node

# Check port
netstat -tulpn | grep 3000
```

### View Logs

```bash
# Backend logs
tail -f /home/username/backend/logs/app.log
tail -f /home/username/backend/logs/error.log

# Web server logs
tail -f /var/log/apache2/access.log
tail -f /var/log/nginx/access.log
```

## 🔄 Updates and Maintenance

### Updating Files

**Frontend updates:**
1. Upload new files to public_html/
2. Clear browser cache
3. Test changes

**Backend updates:**
1. Upload new files to backend/
2. Run: `npm install` (if package.json changed)
3. Run migrations: `node migrations/run.js up`
4. Restart: `pm2 restart ace1-api`

### Database Backups

```bash
# Manual backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Automated daily backup (crontab)
0 2 * * * mysqldump -u username -p'password' database_name > /backups/db_$(date +\%Y\%m\%d).sql
```

## 📞 Support Resources

### Documentation
- `ftp-upload/README.md` - Detailed instructions
- `ftp-upload/DEPLOYMENT_CHECKLIST.txt` - Step-by-step guide
- `TESTING_GUIDE.md` - Testing procedures
- `backend/README.md` - Backend documentation

### Hosting Provider Support
- cPanel documentation
- SSH access guides
- Database management
- SSL certificate installation

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Website loads at https://yourdomain.com
- ✅ All pages accessible
- ✅ Images and styles load correctly
- ✅ User registration works
- ✅ Login/logout functions
- ✅ Products display correctly
- ✅ Cart operations work
- ✅ Checkout process completes
- ✅ Admin panel accessible
- ✅ API responds at /api/health
- ✅ No console errors
- ✅ Security headers present

## 🎉 You're Ready!

Your FTP-ready files are organized and ready for upload:

**📁 Upload from:** `ftp-upload/`
**📖 Follow:** `ftp-upload/README.md`
**✅ Checklist:** `ftp-upload/DEPLOYMENT_CHECKLIST.txt`

**Good luck with your deployment! 🚀**

---

**Important:** Keep your development files (outside ftp-upload/) for future updates and maintenance.

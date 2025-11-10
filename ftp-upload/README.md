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

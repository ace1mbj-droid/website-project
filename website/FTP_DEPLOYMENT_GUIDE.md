# FTP Deployment Guide - Ace#1 Website

## 📦 Files Ready for FTP Upload

### ✅ NEW SECURITY FILES (Upload These First!)

These are the new security files that need to be uploaded:

```
/assets/js/crypto-utils.js          ← Client-side encryption utilities
/assets/js/env-config.js             ← Secure configuration manager
/assets/js/auth.js                   ← Enhanced authentication (UPDATED)
/.env.example                        ← Environment template
/secure-page-template.html           ← Example secure page
/SECURITY_QUICK_FIX.md              ← Security documentation
```

### 📄 ALL WEBSITE FILES FOR FTP

#### Root HTML Files
```
/index.html
/our-products.html
/ace-gallery.html
/about-us.html
/contact-us.html
/marketplace.html
/shop.html
/checkout.html
/login.html
/admin-panel.html
/contact-styled.html
/simple-contact.html
/debug-form.html
/secure-page-template.html          ← NEW
```

#### Assets - JavaScript
```
/assets/js/auth.js                  ← UPDATED (with encryption)
/assets/js/cart.js
/assets/js/config.js
/assets/js/paytm-config.js
/assets/js/crypto-utils.js          ← NEW
/assets/js/env-config.js            ← NEW
```

#### Assets - CSS
```
/assets/css/modern-marketplace.css
```

#### PWA Files
```
/manifest.webmanifest
/sw.js                               ← Service worker
```

#### External Resources (All directories)
```
/img1.wsimg.com/                    ← All images and media
/fonts.googleapis.com/              ← Google Fonts
/fonts.gstatic.com/                 ← Google Fonts static
/www.youtube.com/                   ← YouTube embeds
/maps.googleapis.com/               ← Google Maps
/maps.gstatic.com/                  ← Google Maps static
/www.google.com/                    ← Google services
/www.gstatic.com/                   ← Google static
/drive.google.com/                  ← Google Drive
/_DataURI/                          ← Data URIs
```

### 🚫 FILES TO **NOT** UPLOAD

Do NOT upload these files to FTP (they should stay local only):

```
/.env                                ← NEVER upload (contains secrets)
/ADMIN_CREDENTIALS.md                ← NEVER upload (sensitive)
/.DS_Store                           ← macOS system file
/.gitignore                          ← Git configuration
/server.log                          ← Log files
/ENCRYPTION_SECURITY_GUIDE.md        ← Documentation (optional)
/SECURITY_AUDIT_REPORT.md            ← Documentation (optional)
/FINAL_IMPLEMENTATION_SUMMARY.md     ← Documentation (optional)
```

### 📋 OPTIONAL DOCUMENTATION FILES

These can be uploaded if you want documentation on your server:

```
/SETUP_INSTRUCTIONS.md
/PAYMENT_SETUP.md
/PAYTM_INTEGRATION_GUIDE.md
/PAYTM_QR_IMPLEMENTATION.md
/MARKETPLACE_IMPLEMENTATION.md
/MANUAL_ORDER_SYSTEM.md
/WORK_COMPLETED_TODAY.md
/AUDIT_SUMMARY.md
/REMOVED_ELEMENTS.md
/SECURITY_QUICK_FIX.md              ← NEW
```

## 🚀 FTP Upload Steps

### Step 1: Prepare Files
```bash
cd /Users/jai_das13/Development/website-project/website

# Verify new security files exist
ls -la assets/js/crypto-utils.js
ls -la assets/js/env-config.js
ls -la assets/js/auth.js
```

### Step 2: Connect to FTP
Using your FTP client (FileZilla, Cyberduck, or command line):

```bash
# Example using lftp (command line)
lftp -u username ftp.yourhost.com

# Or use FileZilla/Cyberduck with these settings:
Host: ftp.yourhost.com
Username: your_username
Password: your_password
Port: 21 (or 22 for SFTP)
```

### Step 3: Upload Priority Order

**PRIORITY 1: Security Files (Upload First)**
```
1. /assets/js/crypto-utils.js
2. /assets/js/env-config.js
3. /assets/js/auth.js (overwrite existing)
```

**PRIORITY 2: Core HTML Files**
```
All .html files in root directory
```

**PRIORITY 3: Assets**
```
/assets/ directory (all subdirectories)
```

**PRIORITY 4: PWA Files**
```
/manifest.webmanifest
/sw.js
```

**PRIORITY 5: External Resources**
```
All external resource directories
(Only if not already uploaded or if updated)
```

## 🔧 Post-Upload Configuration

### Update HTML Files

After uploading the security files, you need to update your HTML files to load them.

**Add to EVERY HTML page** (before closing `</body>` tag):

```html
<!-- Security & Encryption Scripts (Load in this order!) -->
<script src="/assets/js/crypto-utils.js"></script>
<script src="/assets/js/env-config.js"></script>
<script src="/assets/js/auth.js"></script>

<!-- Other scripts after -->
<script src="/assets/js/config.js"></script>
<script src="/assets/js/cart.js"></script>
```

### Pages That MUST Be Updated

These pages use authentication and MUST load the security scripts:

```
✅ /index.html
✅ /login.html
✅ /admin-panel.html
✅ /marketplace.html
✅ /shop.html
✅ /checkout.html
✅ /our-products.html
✅ /contact-us.html
```

## 🧪 Testing After Upload

### Test 1: Security Scripts Loaded
1. Open your website in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. You should see:
   ```
   ✅ Crypto utilities loaded
   ✅ Environment configuration loaded
   ```

### Test 2: Encryption Works
1. Open DevTools → Console
2. Run this command:
   ```javascript
   window.cryptoUtils.generateRandomKey()
   ```
3. Should generate a 64-character hex string

### Test 3: localStorage Encrypted
1. Open DevTools → Application → localStorage
2. Look at stored data
3. Should see encrypted strings (gibberish), not readable JSON

### Test 4: Login Works
1. Go to /login.html
2. Try logging in
3. Check console for errors
4. Login should work with encryption

### Test 5: Rate Limiting
1. Try logging in with wrong password 5 times
2. Should get locked out message
3. Wait 15 minutes or clear localStorage to unlock

## 📊 File Size Reference

Approximate sizes of new files:

```
crypto-utils.js     ≈ 6 KB
env-config.js       ≈ 5 KB
auth.js (updated)   ≈ 13 KB
Total new files     ≈ 24 KB
```

## 🔒 Security Checklist

Before going live, ensure:

- [ ] `.env` file is NOT uploaded to FTP
- [ ] `ADMIN_CREDENTIALS.md` is NOT uploaded
- [ ] All security scripts are uploaded
- [ ] All HTML files load security scripts in correct order
- [ ] Test login/registration on live site
- [ ] Test encryption in browser DevTools
- [ ] Verify localStorage is encrypted
- [ ] Test rate limiting (5 failed attempts)
- [ ] Check browser console for errors

## 🌐 FTP Clients Recommended

### GUI Clients (Easier)
- **FileZilla** (Free) - https://filezilla-project.org/
- **Cyberduck** (Free) - https://cyberduck.io/
- **Transmit** (Paid, Mac only) - https://panic.com/transmit/

### Command Line (Advanced)
```bash
# Using lftp
brew install lftp
lftp -u username ftp.yourhost.com

# Using scp (if you have SSH access)
scp -r assets/ username@yourhost.com:/path/to/website/
```

## 📝 Quick FTP Commands

### FileZilla
1. File → Site Manager → New Site
2. Enter host, username, password
3. Set Protocol: FTP or SFTP
4. Click Connect
5. Drag and drop files from left to right panel

### Command Line (lftp)
```bash
# Connect
lftp -u username ftp.yourhost.com

# Navigate
cd /public_html

# Upload single file
put assets/js/crypto-utils.js

# Upload entire directory
mirror -R assets/ assets/

# Upload with overwrite
put -O assets/js/ auth.js

# Quit
exit
```

## 🆘 Troubleshooting

### "Permission Denied"
- Check FTP credentials
- Ensure you have write permissions
- Try uploading to correct directory (usually /public_html or /htdocs)

### "Connection Timeout"
- Check your internet connection
- Verify FTP server address
- Try changing port (21 for FTP, 22 for SFTP)
- Check firewall settings

### "Files Not Showing on Website"
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check file was uploaded to correct directory
- Verify file permissions (should be 644 for files, 755 for directories)

### "Script Not Loading"
- Check file path in HTML (use absolute paths: /assets/js/...)
- Verify file was uploaded successfully
- Check browser console for 404 errors
- Ensure file has correct permissions

## 📞 Support

For deployment issues:
- Email: hello@ace1.in
- Check server logs via cPanel/hosting panel
- Contact your hosting provider for FTP issues

---

**Created:** November 9, 2025  
**Last Updated:** November 9, 2025  
**Status:** ✅ Ready for Deployment

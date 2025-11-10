# 📦 FTP Upload Package - Ace#1 Website

## 🎯 What to Upload

Your FTP-ready files are in the `docs/` and `marketplace-templates/` folders.

---

## 📁 COMPLETE FOLDER STRUCTURE FOR FTP

Upload everything from your local project to your FTP server's web root (usually `public_html` or `www`):

```
📁 YOUR FTP ROOT (public_html or www)
│
├── 📄 index.html ✅ (from docs/index.html)
├── 📄 shop.html ✅ (from docs/shop.html)
├── 📄 about-us.html ✅ (from docs/about-us.html)
├── 📄 contact-us.html ✅ (from docs/contact-us.html)
├── 📄 cart.html ✅ (from docs/cart.html)
├── 📄 login.html ✅ (from docs/login.html)
├── 📄 register.html ✅ (from docs/register.html)
├── 📄 checkout.html (from docs/checkout.html)
├── 📄 product-detail.html (from docs/product-detail.html)
├── 📄 user-dashboard.html (from docs/user-dashboard.html)
├── 📄 profile.html (from docs/profile.html)
├── 📄 ace-gallery.html (from docs/ace-gallery.html)
├── 📄 track-order.html (from docs/track-order.html)
├── 📄 order-confirmation.html (from docs/order-confirmation.html)
├── 📄 thank-you.html (from docs/thank-you.html)
├── 📄 admin-dashboard.html (from docs/admin-dashboard.html)
├── 📄 .htaccess (from docs/.htaccess)
├── 📄 manifest.webmanifest (from docs/manifest.webmanifest)
├── 📄 sw.js (from docs/sw.js)
│
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── marketplace-theme.css
│   │   ├── user-dashboard.css
│   │   └── [other CSS files]
│   │
│   ├── 📁 js/
│   │   ├── config.js ✅ IMPORTANT
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── marketplace.js
│   │   ├── crypto-utils.js
│   │   ├── env-config.js
│   │   ├── admin-analytics.js
│   │   └── [other JS files]
│   │
│   ├── 📁 images/
│   │   ├── ace-logo.svg
│   │   └── [other images]
│   │
│   └── 📁 data/
│       └── products.json
│
├── 📁 marketplace-templates/ ✅ NEW FOLDER
│   ├── lifestyle-bold.css ✅ REQUIRED
│   ├── lifestyle-bold.js ✅ REQUIRED
│   ├── lifestyle-bold.html (reference)
│   ├── modern-minimal.html
│   ├── bold-athletic.html
│   ├── athletic-premium.html
│   └── dark-modern.html
│
└── 📁 templates/ ✅ NEW FOLDER
    ├── nav-lifestyle.html ✅ NEW
    └── footer-lifestyle.html ✅ NEW
```

---

## 🚀 QUICK UPLOAD METHOD

### Option 1: Upload Entire `docs` Folder Contents

**Easiest Method:**

1. Connect to your FTP server
2. Navigate to your web root (`public_html` or `www`)
3. Upload **ALL contents** from your local `docs/` folder
4. Upload the `marketplace-templates/` folder
5. Done!

**Command if using FTP client:**
```
Local: /your-project/docs/*
Remote: /public_html/
```

---

## 📋 PRIORITY FILES (Upload These First)

If you want to upload in stages, start with these:

### Stage 1: Core Updated Pages (PRIORITY)
```
✅ index.html
✅ shop.html
✅ about-us.html
✅ contact-us.html
✅ cart.html
✅ login.html
✅ register.html
```

### Stage 2: Design System (REQUIRED)
```
✅ marketplace-templates/lifestyle-bold.css
✅ marketplace-templates/lifestyle-bold.js
✅ assets/js/config.js
```

### Stage 3: Templates (HELPFUL)
```
✅ templates/nav-lifestyle.html
✅ templates/footer-lifestyle.html
```

### Stage 4: Assets (EXISTING)
```
📁 assets/css/
📁 assets/js/
📁 assets/images/
📁 assets/data/
```

### Stage 5: Other Pages (AS NEEDED)
```
checkout.html
product-detail.html
user-dashboard.html
profile.html
ace-gallery.html
track-order.html
order-confirmation.html
thank-you.html
admin-dashboard.html
```

---

## 🔧 USING COMMAND LINE FTP

### Using `lftp` (Linux/Mac)

```bash
# Connect to FTP
lftp ftp://username@your-ftp-server.com

# Navigate to web root
cd public_html

# Upload docs folder contents
mirror -R docs/ ./

# Upload marketplace-templates
mirror -R marketplace-templates/ ./marketplace-templates/

# Exit
bye
```

### Using `ncftp` (Linux/Mac)

```bash
# Connect
ncftp -u username your-ftp-server.com

# Navigate
cd public_html

# Upload
mput -r docs/*
mput -r marketplace-templates

# Exit
quit
```

### Using `curl` (Any OS)

```bash
# Upload single file
curl -T docs/index.html ftp://your-ftp-server.com/public_html/ --user username:password

# Upload multiple files
for file in docs/*.html; do
  curl -T "$file" ftp://your-ftp-server.com/public_html/ --user username:password
done
```

---

## 🖥️ USING FTP CLIENT SOFTWARE

### FileZilla (Recommended)

1. **Connect:**
   - Host: your-ftp-server.com
   - Username: your-username
   - Password: your-password
   - Port: 21 (or 22 for SFTP)

2. **Navigate:**
   - Local: Your project folder
   - Remote: /public_html/ or /www/

3. **Upload:**
   - Drag `docs/` folder contents to remote
   - Drag `marketplace-templates/` folder to remote
   - Wait for upload to complete

4. **Verify:**
   - Check all files uploaded
   - Verify folder structure matches

### WinSCP (Windows)

1. **New Session:**
   - File protocol: FTP or SFTP
   - Host name: your-ftp-server.com
   - User name: your-username
   - Password: your-password

2. **Upload:**
   - Left panel: Local files
   - Right panel: Remote server
   - Drag and drop folders

### Cyberduck (Mac/Windows)

1. **Open Connection:**
   - FTP or SFTP
   - Server: your-ftp-server.com
   - Username & Password

2. **Upload:**
   - Navigate to web root
   - Drag folders from Finder/Explorer

---

## ✅ POST-UPLOAD CHECKLIST

After uploading, verify:

### File Permissions
```
Folders: 755 (rwxr-xr-x)
Files: 644 (rw-r--r--)
```

**Set permissions via FTP client or command:**
```bash
# Via SSH
find /path/to/public_html -type d -exec chmod 755 {} \;
find /path/to/public_html -type f -exec chmod 644 {} \;
```

### Verify Files Uploaded
```
✅ index.html exists
✅ marketplace-templates/lifestyle-bold.css exists
✅ assets/js/config.js exists
✅ All HTML files present
✅ All asset folders present
```

### Test URLs
```
✅ https://yourdomain.com/ (homepage)
✅ https://yourdomain.com/shop.html
✅ https://yourdomain.com/about-us.html
✅ https://yourdomain.com/contact-us.html
✅ https://yourdomain.com/cart.html
```

---

## 📊 UPLOAD SIZE ESTIMATE

```
Total Size: ~15-25 MB

Breakdown:
- HTML files: ~2 MB
- CSS files: ~500 KB
- JavaScript files: ~1 MB
- Images: ~10-20 MB
- Other assets: ~2 MB
```

**Upload Time Estimate:**
- Fast connection (10 Mbps): 2-3 minutes
- Medium connection (5 Mbps): 5-7 minutes
- Slow connection (1 Mbps): 15-20 minutes

---

## 🔍 TROUBLESHOOTING

### Files Not Showing Up
- Check you're in the correct directory (public_html or www)
- Verify file permissions (644 for files, 755 for folders)
- Clear browser cache
- Check .htaccess file uploaded

### CSS Not Loading
- Verify `marketplace-templates/` folder uploaded
- Check file path in HTML: `/marketplace-templates/lifestyle-bold.css`
- Check file permissions
- Clear browser cache

### Images Not Loading
- Verify `assets/images/` folder uploaded
- Check image paths in HTML
- Verify file permissions

### 404 Errors
- Check file names match exactly (case-sensitive on Linux servers)
- Verify .htaccess file uploaded
- Check web root directory is correct

---

## 🎯 QUICK START COMMAND

**One-line upload (if you have lftp):**

```bash
lftp -e "mirror -R docs/ /public_html/; mirror -R marketplace-templates/ /public_html/marketplace-templates/; bye" -u username,password ftp://your-ftp-server.com
```

---

## 📝 UPLOAD LOG TEMPLATE

Keep track of your upload:

```
Date: ___________
Time Started: ___________
FTP Server: ___________
Upload Method: ___________

Files Uploaded:
✅ Core HTML pages (7)
✅ Design system files
✅ Assets folder
✅ Templates folder
✅ Other pages

Time Completed: ___________
Total Time: ___________

Verification:
✅ Homepage loads
✅ CSS applies correctly
✅ Navigation works
✅ Images load
✅ No 404 errors

Notes:
_________________________________
_________________________________
```

---

## 🚀 READY TO UPLOAD!

**Your files are in:**
- `docs/` folder → Upload to FTP root
- `marketplace-templates/` folder → Upload to FTP root

**Recommended FTP Clients:**
- FileZilla (Free, Cross-platform)
- WinSCP (Free, Windows)
- Cyberduck (Free, Mac/Windows)
- Transmit (Paid, Mac)

**After Upload:**
1. Visit your domain
2. Check homepage loads with new design
3. Test navigation
4. Verify all pages work
5. Check mobile responsive

**You're ready to go live!** 🎉

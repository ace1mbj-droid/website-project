# Project Folder Structure

This project is organized into clearly separated folders for easy deployment and maintenance.

## 📁 Folder Organization

### ✅ FTP-UPLOAD/
**Purpose:** Production-ready files for FTP upload to your web server

**Contents:**
- All HTML pages (index.html, about-us.html, etc.)
- /assets/ folder (CSS, JS, images, fonts, data)
- /templates/ folder (reusable components)
- Configuration files (.htaccess, manifest.webmanifest, sw.js)
- PHP files (contact-handler.php)

**Action:** Upload ONLY this folder's contents to your web server via FTP

---

### ❌ DO-NOT-UPLOAD/
**Purpose:** Documentation, credentials, and development files

**Contents:**
- Documentation files (*.md)
- Security guides and credentials
- Setup instructions
- Environment examples (.env.example)
- Backup files
- Development notes

**Action:** Keep these files LOCAL ONLY - Never upload to production server

---

### 📦 website/
**Purpose:** Working copy / backup of the website

**Contents:**
- Mirror of website files
- May contain additional development files
- Used for testing and backup purposes

**Action:** Reference only - use FTP-UPLOAD/ for deployment

---

## 🚀 Deployment Instructions

### To Upload Your Website:

1. **Connect to your FTP server** using FileZilla or similar FTP client

2. **Navigate to your web root** (usually `public_html/` or `www/`)

3. **Upload ONLY the contents** of the `FTP-UPLOAD/` folder:
   ```
   FTP-UPLOAD/
   ├── index.html
   ├── about-us.html
   ├── ace-gallery.html
   ├── contact-us.html
   ├── cart.html
   ├── checkout.html
   ├── login.html
   ├── register.html
   ├── profile.html
   ├── product-detail.html
   ├── order-confirmation.html
   ├── thank-you.html
   ├── admin.html
   ├── admin-panel.html
   ├── contact-handler.php
   ├── manifest.webmanifest
   ├── sw.js
   ├── .htaccess
   ├── /assets/
   │   ├── /css/
   │   ├── /js/
   │   ├── /images/
   │   ├── /fonts/
   │   └── /data/
   └── /templates/
   ```

4. **Verify** all files uploaded successfully

5. **Test** your website at your domain

---

## 🔒 Security Notes

- **NEVER** upload files from `DO-NOT-UPLOAD/` folder
- **NEVER** upload `.env` files with real credentials
- **NEVER** upload documentation files (*.md)
- **ALWAYS** keep credentials and sensitive data local

---

## 📝 File Checklist

### ✅ Safe to Upload (in FTP-UPLOAD/)
- ✅ HTML files
- ✅ CSS files
- ✅ JavaScript files
- ✅ Images (jpg, png, svg, webp)
- ✅ Fonts (woff, woff2, ttf)
- ✅ JSON data files
- ✅ .htaccess
- ✅ manifest.webmanifest
- ✅ sw.js (service worker)
- ✅ PHP files (contact-handler.php)

### ❌ Never Upload
- ❌ .md files (documentation)
- ❌ .env files (environment variables)
- ❌ .git folder
- ❌ node_modules/
- ❌ Credential files
- ❌ Setup instructions
- ❌ Development notes
- ❌ Backup files
- ❌ .DS_Store (Mac system files)

---

## 🎨 Recent Updates

### Color Theme Update
The website now features a modern blue-purple gradient color scheme:
- Primary: #6366F1 → #8B5CF6
- Accent Coral: #F97316
- Accent Teal: #14B8A6
- Clean neutral palette with 10 shades

### Layout Updates
- Logo resized to 30px across all pages
- YouTube videos moved from Shop to Gallery page
- Product cards redesigned to square format with descriptions
- Enhanced shadows and hover effects
- Improved responsive design

---

## 📞 Support

For questions or issues:
- Email: hello@ace1.in
- Phone: 9167575028

---

**Last Updated:** November 10, 2025
**Version:** 2.0 - Modern Color Theme

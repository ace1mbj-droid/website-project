# FTP Upload Checklist - Quick Reference

## 🚀 Files to Upload (Priority Order)

### ✅ PRIORITY 1: New Security Files (Upload First!)
```
[ ] /assets/js/crypto-utils.js          (NEW - 6 KB)
[ ] /assets/js/env-config.js            (NEW - 5 KB)
[ ] /assets/js/auth.js                  (UPDATED - 13 KB)
```

### ✅ PRIORITY 2: All JavaScript Files
```
[ ] /assets/js/cart.js
[ ] /assets/js/config.js
[ ] /assets/js/paytm-config.js
```

### ✅ PRIORITY 3: CSS Files
```
[ ] /assets/css/modern-marketplace.css
```

### ✅ PRIORITY 4: HTML Files (16 files)
```
[ ] /index.html
[ ] /our-products.html
[ ] /ace-gallery.html
[ ] /about-us.html
[ ] /contact-us.html
[ ] /marketplace.html
[ ] /shop.html
[ ] /checkout.html
[ ] /login.html
[ ] /admin-panel.html
[ ] /contact-styled.html
[ ] /simple-contact.html
[ ] /debug-form.html
[ ] /secure-page-template.html         (NEW)
```

### ✅ PRIORITY 5: PWA Files
```
[ ] /manifest.webmanifest
[ ] /sw.js
```

### ⚠️ OPTIONAL: Documentation
```
[ ] /SECURITY_QUICK_FIX.md             (NEW - if you want it on server)
[ ] /FTP_DEPLOYMENT_GUIDE.md           (NEW - if you want it on server)
```

## 🚫 DO NOT UPLOAD

```
❌ /.env                                (SECRETS - NEVER UPLOAD!)
❌ /ADMIN_CREDENTIALS.md                (SECRETS - NEVER UPLOAD!)
❌ /.DS_Store                           (System file)
❌ /.gitignore                          (Git config)
❌ /server.log                          (Log file)
```

## 📋 Quick Upload Steps

### Using FileZilla:
1. Open FileZilla
2. Enter your FTP details (Host, Username, Password)
3. Connect
4. Navigate to `/public_html` or `/htdocs` on server
5. Drag files from left (local) to right (remote)

### Using Cyberduck:
1. Open Cyberduck
2. Click "Open Connection"
3. Select FTP or SFTP
4. Enter server, username, password
5. Connect and drag files to upload

### Using Command Line:
```bash
# Make script executable
chmod +x /Users/jai_das13/Development/website-project/prepare-ftp-upload.sh

# Run preparation script
/Users/jai_das13/Development/website-project/prepare-ftp-upload.sh

# Files will be copied to: /Users/jai_das13/Development/website-project/ftp-ready
# Upload that entire directory to your FTP server
```

## ✅ Post-Upload Testing

After uploading files, test:

```
[ ] Website loads correctly
[ ] Open browser DevTools (F12)
[ ] Check Console for: "✅ Crypto utilities loaded"
[ ] Check Console for: "✅ Environment configuration loaded"
[ ] Try logging in - should work
[ ] Check localStorage - should be encrypted
[ ] Try 5 wrong passwords - should get locked out
```

## 📊 File Sizes

Total upload size (excluding external resources):
- New files: ~24 KB
- All HTML: ~500 KB (approximate)
- All JS: ~200 KB (approximate)
- Total core files: **~700 KB**

External resources (if needed):
- Images/Media: Varies (already on server?)
- Fonts: ~100 KB
- **Upload only if missing or updated**

## 🔧 After Upload - HTML Updates Needed

Add these lines to each HTML file (before `</body>`):

```html
<script src="/assets/js/crypto-utils.js"></script>
<script src="/assets/js/env-config.js"></script>
<script src="/assets/js/auth.js"></script>
```

Pages that MUST be updated:
```
[ ] /index.html
[ ] /login.html
[ ] /admin-panel.html
[ ] /marketplace.html
[ ] /shop.html
[ ] /checkout.html
```

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Permission denied | Check FTP credentials, file permissions |
| File not showing | Clear browser cache (Ctrl+Shift+R) |
| Script 404 error | Check file path, ensure uploaded |
| Encryption not working | Check script load order in HTML |
| Login broken | Check browser console for errors |

## ⏱️ Estimated Upload Time

With average broadband (10 Mbps):
- Core files (~700 KB): **~1 minute**
- With external resources: **5-10 minutes**

## 📞 FTP Server Info

Your hosting provider should give you:
```
Host: ftp.yoursite.com (or IP address)
Username: your_username
Password: your_password
Port: 21 (FTP) or 22 (SFTP)
Directory: /public_html or /htdocs or /www
```

## ✅ Final Checklist

Before closing FTP client:

```
[ ] All priority 1 files uploaded
[ ] All HTML files uploaded
[ ] All JS files uploaded
[ ] Checked server directory structure matches local
[ ] No .env or ADMIN_CREDENTIALS.md on server
[ ] Browser cache cleared
[ ] Website tested and working
[ ] Console shows no errors
[ ] Login/registration works
[ ] Encryption verified in DevTools
```

---

**Total Time Estimate:** 10-15 minutes  
**Created:** November 9, 2025  
**Status:** ✅ Ready to Deploy

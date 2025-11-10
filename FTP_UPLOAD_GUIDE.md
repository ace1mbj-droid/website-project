# FTP Upload Guide - Ace#1 Website

## 📁 Source Folder
`/Users/jai_das13/Development/website-project/website/`

## ✅ What to Upload

### HTML Files (All)
- index.html
- about-us.html
- ace-gallery.html
- contact-us.html
- login.html
- register.html
- cart.html
- checkout.html
- profile.html
- admin.html
- admin-panel.html
- product-detail.html
- order-confirmation.html
- thank-you.html

### Folders (Entire Folders)
- `assets/` (CSS, JS, images)
- `css/` (if exists)
- `js/` (if exists)
- `templates/` (header/footer templates)
- `_DataURI/` (data files)
- `fonts.googleapis.com/`
- `fonts.gstatic.com/`
- `drive.google.com/`
- `img1.wsimg.com/` (if exists)
- `www.youtube.com/` (if exists)
- `maps.googleapis.com/` (if exists)
- Any image folders

### Important Files
- `.htaccess` (MUST upload!)
- `manifest.webmanifest` (if exists)
- `sw.js` (if exists)
- `contact-handler.php`

## ❌ DO NOT Upload

### Security Files (DANGEROUS!)
- ❌ `ADMIN_CREDENTIALS.md` - Contains passwords!
- ❌ `.env` or `.env.example`
- ❌ Any files with "CREDENTIALS" in name

### System Files
- ❌ `.DS_Store`
- ❌ `.gitignore`
- ❌ `.backup-20251110/` folder
- ❌ Any `.git` folders

### Documentation Files
- ❌ All `.md` files (except README if you want it)
- ❌ `DESIGN_SYSTEM.md`
- ❌ `FTP_DEPLOYMENT_GUIDE.md`
- ❌ `AUDIT_SUMMARY.md`
- ❌ etc.

## 🔒 FileZilla Settings

### Connection
- **Protocol:** FTP or SFTP (prefer SFTP for security)
- **Host:** your-server.com
- **Username:** your-ftp-username
- **Password:** your-ftp-password
- **Port:** 21 (FTP) or 22 (SFTP)

### Transfer Settings
1. **Transfer Type:** Binary
2. **Create missing directories:** Yes
3. **Preserve timestamps:** Yes

## 📝 Upload Steps

1. **Connect to FTP server** via FileZilla
2. **Navigate to public_html** (or www, or httpdocs) folder on server
3. **Select files/folders** from the list above
4. **Drag & drop** OR right-click → Upload
5. **Verify** all files uploaded successfully
6. **Test website** by visiting your domain

## ⚡ Quick Command (Alternative)

If you want to create a clean upload folder:

```bash
cd /Users/jai_das13/Development/website-project
mkdir -p website-ftp-upload
cp -r website/*.html website-ftp-upload/
cp -r website/assets website-ftp-upload/
cp -r website/css website-ftp-upload/
cp -r website/js website-ftp-upload/
cp -r website/templates website-ftp-upload/
cp -r website/_DataURI website-ftp-upload/
cp -r website/fonts.* website-ftp-upload/
cp -r website/drive.google.com website-ftp-upload/
cp website/.htaccess website-ftp-upload/
cp website/contact-handler.php website-ftp-upload/
```

Then upload the entire `website-ftp-upload/` folder.

## ✅ Post-Upload Checklist

- [ ] Homepage loads (/)
- [ ] About page works (/about-us.html)
- [ ] Contact form works (/contact-us.html)
- [ ] Gallery loads (/ace-gallery.html)
- [ ] Login page works (/login.html)
- [ ] CSS loads (check if styled correctly)
- [ ] JavaScript works (check cart, search)
- [ ] Images display
- [ ] Mobile responsive

## 🆘 Troubleshooting

**CSS not loading?**
- Check file permissions (should be 644)
- Verify paths in HTML files start with `/`

**PHP form not working?**
- Check PHP is enabled on server
- Verify contact-handler.php uploaded

**404 errors?**
- Ensure .htaccess uploaded
- Check file names are exact (case-sensitive)

---

**Ready to upload!** 🚀

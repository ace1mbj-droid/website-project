# 🎯 Quick Reference - Folder Organization

## Simple Rule

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  FTP-UPLOAD/     →  ✅ UPLOAD TO SERVER                │
│                                                         │
│  DO-NOT-UPLOAD/  →  ❌ KEEP LOCAL ONLY                 │
│                                                         │
│  website/        →  📦 BACKUP/REFERENCE                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## What's Where?

### 📤 FTP-UPLOAD/ (Production Files)
```
✅ Upload everything in this folder to your web server

Contains:
• All website pages (.html)
• Styles (.css) - NEW COLOR THEME
• Scripts (.js)
• Images (.jpg, .png, .svg)
• Data files (.json)
• Config files (.htaccess, manifest, sw.js)
• PHP files (.php)
```

### 🔒 DO-NOT-UPLOAD/ (Documentation & Secrets)
```
❌ Never upload these to your server

Contains:
• Documentation (.md files)
• Credentials (ADMIN_CREDENTIALS.md)
• Security guides
• Setup instructions
• Environment examples (.env.example)
• Backup files
• Development notes
```

### 📦 website/ (Backup Copy)
```
📋 Reference only - use FTP-UPLOAD/ for deployment

Contains:
• Working copy of website
• May have additional dev files
• Use for testing/backup
```

---

## 🚀 Upload Process (3 Steps)

### Step 1: Open FTP Client
```
FileZilla or similar FTP software
```

### Step 2: Connect to Server
```
Host: ftp.yourdomain.com
Username: your_username
Password: your_password
Port: 21
```

### Step 3: Upload Files
```
Local:  FTP-UPLOAD/*
Server: public_html/ (or www/)

Drag & Drop → Done!
```

---

## ✅ Upload Checklist

```
Before Upload:
☐ FTP credentials ready
☐ FileZilla installed
☐ Backup existing site (if any)

During Upload:
☐ Upload ALL files from FTP-UPLOAD/
☐ Maintain folder structure
☐ Wait for completion (56 files)

After Upload:
☐ Test website loads
☐ Check all pages work
☐ Verify images display
☐ Test admin panel
☐ Test on mobile
```

---

## 🎨 Recent Changes

### November 10, 2025 Update
```
✨ New Color Theme
   • Blue-purple gradient (#6366F1 → #8B5CF6)
   • Modern, professional look
   • Perfect for shoes marketplace

📐 Layout Updates
   • Logo: 30px height (all pages)
   • Videos: Moved to Gallery page
   • Products: Square cards with descriptions
   • Enhanced: Shadows and hover effects
```

---

## 🔐 Admin Access

```
URL:      https://yourdomain.com/admin-panel.html
Email:    hello@ace1.in
Password: Mobilaeiou@9898
```

---

## 📞 Quick Support

```
Phone: 9167575028
Email: hello@ace1.in
```

---

## 📚 More Information

For detailed guides, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `FOLDER_STRUCTURE.md` - Detailed folder organization
- `FTP_UPLOAD_GUIDE.md` - FTP upload tutorial
- `DO-NOT-UPLOAD/` - All documentation files

---

## ⚡ TL;DR

```
1. Open FileZilla
2. Connect to your server
3. Upload FTP-UPLOAD/* to public_html/
4. Done! Visit yourdomain.com
```

**That's it! Your website is live! 🎉**

---

**Last Updated:** November 10, 2025  
**Version:** 2.0

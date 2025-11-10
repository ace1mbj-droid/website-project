# Ace#1 Health & Wellness Website

> Modern e-commerce website for premium health and wellness shoes

![Version](https://img.shields.io/badge/version-2.0-blue)
![Status](https://img.shields.io/badge/status-production%20ready-success)
![Updated](https://img.shields.io/badge/updated-Nov%202025-orange)

---

## 🎯 Quick Start

### For Deployment (Upload to Server)
```bash
1. Open FileZilla (or your FTP client)
2. Connect to your web server
3. Upload contents of FTP-UPLOAD/ folder
4. Visit your domain - Done!
```

📖 **Detailed Guide:** See `DEPLOYMENT_GUIDE.md`

---

## 📁 Project Structure

```
website-project/
│
├── 📤 FTP-UPLOAD/          ← Upload these files to your server
│   ├── index.html          (Homepage)
│   ├── ace-gallery.html    (Gallery with videos)
│   ├── about-us.html       (About page)
│   ├── contact-us.html     (Contact form)
│   ├── [12 more pages]
│   └── assets/             (CSS, JS, images, data)
│
├── 🔒 DO-NOT-UPLOAD/       ← Keep local (documentation & credentials)
│   ├── ADMIN_CREDENTIALS.md
│   ├── SECURITY_AUDIT_REPORT.md
│   └── [documentation files]
│
├── 📦 website/             ← Backup/working copy
│
└── 📚 Documentation Files
    ├── DEPLOYMENT_GUIDE.md      (Complete deployment guide)
    ├── FOLDER_STRUCTURE.md      (Folder organization)
    ├── QUICK_REFERENCE.md       (Quick reference)
    └── FTP_UPLOAD_GUIDE.md      (FTP upload tutorial)
```

---

## ✨ Latest Updates (v2.0 - Nov 10, 2025)

### 🎨 New Color Theme
- **Primary:** Blue-purple gradient (#6366F1 → #8B5CF6)
- **Accents:** Coral (#F97316), Teal (#14B8A6), Pink (#EC4899)
- **Style:** Modern, professional, perfect for shoes marketplace

### 📐 Layout Improvements
- ✅ Logo resized to 30px (consistent across all pages)
- ✅ YouTube videos moved from Shop to Gallery page
- ✅ Product cards redesigned to square format (1:1 ratio)
- ✅ Product descriptions added below titles
- ✅ Enhanced shadows and hover effects
- ✅ Improved responsive design

---

## 🚀 Features

### 🛒 E-Commerce
- 12 products with images and descriptions
- Shopping cart functionality
- Multiple payment methods (UPI, Card, COD)
- Product ratings and reviews
- Stock management

### 👤 User Features
- User registration and login
- Secure authentication (AES-256 encryption)
- User profiles
- Order history
- Product reviews and ratings

### 🎥 Content
- YouTube video gallery (3 videos)
- Product demonstrations
- Customer testimonials
- About and contact pages

### 🔐 Admin Panel
- Product management
- Image editing (via URL)
- Price updates
- Stock management
- Inventory statistics

### 📱 Technical
- Responsive design (mobile, tablet, desktop)
- PWA support (offline access)
- Service worker caching
- Modern UI/UX
- Fast loading

---

## 📊 Website Stats

| Metric | Value |
|--------|-------|
| **Total Files** | 56 files |
| **Total Size** | ~4.1 MB |
| **HTML Pages** | 14 pages |
| **Products** | 12 products |
| **Product Images** | 6 high-quality photos |
| **CSS Files** | 4 stylesheets |
| **JS Files** | 7 scripts |

---

## 🔐 Admin Access

```
URL:      https://yourdomain.com/admin-panel.html
Email:    hello@ace1.in
Password: Mobilaeiou@9898
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step deployment instructions |
| `FOLDER_STRUCTURE.md` | Detailed folder organization and file structure |
| `QUICK_REFERENCE.md` | Quick reference for common tasks |
| `FTP_UPLOAD_GUIDE.md` | FTP upload tutorial with screenshots |
| `SECURITY_PAYMENT_STATUS.md` | Security and payment information |

**All documentation in:** `DO-NOT-UPLOAD/` folder

---

## ✅ Pre-Deployment Checklist

### Before Upload
- [ ] FTP credentials ready
- [ ] FileZilla (or FTP client) installed
- [ ] Hosting account active
- [ ] Sufficient disk space (4.1 MB minimum)
- [ ] Backup existing website (if any)

### After Upload
- [ ] All files uploaded successfully (56 files)
- [ ] Website loads at your domain
- [ ] All pages accessible
- [ ] Product images display correctly
- [ ] Admin panel works
- [ ] Contact form works
- [ ] Shopping cart functions
- [ ] Mobile responsive

---

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Modern CSS)
- Vanilla JavaScript (ES6+)
- No frameworks or dependencies

### Security
- AES-256-GCM encryption
- SHA-256 password hashing
- PBKDF2 with 100,000 iterations
- XSS & CSRF protection
- Rate limiting

### Storage
- localStorage (encrypted)
- JSON data files
- Can upgrade to server-side database

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎯 Pages Overview

### Public Pages
- `index.html` - Homepage (Step Up Health)
- `ace-gallery.html` - Gallery with YouTube videos
- `about-us.html` - About company
- `contact-us.html` - Contact form
- `product-detail.html` - Product details
- `cart.html` - Shopping cart
- `checkout.html` - Checkout page
- `order-confirmation.html` - Order confirmation
- `thank-you.html` - Thank you page

### User Pages
- `login.html` - User login
- `register.html` - User registration
- `profile.html` - User profile with ratings

### Admin Pages
- `admin.html` - Admin interface
- `admin-panel.html` - Admin dashboard

---

## 📞 Support & Contact

**Business Contact:**
- Phone: 9167575028
- Email: hello@ace1.in
- UPI: paytmqr5na93v@ptys

**Technical Support:**
- Check documentation in `DO-NOT-UPLOAD/` folder
- Review `SECURITY_AUDIT_REPORT.md`
- See `TROUBLESHOOTING.md` (if available)

---

## 🔄 Making Updates

### To Update Website:
1. Edit files locally in `FTP-UPLOAD/` folder
2. Test changes locally
3. Upload only changed files via FTP
4. Clear browser cache to see changes

### To Update Products:
1. Login to admin panel
2. Click "Edit" on product
3. Update details (name, price, image, description)
4. Click "Save Changes"

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-main: #6366F1      /* Indigo */
--primary-light: #818CF8     /* Light Indigo */
--primary-dark: #4F46E5      /* Dark Indigo */
```

### Accent Colors
```css
--accent-coral: #F97316      /* Orange */
--accent-teal: #14B8A6       /* Teal */
--accent-pink: #EC4899       /* Pink */
```

### Neutral Colors
```css
--neutral-50: #FAFAFA        /* Lightest */
--neutral-900: #171717       /* Darkest */
```

---

## 📈 Future Enhancements

Potential upgrades:
- [ ] Backend database (MySQL/PostgreSQL)
- [ ] Email notifications
- [ ] Order management system
- [ ] Customer support chat
- [ ] Analytics dashboard
- [ ] Inventory automation
- [ ] Multi-language support
- [ ] Advanced search filters

---

## 📄 License

See `LICENSE` file for details.

---

## 🎉 Ready to Deploy!

Your Ace#1 website is **production-ready** with:
- ✅ Modern design with new color theme
- ✅ Responsive layout
- ✅ E-commerce functionality
- ✅ User authentication
- ✅ Admin dashboard
- ✅ Security features
- ✅ PWA support

**Simply upload `FTP-UPLOAD/` contents to your server and go live!**

---

## 📚 Quick Links

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Folder Structure](FOLDER_STRUCTURE.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [FTP Upload Guide](FTP_UPLOAD_GUIDE.md)
- [Security Status](SECURITY_PAYMENT_STATUS.md)

---

**Version:** 2.0 - Modern Color Theme  
**Last Updated:** November 10, 2025  
**Status:** Production Ready ✅

---

Made with ❤️ for Ace#1 Health & Wellness

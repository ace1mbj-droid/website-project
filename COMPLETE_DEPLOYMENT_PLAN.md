# 🚀 Complete Deployment Plan - Ace#1 Website

## Overview
This guide covers: Updating remaining pages → Deploying backend → Testing live site

---

## PHASE 1: Update Remaining Pages (30 minutes)

### Pages to Update (11 remaining)

**Shopping Flow:**
- checkout.html
- product-detail.html  
- order-confirmation.html
- thank-you.html

**User Account:**
- user-dashboard.html
- profile.html

**Information:**
- ace-gallery.html
- track-order.html

**Others:**
- [Any additional pages]

### Quick Update Process (2-3 min per page)

For each page, make these 3 changes:

#### 1. Update CSS Link
Find:
```html
<link rel="stylesheet" href="/assets/css/marketplace-theme.css">
<!-- or -->
<link rel="stylesheet" href="/assets/css/marketplace.css">
```

Replace with:
```html
<link rel="stylesheet" href="/marketplace-templates/lifestyle-bold.css">
```

#### 2. Replace Navigation
Find the `<header>` or `<nav>` section and replace with:

```html
<nav class="navbar">
    <div class="nav-content">
        <div class="logo" onclick="window.location.href='/'">ACE<span class="logo-accent">#1</span></div>
        <div class="nav-menu">
            <a href="/" class="nav-item">Shop</a>
            <a href="/ace-gallery.html" class="nav-item">Lifestyle</a>
            <a href="/about-us.html" class="nav-item">About</a>
            <a href="/contact-us.html" class="nav-item">Contact</a>
        </div>
        <div class="nav-actions">
            <button class="icon-btn" onclick="toggleSearch()">🔍</button>
            <button class="icon-btn">❤️</button>
            <a href="/cart.html" class="icon-btn cart-btn">
                🛒
                <span class="badge cart-count" style="display: none;">0</span>
            </a>
            <button class="btn-primary" onclick="handleJoinUs()">Join Us</button>
        </div>
    </div>
</nav>
```

#### 3. Replace Footer & Add Scripts
Find the `<footer>` section and replace with:

```html
<footer class="footer">
    <div class="footer-content">
        <div class="footer-col">
            <h4>ACE#1</h4>
            <p>Live Bold, Live Well</p>
        </div>
        <div class="footer-col">
            <h4>Shop</h4>
            <a href="/shop.html">All Products</a>
            <a href="/shop.html">New Arrivals</a>
            <a href="/shop.html">Best Sellers</a>
        </div>
        <div class="footer-col">
            <h4>Support</h4>
            <a href="/contact-us.html">Contact</a>
            <a href="/about-us.html">FAQs</a>
            <a href="/track-order.html">Track Order</a>
        </div>
        <div class="footer-col">
            <h4>Follow Us</h4>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 Ace#1. All rights reserved.</p>
    </div>
</footer>

<!-- Add before closing </body> tag -->
<script src="/marketplace-templates/lifestyle-bold.js"></script>
<script>
function handleJoinUs() {
    const isLoggedIn = localStorage.getItem('authToken');
    window.location.href = isLoggedIn ? '/user-dashboard.html' : '/register.html';
}
function toggleSearch() {
    const searchTerm = prompt('What are you looking for?');
    if (searchTerm) window.location.href = `/shop.html?search=${encodeURIComponent(searchTerm)}`;
}
</script>
```

---

## PHASE 2: Deploy Backend (Railway - Recommended)

### Option A: Deploy to Railway (Easiest)

#### Step 1: Sign Up for Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)
4. Free tier: 500 hours/month, 512MB RAM

#### Step 2: Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ace#1 website with backend"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/ace1-website.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy Backend on Railway
1. In Railway dashboard: "New Project" → "Deploy from GitHub repo"
2. Select your repository
3. Railway auto-detects Node.js
4. Select the `backend` folder as root directory

#### Step 4: Add MySQL Database
1. In Railway project: Click "New" → "Database" → "MySQL"
2. Railway automatically creates database
3. Environment variables are auto-set

#### Step 5: Set Environment Variables
In Railway dashboard → Backend service → Variables, add:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_random_string_min_32_characters_here
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your_32_character_encryption_key_here
FRONTEND_URL=https://yourdomain.com
```

**Generate secure keys:**
```bash
# For JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For ENCRYPTION_KEY (exactly 32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

#### Step 6: Run Database Migrations
In Railway dashboard → Backend service → Settings:

**Custom Start Command:**
```bash
node migrations/run.js && node src/app.js
```

Or run manually via Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run node migrations/run.js
```

#### Step 7: Get Your Backend URL
Railway provides a URL like:
```
https://ace1-backend-production.up.railway.app
```

Copy this URL!

#### Step 8: Update Frontend API Configuration
Edit `docs/assets/js/config.js`:

```javascript
// Replace this line:
const API_BASE_URL = 'https://your-backend-url.railway.app';

// With your actual Railway URL:
const API_BASE_URL = 'https://ace1-backend-production.up.railway.app';
```

---

### Option B: Deploy to Render (Alternative)

#### Step 1: Sign Up for Render
1. Go to https://render.com
2. Sign up with GitHub
3. Free tier: 750 hours/month

#### Step 2: Create Web Service
1. Dashboard → "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: ace1-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node migrations/run.js && node src/app.js`
   - **Plan**: Free

#### Step 3: Add Database
1. Dashboard → "New" → "PostgreSQL"
2. Name: ace1-database
3. Plan: Free
4. Render auto-connects to web service

**Note**: You'll need to convert MySQL to PostgreSQL or use a MySQL add-on

#### Step 4: Set Environment Variables
Same as Railway (see above)

#### Step 5: Get Backend URL
Render provides:
```
https://ace1-backend.onrender.com
```

Update `docs/assets/js/config.js` with this URL.

---

## PHASE 3: Upload to FTP

### Files to Upload

```
# Updated HTML Pages (7 core + 11 remaining = 18 total)
docs/index.html
docs/shop.html
docs/about-us.html
docs/contact-us.html
docs/cart.html
docs/login.html
docs/register.html
docs/checkout.html
docs/product-detail.html
docs/order-confirmation.html
docs/thank-you.html
docs/user-dashboard.html
docs/profile.html
docs/ace-gallery.html
docs/track-order.html

# Design System
marketplace-templates/lifestyle-bold.css
marketplace-templates/lifestyle-bold.js

# Configuration (with updated API URL)
docs/assets/js/config.js

# Templates
docs/templates/nav-lifestyle.html
docs/templates/footer-lifestyle.html

# Existing assets (if not already uploaded)
docs/assets/
```

### FTP Upload Steps
1. Connect to your FTP server
2. Navigate to your web root (public_html or www)
3. Upload all files maintaining directory structure
4. Verify file permissions (755 for directories, 644 for files)

---

## PHASE 4: Test Live Site

### Pre-Launch Checklist

#### 1. Basic Functionality
- [ ] Homepage loads without errors
- [ ] Navigation works on all pages
- [ ] Footer links work
- [ ] Mobile responsive (test on phone)
- [ ] Images load correctly

#### 2. Design Consistency
- [ ] ACE#1 logo displays correctly
- [ ] Colors match (Orange #FF6B35, Gold #F7B801)
- [ ] Typography is consistent
- [ ] Buttons have hover effects
- [ ] Cards display properly

#### 3. Page-Specific Tests

**Homepage:**
- [ ] Hero section displays
- [ ] Lifestyle grid loads
- [ ] Featured products show
- [ ] "Join the Movement" banner works

**Shop Page:**
- [ ] Products load from JSON
- [ ] Filters work
- [ ] Sort options work
- [ ] Product cards clickable

**About Page:**
- [ ] Content displays correctly
- [ ] Stats section shows
- [ ] Values cards display

**Contact Page:**
- [ ] Form displays
- [ ] Form submission works (FormSpree)
- [ ] Contact info shows

**Cart:**
- [ ] Add to cart works
- [ ] Quantity controls work
- [ ] Remove items works
- [ ] Total calculates correctly
- [ ] Checkout button works

**Login/Register:**
- [ ] Forms display correctly
- [ ] Validation works
- [ ] Submit buttons work
- [ ] Redirect after login works

#### 4. Backend Integration Tests (if deployed)

**API Connection:**
```bash
# Test health endpoint
curl https://your-backend-url.railway.app/health

# Should return: {"status":"ok"}
```

**Frontend to Backend:**
- [ ] Open browser console (F12)
- [ ] Check for API calls
- [ ] Verify no CORS errors
- [ ] Test login/register
- [ ] Test adding products (if admin)

#### 5. Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] No broken links

#### 6. Cross-Browser Tests
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## PHASE 5: Post-Launch Tasks

### 1. Monitor Backend
- Check Railway/Render logs for errors
- Monitor database connections
- Watch for failed API calls

### 2. Set Up Analytics (Optional)
Add Google Analytics or similar to track:
- Page views
- User behavior
- Conversion rates

### 3. Enable SSL
Most hosts offer free SSL (Let's Encrypt):
- Go to hosting control panel
- Enable SSL for your domain
- Update all URLs to https://

### 4. Set Up Custom Domain for Backend (Optional)
**Railway:**
- Settings → Domains → Add custom domain
- Point CNAME: `api.yourdomain.com` → Railway URL

**Render:**
- Settings → Custom Domain
- Add `api.yourdomain.com`

### 5. Backup
- Backup your database regularly
- Keep local copy of all files
- Document any custom configurations

---

## Troubleshooting

### Issue: Backend Not Starting
**Solution:**
- Check Railway/Render logs
- Verify environment variables are set
- Check Node.js version (need 14+)
- Verify database connection

### Issue: CORS Errors
**Solution:**
Update `backend/src/app.js`:
```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'http://yourdomain.com'
  ],
  credentials: true
}));
```

### Issue: Database Connection Failed
**Solution:**
- Verify DATABASE_URL is set
- Check database is running
- Run migrations: `railway run node migrations/run.js`

### Issue: Frontend Can't Reach Backend
**Solution:**
- Verify API_BASE_URL in `config.js`
- Check backend is deployed and running
- Test backend URL directly in browser
- Check CORS settings

### Issue: Pages Not Loading
**Solution:**
- Check FTP upload completed
- Verify file paths are correct
- Check .htaccess file is uploaded
- Clear browser cache

---

## Quick Reference Commands

### Railway CLI
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# Run migrations
railway run node migrations/run.js

# Open dashboard
railway open
```

### Testing Commands
```bash
# Test backend health
curl https://your-backend-url/health

# Test API endpoint
curl https://your-backend-url/api/products

# Check backend logs
railway logs
# or
render logs
```

---

## Success Criteria

### ✅ Deployment Complete When:
- [ ] All pages uploaded via FTP
- [ ] Backend deployed to Railway/Render
- [ ] Database migrations run successfully
- [ ] Frontend API URL updated
- [ ] All pages load without errors
- [ ] Navigation works across all pages
- [ ] Cart functionality works
- [ ] Login/Register works
- [ ] Mobile responsive
- [ ] No console errors

---

## Timeline Estimate

- **Update Remaining Pages**: 30-40 minutes
- **Deploy Backend**: 20-30 minutes
- **Upload to FTP**: 15-20 minutes
- **Testing**: 30-45 minutes
- **Total**: 2-2.5 hours

---

## Support Resources

### Documentation
- `HYBRID_DEPLOYMENT_GUIDE.md` - Detailed backend deployment
- `WEBSITE_REDESIGN_COMPLETE.md` - Redesign summary
- `FINAL_REDESIGN_STATUS.md` - Current status

### External Resources
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Node.js Docs: https://nodejs.org/docs

---

## 🎉 You're Ready!

Follow this plan step by step and your complete website will be live with:
- ✨ Modern lifestyle-bold design
- 🚀 Full backend functionality
- 📱 Mobile-responsive pages
- 🔒 Secure authentication
- 💳 Payment processing ready
- 📊 Database integration

**Good luck with your deployment!** 🚀

# 🎨 Update All Pages to Lifestyle Bold Design

## Quick Start

I've prepared everything you need to update your entire website to the lifestyle-bold design.

## What's Been Done

### ✅ Completed
1. **Homepage (index.html)** - Fully redesigned with lifestyle-bold theme
2. **Navigation Template** - `docs/templates/nav-lifestyle.html`
3. **Footer Template** - `docs/templates/footer-lifestyle.html`
4. **Design System** - `marketplace-templates/lifestyle-bold.css`
5. **Interactions** - `marketplace-templates/lifestyle-bold.js`

### 📋 Pages That Need Updating

Each page needs these changes:

#### 1. Update CSS Reference
Replace:
```html
<link rel="stylesheet" href="/assets/css/marketplace-theme.css">
```

With:
```html
<link rel="stylesheet" href="/marketplace-templates/lifestyle-bold.css">
```

#### 2. Replace Navigation
Replace the entire `<header>` or `<nav>` section with the content from:
`docs/templates/nav-lifestyle.html`

#### 3. Replace Footer
Replace the entire `<footer>` section with the content from:
`docs/templates/footer-lifestyle.html`

#### 4. Add JavaScript
Before closing `</body>` tag, add:
```html
<script src="/marketplace-templates/lifestyle-bold.js"></script>
```

## Pages to Update

### Priority 1: Customer-Facing Pages
- [ ] shop.html
- [ ] product-detail.html
- [ ] cart.html
- [ ] checkout.html

### Priority 2: User Account Pages
- [ ] login.html
- [ ] register.html
- [ ] user-dashboard.html
- [ ] profile.html

### Priority 3: Information Pages
- [ ] about-us.html
- [ ] contact-us.html
- [ ] ace-gallery.html
- [ ] track-order.html

### Priority 4: Confirmation Pages
- [ ] order-confirmation.html
- [ ] thank-you.html

## Manual Update Steps

For each page:

1. **Open the HTML file**
2. **Update the `<head>` section:**
   ```html
   <link rel="stylesheet" href="/marketplace-templates/lifestyle-bold.css">
   ```

3. **Replace navigation** - Copy from `docs/templates/nav-lifestyle.html`

4. **Replace footer** - Copy from `docs/templates/footer-lifestyle.html`

5. **Add JavaScript before `</body>`:**
   ```html
   <script src="/marketplace-templates/lifestyle-bold.js"></script>
   ```

6. **Test the page** in browser

7. **Upload to FTP**

## Automated Approach

I can help you update pages one by one. Just tell me which page to update next, and I'll:
1. Read the current page
2. Apply the lifestyle-bold design
3. Preserve all functionality
4. Show you the changes

## Design Consistency Checklist

For each updated page, verify:
- [ ] Navigation bar matches homepage
- [ ] Footer matches homepage
- [ ] Colors match brand (Orange #FF6B35, Gold #F7B801)
- [ ] Buttons use new styles
- [ ] Typography is consistent
- [ ] Mobile responsive
- [ ] All links work
- [ ] JavaScript functions properly

## Testing Checklist

After updating all pages:
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Footer links work
- [ ] Shop page displays products
- [ ] Product detail page works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Login/Register works
- [ ] User dashboard works
- [ ] Mobile view works
- [ ] All forms submit correctly

## FTP Upload

After updating pages locally:

1. **Test locally first**
2. **Upload updated files via FTP:**
   - All updated HTML files
   - `/marketplace-templates/lifestyle-bold.css`
   - `/marketplace-templates/lifestyle-bold.js`
   - `/docs/templates/` folder

3. **Clear browser cache**
4. **Test live site**

## Rollback Plan

If something goes wrong:
- Backups are in `docs/backup-[timestamp]/`
- Simply re-upload old files via FTP
- Or use git to revert: `git checkout -- docs/`

## Need Help?

Just tell me:
- "Update shop.html" - I'll update that specific page
- "Update all customer pages" - I'll update shop, product-detail, cart, checkout
- "Show me the changes for X page" - I'll show you what will change

## Current Status

- ✅ Homepage: Complete
- ✅ Templates: Created
- ⏳ Other pages: Ready to update

**Ready to proceed? Tell me which page(s) to update first!**

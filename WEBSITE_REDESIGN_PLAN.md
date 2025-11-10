# 🎨 Website Redesign Plan - Lifestyle Bold Theme

## Overview
Converting entire Ace#1 website to the lifestyle-bold design theme.

## Pages to Update

### Public Pages
1. ✅ index.html - Homepage (in progress)
2. ⏳ about-us.html - About page
3. ⏳ contact-us.html - Contact page
4. ⏳ ace-gallery.html - Gallery page
5. ⏳ shop.html - Shop page
6. ⏳ product-detail.html - Product details
7. ⏳ cart.html - Shopping cart
8. ⏳ checkout.html - Checkout page
9. ⏳ track-order.html - Order tracking

### User Pages
10. ⏳ login.html - Login page
11. ⏳ register.html - Registration page
12. ⏳ user-dashboard.html - User dashboard
13. ⏳ profile.html - User profile
14. ⏳ order-confirmation.html - Order confirmation
15. ⏳ thank-you.html - Thank you page

### Admin Pages (Keep separate design)
- admin.html
- admin-panel.html
- admin-dashboard.html
- admin-dashboard-enhanced.html

## Design Components to Apply

### 1. Navigation Bar
- Bold logo: ACE#1
- Clean menu items
- Icon buttons (search, wishlist, cart)
- "Join Us" CTA button

### 2. Color Scheme
- Primary: #FF6B35 (Orange)
- Secondary: #F7B801 (Gold)
- Dark: #1A1A1D
- Accent: #004E89 (Navy)

### 3. Typography
- Bold, modern fonts
- Large hero titles
- Clean body text

### 4. Layout Style
- Full-width sections
- Grid-based layouts
- Card-based product displays
- Gradient overlays on images

### 5. Interactive Elements
- Smooth animations
- Hover effects
- Modern buttons
- Icon-based actions

## Implementation Strategy

### Phase 1: Core Pages (Priority)
1. Homepage (index.html)
2. Shop page (shop.html)
3. Product detail (product-detail.html)
4. Cart (cart.html)

### Phase 2: User Flow
5. Login/Register
6. Checkout
7. User dashboard
8. Order confirmation

### Phase 3: Supporting Pages
9. About us
10. Contact us
11. Gallery
12. Track order

## Files to Create/Update

### New Files
- `/docs/assets/css/lifestyle-bold-global.css` - Global styles
- `/docs/assets/js/lifestyle-bold.js` - Global interactions

### Update Files
- All HTML pages (navigation, footer, structure)
- Link to new CSS files
- Update JavaScript references

## Consistency Requirements

### All Pages Must Have:
1. Same navigation bar
2. Same footer
3. Same color scheme
4. Same typography
5. Same button styles
6. Same form styles
7. Same card styles
8. Responsive design

### Navigation Structure
```html
<nav class="navbar">
  <div class="nav-content">
    <div class="logo">ACE<span class="logo-accent">#1</span></div>
    <div class="nav-menu">
      <a href="/">Shop</a>
      <a href="/ace-gallery.html">Lifestyle</a>
      <a href="/about-us.html">About</a>
      <a href="/contact-us.html">Contact</a>
    </div>
    <div class="nav-actions">
      <button class="icon-btn">🔍</button>
      <button class="icon-btn">❤️</button>
      <a href="/cart.html" class="icon-btn cart-btn">🛒</a>
      <button class="btn-primary">Join Us</button>
    </div>
  </div>
</nav>
```

### Footer Structure
```html
<footer class="footer">
  <div class="footer-content">
    <div class="footer-col">
      <h4>ACE#1</h4>
      <p>Live Bold, Live Well</p>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <a href="#">All Products</a>
      <a href="#">New Arrivals</a>
      <a href="#">Best Sellers</a>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <a href="/contact-us.html">Contact</a>
      <a href="#">FAQs</a>
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
```

## Next Steps

1. Complete homepage redesign
2. Create global CSS file
3. Update all pages systematically
4. Test responsive design
5. Verify all links work
6. Test user flows
7. Deploy to FTP

---

**Status: In Progress**
**Started: Now**
**Target: Complete redesign of all public pages**

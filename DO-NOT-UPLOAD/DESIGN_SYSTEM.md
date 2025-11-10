# Ace#1 Design System

## Overview
Modern e-commerce design inspired by marketplace platforms with yellow/orange branding.

## Color Palette
```css
--primary-yellow: #FFB800
--primary-orange: #FF9500
--dark-bg: #2c3e50
--light-bg: #f8f9fa
--text-dark: #2d3748
--text-light: #718096
--border-color: #e2e8f0
--success-color: #48bb78
--error-color: #f56565
--discount-red: #FF3B30
```

## Typography
- Primary Font: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto')
- Header Font: "Abril Fatface" (for special headings)

## Components

### Header
- Yellow/orange gradient background
- Search bar with category dropdown
- Icon-based navigation (cart, wishlist, user)
- Dark navigation bar below header

### Footer
- Dark background (#2c3e50)
- Center-aligned links
- Copyright text

### Product Cards
- White background with shadow
- Discount badges (red, top-right)
- Product image with hover zoom
- Price with strikethrough for original
- Rating stars and sold count
- Progress bar for stock/sales

### Buttons
- Primary: Yellow background with dark text
- Hover: Orange background
- Border radius: 6px

## Page Structure

### Main Pages
1. **index.html** - Homepage with hero, features, testimonials
2. **shop.html** - Product listing with filters and grid
3. **about-us.html** - Company information
4. **contact-styled.html** - Contact form
5. **ace-gallery.html** - Image gallery

### Supporting Pages
- login.html, register.html - Authentication
- cart.html, checkout.html - Shopping flow
- product-detail.html - Individual product
- profile.html - User account
- admin.html, admin-panel.html - Admin interface

## Implementation Notes
- All pages should link to `/assets/css/marketplace-theme.css`
- Use header/footer templates from `/templates/` directory
- All pages preserved in `.backup-20251110/` directory
- No data lost during redesign

## Contact Information
- Phone: 9321486256
- Email: hello@ace1.in
- Location: Marine Lines, Mumbai, Maharashtra, India
- Hours: 09:00 AM – 05:00 PM

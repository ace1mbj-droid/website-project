# Ace#1 Logo Usage Guide

## Logo Variations

### 1. **ace-logo-full.svg** (400x120)
**Use for:** Website headers, email signatures, presentations
- Full horizontal layout with gradient background
- Gold accent badge
- Best for wide spaces

### 2. **ace-logo-square.svg** (200x200)
**Use for:** Social media profiles (Instagram, Facebook, LinkedIn)
- 1:1 aspect ratio
- Perfect for profile pictures
- Optimized for small sizes

### 3. **ace-favicon.svg** (64x64)
**Use for:** Browser favicons, app icons (16x16, 32x32, 64x64)
- Simplified design for tiny sizes
- Recognizable at small scales
- Add to your HTML: `<link rel="icon" type="image/svg+xml" href="/assets/images/ace-favicon.svg">`

### 4. **ace-logo-icon.svg** (100x100)
**Use for:** App icons, mobile apps, PWA icons
- Icon-only version
- Circular design
- Works well on any background

### 5. **ace-logo-horizontal-light.svg** (300x80)
**Use for:** Light/white backgrounds
- Transparent background
- Black text with gold accent
- Clean and minimal

### 6. **ace-logo-horizontal-dark.svg** (300x80)
**Use for:** Dark backgrounds, footers
- Transparent background
- White text with gold accent
- High contrast

### 7. **ace-logo-social-og.svg** (1200x630)
**Use for:** Open Graph images, social media shares, Twitter cards
- Optimized for Facebook, Twitter, LinkedIn shares
- 1200x630 recommended size
- Add to your HTML meta tags:
```html
<meta property="og:image" content="/assets/images/ace-logo-social-og.svg">
<meta name="twitter:image" content="/assets/images/ace-logo-social-og.svg">
```

## Color Palette

- **Primary Black:** #000000
- **Dark Gray:** #1a1a1a, #2a2a2a, #333333
- **Gold Accent:** #FFD700
- **White:** #FFFFFF

## Implementation Examples

### Favicon in HTML
```html
<link rel="icon" type="image/svg+xml" href="/assets/images/ace-favicon.svg">
<link rel="apple-touch-icon" href="/assets/images/ace-logo-icon.svg">
```

### Header Logo
```html
<img src="/assets/images/ace-logo-horizontal-dark.svg" alt="Ace#1 Logo" height="60">
```

### Social Media Meta Tags
```html
<!-- Open Graph -->
<meta property="og:image" content="https://yourdomain.com/assets/images/ace-logo-social-og.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://yourdomain.com/assets/images/ace-logo-social-og.svg">
```

## Best Practices

1. **Maintain aspect ratios** - Don't stretch or distort logos
2. **Minimum sizes:**
   - Favicon: 16x16px minimum
   - Icon: 48x48px minimum
   - Full logo: 200px width minimum
3. **Clear space** - Keep at least 20px padding around logos
4. **Backgrounds** - Use light version on light backgrounds, dark version on dark backgrounds
5. **File formats** - SVG is preferred for scalability; convert to PNG for platforms that don't support SVG

## Quick Reference

| Use Case | File | Size |
|----------|------|------|
| Website Header | ace-logo-horizontal-dark.svg | 300x80 |
| Browser Tab | ace-favicon.svg | 64x64 |
| Instagram Profile | ace-logo-square.svg | 200x200 |
| Facebook Share | ace-logo-social-og.svg | 1200x630 |
| Email Signature | ace-logo-full.svg | 400x120 |
| Mobile App Icon | ace-logo-icon.svg | 100x100 |
| Light Background | ace-logo-horizontal-light.svg | 300x80 |

## Need PNG versions?

To convert SVG to PNG for platforms that require it:
```bash
# Using ImageMagick or online converters
# Recommended sizes: 512x512, 1024x1024 for app stores
```

# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the "Ace#1" health-focused static website - a complete, deployment-ready Progressive Web Application (PWA). The site promotes health and wellness products/services with the tagline "Step Up Health."

## Architecture & Structure

### Project Type
- **Static HTML Website**: No build process required
- **Progressive Web App**: Includes service worker (`sw.js`) and web app manifest
- **Multi-page Site**: 5 main HTML pages with consistent navigation structure
- **External Asset Architecture**: Uses CDN-mirrored directory structure for all external resources

### Key Components

#### Core Pages
- `index.html` - Home page with hero section and main messaging
- `our-products.html` - Product showcase page
- `ace-gallery.html` - Image gallery page  
- `about-us.html` - Company information page
- `contact-us.html` - Contact information and forms

#### PWA Infrastructure
- `manifest.webmanifest` - Web app manifest defining PWA metadata
- `sw.js` - Service worker for offline functionality and caching

#### External Resource Directories
The project uses a unique architecture where external CDN resources are mirrored locally:
- `img1.wsimg.com/` - Website images and media assets
- `fonts.googleapis.com/` & `fonts.gstatic.com/` - Google Fonts
- `www.youtube.com/` - YouTube embed resources
- `maps.googleapis.com/` & `maps.gstatic.com/` - Google Maps integration
- `www.google.com/` & `www.gstatic.com/` - Google services (reCAPTCHA only)
- `drive.google.com/` - Google Drive content
- `_DataURI/` - Base64 encoded data files

### Styling Architecture
- **Inline Styles**: All CSS is embedded directly in HTML files
- **CSS Framework**: Custom `.x` class-based system with responsive breakpoints
- **Typography**: Primary font is "Abril Fatface" from Google Fonts
- **Responsive Design**: Mobile-first with specific breakpoints for xs, sm, md, lg, xl viewports

## Development Commands

This is a static website with no build process. Common operations:

### Local Development
```bash
# Serve locally (any static server)
python3 -m http.server 8000
# OR
npx serve .
# OR  
php -S localhost:8000
```

### File Operations
```bash
# View all HTML pages
ls -la *.html

# Check service worker
cat sw.js

# Validate manifest
cat manifest.webmanifest | jq .
```

### Deployment
The entire `website` directory contents can be uploaded directly to any web server. No compilation or build step needed.

## Key Implementation Details

### Service Worker Strategy
The `sw.js` implements caching strategies for offline functionality. When modifying cached resources, increment any cache version numbers.

### Navigation Structure
All pages share identical navigation with these routes:
- `/` (Home)
- `/our-products` 
- `/ace-gallery`
- `/about-us`
- `/contact-us`

### External Integrations
- **YouTube**: Embedded videos with local resource caching
- **Google Maps**: Interactive maps with API integration  
- **Google Fonts**: Abril Fatface font family with fallbacks
- **reCAPTCHA**: Form protection on contact page

### Asset Management
Images are served through `img1.wsimg.com` with responsive srcsets and multiple resolution variants. When updating images, maintain the existing URL patterns and sizing conventions.

## Testing

Since this is a static site, testing focuses on:
- Cross-browser compatibility testing
- Mobile responsiveness validation
- PWA functionality verification
- Service worker cache testing
- Form submission testing (contact page)

Use browser dev tools to audit PWA compliance and performance scores.
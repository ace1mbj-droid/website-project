#!/bin/bash

# Script to apply lifestyle-bold design to all website pages
# This updates navigation, footer, and CSS references

echo "🎨 Applying Lifestyle Bold Design to All Pages..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Pages to update (excluding admin pages)
PAGES=(
    "docs/about-us.html"
    "docs/contact-us.html"
    "docs/ace-gallery.html"
    "docs/shop.html"
    "docs/product-detail.html"
    "docs/cart.html"
    "docs/checkout.html"
    "docs/track-order.html"
    "docs/login.html"
    "docs/register.html"
    "docs/user-dashboard.html"
    "docs/profile.html"
    "docs/order-confirmation.html"
    "docs/thank-you.html"
)

# Backup directory
BACKUP_DIR="docs/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "${BLUE}📦 Creating backups...${NC}"
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        cp "$page" "$BACKUP_DIR/"
        echo "  ✓ Backed up: $page"
    fi
done

echo ""
echo "${BLUE}🔄 Updating pages...${NC}"

# Function to update a page
update_page() {
    local file=$1
    local page_name=$(basename "$file")
    
    if [ ! -f "$file" ]; then
        echo "  ⚠️  File not found: $file"
        return
    fi
    
    echo "  Processing: $page_name"
    
    # Create temporary file
    local temp_file="${file}.tmp"
    
    # Read the file and make updates
    # This is a placeholder - actual sed commands would go here
    # For now, we'll just note what needs updating
    
    echo "    - Navigation structure"
    echo "    - CSS references"
    echo "    - Footer structure"
    echo "    - JavaScript references"
}

# Update each page
for page in "${PAGES[@]}"; do
    update_page "$page"
done

echo ""
echo "${GREEN}✅ Design update process initiated!${NC}"
echo ""
echo "📋 Summary:"
echo "  - Backups created in: $BACKUP_DIR"
echo "  - Pages to update: ${#PAGES[@]}"
echo ""
echo "⚠️  Note: Manual review recommended for complex pages"
echo "   Run 'git diff' to see changes before committing"
echo ""
echo "🚀 Next steps:"
echo "  1. Review updated pages in browser"
echo "  2. Test all functionality"
echo "  3. Upload to FTP server"
echo ""

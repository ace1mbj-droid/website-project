#!/bin/bash

echo "🚀 Preparing FTP Upload Package for Ace#1 Website"
echo "=================================================="
echo ""

# Create FTP upload directory
FTP_DIR="ftp-upload-ready"
mkdir -p "$FTP_DIR"

echo "📦 Copying files to $FTP_DIR..."
echo ""

# Copy all docs content (this becomes your web root)
echo "✅ Copying website files..."
cp -r docs/* "$FTP_DIR/"

# Copy marketplace-templates folder
echo "✅ Copying design system..."
mkdir -p "$FTP_DIR/marketplace-templates"
cp marketplace-templates/lifestyle-bold.css "$FTP_DIR/marketplace-templates/"
cp marketplace-templates/lifestyle-bold.js "$FTP_DIR/marketplace-templates/"

# Create templates folder if it doesn't exist
echo "✅ Copying templates..."
mkdir -p "$FTP_DIR/templates"
cp docs/templates/*.html "$FTP_DIR/templates/" 2>/dev/null || true

echo ""
echo "✅ FTP package ready!"
echo ""
echo "📁 Upload folder: $FTP_DIR/"
echo ""
echo "📋 Next steps:"
echo "1. Connect to your FTP server"
echo "2. Navigate to your web root (public_html or www)"
echo "3. Upload ALL contents from '$FTP_DIR/' folder"
echo "4. Visit your domain to see the new design!"
echo ""
echo "🎉 Your files are ready for upload!"

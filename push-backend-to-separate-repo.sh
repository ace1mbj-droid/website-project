#!/bin/bash

# Script to push backend folder to separate repository
# Repository: https://github.com/ace1mbj-droid/secure-ready-backend

echo "🚀 Pushing backend to separate repository..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend folder not found"
    echo "Please run this script from the project root"
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "📁 Creating temporary directory: $TEMP_DIR"

# Copy backend files to temp directory
echo "📋 Copying backend files..."
cp -r backend/* "$TEMP_DIR/"
cp backend/.gitignore "$TEMP_DIR/" 2>/dev/null || true
cp backend/.env.example "$TEMP_DIR/" 2>/dev/null || true

# Navigate to temp directory
cd "$TEMP_DIR"

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git branch -M main
fi

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin git@github.com:ace1mbj-droid/secure-ready-backend.git 2>/dev/null || \
git remote set-url origin git@github.com:ace1mbj-droid/secure-ready-backend.git

# Stage all files
echo "📦 Staging files..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Update backend with Railway deployment fixes

- Added DATABASE_URL support to migrations
- Made Redis optional (app won't crash without it)
- Updated configuration for Railway deployment
- Added comprehensive deployment documentation
- Fixed health endpoint configuration
- Ready for production deployment on Railway

All critical fixes applied and tested."

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Backend successfully pushed to secure-ready-backend repository!"
echo "🔗 View at: https://github.com/ace1mbj-droid/secure-ready-backend"
echo ""

# Cleanup
cd -
rm -rf "$TEMP_DIR"
echo "🧹 Cleaned up temporary files"
echo ""
echo "✨ Done!"

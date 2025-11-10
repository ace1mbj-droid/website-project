#!/bin/bash

# Railway Environment Setup Script
# Run this from the backend directory

echo "🔐 Generating secure keys..."

# Generate secure keys
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")

echo ""
echo "✅ Keys generated!"
echo ""
echo "📋 Your secure keys:"
echo "===================="
echo "JWT_SECRET: $JWT_SECRET"
echo "JWT_REFRESH_SECRET: $JWT_REFRESH_SECRET"
echo "ENCRYPTION_KEY: $ENCRYPTION_KEY"
echo ""
echo "🚀 Setting environment variables in Railway..."
echo ""

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set ENCRYPTION_KEY="$ENCRYPTION_KEY"
railway variables set FRONTEND_URL=https://ace1.in

echo ""
echo "✅ Environment variables set!"
echo ""
echo "📝 Next steps:"
echo "1. Add MySQL database via Railway dashboard"
echo "2. Run: railway up (to deploy)"
echo "3. Run: railway run node migrations/run.js (to run migrations)"
echo ""

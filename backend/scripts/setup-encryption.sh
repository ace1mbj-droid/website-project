#!/bin/bash

# Encryption Setup Script
# This script helps you set up encryption for your sensitive data

echo ""
echo "==================================="
echo "  Encryption Setup Wizard"
echo "==================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
fi

# Check if ENCRYPTION_KEY is already set
if grep -q "^ENCRYPTION_KEY=" .env; then
    echo "⚠️  ENCRYPTION_KEY already exists in .env"
    echo ""
    read -p "Do you want to generate a new key? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing key."
        echo ""
        echo "✅ Setup complete!"
        exit 0
    fi
fi

# Generate new encryption key
echo "🔑 Generating secure encryption key..."
KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64').slice(0, 32))")

# Update .env file
if grep -q "^ENCRYPTION_KEY=" .env; then
    # Replace existing key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/^ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$KEY/" .env
    else
        # Linux
        sed -i "s/^ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$KEY/" .env
    fi
    echo "✅ Updated ENCRYPTION_KEY in .env"
else
    # Add new key
    echo "" >> .env
    echo "# Encryption Key (Generated: $(date))" >> .env
    echo "ENCRYPTION_KEY=$KEY" >> .env
    echo "✅ Added ENCRYPTION_KEY to .env"
fi

echo ""
echo "==================================="
echo "  Setup Complete! ✅"
echo "==================================="
echo ""
echo "Your encryption key has been generated and saved to .env"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "  1. Never commit .env to version control"
echo "  2. Backup this key securely"
echo "  3. Use different keys for dev/staging/production"
echo "  4. If you lose this key, encrypted data cannot be recovered"
echo ""
echo "Next Steps:"
echo "  1. Test encryption: node scripts/encrypt-sensitive-data.js"
echo "  2. Read the guide: cat ENCRYPTION_GUIDE.md"
echo "  3. Integrate into your code"
echo ""
echo "Your encryption key: $KEY"
echo ""

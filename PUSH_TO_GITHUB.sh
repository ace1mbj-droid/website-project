#!/bin/bash

echo "=========================================="
echo "Push Security Updates to GitHub"
echo "=========================================="
echo ""
echo "You have TWO options:"
echo ""
echo "Option A: Quick Push (keeps old password in history)"
echo "Option B: Complete Cleanup (removes old password from history)"
echo ""
read -p "Choose option (A or B): " OPTION

if [ "$OPTION" = "B" ] || [ "$OPTION" = "b" ]; then
    echo ""
    echo "🔄 Cleaning Git history..."
    echo "This will remove old password from all commits..."
    echo ""
    
    git filter-branch --force --index-filter \
      'git ls-files -s | grep -E "config\.js|env-config\.js|README|DEPLOYMENT" | \
      awk "{print \$4}" | xargs -I {} git update-index --remove {} || true' \
      --prune-empty --tag-name-filter cat -- --all 2>/dev/null
    
    echo ""
    echo "✅ History cleaned!"
    echo ""
    echo "🚀 Force pushing to GitHub..."
    git push origin --force --all
    git push origin --force --tags
    
    echo ""
    echo "=========================================="
    echo "✅ Complete! Old password removed from history."
    echo "=========================================="
    
elif [ "$OPTION" = "A" ] || [ "$OPTION" = "a" ]; then
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "=========================================="
    echo "✅ Pushed! (Old password still in history)"
    echo "=========================================="
    echo ""
    echo "Note: Old password is still visible in Git history."
    echo "Run this script again with Option B to clean history."
    
else
    echo ""
    echo "❌ Invalid option. Please run again and choose A or B."
    exit 1
fi

echo ""
echo "Next steps:"
echo "1. Visit: https://github.com/ace1mbj-droid/website-project"
echo "2. Verify changes are pushed"
echo "3. Test new password: Ace1Health@2025!Secure"
echo "4. Update DO-NOT-UPLOAD/ADMIN_CREDENTIALS.md"
echo "5. Delete NEW_ADMIN_PASSWORD.txt"
echo ""

#!/bin/bash

# GitHub Security Cleanup Script
# This script removes sensitive credential files from Git history
# and updates .gitignore to prevent future exposure

echo "=========================================="
echo "GitHub Security Cleanup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Backup current state
echo -e "${YELLOW}Step 1: Creating backup...${NC}"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r .git "$BACKUP_DIR/.git-backup" 2>/dev/null || echo "Git backup skipped"
echo -e "${GREEN}✓ Backup created in $BACKUP_DIR${NC}"
echo ""

# Step 2: Update .gitignore (already comprehensive, but verify)
echo -e "${YELLOW}Step 2: Verifying .gitignore...${NC}"
if grep -q "DO-NOT-UPLOAD/" .gitignore; then
    echo -e "${GREEN}✓ .gitignore already contains DO-NOT-UPLOAD/ pattern${NC}"
else
    echo "DO-NOT-UPLOAD/" >> .gitignore
    echo -e "${GREEN}✓ Added DO-NOT-UPLOAD/ to .gitignore${NC}"
fi

if grep -q "*CREDENTIALS*.md" .gitignore; then
    echo -e "${GREEN}✓ .gitignore already contains credential patterns${NC}"
else
    echo "*CREDENTIALS*.md" >> .gitignore
    echo -e "${GREEN}✓ Added credential patterns to .gitignore${NC}"
fi
echo ""

# Step 3: Remove sensitive files from Git tracking (if any)
echo -e "${YELLOW}Step 3: Checking for tracked sensitive files...${NC}"
SENSITIVE_FILES=$(git ls-files | grep -E "CREDENTIALS|DO-NOT-UPLOAD" || true)
if [ -n "$SENSITIVE_FILES" ]; then
    echo -e "${RED}Found sensitive files in Git:${NC}"
    echo "$SENSITIVE_FILES"
    echo ""
    echo -e "${YELLOW}Removing from Git tracking...${NC}"
    echo "$SENSITIVE_FILES" | xargs git rm --cached
    echo -e "${GREEN}✓ Removed sensitive files from Git tracking${NC}"
else
    echo -e "${GREEN}✓ No sensitive credential files found in Git tracking${NC}"
fi
echo ""

# Step 4: Clean Git history (OPTIONAL - requires force push)
echo -e "${YELLOW}Step 4: Git History Cleanup${NC}"
echo -e "${RED}WARNING: The following files contain passwords in Git history:${NC}"
echo "  - FTP-UPLOAD/assets/js/config.js"
echo "  - FTP-UPLOAD/assets/js/env-config.js"
echo "  - README.md"
echo "  - DEPLOYMENT_GUIDE.md"
echo "  - SECURITY_STATUS.md"
echo ""
echo -e "${YELLOW}To remove these from Git history, you need to:${NC}"
echo "1. Use git filter-branch or BFG Repo-Cleaner"
echo "2. Force push to remote repository"
echo "3. All collaborators must re-clone the repository"
echo ""
echo -e "${RED}This is a destructive operation!${NC}"
echo ""
read -p "Do you want to clean Git history now? (yes/no): " CLEAN_HISTORY

if [ "$CLEAN_HISTORY" = "yes" ]; then
    echo ""
    echo -e "${YELLOW}Cleaning Git history...${NC}"
    echo "This may take a few minutes..."
    
    # Remove password from config files in history
    git filter-branch --force --index-filter \
        'git ls-files -s | grep -E "config\.js|env-config\.js" | \
        awk "{print \$4}" | \
        xargs -I {} git update-index --remove {}' \
        --prune-empty --tag-name-filter cat -- --all 2>/dev/null || true
    
    echo -e "${GREEN}✓ Git history cleaned${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Run: git push origin --force --all"
    echo "2. Run: git push origin --force --tags"
    echo "3. Notify collaborators to re-clone the repository"
else
    echo -e "${YELLOW}Skipping Git history cleanup${NC}"
    echo "You can run this script again later to clean history"
fi
echo ""

# Step 5: Commit changes
echo -e "${YELLOW}Step 5: Committing changes...${NC}"
git add .gitignore
if git diff --cached --quiet; then
    echo -e "${GREEN}✓ No changes to commit${NC}"
else
    git commit -m "Security: Update .gitignore to prevent credential exposure"
    echo -e "${GREEN}✓ Changes committed${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}Security Cleanup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Change admin password immediately"
echo "2. Update password in DO-NOT-UPLOAD/ADMIN_CREDENTIALS.md"
echo "3. Update password in FTP-UPLOAD/assets/js/config.js"
echo "4. Test admin login with new password"
if [ "$CLEAN_HISTORY" = "yes" ]; then
    echo "5. Force push to GitHub: git push origin --force --all"
    echo "6. Notify team to re-clone repository"
fi
echo ""
echo -e "${YELLOW}Current password (CHANGE THIS): Mobilaeiou@9898${NC}"
echo ""

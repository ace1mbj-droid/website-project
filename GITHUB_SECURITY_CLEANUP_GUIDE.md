# GitHub Security Cleanup Guide

## 🚨 Current Security Status

Your admin password `Mobilaeiou@9898` is currently exposed in the following tracked files:

### Files with Exposed Credentials:
1. `FTP-UPLOAD/assets/js/config.js` - Admin password in plain text
2. `FTP-UPLOAD/assets/js/env-config.js` - Admin password in plain text
3. `FTP-UPLOAD/ADMIN_DASHBOARD_README.txt` - Admin credentials
4. `FTP-UPLOAD/README.txt` - Admin credentials
5. `FTP-UPLOAD/FTP_UPLOAD_INSTRUCTIONS.txt` - Admin credentials
6. `README.md` - Admin credentials
7. `DEPLOYMENT_GUIDE.md` - Admin credentials
8. `SECURITY_STATUS.md` - Admin credentials and bank details
9. `QUICK_REFERENCE.md` - Admin credentials
10. `FOLDER_SUMMARY.txt` - Admin credentials

### Risk Level: 🔴 CRITICAL

Anyone with access to your GitHub repository can see these credentials in:
- Current files
- Git commit history
- Previous versions

---

## ✅ What's Already Protected

Good news! Your `.gitignore` file already has comprehensive patterns:

```gitignore
# Credentials and sensitive docs
*CREDENTIALS*.md
*_CREDENTIALS.md
ADMIN_*.md
*_ADMIN.md
*PAYMENT*.md
*BANK*.md

# Sensitive directories
DO-NOT-UPLOAD/
LOCAL-ONLY/
PRIVATE/
```

The `DO-NOT-UPLOAD/` folder is **NOT** tracked in Git, so those files are safe.

---

## 🔧 Cleanup Options

### Option 1: Quick Fix (Recommended for Immediate Security)

This removes sensitive files from future commits but doesn't clean history:

```bash
# Run the automated script
./SECURITY_CLEANUP_SCRIPT.sh
```

**What it does:**
- ✅ Verifies .gitignore is up to date
- ✅ Removes any tracked credential files
- ✅ Commits the changes
- ⚠️ Does NOT clean Git history (password still in old commits)

**Time:** 2 minutes  
**Risk:** Low  
**Limitation:** Password still visible in Git history

---

### Option 2: Complete Cleanup (Removes from History)

This completely removes passwords from Git history:

```bash
# Run the script and choose "yes" when prompted
./SECURITY_CLEANUP_SCRIPT.sh

# Then force push to GitHub
git push origin --force --all
git push origin --force --tags
```

**What it does:**
- ✅ Everything from Option 1
- ✅ Removes passwords from Git history
- ✅ Completely secures the repository
- ⚠️ Requires force push (destructive)

**Time:** 10 minutes  
**Risk:** Medium (requires force push)  
**Benefit:** Complete security

---

## 📝 Step-by-Step Manual Cleanup

If you prefer manual control:

### Step 1: Update Files with Passwords

Remove or replace passwords in these files:

**1. Update `FTP-UPLOAD/assets/js/config.js`:**
```javascript
admin: {
  email: 'hello@ace1.in',
  password: 'YOUR_NEW_PASSWORD_HERE',  // Change this
  passwordHash: 'hash_will_be_generated'
}
```

**2. Update `FTP-UPLOAD/assets/js/env-config.js`:**
```javascript
const ADMIN_PASSWORD = 'YOUR_NEW_PASSWORD_HERE';  // Change this
```

**3. Update documentation files:**
- Replace password with `[REDACTED]` or `[See DO-NOT-UPLOAD/ADMIN_CREDENTIALS.md]`
- Files: README.md, DEPLOYMENT_GUIDE.md, QUICK_REFERENCE.md, etc.

### Step 2: Commit Changes

```bash
git add .
git commit -m "Security: Remove exposed credentials from tracked files"
git push origin main
```

### Step 3: Clean Git History (Optional but Recommended)

```bash
# Install BFG Repo-Cleaner (easier than git filter-branch)
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Create a file with passwords to remove
echo "Mobilaeiou@9898" > passwords.txt

# Clean the repository
bfg --replace-text passwords.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

### Step 4: Change Password

1. Generate a new strong password (12+ characters)
2. Update `DO-NOT-UPLOAD/ADMIN_CREDENTIALS.md`
3. Update `FTP-UPLOAD/assets/js/config.js`
4. Test admin login

---

## 🔐 Password Requirements

Your new password should:
- ✅ Be at least 12 characters long
- ✅ Include uppercase letters (A-Z)
- ✅ Include lowercase letters (a-z)
- ✅ Include numbers (0-9)
- ✅ Include special characters (!@#$%^&*)
- ✅ Be unique (not used elsewhere)
- ❌ Not contain personal information
- ❌ Not be a common password

**Example strong passwords:**
- `Ace1Secure!2025@Health`
- `W3llness#Sh0es$2025`
- `Comf0rt!nnovate@9898`

---

## ✅ Verification Checklist

After cleanup, verify:

- [ ] `.gitignore` includes credential patterns
- [ ] `DO-NOT-UPLOAD/` folder is not tracked
- [ ] Password changed in all files
- [ ] New password is strong (12+ chars)
- [ ] Admin login works with new password
- [ ] Changes committed to Git
- [ ] (Optional) Git history cleaned
- [ ] (Optional) Force pushed to GitHub

---

## 🚀 Quick Start

**Fastest way to secure your repository:**

```bash
# 1. Run the cleanup script
./SECURITY_CLEANUP_SCRIPT.sh

# 2. Generate new password
NEW_PASSWORD="Ace1Secure!2025@Health"

# 3. Update config files
sed -i '' "s/Mobilaeiou@9898/$NEW_PASSWORD/g" FTP-UPLOAD/assets/js/config.js
sed -i '' "s/Mobilaeiou@9898/$NEW_PASSWORD/g" FTP-UPLOAD/assets/js/env-config.js

# 4. Update documentation (replace with placeholder)
sed -i '' "s/Mobilaeiou@9898/[REDACTED - See DO-NOT-UPLOAD folder]/g" README.md
sed -i '' "s/Mobilaeiou@9898/[REDACTED - See DO-NOT-UPLOAD folder]/g" DEPLOYMENT_GUIDE.md

# 5. Commit changes
git add .
git commit -m "Security: Update admin password and remove from documentation"
git push origin main
```

---

## 📞 Need Help?

If you encounter issues:

1. **Backup first**: The script creates automatic backups
2. **Test locally**: Make sure everything works before pushing
3. **Rollback if needed**: Use the backup created in `backup-YYYYMMDD-HHMMSS/`

---

## 📊 Impact Assessment

### Before Cleanup:
- 🔴 Password visible in 10+ files
- 🔴 Password in Git history
- 🔴 Anyone can access admin panel
- 🔴 Bank details exposed

### After Cleanup:
- ✅ Password removed from tracked files
- ✅ .gitignore prevents future exposure
- ✅ New strong password in use
- ✅ (Optional) Git history cleaned

---

**Created:** November 10, 2025  
**Priority:** CRITICAL  
**Estimated Time:** 10-30 minutes  
**Status:** Ready to execute

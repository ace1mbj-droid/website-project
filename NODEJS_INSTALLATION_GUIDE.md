# Node.js Installation Guide for macOS

## 🚀 Quick Installation

### Method 1: Using Homebrew (Recommended)

**Step 1: Check if Homebrew is installed**
```bash
brew --version
```

**If Homebrew is not installed, install it first:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install Node.js**
```bash
# Install Node.js 18 LTS (Long Term Support)
brew install node@18

# Link it to make it available
brew link node@18
```

**Step 3: Verify Installation**
```bash
node --version   # Should show: v18.x.x
npm --version    # Should show: 9.x.x or 10.x.x
```

---

### Method 2: Using Official Installer

**Step 1: Download Node.js**
- Visit: https://nodejs.org/
- Download the **LTS version** (18.x.x)
- Choose the macOS Installer (.pkg)

**Step 2: Run the Installer**
- Double-click the downloaded .pkg file
- Follow the installation wizard
- Accept the license agreement
- Choose installation location (default is fine)
- Click "Install"

**Step 3: Verify Installation**
Open Terminal and run:
```bash
node --version
npm --version
```

---

## ✅ Verification Steps

After installation, verify everything works:

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or 10.x.x

# Test Node.js works
node -e "console.log('Node.js is working!')"
# Expected: Node.js is working!

# Check npm works
npm --version
# Expected: version number
```

---

## 📦 Install Backend Dependencies

Once Node.js is installed:

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# This will install:
# - Express.js
# - MySQL2
# - bcrypt
# - jsonwebtoken
# - And 15+ other packages

# Installation time: 2-3 minutes
```

---

## 🧪 Test Backend Server

After installing dependencies:

```bash
# Start the server
npm start

# Expected output:
# 🚀 Server running on http://localhost:3000
# 📝 Environment: development
# 🏥 Health check: http://localhost:3000/health
```

**Test in another terminal:**
```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T...",
  "uptime": 5.123,
  "environment": "development"
}
```

---

## 🔧 Troubleshooting

### Issue: "brew: command not found"

**Solution:** Install Homebrew first
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Issue: "node: command not found" after Homebrew install

**Solution:** Add to PATH
```bash
# Add to ~/.zshrc
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Issue: Permission errors during npm install

**Solution:** Fix npm permissions
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Issue: Old Node.js version installed

**Solution:** Update Node.js
```bash
brew upgrade node@18
```

---

## 📊 What Gets Installed

### Node.js Includes:
- **Node.js runtime** - JavaScript execution environment
- **npm** - Node Package Manager
- **npx** - Package runner tool

### Backend Dependencies (after npm install):
- **15 production packages** (~50MB)
- **4 development packages** (~100MB)
- **Total:** ~150MB

---

## 🎯 Next Steps After Installation

1. ✅ Verify Node.js is installed
2. ✅ Navigate to backend directory
3. ✅ Run `npm install`
4. ✅ Create `.env` file from `.env.example`
5. ✅ Install MySQL and Redis
6. ✅ Start the server with `npm start`

---

## 📞 Need Help?

**Homebrew Issues:**
- Visit: https://brew.sh/
- Docs: https://docs.brew.sh/

**Node.js Issues:**
- Visit: https://nodejs.org/
- Docs: https://nodejs.org/docs/

**npm Issues:**
- Visit: https://www.npmjs.com/
- Docs: https://docs.npmjs.com/

---

**Status:** Ready to Install  
**Estimated Time:** 5-10 minutes  
**Difficulty:** Easy

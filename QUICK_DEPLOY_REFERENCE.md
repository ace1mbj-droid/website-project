# Quick Deploy Reference Card

## 🎯 3-Step Deployment

### 1️⃣ Railway Setup (2 min)
```
1. Go to railway.app
2. Sign in with GitHub
3. Deploy from: ace1mbj-droid/website-project
4. Add MySQL database (click "New" → "Database" → "MySQL")
```

### 2️⃣ Generate Keys (1 min)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 3️⃣ Set Variables (5 min)
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<first-key>
JWT_REFRESH_SECRET=<second-key>
ENCRYPTION_KEY=<third-key>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://ace1.in
```

## ✅ Test Deployment
```bash
curl https://your-backend.railway.app/health
```

## 📝 Update Frontend
```javascript
// docs/assets/js/config.js
const API_CONFIG = {
    baseURL: 'https://your-backend.railway.app/api',
    timeout: 30000
};
```

## 🔧 What Was Fixed

| Issue | Fix |
|-------|-----|
| Health path wrong | Now `/health` not `/api/health` |
| DATABASE_URL not supported | ✅ Added to migrations |
| Redis crashes app | ✅ Made optional |

## 📚 Full Guides

- **Fastest**: `START_HERE.md`
- **Detailed**: `DEPLOY_BACKEND_NOW.md`
- **What Changed**: `DEPLOYMENT_FIXES_SUMMARY.md`

## 🚀 Status

✅ All fixes committed to GitHub  
✅ Backend 100% ready  
✅ Documentation accurate  

**Deploy now**: [railway.app](https://railway.app)

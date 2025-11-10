# 🚀 Start Here - Deploy Your Backend

## Current Status

✅ **GitHub**: Backend code is pushed and ready  
✅ **Frontend**: Live at https://ace1.in  
⏳ **Backend**: Ready to deploy to Railway  

## What You Need to Do (3 Simple Steps)

### Step 1: Deploy to Railway (10 minutes)

1. Open **[railway.app](https://railway.app)** in your browser
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Select **"Deploy from GitHub repo"**
5. Choose: **ace1mbj-droid/website-project**
6. Railway will automatically deploy!

**Detailed instructions**: See `DEPLOY_BACKEND_NOW.md`

### Step 2: Add Database (2 minutes)

1. In Railway dashboard, click **"New"**
2. Select **"Database"** → **"MySQL"**
3. Done! Railway auto-connects it

### Step 3: Set Environment Variables (5 minutes)

1. Click your backend service → **"Variables"**
2. Generate secure keys by running these commands in your terminal:

```bash
# Run these in the backend folder
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

3. Add these variables in Railway:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=<paste-first-generated-value>
JWT_REFRESH_SECRET=<paste-second-generated-value>
ENCRYPTION_KEY=<paste-third-generated-value>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://ace1.in
```

4. Railway will auto-deploy with these variables

## That's It!

After ~3 minutes, your backend will be live. You'll get a URL like:
```
https://website-project-production-xxxx.up.railway.app
```

## Test Your Backend

Visit this URL in your browser:
```
https://your-backend-url.railway.app/api/health
```

You should see:
```json
{"status": "healthy", "database": "connected"}
```

## Update Frontend

Once backend is live, update `docs/assets/js/config.js`:

```javascript
const API_CONFIG = {
    baseURL: 'https://your-backend-url.railway.app/api',
    timeout: 30000
};
```

Then commit and push:
```bash
git add docs/assets/js/config.js
git commit -m "Update backend URL"
git push origin main
```

## 📚 Documentation

- **Quick Deploy Guide**: `DEPLOY_BACKEND_NOW.md`
- **Detailed Railway Guide**: `backend/RAILWAY_DEPLOYMENT.md`
- **Status Tracker**: `DEPLOYMENT_STATUS.md`
- **Hybrid Deployment**: `HYBRID_DEPLOYMENT_GUIDE.md`

## 🆘 Troubleshooting

**Deployment fails?**
- Check Railway logs in dashboard
- Verify all environment variables are set
- Ensure MySQL database is running

**Can't connect to database?**
- Railway auto-sets DATABASE_URL
- Check database service is active
- View logs for connection errors

**Need help?**
- Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

## Ready? Let's Deploy! 🚀

1. Open [railway.app](https://railway.app)
2. Follow the 3 steps above
3. Your backend will be live in ~10 minutes!

**Questions?** Check `DEPLOY_BACKEND_NOW.md` for detailed instructions.

# Deploy Backend to Railway - Quick Guide

Your backend is ready and pushed to GitHub! Follow these steps to deploy.

## Step 1: Create Railway Account & Project

1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Sign in with your **GitHub account** (ace1mbj-droid)
4. Click **"Deploy from GitHub repo"**
5. Select repository: **`ace1mbj-droid/website-project`**
6. Railway will detect Node.js automatically

## Step 2: Add MySQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"MySQL"**
3. Railway automatically creates `DATABASE_URL` environment variable
4. Your backend will auto-connect to this database

## Step 3: Set Environment Variables

1. Click on your **backend service** (not the database)
2. Go to **"Variables"** tab
3. Click **"Add Variable"** and add these one by one:

### Required Variables (Copy these exactly):

```
NODE_ENV=production
PORT=3000
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://ace1.in
```

### Generate Secure Keys (Run these commands locally):

Open your terminal in the `backend` folder and run:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Add these generated values to Railway:
```
JWT_SECRET=<paste-generated-value>
JWT_REFRESH_SECRET=<paste-generated-value>
ENCRYPTION_KEY=<paste-generated-value>
```

### Optional (Add later when ready):

```
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBPROD
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@ace1.in
```

## Step 4: Deploy

1. Railway will **automatically deploy** after you add variables
2. Watch the **"Deployments"** tab for progress
3. Migrations will run automatically (configured in `railway.json`)
4. Wait for **"Success"** status (usually 2-3 minutes)

## Step 5: Get Your Backend URL

1. Go to **"Settings"** → **"Domains"**
2. Copy the Railway-provided URL (looks like):
   ```
   https://website-project-production-xxxx.up.railway.app
   ```
3. **Save this URL** - you'll need it for frontend configuration

## Step 6: Test Your Backend

Open your browser or use curl:

```bash
# Test health endpoint
curl https://your-backend-url.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Step 7: Update Frontend Configuration

Update `docs/assets/js/config.js` with your Railway backend URL:

```javascript
const API_CONFIG = {
    baseURL: 'https://your-backend-url.railway.app/api',
    timeout: 30000
};
```

## Troubleshooting

### If deployment fails:

1. **Check Logs**: Click on your service → "Deployments" → Click latest deployment → View logs
2. **Common issues**:
   - Missing environment variables → Add them in Variables tab
   - Database not connected → Ensure MySQL service is running
   - Migration errors → Check logs for specific SQL errors

### If migrations don't run:

Railway runs them automatically via `railway.json`, but if needed:

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and link project:
   ```bash
   railway login
   railway link
   ```

3. Run migrations manually:
   ```bash
   railway run node migrations/run.js
   ```

## View Logs

### Via Dashboard:
- Go to your service → "Deployments" → Click deployment → View logs

### Via CLI:
```bash
railway logs
railway logs --follow  # Real-time logs
```

## Cost

- **Free Tier**: 500 hours/month, 512MB RAM
- Your backend should stay within free tier limits
- Monitor usage in Railway dashboard

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Update frontend with backend URL
3. ✅ Test user registration and login
4. ✅ Configure payment gateway (Paytm)
5. ✅ Setup email service (SendGrid)
6. ✅ Monitor logs for any errors

## Quick Reference

| What | Where |
|------|-------|
| Railway Dashboard | https://railway.app/dashboard |
| Your GitHub Repo | https://github.com/ace1mbj-droid/website-project |
| Frontend URL | https://ace1.in |
| Backend URL | Get from Railway Settings → Domains |

---

## Ready to Deploy?

1. Open [railway.app](https://railway.app)
2. Follow steps above
3. Your backend will be live in ~5 minutes!

🚀 **Let's get your backend deployed!**

# 🎯 Hybrid Deployment Guide - Ace#1

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Frontend (Your FTP Host)                          │
│  - HTML, CSS, JavaScript                           │
│  - Static assets                                   │
│  - yourdomain.com                                  │
│                                                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API Calls
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Backend (Railway/Render)                          │
│  - Node.js + Express                               │
│  - MySQL Database                                  │
│  - api.yourdomain.com or backend-xyz.railway.app   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

### Phase 1: Deploy Backend to Railway (Recommended - Easiest)

#### 1.1 Prepare Backend for Deployment

Your backend is already prepared! Just need to add one file:

**Create `railway.json`** (Railway configuration)

#### 1.2 Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)
4. Free tier includes:
   - 500 hours/month
   - 512MB RAM
   - 1GB storage
   - Perfect for starting!

#### 1.3 Deploy Backend

**Option A: Deploy from GitHub (Recommended)**
1. Push your backend code to GitHub
2. In Railway: "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and deploys

**Option B: Deploy via CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

#### 1.4 Add MySQL Database

1. In Railway dashboard, click "New" → "Database" → "MySQL"
2. Railway automatically creates database and sets environment variables
3. Your backend will auto-connect!

#### 1.5 Set Environment Variables

In Railway dashboard, go to your backend service → Variables:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_random_string_here_min_32_chars
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your_32_character_encryption_key_here
FRONTEND_URL=https://yourdomain.com
```

Railway auto-sets these (no need to add):
- DATABASE_URL (or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- REDIS_URL (if you add Redis)

#### 1.6 Run Database Migrations

In Railway dashboard:
1. Go to your backend service
2. Click "Settings" → "Deploy"
3. Add custom start command:
```bash
node migrations/run.js && node src/app.js
```

Or run manually via Railway CLI:
```bash
railway run node migrations/run.js
```

#### 1.7 Get Your Backend URL

Railway provides a URL like:
```
https://your-backend-production.up.railway.app
```

Save this URL - you'll need it for the frontend!

---

### Phase 2: Update Frontend to Use Railway Backend

Now update your frontend to call the Railway backend API.

#### 2.1 Create API Configuration File

Create this file in your frontend:

**`docs/assets/js/config.js`**

#### 2.2 Update All Frontend Files

You'll need to update these files to use the new API URL:
- `docs/assets/js/admin-analytics.js`
- Any other JS files making API calls

#### 2.3 Update CORS Settings

Your backend needs to allow requests from your domain.

Update `backend/src/app.js` CORS configuration:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://yourdomain.com',
    'http://yourdomain.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

#### 2.4 Re-upload Frontend via FTP

After updating the API URLs:
1. Upload the updated JavaScript files via FTP
2. Clear browser cache
3. Test the connection

---

### Phase 3: Alternative - Deploy to Render.com

If Railway doesn't work, try Render:

#### 3.1 Sign Up for Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Free tier includes:
   - 750 hours/month
   - Sleeps after 15 min inactivity
   - Free PostgreSQL database

#### 3.2 Create Web Service

1. Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: ace1-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/app.js`
   - **Plan**: Free

#### 3.3 Add Database

1. Dashboard → "New" → "PostgreSQL"
2. Name: ace1-database
3. Plan: Free
4. Render auto-connects to your web service

**Note**: You'll need to convert MySQL migrations to PostgreSQL or use MySQL add-on

#### 3.4 Set Environment Variables

In Render dashboard → your service → Environment:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your_secure_random_string
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your_32_character_key
FRONTEND_URL=https://yourdomain.com
```

#### 3.5 Get Your Backend URL

Render provides:
```
https://ace1-backend.onrender.com
```

---

### Phase 4: Testing Your Hybrid Setup

#### 4.1 Test Backend Directly

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Test API endpoint
curl https://your-backend-url.railway.app/api/products
```

#### 4.2 Test Frontend Connection

1. Open your website: `https://yourdomain.com`
2. Open browser console (F12)
3. Check for API calls
4. Verify no CORS errors

#### 4.3 Test Full Flow

- [ ] Homepage loads
- [ ] API calls work
- [ ] Admin dashboard connects
- [ ] Forms submit successfully
- [ ] No console errors

---

## Troubleshooting

### Issue: CORS Errors

**Solution**: Update backend CORS settings to include your domain

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Issue: Backend Sleeps (Render Free Tier)

**Solution**: 
- Backend sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on

### Issue: Database Connection Failed

**Solution**:
- Check environment variables are set
- Verify database is running
- Check Railway/Render logs

### Issue: 404 on API Calls

**Solution**:
- Verify API URL is correct in frontend
- Check backend routes are deployed
- Look at backend logs

---

## Cost Breakdown

### Free Tier (Perfect for Starting)

**Railway Free Tier:**
- ✅ 500 hours/month (enough for 24/7 if optimized)
- ✅ MySQL database included
- ✅ No credit card required
- ✅ Custom domain support

**Render Free Tier:**
- ✅ 750 hours/month
- ✅ PostgreSQL database
- ✅ Sleeps after inactivity
- ✅ No credit card required

**Your FTP Host:**
- ✅ Already paid for
- ✅ Hosts frontend

**Total: $0/month** 🎉

### Paid Tier (When You Scale)

**Railway Hobby:**
- $5/month
- More resources
- Better performance

**Render Starter:**
- $7/month
- Always-on (no sleep)
- Better for production

---

## Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] Environment variables set (not hardcoded)
- [ ] JWT secret is strong and random
- [ ] Database credentials secure
- [ ] API rate limiting enabled
- [ ] Input validation working

---

## Next Steps After Deployment

1. **Set up custom domain for backend** (optional)
   - Railway: Settings → Domains → Add custom domain
   - Point CNAME: `api.yourdomain.com` → Railway URL

2. **Monitor your backend**
   - Railway/Render provides logs and metrics
   - Set up error notifications

3. **Optimize performance**
   - Enable caching
   - Optimize database queries
   - Add CDN for static assets

4. **Scale when needed**
   - Upgrade to paid tier
   - Add Redis for sessions
   - Enable auto-scaling

---

## Quick Reference

### Railway Commands

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# View logs
railway logs

# Run migrations
railway run node migrations/run.js

# Open dashboard
railway open
```

### Render Commands

```bash
# Install CLI
npm install -g render

# Login
render login

# Deploy
render deploy

# View logs
render logs
```

---

## Support Resources

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Render:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

---

**Your hybrid deployment is ready to go! 🚀**

Choose Railway or Render, follow the steps, and your full-stack app will be live!

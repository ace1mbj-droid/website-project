# 🚀 Deploy to Render.com (FREE)

## Why Render?

✅ **Free tier available** - No credit card required  
✅ **Similar to Railway** - Easy deployment  
✅ **Auto-deploys from GitHub** - Push to deploy  
✅ **Free PostgreSQL/MySQL** - Database included  

---

## Quick Deployment (5 Minutes)

### Step 1: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your repository: **`ace1mbj-droid/website-project`**
3. Configure the service:

```
Name: ace1-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node migrations/run.js && node src/app.js
Plan: Free
```

### Step 3: Add Environment Variables

Scroll down to **"Environment Variables"** and add:

```env
NODE_ENV=production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://ace1.in
```

**Generate these keys** (run in terminal):
```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Add the generated values:
```env
JWT_SECRET=<paste-first-value>
JWT_REFRESH_SECRET=<paste-second-value>
ENCRYPTION_KEY=<paste-third-value>
```

### Step 4: Add Database

1. Click **"New +"** → **"PostgreSQL"** or **"MySQL"**
2. Choose:
   ```
   Name: ace1-database
   Database: ace1_db
   User: ace1_user
   Region: Oregon (same as web service)
   Plan: Free
   ```

3. After database is created, go back to your **Web Service**
4. In **Environment Variables**, add:
   ```
   DATABASE_URL=<copy-from-database-internal-connection-string>
   ```

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Run migrations
   - Start your server
3. Wait ~3-5 minutes for deployment

### Step 6: Get Your Backend URL

After deployment completes:
1. Copy your service URL (e.g., `https://ace1-backend.onrender.com`)
2. Test it: `https://ace1-backend.onrender.com/health`

---

## Alternative: Deploy with render.yaml (Automated)

Your backend already has a `render.yaml` file configured!

### Using render.yaml:

1. Go to **https://render.com/dashboard**
2. Click **"New +"** → **"Blueprint"**
3. Connect repository: **`ace1mbj-droid/website-project`**
4. Render will detect `backend/render.yaml`
5. Click **"Apply"**
6. Render automatically creates:
   - Web service (backend)
   - MySQL database
   - Environment variables
7. Done!

---

## Update Frontend After Deployment

Once your backend is live:

1. **Get backend URL** from Render dashboard
2. **Edit** `docs/assets/js/config.js`:
   ```javascript
   const API_CONFIG = {
       baseURL: 'https://ace1-backend.onrender.com/api',
       timeout: 30000
   };
   ```

3. **Commit and push**:
   ```bash
   git add docs/assets/js/config.js
   git commit -m "Connect frontend to Render backend"
   git push origin main
   ```

---

## Render Free Tier Limits

✅ **Web Services**: 750 hours/month  
✅ **Databases**: 90 days retention  
✅ **Bandwidth**: 100GB/month  
⚠️ **Sleep after 15 min inactivity** (wakes on request)  

**Note**: Free services "sleep" after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

---

## Troubleshooting

### Deployment Fails

1. **Check build logs** in Render dashboard
2. **Common issues**:
   - Missing environment variables
   - Database not connected
   - Migration errors

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly
2. Check database service is running
3. Ensure web service and database are in same region

### Migrations Don't Run

1. Check start command includes: `node migrations/run.js &&`
2. View logs for migration errors
3. Manually run migrations via Render shell

### App Crashes on Startup

1. Check logs for errors
2. Verify all required env variables are set
3. Ensure Redis is optional (already fixed in your code)

---

## Render vs Railway

| Feature | Render (Free) | Railway (Paid) |
|---------|---------------|----------------|
| Cost | FREE | $5/month minimum |
| Sleep | Yes (15 min) | No |
| Database | Free PostgreSQL/MySQL | Paid only |
| Deploy Speed | ~3-5 min | ~2-3 min |
| Auto-deploy | Yes | Yes |

---

## Monitoring Your Backend

### View Logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. View real-time logs

### Check Health
```bash
curl https://ace1-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "not configured"
}
```

### Metrics
- Render dashboard shows:
  - CPU usage
  - Memory usage
  - Request count
  - Response times

---

## Auto-Deploy from GitHub

Render automatically deploys when you push to GitHub:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```
3. Render automatically detects changes
4. Deploys new version (~3 minutes)

---

## Upgrading (Optional)

If you need more resources:

**Starter Plan ($7/month)**:
- No sleep
- More resources
- Better performance

**Standard Plan ($25/month)**:
- Dedicated resources
- Auto-scaling
- Priority support

---

## Summary

✅ **Render.com is FREE** - No credit card needed  
✅ **Your code is ready** - All fixes applied  
✅ **Easy deployment** - Just follow steps above  
✅ **Auto-deploys** - Push to GitHub = auto-deploy  

---

## Next Steps

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Create Web Service** from your repository
4. **Add database** (MySQL or PostgreSQL)
5. **Set environment variables**
6. **Deploy!**

**Your backend will be live in ~5 minutes!** 🎉

---

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Your config file: `backend/render.yaml`

**Ready to deploy!** Follow the steps above to get your backend live on Render.

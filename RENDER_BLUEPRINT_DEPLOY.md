# 🚀 Deploy with Render Blueprint (Automated - 2 Minutes!)

## What is Blueprint?

Render Blueprint reads your `render.yaml` file and **automatically creates**:
- ✅ Web service (your backend)
- ✅ Database (MySQL)
- ✅ Environment variables
- ✅ Everything configured!

**This is the EASIEST way to deploy!**

---

## Step-by-Step Blueprint Deployment

### Step 1: Sign Up for Render (1 minute)

1. Go to: **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

### Step 2: Deploy with Blueprint (1 minute)

1. Go to: **https://render.com/dashboard**

2. Click **"New +"** → **"Blueprint"**

3. Connect your repository:
   - Select: **`ace1mbj-droid/website-project`**
   - Render will scan for `render.yaml` files

4. Render finds `backend/render.yaml` and shows:
   ```
   Services to create:
   - ace1-backend (Web Service)
   - ace1-database (MySQL Database)
   ```

5. Click **"Apply"**

6. Render automatically:
   - Creates web service
   - Creates MySQL database
   - Links them together
   - Sets environment variables
   - Starts deployment

### Step 3: Generate Secure Keys (While Deploying)

While Render is deploying, generate your secure keys:

```bash
# Run these in your terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

**Save these values** - you'll need them in the next step.

### Step 4: Add Missing Environment Variables (1 minute)

After Blueprint creates the services:

1. Go to your **ace1-backend** service
2. Click **"Environment"** tab
3. Add these variables (Blueprint auto-generates some, but not all):

```env
JWT_SECRET=<paste-first-generated-value>
JWT_REFRESH_SECRET=<paste-second-generated-value>
ENCRYPTION_KEY=<paste-third-generated-value>
```

4. Click **"Save Changes"**
5. Render will redeploy automatically

---

## That's It! ✅

Render Blueprint has:
- ✅ Created your web service
- ✅ Created your database
- ✅ Connected them together
- ✅ Set most environment variables
- ✅ Deployed your backend

**Total time**: ~3-5 minutes

---

## After Deployment

### Get Your Backend URL

1. Go to your **ace1-backend** service
2. Copy the URL (e.g., `https://ace1-backend.onrender.com`)

### Test Your Backend

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

### Update Frontend

Edit `docs/assets/js/config.js`:
```javascript
const API_CONFIG = {
    baseURL: 'https://ace1-backend.onrender.com/api',
    timeout: 30000
};
```

Commit and push:
```bash
git add docs/assets/js/config.js
git commit -m "Connect frontend to Render backend"
git push origin main
```

---

## What Blueprint Created

### Web Service (ace1-backend)
- **Type**: Node.js web service
- **Plan**: Free
- **Build**: `npm install`
- **Start**: `node migrations/run.js && node src/app.js`
- **Health Check**: `/health`

### Database (ace1-database)
- **Type**: MySQL
- **Plan**: Free
- **Auto-connected**: Via `DATABASE_URL`

### Environment Variables (Auto-set)
- `NODE_ENV=production`
- `PORT=10000`
- `JWT_EXPIRES_IN=7d`
- `JWT_REFRESH_EXPIRES_IN=30d`
- `FRONTEND_URL=https://ace1.in`
- `DATABASE_URL=<auto-set-by-render>`

### You Need to Add
- `JWT_SECRET` (generate)
- `JWT_REFRESH_SECRET` (generate)
- `ENCRYPTION_KEY` (generate)

---

## Monitoring

### View Logs
1. Go to **ace1-backend** service
2. Click **"Logs"** tab
3. See real-time deployment and runtime logs

### Check Status
- Dashboard shows service status
- Green = Running
- Yellow = Deploying
- Red = Error

### Metrics
- CPU usage
- Memory usage
- Request count
- Response times

---

## Auto-Deploy from GitHub

After initial setup, Render automatically deploys when you push to GitHub:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```
3. Render detects changes
4. Automatically deploys (~3 minutes)

---

## Free Tier Notes

⚠️ **Services sleep after 15 minutes of inactivity**
- First request wakes it up (~30 seconds)
- Subsequent requests are fast
- Perfect for development

💡 **To keep awake**: Use UptimeRobot to ping every 10 minutes

---

## Troubleshooting

### Blueprint Not Found

If Render doesn't find `render.yaml`:
1. Make sure `backend/render.yaml` exists
2. Try manual deployment instead
3. Check file is committed to GitHub

### Deployment Fails

1. Check logs in Render dashboard
2. Verify environment variables are set
3. Ensure database is running

### Database Connection Issues

1. Verify `DATABASE_URL` is auto-set
2. Check database service status
3. Ensure both services are in same region

---

## Summary

✅ **Blueprint = Easiest deployment**  
✅ **Automatic setup** - Render does everything  
✅ **Free tier** - No credit card needed  
✅ **Auto-deploy** - Push to GitHub = deploy  

---

## Quick Steps Recap

1. **Go to**: https://render.com/dashboard
2. **Click**: "New +" → "Blueprint"
3. **Select**: `ace1mbj-droid/website-project`
4. **Click**: "Apply"
5. **Add**: JWT_SECRET, JWT_REFRESH_SECRET, ENCRYPTION_KEY
6. **Done**: Backend is live!

---

🎉 **Your backend will be live in ~5 minutes using Blueprint!**

**Start here**: https://render.com/dashboard

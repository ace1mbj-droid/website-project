# Deploy to Render.com NOW (FREE & Easy)

## Why Render Instead of Railway?

Railway requires a paid plan ($5/month minimum). Render has a **FREE tier** that works great for your backend!

---

## 3-Step Deployment

### 1️⃣ Sign Up (2 minutes)

1. Open: **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** account
4. Authorize Render

### 2️⃣ Deploy Backend (3 minutes)

1. Click **"New +"** → **"Web Service"**
2. Select repository: **`ace1mbj-droid/website-project`**
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node migrations/run.js && node src/app.js`
   - **Plan**: Free

4. Add environment variables (click "Advanced"):
   ```env
   NODE_ENV=production
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=https://ace1.in
   ```

5. Generate and add secure keys:
   ```bash
   # Run these in terminal to generate
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
   
   Then add:
   ```env
   JWT_SECRET=<first-generated-value>
   JWT_REFRESH_SECRET=<second-generated-value>
   ENCRYPTION_KEY=<third-generated-value>
   ```

6. Click **"Create Web Service"**

### 3️⃣ Add Database (2 minutes)

1. Click **"New +"** → **"PostgreSQL"** (or MySQL)
2. Configure:
   - **Name**: `ace1-database`
   - **Plan**: Free
3. Click **"Create Database"**
4. Copy the **Internal Connection String**
5. Go back to your web service
6. Add environment variable:
   ```env
   DATABASE_URL=<paste-connection-string>
   ```

---

## That's It!

Render will automatically:
- ✅ Clone your repository
- ✅ Install dependencies
- ✅ Run migrations
- ✅ Start your server

**Deployment time**: ~3-5 minutes

---

## After Deployment

### Get Your Backend URL

Your backend will be at: `https://ace1-backend.onrender.com`

### Test It

```bash
curl https://ace1-backend.onrender.com/health
```

Expected:
```json
{
  "status": "healthy",
  "database": "connected"
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
git commit -m "Connect to Render backend"
git push origin main
```

---

## Free Tier Notes

⚠️ **Free services sleep after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds to wake up
- Subsequent requests are fast
- Good for development and low-traffic sites

💡 **To keep it awake**: Use a service like UptimeRobot to ping your backend every 10 minutes

---

## Comparison

| Feature | Render (Free) | Railway (Paid) |
|---------|---------------|----------------|
| Cost | **FREE** | $5/month |
| Setup | 5 minutes | 5 minutes |
| Database | Free | Paid |
| Sleep | Yes (15 min) | No |
| Perfect for | Development, low traffic | Production, high traffic |

---

## Ready to Deploy?

1. **Open**: https://render.com
2. **Follow**: Steps above
3. **Done**: Backend live in 5 minutes!

**Full guide**: See `RENDER_DEPLOYMENT_GUIDE.md`

---

🚀 **Your backend is ready to deploy to Render for FREE!**

# Railway Deployment Checklist

## ⚠️ IMPORTANT CORRECTIONS

### Issue 1: Health Endpoint Path
**INCORRECT in guide**: `/api/health`  
**CORRECT path**: `/health`

Your health endpoint is at the root level, not under `/api`.

### Issue 2: Migration Runner Needs DATABASE_URL Support
The migration runner (`migrations/run.js`) currently only uses individual DB variables, not `DATABASE_URL`. This needs to be fixed before deployment.

### Issue 3: Redis Dependency
Your app requires Redis to start. Railway doesn't provide Redis by default - you need to add it or make it optional.

---

## ✅ CORRECTED DEPLOYMENT STEPS

### Step 1: Fix Migration Runner (DO THIS FIRST)

The migration runner needs to support Railway's `DATABASE_URL` format.

**Current issue**: `migrations/run.js` only reads individual DB variables  
**Solution**: Update it to parse `DATABASE_URL` like `database.js` does

### Step 2: Make Redis Optional (RECOMMENDED)

Your app will crash if Redis isn't available. Options:
1. Add Redis service on Railway (costs extra)
2. Make Redis optional for initial deployment

### Step 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub (ace1mbj-droid)
4. Click "Deploy from GitHub repo"
5. Select: `ace1mbj-droid/website-project`
6. Railway detects Node.js automatically

### Step 4: Add MySQL Database

1. In Railway dashboard, click "New"
2. Select "Database" → "MySQL"
3. Railway auto-creates `DATABASE_URL` variable
4. Format: `mysql://user:password@host:port/database`

### Step 5: Generate Secure Keys

Run these commands in your terminal:

```bash
# JWT_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Step 6: Set Environment Variables

Click your backend service → "Variables" → Add these:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<paste-first-generated-value>
JWT_REFRESH_SECRET=<paste-second-generated-value>
ENCRYPTION_KEY=<paste-third-generated-value>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://ace1.in
```

**Note**: `DATABASE_URL` is auto-set by Railway when you add MySQL.

### Step 7: Deploy & Monitor

1. Railway auto-deploys after adding variables
2. Watch "Deployments" tab for progress
3. Check logs for any errors
4. Wait for "Success" status (~2-3 minutes)

### Step 8: Get Backend URL

1. Go to "Settings" → "Domains"
2. Copy Railway URL (e.g., `https://website-project-production-xxxx.up.railway.app`)
3. Save this URL for frontend configuration

### Step 9: Test Deployment

**CORRECT health check**:
```bash
curl https://your-backend-url.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T12:00:00Z",
  "uptime": 123,
  "environment": "production",
  "database": "connected",
  "redis": "connected"
}
```

**If Redis is not available**, you'll see:
```json
{
  "status": "degraded",
  "database": "connected",
  "redis": "disconnected"
}
```

### Step 10: Update Frontend

Update `docs/assets/js/config.js`:

```javascript
const API_CONFIG = {
    baseURL: 'https://your-backend-url.railway.app/api',
    timeout: 30000
};
```

Then commit and push:
```bash
git add docs/assets/js/config.js
git commit -m "Update backend URL to Railway"
git push origin main
```

---

## 🔧 FIXES NEEDED BEFORE DEPLOYMENT

### Fix 1: Update Migration Runner

File: `backend/migrations/run.js`

Add this function at the top (after requires):

```javascript
/**
 * Parse DATABASE_URL if provided (Railway/Render format)
 */
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port, 10) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1),
      multipleStatements: true,
    };
  } catch (error) {
    console.error('Failed to parse DATABASE_URL:', error.message);
    return null;
  }
};
```

Then update `dbConfig`:

```javascript
// Database configuration - support Railway's DATABASE_URL
const parsedUrl = parseDatabaseUrl(process.env.DATABASE_URL);
const dbConfig = parsedUrl || {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'ace1_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ace1_development',
  multipleStatements: true,
};
```

### Fix 2: Make Redis Optional (Recommended)

File: `backend/src/config/redis.js`

Update to handle missing Redis gracefully:

```javascript
const healthCheck = async () => {
  if (!client || !client.isOpen) {
    return {
      status: 'not configured',
      healthy: false,
    };
  }
  
  try {
    await client.ping();
    return {
      status: 'connected',
      healthy: true,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      healthy: false,
      error: error.message,
    };
  }
};
```

File: `backend/src/app.js`

Update startup to not fail if Redis is unavailable:

```javascript
// Test connections before starting server
Promise.all([
  testConnection(),
  testRedis().catch(err => {
    console.warn('⚠️  Redis not available:', err.message);
    console.warn('⚠️  Continuing without Redis...');
  })
])
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] Fix migration runner to support DATABASE_URL
- [ ] Make Redis optional (or add Redis service on Railway)
- [ ] Commit and push fixes to GitHub
- [ ] Create Railway account
- [ ] Deploy from GitHub
- [ ] Add MySQL database
- [ ] Generate and set environment variables
- [ ] Monitor deployment logs
- [ ] Test health endpoint at `/health` (not `/api/health`)
- [ ] Update frontend configuration
- [ ] Test complete system

---

## 🚨 COMMON ISSUES

### Issue: Migrations fail on Railway
**Cause**: Migration runner doesn't support DATABASE_URL  
**Fix**: Apply Fix 1 above

### Issue: App crashes on startup
**Cause**: Redis connection fails  
**Fix**: Apply Fix 2 above or add Redis service

### Issue: Health check returns 404
**Cause**: Using wrong path `/api/health`  
**Fix**: Use `/health` instead

### Issue: CORS errors
**Cause**: FRONTEND_URL not set correctly  
**Fix**: Set `FRONTEND_URL=https://ace1.in` in Railway variables

---

## 📞 SUPPORT

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

**Next Step**: Apply the fixes above, then proceed with deployment!

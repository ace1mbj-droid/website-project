# Railway Deployment Guide

## Quick Start

### 1. Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Backend code pushed to GitHub

### 2. Deploy to Railway

#### Option A: Deploy via Dashboard (Recommended)

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Sign in with GitHub

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js and deploy

3. **Add MySQL Database**
   - In your project dashboard, click "New"
   - Select "Database" → "MySQL"
   - Railway automatically creates DATABASE_URL environment variable
   - Your backend will auto-connect

4. **Set Environment Variables**
   - Go to your backend service → "Variables"
   - Add the following variables:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-secure-32-char-string>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate-secure-32-char-string>
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=<generate-secure-32-char-string>
FRONTEND_URL=https://yourdomain.com
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBPROD
PAYTM_CALLBACK_URL=https://your-backend.railway.app/api/payment/callback
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@yourdomain.com
```

**Note:** Railway auto-sets `DATABASE_URL` when you add MySQL database.

5. **Deploy and Run Migrations**
   - Railway automatically runs: `node migrations/run.js && node src/app.js`
   - Check logs to verify migrations ran successfully
   - Your backend is now live!

6. **Get Your Backend URL**
   - Go to "Settings" → "Domains"
   - Copy the Railway-provided URL (e.g., `https://your-backend-production.up.railway.app`)
   - Use this URL in your frontend configuration

#### Option B: Deploy via CLI

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
cd backend
railway init
```

4. **Deploy**
```bash
railway up
```

5. **Add MySQL Database**
   - Go to Railway dashboard
   - Click "New" → "Database" → "MySQL"

6. **Run Migrations**
```bash
railway run node migrations/run.js
```

7. **View Logs**
```bash
railway logs
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing key | 32+ character string |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `ENCRYPTION_KEY` | Data encryption key | 32 character string |
| `FRONTEND_URL` | Frontend domain | `https://yourdomain.com` |

### Auto-Set by Railway

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `REDIS_URL` | Redis connection string (if added) |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PAYTM_MERCHANT_ID` | Paytm merchant ID | - |
| `PAYTM_MERCHANT_KEY` | Paytm merchant key | - |
| `SMTP_HOST` | Email SMTP host | - |
| `SMTP_USER` | Email SMTP user | - |
| `SMTP_PASSWORD` | Email SMTP password | - |

## Generate Secure Keys

```bash
# Generate JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Verify Deployment

### 1. Check Health Endpoint
```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T12:00:00Z",
  "uptime": 123,
  "database": "connected",
  "redis": "connected"
}
```

### 2. View Logs
```bash
# Via CLI
railway logs

# Via Dashboard
# Go to your service → "Deployments" → Click on latest deployment
```

### 3. Test API Endpoints
```bash
# Test products endpoint
curl https://your-backend.railway.app/api/products

# Test with authentication
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

## Troubleshooting

### Database Connection Issues

**Problem:** Backend can't connect to database

**Solution:**
1. Verify DATABASE_URL is set in Railway dashboard
2. Check database service is running
3. View logs: `railway logs`

### Migration Failures

**Problem:** Migrations don't run on deployment

**Solution:**
1. Check `railway.json` has correct start command
2. Manually run migrations: `railway run node migrations/run.js`
3. Check logs for specific error messages

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Verify `FRONTEND_URL` environment variable is set correctly
2. Check CORS configuration in `backend/src/app.js`
3. Ensure frontend is using correct backend URL

### Out of Memory

**Problem:** Backend crashes with memory errors

**Solution:**
1. Upgrade to paid tier for more resources
2. Optimize database queries
3. Add connection pooling limits

## Monitoring

### View Metrics
- Go to Railway dashboard → Your service
- View CPU, Memory, Network usage
- Set up alerts for crashes

### View Logs
```bash
# Real-time logs
railway logs --follow

# Last 100 lines
railway logs --lines 100

# Filter by service
railway logs --service backend
```

### Health Checks
- Railway automatically monitors your service
- Restarts on failures (configured in railway.json)
- View uptime in dashboard

## Scaling

### Free Tier Limits
- 500 hours/month
- 512MB RAM
- 1GB storage
- Shared CPU

### Upgrade Path
1. **Hobby Plan ($5/month)**
   - More resources
   - Better performance
   - Priority support

2. **Pro Plan ($20/month)**
   - Dedicated resources
   - Auto-scaling
   - Advanced monitoring

### When to Upgrade
- Approaching 500 hours/month
- Need more memory/CPU
- Require better performance
- Need longer backup retention

## Backup and Recovery

### Automatic Backups
- Railway provides daily backups (free tier: 7 days retention)
- Access via dashboard → Database → Backups

### Manual Backup
```bash
# Create backup
railway run mysqldump -u root railway > backup.sql

# Restore backup
railway run mysql -u root railway < backup.sql
```

### Disaster Recovery
1. Download latest backup from Railway dashboard
2. Store backups in cloud storage (S3, Google Cloud)
3. Test restore process monthly

## Custom Domain (Optional)

### Setup Custom Domain

1. **Add Domain in Railway**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter: `api.yourdomain.com`

2. **Update DNS**
   - Add CNAME record:
     - Name: `api`
     - Value: `your-backend.railway.app`
   - Wait for DNS propagation (up to 48 hours)

3. **Update Environment Variables**
   - Update `PAYTM_CALLBACK_URL` to use custom domain
   - Update frontend `API_CONFIG.baseURL`

4. **Verify**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

## Cost Optimization

### Free Tier Tips
- Monitor usage hours in dashboard
- Optimize startup time
- Use efficient database queries
- Enable connection pooling

### Reduce Costs
- Remove unused services
- Optimize memory usage
- Use caching (Redis)
- Upgrade only when needed

## Support

### Railway Resources
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Common Commands
```bash
# View all services
railway status

# Open dashboard
railway open

# Run command in Railway environment
railway run <command>

# Link to existing project
railway link

# Unlink project
railway unlink
```

## Next Steps

After successful deployment:

1. ✅ Update frontend configuration with backend URL
2. ✅ Test all API endpoints
3. ✅ Configure monitoring and alerts
4. ✅ Setup automated backups
5. ✅ Document deployment process
6. ✅ Plan for scaling when needed

---

**Your backend is now live on Railway! 🚀**

# Backend Deployment Checklist

## Pre-Deployment Checklist

### Code Preparation
- [x] `railway.json` configuration file created
- [x] `package.json` has correct start script
- [x] `.env.example` documents all required environment variables
- [x] `.gitignore` excludes sensitive files (.env, node_modules, logs)
- [x] Database configuration supports DATABASE_URL (Railway format)
- [ ] All code committed to GitHub
- [ ] GitHub repository is accessible

### Environment Variables Documentation
- [x] NODE_ENV
- [x] PORT
- [x] DATABASE_URL (auto-set by Railway)
- [x] JWT_SECRET
- [x] JWT_EXPIRES_IN
- [x] JWT_REFRESH_SECRET
- [x] JWT_REFRESH_EXPIRES_IN
- [x] ENCRYPTION_KEY
- [x] FRONTEND_URL
- [x] PAYTM credentials (optional)
- [x] SMTP credentials (optional)
- [x] REDIS_URL (optional, auto-set by Railway)

### Database Migrations
- [x] All migration files created in `migrations/` directory
- [x] Migration runner script exists (`migrations/run.js`)
- [x] Migrations tested locally
- [ ] Migrations ready to run on Railway

### Security
- [x] Security headers configured (Helmet)
- [x] CORS configured for production domain
- [x] Rate limiting implemented
- [x] Input validation middleware in place
- [x] JWT authentication implemented
- [x] Password hashing with bcrypt
- [x] SQL injection prevention (parameterized queries)

## Railway Deployment Steps

### 1. Sign Up and Create Project
- [ ] Sign up at [railway.app](https://railway.app)
- [ ] Create new project
- [ ] Connect GitHub account

### 2. Deploy Backend
- [ ] Deploy from GitHub repository
- [ ] Verify deployment successful
- [ ] Check build logs for errors

### 3. Add MySQL Database
- [ ] Add MySQL service in Railway dashboard
- [ ] Verify DATABASE_URL is auto-set
- [ ] Check database connection in logs

### 4. Configure Environment Variables
- [ ] Set NODE_ENV=production
- [ ] Generate and set JWT_SECRET (32+ chars)
- [ ] Generate and set JWT_REFRESH_SECRET (32+ chars)
- [ ] Generate and set ENCRYPTION_KEY (32 chars)
- [ ] Set FRONTEND_URL to your domain
- [ ] Set Paytm credentials (if using payments)
- [ ] Set SMTP credentials (if using email)
- [ ] Verify all variables are set correctly

### 5. Run Database Migrations
- [ ] Migrations run automatically on deployment
- [ ] OR manually run: `railway run node migrations/run.js`
- [ ] Verify all tables created successfully
- [ ] Check logs for migration errors

### 6. Get Backend URL
- [ ] Copy Railway-provided URL from dashboard
- [ ] Format: `https://your-backend-production.up.railway.app`
- [ ] Save URL for frontend configuration

## Post-Deployment Verification

### Health Check
- [ ] Test health endpoint: `GET /api/health`
- [ ] Verify response shows "healthy" status
- [ ] Check database connection status
- [ ] Check Redis connection status (if using)

### API Endpoints Testing
- [ ] Test authentication endpoints
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/logout
  - [ ] GET /api/auth/me
- [ ] Test product endpoints
  - [ ] GET /api/products
  - [ ] GET /api/products/:id
- [ ] Test cart endpoints (requires auth)
  - [ ] GET /api/cart
  - [ ] POST /api/cart/items
- [ ] Test order endpoints (requires auth)
  - [ ] POST /api/orders
  - [ ] GET /api/orders

### CORS Verification
- [ ] Test API call from frontend domain
- [ ] Verify no CORS errors in browser console
- [ ] Check CORS headers in response

### Logging and Monitoring
- [ ] View logs in Railway dashboard
- [ ] Check for any error messages
- [ ] Verify application is running
- [ ] Monitor CPU and memory usage

### Security Verification
- [ ] Test rate limiting (make multiple rapid requests)
- [ ] Verify JWT authentication works
- [ ] Test unauthorized access returns 401
- [ ] Verify security headers are present

## Frontend Integration

### Update Frontend Configuration
- [ ] Create `docs/assets/js/config.js`
- [ ] Set API_CONFIG.baseURL to Railway URL
- [ ] Update all API calls to use config
- [ ] Remove hardcoded localhost URLs

### Update Backend CORS
- [ ] Add frontend domain to CORS whitelist
- [ ] Test API calls from frontend
- [ ] Verify no CORS errors

### Deploy Frontend
- [ ] Upload updated files via FTP
- [ ] Test website loads correctly
- [ ] Test API integration works
- [ ] Verify no console errors

## Monitoring Setup

### Railway Dashboard
- [ ] Bookmark Railway dashboard URL
- [ ] Setup email notifications for crashes
- [ ] Monitor usage hours (free tier: 500 hours/month)
- [ ] Check database storage usage

### Optional Monitoring
- [ ] Setup Sentry for error tracking
- [ ] Setup UptimeRobot for uptime monitoring
- [ ] Configure log aggregation

## Backup Configuration

### Automatic Backups
- [ ] Verify Railway automatic backups are enabled
- [ ] Check backup retention policy (7 days on free tier)
- [ ] Document backup access procedure

### Manual Backup
- [ ] Test manual backup: `railway run mysqldump -u root railway > backup.sql`
- [ ] Store backup in secure location
- [ ] Document restore procedure

## Documentation

### Deployment Documentation
- [ ] Document Railway deployment process
- [ ] Document environment variables
- [ ] Create troubleshooting guide
- [ ] Document rollback procedure

### Team Access
- [ ] Share Railway project access with team
- [ ] Document how to view logs
- [ ] Document how to deploy updates

## Performance Optimization

### Initial Optimization
- [ ] Enable compression middleware
- [ ] Configure connection pooling
- [ ] Optimize database queries
- [ ] Add caching where appropriate

### Monitoring
- [ ] Monitor response times
- [ ] Check database query performance
- [ ] Monitor memory usage
- [ ] Track API endpoint usage

## Scaling Plan

### Free Tier Monitoring
- [ ] Monitor usage hours (500 hours/month limit)
- [ ] Track memory usage (512MB limit)
- [ ] Monitor database storage (1GB limit)

### Upgrade Triggers
- [ ] Approaching 500 hours/month
- [ ] Memory usage consistently high
- [ ] Database storage approaching limit
- [ ] Need better performance

### Upgrade Path
- [ ] Hobby Plan: $5/month (more resources)
- [ ] Pro Plan: $20/month (dedicated resources)

## Troubleshooting

### Common Issues
- [ ] Database connection failures → Check DATABASE_URL
- [ ] Migration errors → Check logs, run manually
- [ ] CORS errors → Verify FRONTEND_URL and CORS config
- [ ] Out of memory → Optimize queries, upgrade tier
- [ ] Slow response times → Add caching, optimize code

### Support Resources
- [ ] Railway Docs: https://docs.railway.app
- [ ] Railway Discord: https://discord.gg/railway
- [ ] Railway Status: https://status.railway.app

## Go-Live Checklist

### Final Verification
- [ ] All API endpoints working
- [ ] Frontend successfully integrated
- [ ] Email notifications working (if configured)
- [ ] Payment integration tested (if configured)
- [ ] Admin panel accessible and functional
- [ ] Security headers verified
- [ ] Performance acceptable
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Documentation complete

### Launch
- [ ] Announce deployment to team
- [ ] Monitor closely for first 24 hours
- [ ] Address any issues immediately
- [ ] Document lessons learned

---

## Quick Reference

### Railway CLI Commands
```bash
# View logs
railway logs

# Run migrations
railway run node migrations/run.js

# Open dashboard
railway open

# Check status
railway status
```

### Generate Secure Keys
```bash
# JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Test Health Endpoint
```bash
curl https://your-backend.railway.app/api/health
```

---

**Deployment Status:** Ready for Railway deployment ✅

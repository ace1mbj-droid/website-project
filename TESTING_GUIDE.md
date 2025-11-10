# Testing Guide - Ace#1 E-Commerce System

## Overview

This guide explains how to test your complete Ace#1 e-commerce website, including both frontend and backend components.

## Quick Start

### Run All Tests

```bash
./test-all.sh
```

This will test:
- ✅ Frontend files and structure
- ✅ Backend API and database
- ✅ Dependencies and configuration
- ✅ Security settings
- ✅ Encryption system

## Individual Test Scripts

### 1. Frontend Tests

Test the website frontend (HTML, CSS, JavaScript):

```bash
./test-frontend.sh
```

**What it tests:**
- HTML pages exist
- CSS files are present
- JavaScript files are valid
- Image assets are available
- Security configuration (.htaccess)
- No sensitive files exposed
- .gitignore configuration

### 2. Backend Tests

Test the Node.js backend API:

```bash
cd backend
node scripts/test-system.js
```

**What it tests:**
- Environment variables configured
- Database connection
- Redis connection
- Encryption system
- Database models loaded
- API endpoints registered
- Node.js dependencies installed

### 3. Database Tests

Test database connection and tables:

```bash
cd backend
node scripts/test-connection.js
```

## Prerequisites

Before running tests, ensure you have:

### Required Software

- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ Redis 7.0+ installed and running (optional)
- ✅ npm package manager

### Configuration

1. **Environment Variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Database Setup**
   ```bash
   cd backend
   node scripts/setup-database.js
   ```

3. **Run Migrations**
   ```bash
   cd backend
   node migrations/run.js
   ```

4. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

## Manual Testing

### Test Frontend Locally

**Option 1: Direct File Access**
```bash
open docs/index.html
```

**Option 2: Local Server (Recommended)**
```bash
# Using Python
python3 -m http.server 8080 --directory docs

# Using Node.js (http-server)
npx http-server docs -p 8080

# Using PHP
php -S localhost:8080 -t docs
```

Then visit: http://localhost:8080

### Test Backend API

1. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Test API Endpoints**
   ```bash
   # Health check
   curl http://localhost:3000/api/health
   
   # Get products
   curl http://localhost:3000/api/products
   
   # Register user
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'
   ```

## Test Scenarios

### Scenario 1: User Registration and Login

1. Open http://localhost:8080/ace-register.html
2. Fill in registration form
3. Submit and verify success
4. Go to login page
5. Login with credentials
6. Verify redirect to profile

### Scenario 2: Browse and Add to Cart

1. Open http://localhost:8080/ace-products.html
2. Browse products
3. Click "Add to Cart" on a product
4. Verify cart count updates
5. Go to cart page
6. Verify product is in cart

### Scenario 3: Checkout Process

1. Add items to cart
2. Go to checkout page
3. Fill in shipping address
4. Select payment method
5. Place order
6. Verify order confirmation

### Scenario 4: Admin Dashboard

1. Login as admin
2. Go to http://localhost:8080/admin-dashboard.html
3. View analytics
4. Manage products
5. View orders
6. Update order status

## Automated Testing

### Unit Tests (Future)

```bash
cd backend
npm test
```

### Integration Tests (Future)

```bash
cd backend
npm run test:integration
```

### End-to-End Tests (Future)

```bash
npm run test:e2e
```

## Common Issues and Solutions

### Issue: Database Connection Failed

**Solution:**
```bash
# Check if MySQL is running
brew services list

# Start MySQL
brew services start mysql

# Verify credentials in .env
cat backend/.env | grep DB_
```

### Issue: Redis Connection Failed

**Solution:**
```bash
# Check if Redis is running
brew services list

# Start Redis
brew services start redis

# Test Redis
redis-cli ping
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

### Issue: Missing Dependencies

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Migration Errors

**Solution:**
```bash
cd backend

# Reset database (WARNING: deletes all data)
mysql -u root -p -e "DROP DATABASE ace1_development; CREATE DATABASE ace1_development;"

# Run migrations again
node migrations/run.js
```

### Issue: ENCRYPTION_KEY Not Set

**Solution:**
```bash
cd backend
node scripts/generate-encryption-key.js
# Copy the key to .env
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test API endpoint
ab -n 1000 -c 10 http://localhost:3000/api/products

# Test with authentication
ab -n 100 -c 5 -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/orders
```

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 50 http://localhost:3000/api/products
```

## Security Testing

### Check Security Headers

```bash
curl -I http://localhost:8080/index.html | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection"
```

### Test Rate Limiting

```bash
# Send multiple requests quickly
for i in {1..10}; do
  curl http://localhost:3000/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Test SQL Injection Prevention

```bash
curl "http://localhost:3000/api/products?category='; DROP TABLE products; --"
```

## Browser Testing

Test in multiple browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Mobile Testing

Test responsive design:
- Open Chrome DevTools (F12)
- Click device toolbar icon
- Test different screen sizes
- Test touch interactions

## Continuous Integration

### GitHub Actions (Future)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: ace1_test
        ports:
          - 3306:3306
      
      redis:
        image: redis:7.0
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Run tests
        run: cd backend && npm test
```

## Test Coverage

### Generate Coverage Report

```bash
cd backend
npm run test:coverage
```

### View Coverage

```bash
open backend/coverage/index.html
```

## Monitoring and Logging

### View Application Logs

```bash
# Backend logs
tail -f backend/logs/app.log

# Error logs
tail -f backend/logs/error.log

# PM2 logs (if using PM2)
pm2 logs ace1-api
```

### Monitor System Resources

```bash
# CPU and Memory
top

# Disk usage
df -h

# Network connections
netstat -an | grep 3000
```

## Test Checklist

Before deploying to production:

### Frontend
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms validate properly
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Responsive design works on mobile
- [ ] Images load correctly
- [ ] No console errors

### Backend
- [ ] All API endpoints respond
- [ ] Authentication works
- [ ] Database queries execute
- [ ] Encryption/decryption works
- [ ] Rate limiting functions
- [ ] Error handling works
- [ ] Logging is configured
- [ ] Security headers present

### Security
- [ ] No credentials in code
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Input validation works
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled
- [ ] Rate limiting active

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN configured (if applicable)

## Getting Help

If tests fail:

1. **Check the error messages** - They usually indicate the problem
2. **Review the logs** - Check backend/logs/ for details
3. **Verify configuration** - Ensure .env is properly configured
4. **Check services** - Ensure MySQL and Redis are running
5. **Review documentation** - Check README.md and other guides

## Next Steps

After all tests pass:

1. ✅ Deploy to staging environment
2. ✅ Run tests on staging
3. ✅ Perform user acceptance testing
4. ✅ Deploy to production
5. ✅ Monitor production logs
6. ✅ Set up alerts and monitoring

---

**Happy Testing! 🧪**

For more information, see:
- `README.md` - Project overview
- `backend/README.md` - Backend documentation
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide

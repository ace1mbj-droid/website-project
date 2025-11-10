# Backend Setup Guide

## ✅ Task 2 Complete: Node.js Backend Project Initialized

**Date:** November 10, 2025  
**Status:** ✅ Project Structure Created

---

## 📁 Project Structure Created

```
backend/
├── src/
│   ├── config/          # Database, JWT, email configuration
│   ├── middleware/      # Auth, rate limiting, validation
│   ├── models/          # Database models and queries
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper functions
│   └── app.js           # Express application setup ✅
├── migrations/          # Database migration scripts
├── tests/               # Test files (to be created)
├── .env.example         # Environment variables template ✅
├── .eslintrc.json       # ESLint configuration ✅
├── .gitignore           # Git ignore rules ✅
├── package.json         # Dependencies and scripts ✅
└── README.md            # Backend documentation ✅
```

---

## 🚀 Installation Steps

### Step 1: Install Node.js

**Check if Node.js is installed:**
```bash
node --version
```

**If not installed, install Node.js 18+:**

**macOS (Homebrew):**
```bash
brew install node@18
```

**Or download from:** https://nodejs.org/

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

### Step 2: Install MySQL

**macOS (Homebrew):**
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

**Verify installation:**
```bash
mysql --version
```

---

### Step 3: Install Redis

**macOS (Homebrew):**
```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Test Redis
redis-cli ping  # Should return: PONG
```

---

### Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

**This will install:**
- Express.js (web framework)
- MySQL2 (database driver)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- And 15+ other dependencies

**Installation time:** ~2-3 minutes

---

## ⚙️ Configuration

### Step 1: Create .env File

```bash
cd backend
cp .env.example .env
```

### Step 2: Generate Secrets

**Generate JWT secrets:**
```bash
# Generate JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate refresh secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate encryption key (32 characters exactly)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Step 3: Update .env File

Edit `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ace1_development
DB_USER=ace1_user
DB_PASSWORD=YOUR_DB_PASSWORD_HERE

# JWT (paste generated secrets)
JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=YOUR_GENERATED_REFRESH_SECRET_HERE
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Paytm (get from Paytm Business dashboard)
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBSTAGING
PAYTM_CALLBACK_URL=http://localhost:3000/api/payment/callback

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@ace1.in

# Security
ENCRYPTION_KEY=YOUR_GENERATED_ENCRYPTION_KEY_HERE
RATE_LIMIT_MAX=100

# Frontend
FRONTEND_URL=http://localhost:8080
```

---

## 🗄️ Database Setup

### Step 1: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE ace1_development;
CREATE USER 'ace1_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ace1_development.* TO 'ace1_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Test Database Connection

```bash
mysql -u ace1_user -p ace1_development
# Enter password when prompted
# If successful, you'll see: mysql>
EXIT;
```

---

## 🧪 Testing the Setup

### Step 1: Start the Server

```bash
cd backend
npm start
```

**Expected output:**
```
🚀 Server running on http://localhost:3000
📝 Environment: development
🏥 Health check: http://localhost:3000/health
```

### Step 2: Test Health Endpoint

**In another terminal:**
```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T12:00:00.000Z",
  "uptime": 5.123,
  "environment": "development"
}
```

### Step 3: Test 404 Handler

```bash
curl http://localhost:3000/api/nonexistent
```

**Expected response:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Route not found"
  }
}
```

---

## 📦 Dependencies Installed

### Production Dependencies:
- **express** - Web framework
- **mysql2** - MySQL database driver
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **joi** - Input validation
- **nodemailer** - Email sending
- **bull** - Job queue (with Redis)
- **redis** - Redis client
- **winston** - Logging
- **compression** - Response compression
- **cookie-parser** - Cookie parsing

### Development Dependencies:
- **nodemon** - Auto-reload during development
- **jest** - Testing framework
- **supertest** - API testing
- **eslint** - Code linting

---

## 🎯 What's Next?

### Completed:
- ✅ Project structure created
- ✅ package.json configured
- ✅ Express app skeleton created
- ✅ Environment variables template
- ✅ ESLint configuration
- ✅ Git ignore rules
- ✅ Documentation

### Next Tasks (Phase 2):
- [ ] Task 2.1: Setup database configuration
- [ ] Task 2.2: Create database migration system
- [ ] Task 2.3: Implement database models
- [ ] Task 2.4: Setup Redis for sessions
- [ ] Task 2.5: Configure JWT authentication
- [ ] Task 2.6: Create authentication middleware
- [ ] Task 2.7: Implement rate limiting
- [ ] Task 2.8: Setup input validation
- [ ] Task 2.9: Create error handler

---

## 🔧 Development Workflow

### Running in Development Mode:
```bash
npm run dev  # Auto-reloads on file changes
```

### Running Tests:
```bash
npm test
```

### Linting Code:
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Database Migrations:
```bash
npm run migrate:up    # Run migrations
npm run migrate:down  # Rollback migrations
```

---

## 📊 Project Status

**Phase 2 Progress:** 1/9 tasks complete (11%)

**Task 2:** ✅ COMPLETE  
**Task 2.1:** ⏳ Next  
**Task 2.2:** ⏳ Pending  
**Task 2.3:** ⏳ Pending  
**Task 2.4:** ⏳ Pending  
**Task 2.5:** ⏳ Pending  
**Task 2.6:** ⏳ Pending  
**Task 2.7:** ⏳ Pending  
**Task 2.8:** ⏳ Pending  
**Task 2.9:** ⏳ Pending  

---

## 🐛 Troubleshooting

### Node.js Not Found:
```bash
# Install Node.js
brew install node@18

# Or download from nodejs.org
```

### MySQL Connection Error:
```bash
# Check MySQL is running
brew services list | grep mysql

# Start MySQL if not running
brew services start mysql
```

### Redis Connection Error:
```bash
# Check Redis is running
brew services list | grep redis

# Start Redis if not running
brew services start redis
```

### Port Already in Use:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

---

## 📚 Resources

- **Express.js Docs:** https://expressjs.com/
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Redis Docs:** https://redis.io/docs/
- **JWT Docs:** https://jwt.io/
- **Node.js Docs:** https://nodejs.org/docs/

---

**Status:** ✅ Backend Project Initialized  
**Next:** Task 2.1 - Setup Database Configuration  
**Ready to Continue:** ✅ YES

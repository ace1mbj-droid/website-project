# Database Setup Guide

This guide will help you set up the MySQL database for the Ace#1 backend API.

## Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ Backend dependencies installed (`npm install`)

## Quick Start

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
cd backend
npm run db:setup
```

This script will:
1. Prompt for MySQL root credentials
2. Create the database
3. Create the database user
4. Grant necessary privileges
5. Test the connection

### Option 2: Manual Setup

If you prefer to set up manually:

```bash
# 1. Connect to MySQL as root
mysql -u root -p

# 2. Create database
CREATE DATABASE ace1_development;

# 3. Create user (replace 'your_password' with your actual password from .env)
CREATE USER 'ace1_user'@'localhost' IDENTIFIED BY 'your_password';

# 4. Grant privileges
GRANT ALL PRIVILEGES ON ace1_development.* TO 'ace1_user'@'localhost';
FLUSH PRIVILEGES;

# 5. Exit MySQL
EXIT;
```

## Configuration

### 1. Environment Variables

Make sure your `.env` file has the correct database configuration:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ace1_development
DB_USER=ace1_user
DB_PASSWORD=your_secure_password_here
```

**Important:** 
- Use a strong password for `DB_PASSWORD`
- Never commit your `.env` file to Git
- For production, use different credentials

### 2. Test Connection

After setup, test your database connection:

```bash
npm run db:test
```

You should see:
```
✅ Database connection successful
✅ Database connection pool created
📊 Health Status: { status: 'connected', healthy: true }
```

## Database Connection Pool

The application uses connection pooling for better performance:

**Configuration:**
- **Connection Limit:** 10 concurrent connections
- **Wait for Connections:** Yes
- **Keep Alive:** Enabled

**Benefits:**
- Reuses database connections
- Handles multiple requests efficiently
- Automatic connection management

## Troubleshooting

### Issue: "ER_ACCESS_DENIED_ERROR"

**Problem:** MySQL credentials are incorrect

**Solution:**
1. Check your `.env` file has correct `DB_PASSWORD`
2. Verify user exists: `mysql -u ace1_user -p`
3. Re-run setup script: `npm run db:setup`

### Issue: "ECONNREFUSED"

**Problem:** MySQL is not running

**Solution:**

**macOS:**
```bash
# Start MySQL
brew services start mysql

# Check status
brew services list
```

**Linux:**
```bash
# Start MySQL
sudo systemctl start mysql

# Check status
sudo systemctl status mysql
```

**Windows:**
```bash
# Start MySQL service
net start MySQL80
```

### Issue: "ER_DBACCESS_DENIED_ERROR"

**Problem:** User doesn't have privileges

**Solution:**
```bash
mysql -u root -p

GRANT ALL PRIVILEGES ON ace1_development.* TO 'ace1_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Issue: "Unknown database"

**Problem:** Database doesn't exist

**Solution:**
```bash
mysql -u root -p

CREATE DATABASE ace1_development;
EXIT;
```

## Database Functions

The database module provides several utility functions:

### `getPool()`
Returns the connection pool instance.

```javascript
const { getPool } = require('./config/database');
const pool = getPool();
```

### `query(sql, params)`
Execute a parameterized query.

```javascript
const { query } = require('./config/database');

// Example
const users = await query(
  'SELECT * FROM users WHERE email = ?',
  ['user@example.com']
);
```

### `transaction(callback)`
Execute multiple queries in a transaction.

```javascript
const { transaction } = require('./config/database');

await transaction(async (connection) => {
  await connection.execute('INSERT INTO orders ...');
  await connection.execute('UPDATE products ...');
  // If any query fails, all changes are rolled back
});
```

### `healthCheck()`
Check database connection health.

```javascript
const { healthCheck } = require('./config/database');

const health = await healthCheck();
// Returns: { status: 'connected', healthy: true }
```

### `testConnection()`
Test database connection on startup.

```javascript
const { testConnection } = require('./config/database');

await testConnection();
// Throws error if connection fails
```

## Next Steps

After database setup is complete:

1. **Run Migrations:**
   ```bash
   npm run migrate:up
   ```
   This will create all necessary tables.

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Health Endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-11-10T12:00:00Z",
     "uptime": 10.5,
     "environment": "development",
     "database": "connected"
   }
   ```

## Production Setup

For production environments:

### 1. Use Strong Credentials

```bash
# Generate secure password
openssl rand -base64 32
```

### 2. Configure Connection Pool

Adjust pool size based on your load:

```javascript
// In database.js
connectionLimit: 20,  // Increase for high traffic
```

### 3. Enable SSL

```javascript
// In database.js
ssl: {
  ca: fs.readFileSync('/path/to/ca-cert.pem'),
}
```

### 4. Use Environment-Specific Databases

```bash
# .env.production
DB_NAME=ace1_production
DB_USER=ace1_prod_user
```

### 5. Set Up Backups

```bash
# Daily backup script
mysqldump -u ace1_user -p ace1_production > backup_$(date +%Y%m%d).sql
```

## Security Best Practices

1. **Never use root user** for application connections
2. **Use strong passwords** (minimum 16 characters)
3. **Limit user privileges** to only what's needed
4. **Use parameterized queries** to prevent SQL injection
5. **Enable SSL** for production databases
6. **Rotate credentials** regularly
7. **Monitor connection usage** and adjust pool size
8. **Keep MySQL updated** to latest stable version

## Database Schema

After running migrations, your database will have these tables:

- `users` - User accounts and authentication
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart items
- `sessions` - User sessions
- `ratings` - Product ratings and reviews
- `wallet_transactions` - Wallet transaction history
- `audit_logs` - Admin action audit trail

See `migrations/` directory for detailed schema definitions.

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages carefully
3. Test connection: `npm run db:test`
4. Check MySQL logs: `/var/log/mysql/error.log`
5. Verify MySQL is running: `mysql -u root -p`

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js MySQL2 Package](https://github.com/sidorares/node-mysql2)
- [Connection Pooling Best Practices](https://github.com/sidorares/node-mysql2#using-connection-pools)

---

**Status:** Database configuration complete ✅  
**Next:** Run migrations to create tables

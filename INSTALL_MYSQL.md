# MySQL Installation Guide for macOS

## Quick Install (Recommended)

### Using Homebrew

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure the installation
mysql_secure_installation
```

## Detailed Installation Steps

### Step 1: Install Homebrew (if not installed)

Check if Homebrew is installed:
```bash
brew --version
```

If not installed, install it:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install MySQL

```bash
# Update Homebrew
brew update

# Install MySQL
brew install mysql

# Check installation
mysql --version
```

### Step 3: Start MySQL

**Option A: Start as a service (recommended)**
```bash
# Start MySQL and set it to run at login
brew services start mysql
```

**Option B: Start manually**
```bash
# Start MySQL server
mysql.server start
```

### Step 4: Secure MySQL Installation

Run the security script:
```bash
mysql_secure_installation
```

You'll be asked:
1. **Set root password?** → Yes (choose a strong password)
2. **Remove anonymous users?** → Yes
3. **Disallow root login remotely?** → Yes
4. **Remove test database?** → Yes
5. **Reload privilege tables?** → Yes

### Step 5: Test MySQL Connection

```bash
# Connect to MySQL
mysql -u root -p

# You should see the MySQL prompt:
# mysql>

# Test with a simple query
SELECT VERSION();

# Exit
exit;
```

## Configuration for Ace#1 Project

### Create Database and User

```bash
# Connect to MySQL as root
mysql -u root -p

# Run these commands in MySQL:
CREATE DATABASE ace1_development;
CREATE USER 'ace1_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ace1_development.* TO 'ace1_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

### Update .env File

Edit `backend/.env`:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ace1_development
DB_USER=ace1_user
DB_PASSWORD=your_secure_password
```

### Test Connection

```bash
cd backend
node scripts/test-connection.js
```

## Alternative: MySQL Community Server

If you prefer the official MySQL installer:

1. **Download MySQL**
   - Visit: https://dev.mysql.com/downloads/mysql/
   - Choose macOS version
   - Download DMG Archive

2. **Install**
   - Open the DMG file
   - Run the installer
   - Follow the installation wizard
   - **Important:** Save the temporary root password shown at the end

3. **Start MySQL**
   - Open System Preferences
   - Click MySQL
   - Click "Start MySQL Server"

4. **Add to PATH**
   ```bash
   echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

5. **Change Root Password**
   ```bash
   mysql -u root -p
   # Enter the temporary password
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   ```

## Common Commands

### Service Management

```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Restart MySQL
brew services restart mysql

# Check status
brew services list
```

### Manual Start/Stop

```bash
# Start
mysql.server start

# Stop
mysql.server stop

# Restart
mysql.server restart

# Status
mysql.server status
```

### Connect to MySQL

```bash
# As root
mysql -u root -p

# As specific user
mysql -u ace1_user -p ace1_development

# With password in command (not recommended for production)
mysql -u ace1_user -pYourPassword ace1_development
```

## Troubleshooting

### Issue: MySQL won't start

**Solution 1: Check if port 3306 is in use**
```bash
lsof -i :3306
# If something is using it, kill the process
kill -9 <PID>
```

**Solution 2: Check error logs**
```bash
# Homebrew installation
tail -f /usr/local/var/mysql/*.err

# Official installation
tail -f /usr/local/mysql/data/*.err
```

**Solution 3: Reset MySQL**
```bash
brew services stop mysql
rm -rf /usr/local/var/mysql
brew postinstall mysql
brew services start mysql
```

### Issue: Can't connect to MySQL

**Check if MySQL is running:**
```bash
ps aux | grep mysql
```

**Check MySQL socket:**
```bash
ls -la /tmp/mysql.sock
```

**Try connecting with socket:**
```bash
mysql -u root -p --socket=/tmp/mysql.sock
```

### Issue: Access denied for user

**Reset root password:**
```bash
# Stop MySQL
brew services stop mysql

# Start in safe mode
mysqld_safe --skip-grant-tables &

# Connect without password
mysql -u root

# Reset password
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
exit;

# Restart MySQL normally
killall mysqld
brew services start mysql
```

### Issue: Port 3306 already in use

**Find what's using the port:**
```bash
lsof -i :3306
```

**Use a different port:**
Edit `/usr/local/etc/my.cnf`:
```ini
[mysqld]
port = 3307
```

Then update your `.env`:
```bash
DB_PORT=3307
```

## Verify Installation

Run this script to verify everything is working:

```bash
cd backend
node scripts/test-connection.js
```

Or manually test:

```bash
# 1. Check MySQL is running
brew services list | grep mysql

# 2. Connect to MySQL
mysql -u root -p

# 3. Show databases
SHOW DATABASES;

# 4. Use your database
USE ace1_development;

# 5. Show tables
SHOW TABLES;
```

## Uninstall MySQL (if needed)

```bash
# Stop MySQL
brew services stop mysql

# Uninstall
brew uninstall mysql

# Remove data (optional - this deletes all databases!)
rm -rf /usr/local/var/mysql
rm -rf /usr/local/etc/my.cnf
```

## Next Steps

After MySQL is installed and running:

1. ✅ Create database: `node backend/scripts/setup-database.js`
2. ✅ Run migrations: `node backend/migrations/run.js`
3. ✅ Test connection: `node backend/scripts/test-connection.js`
4. ✅ Start backend: `cd backend && npm start`
5. ✅ Run tests: `./test-all.sh`

## MySQL Configuration File

Create `/usr/local/etc/my.cnf` for custom settings:

```ini
[mysqld]
# Basic Settings
port = 3306
socket = /tmp/mysql.sock
datadir = /usr/local/var/mysql

# Character Set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Performance
max_connections = 200
max_allowed_packet = 64M

# Logging
log_error = /usr/local/var/mysql/error.log
slow_query_log = 1
slow_query_log_file = /usr/local/var/mysql/slow.log
long_query_time = 2

[client]
port = 3306
socket = /tmp/mysql.sock
default-character-set = utf8mb4
```

## Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Create database
CREATE DATABASE database_name;

-- Drop database
DROP DATABASE database_name;

-- Show all users
SELECT User, Host FROM mysql.user;

-- Create user
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON database.* TO 'username'@'localhost';

-- Show grants
SHOW GRANTS FOR 'username'@'localhost';

-- Revoke privileges
REVOKE ALL PRIVILEGES ON database.* FROM 'username'@'localhost';

-- Drop user
DROP USER 'username'@'localhost';

-- Show tables
SHOW TABLES;

-- Describe table
DESCRIBE table_name;

-- Show table creation
SHOW CREATE TABLE table_name;

-- Export database
mysqldump -u root -p database_name > backup.sql

-- Import database
mysql -u root -p database_name < backup.sql
```

## Resources

- **Official Documentation**: https://dev.mysql.com/doc/
- **Homebrew MySQL**: https://formulae.brew.sh/formula/mysql
- **MySQL Workbench** (GUI): https://dev.mysql.com/downloads/workbench/
- **Sequel Ace** (macOS GUI): https://sequel-ace.com/

---

**Need Help?**

If you encounter issues:
1. Check the error logs
2. Review this guide
3. Search for the specific error message
4. Check MySQL documentation

**Your MySQL installation should now be complete!** 🎉

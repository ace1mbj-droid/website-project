# Railway Database Connection Info

## What You Saw: `metro.proxy.rlwy.net:56051`

This is Railway's **TCP proxy domain and port** for your MySQL database. Railway automatically provides this when you add a MySQL service.

### How Railway Database Works

When you add MySQL to your Railway project, Railway provides:

1. **DATABASE_URL** (Primary - Use This)
   ```
   mysql://user:password@host:port/database
   ```
   - Automatically set as environment variable
   - Your backend reads this automatically
   - No manual configuration needed

2. **TCP Proxy** (For External Connections)
   ```
   Host: metro.proxy.rlwy.net
   Port: 56051 (example)
   ```
   - For connecting from your local machine
   - For database GUI tools (MySQL Workbench, TablePlus, etc.)
   - NOT needed for your deployed backend

### Your Backend Configuration

Your backend (`backend/src/config/database.js`) automatically handles Railway's `DATABASE_URL`:

```javascript
// Automatically parses Railway's DATABASE_URL format
const parsedUrl = parseDatabaseUrl(process.env.DATABASE_URL);
```

**You don't need to configure anything manually!**

## Railway Database Setup (What Happens)

### When You Add MySQL on Railway:

1. **Railway creates MySQL instance**
2. **Railway sets environment variables automatically:**
   - `DATABASE_URL` - Full connection string
   - `MYSQL_URL` - Same as DATABASE_URL
   - `MYSQL_HOST` - Database host
   - `MYSQL_PORT` - Database port
   - `MYSQL_USER` - Database user
   - `MYSQL_PASSWORD` - Database password
   - `MYSQL_DATABASE` - Database name

3. **Your backend connects automatically** using `DATABASE_URL`

### What You Need to Do:

**Nothing!** Railway handles everything automatically.

## Connecting from Your Local Machine (Optional)

If you want to connect to your Railway database from your local machine (for debugging, viewing data, etc.):

### Option 1: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway connect mysql
```

### Option 2: Database GUI Tool

Use the TCP proxy details from Railway dashboard:

1. Go to Railway → Your MySQL service → "Connect"
2. Copy connection details:
   ```
   Host: metro.proxy.rlwy.net
   Port: 56051 (your specific port)
   User: root
   Password: <from Railway dashboard>
   Database: railway
   ```

3. Use in MySQL Workbench, TablePlus, or any MySQL client

### Option 3: Direct Connection String

From Railway dashboard, copy the `DATABASE_URL` and use it locally:

```bash
# Set in your local .env for testing
DATABASE_URL=mysql://root:password@metro.proxy.rlwy.net:56051/railway
```

## Database Variables Railway Sets

| Variable | Example | Used By |
|----------|---------|---------|
| `DATABASE_URL` | `mysql://root:pass@host:port/db` | Your backend (primary) |
| `MYSQL_HOST` | `metro.proxy.rlwy.net` | Alternative connection |
| `MYSQL_PORT` | `56051` | Alternative connection |
| `MYSQL_USER` | `root` | Alternative connection |
| `MYSQL_PASSWORD` | `<random>` | Alternative connection |
| `MYSQL_DATABASE` | `railway` | Alternative connection |

**Your backend uses `DATABASE_URL` automatically** - you don't need to set the individual variables.

## Migrations on Railway

Your migrations run automatically because:

1. `railway.json` specifies: `node migrations/run.js && node src/app.js`
2. `migrations/run.js` reads `DATABASE_URL` automatically
3. Railway runs migrations before starting your app

### Check Migration Status

```bash
# Via Railway CLI
railway logs

# Look for these lines:
# ✅ Connected
# ✅ Migrations table ready
# ⬆️  Running: 001_create_users.sql
# ✅ Completed: 001_create_users.sql
```

## Database Management

### View Database Logs

```bash
# Via Railway dashboard
Railway → MySQL service → Deployments → View logs

# Via CLI
railway logs --service mysql
```

### Run SQL Queries

```bash
# Via Railway CLI
railway connect mysql

# Then run SQL:
mysql> SHOW TABLES;
mysql> SELECT * FROM users;
```

### Backup Database

```bash
# Via Railway CLI
railway run mysqldump railway > backup.sql

# Restore
railway run mysql railway < backup.sql
```

## Common Questions

### Q: Do I need to configure the TCP proxy?
**A:** No, your backend uses `DATABASE_URL` automatically.

### Q: Can I use the TCP proxy in my backend?
**A:** No, use `DATABASE_URL` instead. The TCP proxy is for external connections.

### Q: How do I see my database password?
**A:** Railway dashboard → MySQL service → Variables → `MYSQL_PASSWORD`

### Q: Can I change the database name?
**A:** Default is `railway`. You can create additional databases, but `DATABASE_URL` points to `railway`.

### Q: Is the database persistent?
**A:** Yes, data persists across deployments. Railway provides automatic backups.

### Q: How much storage do I get?
**A:** Free tier: 1GB. Paid plans: More storage available.

## Security Notes

- Database is only accessible via Railway's secure proxy
- Not exposed to public internet
- Credentials are automatically generated and secured
- SSL/TLS encryption enabled by default

## Troubleshooting

### Backend can't connect to database

1. **Check DATABASE_URL is set:**
   ```bash
   railway variables
   # Look for DATABASE_URL
   ```

2. **Check MySQL service is running:**
   ```
   Railway dashboard → MySQL service → Status should be "Active"
   ```

3. **Check logs:**
   ```bash
   railway logs
   # Look for connection errors
   ```

### Migrations fail

1. **Check migration logs:**
   ```bash
   railway logs
   # Look for SQL errors
   ```

2. **Manually run migrations:**
   ```bash
   railway run node migrations/run.js
   ```

3. **Check database exists:**
   ```bash
   railway connect mysql
   mysql> SHOW DATABASES;
   ```

## Summary

✅ **Railway automatically configures your database**  
✅ **Your backend connects via DATABASE_URL**  
✅ **Migrations run automatically on deployment**  
✅ **TCP proxy is for external connections only**  
✅ **No manual configuration needed**

**You're all set!** Just deploy and Railway handles the database connection.

---

**Next**: Follow `START_HERE.md` to deploy your backend!

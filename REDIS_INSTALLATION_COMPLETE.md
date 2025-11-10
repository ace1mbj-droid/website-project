# Redis Installation Complete ✅

## Summary

Redis has been successfully installed and configured for your Ace#1 e-commerce project!

## What Was Done

### 1. Redis Installation
- ✅ Installed Redis 8.2.3 via Homebrew
- ✅ Started Redis service
- ✅ Configured to run at system startup
- ✅ Tested connection successfully

### 2. Configuration
- ✅ Redis running on default port 6379
- ✅ No password required (default for local development)
- ✅ Configuration file created

## Redis Details

```
Host:     127.0.0.1 (or localhost)
Port:     6379
Password: (none - default for development)
```

## Redis Service Commands

```bash
# Start Redis
brew services start redis

# Stop Redis
brew services stop redis

# Restart Redis
brew services restart redis

# Check status
brew services list | grep redis

# Check if running
pgrep -x redis-server
```

## Test Redis Connection

```bash
# Simple ping test
redis-cli ping
# Should return: PONG

# Set a value
redis-cli set mykey "Hello Redis"

# Get a value
redis-cli get mykey

# Delete a key
redis-cli del mykey
```

## Redis CLI Commands

Connect to Redis:
```bash
redis-cli
```

Common commands:
```redis
# Set a key
SET key value

# Get a key
GET key

# Delete a key
DEL key

# List all keys
KEYS *

# Check if key exists
EXISTS key

# Set with expiration (seconds)
SETEX key 60 value

# Get time to live
TTL key

# Clear all data
FLUSHALL

# Server information
INFO

# Monitor all commands
MONITOR

# Exit
EXIT
```

## How Ace#1 Uses Redis

### 1. Session Storage
- User sessions stored in Redis
- Fast session lookup
- Automatic expiration

### 2. Rate Limiting
- Track API request counts
- Prevent abuse
- IP-based limiting

### 3. Caching (Future)
- Cache frequently accessed data
- Reduce database load
- Improve performance

## Configuration Files

### Redis Configuration
```
/opt/homebrew/etc/redis.conf
```

### Data Directory
```
/opt/homebrew/var/db/redis/
```

### Log File
```
/opt/homebrew/var/log/redis.log
```

## Backend Integration

Your backend is already configured to use Redis. Check `backend/src/config/redis.js`:

```javascript
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
});
```

## Environment Variables

Redis configuration in `backend/.env`:

```bash
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Verify Installation

### Test with Backend

```bash
cd backend
node -e "const redis = require('redis'); const client = redis.createClient(); client.on('connect', () => { console.log('✅ Redis connected!'); client.quit(); });"
```

### Test with Redis CLI

```bash
# Test connection
redis-cli ping

# Set and get a value
redis-cli set test "Hello"
redis-cli get test
redis-cli del test
```

## Monitoring Redis

### View Redis Info

```bash
redis-cli info
```

### Monitor Commands in Real-Time

```bash
redis-cli monitor
```

### Check Memory Usage

```bash
redis-cli info memory
```

### View Connected Clients

```bash
redis-cli client list
```

## Performance Tips

### 1. Monitor Memory

```bash
redis-cli info memory | grep used_memory_human
```

### 2. Set Max Memory (Optional)

Edit `/opt/homebrew/etc/redis.conf`:
```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### 3. Enable Persistence (Optional)

Redis saves data to disk automatically. Check config:
```bash
redis-cli config get save
```

## Troubleshooting

### Redis Won't Start

```bash
# Check if port 6379 is in use
lsof -i :6379

# Check error logs
tail -f /opt/homebrew/var/log/redis.log

# Restart Redis
brew services restart redis
```

### Connection Refused

```bash
# Check if Redis is running
ps aux | grep redis-server

# Start Redis
brew services start redis

# Test connection
redis-cli ping
```

### Clear All Data

```bash
# WARNING: This deletes everything!
redis-cli FLUSHALL
```

### Reset Redis

```bash
# Stop Redis
brew services stop redis

# Remove data
rm -rf /opt/homebrew/var/db/redis/*

# Start Redis
brew services start redis
```

## Security Recommendations

### For Development
- ✅ No password (current setup)
- ✅ Bind to localhost only
- ✅ Default configuration is fine

### For Production
- ⚠️ Set a strong password
- ⚠️ Enable SSL/TLS
- ⚠️ Use firewall rules
- ⚠️ Limit max connections
- ⚠️ Enable persistence

### Set Password (Production)

Edit `/opt/homebrew/etc/redis.conf`:
```
requirepass your_strong_password_here
```

Then restart:
```bash
brew services restart redis
```

Update `.env`:
```bash
REDIS_PASSWORD=your_strong_password_here
```

## Backup and Restore

### Backup Redis Data

```bash
# Redis automatically saves to dump.rdb
cp /opt/homebrew/var/db/redis/dump.rdb ~/redis-backup-$(date +%Y%m%d).rdb
```

### Restore Redis Data

```bash
# Stop Redis
brew services stop redis

# Copy backup
cp ~/redis-backup-20251110.rdb /opt/homebrew/var/db/redis/dump.rdb

# Start Redis
brew services start redis
```

## Useful Redis Commands

```bash
# Get all keys
redis-cli KEYS "*"

# Get number of keys
redis-cli DBSIZE

# Get server stats
redis-cli INFO stats

# Get memory stats
redis-cli INFO memory

# Get replication info
redis-cli INFO replication

# Benchmark Redis
redis-benchmark -q -n 10000
```

## Redis GUI Tools

### RedisInsight (Recommended)
- Download: https://redis.com/redis-enterprise/redis-insight/
- Free visual tool for Redis
- Monitor, debug, and manage Redis

### Medis (macOS)
- Download: https://getmedis.com/
- Native macOS app
- Simple and clean interface

## Integration Examples

### Session Storage

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 } // 24 hours
}));
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Caching

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache data
async function cacheData(key, data, expiration = 3600) {
  await client.setex(key, expiration, JSON.stringify(data));
}

// Get cached data
async function getCachedData(key) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}
```

## Resources

- **Redis Documentation**: https://redis.io/documentation
- **Redis Commands**: https://redis.io/commands
- **Homebrew Redis**: https://formulae.brew.sh/formula/redis
- **Redis Best Practices**: https://redis.io/topics/best-practices

## Status

✅ **Redis Installation**: Complete
✅ **Service Running**: Yes
✅ **Connection Test**: Successful
✅ **Configuration**: Complete
✅ **System Ready**: Yes

## Quick Reference

```bash
# Service Management
brew services start redis
brew services stop redis
brew services restart redis

# Test Connection
redis-cli ping

# Connect to Redis
redis-cli

# View Logs
tail -f /opt/homebrew/var/log/redis.log

# Check Status
brew services list | grep redis

# Monitor Commands
redis-cli monitor
```

## Next Steps

1. ✅ Redis is installed and running
2. ✅ Test your backend: `cd backend && npm start`
3. ✅ Run system tests: `./test-all.sh`
4. ✅ Redis will automatically be used for sessions and rate limiting

---

**Installation Date**: November 10, 2025
**Redis Version**: 8.2.3
**Status**: ✅ Complete and Running
**Port**: 6379

**Your Redis server is ready to use! 🎉**

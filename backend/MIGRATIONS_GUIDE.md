# Database Migrations Guide

This guide explains how to use the database migration system for the Ace#1 backend.

## Overview

The migration system allows you to:
- Create database tables in a controlled, versioned way
- Track which migrations have been applied
- Rollback changes if needed
- Maintain database schema consistency across environments

## Migration Files

Migrations are located in `backend/migrations/` and follow this naming convention:

```
XXX_description.sql
```

Where:
- `XXX` = Sequential number (001, 002, 003, etc.)
- `description` = Brief description of the migration

### Current Migrations

```
001_create_users.sql              - User accounts and authentication
002_create_products.sql           - Product catalog
003_create_orders.sql             - Orders and order items
004_create_cart_items.sql         - Shopping cart
005_create_sessions.sql           - User sessions
006_create_ratings.sql            - Product ratings and reviews
007_create_wallet_transactions.sql - Wallet transaction history
008_create_audit_logs.sql         - Admin action audit trail
```

## Migration File Format

Each migration file has two sections:

```sql
-- Migration: Title
-- Description: Detailed description

-- UP
-- SQL statements to apply the migration
CREATE TABLE example (...);

-- DOWN
-- SQL statements to rollback the migration
DROP TABLE IF EXISTS example;
```

**Important:**
- `-- UP` section: Creates/modifies database objects
- `-- DOWN` section: Reverses the changes
- Both sections are required

## Running Migrations

### Apply All Pending Migrations

```bash
cd backend
npm run migrate:up
```

This will:
1. Connect to the database
2. Create the `migrations` tracking table (if needed)
3. Check which migrations have been applied
4. Run all pending migrations in order
5. Record each migration in the tracking table

**Output:**
```
🔧 Database Migration Tool

📝 Database: ace1_development
📝 Host: localhost

🔌 Connecting to database...
✅ Connected

✅ Migrations table ready

📦 Found 8 pending migration(s)

⬆️  Running: 001_create_users.sql
✅ Completed: 001_create_users.sql
⬆️  Running: 002_create_products.sql
✅ Completed: 002_create_products.sql
...

🎉 All migrations completed successfully!
```

### Rollback Last Migration

```bash
npm run migrate:down
```

This will:
1. Find the last applied migration
2. Run its `-- DOWN` section
3. Remove it from the tracking table

**Use cases:**
- Fix a migration error
- Undo recent changes
- Test migration rollback

**Warning:** Only rolls back ONE migration at a time. Run multiple times to rollback multiple migrations.

## Migration Tracking

The system creates a `migrations` table to track applied migrations:

```sql
CREATE TABLE migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Check applied migrations:**
```sql
SELECT * FROM migrations ORDER BY id;
```

## Database Schema

After running all migrations, you'll have these tables:

### 1. users
User accounts and authentication data
- Primary key: `id` (VARCHAR 36)
- Unique: `email`
- Indexes: email, role, active status

### 2. products
Product catalog
- Primary key: `id` (VARCHAR 36)
- Indexes: category, active status, price, stock

### 3. orders
Customer orders
- Primary key: `id` (VARCHAR 36)
- Foreign key: `user_id` → users
- Unique: `order_number`
- Indexes: user, order number, status, payment status

### 4. order_items
Order line items
- Primary key: `id` (VARCHAR 36)
- Foreign keys: `order_id` → orders, `product_id` → products
- Indexes: order, product

### 5. cart_items
Shopping cart items
- Primary key: `id` (VARCHAR 36)
- Foreign keys: `user_id` → users, `product_id` → products
- Unique: (user_id, product_id) combination
- Indexes: user, product

### 6. sessions
User session tracking
- Primary key: `id` (VARCHAR 36)
- Foreign key: `user_id` → users
- Indexes: user, token hash, expiration

### 7. ratings
Product ratings and reviews
- Primary key: `id` (VARCHAR 36)
- Foreign keys: `user_id` → users, `product_id` → products
- Unique: (user_id, product_id) combination
- Indexes: product, rating value, verified status

### 8. wallet_transactions
Wallet transaction history
- Primary key: `id` (VARCHAR 36)
- Foreign key: `user_id` → users
- Indexes: user, transaction type, created date, reference

### 9. audit_logs
Admin action audit trail
- Primary key: `id` (VARCHAR 36)
- Foreign key: `user_id` → users (nullable)
- Indexes: user, action, entity, created date

## Creating New Migrations

### 1. Create Migration File

```bash
cd backend/migrations
touch 009_your_migration_name.sql
```

### 2. Write Migration

```sql
-- Migration: Add column to users table
-- Description: Adds phone_verified column to track phone verification

-- UP
ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD INDEX idx_phone_verified (phone_verified);

-- DOWN
ALTER TABLE users DROP INDEX idx_phone_verified;
ALTER TABLE users DROP COLUMN phone_verified;
```

### 3. Test Migration

```bash
# Apply migration
npm run migrate:up

# Verify it worked
mysql -u ace1_user -p ace1_development
DESCRIBE users;

# Test rollback
npm run migrate:down

# Verify rollback worked
DESCRIBE users;

# Re-apply for production
npm run migrate:up
```

## Best Practices

### 1. Always Test Migrations

```bash
# Test on development database first
npm run migrate:up

# Test rollback
npm run migrate:down

# Re-apply
npm run migrate:up
```

### 2. Make Migrations Atomic

Each migration should do ONE thing:
- ✅ Good: `001_create_users.sql`
- ❌ Bad: `001_create_all_tables.sql`

### 3. Never Modify Existing Migrations

Once a migration is applied in production:
- ❌ Don't edit the file
- ✅ Create a new migration to make changes

### 4. Always Include Rollback

Every `-- UP` must have a corresponding `-- DOWN`:
```sql
-- UP
CREATE TABLE example (...);

-- DOWN
DROP TABLE IF EXISTS example;
```

### 5. Use Descriptive Names

```
✅ 009_add_user_phone_verification.sql
❌ 009_update.sql
```

### 6. Test Foreign Key Constraints

Ensure proper order:
```
001_create_users.sql      (no dependencies)
002_create_products.sql   (no dependencies)
003_create_orders.sql     (depends on users, products)
```

### 7. Add Indexes for Performance

```sql
-- Add indexes for frequently queried columns
INDEX idx_email (email),
INDEX idx_created (created_at)
```

## Troubleshooting

### Issue: "Migration failed: Table already exists"

**Problem:** Table was created manually or migration ran partially

**Solution:**
```bash
# Check what exists
mysql -u ace1_user -p ace1_development
SHOW TABLES;

# Drop the table
DROP TABLE table_name;

# Re-run migration
npm run migrate:up
```

### Issue: "Foreign key constraint fails"

**Problem:** Referenced table doesn't exist yet

**Solution:**
- Ensure migrations run in correct order
- Check migration numbers (001, 002, 003...)
- Parent tables must be created before child tables

### Issue: "Migration tracking table not found"

**Problem:** First time running migrations

**Solution:**
- This is normal - the system creates it automatically
- Just run `npm run migrate:up`

### Issue: "Cannot rollback - no migrations applied"

**Problem:** No migrations to rollback

**Solution:**
- Check migrations table: `SELECT * FROM migrations;`
- If empty, nothing to rollback

### Issue: "Syntax error in migration"

**Problem:** Invalid SQL in migration file

**Solution:**
1. Test SQL manually in MySQL
2. Fix syntax error
3. Re-run migration

## Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Test all migrations on staging
npm run migrate:up

# 2. Verify database schema
mysql -u ace1_user -p ace1_development
SHOW TABLES;

# 3. Test application with new schema
npm run dev

# 4. Test rollback (on staging only!)
npm run migrate:down
npm run migrate:up

# 5. Backup production database
mysqldump -u ace1_user -p ace1_production > backup_$(date +%Y%m%d).sql
```

### Deployment Steps

```bash
# 1. Connect to production server
ssh user@production-server

# 2. Navigate to backend
cd /path/to/backend

# 3. Pull latest code
git pull origin main

# 4. Run migrations
npm run migrate:up

# 5. Restart application
pm2 restart ace1-api

# 6. Verify
curl http://localhost:3000/health
```

### Rollback Plan

If something goes wrong:

```bash
# 1. Rollback migration
npm run migrate:down

# 2. Restore from backup (if needed)
mysql -u ace1_user -p ace1_production < backup_20251110.sql

# 3. Restart application
pm2 restart ace1-api
```

## Advanced Usage

### Check Migration Status

```bash
# Connect to database
mysql -u ace1_user -p ace1_development

# View applied migrations
SELECT * FROM migrations ORDER BY id;

# Count migrations
SELECT COUNT(*) FROM migrations;
```

### Manual Migration Tracking

```bash
# Mark migration as applied (without running it)
INSERT INTO migrations (name) VALUES ('009_example.sql');

# Remove migration from tracking (without rolling back)
DELETE FROM migrations WHERE name = '009_example.sql';
```

**Warning:** Only use for emergency recovery!

### Dry Run (Test Without Applying)

```bash
# Read migration file
cat migrations/001_create_users.sql

# Test SQL manually
mysql -u ace1_user -p ace1_development < migrations/001_create_users.sql
```

## Migration Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Create Migration File                                │
│    migrations/009_add_feature.sql                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Write UP and DOWN Sections                          │
│    -- UP: CREATE TABLE ...                             │
│    -- DOWN: DROP TABLE ...                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Test on Development                                  │
│    npm run migrate:up                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Test Rollback                                        │
│    npm run migrate:down                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Re-apply                                             │
│    npm run migrate:up                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Commit to Git                                        │
│    git add migrations/009_add_feature.sql               │
│    git commit -m "Add feature migration"                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Deploy to Production                                 │
│    npm run migrate:up (on production server)            │
└─────────────────────────────────────────────────────────┘
```

## Summary

- ✅ Migrations are versioned and tracked
- ✅ Each migration can be applied and rolled back
- ✅ System prevents duplicate migrations
- ✅ All tables have proper indexes and foreign keys
- ✅ Schema is consistent across environments

**Next Steps:**
1. Run migrations: `npm run migrate:up`
2. Verify tables: `SHOW TABLES;`
3. Start building models and API endpoints

---

**Need Help?**
- Check migration status: `SELECT * FROM migrations;`
- View table structure: `DESCRIBE table_name;`
- Test connection: `npm run db:test`

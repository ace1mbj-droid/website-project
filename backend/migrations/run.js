#!/usr/bin/env node

/**
 * Database Migration Runner
 * 
 * This script runs database migrations up or down.
 * 
 * Usage:
 *   npm run migrate:up    - Run all pending migrations
 *   npm run migrate:down  - Rollback last migration
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const MIGRATIONS_DIR = __dirname;
const MIGRATIONS_TABLE = 'migrations';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'ace1_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ace1_development',
  multipleStatements: true,
};

/**
 * Create migrations tracking table
 */
async function createMigrationsTable(connection) {
  const sql = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_name (name)
    )
  `;
  await connection.query(sql);
  console.log(`✅ Migrations table ready`);
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations(connection) {
  const [rows] = await connection.query(
    `SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY id`
  );
  return rows.map(row => row.name);
}

/**
 * Get list of migration files
 */
function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
  return files;
}

/**
 * Execute migration up
 */
async function executeMigrationUp(connection, filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  // Split by -- UP and -- DOWN markers
  const upSection = sql.split('-- DOWN')[0].split('-- UP')[1];
  
  if (!upSection) {
    throw new Error(`Migration ${filename} missing -- UP section`);
  }
  
  console.log(`⬆️  Running: ${filename}`);
  
  await connection.query(upSection.trim());
  await connection.query(
    `INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES (?)`,
    [filename]
  );
  
  console.log(`✅ Completed: ${filename}`);
}

/**
 * Execute migration down
 */
async function executeMigrationDown(connection, filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  // Split by -- UP and -- DOWN markers
  const downSection = sql.split('-- DOWN')[1];
  
  if (!downSection) {
    throw new Error(`Migration ${filename} missing -- DOWN section`);
  }
  
  console.log(`⬇️  Rolling back: ${filename}`);
  
  await connection.query(downSection.trim());
  await connection.query(
    `DELETE FROM ${MIGRATIONS_TABLE} WHERE name = ?`,
    [filename]
  );
  
  console.log(`✅ Rolled back: ${filename}`);
}

/**
 * Run migrations up
 */
async function migrateUp(connection) {
  const executed = await getExecutedMigrations(connection);
  const files = getMigrationFiles();
  const pending = files.filter(file => !executed.includes(file));
  
  if (pending.length === 0) {
    console.log('✅ No pending migrations');
    return;
  }
  
  console.log(`📦 Found ${pending.length} pending migration(s)\n`);
  
  for (const file of pending) {
    await executeMigrationUp(connection, file);
  }
  
  console.log(`\n🎉 All migrations completed successfully!`);
}

/**
 * Run migrations down
 */
async function migrateDown(connection) {
  const executed = await getExecutedMigrations(connection);
  
  if (executed.length === 0) {
    console.log('✅ No migrations to rollback');
    return;
  }
  
  const lastMigration = executed[executed.length - 1];
  console.log(`📦 Rolling back last migration\n`);
  
  await executeMigrationDown(connection, lastMigration);
  
  console.log(`\n🎉 Rollback completed successfully!`);
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];
  
  if (!command || !['up', 'down'].includes(command)) {
    console.error('Usage: node run.js [up|down]');
    process.exit(1);
  }
  
  console.log('🔧 Database Migration Tool\n');
  console.log(`📝 Database: ${dbConfig.database}`);
  console.log(`📝 Host: ${dbConfig.host}\n`);
  
  let connection;
  
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected\n');
    
    // Create migrations table
    await createMigrationsTable(connection);
    console.log('');
    
    // Run migrations
    if (command === 'up') {
      await migrateUp(connection);
    } else if (command === 'down') {
      await migrateDown(connection);
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Check your database credentials in .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Database does not exist. Run: npm run db:setup');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();

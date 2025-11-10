#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps set up the MySQL database for the Ace#1 backend.
 * It creates the database and user if they don't exist.
 * 
 * Usage:
 *   node scripts/setup-database.js
 * 
 * You will be prompted for MySQL root credentials.
 */

const mysql = require('mysql2/promise');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupDatabase() {
  console.log('🔧 Ace#1 Database Setup\n');
  console.log('This script will create the database and user for your application.\n');

  // Get MySQL root credentials
  const rootUser = await question('MySQL root username (default: root): ') || 'root';
  const rootPassword = await question('MySQL root password: ');
  
  if (!rootPassword) {
    console.error('❌ Root password is required');
    rl.close();
    process.exit(1);
  }

  // Get database configuration from .env
  const dbName = process.env.DB_NAME || 'ace1_development';
  const dbUser = process.env.DB_USER || 'ace1_user';
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST || 'localhost';

  if (!dbPassword) {
    console.error('❌ DB_PASSWORD not set in .env file');
    rl.close();
    process.exit(1);
  }

  console.log(`\n📝 Configuration:`);
  console.log(`   Database: ${dbName}`);
  console.log(`   User: ${dbUser}`);
  console.log(`   Host: ${dbHost}\n`);

  try {
    // Connect to MySQL as root
    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: dbHost,
      user: rootUser,
      password: rootPassword,
    });

    console.log('✅ Connected to MySQL\n');

    // Create database
    console.log(`📦 Creating database '${dbName}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created\n`);

    // Create user
    console.log(`👤 Creating user '${dbUser}'...`);
    await connection.query(
      `CREATE USER IF NOT EXISTS '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`
    );
    console.log(`✅ User '${dbUser}' created\n`);

    // Grant privileges
    console.log(`🔐 Granting privileges...`);
    await connection.query(
      `GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbUser}'@'localhost'`
    );
    await connection.query('FLUSH PRIVILEGES');
    console.log(`✅ Privileges granted\n`);

    // Test connection with new user
    console.log('🧪 Testing connection with new user...');
    const testConnection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });
    await testConnection.query('SELECT 1');
    await testConnection.end();
    console.log('✅ Connection test successful\n');

    await connection.end();

    console.log('🎉 Database setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Run migrations: npm run migrate:up');
    console.log('  2. Start the server: npm run dev\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Check your MySQL root credentials');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL is running');
      console.error('   macOS: brew services start mysql');
      console.error('   Linux: sudo systemctl start mysql');
    }
    
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupDatabase();

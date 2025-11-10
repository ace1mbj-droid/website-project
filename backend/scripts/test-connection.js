#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the database connection using the credentials in .env
 * 
 * Usage:
 *   node scripts/test-connection.js
 */

require('dotenv').config();
const { testConnection, healthCheck, closePool } = require('../src/config/database');

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...\n');
  
  console.log('📝 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  console.log(`   Database: ${process.env.DB_NAME || 'ace1_development'}`);
  console.log(`   User: ${process.env.DB_USER || 'ace1_user'}\n`);

  try {
    // Test connection
    await testConnection();
    
    // Get health status
    const health = await healthCheck();
    console.log('📊 Health Status:', health);
    
    console.log('\n✅ Database connection successful!');
    console.log('🎉 You can now start the server with: npm run dev\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('      macOS: brew services start mysql');
    console.error('      Linux: sudo systemctl start mysql');
    console.error('   2. Check your .env file has correct credentials');
    console.error('   3. Run setup script: node scripts/setup-database.js\n');
    process.exit(1);
  } finally {
    await closePool();
  }
}

testDatabaseConnection();

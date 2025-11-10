#!/usr/bin/env node

/**
 * System Test Script
 * Tests all components of the Ace#1 e-commerce system
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const redis = require('redis');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function section(title) {
  console.log('');
  log(`${'='.repeat(60)}`, 'blue');
  log(`  ${title}`, 'blue');
  log(`${'='.repeat(60)}`, 'blue');
  console.log('');
}

async function testEnvironmentVariables() {
  section('Testing Environment Variables');
  
  const required = [
    'NODE_ENV',
    'PORT',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'REDIS_HOST',
    'ENCRYPTION_KEY',
  ];
  
  let allPresent = true;
  
  for (const key of required) {
    if (process.env[key] && process.env[key] !== `your_${key.toLowerCase()}_here`) {
      success(`${key} is set`);
    } else {
      error(`${key} is missing or not configured`);
      allPresent = false;
    }
  }
  
  // Check key lengths
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warning('JWT_SECRET should be at least 32 characters');
  }
  
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length !== 32) {
    warning('ENCRYPTION_KEY should be exactly 32 characters');
  }
  
  return allPresent;
}

async function testDatabaseConnection() {
  section('Testing Database Connection');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    success('Connected to MySQL database');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    success(`Database query successful (result: ${rows[0].result})`);
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    info(`Found ${tables.length} tables in database`);
    
    const tableNames = tables.map(t => Object.values(t)[0]);
    const expectedTables = [
      'users',
      'products',
      'orders',
      'order_items',
      'cart_items',
      'sessions',
      'ratings',
      'wallet_transactions',
      'audit_logs',
    ];
    
    for (const table of expectedTables) {
      if (tableNames.includes(table)) {
        success(`Table '${table}' exists`);
      } else {
        warning(`Table '${table}' not found - run migrations`);
      }
    }
    
    await connection.end();
    return true;
  } catch (err) {
    error(`Database connection failed: ${err.message}`);
    info('Make sure MySQL is running and credentials are correct');
    return false;
  }
}

async function testRedisConnection() {
  section('Testing Redis Connection');
  
  return new Promise((resolve) => {
    const client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
    
    client.on('error', (err) => {
      error(`Redis connection failed: ${err.message}`);
      info('Redis is optional but recommended for session storage');
      resolve(false);
    });
    
    client.on('ready', async () => {
      success('Connected to Redis');
      
      // Test set/get
      client.set('test_key', 'test_value', (err) => {
        if (err) {
          error(`Redis SET failed: ${err.message}`);
          client.quit();
          resolve(false);
          return;
        }
        
        client.get('test_key', (err, value) => {
          if (err) {
            error(`Redis GET failed: ${err.message}`);
          } else if (value === 'test_value') {
            success('Redis read/write test passed');
          }
          
          client.del('test_key');
          client.quit();
          resolve(true);
        });
      });
    });
  });
}

async function testEncryption() {
  section('Testing Encryption System');
  
  try {
    const { encrypt, decrypt, maskData, isEncrypted } = require('../src/utils/encryption');
    
    // Test encryption/decryption
    const testData = 'sensitive_data_123';
    const encrypted = encrypt(testData);
    
    if (isEncrypted(encrypted)) {
      success('Data encrypted successfully');
    } else {
      error('Encrypted data format invalid');
      return false;
    }
    
    const decrypted = decrypt(encrypted);
    if (decrypted === testData) {
      success('Data decrypted successfully');
    } else {
      error('Decryption failed - data mismatch');
      return false;
    }
    
    // Test masking
    const masked = maskData('1234567890', 4);
    if (masked === '******7890') {
      success('Data masking works correctly');
    } else {
      warning(`Data masking unexpected result: ${masked}`);
    }
    
    return true;
  } catch (err) {
    error(`Encryption test failed: ${err.message}`);
    return false;
  }
}

async function testModels() {
  section('Testing Database Models');
  
  try {
    const models = require('../src/models');
    
    const expectedModels = [
      'User',
      'Product',
      'Order',
      'Cart',
      'Session',
      'Rating',
      'WalletTransaction',
      'AuditLog',
      'BankAccount',
    ];
    
    for (const modelName of expectedModels) {
      if (models[modelName]) {
        success(`Model '${modelName}' loaded`);
      } else {
        warning(`Model '${modelName}' not found`);
      }
    }
    
    return true;
  } catch (err) {
    error(`Model loading failed: ${err.message}`);
    return false;
  }
}

async function testAPIEndpoints() {
  section('Testing API Endpoints');
  
  try {
    const app = require('../src/app');
    const routes = [];
    
    // Extract routes from Express app
    function extractRoutes(stack, prefix = '') {
      stack.forEach((middleware) => {
        if (middleware.route) {
          const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
          routes.push(`${methods} ${prefix}${middleware.route.path}`);
        } else if (middleware.name === 'router' && middleware.handle.stack) {
          const path = middleware.regexp.source
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          extractRoutes(middleware.handle.stack, prefix + path);
        }
      });
    }
    
    extractRoutes(app._router.stack);
    
    info(`Found ${routes.length} API endpoints:`);
    routes.forEach(route => {
      console.log(`  ${route}`);
    });
    
    return true;
  } catch (err) {
    error(`API endpoint test failed: ${err.message}`);
    return false;
  }
}

async function testDependencies() {
  section('Testing Node.js Dependencies');
  
  const requiredPackages = [
    'express',
    'mysql2',
    'redis',
    'bcrypt',
    'jsonwebtoken',
    'joi',
    'express-rate-limit',
    'dotenv',
    'uuid',
  ];
  
  let allInstalled = true;
  
  for (const pkg of requiredPackages) {
    try {
      require(pkg);
      success(`Package '${pkg}' installed`);
    } catch (err) {
      error(`Package '${pkg}' not installed`);
      allInstalled = false;
    }
  }
  
  if (!allInstalled) {
    info('Run: npm install');
  }
  
  return allInstalled;
}

async function generateTestReport(results) {
  section('Test Summary');
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  const failed = total - passed;
  
  console.log('');
  log(`Total Tests: ${total}`, 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  console.log('');
  
  if (failed === 0) {
    success('All tests passed! ✨');
    console.log('');
    info('Your system is ready to use!');
    info('Start the backend: npm start');
    info('Open frontend: open docs/index.html');
  } else {
    warning('Some tests failed. Please fix the issues above.');
    console.log('');
    info('Common fixes:');
    info('1. Run: npm install');
    info('2. Configure .env file');
    info('3. Start MySQL: brew services start mysql');
    info('4. Start Redis: brew services start redis');
    info('5. Run migrations: node migrations/run.js');
  }
  
  console.log('');
}

async function main() {
  console.clear();
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║         Ace#1 E-Commerce System Test Suite                ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  console.log('');
  
  const results = {};
  
  // Run all tests
  results.dependencies = await testDependencies();
  results.environment = await testEnvironmentVariables();
  results.database = await testDatabaseConnection();
  results.redis = await testRedisConnection();
  results.encryption = await testEncryption();
  results.models = await testModels();
  results.endpoints = await testAPIEndpoints();
  
  // Generate report
  await generateTestReport(results);
  
  process.exit(results.dependencies && results.environment && results.database ? 0 : 1);
}

// Run tests
main().catch((err) => {
  console.error('');
  error(`Fatal error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

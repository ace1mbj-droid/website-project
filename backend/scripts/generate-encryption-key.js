#!/usr/bin/env node

/**
 * Generate Encryption Key Script
 * 
 * This script generates a secure 32-character encryption key
 * for use with the encryption utility.
 * 
 * Usage:
 *   node scripts/generate-encryption-key.js
 */

const crypto = require('crypto');

console.log('\n=== Encryption Key Generator ===\n');

// Generate a secure 32-character key
const key = crypto.randomBytes(32).toString('base64').slice(0, 32);

console.log('Generated Encryption Key:');
console.log('------------------------');
console.log(key);
console.log('------------------------\n');

console.log('Add this to your .env file:');
console.log(`ENCRYPTION_KEY=${key}\n`);

console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('1. Keep this key SECRET and SECURE');
console.log('2. Never commit this key to version control');
console.log('3. Use different keys for development and production');
console.log('4. If you lose this key, encrypted data cannot be recovered');
console.log('5. Rotate this key every 90 days for security\n');

console.log('Key Properties:');
console.log(`- Length: ${key.length} characters`);
console.log(`- Entropy: ${crypto.randomBytes(32).length * 8} bits`);
console.log(`- Algorithm: AES-256-GCM\n`);

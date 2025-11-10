#!/usr/bin/env node

/**
 * Encrypt Sensitive Data Script
 * 
 * This script helps encrypt sensitive information like bank details
 * and personal information before storing them.
 * 
 * Usage:
 *   node scripts/encrypt-sensitive-data.js
 */

require('dotenv').config();
const readline = require('readline');
const { encrypt, decrypt, maskData, generateEncryptionKey } = require('../src/utils/encryption');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n=== Sensitive Data Encryption Tool ===\n');
  
  // Check if encryption key is set
  if (!process.env.ENCRYPTION_KEY) {
    console.log('❌ ERROR: ENCRYPTION_KEY not found in environment variables\n');
    console.log('Please set ENCRYPTION_KEY in your .env file.');
    console.log('You can generate one using: node scripts/generate-encryption-key.js\n');
    rl.close();
    return;
  }
  
  console.log('✅ Encryption key loaded\n');
  
  while (true) {
    console.log('Options:');
    console.log('1. Encrypt data');
    console.log('2. Decrypt data');
    console.log('3. Encrypt bank account details');
    console.log('4. Encrypt personal information');
    console.log('5. Exit\n');
    
    const choice = await question('Select an option (1-5): ');
    console.log('');
    
    switch (choice.trim()) {
      case '1':
        await encryptData();
        break;
      case '2':
        await decryptData();
        break;
      case '3':
        await encryptBankDetails();
        break;
      case '4':
        await encryptPersonalInfo();
        break;
      case '5':
        console.log('Goodbye!\n');
        rl.close();
        return;
      default:
        console.log('Invalid option. Please try again.\n');
    }
  }
}

async function encryptData() {
  console.log('--- Encrypt Data ---\n');
  const data = await question('Enter data to encrypt: ');
  
  if (!data) {
    console.log('No data provided.\n');
    return;
  }
  
  try {
    const encrypted = encrypt(data);
    console.log('\n✅ Encrypted successfully!\n');
    console.log('Encrypted data:');
    console.log('------------------------');
    console.log(encrypted);
    console.log('------------------------\n');
    console.log('Store this encrypted value in your database.\n');
  } catch (error) {
    console.log(`\n❌ Encryption failed: ${error.message}\n`);
  }
}

async function decryptData() {
  console.log('--- Decrypt Data ---\n');
  const encrypted = await question('Enter encrypted data: ');
  
  if (!encrypted) {
    console.log('No data provided.\n');
    return;
  }
  
  try {
    const decrypted = decrypt(encrypted);
    console.log('\n✅ Decrypted successfully!\n');
    console.log('Decrypted data:');
    console.log('------------------------');
    console.log(decrypted);
    console.log('------------------------\n');
  } catch (error) {
    console.log(`\n❌ Decryption failed: ${error.message}\n`);
  }
}

async function encryptBankDetails() {
  console.log('--- Encrypt Bank Account Details ---\n');
  
  const accountNumber = await question('Account Number: ');
  const ifscCode = await question('IFSC Code: ');
  const accountHolderName = await question('Account Holder Name: ');
  const bankName = await question('Bank Name: ');
  const branchName = await question('Branch Name (optional): ');
  
  if (!accountNumber || !ifscCode || !accountHolderName) {
    console.log('\n❌ Required fields missing.\n');
    return;
  }
  
  try {
    const bankDetails = {
      accountNumber: encrypt(accountNumber),
      ifscCode: encrypt(ifscCode),
      accountHolderName: encrypt(accountHolderName),
      bankName: bankName ? encrypt(bankName) : null,
      branchName: branchName ? encrypt(branchName) : null,
    };
    
    console.log('\n✅ Bank details encrypted successfully!\n');
    console.log('Encrypted Bank Details (JSON):');
    console.log('------------------------');
    console.log(JSON.stringify(bankDetails, null, 2));
    console.log('------------------------\n');
    
    console.log('Masked Preview:');
    console.log(`Account Number: ${maskData(accountNumber)}`);
    console.log(`IFSC Code: ${ifscCode}`);
    console.log(`Account Holder: ${accountHolderName}\n`);
    
    console.log('💾 Save this JSON to your secure configuration file.\n');
  } catch (error) {
    console.log(`\n❌ Encryption failed: ${error.message}\n`);
  }
}

async function encryptPersonalInfo() {
  console.log('--- Encrypt Personal Information ---\n');
  
  const name = await question('Full Name: ');
  const phone = await question('Phone Number: ');
  const email = await question('Email: ');
  const address = await question('Address: ');
  const panNumber = await question('PAN Number (optional): ');
  const aadharNumber = await question('Aadhar Number (optional): ');
  
  if (!name || !phone) {
    console.log('\n❌ Required fields missing.\n');
    return;
  }
  
  try {
    const personalInfo = {
      name: encrypt(name),
      phone: encrypt(phone),
      email: email ? encrypt(email) : null,
      address: address ? encrypt(address) : null,
      panNumber: panNumber ? encrypt(panNumber) : null,
      aadharNumber: aadharNumber ? encrypt(aadharNumber) : null,
    };
    
    console.log('\n✅ Personal information encrypted successfully!\n');
    console.log('Encrypted Personal Info (JSON):');
    console.log('------------------------');
    console.log(JSON.stringify(personalInfo, null, 2));
    console.log('------------------------\n');
    
    console.log('Masked Preview:');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${maskData(phone)}`);
    if (email) console.log(`Email: ${email}`);
    if (panNumber) console.log(`PAN: ${maskData(panNumber, 4)}`);
    if (aadharNumber) console.log(`Aadhar: ${maskData(aadharNumber, 4)}\n`);
    
    console.log('💾 Save this JSON to your secure configuration file.\n');
  } catch (error) {
    console.log(`\n❌ Encryption failed: ${error.message}\n`);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Error:', error.message, '\n');
  rl.close();
  process.exit(1);
});

// Run the script
main().catch(error => {
  console.error('\n❌ Error:', error.message, '\n');
  rl.close();
  process.exit(1);
});

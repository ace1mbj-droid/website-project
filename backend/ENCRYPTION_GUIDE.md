# Encryption Guide

## Overview

This guide explains how to encrypt and protect sensitive data like bank details, payment information, and personal data in the Ace#1 e-commerce system.

## Security Features

- **Algorithm**: AES-256-GCM (Advanced Encryption Standard with Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **Authentication**: Built-in authentication tag prevents tampering
- **IV**: Random initialization vector for each encryption
- **Format**: `iv:authTag:ciphertext` (all hex-encoded)

## Setup

### 1. Generate Encryption Key

Generate a secure 32-character encryption key:

```bash
cd backend
node scripts/generate-encryption-key.js
```

This will output a secure key like:
```
ENCRYPTION_KEY=Xy9mK2pL8nQ4rT6vW9yB1cD3fG5hJ7k
```

### 2. Add to Environment Variables

Add the generated key to your `.env` file:

```bash
# Security
ENCRYPTION_KEY=Xy9mK2pL8nQ4rT6vW9yB1cD3fG5hJ7k
```

**⚠️ IMPORTANT:**
- Never commit this key to version control
- Use different keys for development and production
- Store production keys in secure secret management systems
- Rotate keys every 90 days

## Usage

### Encrypting Data

#### Interactive Tool

Use the interactive encryption tool:

```bash
node scripts/encrypt-sensitive-data.js
```

This provides options to:
1. Encrypt any data
2. Decrypt data
3. Encrypt bank account details
4. Encrypt personal information

#### Programmatic Usage

```javascript
const { encrypt, decrypt, encryptFields, decryptFields } = require('./src/utils/encryption');

// Encrypt a single value
const accountNumber = '1234567890';
const encrypted = encrypt(accountNumber);
console.log(encrypted);
// Output: a1b2c3d4e5f6...

// Decrypt a value
const decrypted = decrypt(encrypted);
console.log(decrypted);
// Output: 1234567890

// Encrypt multiple fields in an object
const bankDetails = {
  accountNumber: '1234567890',
  ifscCode: 'SBIN0001234',
  accountHolderName: 'John Doe',
  bankName: 'State Bank of India'
};

const encryptedDetails = encryptFields(bankDetails, [
  'accountNumber',
  'ifscCode',
  'accountHolderName'
]);

// Decrypt fields
const decryptedDetails = decryptFields(encryptedDetails, [
  'accountNumber',
  'ifscCode',
  'accountHolderName'
]);
```

## What to Encrypt

### Critical Data (Always Encrypt)

1. **Bank Account Details**
   - Account numbers
   - IFSC codes
   - Account holder names
   - Bank names and branches

2. **Payment Information**
   - Credit/debit card numbers (if stored)
   - CVV codes (never store!)
   - Payment gateway credentials
   - Transaction IDs with sensitive info

3. **Personal Identification**
   - PAN numbers
   - Aadhar numbers
   - Passport numbers
   - Driver's license numbers

4. **Contact Information**
   - Phone numbers (optional)
   - Email addresses (optional)
   - Physical addresses (optional)

### Data NOT to Encrypt

- User IDs (needed for queries)
- Usernames/emails used for login
- Order numbers
- Product information
- Public data
- Hashed passwords (already protected)

## Database Integration

### Storing Encrypted Data

```javascript
// Example: Store encrypted bank details
const { encrypt } = require('../utils/encryption');

async function saveBankDetails(userId, bankDetails) {
  const encrypted = {
    user_id: userId,
    account_number: encrypt(bankDetails.accountNumber),
    ifsc_code: encrypt(bankDetails.ifscCode),
    account_holder: encrypt(bankDetails.accountHolder),
    bank_name: encrypt(bankDetails.bankName)
  };
  
  await db.query(
    'INSERT INTO bank_accounts (user_id, account_number, ifsc_code, account_holder, bank_name) VALUES (?, ?, ?, ?, ?)',
    [encrypted.user_id, encrypted.account_number, encrypted.ifsc_code, encrypted.account_holder, encrypted.bank_name]
  );
}
```

### Retrieving Encrypted Data

```javascript
// Example: Retrieve and decrypt bank details
const { decrypt } = require('../utils/encryption');

async function getBankDetails(userId) {
  const [rows] = await db.query(
    'SELECT * FROM bank_accounts WHERE user_id = ?',
    [userId]
  );
  
  if (rows.length === 0) return null;
  
  const encrypted = rows[0];
  
  return {
    accountNumber: decrypt(encrypted.account_number),
    ifscCode: decrypt(encrypted.ifsc_code),
    accountHolder: decrypt(encrypted.account_holder),
    bankName: decrypt(encrypted.bank_name)
  };
}
```

## Additional Utilities

### Masking Data

Display sensitive data partially masked:

```javascript
const { maskData } = require('./src/utils/encryption');

const accountNumber = '1234567890';
console.log(maskData(accountNumber, 4));
// Output: ******7890

const phone = '9876543210';
console.log(maskData(phone, 4));
// Output: ******3210
```

### Hashing (One-Way)

For data that needs verification but not retrieval:

```javascript
const { hash } = require('./src/utils/encryption');

const panNumber = 'ABCDE1234F';
const hashed = hash(panNumber);
// Store hashed value for verification only
```

### Check if Data is Encrypted

```javascript
const { isEncrypted } = require('./src/utils/encryption');

const data = 'a1b2c3d4:e5f6g7h8:i9j0k1l2';
console.log(isEncrypted(data));
// Output: true
```

## Security Best Practices

### 1. Key Management

- **Development**: Use a test key, never use production keys
- **Production**: Store keys in AWS Secrets Manager, Azure Key Vault, or similar
- **Rotation**: Change encryption keys every 90 days
- **Backup**: Securely backup keys before rotation

### 2. Access Control

- Limit who can decrypt data
- Log all decryption operations
- Use role-based access control
- Audit access regularly

### 3. Data Handling

- Decrypt data only when necessary
- Never log decrypted sensitive data
- Clear decrypted data from memory after use
- Use HTTPS for all data transmission

### 4. Compliance

- Follow PCI DSS for payment data
- Comply with GDPR for personal data
- Follow local data protection laws
- Document encryption practices

## Migration Guide

### Encrypting Existing Data

If you have existing unencrypted data:

```javascript
// Migration script example
const { encrypt } = require('./src/utils/encryption');

async function migrateExistingData() {
  // Get all records with unencrypted data
  const [rows] = await db.query('SELECT id, account_number FROM bank_accounts WHERE account_number NOT LIKE "%:%:%"');
  
  for (const row of rows) {
    // Encrypt the data
    const encrypted = encrypt(row.account_number);
    
    // Update the record
    await db.query(
      'UPDATE bank_accounts SET account_number = ? WHERE id = ?',
      [encrypted, row.id]
    );
  }
  
  console.log(`Migrated ${rows.length} records`);
}
```

## Troubleshooting

### Error: ENCRYPTION_KEY not set

**Solution**: Add ENCRYPTION_KEY to your .env file

```bash
node scripts/generate-encryption-key.js
# Copy the generated key to .env
```

### Error: ENCRYPTION_KEY must be exactly 32 characters

**Solution**: Ensure your key is exactly 32 characters long

```bash
# Generate a new key
node scripts/generate-encryption-key.js
```

### Error: Decryption failed

**Possible causes**:
1. Wrong encryption key
2. Corrupted encrypted data
3. Data not encrypted with this system

**Solution**: Verify you're using the correct encryption key

### Performance Concerns

Encryption/decryption is fast but adds overhead:
- Encrypt: ~0.1-0.5ms per operation
- Decrypt: ~0.1-0.5ms per operation

For bulk operations, consider:
- Batch processing
- Caching decrypted data (carefully!)
- Async operations

## Example: Complete Bank Details Flow

```javascript
const { encrypt, decrypt, maskData } = require('./src/utils/encryption');

// 1. User submits bank details
const userInput = {
  accountNumber: '1234567890',
  ifscCode: 'SBIN0001234',
  accountHolder: 'John Doe'
};

// 2. Encrypt before storing
const encrypted = {
  accountNumber: encrypt(userInput.accountNumber),
  ifscCode: encrypt(userInput.ifscCode),
  accountHolder: encrypt(userInput.accountHolder)
};

// 3. Store in database
await db.query(
  'INSERT INTO bank_accounts (user_id, account_number, ifsc_code, account_holder) VALUES (?, ?, ?, ?)',
  [userId, encrypted.accountNumber, encrypted.ifscCode, encrypted.accountHolder]
);

// 4. Display masked version to user
console.log(`Account: ${maskData(userInput.accountNumber, 4)}`);
// Output: Account: ******7890

// 5. When needed, decrypt for processing
const [rows] = await db.query('SELECT * FROM bank_accounts WHERE user_id = ?', [userId]);
const decrypted = {
  accountNumber: decrypt(rows[0].account_number),
  ifscCode: decrypt(rows[0].ifsc_code),
  accountHolder: decrypt(rows[0].account_holder)
};

// 6. Process payment with decrypted details
await processPayment(decrypted);
```

## Support

For questions or issues:
1. Check this guide
2. Review the code in `src/utils/encryption.js`
3. Test with `scripts/encrypt-sensitive-data.js`
4. Contact the development team

## References

- [AES-GCM Specification](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

const crypto = require('crypto');

/**
 * Encryption Utility
 * Provides AES-256-GCM encryption for sensitive data
 * 
 * Usage:
 * - Encrypt bank details, payment information, personal data
 * - Store encrypted data in database
 * - Decrypt when needed for authorized operations
 */

// Algorithm configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 16 bytes for AES
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag
const SALT_LENGTH = 64; // 64 bytes for key derivation

/**
 * Get encryption key from environment variable
 * @returns {Buffer} Encryption key
 * @private
 */
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  // Ensure key is 32 bytes (256 bits) for AES-256
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
  }
  
  return Buffer.from(key, 'utf8');
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @returns {string} Encrypted data in format: iv:authTag:ciphertext (hex encoded)
 */
function encrypt(plaintext) {
  if (!plaintext) {
    return null;
  }
  
  try {
    const key = getEncryptionKey();
    
    // Generate random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the data
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:ciphertext (all hex encoded)
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt sensitive data using AES-256-GCM
 * @param {string} encryptedData - Encrypted data in format: iv:authTag:ciphertext
 * @returns {string} Decrypted plaintext
 */
function decrypt(encryptedData) {
  if (!encryptedData) {
    return null;
  }
  
  try {
    const key = getEncryptionKey();
    
    // Parse encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const ciphertext = parts[2];
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    
    return plaintext;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Encrypt an object's sensitive fields
 * @param {Object} data - Object containing sensitive data
 * @param {Array<string>} fields - Array of field names to encrypt
 * @returns {Object} Object with encrypted fields
 */
function encryptFields(data, fields) {
  if (!data || !fields || fields.length === 0) {
    return data;
  }
  
  const encrypted = { ...data };
  
  for (const field of fields) {
    if (encrypted[field]) {
      encrypted[field] = encrypt(encrypted[field]);
    }
  }
  
  return encrypted;
}

/**
 * Decrypt an object's encrypted fields
 * @param {Object} data - Object containing encrypted data
 * @param {Array<string>} fields - Array of field names to decrypt
 * @returns {Object} Object with decrypted fields
 */
function decryptFields(data, fields) {
  if (!data || !fields || fields.length === 0) {
    return data;
  }
  
  const decrypted = { ...data };
  
  for (const field of fields) {
    if (decrypted[field]) {
      try {
        decrypted[field] = decrypt(decrypted[field]);
      } catch (error) {
        // If decryption fails, field might not be encrypted
        // Leave it as is and log warning
        console.warn(`Failed to decrypt field '${field}': ${error.message}`);
      }
    }
  }
  
  return decrypted;
}

/**
 * Hash sensitive data (one-way, for comparison only)
 * Useful for storing data that needs to be verified but not retrieved
 * @param {string} data - Data to hash
 * @returns {string} SHA-256 hash (hex encoded)
 */
function hash(data) {
  if (!data) {
    return null;
  }
  
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random token
 * @param {number} length - Length of token in bytes (default: 32)
 * @returns {string} Random token (hex encoded)
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure encryption key
 * Use this to generate a new ENCRYPTION_KEY for .env file
 * @returns {string} 32-character encryption key
 */
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('base64').slice(0, 32);
}

/**
 * Mask sensitive data for display (e.g., credit card numbers)
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of characters to show at end (default: 4)
 * @returns {string} Masked data
 */
function maskData(data, visibleChars = 4) {
  if (!data || data.length <= visibleChars) {
    return data;
  }
  
  const masked = '*'.repeat(data.length - visibleChars);
  const visible = data.slice(-visibleChars);
  
  return masked + visible;
}

/**
 * Validate if data is encrypted (basic check)
 * @param {string} data - Data to check
 * @returns {boolean} True if data appears to be encrypted
 */
function isEncrypted(data) {
  if (!data || typeof data !== 'string') {
    return false;
  }
  
  // Check if data matches our encryption format: iv:authTag:ciphertext
  const parts = data.split(':');
  return parts.length === 3 && 
         parts[0].length === IV_LENGTH * 2 && // IV in hex
         parts[1].length === AUTH_TAG_LENGTH * 2; // Auth tag in hex
}

module.exports = {
  encrypt,
  decrypt,
  encryptFields,
  decryptFields,
  hash,
  generateToken,
  generateEncryptionKey,
  maskData,
  isEncrypted,
};

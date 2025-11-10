/**
 * Ace#1 - Client-Side Encryption Utilities
 * Uses Web Crypto API for secure data encryption
 */

class CryptoUtils {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }

  /**
   * Generate a cryptographic key from password
   * @param {string} password - Password to derive key from
   * @returns {Promise<CryptoKey>}
   */
  async deriveKey(password) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode('ace1-salt-2025'), // In production, use random salt
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data
   * @param {string} data - Data to encrypt
   * @param {string} password - Password for encryption
   * @returns {Promise<string>} Base64 encoded encrypted data
   */
  async encrypt(data, password) {
    try {
      const key = await this.deriveKey(password);
      const enc = new TextEncoder();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        enc.encode(data)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedData), iv.length);

      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data
   * @param {string} encryptedData - Base64 encoded encrypted data
   * @param {string} password - Password for decryption
   * @returns {Promise<string>} Decrypted data
   */
  async decrypt(encryptedData, password) {
    try {
      const key = await this.deriveKey(password);
      
      // Decode base64
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        data
      );

      const dec = new TextDecoder();
      return dec.decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash password (one-way)
   * @param {string} password - Password to hash
   * @returns {Promise<string>} Hex string of hash
   */
  async hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate random key for encryption
   * @returns {string} Random key
   */
  generateRandomKey() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Create global instance
window.cryptoUtils = new CryptoUtils();

/**
 * Secure Storage wrapper for localStorage with encryption
 */
class SecureStorage {
  constructor(encryptionKey) {
    this.encryptionKey = encryptionKey || 'default-key-change-in-production';
    this.crypto = window.cryptoUtils;
  }

  /**
   * Set encrypted item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  async setItem(key, value) {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = await this.crypto.encrypt(jsonString, this.encryptionKey);
      localStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error('SecureStorage setItem failed:', error);
      return false;
    }
  }

  /**
   * Get decrypted item from localStorage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  async getItem(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = await this.crypto.decrypt(encrypted, this.encryptionKey);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('SecureStorage getItem failed:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Clear all items
   */
  clear() {
    localStorage.clear();
  }
}

// Create global secure storage instance
window.secureStorage = new SecureStorage();

console.log('✅ Crypto utilities loaded');

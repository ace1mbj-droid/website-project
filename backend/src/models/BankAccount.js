const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { encrypt, decrypt, maskData } = require('../utils/encryption');

/**
 * BankAccount Model
 * Handles encrypted bank account information
 * 
 * All sensitive fields are encrypted before storage
 */
class BankAccount {
  /**
   * Create a new bank account record
   * @param {Object} accountData - Bank account data
   * @returns {Promise<Object>} Created bank account (with masked data)
   */
  static async create(accountData) {
    const {
      userId,
      accountNumber,
      ifscCode,
      accountHolderName,
      bankName,
      branchName = null,
    } = accountData;

    const id = uuidv4();

    // Encrypt sensitive fields
    const sql = `
      INSERT INTO bank_accounts 
      (id, user_id, account_number, ifsc_code, account_holder_name, bank_name, branch_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      userId,
      encrypt(accountNumber),
      encrypt(ifscCode),
      encrypt(accountHolderName),
      bankName ? encrypt(bankName) : null,
      branchName ? encrypt(branchName) : null,
    ]);

    return this.findById(id, false); // Return masked version
  }

  /**
   * Find bank account by ID
   * @param {string} id - Bank account ID
   * @param {boolean} decrypt - Whether to decrypt sensitive fields (default: false)
   * @returns {Promise<Object|null>} Bank account object or null
   */
  static async findById(id, decryptData = false) {
    const sql = 'SELECT * FROM bank_accounts WHERE id = ?';
    const results = await query(sql, [id]);

    if (results.length === 0) return null;

    return this._formatAccount(results[0], decryptData);
  }

  /**
   * Find bank accounts by user ID
   * @param {string} userId - User ID
   * @param {boolean} decrypt - Whether to decrypt sensitive fields (default: false)
   * @returns {Promise<Array>} Array of bank accounts
   */
  static async findByUserId(userId, decryptData = false) {
    const sql = 'SELECT * FROM bank_accounts WHERE user_id = ?';
    const results = await query(sql, [userId]);

    return results.map(account => this._formatAccount(account, decryptData));
  }

  /**
   * Update bank account
   * @param {string} id - Bank account ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated bank account
   */
  static async update(id, updates) {
    const allowedFields = ['accountNumber', 'ifscCode', 'accountHolderName', 'bankName', 'branchName'];
    const updateFields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbField} = ?`);
        // Encrypt the value before updating
        values.push(value ? encrypt(value) : null);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const sql = `UPDATE bank_accounts SET ${updateFields.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return this.findById(id, false);
  }

  /**
   * Delete bank account
   * @param {string} id - Bank account ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const sql = 'DELETE FROM bank_accounts WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Verify user owns the bank account
   * @param {string} id - Bank account ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user owns the account
   */
  static async verifyOwnership(id, userId) {
    const sql = 'SELECT user_id FROM bank_accounts WHERE id = ?';
    const results = await query(sql, [id]);

    if (results.length === 0) return false;
    return results[0].user_id === userId;
  }

  /**
   * Get decrypted account for payment processing
   * Use this only when absolutely necessary for payment operations
   * @param {string} id - Bank account ID
   * @param {string} userId - User ID (for verification)
   * @returns {Promise<Object|null>} Decrypted bank account
   */
  static async getForPayment(id, userId) {
    // Verify ownership first
    const isOwner = await this.verifyOwnership(id, userId);
    if (!isOwner) {
      throw new Error('Unauthorized access to bank account');
    }

    // Return decrypted data
    return this.findById(id, true);
  }

  /**
   * Format bank account object
   * @param {Object} account - Raw account data from database
   * @param {boolean} decrypt - Whether to decrypt sensitive fields
   * @returns {Object} Formatted account object
   * @private
   */
  static _formatAccount(account, decryptData = false) {
    if (decryptData) {
      // Return fully decrypted data (use with caution!)
      return {
        id: account.id,
        userId: account.user_id,
        accountNumber: decrypt(account.account_number),
        ifscCode: decrypt(account.ifsc_code),
        accountHolderName: decrypt(account.account_holder_name),
        bankName: account.bank_name ? decrypt(account.bank_name) : null,
        branchName: account.branch_name ? decrypt(account.branch_name) : null,
        isVerified: account.is_verified,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
      };
    } else {
      // Return masked data for display
      const accountNumber = decrypt(account.account_number);
      const ifscCode = decrypt(account.ifsc_code);
      const accountHolderName = decrypt(account.account_holder_name);

      return {
        id: account.id,
        userId: account.user_id,
        accountNumber: maskData(accountNumber, 4), // Show last 4 digits
        ifscCode: ifscCode, // IFSC is not too sensitive
        accountHolderName: accountHolderName, // Name is okay to show
        bankName: account.bank_name ? decrypt(account.bank_name) : null,
        branchName: account.branch_name ? decrypt(account.branch_name) : null,
        isVerified: account.is_verified,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
      };
    }
  }
}

module.exports = BankAccount;

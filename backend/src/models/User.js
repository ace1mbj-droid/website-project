const { query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * User Model
 * Handles all user-related database operations
 */
class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user (without password)
   */
  static async create(userData) {
    const { email, password, firstName, lastName, phone, role = 'customer' } = userData;
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const id = uuidv4();
    const sql = `
      INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [id, email, passwordHash, firstName, lastName, phone, role]);
    
    return this.findById(id);
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    
    if (results.length === 0) return null;
    
    return this._formatUser(results[0]);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    
    if (results.length === 0) return null;
    
    return this._formatUser(results[0]);
  }

  /**
   * Find user by email (including password hash for authentication)
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object with password_hash or null
   */
  static async findByEmailWithPassword(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    
    if (results.length === 0) return null;
    
    return results[0]; // Return raw data including password_hash
  }

  /**
   * Verify user password
   * @param {string} password - Plain text password
   * @param {string} passwordHash - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   */
  static async update(id, updates) {
    const allowedFields = ['first_name', 'last_name', 'phone', 'email_verified', 'is_active'];
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (allowedFields.includes(snakeKey)) {
        fields.push(`${snakeKey} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    
    return this.findById(id);
  }

  /**
   * Update user password
   * @param {string} id - User ID
   * @param {string} newPassword - New plain text password
   * @returns {Promise<void>}
   */
  static async updatePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
    
    await query(sql, [passwordHash, id]);
  }

  /**
   * Update last login timestamp
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  static async updateLastLogin(id) {
    const sql = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Update wallet balance
   * @param {string} id - User ID
   * @param {number} amount - Amount to add (positive) or subtract (negative)
   * @returns {Promise<Object>} Updated user
   */
  static async updateWalletBalance(id, amount) {
    return transaction(async (connection) => {
      // Get current balance
      const [users] = await connection.execute(
        'SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE',
        [id]
      );
      
      if (users.length === 0) {
        throw new Error('User not found');
      }
      
      const currentBalance = parseFloat(users[0].wallet_balance);
      const newBalance = currentBalance + amount;
      
      if (newBalance < 0) {
        throw new Error('Insufficient wallet balance');
      }
      
      // Update balance
      await connection.execute(
        'UPDATE users SET wallet_balance = ? WHERE id = ?',
        [newBalance, id]
      );
      
      return { balance: newBalance };
    });
  }

  /**
   * Get all users (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  static async findAll(options = {}) {
    const { limit = 50, offset = 0, role, isActive } = options;
    
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }
    
    if (isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(isActive);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const results = await query(sql, params);
    
    return results.map(user => this._formatUser(user));
  }

  /**
   * Count users
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} User count
   */
  static async count(filters = {}) {
    const { role, isActive } = filters;
    
    let sql = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }
    
    if (isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(isActive);
    }
    
    const results = await query(sql, params);
    return results[0].count;
  }

  /**
   * Delete user (soft delete by setting is_active = false)
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Hard delete user (permanent)
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  static async hardDelete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Format user object (remove sensitive data)
   * @param {Object} user - Raw user data from database
   * @returns {Object} Formatted user object
   * @private
   */
  static _formatUser(user) {
    const { password_hash, ...userData } = user;
    
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      role: userData.role,
      walletBalance: parseFloat(userData.wallet_balance),
      emailVerified: Boolean(userData.email_verified),
      isActive: Boolean(userData.is_active),
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
      lastLogin: userData.last_login,
    };
  }
}

module.exports = User;

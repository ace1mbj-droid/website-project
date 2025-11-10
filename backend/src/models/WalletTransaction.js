const { query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * WalletTransaction Model
 * Handles wallet transaction operations
 */
class WalletTransaction {
  /**
   * Create a new wallet transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  static async create(transactionData) {
    const { userId, transactionType, amount, description, referenceId } = transactionData;

    // Validate transaction type
    if (!['credit', 'debit'].includes(transactionType)) {
      throw new Error('Invalid transaction type');
    }

    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    return transaction(async (connection) => {
      // Get current balance with lock
      const [users] = await connection.execute(
        'SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const currentBalance = parseFloat(users[0].wallet_balance);
      let newBalance;

      if (transactionType === 'credit') {
        newBalance = currentBalance + amount;
      } else {
        newBalance = currentBalance - amount;
        if (newBalance < 0) {
          throw new Error('Insufficient wallet balance');
        }
      }

      // Update user balance
      await connection.execute(
        'UPDATE users SET wallet_balance = ? WHERE id = ?',
        [newBalance, userId]
      );

      // Create transaction record
      const id = uuidv4();
      const sql = `
        INSERT INTO wallet_transactions 
        (id, user_id, transaction_type, amount, description, balance_after, reference_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(sql, [
        id,
        userId,
        transactionType,
        amount,
        description,
        newBalance,
        referenceId,
      ]);

      return this.findById(id);
    });
  }

  /**
   * Find transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object|null>} Transaction object or null
   */
  static async findById(id) {
    const sql = 'SELECT * FROM wallet_transactions WHERE id = ?';
    const results = await query(sql, [id]);

    if (results.length === 0) return null;

    return this._formatTransaction(results[0]);
  }

  /**
   * Find transactions by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of transactions
   */
  static async findByUserId(userId, options = {}) {
    const { limit = 50, offset = 0, transactionType } = options;

    let sql = 'SELECT * FROM wallet_transactions WHERE user_id = ?';
    const params = [userId];

    if (transactionType) {
      sql += ' AND transaction_type = ?';
      params.push(transactionType);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const results = await query(sql, params);

    return results.map(tx => this._formatTransaction(tx));
  }

  /**
   * Find transaction by reference ID
   * @param {string} referenceId - Reference ID (e.g., order ID)
   * @returns {Promise<Object|null>} Transaction object or null
   */
  static async findByReferenceId(referenceId) {
    const sql = 'SELECT * FROM wallet_transactions WHERE reference_id = ?';
    const results = await query(sql, [referenceId]);

    if (results.length === 0) return null;

    return this._formatTransaction(results[0]);
  }

  /**
   * Get wallet balance for user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Current wallet balance
   */
  static async getBalance(userId) {
    const sql = 'SELECT wallet_balance FROM users WHERE id = ?';
    const results = await query(sql, [userId]);

    if (results.length === 0) {
      throw new Error('User not found');
    }

    return parseFloat(results[0].wallet_balance);
  }

  /**
   * Get transaction statistics for user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Transaction statistics
   */
  static async getStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) as total_credits,
        SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) as total_debits,
        COUNT(CASE WHEN transaction_type = 'credit' THEN 1 END) as credit_count,
        COUNT(CASE WHEN transaction_type = 'debit' THEN 1 END) as debit_count
      FROM wallet_transactions
      WHERE user_id = ?
    `;

    const results = await query(sql, [userId]);

    return {
      totalTransactions: results[0].total_transactions,
      totalCredits: parseFloat(results[0].total_credits || 0),
      totalDebits: parseFloat(results[0].total_debits || 0),
      creditCount: results[0].credit_count,
      debitCount: results[0].debit_count,
    };
  }

  /**
   * Count transactions
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Transaction count
   */
  static async count(filters = {}) {
    const { userId, transactionType } = filters;

    let sql = 'SELECT COUNT(*) as count FROM wallet_transactions WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (transactionType) {
      sql += ' AND transaction_type = ?';
      params.push(transactionType);
    }

    const results = await query(sql, params);
    return results[0].count;
  }

  /**
   * Credit wallet (add money)
   * @param {string} userId - User ID
   * @param {number} amount - Amount to credit
   * @param {string} description - Transaction description
   * @param {string} referenceId - Reference ID (optional)
   * @returns {Promise<Object>} Created transaction
   */
  static async credit(userId, amount, description, referenceId = null) {
    return this.create({
      userId,
      transactionType: 'credit',
      amount,
      description,
      referenceId,
    });
  }

  /**
   * Debit wallet (subtract money)
   * @param {string} userId - User ID
   * @param {number} amount - Amount to debit
   * @param {string} description - Transaction description
   * @param {string} referenceId - Reference ID (optional)
   * @returns {Promise<Object>} Created transaction
   */
  static async debit(userId, amount, description, referenceId = null) {
    return this.create({
      userId,
      transactionType: 'debit',
      amount,
      description,
      referenceId,
    });
  }

  /**
   * Refund transaction (reverse a debit)
   * @param {string} originalTransactionId - Original transaction ID to refund
   * @returns {Promise<Object>} Refund transaction
   */
  static async refund(originalTransactionId) {
    const originalTx = await this.findById(originalTransactionId);

    if (!originalTx) {
      throw new Error('Original transaction not found');
    }

    if (originalTx.transactionType !== 'debit') {
      throw new Error('Can only refund debit transactions');
    }

    return this.credit(
      originalTx.userId,
      originalTx.amount,
      `Refund: ${originalTx.description}`,
      originalTx.referenceId
    );
  }

  /**
   * Format transaction object
   * @param {Object} transaction - Raw transaction data
   * @returns {Object} Formatted transaction object
   * @private
   */
  static _formatTransaction(transaction) {
    return {
      id: transaction.id,
      userId: transaction.user_id,
      transactionType: transaction.transaction_type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      balanceAfter: parseFloat(transaction.balance_after),
      referenceId: transaction.reference_id,
      createdAt: transaction.created_at,
    };
  }
}

module.exports = WalletTransaction;

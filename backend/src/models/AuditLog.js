const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * AuditLog Model
 * Handles audit logging for admin actions and system events
 */
class AuditLog {
  /**
   * Create a new audit log entry
   * @param {Object} logData - Log data
   * @returns {Promise<Object>} Created log entry
   */
  static async create(logData) {
    const {
      userId = null,
      action,
      entityType = null,
      entityId = null,
      ipAddress = null,
      userAgent = null,
      details = null,
    } = logData;

    const id = uuidv4();
    const detailsJson = details ? JSON.stringify(details) : null;

    const sql = `
      INSERT INTO audit_logs 
      (id, user_id, action, entity_type, entity_id, ip_address, user_agent, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      userId,
      action,
      entityType,
      entityId,
      ipAddress,
      userAgent,
      detailsJson,
    ]);

    return this.findById(id);
  }

  /**
   * Find log entry by ID
   * @param {string} id - Log ID
   * @returns {Promise<Object|null>} Log entry or null
   */
  static async findById(id) {
    const sql = `
      SELECT a.*, u.email as user_email, u.first_name, u.last_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `;
    const results = await query(sql, [id]);

    if (results.length === 0) return null;

    return this._formatLog(results[0]);
  }

  /**
   * Find logs by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of log entries
   */
  static async findByUserId(userId, options = {}) {
    const { limit = 100, offset = 0, action } = options;

    let sql = `
      SELECT a.*, u.email as user_email, u.first_name, u.last_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ?
    `;
    const params = [userId];

    if (action) {
      sql += ' AND a.action = ?';
      params.push(action);
    }

    sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const results = await query(sql, params);

    return results.map(log => this._formatLog(log));
  }

  /**
   * Find logs by entity
   * @param {string} entityType - Entity type (e.g., 'product', 'order')
   * @param {string} entityId - Entity ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of log entries
   */
  static async findByEntity(entityType, entityId, options = {}) {
    const { limit = 100, offset = 0 } = options;

    const sql = `
      SELECT a.*, u.email as user_email, u.first_name, u.last_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.entity_type = ? AND a.entity_id = ?
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const results = await query(sql, [entityType, entityId, limit, offset]);

    return results.map(log => this._formatLog(log));
  }

  /**
   * Find all logs
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of log entries
   */
  static async findAll(options = {}) {
    const { limit = 100, offset = 0, action, entityType, userId } = options;

    let sql = `
      SELECT a.*, u.email as user_email, u.first_name, u.last_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      sql += ' AND a.user_id = ?';
      params.push(userId);
    }

    if (action) {
      sql += ' AND a.action = ?';
      params.push(action);
    }

    if (entityType) {
      sql += ' AND a.entity_type = ?';
      params.push(entityType);
    }

    sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const results = await query(sql, params);

    return results.map(log => this._formatLog(log));
  }

  /**
   * Search logs
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of log entries
   */
  static async search(searchTerm, options = {}) {
    const { limit = 100, offset = 0 } = options;

    const sql = `
      SELECT a.*, u.email as user_email, u.first_name, u.last_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.action LIKE ? 
         OR a.entity_type LIKE ?
         OR a.entity_id LIKE ?
         OR u.email LIKE ?
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const searchPattern = `%${searchTerm}%`;
    const results = await query(sql, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      limit,
      offset,
    ]);

    return results.map(log => this._formatLog(log));
  }

  /**
   * Count logs
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Log count
   */
  static async count(filters = {}) {
    const { userId, action, entityType } = filters;

    let sql = 'SELECT COUNT(*) as count FROM audit_logs WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (action) {
      sql += ' AND action = ?';
      params.push(action);
    }

    if (entityType) {
      sql += ' AND entity_type = ?';
      params.push(entityType);
    }

    const results = await query(sql, params);
    return results[0].count;
  }

  /**
   * Get action statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Action statistics
   */
  static async getActionStats(filters = {}) {
    const { userId, startDate, endDate } = filters;

    let sql = `
      SELECT 
        action,
        COUNT(*) as count
      FROM audit_logs
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (startDate) {
      sql += ' AND created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND created_at <= ?';
      params.push(endDate);
    }

    sql += ' GROUP BY action ORDER BY count DESC';

    const results = await query(sql, params);

    return results.map(row => ({
      action: row.action,
      count: row.count,
    }));
  }

  /**
   * Delete old logs (cleanup)
   * @param {number} daysToKeep - Number of days to keep logs
   * @returns {Promise<number>} Number of deleted logs
   */
  static async deleteOld(daysToKeep = 90) {
    const sql = 'DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)';
    const result = await query(sql, [daysToKeep]);
    return result.affectedRows;
  }

  /**
   * Log admin action (convenience method)
   * @param {string} userId - Admin user ID
   * @param {string} action - Action performed
   * @param {string} entityType - Entity type
   * @param {string} entityId - Entity ID
   * @param {Object} details - Additional details
   * @param {Object} req - Express request object (for IP and user agent)
   * @returns {Promise<Object>} Created log entry
   */
  static async logAdminAction(userId, action, entityType, entityId, details, req = null) {
    return this.create({
      userId,
      action,
      entityType,
      entityId,
      ipAddress: req ? req.ip : null,
      userAgent: req ? req.get('user-agent') : null,
      details,
    });
  }

  /**
   * Format log object
   * @param {Object} log - Raw log data
   * @returns {Object} Formatted log object
   * @private
   */
  static _formatLog(log) {
    return {
      id: log.id,
      userId: log.user_id,
      userEmail: log.user_email,
      userName: log.first_name && log.last_name
        ? `${log.first_name} ${log.last_name}`
        : null,
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      details: log.details ? JSON.parse(log.details) : null,
      createdAt: log.created_at,
    };
  }
}

module.exports = AuditLog;

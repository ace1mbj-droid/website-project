const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Session Model
 * Handles user session management
 */
class Session {
  /**
   * Create a new session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  static async create(sessionData) {
    const { userId, token, ipAddress, userAgent, expiresIn = 86400 } = sessionData;

    // Hash the token for storage
    const tokenHash = this._hashToken(token);

    const id = uuidv4();
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const sql = `
      INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [id, userId, tokenHash, ipAddress, userAgent, expiresAt]);

    return {
      id,
      userId,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt,
    };
  }

  /**
   * Find session by token
   * @param {string} token - Session token
   * @returns {Promise<Object|null>} Session object or null
   */
  static async findByToken(token) {
    const tokenHash = this._hashToken(token);
    const sql = 'SELECT * FROM sessions WHERE token_hash = ? AND expires_at > NOW()';
    const results = await query(sql, [tokenHash]);

    if (results.length === 0) return null;

    return this._formatSession(results[0]);
  }

  /**
   * Find session by ID
   * @param {string} id - Session ID
   * @returns {Promise<Object|null>} Session object or null
   */
  static async findById(id) {
    const sql = 'SELECT * FROM sessions WHERE id = ?';
    const results = await query(sql, [id]);

    if (results.length === 0) return null;

    return this._formatSession(results[0]);
  }

  /**
   * Find all sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of sessions
   */
  static async findByUserId(userId) {
    const sql = 'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC';
    const results = await query(sql, [userId]);

    return results.map(session => this._formatSession(session));
  }

  /**
   * Update session expiration
   * @param {string} id - Session ID
   * @param {number} expiresIn - Seconds until expiration
   * @returns {Promise<Object>} Updated session
   */
  static async updateExpiration(id, expiresIn = 86400) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const sql = 'UPDATE sessions SET expires_at = ? WHERE id = ?';

    await query(sql, [expiresAt, id]);

    return this.findById(id);
  }

  /**
   * Delete session (logout)
   * @param {string} id - Session ID
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = 'DELETE FROM sessions WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Delete session by token
   * @param {string} token - Session token
   * @returns {Promise<void>}
   */
  static async deleteByToken(token) {
    const tokenHash = this._hashToken(token);
    const sql = 'DELETE FROM sessions WHERE token_hash = ?';
    await query(sql, [tokenHash]);
  }

  /**
   * Delete all sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async deleteByUserId(userId) {
    const sql = 'DELETE FROM sessions WHERE user_id = ?';
    await query(sql, [userId]);
  }

  /**
   * Delete expired sessions (cleanup)
   * @returns {Promise<number>} Number of deleted sessions
   */
  static async deleteExpired() {
    const sql = 'DELETE FROM sessions WHERE expires_at < NOW()';
    const result = await query(sql);
    return result.affectedRows;
  }

  /**
   * Check if session is valid
   * @param {string} token - Session token
   * @returns {Promise<boolean>} True if session is valid
   */
  static async isValid(token) {
    const session = await this.findByToken(token);
    return session !== null;
  }

  /**
   * Count active sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Number of active sessions
   */
  static async countByUserId(userId) {
    const sql = 'SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND expires_at > NOW()';
    const results = await query(sql, [userId]);
    return results[0].count;
  }

  /**
   * Limit concurrent sessions per user
   * @param {string} userId - User ID
   * @param {number} maxSessions - Maximum allowed sessions
   * @returns {Promise<void>}
   */
  static async limitSessions(userId, maxSessions = 3) {
    const sql = `
      DELETE FROM sessions 
      WHERE user_id = ? 
      AND id NOT IN (
        SELECT id FROM (
          SELECT id FROM sessions 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT ?
        ) as recent_sessions
      )
    `;
    await query(sql, [userId, userId, maxSessions]);
  }

  /**
   * Hash token for secure storage
   * @param {string} token - Token to hash
   * @returns {string} Hashed token
   * @private
   */
  static _hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Format session object
   * @param {Object} session - Raw session data
   * @returns {Object} Formatted session object
   * @private
   */
  static _formatSession(session) {
    return {
      id: session.id,
      userId: session.user_id,
      tokenHash: session.token_hash,
      ipAddress: session.ip_address,
      userAgent: session.user_agent,
      expiresAt: session.expires_at,
      createdAt: session.created_at,
      isExpired: new Date(session.expires_at) < new Date(),
    };
  }
}

module.exports = Session;

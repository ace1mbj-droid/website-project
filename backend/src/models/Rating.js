const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Rating Model
 * Handles product ratings and reviews
 */
class Rating {
  /**
   * Create or update a rating
   * @param {Object} ratingData - Rating data
   * @returns {Promise<Object>} Created/updated rating
   */
  static async createOrUpdate(ratingData) {
    const { userId, productId, rating, reviewText } = ratingData;

    // Validate rating value
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if rating already exists
    const existing = await this.findByUserAndProduct(userId, productId);

    if (existing) {
      // Update existing rating
      return this.update(existing.id, { rating, reviewText });
    }

    // Create new rating
    const id = uuidv4();
    const sql = `
      INSERT INTO ratings (id, user_id, product_id, rating, review_text)
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [id, userId, productId, rating, reviewText]);

    return this.findById(id);
  }

  /**
   * Find rating by ID
   * @param {string} id - Rating ID
   * @returns {Promise<Object|null>} Rating object or null
   */
  static async findById(id) {
    const sql = `
      SELECT r.*, u.first_name, u.last_name, u.email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `;
    const results = await query(sql, [id]);

    if (results.length === 0) return null;

    return this._formatRating(results[0]);
  }

  /**
   * Find rating by user and product
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>} Rating object or null
   */
  static async findByUserAndProduct(userId, productId) {
    const sql = `
      SELECT r.*, u.first_name, u.last_name, u.email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.user_id = ? AND r.product_id = ?
    `;
    const results = await query(sql, [userId, productId]);

    if (results.length === 0) return null;

    return this._formatRating(results[0]);
  }

  /**
   * Find all ratings for a product
   * @param {string} productId - Product ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of ratings
   */
  static async findByProductId(productId, options = {}) {
    const { limit = 50, offset = 0, minRating, verified } = options;

    let sql = `
      SELECT r.*, u.first_name, u.last_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
    `;
    const params = [productId];

    if (minRating) {
      sql += ' AND r.rating >= ?';
      params.push(minRating);
    }

    if (verified !== undefined) {
      sql += ' AND r.is_verified = ?';
      params.push(verified);
    }

    sql += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const results = await query(sql, params);

    return results.map(rating => this._formatRating(rating));
  }

  /**
   * Find all ratings by a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of ratings
   */
  static async findByUserId(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const sql = `
      SELECT r.*, p.name as product_name, p.image_url
      FROM ratings r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const results = await query(sql, [userId, limit, offset]);

    return results.map(rating => ({
      ...this._formatRating(rating),
      productName: rating.product_name,
      productImageUrl: rating.image_url,
    }));
  }

  /**
   * Update rating
   * @param {string} id - Rating ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated rating
   */
  static async update(id, updates) {
    const allowedFields = ['rating', 'review_text', 'is_verified'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (allowedFields.includes(snakeKey)) {
        if (snakeKey === 'rating' && (updates[key] < 1 || updates[key] > 5)) {
          throw new Error('Rating must be between 1 and 5');
        }
        fields.push(`${snakeKey} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const sql = `UPDATE ratings SET ${fields.join(', ')} WHERE id = ?`;

    await query(sql, values);

    return this.findById(id);
  }

  /**
   * Delete rating
   * @param {string} id - Rating ID
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = 'DELETE FROM ratings WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Get average rating for a product
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Average rating and count
   */
  static async getProductStats(productId) {
    const sql = `
      SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_ratings,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM ratings
      WHERE product_id = ?
    `;

    const results = await query(sql, [productId]);

    return {
      averageRating: parseFloat(results[0].average_rating),
      totalRatings: results[0].total_ratings,
      distribution: {
        5: results[0].five_star,
        4: results[0].four_star,
        3: results[0].three_star,
        2: results[0].two_star,
        1: results[0].one_star,
      },
    };
  }

  /**
   * Check if user has purchased product (for verified reviews)
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<boolean>} True if user has purchased product
   */
  static async hasUserPurchased(userId, productId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? 
        AND oi.product_id = ?
        AND o.payment_status = 'paid'
    `;

    const results = await query(sql, [userId, productId]);
    return results[0].count > 0;
  }

  /**
   * Mark rating as verified
   * @param {string} id - Rating ID
   * @returns {Promise<Object>} Updated rating
   */
  static async markAsVerified(id) {
    const sql = 'UPDATE ratings SET is_verified = TRUE WHERE id = ?';
    await query(sql, [id]);

    return this.findById(id);
  }

  /**
   * Count ratings
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Rating count
   */
  static async count(filters = {}) {
    const { productId, userId, minRating } = filters;

    let sql = 'SELECT COUNT(*) as count FROM ratings WHERE 1=1';
    const params = [];

    if (productId) {
      sql += ' AND product_id = ?';
      params.push(productId);
    }

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (minRating) {
      sql += ' AND rating >= ?';
      params.push(minRating);
    }

    const results = await query(sql, params);
    return results[0].count;
  }

  /**
   * Format rating object
   * @param {Object} rating - Raw rating data
   * @returns {Object} Formatted rating object
   * @private
   */
  static _formatRating(rating) {
    return {
      id: rating.id,
      userId: rating.user_id,
      productId: rating.product_id,
      rating: rating.rating,
      reviewText: rating.review_text,
      isVerified: Boolean(rating.is_verified),
      userName: rating.first_name && rating.last_name
        ? `${rating.first_name} ${rating.last_name}`
        : 'Anonymous',
      createdAt: rating.created_at,
      updatedAt: rating.updated_at,
    };
  }
}

module.exports = Rating;

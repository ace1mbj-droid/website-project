const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Product Model
 * Handles all product-related database operations
 */
class Product {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  static async create(productData) {
    const { name, description, price, imageUrl, category, stockQuantity = 0 } = productData;
    
    const id = uuidv4();
    const sql = `
      INSERT INTO products (id, name, description, price, image_url, category, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [id, name, description, price, imageUrl, category, stockQuantity]);
    
    return this.findById(id);
  }

  /**
   * Find product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  static async findById(id) {
    const sql = `
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as rating_count
      FROM products p
      LEFT JOIN ratings r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    const results = await query(sql, [id]);
    
    if (results.length === 0) return null;
    
    return this._formatProduct(results[0]);
  }

  /**
   * Find all products
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of products
   */
  static async findAll(options = {}) {
    const {
      limit = 50,
      offset = 0,
      category,
      minPrice,
      maxPrice,
      inStock,
      isActive = true,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = options;
    
    let sql = `
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as rating_count
      FROM products p
      LEFT JOIN ratings r ON p.id = r.product_id
      WHERE 1=1
    `;
    const params = [];
    
    if (isActive !== undefined) {
      sql += ' AND p.is_active = ?';
      params.push(isActive);
    }
    
    if (category) {
      sql += ' AND p.category = ?';
      params.push(category);
    }
    
    if (minPrice !== undefined) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice !== undefined) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    if (inStock) {
      sql += ' AND p.stock_quantity > 0';
    }
    
    sql += ' GROUP BY p.id';
    
    // Validate sort column
    const validSortColumns = ['name', 'price', 'created_at', 'stock_quantity'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    sql += ` ORDER BY p.${sortColumn} ${order} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const results = await query(sql, params);
    
    return results.map(product => this._formatProduct(product));
  }

  /**
   * Search products by name or description
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of products
   */
  static async search(searchTerm, options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    const sql = `
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as rating_count
      FROM products p
      LEFT JOIN ratings r ON p.id = r.product_id
      WHERE p.is_active = TRUE
        AND (p.name LIKE ? OR p.description LIKE ?)
      GROUP BY p.id
      ORDER BY p.name ASC
      LIMIT ? OFFSET ?
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const results = await query(sql, [searchPattern, searchPattern, limit, offset]);
    
    return results.map(product => this._formatProduct(product));
  }

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated product
   */
  static async update(id, updates) {
    const allowedFields = ['name', 'description', 'price', 'image_url', 'category', 'stock_quantity', 'is_active'];
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
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    
    return this.findById(id);
  }

  /**
   * Update stock quantity
   * @param {string} id - Product ID
   * @param {number} quantity - New stock quantity
   * @returns {Promise<Object>} Updated product
   */
  static async updateStock(id, quantity) {
    const sql = 'UPDATE products SET stock_quantity = ? WHERE id = ?';
    await query(sql, [quantity, id]);
    
    return this.findById(id);
  }

  /**
   * Decrement stock quantity (for orders)
   * @param {string} id - Product ID
   * @param {number} quantity - Quantity to decrement
   * @returns {Promise<Object>} Updated product
   */
  static async decrementStock(id, quantity) {
    const sql = `
      UPDATE products 
      SET stock_quantity = stock_quantity - ? 
      WHERE id = ? AND stock_quantity >= ?
    `;
    const result = await query(sql, [quantity, id, quantity]);
    
    if (result.affectedRows === 0) {
      throw new Error('Insufficient stock or product not found');
    }
    
    return this.findById(id);
  }

  /**
   * Increment stock quantity (for cancellations/returns)
   * @param {string} id - Product ID
   * @param {number} quantity - Quantity to increment
   * @returns {Promise<Object>} Updated product
   */
  static async incrementStock(id, quantity) {
    const sql = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?';
    await query(sql, [quantity, id]);
    
    return this.findById(id);
  }

  /**
   * Get product categories
   * @returns {Promise<Array>} Array of unique categories
   */
  static async getCategories() {
    const sql = 'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND is_active = TRUE ORDER BY category';
    const results = await query(sql);
    
    return results.map(row => row.category);
  }

  /**
   * Count products
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Product count
   */
  static async count(filters = {}) {
    const { category, inStock, isActive = true } = filters;
    
    let sql = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
    const params = [];
    
    if (isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(isActive);
    }
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (inStock) {
      sql += ' AND stock_quantity > 0';
    }
    
    const results = await query(sql, params);
    return results[0].count;
  }

  /**
   * Delete product (soft delete)
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = 'UPDATE products SET is_active = FALSE WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Hard delete product (permanent)
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  static async hardDelete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Check if product has sufficient stock
   * @param {string} id - Product ID
   * @param {number} quantity - Required quantity
   * @returns {Promise<boolean>} True if sufficient stock
   */
  static async hasStock(id, quantity) {
    const sql = 'SELECT stock_quantity FROM products WHERE id = ?';
    const results = await query(sql, [id]);
    
    if (results.length === 0) return false;
    
    return results[0].stock_quantity >= quantity;
  }

  /**
   * Format product object
   * @param {Object} product - Raw product data from database
   * @returns {Object} Formatted product object
   * @private
   */
  static _formatProduct(product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      imageUrl: product.image_url,
      category: product.category,
      stockQuantity: product.stock_quantity,
      isActive: Boolean(product.is_active),
      averageRating: parseFloat(product.average_rating || 0),
      ratingCount: product.rating_count || 0,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }
}

module.exports = Product;

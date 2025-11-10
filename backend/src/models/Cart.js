const { query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Cart Model
 * Handles all shopping cart database operations
 */
class Cart {
  /**
   * Get user's cart with product details
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Cart with items and total
   */
  static async getCart(userId) {
    const sql = `
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.created_at,
        c.updated_at,
        p.name as product_name,
        p.price,
        p.image_url,
        p.stock_quantity,
        p.is_active
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `;

    const items = await query(sql, [userId]);

    const formattedItems = items.map(item => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      imageUrl: item.image_url,
      stockQuantity: item.stock_quantity,
      isActive: Boolean(item.is_active),
      subtotal: parseFloat(item.price) * item.quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    const total = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      userId,
      items: formattedItems,
      itemCount: formattedItems.length,
      total,
    };
  }

  /**
   * Add item to cart
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Updated cart
   */
  static async addItem(userId, productId, quantity = 1) {
    return transaction(async (connection) => {
      // Check if product exists and has stock
      const [products] = await connection.execute(
        'SELECT stock_quantity, is_active FROM products WHERE id = ?',
        [productId]
      );

      if (products.length === 0) {
        throw new Error('Product not found');
      }

      if (!products[0].is_active) {
        throw new Error('Product is not available');
      }

      // Check if item already in cart
      const [existing] = await connection.execute(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      if (existing.length > 0) {
        // Update quantity
        const newQuantity = existing[0].quantity + quantity;

        if (newQuantity > products[0].stock_quantity) {
          throw new Error('Insufficient stock');
        }

        await connection.execute(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQuantity, existing[0].id]
        );
      } else {
        // Add new item
        if (quantity > products[0].stock_quantity) {
          throw new Error('Insufficient stock');
        }

        const id = uuidv4();
        await connection.execute(
          'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
          [id, userId, productId, quantity]
        );
      }

      return this.getCart(userId);
    });
  }

  /**
   * Update cart item quantity
   * @param {string} userId - User ID
   * @param {string} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated cart
   */
  static async updateQuantity(userId, cartItemId, quantity) {
    return transaction(async (connection) => {
      // Get cart item
      const [items] = await connection.execute(
        'SELECT product_id FROM cart_items WHERE id = ? AND user_id = ?',
        [cartItemId, userId]
      );

      if (items.length === 0) {
        throw new Error('Cart item not found');
      }

      // Check stock
      const [products] = await connection.execute(
        'SELECT stock_quantity FROM products WHERE id = ?',
        [items[0].product_id]
      );

      if (quantity > products[0].stock_quantity) {
        throw new Error('Insufficient stock');
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await connection.execute(
          'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
          [cartItemId, userId]
        );
      } else {
        // Update quantity
        await connection.execute(
          'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
          [quantity, cartItemId, userId]
        );
      }

      return this.getCart(userId);
    });
  }

  /**
   * Remove item from cart
   * @param {string} userId - User ID
   * @param {string} cartItemId - Cart item ID
   * @returns {Promise<Object>} Updated cart
   */
  static async removeItem(userId, cartItemId) {
    const sql = 'DELETE FROM cart_items WHERE id = ? AND user_id = ?';
    await query(sql, [cartItemId, userId]);

    return this.getCart(userId);
  }

  /**
   * Clear entire cart
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Empty cart
   */
  static async clearCart(userId) {
    const sql = 'DELETE FROM cart_items WHERE user_id = ?';
    await query(sql, [userId]);

    return this.getCart(userId);
  }

  /**
   * Get cart item count
   * @param {string} userId - User ID
   * @returns {Promise<number>} Number of items in cart
   */
  static async getItemCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?';
    const results = await query(sql, [userId]);
    return results[0].count;
  }

  /**
   * Check if product is in cart
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<boolean>} True if product is in cart
   */
  static async hasProduct(userId, productId) {
    const sql = 'SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?';
    const results = await query(sql, [userId, productId]);
    return results.length > 0;
  }

  /**
   * Validate cart items (check stock and availability)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Validation result
   */
  static async validateCart(userId) {
    const cart = await this.getCart(userId);
    const errors = [];

    for (const item of cart.items) {
      if (!item.isActive) {
        errors.push({
          productId: item.productId,
          productName: item.productName,
          error: 'Product is no longer available',
        });
      } else if (item.quantity > item.stockQuantity) {
        errors.push({
          productId: item.productId,
          productName: item.productName,
          error: `Only ${item.stockQuantity} items available`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      cart,
    };
  }

  /**
   * Merge guest cart with user cart (after login)
   * @param {string} userId - User ID
   * @param {Array} guestCartItems - Guest cart items
   * @returns {Promise<Object>} Merged cart
   */
  static async mergeGuestCart(userId, guestCartItems) {
    return transaction(async (connection) => {
      for (const item of guestCartItems) {
        // Check if item already in user cart
        const [existing] = await connection.execute(
          'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
          [userId, item.productId]
        );

        if (existing.length > 0) {
          // Update quantity (add guest quantity to existing)
          const newQuantity = existing[0].quantity + item.quantity;
          await connection.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [newQuantity, existing[0].id]
          );
        } else {
          // Add new item
          const id = uuidv4();
          await connection.execute(
            'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
            [id, userId, item.productId, item.quantity]
          );
        }
      }

      return this.getCart(userId);
    });
  }
}

module.exports = Cart;

const { query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Order Model
 * Handles all order-related database operations
 */
class Order {
  /**
   * Create a new order with items
   * @param {Object} orderData - Order data
   * @param {Array} items - Order items
   * @returns {Promise<Object>} Created order
   */
  static async create(orderData, items) {
    const {
      userId,
      totalAmount,
      paymentMethod,
      shippingAddress,
    } = orderData;

    return transaction(async (connection) => {
      // Generate order number
      const orderNumber = await this._generateOrderNumber();
      const orderId = uuidv4();

      // Create order
      const orderSql = `
        INSERT INTO orders (id, user_id, order_number, total_amount, payment_method, shipping_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(orderSql, [
        orderId,
        userId,
        orderNumber,
        totalAmount,
        paymentMethod,
        shippingAddress,
      ]);

      // Create order items
      for (const item of items) {
        const itemId = uuidv4();
        const itemSql = `
          INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(itemSql, [
          itemId,
          orderId,
          item.productId,
          item.productName,
          item.quantity,
          item.price,
        ]);

        // Decrement product stock
        const stockSql = `
          UPDATE products 
          SET stock_quantity = stock_quantity - ? 
          WHERE id = ? AND stock_quantity >= ?
        `;
        const [result] = await connection.execute(stockSql, [
          item.quantity,
          item.productId,
          item.quantity,
        ]);

        if (result.affectedRows === 0) {
          throw new Error(`Insufficient stock for product: ${item.productName}`);
        }
      }

      return this.findById(orderId);
    });
  }

  /**
   * Find order by ID
   * @param {string} id - Order ID
   * @returns {Promise<Object|null>} Order object with items or null
   */
  static async findById(id) {
    const orderSql = 'SELECT * FROM orders WHERE id = ?';
    const orders = await query(orderSql, [id]);

    if (orders.length === 0) return null;

    const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
    const items = await query(itemsSql, [id]);

    return this._formatOrder(orders[0], items);
  }

  /**
   * Find order by order number
   * @param {string} orderNumber - Order number
   * @returns {Promise<Object|null>} Order object or null
   */
  static async findByOrderNumber(orderNumber) {
    const orderSql = 'SELECT * FROM orders WHERE order_number = ?';
    const orders = await query(orderSql, [orderNumber]);

    if (orders.length === 0) return null;

    const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
    const items = await query(itemsSql, [orders[0].id]);

    return this._formatOrder(orders[0], items);
  }

  /**
   * Find orders by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of orders
   */
  static async findByUserId(userId, options = {}) {
    const { limit = 50, offset = 0, status } = options;

    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      sql += ' AND order_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const orders = await query(sql, params);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
        const items = await query(itemsSql, [order.id]);
        return this._formatOrder(order, items);
      })
    );

    return ordersWithItems;
  }

  /**
   * Find all orders (admin)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of orders
   */
  static async findAll(options = {}) {
    const { limit = 50, offset = 0, status, paymentStatus } = options;

    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND order_status = ?';
      params.push(status);
    }

    if (paymentStatus) {
      sql += ' AND payment_status = ?';
      params.push(paymentStatus);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const orders = await query(sql, params);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
        const items = await query(itemsSql, [order.id]);
        return this._formatOrder(order, items);
      })
    );

    return ordersWithItems;
  }

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }

    const sql = 'UPDATE orders SET order_status = ? WHERE id = ?';
    await query(sql, [status, id]);

    return this.findById(id);
  }

  /**
   * Update payment status
   * @param {string} id - Order ID
   * @param {string} status - New payment status
   * @param {string} transactionId - Payment transaction ID
   * @returns {Promise<Object>} Updated order
   */
  static async updatePaymentStatus(id, status, transactionId = null) {
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid payment status');
    }

    let sql = 'UPDATE orders SET payment_status = ?';
    const params = [status];

    if (transactionId) {
      sql += ', paytm_transaction_id = ?';
      params.push(transactionId);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await query(sql, params);

    return this.findById(id);
  }

  /**
   * Update tracking number
   * @param {string} id - Order ID
   * @param {string} trackingNumber - Tracking number
   * @returns {Promise<Object>} Updated order
   */
  static async updateTracking(id, trackingNumber) {
    const sql = 'UPDATE orders SET tracking_number = ? WHERE id = ?';
    await query(sql, [trackingNumber, id]);

    return this.findById(id);
  }

  /**
   * Cancel order
   * @param {string} id - Order ID
   * @returns {Promise<Object>} Updated order
   */
  static async cancel(id) {
    return transaction(async (connection) => {
      // Get order items
      const [items] = await connection.execute(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );

      // Restore stock for each item
      for (const item of items) {
        await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Update order status
      await connection.execute(
        'UPDATE orders SET order_status = ? WHERE id = ?',
        ['cancelled', id]
      );

      return this.findById(id);
    });
  }

  /**
   * Count orders
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Order count
   */
  static async count(filters = {}) {
    const { userId, status, paymentStatus } = filters;

    let sql = 'SELECT COUNT(*) as count FROM orders WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (status) {
      sql += ' AND order_status = ?';
      params.push(status);
    }

    if (paymentStatus) {
      sql += ' AND payment_status = ?';
      params.push(paymentStatus);
    }

    const results = await query(sql, params);
    return results[0].count;
  }

  /**
   * Get order statistics
   * @param {string} userId - User ID (optional, for user-specific stats)
   * @returns {Promise<Object>} Order statistics
   */
  static async getStats(userId = null) {
    let sql = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as delivered_orders
      FROM orders
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    const results = await query(sql, params);
    return {
      totalOrders: results[0].total_orders,
      totalRevenue: parseFloat(results[0].total_revenue || 0),
      averageOrderValue: parseFloat(results[0].average_order_value || 0),
      pendingOrders: results[0].pending_orders,
      deliveredOrders: results[0].delivered_orders,
    };
  }

  /**
   * Generate unique order number
   * @returns {Promise<string>} Order number
   * @private
   */
  static async _generateOrderNumber() {
    const prefix = 'ACE';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Format order object
   * @param {Object} order - Raw order data
   * @param {Array} items - Order items
   * @returns {Object} Formatted order object
   * @private
   */
  static _formatOrder(order, items) {
    return {
      id: order.id,
      userId: order.user_id,
      orderNumber: order.order_number,
      totalAmount: parseFloat(order.total_amount),
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      shippingAddress: order.shipping_address,
      trackingNumber: order.tracking_number,
      paytmTransactionId: order.paytm_transaction_id,
      items: items.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.price) * item.quantity,
      })),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };
  }
}

module.exports = Order;

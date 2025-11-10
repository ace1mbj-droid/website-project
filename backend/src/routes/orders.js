const express = require('express');
const router = express.Router();
const { Order, Cart, AuditLog } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { adminLimiter } = require('../middleware/rateLimit');
const { asyncHandler, notFoundError } = require('../middleware/errorHandler');

// POST /api/orders - Create order
router.post('/',
  authenticate,
  validate(schemas.createOrder),
  asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;
    
    // Get cart
    const cart = await Cart.getCart(req.userId);
    
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CART',
          message: 'Cart is empty',
        },
      });
    }
    
    // Validate cart
    const validation = await Cart.validateCart(req.userId);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CART',
          message: 'Cart validation failed',
          details: validation.errors,
        },
      });
    }
    
    // Calculate order totals
    const subtotal = cart.total;
    const taxRate = 0.18; // 18% GST for India
    const taxAmount = subtotal * taxRate;
    
    // Calculate shipping based on order value
    let shippingCost = 0;
    if (subtotal < 500) {
      shippingCost = 50; // ₹50 for orders below ₹500
    } else if (subtotal < 1000) {
      shippingCost = 30; // ₹30 for orders between ₹500-₹1000
    }
    // Free shipping for orders above ₹1000
    
    const totalAmount = subtotal + taxAmount + shippingCost;
    
    // Create order
    const order = await Order.create(
      {
        userId: req.userId,
        totalAmount: totalAmount,
        paymentMethod,
        shippingAddress,
      },
      cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      }))
    );
    
    // Clear cart
    await Cart.clearCart(req.userId);
    
    res.status(201).json({
      success: true,
      data: { 
        order,
        breakdown: {
          subtotal: subtotal,
          tax: taxAmount,
          shipping: shippingCost,
          total: totalAmount,
        }
      },
      message: 'Order created successfully',
    });
  })
);

// GET /api/orders - Get user orders
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await Order.findByUserId(req.userId, {
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
      status: req.query.status,
    });
    
    res.json({
      success: true,
      data: { orders },
    });
  })
);

// GET /api/orders/:id - Get single order
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      throw notFoundError('Order');
    }
    
    // Check if order belongs to user (or user is admin)
    if (order.userId !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied',
        },
      });
    }
    
    res.json({
      success: true,
      data: { order },
    });
  })
);

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status',
  authenticate,
  requireAdmin,
  adminLimiter,
  validate(schemas.updateOrderStatus),
  asyncHandler(async (req, res) => {
    const { status, trackingNumber } = req.body;
    
    // Get order before update for audit log
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) {
      throw notFoundError('Order');
    }
    
    // Update order status
    const order = await Order.updateStatus(req.params.id, status);
    
    if (trackingNumber) {
      await Order.updateTracking(req.params.id, trackingNumber);
    }
    
    // Log admin action
    await AuditLog.create({
      userId: req.userId,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'order',
      entityId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        orderNumber: oldOrder.orderNumber,
        oldStatus: oldOrder.orderStatus,
        newStatus: status,
        trackingNumber: trackingNumber || null,
      },
    });
    
    // TODO: Send status update email to customer (Task 8.3)
    // This will be implemented in Phase 6 when email service is set up
    
    res.json({
      success: true,
      data: { order },
      message: 'Order status updated',
    });
  })
);

// GET /api/admin/orders - Get all orders (admin only)
router.get('/admin/all',
  authenticate,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.findAll({
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
    });
    
    res.json({
      success: true,
      data: { orders },
    });
  })
);

module.exports = router;

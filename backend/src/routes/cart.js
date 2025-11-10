const express = require('express');
const router = express.Router();
const { Cart } = require('../models');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/cart - Get user cart
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const cart = await Cart.getCart(req.userId);
    
    res.json({
      success: true,
      data: { cart },
    });
  })
);

// POST /api/cart/items - Add item to cart
router.post('/items',
  authenticate,
  validate(schemas.addToCart),
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.addItem(req.userId, productId, quantity);
    
    res.status(201).json({
      success: true,
      data: { cart },
      message: 'Item added to cart',
    });
  })
);

// PUT /api/cart/items/:id - Update cart item quantity
router.put('/items/:id',
  authenticate,
  validate(schemas.updateCartItem),
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    
    const cart = await Cart.updateQuantity(req.userId, req.params.id, quantity);
    
    res.json({
      success: true,
      data: { cart },
      message: 'Cart updated',
    });
  })
);

// DELETE /api/cart/items/:id - Remove item from cart
router.delete('/items/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const cart = await Cart.removeItem(req.userId, req.params.id);
    
    res.json({
      success: true,
      data: { cart },
      message: 'Item removed from cart',
    });
  })
);

// DELETE /api/cart - Clear cart
router.delete('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const cart = await Cart.clearCart(req.userId);
    
    res.json({
      success: true,
      data: { cart },
      message: 'Cart cleared',
    });
  })
);

module.exports = router;

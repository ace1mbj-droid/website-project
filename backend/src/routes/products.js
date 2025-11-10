const express = require('express');
const router = express.Router();
const { Product, Rating } = require('../models');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validate, schemas, validatePagination } = require('../middleware/validation');
const { adminLimiter } = require('../middleware/rateLimit');
const { asyncHandler, notFoundError } = require('../middleware/errorHandler');

// GET /api/products - List all products
router.get('/',
  optionalAuth,
  validatePagination,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const products = await Product.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      inStock: req.query.inStock === 'true',
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
    });
    
    const total = await Product.count({ category: req.query.category });
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

// GET /api/products/:id - Get single product
router.get('/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw notFoundError('Product');
    }
    
    res.json({
      success: true,
      data: { product },
    });
  })
);

// POST /api/products - Create product (admin only)
router.post('/',
  authenticate,
  requireAdmin,
  adminLimiter,
  validate(schemas.createProduct),
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { product },
      message: 'Product created successfully',
    });
  })
);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id',
  authenticate,
  requireAdmin,
  adminLimiter,
  validate(schemas.updateProduct),
  asyncHandler(async (req, res) => {
    const product = await Product.update(req.params.id, req.body);
    
    if (!product) {
      throw notFoundError('Product');
    }
    
    res.json({
      success: true,
      data: { product },
      message: 'Product updated successfully',
    });
  })
);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id',
  authenticate,
  requireAdmin,
  adminLimiter,
  asyncHandler(async (req, res) => {
    await Product.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  })
);

// GET /api/products/:id/ratings - Get product ratings
router.get('/:id/ratings',
  asyncHandler(async (req, res) => {
    const ratings = await Rating.findByProductId(req.params.id, {
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
    });
    
    const stats = await Rating.getProductStats(req.params.id);
    
    res.json({
      success: true,
      data: { ratings, stats },
    });
  })
);

// POST /api/products/:id/ratings - Add product rating
router.post('/:id/ratings',
  authenticate,
  validate(schemas.createRating),
  asyncHandler(async (req, res) => {
    const rating = await Rating.createOrUpdate({
      userId: req.userId,
      productId: req.params.id,
      rating: req.body.rating,
      reviewText: req.body.reviewText,
    });
    
    res.status(201).json({
      success: true,
      data: { rating },
      message: 'Rating submitted successfully',
    });
  })
);

module.exports = router;

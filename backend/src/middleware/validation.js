const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors,
        },
      });
    }
    
    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User schemas
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).max(50).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 50 characters',
      'any.required': 'Password is required',
    }),
    firstName: Joi.string().min(1).max(100).required().messages({
      'string.min': 'First name is required',
      'string.max': 'First name must not exceed 100 characters',
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name must not exceed 100 characters',
      'any.required': 'Last name is required',
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
      'string.pattern.base': 'Phone number must be 10 digits',
    }),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),
  
  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(100).optional(),
    lastName: Joi.string().min(1).max(100).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(50).required(),
  }),
  
  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(5000).optional(),
    price: Joi.number().positive().precision(2).required(),
    imageUrl: Joi.string().uri().max(500).optional(),
    category: Joi.string().max(100).optional(),
    stockQuantity: Joi.number().integer().min(0).default(0),
  }),
  
  updateProduct: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(5000).optional(),
    price: Joi.number().positive().precision(2).optional(),
    imageUrl: Joi.string().uri().max(500).optional(),
    category: Joi.string().max(100).optional(),
    stockQuantity: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
  }),
  
  // Cart schemas
  addToCart: Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).max(999).default(1),
  }),
  
  updateCartItem: Joi.object({
    quantity: Joi.number().integer().min(0).max(999).required(),
  }),
  
  // Order schemas
  createOrder: Joi.object({
    shippingAddress: Joi.string().min(10).max(500).required(),
    paymentMethod: Joi.string().valid('paytm', 'wallet', 'cod').required(),
  }),
  
  updateOrderStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required(),
    trackingNumber: Joi.string().max(100).optional(),
  }),
  
  // Rating schemas
  createRating: Joi.object({
    productId: Joi.string().uuid().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    reviewText: Joi.string().max(1000).optional(),
  }),
  
  // Pagination schemas
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
  }),
  
  // ID parameter
  id: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

/**
 * Sanitize HTML to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize request body
 * Recursively sanitizes all string values in an object
 */
const sanitizeBody = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          sanitized[key] = sanitizeHtml(value);
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

/**
 * Validate UUID parameter
 */
const validateId = validate(schemas.id, 'params');

/**
 * Validate pagination query
 */
const validatePagination = validate(schemas.pagination, 'query');

module.exports = {
  validate,
  schemas,
  sanitizeHtml,
  sanitizeBody,
  validateId,
  validatePagination,
};

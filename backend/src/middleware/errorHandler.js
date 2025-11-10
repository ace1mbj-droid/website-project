const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

/**
 * Custom error class
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  
  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.userId || null,
  });
  
  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.message.match(/for key '(.+?)'/)?.[1] || 'field';
    error = new AppError(
      `Duplicate value for ${field}`,
      409,
      'DUPLICATE_ENTRY'
    );
  }
  
  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    error = new AppError(
      'Referenced record does not exist',
      400,
      'INVALID_REFERENCE'
    );
  }
  
  // MySQL data too long error
  if (err.code === 'ER_DATA_TOO_LONG') {
    error = new AppError(
      'Data exceeds maximum length',
      400,
      'DATA_TOO_LONG'
    );
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError(
      'Invalid token',
      401,
      'INVALID_TOKEN'
    );
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new AppError(
      'Token expired',
      401,
      'TOKEN_EXPIRED'
    );
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError(
      messages.join(', '),
      400,
      'VALIDATION_ERROR'
    );
  }
  
  // Cast errors (invalid ID format)
  if (err.name === 'CastError') {
    error = new AppError(
      'Invalid ID format',
      400,
      'INVALID_ID'
    );
  }
  
  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'Internal server error';
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error,
      }),
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Not found handler
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.originalUrl}`,
    404,
    'NOT_FOUND'
  );
  next(error);
};

/**
 * Async handler wrapper
 * Catches errors in async route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation error helper
 */
const validationError = (message, details = null) => {
  const error = new AppError(message, 400, 'VALIDATION_ERROR');
  if (details) {
    error.details = details;
  }
  return error;
};

/**
 * Unauthorized error helper
 */
const unauthorizedError = (message = 'Authentication required') => {
  return new AppError(message, 401, 'UNAUTHORIZED');
};

/**
 * Forbidden error helper
 */
const forbiddenError = (message = 'Insufficient permissions') => {
  return new AppError(message, 403, 'FORBIDDEN');
};

/**
 * Not found error helper
 */
const notFoundError = (resource = 'Resource') => {
  return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
};

/**
 * Conflict error helper
 */
const conflictError = (message) => {
  return new AppError(message, 409, 'CONFLICT');
};

/**
 * Internal error helper
 */
const internalError = (message = 'Internal server error') => {
  return new AppError(message, 500, 'INTERNAL_ERROR');
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler,
  validationError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
  internalError,
  logger,
};

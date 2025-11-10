const rateLimit = require('express-rate-limit');
const { get, set, incr, expire } = require('../config/redis');

/**
 * Create Redis store for rate limiting
 */
const createRedisStore = () => {
  return {
    async increment(key) {
      const current = await incr(`ratelimit:${key}`);
      if (current === 1) {
        // Set expiration on first increment
        await expire(`ratelimit:${key}`, 900); // 15 minutes
      }
      return {
        totalHits: current,
        resetTime: new Date(Date.now() + 900000), // 15 minutes from now
      };
    },
    
    async decrement(key) {
      // Not used by express-rate-limit
    },
    
    async resetKey(key) {
      await set(`ratelimit:${key}`, '0', 900);
    },
  };
};

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis store if available, fallback to memory
  store: process.env.REDIS_HOST ? createRedisStore() : undefined,
});

/**
 * Login rate limiter
 * 5 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts, please try again after 15 minutes',
    },
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_HOST ? createRedisStore() : undefined,
});

/**
 * Registration rate limiter
 * 3 registrations per hour per IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many registration attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_HOST ? createRedisStore() : undefined,
});

/**
 * Admin API rate limiter
 * 50 requests per 15 minutes per IP
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many admin requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_HOST ? createRedisStore() : undefined,
});

/**
 * Password reset rate limiter
 * 3 attempts per hour per IP
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many password reset attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_HOST ? createRedisStore() : undefined,
});

/**
 * Payment rate limiter
 * 10 payment attempts per hour per IP
 */
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many payment attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_HOST ? createRedisStore() : undefined,
});

/**
 * Custom rate limiter factory
 * @param {Object} options - Rate limit options
 * @returns {Function} Rate limit middleware
 */
const createRateLimiter = (options) => {
  return rateLimit({
    ...options,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: options.message || 'Too many requests, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: process.env.REDIS_HOST ? createRedisStore() : undefined,
  });
};

/**
 * Account lockout middleware
 * Locks account after too many failed login attempts
 */
const accountLockout = async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next();
  }
  
  const lockoutKey = `lockout:${email}`;
  const attemptsKey = `attempts:${email}`;
  
  try {
    // Check if account is locked
    const isLocked = await get(lockoutKey);
    if (isLocked) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account is temporarily locked due to too many failed login attempts. Please try again in 30 minutes.',
        },
      });
    }
    
    // Store email for later use in login route
    req.lockoutEmail = email;
    req.attemptsKey = attemptsKey;
    req.lockoutKey = lockoutKey;
    
    next();
  } catch (error) {
    // If Redis fails, continue without lockout
    next();
  }
};

/**
 * Record failed login attempt
 * Call this after a failed login
 */
const recordFailedLogin = async (email) => {
  const attemptsKey = `attempts:${email}`;
  const lockoutKey = `lockout:${email}`;
  
  try {
    const attempts = await incr(attemptsKey);
    
    if (attempts === 1) {
      // Set expiration on first attempt
      await expire(attemptsKey, 900); // 15 minutes
    }
    
    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      await set(lockoutKey, '1', 1800); // Lock for 30 minutes
      await set(attemptsKey, '0', 1); // Reset attempts
    }
    
    return attempts;
  } catch (error) {
    console.error('Failed to record login attempt:', error);
    return 0;
  }
};

/**
 * Clear failed login attempts
 * Call this after a successful login
 */
const clearFailedLogins = async (email) => {
  const attemptsKey = `attempts:${email}`;
  
  try {
    await set(attemptsKey, '0', 1);
  } catch (error) {
    console.error('Failed to clear login attempts:', error);
  }
};

module.exports = {
  apiLimiter,
  loginLimiter,
  registerLimiter,
  adminLimiter,
  passwordResetLimiter,
  paymentLimiter,
  createRateLimiter,
  accountLockout,
  recordFailedLogin,
  clearFailedLogins,
};

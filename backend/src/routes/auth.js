const express = require('express');
const router = express.Router();
const { User, Session } = require('../models');
const { generateTokenPair, createTokenPayload } = require('../config/jwt');
const { validate, schemas } = require('../middleware/validation');
const { loginLimiter, registerLimiter, passwordResetLimiter, accountLockout, recordFailedLogin, clearFailedLogins } = require('../middleware/rateLimit');
const { authenticate } = require('../middleware/auth');
const { asyncHandler, notFoundError, unauthorizedError } = require('../middleware/errorHandler');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',
  registerLimiter,
  validate(schemas.register),
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'customer',
    });

    // Generate tokens
    const tokenPayload = createTokenPayload(user);
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Create session
    await Session.create({
      userId: user.id,
      token: accessToken,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      expiresIn: 86400, // 24 hours
    });

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
      },
      message: 'Registration successful',
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  loginLimiter,
  accountLockout,
  validate(schemas.login),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Get user with password
    const user = await User.findByEmailWithPassword(email);
    
    if (!user) {
      await recordFailedLogin(email);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      await recordFailedLogin(email);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is inactive',
        },
      });
    }

    // Clear failed login attempts
    await clearFailedLogins(email);

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate tokens
    const tokenPayload = createTokenPayload(user);
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Create session
    await Session.create({
      userId: user.id,
      token: accessToken,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      expiresIn: 86400, // 24 hours
    });

    // Limit concurrent sessions
    await Session.limitSessions(user.id, 3);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Format user (remove password_hash)
    const { password_hash, ...userData } = user;
    const formattedUser = {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      role: userData.role,
      walletBalance: parseFloat(userData.wallet_balance),
      emailVerified: Boolean(userData.email_verified),
      isActive: Boolean(userData.is_active),
    };

    res.json({
      success: true,
      data: {
        user: formattedUser,
        accessToken,
      },
      message: 'Login successful',
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    // Get token from cookie or header
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (token) {
      // Delete session
      await Session.deleteByToken(token);
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout successful',
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  })
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  asyncHandler(async (req, res) => {
    const { verifyRefreshToken } = require('../config/jwt');
    
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw unauthorizedError('Refresh token required');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw unauthorizedError('Invalid refresh token');
    }

    // Generate new access token
    const tokenPayload = createTokenPayload(user);
    const { accessToken } = generateTokenPair(tokenPayload);

    // Update session
    await Session.create({
      userId: user.id,
      token: accessToken,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      expiresIn: 86400,
    });

    // Set cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
      },
      message: 'Token refreshed successfully',
    });
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password',
  passwordResetLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email is required',
        },
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);

    // Always return success (don't reveal if email exists)
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });

    // If user exists, send reset email (implement in Phase 6)
    if (user) {
      // TODO: Generate reset token and send email
      // This will be implemented in Task 8 (Email System)
      console.log(`Password reset requested for: ${email}`);
    }
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Token and new password are required',
        },
      });
    }

    // TODO: Verify reset token and update password
    // This will be implemented in Task 8 (Email System)

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  })
);

module.exports = router;

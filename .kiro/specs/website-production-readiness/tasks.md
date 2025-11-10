# Implementation Plan

## Phase 1: Security Remediation (Critical - Week 1)

- [x] 1. GitHub Security Cleanup
  - Remove all credential files from GitHub history using git filter-branch
  - Update .gitignore to prevent future credential exposure
  - Force push cleaned repository to remote
  - Verify credentials are no longer accessible in GitHub history
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.1 Create comprehensive .gitignore file
  - Add patterns for DO-NOT-UPLOAD/, *CREDENTIALS*.md, *_ADMIN.md, *PAYMENT*.md, *BANK*.md
  - Add patterns for .env files and environment-specific configs
  - Add patterns for node_modules, logs, and build artifacts
  - Test .gitignore effectiveness with sample files
  - _Requirements: 1.3_

- [x] 1.2 Generate new admin password
  - Create password generator utility that meets security requirements (12+ chars, mixed case, numbers, symbols)
  - Generate new admin password
  - Update DO-NOT-UPLOAD/ADMIN_CREDENTIALS.md with new password
  - Document password change in secure location
  - _Requirements: 1.5_

- [x] 1.3 Add security headers to .htaccess
  - Add HTTPS redirect rules (RewriteEngine, RewriteCond, RewriteRule)
  - Add X-Frame-Options: SAMEORIGIN header
  - Add X-Content-Type-Options: nosniff header
  - Add X-XSS-Protection: 1; mode=block header
  - Add Referrer-Policy: strict-origin-when-cross-origin header
  - Add Strict-Transport-Security header for HTTPS
  - Test headers using online security scanner
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [x] 1.4 Implement Content Security Policy
  - Add CSP header to .htaccess with appropriate directives
  - Configure script-src, style-src, img-src, connect-src directives
  - Test CSP doesn't break existing functionality
  - Adjust CSP based on browser console warnings
  - _Requirements: 2.5_


## Phase 2: Backend Infrastructure Setup (Week 2-3)

- [x] 2. Initialize Node.js backend project
  - Create backend/ directory structure
  - Initialize package.json with required dependencies
  - Setup TypeScript or ES6+ configuration
  - Configure ESLint and Prettier for code quality
  - Create basic Express.js server skeleton
  - _Requirements: 3.1, 3.2_

- [x] 2.1 Setup database configuration
  - Install MySQL or PostgreSQL client library
  - Create database connection configuration file
  - Implement connection pooling
  - Add database health check function
  - Create environment variable configuration for database credentials
  - _Requirements: 4.1, 4.5_

- [x] 2.2 Create database migration system
  - Setup migration tool (node-pg-migrate or knex)
  - Create migration for users table with all required fields
  - Create migration for products table
  - Create migration for orders and order_items tables
  - Create migration for cart_items table
  - Create migration for sessions table
  - Create migration for ratings table
  - Create migration for wallet_transactions table
  - Create migration for audit_logs table
  - _Requirements: 4.1_

- [x] 2.3 Implement database models
  - Create User model with CRUD operations
  - Create Product model with CRUD operations
  - Create Order model with transaction support
  - Create Cart model with user association
  - Create Session model with expiration handling
  - Create Rating model with product association
  - Create WalletTransaction model
  - Add database query helpers and utilities
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 2.4 Setup Redis for session storage
  - Install Redis client library
  - Create Redis connection configuration
  - Implement session storage interface
  - Add Redis health check
  - Configure session expiration policies
  - _Requirements: 3.3, 11.1, 11.2_

- [x] 2.5 Configure JWT authentication
  - Install jsonwebtoken library
  - Create JWT configuration with secret keys
  - Implement token generation function
  - Implement token verification function
  - Create refresh token mechanism
  - _Requirements: 3.2, 3.3_

- [x] 2.6 Create authentication middleware
  - Implement JWT verification middleware
  - Create role-based authorization middleware (admin vs customer)
  - Add request authentication decorator
  - Handle token expiration gracefully
  - _Requirements: 3.1, 3.4, 6.1_

- [x] 2.7 Implement rate limiting middleware
  - Install express-rate-limit library
  - Configure rate limits for different endpoint types (login: 5/15min, API: 100/15min, admin: 50/15min)
  - Create IP-based rate limiting
  - Add rate limit exceeded error handling
  - Implement account lockout after failed login attempts
  - _Requirements: 3.5, 9.1, 9.2, 9.3, 9.4_

- [x] 2.8 Setup input validation middleware
  - Install Joi or express-validator
  - Create validation schemas for all input types
  - Implement validation middleware
  - Add sanitization for text inputs
  - Create detailed validation error responses
  - _Requirements: 6.2, 9.5_

- [x] 2.9 Create global error handler
  - Implement centralized error handling middleware
  - Create custom error classes for different error types
  - Add error logging with stack traces
  - Format error responses consistently
  - Ensure no sensitive data in error messages
  - _Requirements: 3.1, 3.4_


## Phase 3: Authentication API Implementation (Week 3-4)

- [x] 3. Implement user registration endpoint
  - Create POST /api/auth/register route
  - Validate email format, password strength, required fields
  - Check for existing user with same email
  - Hash password using bcrypt with 12 salt rounds
  - Create user record in database
  - Generate JWT token and set httpOnly cookie
  - Return user data without password
  - _Requirements: 3.1, 3.2, 4.2_

- [x] 3.1 Implement user login endpoint
  - Create POST /api/auth/login route
  - Validate email and password format
  - Check rate limiting and account lockout status
  - Query user from database by email
  - Verify password using bcrypt compare
  - Generate JWT access and refresh tokens
  - Create session record in database
  - Set httpOnly cookies for tokens
  - Clear failed login attempts on success
  - Log authentication attempt
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 6.1_

- [x] 3.2 Implement logout endpoint
  - Create POST /api/auth/logout route
  - Verify JWT token from cookie
  - Invalidate session in database
  - Clear authentication cookies
  - Return success response
  - _Requirements: 11.4_

- [x] 3.3 Implement get current user endpoint
  - Create GET /api/auth/me route
  - Verify JWT token from request
  - Query user data from database
  - Return user profile without password
  - Handle expired or invalid tokens
  - _Requirements: 3.4_

- [x] 3.4 Implement token refresh endpoint
  - Create POST /api/auth/refresh route
  - Verify refresh token from cookie
  - Check session validity in database
  - Generate new access token
  - Update session expiration
  - Set new access token cookie
  - _Requirements: 3.2, 3.6_

- [x] 3.5 Implement password reset request endpoint
  - Create POST /api/auth/forgot-password route
  - Validate email format
  - Check if user exists
  - Generate secure reset token
  - Store token with 1-hour expiration
  - Send password reset email
  - _Requirements: 8.5_

- [x] 3.6 Implement password reset confirmation endpoint
  - Create POST /api/auth/reset-password route
  - Validate reset token and new password
  - Check token expiration
  - Hash new password with bcrypt
  - Update user password in database
  - Invalidate all existing sessions
  - Send confirmation email
  - _Requirements: 8.5_


## Phase 4: Product and Cart API Implementation (Week 4-5)

- [x] 4. Implement product listing endpoint
  - Create GET /api/products route
  - Add pagination support (page, limit parameters)
  - Add filtering by category, price range
  - Add sorting options (price, name, date)
  - Query products from database with filters
  - Return paginated product list with metadata
  - _Requirements: 4.3_

- [x] 4.1 Implement single product endpoint
  - Create GET /api/products/:id route
  - Validate product ID format
  - Query product from database
  - Include product ratings and average rating
  - Return 404 if product not found
  - _Requirements: 4.3_

- [x] 4.2 Implement create product endpoint (admin)
  - Create POST /api/products route
  - Verify admin authentication and authorization
  - Validate all product fields (name, price, description, image, stock)
  - Validate image URL or handle file upload
  - Create product record in database
  - Log admin action in audit_logs
  - Return created product
  - _Requirements: 6.2, 6.4, 10.5_

- [x] 4.3 Implement update product endpoint (admin)
  - Create PUT /api/products/:id route
  - Verify admin authentication and authorization
  - Validate product ID and update fields
  - Check product exists in database
  - Update product record with validation
  - Log admin action in audit_logs
  - Return updated product
  - _Requirements: 6.2, 6.4, 10.5_

- [x] 4.4 Implement delete product endpoint (admin)
  - Create DELETE /api/products/:id route
  - Verify admin authentication and authorization
  - Check product exists and has no pending orders
  - Soft delete or hard delete product
  - Log admin action in audit_logs
  - Return success response
  - _Requirements: 6.1, 6.4_

- [x] 4.5 Implement product ratings endpoints
  - Create GET /api/products/:id/ratings route to fetch ratings
  - Create POST /api/products/:id/ratings route to add rating
  - Verify user authentication for adding ratings
  - Validate rating value (1-5) and review text
  - Check user hasn't already rated product
  - Create or update rating in database
  - Return updated average rating
  - _Requirements: 4.3_

- [x] 5. Implement get cart endpoint
  - Create GET /api/cart route
  - Verify user authentication
  - Query cart items from database for current user
  - Include product details for each cart item
  - Calculate cart total
  - Return cart with items and total
  - _Requirements: 4.3_

- [x] 5.1 Implement add to cart endpoint
  - Create POST /api/cart/items route
  - Verify user authentication
  - Validate product ID and quantity
  - Check product exists and has sufficient stock
  - Check if item already in cart (update quantity vs create new)
  - Create or update cart_item record
  - Return updated cart
  - _Requirements: 10.2, 10.3_

- [x] 5.2 Implement update cart item endpoint
  - Create PUT /api/cart/items/:id route
  - Verify user authentication and cart item ownership
  - Validate new quantity
  - Check stock availability for new quantity
  - Update cart_item quantity or remove if quantity is 0
  - Return updated cart
  - _Requirements: 10.2, 10.3_

- [x] 5.3 Implement remove from cart endpoint
  - Create DELETE /api/cart/items/:id route
  - Verify user authentication and cart item ownership
  - Delete cart_item from database
  - Return updated cart
  - _Requirements: 4.3_

- [x] 5.4 Implement clear cart endpoint
  - Create DELETE /api/cart route
  - Verify user authentication
  - Delete all cart items for current user
  - Return empty cart response
  - _Requirements: 4.3_


## Phase 5: Order Management and Payment Integration (Week 5-6)

- [x] 6. Implement create order endpoint
  - Create POST /api/orders route
  - Verify user authentication
  - Validate shipping address and contact information
  - Retrieve user's cart items from database
  - Validate all cart items have sufficient stock
  - Calculate order total with tax and shipping
  - Begin database transaction
  - Create order record with "pending" status
  - Create order_items records for each cart item
  - Decrement product stock quantities atomically
  - Clear user's cart
  - Commit transaction
  - Return order details with order ID
  - _Requirements: 4.4, 7.1, 10.3, 10.4_

- [x] 6.1 Implement get user orders endpoint
  - Create GET /api/orders route
  - Verify user authentication
  - Query orders from database for current user
  - Include order items and product details
  - Add pagination support
  - Sort by creation date (newest first)
  - Return paginated order list
  - _Requirements: 7.5_

- [x] 6.2 Implement get single order endpoint
  - Create GET /api/orders/:id route
  - Verify user authentication
  - Validate order ID format
  - Query order from database
  - Verify order belongs to current user (or user is admin)
  - Include order items, payment status, tracking info
  - Return order details
  - _Requirements: 7.5_

- [x] 6.3 Implement update order status endpoint (admin)
  - Create PUT /api/orders/:id/status route
  - Verify admin authentication and authorization
  - Validate order ID and new status
  - Check order exists in database
  - Update order status (confirmed, processing, shipped, delivered)
  - Add tracking number if status is "shipped"
  - Send status update email to customer
  - Log admin action in audit_logs
  - Return updated order
  - _Requirements: 6.4, 7.3, 8.3_

- [x] 6.4 Implement get all orders endpoint (admin)
  - Create GET /api/admin/orders route
  - Verify admin authentication and authorization
  - Query all orders from database
  - Add filtering by status, date range, customer
  - Add pagination and sorting
  - Return paginated order list with customer details
  - _Requirements: 6.1, 7.5_

- [ ] 7. Setup Paytm payment integration
  - Install Paytm SDK or create custom integration
  - Configure Paytm credentials (merchant ID, key, website)
  - Create Paytm configuration file with environment variables
  - Implement checksum generation utility
  - Implement checksum verification utility
  - Create payment service module
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 7.1 Implement initiate payment endpoint
  - Create POST /api/payment/initiate route
  - Verify user authentication
  - Validate order ID
  - Check order exists and belongs to user
  - Check order payment status is "pending"
  - Generate unique Paytm transaction ID
  - Create payment request with order details
  - Generate Paytm checksum
  - Store transaction details in database
  - Return Paytm payment URL and transaction token
  - _Requirements: 5.1, 5.2_

- [ ] 7.2 Implement Paytm callback handler
  - Create POST /api/payment/callback route
  - Receive Paytm callback with transaction status
  - Verify checksum signature to prevent tampering
  - Validate transaction ID matches database record
  - Update order payment status based on Paytm response
  - Handle success: update order to "confirmed", send confirmation email
  - Handle failure: update order to "failed", allow retry
  - Handle pending: keep order as "pending"
  - Implement idempotency to handle duplicate callbacks
  - Log all payment callbacks
  - Redirect user to appropriate page (success/failure)
  - _Requirements: 5.3, 5.4, 5.5, 7.2, 8.2_

- [ ] 7.3 Implement payment status check endpoint
  - Create GET /api/payment/status/:transactionId route
  - Verify user authentication
  - Query transaction status from database
  - Optionally verify with Paytm status API
  - Return payment status and order details
  - _Requirements: 5.3_


## Phase 6: Email Notification System (Week 6-7)

- [ ] 8. Setup email service configuration
  - Install Nodemailer library
  - Configure SMTP settings (host, port, credentials)
  - Create email transporter with authentication
  - Implement email sending function with error handling
  - Add email retry logic for failed sends
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8.1 Create email templates
  - Create welcome email template with user details
  - Create order confirmation email template with order summary
  - Create order shipped email template with tracking info
  - Create order delivered email template with feedback request
  - Create password reset email template with secure link
  - Create payment failed email template with retry instructions
  - Use HTML templates with inline CSS for compatibility
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8.2 Setup email queue system
  - Install Bull queue library and Redis
  - Create email queue configuration
  - Implement job processor for sending emails
  - Add retry logic with exponential backoff (3 attempts)
  - Add job completion and failure handlers
  - Create queue monitoring dashboard endpoint
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8.3 Implement email service functions
  - Create sendWelcomeEmail function for new registrations
  - Create sendOrderConfirmation function for completed orders
  - Create sendOrderStatusUpdate function for status changes
  - Create sendPasswordReset function for password resets
  - Create sendPaymentFailed function for failed payments
  - Add email logging for tracking delivery
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8.4 Integrate email sending with existing endpoints
  - Add welcome email to registration endpoint
  - Add order confirmation email to payment callback (success)
  - Add status update email to order status update endpoint
  - Add password reset email to forgot password endpoint
  - Add payment failed email to payment callback (failure)
  - Ensure emails are sent asynchronously (don't block responses)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_


## Phase 7: Frontend Migration to API (Week 7-8)

- [ ] 9. Create API client utility
  - Create frontend API client module with base URL configuration
  - Implement request wrapper with authentication headers
  - Add automatic token refresh on 401 errors
  - Implement request/response interceptors
  - Add error handling and user-friendly error messages
  - Create loading state management
  - _Requirements: 3.1, 3.4, 3.6_

- [ ] 9.1 Migrate authentication to use API
  - Update auth.js register function to call POST /api/auth/register
  - Update auth.js login function to call POST /api/auth/login
  - Update auth.js logout function to call POST /api/auth/logout
  - Remove localStorage password storage (use httpOnly cookies)
  - Update session management to use API tokens
  - Keep encryption utilities for backward compatibility
  - Test registration, login, and logout flows
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 9.2 Migrate cart to use API
  - Update cart.js loadCart to call GET /api/cart
  - Update cart.js addItem to call POST /api/cart/items
  - Update cart.js updateQuantity to call PUT /api/cart/items/:id
  - Update cart.js removeItem to call DELETE /api/cart/items/:id
  - Update cart.js clearCart to call DELETE /api/cart
  - Remove localStorage cart storage (use server-side cart)
  - Handle stock validation errors from API
  - Test all cart operations
  - _Requirements: 4.3, 10.2, 10.3_

- [ ] 9.3 Update product pages to use API
  - Update product listing page to call GET /api/products
  - Add pagination controls and filtering UI
  - Update product detail page to call GET /api/products/:id
  - Update product ratings to call GET /api/products/:id/ratings
  - Update add rating form to call POST /api/products/:id/ratings
  - Display real-time stock availability
  - Test product browsing and rating functionality
  - _Requirements: 4.3, 10.1_

- [ ] 9.4 Update checkout flow to use API
  - Update checkout page to call GET /api/cart for cart summary
  - Update order creation to call POST /api/orders
  - Update payment initiation to call POST /api/payment/initiate
  - Redirect to Paytm payment page with transaction token
  - Create payment callback handler page
  - Display order confirmation after successful payment
  - Handle payment failures with retry option
  - Test complete checkout and payment flow
  - _Requirements: 5.1, 5.2, 5.3, 7.1, 7.2_

- [ ] 9.5 Update order history page to use API
  - Update profile page to call GET /api/orders
  - Display paginated order list
  - Update order detail view to call GET /api/orders/:id
  - Display order status, items, and tracking information
  - Add order status tracking UI
  - Test order history display
  - _Requirements: 7.5_

- [ ] 9.6 Migrate admin panel to use API
  - Update admin authentication to use API
  - Update product management to call admin product endpoints
  - Update product creation form to call POST /api/products
  - Update product edit form to call PUT /api/products/:id
  - Update product delete to call DELETE /api/products/:id
  - Update order management to call GET /api/admin/orders
  - Update order status updates to call PUT /api/orders/:id/status
  - Add image upload handling (URL or file upload)
  - Test all admin operations
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 9.7 Update user profile management
  - Create profile update form
  - Call API to update user profile
  - Display wallet balance from API
  - Display wallet transactions
  - Add password change functionality
  - Test profile updates
  - _Requirements: 3.1, 4.3_


## Phase 8: Testing and Quality Assurance (Week 8-9)

- [ ]* 10. Write backend unit tests
  - Write unit tests for authentication service functions
  - Write unit tests for password hashing and verification
  - Write unit tests for JWT token generation and verification
  - Write unit tests for validation utilities
  - Write unit tests for encryption utilities
  - Write unit tests for email template rendering
  - Target 80% code coverage for backend
  - _Requirements: 3.1, 3.2, 4.2_

- [ ]* 10.1 Write API integration tests
  - Write integration tests for auth endpoints (register, login, logout)
  - Write integration tests for product CRUD endpoints
  - Write integration tests for cart operations
  - Write integration tests for order creation flow
  - Write integration tests for payment initiation
  - Write integration tests for admin endpoints
  - Use test database with fixtures
  - Mock external services (Paytm, email)
  - _Requirements: 3.1, 4.3, 5.1, 6.1, 7.1_

- [ ]* 10.2 Write end-to-end tests
  - Setup Playwright or Cypress for E2E testing
  - Write E2E test for complete purchase flow (browse → cart → checkout → payment)
  - Write E2E test for user registration and login
  - Write E2E test for admin product management
  - Write E2E test for order tracking
  - Test across browsers (Chrome, Firefox, Safari)
  - Test responsive design on mobile viewports
  - _Requirements: 3.1, 5.1, 6.1, 7.1_

- [ ]* 10.3 Perform security testing
  - Test SQL injection prevention on all endpoints
  - Test XSS attack prevention in forms
  - Test CSRF token validation
  - Test rate limiting effectiveness
  - Test JWT token security and expiration
  - Test session hijacking prevention
  - Test file upload validation (if implemented)
  - Test API authorization checks
  - Run automated security scanner (OWASP ZAP)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 9.1_

- [ ]* 10.4 Perform load testing
  - Setup Artillery or k6 for load testing
  - Test API endpoints under 100 concurrent users
  - Test database query performance
  - Test payment flow under load
  - Identify performance bottlenecks
  - Optimize slow queries and endpoints
  - Target < 200ms response time for 95th percentile
  - _Requirements: 4.3, 5.1, 9.1_

- [ ]* 10.5 Manual testing checklist
  - Test all user flows manually on staging
  - Test payment flow with Paytm sandbox
  - Test email delivery for all scenarios
  - Test error handling and user feedback
  - Test mobile responsiveness
  - Test browser compatibility
  - Test accessibility compliance
  - Document any issues found
  - _Requirements: 3.1, 5.1, 8.1_


## Phase 9: Hybrid Deployment (Week 9)

- [ ] 11. Prepare backend for Railway/Render deployment
  - Create railway.json configuration file in backend directory
  - Update package.json with correct start script
  - Ensure all environment variables are documented in .env.example
  - Test backend runs locally with production-like environment
  - Commit and push backend code to GitHub repository
  - _Requirements: 2.1, 3.1, 4.1_

- [ ] 11.1 Deploy backend to Railway (Option A - Recommended)
  - Sign up for Railway account at railway.app
  - Create new project and deploy from GitHub repository
  - Add MySQL database service in Railway dashboard
  - Railway automatically sets DATABASE_URL environment variable
  - Verify backend deployment is successful
  - Get backend URL (e.g., https://your-backend.up.railway.app)
  - _Requirements: 3.1, 4.1_

- [ ] 11.2 Configure Railway environment variables
  - Set NODE_ENV=production
  - Set JWT_SECRET (generate secure 32+ character string)
  - Set JWT_EXPIRES_IN=7d
  - Set ENCRYPTION_KEY (generate secure 32 character string)
  - Set FRONTEND_URL=https://yourdomain.com
  - Set Paytm credentials (PAYTM_MERCHANT_ID, PAYTM_MERCHANT_KEY, PAYTM_WEBSITE)
  - Set SMTP credentials for email (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)
  - Verify all environment variables are set correctly
  - _Requirements: 3.2, 4.2, 5.1, 8.1_

- [ ] 11.3 Run database migrations on Railway
  - Use Railway CLI to run migrations: railway run node migrations/run.js
  - Or configure custom start command: node migrations/run.js && node src/app.js
  - Verify all tables are created correctly
  - Test database connectivity from backend
  - Seed initial data if needed (admin user, sample products)
  - _Requirements: 4.1, 4.2_

- [ ] 11.4 Alternative: Deploy backend to Render (Option B)
  - Sign up for Render account at render.com
  - Create new Web Service from GitHub repository
  - Configure build command: npm install
  - Configure start command: node migrations/run.js && node src/app.js
  - Add PostgreSQL database (note: requires converting MySQL migrations)
  - Set environment variables in Render dashboard
  - Get backend URL (e.g., https://ace1-backend.onrender.com)
  - _Requirements: 3.1, 4.1_

- [ ] 11.5 Test backend API endpoints
  - Test health check endpoint: GET /api/health
  - Test authentication endpoints (register, login, logout)
  - Test product endpoints (list, get single product)
  - Test cart endpoints (add, update, remove items)
  - Test order endpoints (create order, get orders)
  - Verify CORS is configured correctly for your domain
  - Check Railway/Render logs for any errors
  - _Requirements: 3.1, 4.3, 5.1_

- [ ] 11.6 Update frontend configuration for production
  - Create docs/assets/js/config.js with backend API URL
  - Update all frontend JavaScript files to use API_CONFIG.baseURL
  - Update CORS settings in backend to allow your domain
  - Test API calls work from localhost first
  - Verify no hardcoded localhost URLs remain in frontend
  - _Requirements: 3.1, 9.1_

- [ ] 11.7 Deploy frontend to FTP host
  - Prepare FTP upload package with all docs/ files
  - Ensure .htaccess file is included for security headers
  - Upload all files via FTP to your hosting provider
  - Verify all files uploaded successfully
  - Clear browser cache and test website loads
  - Test API calls work from production domain
  - Verify no CORS errors in browser console
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1_

- [ ] 11.8 Configure monitoring and logging
  - Access Railway/Render dashboard for logs and metrics
  - Setup log viewing via CLI (railway logs or render logs)
  - Configure error alerts in Railway/Render dashboard
  - Test health check endpoint is accessible
  - Optional: Setup Sentry for error tracking
  - Optional: Setup UptimeRobot for uptime monitoring
  - _Requirements: 6.4_

- [ ] 11.9 Setup database backups
  - Verify Railway/Render automatic daily backups are enabled
  - Document backup retention policy (7 days on free tier)
  - Create manual backup script using Railway CLI if needed
  - Test database backup and restore process
  - Optional: Setup automated backups to cloud storage (S3, Google Cloud)
  - Document backup and restore procedures
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 11.10 Perform production deployment testing
  - Test complete user registration and login flow
  - Test product browsing and cart operations
  - Test order creation flow (without payment initially)
  - Test admin panel authentication and functionality
  - Test email delivery for all scenarios
  - Monitor Railway/Render logs for any errors
  - Test performance and response times
  - Verify security headers are present (use securityheaders.com)
  - Test on multiple devices and browsers
  - _Requirements: 3.1, 5.1, 6.1, 8.1_

- [ ] 11.11 Setup custom domain for backend (Optional)
  - Purchase or configure subdomain (api.yourdomain.com)
  - Add custom domain in Railway/Render dashboard
  - Update DNS CNAME record to point to Railway/Render URL
  - Wait for DNS propagation (up to 48 hours)
  - Update FRONTEND_URL in backend environment variables
  - Update API_CONFIG.baseURL in frontend configuration
  - Test API calls work with custom domain
  - _Requirements: 2.1, 2.6_

- [ ] 11.12 Create deployment documentation
  - Document Railway/Render deployment process
  - Document all environment variables and their purposes
  - Create troubleshooting guide for common issues
  - Document how to view logs and monitor application
  - Document how to rollback deployment if needed
  - Document how to scale up when traffic grows
  - Create quick reference guide for future deployments
  - _Requirements: 12.5_


## Phase 10: Data Migration and Go-Live (Week 10)

- [ ] 12. Create data migration scripts
  - Create script to export users from localStorage
  - Create script to transform user data for database schema
  - Create script to migrate wallet transactions
  - Create script to migrate product ratings
  - Create script to import products from JSON to database
  - Add data validation in migration scripts
  - Test migration scripts with sample data locally
  - _Requirements: 4.1, 4.2_

- [ ] 12.1 Perform data migration to Railway/Render
  - Backup current localStorage data to JSON files
  - Run user migration script via Railway CLI: railway run node scripts/migrate-users.js
  - Verify user data in Railway/Render database
  - Run product migration script via Railway CLI
  - Verify product data in database
  - Run wallet transaction migration
  - Run ratings migration
  - Verify all data migrated correctly using database queries
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 12.2 Final pre-launch checklist
  - Verify all security headers are active (test with securityheaders.com)
  - Verify HTTPS is enforced on both frontend and backend
  - Verify rate limiting is working (test with multiple rapid requests)
  - Verify email notifications are sending (test all email types)
  - Verify payment flow works end-to-end with Paytm sandbox
  - Verify admin panel is functional and secure
  - Verify Railway/Render backups are enabled
  - Verify monitoring and logging are active
  - Review all environment variables are set correctly
  - Test on multiple devices (desktop, mobile, tablet)
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 5.1, 8.1, 12.1_

- [ ] 12.3 Go-live deployment
  - Schedule maintenance window (if needed)
  - Notify users of upcoming changes (if applicable)
  - Create final backup of current localStorage data
  - Verify backend is deployed and running on Railway/Render
  - Verify database migrations are complete
  - Deploy updated frontend to FTP host
  - Update DNS if using custom domain for backend
  - Monitor Railway/Render logs closely for first hour
  - Test critical paths immediately after deployment
  - Verify API calls work from production domain
  - _Requirements: 3.1, 4.1_

- [ ] 12.4 Post-launch monitoring
  - Monitor Railway/Render application logs for errors
  - Monitor Railway/Render metrics (CPU, memory, response times)
  - Monitor database performance and connection pool
  - Monitor payment success rate (if payments are live)
  - Monitor email delivery rate
  - Check user feedback and support requests
  - Monitor for 24-48 hours continuously
  - Document any issues and resolutions
  - _Requirements: 5.1, 8.1_

- [ ] 12.5 Post-launch optimization
  - Analyze Railway/Render performance metrics
  - Optimize slow database queries identified in logs
  - Adjust rate limits if needed based on actual traffic
  - Fine-tune caching strategies
  - Address any user-reported issues
  - Update documentation based on learnings
  - Plan for scaling (upgrade to paid tier if needed)
  - Document lessons learned and best practices
  - Plan for future enhancements
  - _Requirements: 4.3, 9.1_

- [ ] 12.6 Cost optimization and scaling plan
  - Monitor Railway/Render usage hours (free tier: 500-750 hours/month)
  - Calculate actual monthly costs based on usage
  - Plan upgrade path if approaching free tier limits
  - Document when to upgrade to paid tier ($5-7/month)
  - Setup billing alerts in Railway/Render dashboard
  - Plan for adding Redis if session performance becomes an issue
  - Document scaling strategy for future growth
  - _Requirements: 4.1, 9.1_


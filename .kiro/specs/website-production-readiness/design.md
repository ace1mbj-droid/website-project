# Design Document

## Overview

This design transforms the Ace#1 Health & Wellness website from a client-side demo application into a production-ready, full-stack e-commerce platform. The architecture follows a three-tier model with a React/vanilla JavaScript frontend, Node.js/Express backend API, and MySQL database. The system prioritizes security, scalability, and maintainability while preserving the existing UI/UX design.

### Key Design Principles

1. **Security First**: All authentication and sensitive operations move to the server
2. **Backward Compatibility**: Existing frontend code is refactored, not rewritten
3. **Progressive Enhancement**: Features are added incrementally without breaking existing functionality
4. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
5. **API-Driven**: RESTful API design enables future mobile app development

### Technology Stack

**Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
**Backend**: Node.js 18+, Express.js 4.x
**Database**: MySQL 8.0 or PostgreSQL 14+
**Authentication**: JWT (JSON Web Tokens) with httpOnly cookies
**Payment**: Paytm Business API
**Email**: Nodemailer with SMTP
**Deployment**: PM2 process manager, Nginx reverse proxy


## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Browser    │  │   Mobile     │  │   Tablet     │         │
│  │  (Desktop)   │  │   Browser    │  │   Browser    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Nginx Reverse Proxy                        │
│              (SSL Termination, Load Balancing)                  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer (Node.js)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express.js Server                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Auth     │  │  Products  │  │   Orders   │         │  │
│  │  │   Routes   │  │   Routes   │  │   Routes   │         │  │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘         │  │
│  │        │                │                │                │  │
│  │  ┌─────┴────────────────┴────────────────┴──────┐        │  │
│  │  │          Middleware Layer                     │        │  │
│  │  │  • JWT Verification                           │        │  │
│  │  │  • Rate Limiting                              │        │  │
│  │  │  • Input Validation                           │        │  │
│  │  │  • Error Handling                             │        │  │
│  │  └───────────────────┬───────────────────────────┘        │  │
│  └──────────────────────┼────────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    MySQL     │  │    Redis     │  │  File System │         │
│  │   Database   │  │    Cache     │  │   (Images)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Paytm     │  │    SMTP      │  │   Backup     │         │
│  │   Payment    │  │    Email     │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

**User Authentication Flow:**
1. User submits credentials → Frontend validates format
2. Frontend sends POST /api/auth/login → Backend API
3. Backend validates credentials → Queries database
4. Backend generates JWT token → Sets httpOnly cookie
5. Backend returns user data (without password)
6. Frontend stores user session → Updates UI

**Product Purchase Flow:**
1. User adds to cart → Frontend updates cart state
2. User proceeds to checkout → Frontend validates cart
3. Frontend sends POST /api/orders/create → Backend API
4. Backend creates order → Generates Paytm payment request
5. Backend returns payment URL → Frontend redirects to Paytm
6. Paytm processes payment → Sends callback to backend
7. Backend verifies checksum → Updates order status
8. Backend sends email confirmation → Returns to frontend
9. Frontend displays order confirmation


## Components and Interfaces

### Backend API Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection configuration
│   │   ├── jwt.js               # JWT secret and options
│   │   ├── paytm.js             # Paytm API credentials
│   │   └── email.js             # SMTP configuration
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   ├── rateLimit.js         # Rate limiting middleware
│   │   ├── validation.js        # Input validation middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User model and queries
│   │   ├── Product.js           # Product model and queries
│   │   ├── Order.js             # Order model and queries
│   │   ├── Cart.js              # Cart model and queries
│   │   └── Session.js           # Session model and queries
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── products.js          # Product CRUD endpoints
│   │   ├── orders.js            # Order management endpoints
│   │   ├── cart.js              # Cart operations endpoints
│   │   ├── admin.js             # Admin panel endpoints
│   │   └── payment.js           # Payment processing endpoints
│   ├── services/
│   │   ├── authService.js       # Authentication business logic
│   │   ├── paymentService.js    # Payment processing logic
│   │   ├── emailService.js      # Email sending logic
│   │   └── inventoryService.js  # Inventory management logic
│   ├── utils/
│   │   ├── encryption.js        # Encryption utilities
│   │   ├── validation.js        # Validation helpers
│   │   └── logger.js            # Logging utility
│   └── app.js                   # Express app setup
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_products.sql
│   ├── 003_create_orders.sql
│   └── 004_create_sessions.sql
└── package.json
```

### API Endpoints

#### Authentication Endpoints

```javascript
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### Product Endpoints

```javascript
GET    /api/products              # List all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
GET    /api/products/:id/ratings  # Get product ratings
POST   /api/products/:id/ratings  # Add product rating
```

#### Order Endpoints

```javascript
GET    /api/orders                # Get user orders
GET    /api/orders/:id            # Get single order
POST   /api/orders                # Create new order
PUT    /api/orders/:id/status     # Update order status (admin)
GET    /api/admin/orders          # Get all orders (admin)
```

#### Cart Endpoints

```javascript
GET    /api/cart                  # Get user cart
POST   /api/cart/items            # Add item to cart
PUT    /api/cart/items/:id        # Update cart item
DELETE /api/cart/items/:id        # Remove cart item
DELETE /api/cart                  # Clear cart
```

#### Payment Endpoints

```javascript
POST   /api/payment/initiate      # Initiate Paytm payment
POST   /api/payment/callback      # Paytm callback handler
GET    /api/payment/status/:id    # Check payment status
```


## Data Models

### Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

#### Products Table

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);
```

#### Orders Table

```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  tracking_number VARCHAR(100),
  paytm_transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (order_status),
  INDEX idx_payment_status (payment_status)
);
```

#### Order Items Table

```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);
```

#### Cart Table

```sql
CREATE TABLE cart_items (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user (user_id)
);
```

#### Sessions Table

```sql
CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_token (token_hash),
  INDEX idx_expires (expires_at)
);
```

#### Ratings Table

```sql
CREATE TABLE ratings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product_rating (user_id, product_id),
  INDEX idx_product (product_id),
  INDEX idx_rating (rating)
);
```

#### Wallet Transactions Table

```sql
CREATE TABLE wallet_transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  transaction_type ENUM('credit', 'debit') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  balance_after DECIMAL(10, 2) NOT NULL,
  reference_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (transaction_type),
  INDEX idx_created (created_at)
);
```

#### Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
);
```


## Error Handling

### Error Response Format

All API errors follow a consistent JSON structure:

```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional context
  },
  "timestamp": "2025-11-10T12:00:00Z"
}
```

### Error Codes and HTTP Status Mapping

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

### Error Handling Strategy

**Frontend Error Handling:**
- Display user-friendly error messages
- Log errors to console for debugging
- Retry failed requests with exponential backoff
- Fallback to cached data when possible

**Backend Error Handling:**
- Catch all unhandled exceptions
- Log errors with stack traces
- Return appropriate HTTP status codes
- Never expose sensitive information in errors
- Implement circuit breakers for external services

### Security Error Handling

**Authentication Errors:**
- Generic "Invalid credentials" message (don't reveal if email exists)
- Rate limit login attempts per IP and email
- Lock accounts after 5 failed attempts
- Log all authentication failures for security monitoring

**Authorization Errors:**
- Return 403 Forbidden for insufficient permissions
- Log unauthorized access attempts
- Don't reveal resource existence to unauthorized users


## Testing Strategy

### Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E Tests │  (10%)
                    │  Playwright │
                    └─────────────┘
                  ┌───────────────────┐
                  │ Integration Tests │  (30%)
                  │   Supertest API   │
                  └───────────────────┘
              ┌─────────────────────────────┐
              │       Unit Tests            │  (60%)
              │  Jest + Testing Library     │
              └─────────────────────────────┘
```

### Unit Testing

**Backend Unit Tests (Jest):**
- Test individual functions and methods
- Mock database calls and external services
- Test validation logic
- Test encryption/decryption utilities
- Target: 80% code coverage

**Frontend Unit Tests (Jest + Testing Library):**
- Test utility functions
- Test form validation
- Test data transformations
- Target: 70% code coverage

### Integration Testing

**API Integration Tests (Supertest):**
- Test complete API endpoints
- Test authentication flow
- Test database transactions
- Test error handling
- Use test database with fixtures

**Test Scenarios:**
1. User registration and login flow
2. Product CRUD operations
3. Order creation and payment flow
4. Cart operations
5. Admin panel operations
6. Rate limiting behavior
7. Session management

### End-to-End Testing

**E2E Tests (Playwright):**
- Test critical user journeys
- Test across browsers (Chrome, Firefox, Safari)
- Test responsive design
- Test payment flow (using Paytm sandbox)

**Critical Paths:**
1. Complete purchase flow (browse → cart → checkout → payment)
2. User registration and profile management
3. Admin product management
4. Order tracking and status updates

### Security Testing

**Security Test Checklist:**
- [ ] SQL injection prevention
- [ ] XSS attack prevention
- [ ] CSRF token validation
- [ ] Rate limiting effectiveness
- [ ] JWT token security
- [ ] Password hashing strength
- [ ] Session hijacking prevention
- [ ] File upload validation
- [ ] API authorization checks

### Performance Testing

**Load Testing (Artillery or k6):**
- Test API endpoints under load
- Simulate 100 concurrent users
- Test database query performance
- Identify bottlenecks
- Target: < 200ms response time for 95th percentile

### Testing Environment

**Test Database:**
- Separate test database instance
- Automated migrations before tests
- Seed data for consistent tests
- Cleanup after each test suite

**CI/CD Pipeline:**
- Run tests on every commit
- Block merge if tests fail
- Generate coverage reports
- Deploy to staging after tests pass


## Security Implementation Details

### Authentication Flow

**JWT Token Structure:**
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_123",
    "email": "user@example.com",
    "role": "customer",
    "iat": 1699632000,
    "exp": 1699718400
  }
}
```

**Token Storage:**
- Access token: httpOnly cookie (24 hour expiry)
- Refresh token: httpOnly cookie (7 day expiry)
- Never store tokens in localStorage or sessionStorage

**Password Security:**
- Use bcrypt with 12 salt rounds
- Minimum password length: 8 characters
- Require mix of uppercase, lowercase, numbers
- Check against common password lists
- Hash passwords before database storage

### Rate Limiting Configuration

```javascript
// Login endpoint: 5 attempts per 15 minutes
{
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts"
}

// API endpoints: 100 requests per 15 minutes
{
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Rate limit exceeded"
}

// Admin endpoints: 50 requests per 15 minutes
{
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Admin rate limit exceeded"
}
```

### Security Headers Configuration

```javascript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Input Validation

**Validation Rules:**
- Email: RFC 5322 compliant format
- Phone: 10 digits, Indian format
- Password: 8-50 characters, complexity requirements
- Product price: Positive decimal, max 2 decimal places
- Quantity: Positive integer, max 999
- Text fields: Sanitize HTML, max length limits

**Validation Library:**
- Use Joi for schema validation
- Validate all inputs on backend
- Return detailed validation errors
- Never trust client-side validation alone

### Data Encryption

**Sensitive Data Encryption:**
- Payment information: AES-256-GCM
- Personal data: AES-256-GCM
- Encryption keys: Stored in environment variables
- Key rotation: Every 90 days

**Database Encryption:**
- Encrypt sensitive columns at application level
- Use database encryption at rest
- Secure backup encryption

### Session Management

**Session Security:**
- Generate cryptographically random session IDs
- Store session hash in database
- Validate session on every request
- Implement session timeout (30 minutes inactivity)
- Invalidate sessions on logout
- Limit concurrent sessions per user (max 3)

### HTTPS Configuration

**Nginx SSL Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name ace1.in www.ace1.in;
    
    ssl_certificate /etc/letsencrypt/live/ace1.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ace1.in/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name ace1.in www.ace1.in;
    return 301 https://$server_name$request_uri;
}
```


## Payment Integration Design

### Paytm Payment Flow

```
┌──────────┐                                    ┌──────────┐
│          │  1. Initiate Payment               │          │
│  Client  │──────────────────────────────────>│  Backend │
│          │                                    │          │
└──────────┘                                    └────┬─────┘
                                                     │
                                                     │ 2. Generate
                                                     │    Transaction
                                                     │
                                                ┌────▼─────┐
                                                │ Database │
                                                └────┬─────┘
                                                     │
┌──────────┐                                    ┌────▼─────┐
│          │  3. Redirect to Paytm              │          │
│  Client  │<───────────────────────────────────│  Backend │
│          │                                    │          │
└────┬─────┘                                    └──────────┘
     │
     │ 4. Complete Payment
     │
┌────▼─────┐
│  Paytm   │
│  Gateway │
└────┬─────┘
     │
     │ 5. Callback with Status
     │
┌────▼─────┐                                    ┌──────────┐
│          │  6. Verify Checksum                │          │
│  Backend │<───────────────────────────────────│  Paytm   │
│          │                                    │          │
└────┬─────┘                                    └──────────┘
     │
     │ 7. Update Order Status
     │
┌────▼─────┐
│ Database │
└────┬─────┘
     │
     │ 8. Send Confirmation Email
     │
┌────▼─────┐                                    ┌──────────┐
│          │  9. Redirect to Success Page       │          │
│  Backend │──────────────────────────────────>│  Client  │
│          │                                    │          │
└──────────┘                                    └──────────┘
```

### Paytm Integration Configuration

**Environment Variables:**
```bash
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBSTAGING  # or WEBPROD for production
PAYTM_INDUSTRY_TYPE=Retail
PAYTM_CHANNEL_ID=WEB
PAYTM_CALLBACK_URL=https://ace1.in/api/payment/callback
```

**Payment Request Structure:**
```javascript
{
  "MID": "MERCHANT_ID",
  "WEBSITE": "WEBSTAGING",
  "INDUSTRY_TYPE_ID": "Retail",
  "CHANNEL_ID": "WEB",
  "ORDER_ID": "ORDER_123456",
  "CUST_ID": "CUST_001",
  "TXN_AMOUNT": "9999.00",
  "CALLBACK_URL": "https://ace1.in/api/payment/callback",
  "EMAIL": "customer@example.com",
  "MOBILE_NO": "9876543210"
}
```

**Checksum Verification:**
- Generate checksum using Paytm SDK
- Verify checksum on callback
- Reject requests with invalid checksums
- Log all verification attempts

### Payment Status Handling

**Status Mapping:**
| Paytm Status | Order Status | Action |
|--------------|--------------|--------|
| `TXN_SUCCESS` | `paid` | Confirm order, send email |
| `TXN_FAILURE` | `failed` | Allow retry, notify user |
| `PENDING` | `pending` | Wait for confirmation |
| `OPEN` | `pending` | Payment initiated |

**Webhook Security:**
- Verify Paytm IP whitelist
- Validate checksum on every callback
- Implement idempotency (handle duplicate callbacks)
- Log all webhook requests

### Payment Error Handling

**Common Errors:**
1. **Insufficient Balance**: Display friendly message, suggest alternatives
2. **Bank Timeout**: Retry mechanism, check status API
3. **Invalid Card**: Validation before submission
4. **Network Error**: Retry with exponential backoff
5. **Checksum Mismatch**: Log security alert, reject transaction

**Retry Logic:**
- Allow 3 payment attempts per order
- Exponential backoff: 1s, 2s, 4s
- Clear error messages for each failure type
- Option to change payment method


## Email Notification System

### Email Service Configuration

**SMTP Provider Options:**
1. **SendGrid** (Recommended for production)
   - 100 emails/day free tier
   - Reliable delivery
   - Email analytics

2. **Gmail SMTP** (Development/Testing)
   - Free for low volume
   - Easy setup
   - 500 emails/day limit

3. **AWS SES** (Scalable production)
   - Pay per email
   - High deliverability
   - Requires domain verification

**Nodemailer Configuration:**
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
```

### Email Templates

**1. Welcome Email (Registration)**
```
Subject: Welcome to Ace#1 Health & Wellness!

Hi [First Name],

Welcome to Ace#1! Your account has been created successfully.

Email: [Email]
Account ID: [User ID]

Start shopping: https://ace1.in/products

Best regards,
Ace#1 Team
```

**2. Order Confirmation Email**
```
Subject: Order Confirmation - #[Order Number]

Hi [First Name],

Thank you for your order!

Order Details:
- Order Number: [Order Number]
- Total Amount: ₹[Amount]
- Payment Method: [Method]
- Status: Confirmed

Items:
[Product List]

Shipping Address:
[Address]

Track your order: https://ace1.in/orders/[Order ID]

Best regards,
Ace#1 Team
```

**3. Order Shipped Email**
```
Subject: Your Order Has Been Shipped - #[Order Number]

Hi [First Name],

Great news! Your order has been shipped.

Tracking Number: [Tracking Number]
Estimated Delivery: [Date]

Track shipment: [Tracking URL]

Best regards,
Ace#1 Team
```

**4. Password Reset Email**
```
Subject: Reset Your Password - Ace#1

Hi [First Name],

We received a request to reset your password.

Reset your password: [Reset Link]

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Ace#1 Team
```

### Email Queue System

**Queue Implementation (Bull + Redis):**
```javascript
const emailQueue = new Queue('emails', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Add email to queue
emailQueue.add('send-email', {
  to: 'customer@example.com',
  template: 'order-confirmation',
  data: { orderNumber, items, total }
}, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});
```

**Benefits:**
- Asynchronous email sending
- Automatic retries on failure
- Rate limiting to avoid SMTP limits
- Email delivery tracking

### Email Delivery Monitoring

**Metrics to Track:**
- Delivery rate
- Bounce rate
- Open rate (if tracking enabled)
- Failed deliveries
- Queue length

**Alerting:**
- Alert if delivery rate < 95%
- Alert if queue length > 100
- Alert on SMTP authentication failures


## Deployment Architecture

### Hybrid Deployment Model

The system uses a **hybrid deployment architecture** that separates frontend and backend hosting:

**Frontend Hosting (Existing FTP Host):**
- Static HTML, CSS, JavaScript files
- Served from your existing domain (ace1.in)
- No server-side processing required
- Uses existing hosting infrastructure

**Backend Hosting (Railway or Render):**
- Node.js + Express API server
- MySQL database (managed service)
- Redis for sessions (optional)
- Automatic scaling and monitoring
- Free tier available for starting

**Benefits:**
- **Cost-Effective**: Use existing FTP hosting + free backend tier = $0/month to start
- **Simple Deployment**: No server management, automatic deployments
- **Scalable**: Easy to upgrade when traffic grows
- **Reliable**: Managed infrastructure with automatic backups
- **Fast Setup**: Deploy in hours, not days

### Infrastructure Components

**Frontend (FTP Host):**
- Domain: ace1.in (your existing domain)
- Static file hosting
- HTTPS via existing SSL certificate
- .htaccess for security headers

**Backend (Railway/Render):**
- Platform: Railway.app (recommended) or Render.com
- Runtime: Node.js 18 LTS
- Database: MySQL 8.0 (Railway) or PostgreSQL 14 (Render)
- Redis: Optional, for session storage
- URL: Provided by platform (e.g., your-app.up.railway.app)
- Custom domain: Optional (api.ace1.in)

### Deployment Process

#### Option 1: Railway Deployment (Recommended)

**1. Prepare Backend:**
```bash
# Ensure railway.json exists in backend/
cd backend
cat railway.json
```

**2. Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy backend
railway up

# Add MySQL database
# (Done via Railway dashboard: New → Database → MySQL)

# Run migrations
railway run node migrations/run.js
```

**3. Configure Environment Variables:**
In Railway dashboard → Variables:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_random_string_min_32_chars
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your_32_character_encryption_key
FRONTEND_URL=https://ace1.in
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

**4. Get Backend URL:**
Railway provides: `https://your-backend-production.up.railway.app`

#### Option 2: Render Deployment (Alternative)

**1. Create Web Service:**
- Go to render.com → New → Web Service
- Connect GitHub repository
- Configure:
  - Name: ace1-backend
  - Environment: Node
  - Build Command: `npm install`
  - Start Command: `node migrations/run.js && node src/app.js`
  - Plan: Free

**2. Add Database:**
- Dashboard → New → PostgreSQL (or MySQL add-on)
- Render auto-connects to web service

**3. Set Environment Variables:**
Same as Railway configuration above

**4. Get Backend URL:**
Render provides: `https://ace1-backend.onrender.com`

#### Frontend Deployment (FTP)

**1. Update API Configuration:**
```javascript
// docs/assets/js/config.js
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

**2. Update CORS in Backend:**
```javascript
// backend/src/app.js
app.use(cors({
  origin: [
    'https://ace1.in',
    'http://ace1.in',
    'https://www.ace1.in'
  ],
  credentials: true
}));
```

**3. Upload via FTP:**
- Upload updated JavaScript files
- Upload .htaccess with security headers
- Test frontend loads correctly

### PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ace1-api',
    script: './dist/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
```

### Environment Variables

**Railway/Render Configuration:**

```bash
# .env (Set in Railway/Render dashboard)
NODE_ENV=production
PORT=3000

# Database (Railway auto-sets DATABASE_URL)
# If using separate variables:
DB_HOST=provided_by_railway
DB_PORT=3306
DB_NAME=railway
DB_USER=provided_by_railway
DB_PASSWORD=provided_by_railway

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# Paytm
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBSITE=WEBPROD
PAYTM_CALLBACK_URL=https://yourdomain.com/api/payment/callback

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@yourdomain.com

# Redis (Optional - Railway auto-sets if added)
REDIS_URL=provided_by_railway

# Security
ENCRYPTION_KEY=your_32_character_encryption_key_here
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

**Frontend Configuration:**

```javascript
// docs/assets/js/config.js
const API_CONFIG = {
  baseURL: 'https://your-backend-url.railway.app/api',
  timeout: 10000
};
```

### Backup Strategy

**Managed Database Backups:**
- Railway/Render provide automatic daily backups
- Point-in-time recovery available
- Backups retained for 7 days (free tier)
- Upgrade to paid tier for longer retention

**Manual Backup Options:**
```bash
# Railway CLI backup
railway run mysqldump -u root railway > backup_$(date +%Y%m%d).sql

# Download and compress
gzip backup_$(date +%Y%m%d).sql
```

**Backup to Cloud Storage:**
- Use AWS S3 or Google Cloud Storage for long-term backups
- Encrypt backups before upload
- Implement 3-2-1 backup rule
- Test restore process monthly

### Monitoring and Logging

**Platform Monitoring:**
- Railway/Render provide built-in monitoring dashboards
- View logs in real-time via web interface
- CPU, memory, and network metrics
- Automatic alerts for crashes

**Application Monitoring:**
- Custom health check endpoint
- Error tracking (optional: Sentry)
- Performance monitoring (optional: New Relic)

**Log Management:**
- Railway/Render capture all console output
- View logs via dashboard or CLI
- Search and filter logs
- Download logs for analysis

**Health Check Endpoint:**
```javascript
GET /api/health
Response:
{
  "status": "healthy",
  "timestamp": "2025-11-10T12:00:00Z",
  "uptime": 86400,
  "database": "connected",
  "redis": "connected"
}
```

**Railway CLI Commands:**
```bash
# View logs
railway logs

# View logs with follow
railway logs --follow

# View specific service logs
railway logs --service backend
```

### Scaling Considerations

**Horizontal Scaling:**
- Railway/Render handle scaling automatically
- Upgrade to paid tier for more resources
- Session storage in Redis (not memory)
- Stateless API design

**Database Scaling:**
- Connection pooling (built-in)
- Query optimization
- Caching frequently accessed data
- Upgrade to larger database plan when needed

**CDN Integration:**
- Serve static assets via CDN (Cloudflare free tier)
- Cache product images
- Reduce server load
- Improve global performance

**Cost Scaling Path:**
- **Start**: Free tier ($0/month)
- **Growing**: Railway Hobby ($5/month) or Render Starter ($7/month)
- **Production**: Railway Pro ($20/month) or Render Standard ($25/month)
- **Enterprise**: Custom plans with dedicated resources


## Migration Strategy

### Phase 1: Security Remediation (Week 1)

**Immediate Actions:**
1. Remove credentials from GitHub
2. Update .gitignore
3. Change admin password
4. Add security headers to .htaccess
5. Force HTTPS redirect

**No Code Changes Required:**
- Update configuration files only
- Test existing functionality
- Deploy security fixes

### Phase 2: Backend Setup (Week 2-3)

**Infrastructure:**
1. Setup MySQL database
2. Setup Redis for sessions
3. Configure Nginx reverse proxy
4. Setup SSL certificate
5. Configure PM2

**Backend Development:**
1. Create Express.js application
2. Implement database models
3. Create authentication endpoints
4. Implement JWT middleware
5. Setup rate limiting

**Testing:**
- Unit tests for models
- Integration tests for auth endpoints
- Security testing

### Phase 3: API Development (Week 4-5)

**API Implementation:**
1. Product endpoints
2. Cart endpoints
3. Order endpoints
4. Payment integration
5. Admin endpoints

**Testing:**
- API integration tests
- Payment flow testing (sandbox)
- Load testing

### Phase 4: Frontend Migration (Week 6-7)

**Frontend Refactoring:**
1. Update auth.js to use API
2. Update cart.js to use API
3. Update product pages
4. Update checkout flow
5. Update admin panel

**Backward Compatibility:**
- Keep localStorage as fallback
- Graceful degradation
- Progressive enhancement

**Testing:**
- E2E tests for critical paths
- Cross-browser testing
- Mobile responsiveness

### Phase 5: Email & Notifications (Week 8)

**Email System:**
1. Setup SMTP provider
2. Create email templates
3. Implement email queue
4. Test email delivery

**Notifications:**
- Order confirmations
- Shipping updates
- Password resets

### Phase 6: Production Deployment (Week 9)

**Pre-Deployment:**
1. Final security audit
2. Performance testing
3. Backup current system
4. Prepare rollback plan

**Deployment:**
1. Deploy backend to production
2. Run database migrations
3. Deploy frontend changes
4. Configure DNS
5. Enable monitoring

**Post-Deployment:**
1. Monitor error logs
2. Check payment flow
3. Verify email delivery
4. Performance monitoring

### Data Migration

**User Data Migration:**
```javascript
// Migration script: migrate-users.js
const migrateUsers = async () => {
  // 1. Read from localStorage backup
  const users = JSON.parse(localStorage.getItem('ace1_users'));
  
  // 2. Transform data
  const transformedUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    password_hash: user.password, // Already hashed
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    role: user.role || 'customer',
    wallet_balance: user.wallet?.balance || 0,
    created_at: user.createdAt
  }));
  
  // 3. Insert into database
  await db.users.bulkCreate(transformedUsers);
  
  // 4. Migrate wallet transactions
  for (const user of users) {
    if (user.wallet?.transactions) {
      await migrateWalletTransactions(user.id, user.wallet.transactions);
    }
  }
  
  // 5. Migrate ratings
  for (const user of users) {
    if (user.ratings) {
      await migrateRatings(user.id, user.ratings);
    }
  }
};
```

**Product Data Migration:**
```javascript
// Products are already in JSON file
// Load and insert into database
const migrateProducts = async () => {
  const products = require('./assets/data/products.json');
  await db.products.bulkCreate(products);
};
```

### Rollback Plan

**If Issues Occur:**
1. Revert Nginx config to serve static files
2. Restore database from backup
3. Rollback code deployment
4. Notify users of maintenance
5. Investigate and fix issues
6. Redeploy when ready

**Rollback Script:**
```bash
#!/bin/bash
# rollback.sh

# Stop new backend
pm2 stop ace1-api

# Restore Nginx config
sudo cp /etc/nginx/sites-available/ace1.backup /etc/nginx/sites-available/ace1
sudo systemctl reload nginx

# Restore database
mysql -u ace1_user -p ace1_production < /var/backups/mysql/pre_migration.sql

echo "Rollback complete. System restored to previous state."
```

### Success Criteria

**Phase 1 Success:**
- [ ] No credentials in GitHub
- [ ] HTTPS enforced
- [ ] Security headers active
- [ ] No broken functionality

**Phase 2 Success:**
- [ ] Backend API running
- [ ] Database connected
- [ ] Authentication working
- [ ] All tests passing

**Phase 3 Success:**
- [ ] All API endpoints functional
- [ ] Payment integration tested
- [ ] Load tests passed
- [ ] API documentation complete

**Phase 4 Success:**
- [ ] Frontend using API
- [ ] No localStorage dependencies
- [ ] All pages functional
- [ ] E2E tests passing

**Phase 5 Success:**
- [ ] Emails sending reliably
- [ ] All templates working
- [ ] Queue processing correctly
- [ ] Delivery rate > 95%

**Phase 6 Success:**
- [ ] Production deployment stable
- [ ] No critical errors
- [ ] Performance targets met
- [ ] Monitoring active
- [ ] Backup system working


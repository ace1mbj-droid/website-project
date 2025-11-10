# Database Models Guide

Complete guide to using the Ace#1 backend database models.

## Overview

The models provide a clean, object-oriented interface to interact with the database. Each model corresponds to a database table and provides CRUD operations plus business logic.

## Available Models

```javascript
const {
  User,
  Product,
  Order,
  Cart,
  Session,
  Rating,
  WalletTransaction,
  AuditLog,
} = require('./models');
```

---

## User Model

Handles user accounts, authentication, and profile management.

### Create User

```javascript
const user = await User.create({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '9876543210',
  role: 'customer', // or 'admin'
});
```

### Find User

```javascript
// By ID
const user = await User.findById(userId);

// By email
const user = await User.findByEmail('user@example.com');

// By email with password (for authentication)
const user = await User.findByEmailWithPassword('user@example.com');
```

### Verify Password

```javascript
const isValid = await User.verifyPassword(plainPassword, user.password_hash);
```

### Update User

```javascript
const updated = await User.update(userId, {
  firstName: 'Jane',
  phone: '9876543211',
});
```

### Update Password

```javascript
await User.updatePassword(userId, 'NewSecurePassword123!');
```

### Wallet Operations

```javascript
// Update wallet balance
const result = await User.updateWalletBalance(userId, 100); // Add ₹100
const result = await User.updateWalletBalance(userId, -50); // Subtract ₹50
```

### List Users (Admin)

```javascript
const users = await User.findAll({
  limit: 50,
  offset: 0,
  role: 'customer',
  isActive: true,
});

const count = await User.count({ role: 'customer' });
```

---

## Product Model

Handles product catalog management.

### Create Product

```javascript
const product = await Product.create({
  name: 'Protein Powder',
  description: 'High-quality whey protein',
  price: 2999.99,
  imageUrl: '/images/protein.jpg',
  category: 'Supplements',
  stockQuantity: 100,
});
```

### Find Products

```javascript
// By ID (includes average rating)
const product = await Product.findById(productId);

// List all with filters
const products = await Product.findAll({
  limit: 50,
  offset: 0,
  category: 'Supplements',
  minPrice: 1000,
  maxPrice: 5000,
  inStock: true,
  sortBy: 'price', // or 'name', 'created_at', 'stock_quantity'
  sortOrder: 'ASC', // or 'DESC'
});

// Search
const products = await Product.search('protein', { limit: 20 });
```

### Update Product

```javascript
const updated = await Product.update(productId, {
  price: 2799.99,
  stockQuantity: 150,
});
```

### Stock Management

```javascript
// Update stock
await Product.updateStock(productId, 200);

// Decrement stock (for orders)
await Product.decrementStock(productId, 5);

// Increment stock (for cancellations)
await Product.incrementStock(productId, 3);

// Check stock availability
const hasStock = await Product.hasStock(productId, 10);
```

### Categories

```javascript
const categories = await Product.getCategories();
// Returns: ['Supplements', 'Vitamins', 'Equipment', ...]
```

---

## Order Model

Handles order creation and management.

### Create Order

```javascript
const order = await Order.create(
  {
    userId: 'user-123',
    totalAmount: 5999.98,
    paymentMethod: 'paytm',
    shippingAddress: '123 Main St, City, State 123456',
  },
  [
    {
      productId: 'prod-1',
      productName: 'Protein Powder',
      quantity: 2,
      price: 2999.99,
    },
  ]
);
```

**Note:** This automatically:
- Generates unique order number
- Creates order items
- Decrements product stock
- Uses database transaction (atomic)

### Find Orders

```javascript
// By ID
const order = await Order.findById(orderId);

// By order number
const order = await Order.findByOrderNumber('ACE1234567890');

// By user
const orders = await Order.findByUserId(userId, {
  limit: 50,
  offset: 0,
  status: 'delivered',
});

// All orders (admin)
const orders = await Order.findAll({
  limit: 50,
  status: 'pending',
  paymentStatus: 'paid',
});
```

### Update Order

```javascript
// Update status
await Order.updateStatus(orderId, 'shipped');

// Update payment status
await Order.updatePaymentStatus(orderId, 'paid', 'PAYTM123456');

// Update tracking
await Order.updateTracking(orderId, 'TRACK123456');

// Cancel order (restores stock)
await Order.cancel(orderId);
```

### Order Statistics

```javascript
const stats = await Order.getStats(userId); // or null for all users

// Returns:
// {
//   totalOrders: 150,
//   totalRevenue: 299999.50,
//   averageOrderValue: 1999.99,
//   pendingOrders: 5,
//   deliveredOrders: 140
// }
```

---

## Cart Model

Handles shopping cart operations.

### Get Cart

```javascript
const cart = await Cart.getCart(userId);

// Returns:
// {
//   userId: 'user-123',
//   items: [...],
//   itemCount: 3,
//   total: 8999.97
// }
```

### Add to Cart

```javascript
const cart = await Cart.addItem(userId, productId, 2);
```

**Note:** Automatically:
- Checks stock availability
- Merges with existing cart item if present
- Validates product is active

### Update Quantity

```javascript
const cart = await Cart.updateQuantity(userId, cartItemId, 5);
```

### Remove Item

```javascript
const cart = await Cart.removeItem(userId, cartItemId);
```

### Clear Cart

```javascript
const cart = await Cart.clearCart(userId);
```

### Validate Cart

```javascript
const validation = await Cart.validateCart(userId);

// Returns:
// {
//   valid: false,
//   errors: [
//     {
//       productId: 'prod-1',
//       productName: 'Protein Powder',
//       error: 'Only 5 items available'
//     }
//   ],
//   cart: {...}
// }
```

---

## Session Model

Handles user session management for JWT tokens.

### Create Session

```javascript
const session = await Session.create({
  userId: 'user-123',
  token: 'jwt-token-here',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  expiresIn: 86400, // 24 hours in seconds
});
```

### Find Session

```javascript
// By token
const session = await Session.findByToken('jwt-token');

// By user
const sessions = await Session.findByUserId(userId);
```

### Update Session

```javascript
// Extend expiration
await Session.updateExpiration(sessionId, 86400);
```

### Delete Session (Logout)

```javascript
// By ID
await Session.delete(sessionId);

// By token
await Session.deleteByToken('jwt-token');

// All user sessions
await Session.deleteByUserId(userId);
```

### Session Validation

```javascript
const isValid = await Session.isValid('jwt-token');
```

### Cleanup

```javascript
// Delete expired sessions
const deletedCount = await Session.deleteExpired();

// Limit concurrent sessions
await Session.limitSessions(userId, 3); // Keep only 3 most recent
```

---

## Rating Model

Handles product ratings and reviews.

### Create/Update Rating

```javascript
const rating = await Rating.createOrUpdate({
  userId: 'user-123',
  productId: 'prod-1',
  rating: 5, // 1-5 stars
  reviewText: 'Excellent product!',
});
```

**Note:** Automatically updates if user already rated the product.

### Find Ratings

```javascript
// By product
const ratings = await Rating.findByProductId(productId, {
  limit: 50,
  minRating: 4,
  verified: true,
});

// By user
const ratings = await Rating.findByUserId(userId);

// Specific rating
const rating = await Rating.findByUserAndProduct(userId, productId);
```

### Update Rating

```javascript
const updated = await Rating.update(ratingId, {
  rating: 4,
  reviewText: 'Updated review',
});
```

### Product Statistics

```javascript
const stats = await Rating.getProductStats(productId);

// Returns:
// {
//   averageRating: 4.5,
//   totalRatings: 150,
//   distribution: {
//     5: 80,
//     4: 50,
//     3: 15,
//     2: 3,
//     1: 2
//   }
// }
```

### Verified Reviews

```javascript
// Check if user purchased product
const hasPurchased = await Rating.hasUserPurchased(userId, productId);

// Mark as verified
await Rating.markAsVerified(ratingId);
```

---

## WalletTransaction Model

Handles wallet transactions and balance management.

### Create Transaction

```javascript
const transaction = await WalletTransaction.create({
  userId: 'user-123',
  transactionType: 'credit', // or 'debit'
  amount: 500,
  description: 'Refund for order #ACE123',
  referenceId: 'order-123',
});
```

**Note:** Automatically:
- Updates user wallet balance
- Validates sufficient balance for debits
- Records balance snapshot
- Uses database transaction (atomic)

### Convenience Methods

```javascript
// Credit wallet
await WalletTransaction.credit(userId, 500, 'Cashback reward');

// Debit wallet
await WalletTransaction.debit(userId, 200, 'Order payment', orderId);

// Refund
await WalletTransaction.refund(originalTransactionId);
```

### Find Transactions

```javascript
// By user
const transactions = await WalletTransaction.findByUserId(userId, {
  limit: 50,
  transactionType: 'credit',
});

// By reference
const transaction = await WalletTransaction.findByReferenceId(orderId);
```

### Get Balance

```javascript
const balance = await WalletTransaction.getBalance(userId);
```

### Statistics

```javascript
const stats = await WalletTransaction.getStats(userId);

// Returns:
// {
//   totalTransactions: 25,
//   totalCredits: 5000,
//   totalDebits: 3000,
//   creditCount: 10,
//   debitCount: 15
// }
```

---

## AuditLog Model

Handles audit logging for admin actions and system events.

### Create Log Entry

```javascript
await AuditLog.create({
  userId: 'admin-123',
  action: 'product.update',
  entityType: 'product',
  entityId: 'prod-1',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  details: {
    changes: {
      price: { old: 2999, new: 2799 },
    },
  },
});
```

### Convenience Method

```javascript
await AuditLog.logAdminAction(
  adminUserId,
  'product.delete',
  'product',
  productId,
  { reason: 'Discontinued' },
  req // Express request object
);
```

### Find Logs

```javascript
// By user
const logs = await AuditLog.findByUserId(userId, {
  limit: 100,
  action: 'product.update',
});

// By entity
const logs = await AuditLog.findByEntity('product', productId);

// All logs
const logs = await AuditLog.findAll({
  limit: 100,
  action: 'order.status_change',
  entityType: 'order',
});

// Search
const logs = await AuditLog.search('delete');
```

### Statistics

```javascript
const stats = await AuditLog.getActionStats({
  userId: adminId,
  startDate: '2025-01-01',
  endDate: '2025-12-31',
});

// Returns:
// [
//   { action: 'product.update', count: 150 },
//   { action: 'order.status_change', count: 89 },
//   ...
// ]
```

### Cleanup

```javascript
// Delete logs older than 90 days
const deletedCount = await AuditLog.deleteOld(90);
```

---

## Common Patterns

### Error Handling

```javascript
try {
  const user = await User.create(userData);
} catch (error) {
  if (error.code === 'ER_DUP_ENTRY') {
    // Handle duplicate email
  } else {
    // Handle other errors
  }
}
```

### Transactions

```javascript
const { transaction } = require('./config/database');

await transaction(async (connection) => {
  // Multiple operations in a transaction
  await connection.execute('INSERT INTO ...');
  await connection.execute('UPDATE ...');
  // Automatically commits or rolls back
});
```

### Pagination

```javascript
const page = 1;
const limit = 50;
const offset = (page - 1) * limit;

const products = await Product.findAll({ limit, offset });
const total = await Product.count();
const totalPages = Math.ceil(total / limit);
```

---

## Best Practices

### 1. Always Use Models

❌ **Don't:**
```javascript
const results = await query('SELECT * FROM users WHERE id = ?', [id]);
```

✅ **Do:**
```javascript
const user = await User.findById(id);
```

### 2. Handle Errors Gracefully

```javascript
const user = await User.findById(id);
if (!user) {
  throw new Error('User not found');
}
```

### 3. Use Transactions for Multiple Operations

```javascript
// Creating an order affects multiple tables
await Order.create(orderData, items); // Uses transaction internally
```

### 4. Validate Input

```javascript
if (rating < 1 || rating > 5) {
  throw new Error('Rating must be between 1 and 5');
}
```

### 5. Use Appropriate Methods

```javascript
// For authentication
const user = await User.findByEmailWithPassword(email);

// For display
const user = await User.findByEmail(email); // No password_hash
```

---

## Testing Models

### Example Test

```javascript
const { User } = require('../models');

describe('User Model', () => {
  it('should create a new user', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user).not.toHaveProperty('password_hash');
  });

  it('should verify password', async () => {
    const user = await User.findByEmailWithPassword('test@example.com');
    const isValid = await User.verifyPassword('Test123!', user.password_hash);
    expect(isValid).toBe(true);
  });
});
```

---

## Model Methods Summary

### User
- `create()`, `findById()`, `findByEmail()`, `update()`, `updatePassword()`, `updateWalletBalance()`, `findAll()`, `count()`, `delete()`

### Product
- `create()`, `findById()`, `findAll()`, `search()`, `update()`, `updateStock()`, `decrementStock()`, `incrementStock()`, `getCategories()`, `count()`, `hasStock()`

### Order
- `create()`, `findById()`, `findByOrderNumber()`, `findByUserId()`, `findAll()`, `updateStatus()`, `updatePaymentStatus()`, `updateTracking()`, `cancel()`, `getStats()`

### Cart
- `getCart()`, `addItem()`, `updateQuantity()`, `removeItem()`, `clearCart()`, `validateCart()`, `mergeGuestCart()`

### Session
- `create()`, `findByToken()`, `findById()`, `findByUserId()`, `updateExpiration()`, `delete()`, `deleteByToken()`, `deleteByUserId()`, `deleteExpired()`, `isValid()`, `limitSessions()`

### Rating
- `createOrUpdate()`, `findById()`, `findByUserAndProduct()`, `findByProductId()`, `findByUserId()`, `update()`, `delete()`, `getProductStats()`, `hasUserPurchased()`, `markAsVerified()`

### WalletTransaction
- `create()`, `credit()`, `debit()`, `refund()`, `findById()`, `findByUserId()`, `findByReferenceId()`, `getBalance()`, `getStats()`

### AuditLog
- `create()`, `logAdminAction()`, `findById()`, `findByUserId()`, `findByEntity()`, `findAll()`, `search()`, `getActionStats()`, `deleteOld()`

---

## Next Steps

1. Run migrations: `npm run migrate:up`
2. Test models in your routes
3. Implement API endpoints using these models
4. Add validation middleware
5. Implement authentication with User and Session models

---

**Need Help?**
- Check model source code in `src/models/`
- All methods include JSDoc comments
- Models use Promises (async/await)
- Errors are thrown for invalid operations

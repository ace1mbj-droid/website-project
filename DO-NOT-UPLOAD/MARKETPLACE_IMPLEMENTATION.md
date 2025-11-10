# Ace#1 Marketplace Implementation Guide

## Overview
This document provides the complete implementation details for transforming the Ace#1 health website into a fully functional marketplace with user authentication, shopping cart, and payment processing.

## ✅ Completed Components

### 1. JavaScript Libraries
- **`/assets/js/cart.js`** - Shopping cart management with localStorage
- **`/assets/js/auth.js`** - User authentication and session management
- **`/assets/data/products.json`** - Product catalog with 8 health products

## 📋 Implementation Checklist

### Core Pages to Create

#### 1. **marketplace.html** - Main Product Listing Page
**Location:** `/website/marketplace.html`

**Key Features:**
- Product grid with filtering by category
- Search functionality
- Product cards with images, prices, ratings
- "Add to Cart" buttons
- Category filters (All, Supplements, Fitness, Wellness, Footwear, Wearables)

**Structure:**
```html
- Header with navigation (reuse from index.html)
- Hero section: "Health & Wellness Marketplace"
- Filter/Search bar
- Product grid (loads from products.json)
- Footer
- Scripts: cart.js, auth.js, marketplace.js
```

#### 2. **cart.html** - Shopping Cart Page
**Location:** `/website/cart.html`

**Key Features:**
- List all cart items with images
- Quantity adjustment (+/- buttons)
- Remove item button
- Subtotal calculation
- Shipping options
- Tax calculation
- Total amount
- "Proceed to Checkout" button (requires login)
- "Continue Shopping" link
- Empty cart message if no items

#### 3. **login.html** - User Login Page
**Location:** `/website/login.html`

**Key Features:**
- Email input field
- Password input field
- "Remember me" checkbox
- Login button
- "Forgot password?" link
- "Don't have an account? Register" link
- Form validation
- Redirect to profile or cart after login

#### 4. **register.html** - User Registration Page
**Location:** `/website/register.html`

**Key Features:**
- First Name input
- Last Name input
- Email input
- Phone number input
- Password input (with strength indicator)
- Confirm Password input
- Terms & Conditions checkbox
- Register button
- "Already have an account? Login" link
- Form validation
- Auto-login after successful registration

#### 5. **checkout.html** - Checkout Page
**Location:** `/website/checkout.html`

**Key Features:**
- Requires authentication (redirect if not logged in)
- Billing information form (pre-filled if logged in)
- Shipping information (same as billing checkbox)
- Order summary sidebar
- Payment method selection
- Stripe payment integration
- Place Order button
- Security badges

**Stripe Integration:**
```html
<script src="https://js.stripe.com/v3/"></script>
<!-- Stripe publishable key: pk_test_... (use your own) -->
```

#### 6. **profile.html** - User Profile & Order History
**Location:** `/website/profile.html`

**Key Features:**
- User information display
- Edit profile button
- Order history table with:
  - Order ID
  - Date
  - Items
  - Total amount
  - Status (Processing, Shipped, Delivered)
- View order details modal
- Logout button

#### 7. **product-detail.html** - Individual Product Page
**Location:** `/website/product-detail.html?id={productId}`

**Key Features:**
- Product image gallery
- Product name and description
- Price (with original price if discounted)
- Star rating and review count
- Feature list
- Stock availability
- Quantity selector
- Add to Cart button
- Reviews section (mockup)
- Related products

#### 8. **order-confirmation.html** - Order Success Page
**Location:** `/website/order-confirmation.html`

**Key Features:**
- Success message
- Order number
- Order details
- Estimated delivery date
- "Continue Shopping" button
- "View Orders" button

## 🎨 Shared Styles

### Marketplace CSS
Create `/assets/css/marketplace.css`:

```css
/* Marketplace Styles */
.marketplace-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  text-align: center;
  color: white;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f5f5f5;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.product-price {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.product-price-original {
  text-decoration: line-through;
  color: #999;
  font-size: 16px;
  margin-left: 10px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
}

.stars {
  color: #ffd700;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart-btn:hover {
  background: #5568d3;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Cart Styles */
.cart-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.quantity-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
}

.cart-summary {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  margin-top: 30px;
}

/* Auth Forms */
.auth-container {
  max-width: 450px;
  margin: 60px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.btn-primary:hover {
  background: #5568d3;
}

/* Checkout */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.order-summary {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

/* Responsive */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr auto;
    gap: 10px;
  }
  
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🔧 Additional JavaScript Files

### marketplace.js
Create `/assets/js/marketplace.js`:

```javascript
// Load and display products
async function loadProducts() {
  try {
    const response = await fetch('/assets/data/products.json');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function displayProducts(products, filter = 'all') {
  const grid = document.getElementById('product-grid');
  const filtered = filter === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === filter.toLowerCase());
  
  grid.innerHTML = filtered.map(product => `
    <div class="product-card" onclick="viewProduct('${product.id}')">
      <img src="${product.image}" alt="${product.name}" class="product-image" 
           onerror="this.src='/assets/images/placeholder-product.jpg'">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
          <span>(${product.reviews})</span>
        </div>
        <div class="product-price">
          $${product.price.toFixed(2)}
          ${product.originalPrice ? `<span class="product-price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(event, '${product.id}')" 
                ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  `).join('');
}

function addToCart(event, productId) {
  event.stopPropagation();
  fetch('/assets/data/products.json')
    .then(r => r.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (product) {
        window.cart.addItem(product);
      }
    });
}

function viewProduct(productId) {
  window.location.href = `/product-detail.html?id=${productId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);
```

## 🔐 Stripe Payment Integration

### In checkout.html:

```javascript
// Initialize Stripe
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Replace with your key
const elements = stripe.elements();
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
    }
  }
});
cardElement.mount('#card-element');

// Handle payment
async function handlePayment() {
  const {error, paymentMethod} = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    document.getElementById('card-errors').textContent = error.message;
  } else {
    // Process payment with your backend
    processOrder(paymentMethod.id);
  }
}

function processOrder(paymentMethodId) {
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: cart.getItems(),
    total: cart.getTotal(),
    paymentMethodId: paymentMethodId,
    status: 'Processing'
  };
  
  // Save order to user history
  auth.addOrder(order);
  
  // Clear cart
  cart.clearCart();
  
  // Redirect to confirmation
  window.location.href = `/order-confirmation.html?orderId=${order.id}`;
}
```

## 🗺️ Navigation Updates

### Add to all pages (index.html, about-us.html, ace-gallery.html):

In the navigation menu (around line 1557):

```html
<!-- After "Our Products" -->
<li role="menuitem" data-ux="ListItem">
  <a href="/marketplace.html" data-ux="NavMoreMenuLink">
    Marketplace
  </a>
</li>

<!-- After "Contact Us" -->
<li role="menuitem" data-ux="ListItem">
  <a href="/cart.html" data-ux="NavMoreMenuLink">
    Cart<span class="cart-count">0</span>
  </a>
</li>

<!-- Auth Links -->
<li role="menuitem" data-ux="ListItem" class="auth-link">
  <a href="/login.html" data-ux="NavMoreMenuLink">Login</a>
</li>
<li role="menuitem" data-ux="ListItem" class="user-link" style="display: none;">
  <a href="/profile.html" data-ux="NavMoreMenuLink">
    <span class="user-name"></span>
  </a>
</li>
```

Add scripts before `</body>`:
```html
<script src="/assets/js/cart.js"></script>
<script src="/assets/js/auth.js"></script>
```

## 📝 Service Worker Updates

Update `/website/sw.js` to cache marketplace assets:

```javascript
// Add to the urlsToCache array:
  '/marketplace.html',
  '/cart.html',
  '/login.html',
  '/register.html',
  '/checkout.html',
  '/profile.html',
  '/product-detail.html',
  '/order-confirmation.html',
  '/assets/js/cart.js',
  '/assets/js/auth.js',
  '/assets/js/marketplace.js',
  '/assets/css/marketplace.css',
  '/assets/data/products.json'
```

## 🚀 Testing Instructions

1. **Test Product Listing:**
   - Navigate to `/marketplace.html`
   - Verify all 8 products display
   - Test category filters
   - Test search functionality

2. **Test Shopping Cart:**
   - Add products to cart
   - Verify cart badge updates
   - Navigate to `/cart.html`
   - Test quantity changes
   - Test item removal

3. **Test Authentication:**
   - Register a new user at `/register.html`
   - Logout and login at `/login.html`
   - Verify profile shows at `/profile.html`

4. **Test Checkout:**
   - Add items to cart
   - Login as user
   - Navigate to checkout
   - Use Stripe test card: 4242 4242 4242 4242
   - Complete order
   - Verify order appears in profile

## 📦 Deployment Checklist

- [ ] Replace Stripe test key with live key
- [ ] Add real product images to `/assets/images/`
- [ ] Set up server-side API for authentication (replace localStorage)
- [ ] Set up server-side payment processing
- [ ] Add email notifications for orders
- [ ] Set up SSL certificate
- [ ] Test all pages on mobile devices
- [ ] Run PWA audit
- [ ] Update manifest.webmanifest with new pages

## 🔒 Security Notes

**IMPORTANT:** The current implementation uses localStorage for demonstration purposes only. For production:

1. **Authentication:** Implement proper server-side authentication with JWT tokens or session cookies
2. **Password Storage:** Use bcrypt or similar hashing on the server
3. **Payment Processing:** Process payments server-side, never store card details
4. **HTTPS:** Always use HTTPS in production
5. **CSRF Protection:** Implement CSRF tokens for forms
6. **Rate Limiting:** Add rate limiting to prevent abuse

## 📚 Next Steps

1. Create all HTML pages listed above
2. Add product images
3. Test entire user flow
4. Set up backend API (Node.js/Express, Python/Flask, or PHP)
5. Deploy to production server

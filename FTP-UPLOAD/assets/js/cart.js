// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.encryptionEnabled = false;
    this.storageKey = 'ace1_cart_encryption_key';
    this.init();
  }

  // Initialize cart system
  async init() {
    // Wait for crypto utilities to be available
    if (window.cryptoUtils) {
      this.encryptionEnabled = true;
      // Generate or retrieve storage encryption key
      let key = localStorage.getItem(this.storageKey);
      if (!key) {
        key = window.cryptoUtils.generateRandomKey();
        localStorage.setItem(this.storageKey, key);
      }
      this.storageEncryptionKey = key;
    }
    
    this.items = await this.loadCart();
    this.updateCartCount();
  }

  // Load cart from localStorage (encrypted)
  async loadCart() {
    const cart = localStorage.getItem('ace1_cart');
    if (!cart) return [];
    
    if (this.encryptionEnabled && this.storageEncryptionKey) {
      try {
        const decrypted = await window.cryptoUtils.decrypt(cart, this.storageEncryptionKey);
        return JSON.parse(decrypted);
      } catch (e) {
        console.warn('Failed to decrypt cart, returning raw data');
        return JSON.parse(cart);
      }
    }
    
    return JSON.parse(cart);
  }

  // Save cart to localStorage (encrypted)
  async saveCart() {
    const cartJson = JSON.stringify(this.items);
    
    if (this.encryptionEnabled && this.storageEncryptionKey) {
      try {
        const encrypted = await window.cryptoUtils.encrypt(cartJson, this.storageEncryptionKey);
        localStorage.setItem('ace1_cart', encrypted);
        this.updateCartCount();
        this.dispatchCartUpdateEvent();
        return;
      } catch (e) {
        console.error('Failed to encrypt cart, saving unencrypted');
      }
    }
    
    localStorage.setItem('ace1_cart', JSON.stringify(this.items));
    this.updateCartCount();
    this.dispatchCartUpdateEvent();
  }

  // Add item to cart
  async addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    await this.saveCart();
    this.showNotification(`${product.name} added to cart!`);
  }

  // Remove item from cart
  async removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    await this.saveCart();
  }

  // Update item quantity
  async updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        await this.removeItem(productId);
      } else {
        item.quantity = quantity;
        await this.saveCart();
      }
    }
  }

  // Get cart items
  getItems() {
    return this.items;
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  async clearCart() {
    this.items = [];
    await this.saveCart();
  }

  // Update cart count badge in navigation
  updateCartCount() {
    const cartBadges = document.querySelectorAll('.cart-count');
    const count = this.getItemCount();
    cartBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  // Dispatch custom event for cart updates
  dispatchCartUpdateEvent() {
    const event = new CustomEvent('cartUpdated', {
      detail: {
        items: this.items,
        total: this.getTotal(),
        count: this.getItemCount()
      }
    });
    window.dispatchEvent(event);
  }

  // Show notification
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  .cart-count {
    display: inline-block;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    margin-left: 5px;
    font-weight: bold;
  }
`;
document.head.appendChild(style);

// Initialize global cart instance
window.cart = new ShoppingCart();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingCart;
}

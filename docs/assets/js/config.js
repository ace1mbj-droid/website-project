/**
 * API Configuration
 * Update API_BASE_URL with your Railway/Render backend URL
 */

// IMPORTANT: Replace this with your actual backend URL after deployment
const API_BASE_URL = 'https://your-backend-url.railway.app';

// Alternative: Use environment-based URLs
// const API_BASE_URL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:3000'
//   : 'https://your-backend-url.railway.app';

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  profile: `${API_BASE_URL}/api/auth/profile`,
  
  // Products
  products: `${API_BASE_URL}/api/products`,
  productById: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  // Orders
  orders: `${API_BASE_URL}/api/orders`,
  orderById: (id) => `${API_BASE_URL}/api/orders/${id}`,
  
  // Cart
  cart: `${API_BASE_URL}/api/cart`,
  cartAdd: `${API_BASE_URL}/api/cart/add`,
  cartRemove: (id) => `${API_BASE_URL}/api/cart/remove/${id}`,
  cartUpdate: (id) => `${API_BASE_URL}/api/cart/update/${id}`,
  
  // Admin
  adminStats: `${API_BASE_URL}/api/admin/stats`,
  adminUsers: `${API_BASE_URL}/api/admin/users`,
  adminOrders: `${API_BASE_URL}/api/admin/orders`,
  
  // Health check
  health: `${API_BASE_URL}/health`
};

// API Helper Functions
const API = {
  /**
   * Make authenticated API request
   */
  async request(url, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      credentials: 'include'
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, mergedOptions);
      
      // Handle unauthorized
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
        throw new Error('Unauthorized');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  /**
   * GET request
   */
  async get(url) {
    return this.request(url, { method: 'GET' });
  },
  
  /**
   * POST request
   */
  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * PUT request
   */
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * DELETE request
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  },
  
  /**
   * Check backend health
   */
  async checkHealth() {
    try {
      const response = await fetch(API_ENDPOINTS.health);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL, API_ENDPOINTS, API };
}

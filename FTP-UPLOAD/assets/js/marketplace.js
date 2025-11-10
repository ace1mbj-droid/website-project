// Marketplace functionality
let allProducts = [];
let currentFilter = 'all';

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch('/assets/data/products.json');
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('product-grid').innerHTML = 
      '<p style="text-align: center; grid-column: 1/-1;">Error loading products. Please refresh the page.</p>';
  }
}

// Display products with ratings
function displayProducts(products) {
  const grid = document.getElementById('product-grid');
  
  if (products.length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products found.</p>';
    return;
  }
  
  grid.innerHTML = products.map(product => {
    const savings = product.originalPrice ? 
      Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    // Get average rating for this product
    const avgRating = window.auth ? window.auth.getAverageRating(product.id) : 0;
    const ratingCount = window.auth ? window.auth.getAllRatingsForProduct(product.id).length : 0;
    
    // Generate star display
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '★';
      } else if (i === fullStars && hasHalfStar) {
        stars += '✦';
      } else {
        stars += '☆';
      }
    }
    
    const ratingDisplay = ratingCount > 0 ? 
      `<div class="product-rating">${stars} <span class="rating-value">${avgRating}</span> (${ratingCount})</div>` : 
      '<div class="product-rating">★☆☆☆☆ <span class="rating-value">No ratings yet</span></div>';
    
    return `
      <div class="product-card" onclick="viewProduct('${product.id}')">
        <div class="product-image-wrapper">
          ${savings > 0 ? `<div class="discount-badge-card">-${savings}%</div>` : ''}
          <img src="${product.image}" 
               alt="${product.name}" 
               class="product-image" 
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f8f9fa%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui%22 font-size=%2218%22 fill=%22%23718096%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          ${ratingDisplay}
          <div class="product-footer">
            <div class="product-price-section">
              <div class="current-price">₹${product.price.toLocaleString('en-IN')}</div>
              ${product.originalPrice ? 
                `<div class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</div>` : 
                ''}
            </div>
            <button class="btn-add-cart" 
                    onclick="addToCart(event, '${product.id}')" 
                    ${!product.inStock ? 'disabled' : ''}>
              ${product.inStock ? '🛒 Add' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Filter products by category
function filterProducts(category) {
  currentFilter = category;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter and display
  const filtered = category === 'all' ? 
    allProducts : 
    allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  
  displayProducts(filtered);
}

// Search products
function searchProducts(query) {
  const searchTerm = query.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm)
  );
  displayProducts(filtered);
}

// Add product to cart
function addToCart(event, productId) {
  event.stopPropagation();
  
  const product = allProducts.find(p => p.id === productId);
  if (product && product.inStock) {
    window.cart.addItem(product);
  }
}

// View product details
function viewProduct(productId) {
  window.location.href = `/product-detail.html?id=${productId}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  // Setup search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchProducts(e.target.value);
    });
  }
});

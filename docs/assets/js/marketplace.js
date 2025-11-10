// Marketplace functionality
let allProducts = [];
let displayedProducts = [];
let currentFilter = 'all';
let currentSort = 'featured';
let itemsPerPage = 12;
let currentPage = 1;

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch('/assets/data/products.json');
    allProducts = await response.json();
    displayedProducts = [...allProducts];
    displayProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('product-grid').innerHTML = 
      '<p style="text-align: center; grid-column: 1/-1;">Error loading products. Please refresh the page.</p>';
  }
}

// Display products with enhanced UI
function displayProducts() {
  const grid = document.getElementById('product-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  if (displayedProducts.length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 60px 20px; color: #718096; font-size: 16px;">No products found matching your criteria.</p>';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }
  
  // Paginate products
  const startIndex = 0;
  const endIndex = currentPage * itemsPerPage;
  const productsToShow = displayedProducts.slice(startIndex, endIndex);
  
  grid.innerHTML = productsToShow.map(product => {
    const savings = product.originalPrice ? 
      Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    // Get average rating
    const avgRating = window.auth ? window.auth.getAverageRating(product.id) : 0;
    const ratingCount = window.auth ? window.auth.getAllRatingsForProduct(product.id).length : 0;
    
    // Generate star display
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    let starsHTML = '<span class="stars">';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML += '★';
      } else if (i === fullStars && hasHalfStar) {
        starsHTML += '✦';
      } else {
        starsHTML += '☆';
      }
    }
    starsHTML += '</span>';
    
    // Determine badge
    let badge = '';
    if (savings >= 30) {
      badge = '<div class="product-badge sale">Sale</div>';
    } else if (product.isNew) {
      badge = '<div class="product-badge new">New</div>';
    } else if (product.stock && product.stock < 10) {
      badge = '<div class="product-badge limited">Limited</div>';
    }
    
    // Stock status
    let stockClass = 'in-stock';
    let stockText = 'In Stock';
    if (!product.inStock || (product.stock && product.stock === 0)) {
      stockClass = 'out-of-stock';
      stockText = 'Out of Stock';
    } else if (product.stock && product.stock < 10) {
      stockClass = 'low-stock';
      stockText = `Only ${product.stock} left`;
    }
    
    // Features
    const features = [];
    if (product.specifications) {
      if (product.specifications.technology) features.push(product.specifications.technology);
      if (product.specifications.material) features.push(product.specifications.material);
      if (product.specifications.warranty) features.push(product.specifications.warranty);
    }
    
    return `
      <div class="product-card">
        ${badge}
        <div class="product-actions">
          <button class="action-btn" onclick="toggleWishlist(event, '${product.id}')" title="Add to Wishlist">
            ❤️
          </button>
          <button class="action-btn" onclick="openQuickView(event, '${product.id}')" title="Quick View">
            👁️
          </button>
        </div>
        
        <div class="product-image-container" onclick="viewProduct('${product.id}')">
          <img src="${product.image}" 
               alt="${product.name}" 
               class="product-image" 
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f8f9fa%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui%22 font-size=%2218%22 fill=%22%23718096%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        
        <div class="product-info">
          <div class="product-meta">
            <span class="product-sku">${product.sku || 'SKU-' + product.id}</span>
            <span class="product-stock ${stockClass}">${stockText}</span>
          </div>
          
          <h3 class="product-name">${product.name}</h3>
          ${product.model ? `<div class="product-model">Model: ${product.model}</div>` : ''}
          
          <div class="product-rating">
            ${starsHTML}
            <span class="rating-count">(${ratingCount})</span>
          </div>
          
          ${features.length > 0 ? `
            <div class="product-features">
              ${features.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('')}
            </div>
          ` : ''}
          
          <div class="product-price-section">
            <div class="price-container">
              <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
              ${product.originalPrice ? 
                `<div class="product-original-price">₹${product.originalPrice.toLocaleString('en-IN')}</div>` : 
                ''}
            </div>
            ${savings > 0 ? `<div class="discount-percent">${savings}% OFF</div>` : ''}
          </div>
          
          <div class="product-actions-bottom">
            <button class="btn-add-cart" 
                    onclick="addToCart(event, '${product.id}')" 
                    ${!product.inStock ? 'disabled' : ''}>
              ${product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>
            <button class="btn-quick-view" onclick="openQuickView(event, '${product.id}')">
              👁️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Show/hide load more button
  if (loadMoreBtn) {
    loadMoreBtn.style.display = endIndex < displayedProducts.length ? 'block' : 'none';
  }
}

// Filter by category
function filterByCategory(category) {
  currentFilter = category;
  currentPage = 1;
  
  // Update active tab
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Apply filter
  applyAllFilters();
}

// Sort products
function sortProducts(sortBy) {
  currentSort = sortBy;
  
  switch(sortBy) {
    case 'price-low':
      displayedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      displayedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      displayedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default:
      // Featured - restore original order
      displayedProducts = [...allProducts];
      applyAllFilters();
      return;
  }
  
  displayProducts();
}

// Toggle filters panel
function toggleFilters() {
  const panel = document.getElementById('filters-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Apply all filters
function applyAllFilters() {
  let filtered = [...allProducts];
  
  // Category filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(p => 
      p.category.toLowerCase().includes(currentFilter.toLowerCase())
    );
  }
  
  // Price filter
  const minPrice = parseInt(document.getElementById('min-price')?.value || 0);
  const maxPrice = parseInt(document.getElementById('max-price')?.value || 999999);
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
  
  // Size filter
  const selectedSizes = Array.from(document.querySelectorAll('.size-filters input:checked'))
    .map(cb => cb.value);
  if (selectedSizes.length > 0) {
    filtered = filtered.filter(p => 
      p.sizes && p.sizes.some(size => selectedSizes.includes(size.toString()))
    );
  }
  
  // Color filter
  const selectedColors = Array.from(document.querySelectorAll('.color-filters input:checked'))
    .map(cb => cb.value.toLowerCase());
  if (selectedColors.length > 0) {
    filtered = filtered.filter(p => 
      p.colors && p.colors.some(color => selectedColors.includes(color.toLowerCase()))
    );
  }
  
  displayedProducts = filtered;
  sortProducts(currentSort);
}

// Apply filters
function applyFilters() {
  currentPage = 1;
  applyAllFilters();
  toggleFilters();
}

// Clear filters
function clearFilters() {
  document.getElementById('min-price').value = 0;
  document.getElementById('max-price').value = 50000;
  document.querySelectorAll('.size-filters input, .color-filters input').forEach(cb => {
    cb.checked = false;
  });
  applyFilters();
}

// Load more products
function loadMoreProducts() {
  currentPage++;
  displayProducts();
}

// Search products
function searchProducts(query) {
  const searchTerm = query.toLowerCase();
  displayedProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm)) ||
    (p.model && p.model.toLowerCase().includes(searchTerm))
  );
  currentPage = 1;
  displayProducts();
}

// Add to cart
function addToCart(event, productId) {
  event.stopPropagation();
  
  const product = allProducts.find(p => p.id === productId);
  if (product && product.inStock) {
    window.cart.addItem(product);
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 1500);
  }
}

// Toggle wishlist
function toggleWishlist(event, productId) {
  event.stopPropagation();
  
  // Check if user is logged in
  if (!window.auth || !window.auth.isLoggedIn()) {
    alert('Please log in to add items to your wishlist');
    window.location.href = '/login.html';
    return;
  }
  
  // Add wishlist functionality here
  const btn = event.target;
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => {
    btn.style.transform = '';
  }, 200);
  
  alert('Added to wishlist!');
}

// Open quick view modal
function openQuickView(event, productId) {
  event.stopPropagation();
  
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  
  // Get rating info
  const avgRating = window.auth ? window.auth.getAverageRating(product.id) : 0;
  const ratingCount = window.auth ? window.auth.getAllRatingsForProduct(product.id).length : 0;
  
  let starsHTML = '';
  for (let i = 0; i < 5; i++) {
    starsHTML += i < Math.floor(avgRating) ? '★' : '☆';
  }
  
  content.innerHTML = `
    <div style="text-align: center;">
      <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 400px; border-radius: 12px; margin-bottom: 20px;">
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div>
          <span style="font-size: 12px; color: #718096; font-weight: 600;">${product.sku || 'SKU-' + product.id}</span>
          ${product.model ? `<div style="font-size: 12px; color: #718096; margin-top: 4px;">Model: ${product.model}</div>` : ''}
        </div>
        <span style="font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; background: ${product.inStock ? '#D1FAE5' : '#FEE2E2'}; color: ${product.inStock ? '#065F46' : '#991B1B'};">
          ${product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      
      <h2 style="font-size: 28px; font-weight: 800; margin: 12px 0; color: #1a202c;">${product.name}</h2>
      
      <div style="display: flex; align-items: center; gap: 8px; margin: 12px 0;">
        <span style="color: #F59E0B; font-size: 18px;">${starsHTML}</span>
        <span style="color: #718096; font-size: 14px;">(${ratingCount} reviews)</span>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6; margin: 16px 0;">${product.description}</p>
      
      ${product.specifications ? `
        <div style="background: #F7FAFC; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #1a202c;">Specifications</h4>
          <div style="display: grid; gap: 8px; font-size: 13px;">
            ${Object.entries(product.specifications).map(([key, value]) => `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #718096; text-transform: capitalize;">${key}:</span>
                <span style="color: #1a202c; font-weight: 600;">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div style="display: flex; align-items: center; justify-content: space-between; margin: 24px 0; padding: 20px 0; border-top: 2px solid #E2E8F0; border-bottom: 2px solid #E2E8F0;">
        <div>
          <div style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ₹${product.price.toLocaleString('en-IN')}
          </div>
          ${product.originalPrice ? `
            <div style="font-size: 16px; color: #718096; text-decoration: line-through;">
              ₹${product.originalPrice.toLocaleString('en-IN')}
            </div>
          ` : ''}
        </div>
        ${product.originalPrice ? `
          <div style="font-size: 18px; font-weight: 700; color: #EF4444;">
            Save ${Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        ` : ''}
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button onclick="addToCart(event, '${product.id}'); closeQuickView();" 
                style="flex: 1; padding: 16px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;"
                ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
        <button onclick="viewProduct('${product.id}')" 
                style="padding: 16px 24px; background: white; color: #6366F1; border: 2px solid #6366F1; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
          View Details
        </button>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Close quick view
function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
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



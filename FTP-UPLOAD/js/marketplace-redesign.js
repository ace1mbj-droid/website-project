// ==================================
// ACE#1 Marketplace Redesign JS
// Modern Product Filtering & Display
// ==================================

// State Management
const marketplaceState = {
    allProducts: [],
    filteredProducts: [],
    currentView: 'grid',
    currentCategory: 'all',
    currentSort: 'default',
    searchQuery: '',
    priceRange: { min: 0, max: 50000 },
    selectedFeatures: [],
    inStockOnly: false
};

// Initialize Marketplace
document.addEventListener('DOMContentLoaded', () => {
    initializeMarketplace();
    setupEventListeners();
    updateAuthUI();
    updateCartCount();
});

// ==================================
// Initialization
// ==================================

async function initializeMarketplace() {
    try {
        // Load products from productManager
        if (window.productManager) {
            marketplaceState.allProducts = await window.productManager.getAllProducts();
            marketplaceState.filteredProducts = [...marketplaceState.allProducts];
            renderProducts();
        } else {
            showError('Product manager not available');
        }
    } catch (error) {
        console.error('Error initializing marketplace:', error);
        showError('Failed to load products');
    }
}

// ==================================
// Event Listeners
// ==================================

function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // View toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn.dataset.view));
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => handleSort(e.target.value));
    }

    // Category filters
    const categoryChips = document.querySelectorAll('.filter-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            handleCategoryFilter(category);
            
            // Update active state
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // Price range
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', debounce(handlePriceFilter, 300));
        priceMax.addEventListener('input', debounce(handlePriceFilter, 300));
    }

    // Feature checkboxes
    const featureCheckboxes = document.querySelectorAll('input[data-filter="feature"]');
    featureCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFeatureFilter);
    });

    // Stock filter
    const stockCheckbox = document.getElementById('in-stock-only');
    if (stockCheckbox) {
        stockCheckbox.addEventListener('change', handleStockFilter);
    }
}

// ==================================
// Filter Handlers
// ==================================

function handleSearch(e) {
    marketplaceState.searchQuery = e.target.value.toLowerCase();
    applyFilters();
}

function handleCategoryFilter(category) {
    marketplaceState.currentCategory = category;
    applyFilters();
}

function handleSort(sortValue) {
    marketplaceState.currentSort = sortValue;
    sortProducts();
    renderProducts();
}

function handlePriceFilter() {
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    
    // Update labels
    document.getElementById('price-min-label').textContent = min.toLocaleString();
    document.getElementById('price-max-label').textContent = max.toLocaleString();
    
    marketplaceState.priceRange = { min, max };
    applyFilters();
}

function handleFeatureFilter() {
    const checkboxes = document.querySelectorAll('input[data-filter="feature"]:checked');
    marketplaceState.selectedFeatures = Array.from(checkboxes).map(cb => cb.value);
    applyFilters();
}

function handleStockFilter() {
    const checkbox = document.getElementById('in-stock-only');
    marketplaceState.inStockOnly = checkbox.checked;
    applyFilters();
}

function handleViewChange(view) {
    marketplaceState.currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Update grid class
    const grid = document.getElementById('products-grid');
    if (grid) {
        grid.classList.toggle('list-view', view === 'list');
    }
}

// ==================================
// Filtering Logic
// ==================================

function applyFilters() {
    let products = [...marketplaceState.allProducts];
    
    // Category filter
    if (marketplaceState.currentCategory !== 'all') {
        products = products.filter(p => p.category === marketplaceState.currentCategory);
    }
    
    // Search filter
    if (marketplaceState.searchQuery) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(marketplaceState.searchQuery) ||
            p.description.toLowerCase().includes(marketplaceState.searchQuery) ||
            p.category.toLowerCase().includes(marketplaceState.searchQuery)
        );
    }
    
    // Price filter
    products = products.filter(p => 
        p.price >= marketplaceState.priceRange.min && 
        p.price <= marketplaceState.priceRange.max
    );
    
    // Feature filter
    if (marketplaceState.selectedFeatures.length > 0) {
        products = products.filter(p => {
            const description = p.description.toLowerCase();
            return marketplaceState.selectedFeatures.some(feature => 
                description.includes(feature)
            );
        });
    }
    
    // Stock filter
    if (marketplaceState.inStockOnly) {
        products = products.filter(p => p.stock > 0);
    }
    
    marketplaceState.filteredProducts = products;
    sortProducts();
    renderProducts();
    updateResultsCount();
}

function sortProducts() {
    const products = marketplaceState.filteredProducts;
    
    switch (marketplaceState.currentSort) {
        case 'name-asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            products.sort((a, b) => b.id - a.id);
            break;
        default:
            // Default order
            break;
    }
}

function clearAllFilters() {
    // Reset state
    marketplaceState.currentCategory = 'all';
    marketplaceState.searchQuery = '';
    marketplaceState.priceRange = { min: 0, max: 50000 };
    marketplaceState.selectedFeatures = [];
    marketplaceState.inStockOnly = false;
    
    // Reset UI
    document.getElementById('search-input').value = '';
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 50000;
    document.getElementById('price-min-label').textContent = '0';
    document.getElementById('price-max-label').textContent = '50,000';
    
    document.querySelectorAll('.filter-chip').forEach((chip, index) => {
        chip.classList.toggle('active', index === 0);
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reapply
    applyFilters();
}

// ==================================
// Rendering
// ==================================

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid) return;
    
    const products = marketplaceState.filteredProducts;
    
    if (products.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Attach event listeners to add-to-cart buttons
    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            addToCart(productId);
        });
    });
    
    // Attach click handlers to product cards
    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.dataset.productId);
            viewProductDetail(productId);
        });
    });
}

function createProductCard(product) {
    const inStock = product.stock > 0;
    const discount = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.stock === 0 ? '<div class="product-badge badge-sold-out">Sold Out</div>' : ''}
            ${discount > 0 ? `<div class="product-badge badge-sale">${discount}% OFF</div>` : ''}
            
            <div class="product-image">
                <img src="${product.image || '/images/placeholder-product.jpg'}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="review-count">(${Math.floor(Math.random() * 200) + 50})</span>
                </div>
                
                <div class="product-price">
                    <span class="price-current">₹${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `
                        <span class="price-original">₹${product.originalPrice.toLocaleString()}</span>
                        <span class="price-discount">Save ${discount}%</span>
                    ` : ''}
                </div>
                
                <div class="product-actions">
                    <button 
                        class="add-to-cart-btn" 
                        data-product-id="${product.id}"
                        ${!inStock ? 'disabled' : ''}
                    >
                        <span>🛒</span>
                        <span>${inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateResultsCount() {
    const countEl = document.getElementById('results-count');
    if (countEl) {
        countEl.textContent = marketplaceState.filteredProducts.length;
    }
}

// ==================================
// Cart Functions
// ==================================

function addToCart(productId) {
    const product = marketplaceState.allProducts.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    if (product.stock === 0) {
        showNotification('Product is out of stock', 'error');
        return;
    }
    
    if (window.cart) {
        try {
            window.cart.addItem(product);
            showNotification(`${product.name} added to cart!`, 'success');
            updateCartCount();
        } catch (error) {
            showNotification('Failed to add to cart', 'error');
        }
    } else {
        // Fallback: add to localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`${product.name} added to cart!`, 'success');
        updateCartCount();
    }
}

function updateCartCount() {
    const cartCountEl = document.querySelector('.cart-count');
    
    if (cartCountEl) {
        let count = 0;
        
        if (window.cart) {
            count = window.cart.getItemCount();
        } else {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            count = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'block' : 'none';
    }
}

function viewProductDetail(productId) {
    window.location.href = `/product-detail.html?id=${productId}`;
}

// ==================================
// Auth UI
// ==================================

function updateAuthUI() {
    const authLink = document.querySelector('.auth-link');
    const userLink = document.querySelector('.user-link');
    
    if (window.auth && window.auth.isLoggedIn()) {
        const user = window.auth.getCurrentUser();
        
        if (authLink) authLink.style.display = 'none';
        if (userLink) {
            userLink.style.display = 'flex';
            const userName = userLink.querySelector('.user-name');
            if (userName) userName.textContent = user.name || user.email;
        }
    } else {
        if (authLink) authLink.style.display = 'inline-block';
        if (userLink) userLink.style.display = 'none';
    }
}

// ==================================
// Mobile Menu
// ==================================

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    
    if (mobileToggle) {
        mobileToggle.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }
});

// ==================================
// Utility Functions
// ==================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const grid = document.getElementById('products-grid');
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error Loading Products</h3>
                <p style="color: #64748b;">${message}</p>
                <button class="btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// ==================================
// Add animations
// ==================================

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
`;
document.head.appendChild(style);

// Export for other scripts
window.marketplaceRedesign = {
    addToCart,
    viewProductDetail,
    clearAllFilters,
    updateCartCount
};

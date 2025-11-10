// Lifestyle Bold Template - JavaScript

// Product data
const products = [
    {
        id: 1,
        name: "Performance Pro Protein",
        category: "Nutrition",
        price: 1499,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
        rating: 4.8,
        reviews: 234
    },
    {
        id: 2,
        name: "Energy Boost Complex",
        category: "Supplements",
        price: 999,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        rating: 4.9,
        reviews: 189
    },
    {
        id: 3,
        name: "Recovery Essentials",
        category: "Wellness",
        price: 1299,
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400",
        rating: 4.7,
        reviews: 156
    },
    {
        id: 4,
        name: "Daily Multivitamin Plus",
        category: "Health",
        price: 799,
        image: "https://images.unsplash.com/photo-1550572017-4a6e8e0b0b3f?w=400",
        rating: 4.6,
        reviews: 298
    }
];

// Render products
function renderProducts() {
    const grid = document.querySelector('.products-grid');
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" style="background: url('${product.image}') center/cover;">
                <button class="quick-add">Quick Add</button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                    <span class="rating-count">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="btn-add-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add product card styles
    addProductStyles();
    
    // Add event listeners
    attachEventListeners();
}

// Add product card styles dynamically
function addProductStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .product-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.3s;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        
        .product-image {
            height: 350px;
            position: relative;
            overflow: hidden;
        }
        
        .quick-add {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: white;
            color: var(--primary);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            opacity: 0;
        }
        
        .product-card:hover .quick-add {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .quick-add:hover {
            background: var(--primary);
            color: white;
        }
        
        .product-info {
            padding: 1.5rem;
        }
        
        .product-category {
            color: var(--primary);
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .product-name {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0.5rem 0;
            color: var(--dark);
        }
        
        .product-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .stars {
            color: var(--accent);
            font-size: 1.1rem;
        }
        
        .rating-count {
            color: #666;
            font-size: 0.9rem;
        }
        
        .product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
        
        .product-price {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--primary);
        }
        
        .btn-add-cart {
            background: var(--dark);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-add-cart:hover {
            background: var(--primary);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}

// Attach event listeners
function attachEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart, .quick-add').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(this);
        });
    });
    
    // Product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.id;
            showProductDetails(productId);
        });
    });
}

// Add to cart function
function addToCart(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Added!';
    button.style.background = '#10b981';
    
    // Update cart badge
    const badge = document.querySelector('.badge');
    const currentCount = parseInt(badge.textContent);
    badge.textContent = currentCount + 1;
    
    // Animate badge
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 300);
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Show product details
function showProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        alert(`Product: ${product.name}\nPrice: ₹${product.price}\n\nProduct details page would open here.`);
    }
}

// Smooth scroll for hero scroll button
document.addEventListener('DOMContentLoaded', function() {
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            document.querySelector('.lifestyle-grid').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 5px 30px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Render products
    renderProducts();
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });
    }, 100);
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
}

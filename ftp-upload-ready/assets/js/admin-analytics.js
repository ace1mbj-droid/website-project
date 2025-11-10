/**
 * Admin Dashboard Analytics Module
 * Handles traffic analytics, user management, and inventory tracking
 */

// Traffic Analytics
const Analytics = {
    // Initialize analytics tracking
    init() {
        this.trackPageView();
        this.loadAnalytics();
        this.startRealtimeTracking();
    },

    // Track page view
    trackPageView() {
        const pageViews = parseInt(localStorage.getItem('admin_page_views') || '0');
        localStorage.setItem('admin_page_views', pageViews + 1);
        
        const visitors = this.getUniqueVisitors();
        localStorage.setItem('admin_total_visitors', visitors);
    },

    // Get unique visitors
    getUniqueVisitors() {
        const visitorId = localStorage.getItem('visitor_id') || this.generateVisitorId();
        localStorage.setItem('visitor_id', visitorId);
        
        const visitors = JSON.parse(localStorage.getItem('unique_visitors') || '[]');
        if (!visitors.includes(visitorId)) {
            visitors.push(visitorId);
            localStorage.setItem('unique_visitors', JSON.stringify(visitors));
        }
        return visitors.length;
    },

    // Generate visitor ID
    generateVisitorId() {
        return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Load analytics data
    loadAnalytics() {
        const data = {
            totalVisitors: localStorage.getItem('admin_total_visitors') || 0,
            pageViews: localStorage.getItem('admin_page_views') || 0,
            avgSession: this.calculateAvgSession(),
            bounceRate: this.calculateBounceRate()
        };

        // Update UI
        if (document.getElementById('total-visitors')) {
            document.getElementById('total-visitors').textContent = data.totalVisitors;
        }
        if (document.getElementById('page-views')) {
            document.getElementById('page-views').textContent = data.pageViews;
        }
        if (document.getElementById('avg-session')) {
            document.getElementById('avg-session').textContent = data.avgSession;
        }
        if (document.getElementById('bounce-rate')) {
            document.getElementById('bounce-rate').textContent = data.bounceRate + '%';
        }

        return data;
    },

    // Calculate average session duration
    calculateAvgSession() {
        const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
        if (sessions.length === 0) return '0m 0s';
        
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const avgSeconds = Math.floor(totalDuration / sessions.length);
        const minutes = Math.floor(avgSeconds / 60);
        const seconds = avgSeconds % 60;
        
        return `${minutes}m ${seconds}s`;
    },

    // Calculate bounce rate
    calculateBounceRate() {
        const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
        if (sessions.length === 0) return 0;
        
        const bounced = sessions.filter(s => s.pages === 1).length;
        return Math.round((bounced / sessions.length) * 100);
    },

    // Start realtime tracking
    startRealtimeTracking() {
        setInterval(() => {
            this.loadAnalytics();
        }, 30000); // Update every 30 seconds
    }
};

// User Management
const UserManagement = {
    currentPage: 1,
    itemsPerPage: 10,

    // Load all users
    loadUsers(page = 1) {
        this.currentPage = page;
        const users = JSON.parse(localStorage.getItem('ace1_users') || '[]');
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedUsers = users.slice(start, end);

        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        paginatedUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id.substr(0, 8)}...</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>₹${user.wallet?.balance || 0}</td>
                <td><span class="status-badge ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button onclick="UserManagement.viewUser('${user.id}')" class="btn-icon" title="View">👁️</button>
                    <button onclick="UserManagement.editUser('${user.id}')" class="btn-icon" title="Edit">✏️</button>
                    <button onclick="UserManagement.toggleUserStatus('${user.id}')" class="btn-icon" title="Toggle Status">${user.isActive ? '🚫' : '✅'}</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update pagination
        const totalPages = Math.ceil(users.length / this.itemsPerPage);
        const pageInfo = document.getElementById('users-page-info');
        if (pageInfo) {
            pageInfo.textContent = `Page ${page} of ${totalPages}`;
        }
    },

    // View user details
    viewUser(userId) {
        const users = JSON.parse(localStorage.getItem('ace1_users') || '[]');
        const user = users.find(u => u.id === userId);
        if (user) {
            alert(`User Details:\n\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nPhone: ${user.phone || 'N/A'}\nWallet: ₹${user.wallet?.balance || 0}\nStatus: ${user.isActive ? 'Active' : 'Inactive'}`);
        }
    },

    // Edit user
    editUser(userId) {
        alert('Edit user functionality - Coming soon!');
    },

    // Toggle user status
    toggleUserStatus(userId) {
        const users = JSON.parse(localStorage.getItem('ace1_users') || '[]');
        const user = users.find(u => u.id === userId);
        
        if (user) {
            user.isActive = !user.isActive;
            localStorage.setItem('ace1_users', JSON.stringify(users));
            this.loadUsers(this.currentPage);
            alert(`User ${user.isActive ? 'activated' : 'deactivated'} successfully!`);
        }
    },

    // Export users to CSV
    exportUsers() {
        const users = JSON.parse(localStorage.getItem('ace1_users') || '[]');
        const csv = this.convertToCSV(users);
        this.downloadCSV(csv, 'users_export.csv');
    },

    // Convert to CSV
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Created At', 'Wallet Balance', 'Status'];
        const rows = data.map(user => [
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.phone || '',
            user.createdAt,
            user.wallet?.balance || 0,
            user.isActive ? 'Active' : 'Inactive'
        ]);
        
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    // Download CSV
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// Inventory Management
const InventoryManagement = {
    // Load inventory
    loadInventory() {
        const products = JSON.parse(localStorage.getItem('ace1_products') || '[]');
        const tbody = document.getElementById('inventory-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        let lowStockCount = 0;
        let outOfStockCount = 0;
        let totalValue = 0;

        products.forEach(product => {
            if (product.stock < 10) lowStockCount++;
            if (product.stock === 0) outOfStockCount++;
            totalValue += product.price * product.stock;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
                <td>${product.name}</td>
                <td>${product.sku || 'N/A'}</td>
                <td>${product.category}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${product.stock}" 
                           onchange="InventoryManagement.updateStock('${product.id}', this.value)"
                           class="stock-input ${product.stock < 10 ? 'low-stock' : ''}"
                           min="0">
                </td>
                <td><span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
                <td>
                    <button onclick="InventoryManagement.editProduct('${product.id}')" class="btn-icon" title="Edit">✏️</button>
                    <button onclick="InventoryManagement.deleteProduct('${product.id}')" class="btn-icon" title="Delete">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update stats
        if (document.getElementById('total-products')) {
            document.getElementById('total-products').textContent = products.length;
        }
        if (document.getElementById('low-stock-count')) {
            document.getElementById('low-stock-count').textContent = lowStockCount;
        }
        if (document.getElementById('out-of-stock-count')) {
            document.getElementById('out-of-stock-count').textContent = outOfStockCount;
        }
        if (document.getElementById('inventory-value')) {
            document.getElementById('inventory-value').textContent = `₹${totalValue.toFixed(2)}`;
        }
    },

    // Update stock
    updateStock(productId, newStock) {
        const products = JSON.parse(localStorage.getItem('ace1_products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (product) {
            product.stock = parseInt(newStock);
            localStorage.setItem('ace1_products', JSON.stringify(products));
            
            // Sync with index page
            this.syncInventoryWithIndexPage();
            
            this.loadInventory();
            alert('Stock updated successfully!');
        }
    },

    // Sync inventory with index page
    syncInventoryWithIndexPage() {
        const products = JSON.parse(localStorage.getItem('ace1_products') || '[]');
        
        // Trigger custom event for index page
        window.dispatchEvent(new CustomEvent('inventoryUpdated', { 
            detail: { products, timestamp: Date.now() }
        }));
        
        console.log('✅ Inventory synced with index page');
    },

    // Edit product
    editProduct(productId) {
        alert('Edit product functionality - Coming soon!');
    },

    // Delete product
    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            const products = JSON.parse(localStorage.getItem('ace1_products') || '[]');
            const filtered = products.filter(p => p.id !== productId);
            localStorage.setItem('ace1_products', JSON.stringify(filtered));
            this.loadInventory();
            this.syncInventoryWithIndexPage();
            alert('Product deleted successfully!');
        }
    },

    // Export inventory
    exportInventory() {
        const products = JSON.parse(localStorage.getItem('ace1_products') || '[]');
        const csv = this.convertToCSV(products);
        this.downloadCSV(csv, 'inventory_export.csv');
    },

    // Convert to CSV
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
        const rows = data.map(product => [
            product.id,
            product.name,
            product.sku || '',
            product.category,
            product.price,
            product.stock,
            product.stock > 0 ? 'In Stock' : 'Out of Stock'
        ]);
        
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    // Download CSV
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Analytics.init();
    });
} else {
    Analytics.init();
}

// Export for global access
window.Analytics = Analytics;
window.UserManagement = UserManagement;
window.InventoryManagement = InventoryManagement;

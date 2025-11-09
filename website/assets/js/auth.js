// User Authentication System
class AuthSystem {
  constructor() {
    this.currentUser = this.loadSession();
    this.users = this.loadUsers();
    this.updateUI();
  }

  // Load users from localStorage (in production, this would be server-side)
  loadUsers() {
    const users = localStorage.getItem('ace1_users');
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('ace1_users', JSON.stringify(this.users));
  }

  // Load current session
  loadSession() {
    const session = localStorage.getItem('ace1_session');
    return session ? JSON.parse(session) : null;
  }

  // Save session
  saveSession(user) {
    localStorage.setItem('ace1_session', JSON.stringify(user));
    this.currentUser = user;
    this.updateUI();
  }

  // Register new user
  register(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Validate email format
    if (!this.validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Check if user already exists
    if (this.users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Validate password strength
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password: this.hashPassword(password), // In production, use proper encryption
      firstName,
      lastName,
      phone,
      wallet: {
        balance: 0,
        transactions: []
      },
      createdAt: new Date().toISOString(),
      orders: []
    };

    this.users.push(newUser);
    this.saveUsers();

    // Auto-login after registration
    const userSession = { ...newUser };
    delete userSession.password;
    this.saveSession(userSession);

    return { success: true, message: 'Registration successful!', user: userSession };
  }

  // Login user
  login(email, password) {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, message: 'Incorrect password' };
    }

    // Create session
    const userSession = { ...user };
    delete userSession.password;
    this.saveSession(userSession);

    return { success: true, message: 'Login successful!', user: userSession };
  }

  // Logout user
  logout() {
    localStorage.removeItem('ace1_session');
    this.currentUser = null;
    this.updateUI();
    window.location.href = '/';
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Update user profile
  updateProfile(updates) {
    if (!this.isLoggedIn()) {
      return { success: false, message: 'Not logged in' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // Update user data
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    this.saveSession(updatedUser);

    return { success: true, message: 'Profile updated successfully' };
  }

  // Add order to user history
  addOrder(order) {
    if (!this.isLoggedIn()) {
      return { success: false, message: 'Not logged in' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    this.users[userIndex].orders.push(order);
    this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    this.saveSession(updatedUser);

    return { success: true, message: 'Order saved' };
  }

  // Get user orders
  getOrders() {
    if (!this.isLoggedIn()) {
      return [];
    }
    return this.currentUser.orders || [];
  }

  // Get wallet balance
  getWalletBalance() {
    if (!this.isLoggedIn()) {
      return 0;
    }
    // Initialize wallet if it doesn't exist (for old users)
    if (!this.currentUser.wallet) {
      this.currentUser.wallet = { balance: 0, transactions: [] };
    }
    return this.currentUser.wallet.balance || 0;
  }

  // Add money to wallet
  addToWallet(amount, description = 'Added funds') {
    if (!this.isLoggedIn()) {
      return { success: false, message: 'Not logged in' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // Initialize wallet if it doesn't exist
    if (!this.users[userIndex].wallet) {
      this.users[userIndex].wallet = { balance: 0, transactions: [] };
    }

    // Add transaction
    const transaction = {
      id: 'TXN-' + Date.now(),
      type: 'credit',
      amount: amount,
      description: description,
      date: new Date().toISOString(),
      balanceAfter: this.users[userIndex].wallet.balance + amount
    };

    this.users[userIndex].wallet.balance += amount;
    this.users[userIndex].wallet.transactions.push(transaction);
    this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    this.saveSession(updatedUser);

    return { success: true, message: 'Wallet updated', balance: this.users[userIndex].wallet.balance };
  }

  // Deduct from wallet
  deductFromWallet(amount, description = 'Purchase') {
    if (!this.isLoggedIn()) {
      return { success: false, message: 'Not logged in' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // Initialize wallet if it doesn't exist
    if (!this.users[userIndex].wallet) {
      this.users[userIndex].wallet = { balance: 0, transactions: [] };
    }

    // Check balance
    if (this.users[userIndex].wallet.balance < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }

    // Add transaction
    const transaction = {
      id: 'TXN-' + Date.now(),
      type: 'debit',
      amount: amount,
      description: description,
      date: new Date().toISOString(),
      balanceAfter: this.users[userIndex].wallet.balance - amount
    };

    this.users[userIndex].wallet.balance -= amount;
    this.users[userIndex].wallet.transactions.push(transaction);
    this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    this.saveSession(updatedUser);

    return { success: true, message: 'Payment successful', balance: this.users[userIndex].wallet.balance };
  }

  // Get wallet transactions
  getWalletTransactions() {
    if (!this.isLoggedIn()) {
      return [];
    }
    // Initialize wallet if it doesn't exist
    if (!this.currentUser.wallet) {
      this.currentUser.wallet = { balance: 0, transactions: [] };
    }
    return this.currentUser.wallet.transactions || [];
  }

  // Simple password hashing (In production, use bcrypt or similar)
  hashPassword(password) {
    // This is NOT secure - just for demonstration
    // In production, use proper server-side hashing
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hash_' + hash.toString(36);
  }

  // Validate email format
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Update UI elements based on auth state
  updateUI() {
    const authLinks = document.querySelectorAll('.auth-link');
    const userLinks = document.querySelectorAll('.user-link');
    const userNameElements = document.querySelectorAll('.user-name');

    if (this.isLoggedIn()) {
      authLinks.forEach(link => link.style.display = 'none');
      userLinks.forEach(link => link.style.display = 'inline-block');
      userNameElements.forEach(el => {
        el.textContent = this.currentUser.firstName || this.currentUser.email;
      });
    } else {
      authLinks.forEach(link => link.style.display = 'inline-block');
      userLinks.forEach(link => link.style.display = 'none');
    }
  }

  // Require authentication (redirect if not logged in)
  requireAuth(redirectUrl = '/login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }
}

// Initialize global auth instance
window.auth = new AuthSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthSystem;
}

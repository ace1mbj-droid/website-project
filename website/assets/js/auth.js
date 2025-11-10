// User Authentication System with Encryption
class AuthSystem {
  constructor() {
    this.encryptionEnabled = false;
    this.storageKey = 'ace1_secure_storage_key';
    this.init();
  }

  // Initialize auth system
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
    
    this.currentUser = await this.loadSession();
    this.users = await this.loadUsers();
    this.updateUI();
  }

  // Load users from localStorage (encrypted)
  async loadUsers() {
    const users = localStorage.getItem('ace1_users');
    if (!users) return [];
    
    if (this.encryptionEnabled && this.storageEncryptionKey) {
      try {
        const decrypted = await window.cryptoUtils.decrypt(users, this.storageEncryptionKey);
        return JSON.parse(decrypted);
      } catch (e) {
        console.warn('Failed to decrypt users, returning raw data');
        return JSON.parse(users);
      }
    }
    
    return JSON.parse(users);
  }

  // Save users to localStorage (encrypted)
  async saveUsers() {
    const usersJson = JSON.stringify(this.users);
    
    if (this.encryptionEnabled && this.storageEncryptionKey) {
      try {
        const encrypted = await window.cryptoUtils.encrypt(usersJson, this.storageEncryptionKey);
        localStorage.setItem('ace1_users', encrypted);
        return;
      } catch (e) {
        console.error('Failed to encrypt users, saving unencrypted');
      }
    }
    
    localStorage.setItem('ace1_users', usersJson);
  }

  // Load current session (encrypted)
  async loadSession() {
    const session = localStorage.getItem('ace1_session');
    if (!session) return null;
    
    if (this.encryptionEnabled && this.storageEncryptionKey) {
      try {
        const decrypted = await window.cryptoUtils.decrypt(session, this.storageEncryptionKey);
        return JSON.parse(decrypted);
      } catch (e) {
        console.warn('Failed to decrypt session, returning raw data');
        return JSON.parse(session);
      }
    }
    
    return JSON.parse(session);
  }

  // Save session (encrypted)
  async saveSession(user) {
    const userJson = JSON.stringify(user);
    
    if (this.encryptionEnabled && this.storageEncryptionKey) {
      try {
        const encrypted = await window.cryptoUtils.encrypt(userJson, this.storageEncryptionKey);
        localStorage.setItem('ace1_session', encrypted);
        this.currentUser = user;
        this.updateUI();
        return;
      } catch (e) {
        console.error('Failed to encrypt session, saving unencrypted');
      }
    }
    
    localStorage.setItem('ace1_session', userJson);
    this.currentUser = user;
    this.updateUI();
  }

  // Register new user
  async register(userData) {
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

    // Hash password securely
    const passwordHash = await this.hashPassword(password);

    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password: passwordHash,
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
    await this.saveUsers();

    // Auto-login after registration
    const userSession = { ...newUser };
    delete userSession.password;
    await this.saveSession(userSession);

    return { success: true, message: 'Registration successful!', user: userSession };
  }

  // Login user with rate limiting and secure password verification
  async login(email, password) {
    // Check for account lockout
    if (window.configManager && window.configManager.isLockedOut(email)) {
      return { success: false, message: 'Account locked due to too many failed attempts. Try again in 15 minutes.' };
    }

    const user = this.users.find(u => u.email === email);

    if (!user) {
      if (window.configManager) {
        window.configManager.recordFailedLogin(email);
      }
      return { success: false, message: 'Invalid email or password' };
    }

    // Verify password securely
    const passwordHash = await this.hashPassword(password);
    if (user.password !== passwordHash) {
      if (window.configManager) {
        window.configManager.recordFailedLogin(email);
      }
      return { success: false, message: 'Invalid email or password' };
    }

    // Clear failed login attempts on successful login
    if (window.configManager) {
      window.configManager.clearFailedLogins(email);
    }

    // Create session
    const userSession = { ...user };
    delete userSession.password;
    await this.saveSession(userSession);

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
  async updateProfile(updates) {
    if (!this.isLoggedIn()) {
      return { success: false, message: 'Not logged in' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // Update user data
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    await this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    await this.saveSession(updatedUser);

    return { success: true, message: 'Profile updated successfully' };
  }

  // Add order to user history
  async addOrder(order) {
    if (!this.isLoggedIn()) {
      return { success: false, message: 'Not logged in' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    this.users[userIndex].orders.push(order);
    await this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    await this.saveSession(updatedUser);

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
  async addToWallet(amount, description = 'Added funds') {
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
    await this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    await this.saveSession(updatedUser);

    return { success: true, message: 'Wallet updated', balance: this.users[userIndex].wallet.balance };
  }

  // Deduct from wallet
  async deductFromWallet(amount, description = 'Purchase') {
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
    await this.saveUsers();

    // Update session
    const updatedUser = { ...this.users[userIndex] };
    delete updatedUser.password;
    await this.saveSession(updatedUser);

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

  // Secure password hashing using SHA-256
  async hashPassword(password) {
    if (window.cryptoUtils) {
      return await window.cryptoUtils.hashPassword(password);
    }
    
    // Fallback to simple hash (not recommended)
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

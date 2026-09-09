/**
 * Storage Module - localStorage Wrapper
 * Handles all data persistence operations
 */

const Storage = {
  KEYS: {
    TRANSACTIONS: 'finance_transactions',
    CATEGORIES: 'finance_categories',
    SETTINGS: 'finance_settings',
    CHAT_HISTORY: 'finance_chat_history',
  },

  /**
   * Get transactions from localStorage
   * @returns {Array} Array of transaction objects
   */
  getTransactions() {
    const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Save transactions to localStorage
   * @param {Array} transactions - Array of transaction objects
   */
  saveTransactions(transactions) {
    localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
    // Dispatch custom event for cross-tab sync
    window.dispatchEvent(new Event('storage-change'));
  },

  /**
   * Add a single transaction
   * @param {Object} transaction - Transaction object
   * @returns {Object} The added transaction with id
   */
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const newTransaction = {
      ...transaction,
      id: transaction.id || this.generateId(),
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  },

  /**
   * Update a transaction
   * @param {string} id - Transaction ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated transaction or null if not found
   */
  updateTransaction(id, updates) {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveTransactions(transactions);
    return transactions[index];
  },

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @returns {boolean} Success status
   */
  deleteTransaction(id) {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    this.saveTransactions(filtered);
    return true;
  },

  /**
   * Get categories from localStorage
   * @returns {Array} Array of category objects
   */
  getCategories() {
    const data = localStorage.getItem(this.KEYS.CATEGORIES);
    if (data) return JSON.parse(data);
    
    // Default categories
    const defaults = [
      { id: 'cat_1', name: 'Makanan', type: 'expense', color: '#ef4444', icon: 'fa-utensils' },
      { id: 'cat_2', name: 'Transport', type: 'expense', color: '#3b82f6', icon: 'fa-car' },
      { id: 'cat_3', name: 'Belanja', type: 'expense', color: '#8b5cf6', icon: 'fa-shopping-bag' },
      { id: 'cat_4', name: 'Hiburan', type: 'expense', color: '#f59e0b', icon: 'fa-film' },
      { id: 'cat_5', name: 'Gaji', type: 'income', color: '#22c55e', icon: 'fa-money-bill' },
      { id: 'cat_6', name: 'Bonus', type: 'income', color: '#10b981', icon: 'fa-gift' },
      { id: 'cat_7', name: 'Lainnya', type: 'expense', color: '#6b7280', icon: 'fa-folder' },
    ];
    this.saveCategories(defaults);
    return defaults;
  },

  /**
   * Save categories to localStorage
   * @param {Array} categories - Array of category objects
   */
  saveCategories(categories) {
    localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('storage-change'));
  },

  /**
   * Add a category
   * @param {Object} category - Category object
   * @returns {Object} The added category
   */
  addCategory(category) {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: category.id || this.generateId(),
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  },

  /**
   * Update a category
   * @param {string} id - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated category or null if not found
   */
  updateCategory(id, updates) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    categories[index] = { ...categories[index], ...updates };
    this.saveCategories(categories);
    return categories[index];
  },

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {boolean} Success status
   */
  deleteCategory(id) {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    this.saveCategories(filtered);
    return true;
  },

  /**
   * Get settings from localStorage
   * @returns {Object} Settings object
   */
  getSettings() {
    const data = localStorage.getItem(this.KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      darkMode: false,
      currency: 'IDR',
      locale: 'id-ID',
      version: '1.0.0',
    };
  },

  /**
   * Save settings to localStorage
   * @param {Object} settings - Settings object
   */
  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('storage-change'));
  },

  /**
   * Get chat history from localStorage
   * @returns {Array} Array of chat messages
   */
  getChatHistory() {
    const data = localStorage.getItem(this.KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Save chat history to localStorage
   * @param {Array} history - Array of chat messages
   */
  saveChatHistory(history) {
    localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(history));
  },

  /**
   * Add a chat message
   * @param {Object} message - Chat message object
   */
  addChatMessage(message) {
    const history = this.getChatHistory();
    history.push({
      ...message,
      timestamp: new Date().toISOString(),
    });
    this.saveChatHistory(history);
  },

  /**
   * Clear chat history
   */
  clearChatHistory() {
    localStorage.removeItem(this.KEYS.CHAT_HISTORY);
  },

  /**
   * Export all data as JSON
   * @returns {Object} All data
   */
  exportAllData() {
    return {
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  },

  /**
   * Import data from JSON
   * @param {Object} data - Data to import
   * @returns {boolean} Success status
   */
  importAllData(data) {
    try {
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.categories) this.saveCategories(data.categories);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  },

  /**
   * Reset all data to defaults
   */
  resetAllData() {
    localStorage.removeItem(this.KEYS.TRANSACTIONS);
    localStorage.removeItem(this.KEYS.CATEGORIES);
    localStorage.removeItem(this.KEYS.CHAT_HISTORY);
    // Keep settings but reset some
    const settings = this.getSettings();
    settings.version = '1.0.0';
    this.saveSettings(settings);
    window.dispatchEvent(new Event('storage-change'));
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
};

// Listen for storage changes from other tabs
window.addEventListener('storage', () => {
  window.dispatchEvent(new Event('storage-change'));
});

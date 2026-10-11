/**
 * Storage Module - Unified Storage Interface
 * Handles all data persistence operations with Supabase (cloud) and localStorage (demo/offline)
 */

const Storage = {
  KEYS: {
    TRANSACTIONS: 'finance_transactions',
    CATEGORIES: 'finance_categories',
    SETTINGS: 'finance_settings',
    CHAT_HISTORY: 'finance_chat_history',
  },

  /**
   * Check if in demo mode (using localStorage)
   */
  isDemoMode() {
    return localStorage.getItem('demo_mode') === 'true';
  },

  /**
   * Check if Supabase is available and user is authenticated
   */
  useSupabase() {
    return !this.isDemoMode() && typeof SupabaseDB !== 'undefined' && SupabaseDB.isInitialized && SupabaseDB.isAuthenticated();
  },

  // ========== TRANSACTIONS ==========

  /**
   * Get all transactions
   * @returns {Promise<Array>} Array of transaction objects
   */
  async getTransactions() {
    if (this.useSupabase()) {
      return await SupabaseDB.getTransactions();
    } else {
      // Demo mode - use localStorage
      const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    }
  },

  /**
   * Save transactions to localStorage (demo mode only)
   * @param {Array} transactions - Array of transaction objects
   */
  saveTransactionsLocal(transactions) {
    localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
    window.dispatchEvent(new Event('storage-change'));
  },

  /**
   * Add a single transaction
   * @param {Object} transaction - Transaction object
   * @returns {Promise<Object>} The added transaction with id
   */
  async addTransaction(transaction) {
    if (this.useSupabase()) {
      return await SupabaseDB.addTransaction(transaction);
    } else {
      // Demo mode - use localStorage
      const transactions = await this.getTransactions();
      const newTransaction = {
        ...transaction,
        id: this.generateId(),
        created_at: new Date().toISOString(),
      };
      transactions.push(newTransaction);
      this.saveTransactionsLocal(transactions);
      window.dispatchEvent(new Event('data-change'));
      return newTransaction;
    }
  },

  /**
   * Update a transaction
   * @param {string} id - Transaction ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated transaction or null if not found
   */
  async updateTransaction(id, updates) {
    if (this.useSupabase()) {
      return await SupabaseDB.updateTransaction(id, updates);
    } else {
      // Demo mode - use localStorage
      const transactions = await this.getTransactions();
      const index = transactions.findIndex(t => t.id === id);
      if (index === -1) return null;

      transactions[index] = {
        ...transactions[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveTransactionsLocal(transactions);
      window.dispatchEvent(new Event('data-change'));
      return transactions[index];
    }
  },

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTransaction(id) {
    if (this.useSupabase()) {
      return await SupabaseDB.deleteTransaction(id);
    } else {
      // Demo mode - use localStorage
      const transactions = await this.getTransactions();
      const filtered = transactions.filter(t => t.id !== id);
      if (filtered.length === transactions.length) return false;
      this.saveTransactionsLocal(filtered);
      window.dispatchEvent(new Event('data-change'));
      return true;
    }
  },

  // ========== CATEGORIES ==========

  /**
   * Get all categories
   * @returns {Promise<Array>} Array of category objects
   */
  async getCategories() {
    if (this.useSupabase()) {
      return await SupabaseDB.getCategories();
    } else {
      // Demo mode - use localStorage
      const data = localStorage.getItem(this.KEYS.CATEGORIES);
      if (data) return JSON.parse(data);

      // Default categories
      const defaults = [
        { id: 'cat_1', name: 'Makanan & Minuman', type: 'expense', color: '#ef4444', icon: '🍔', budget: 0 },
        { id: 'cat_2', name: 'Transport', type: 'expense', color: '#f59e0b', icon: '🚗', budget: 0 },
        { id: 'cat_3', name: 'Belanja', type: 'expense', color: '#8b5cf6', icon: '🛒', budget: 0 },
        { id: 'cat_4', name: 'Hiburan', type: 'expense', color: '#ec4899', icon: '🎮', budget: 0 },
        { id: 'cat_5', name: 'Tagihan', type: 'expense', color: '#6366f1', icon: '💡', budget: 0 },
        { id: 'cat_6', name: 'Kesehatan', type: 'expense', color: '#10b981', icon: '💊', budget: 0 },
        { id: 'cat_7', name: 'Gaji', type: 'income', color: '#22c55e', icon: '💰', budget: 0 },
        { id: 'cat_8', name: 'Bonus', type: 'income', color: '#14b8a6', icon: '🎁', budget: 0 },
        { id: 'cat_9', name: 'Investasi', type: 'income', color: '#06b6d4', icon: '📈', budget: 0 },
        { id: 'cat_10', name: 'Lainnya', type: 'both', color: '#64748b', icon: '📦', budget: 0 },
      ];
      this.saveCategoriesLocal(defaults);
      return defaults;
    }
  },

  /**
   * Save categories to localStorage (demo mode only)
   * @param {Array} categories - Array of category objects
   */
  saveCategoriesLocal(categories) {
    localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('storage-change'));
  },

  /**
   * Add a category
   * @param {Object} category - Category object
   * @returns {Promise<Object>} The added category
   */
  async addCategory(category) {
    if (this.useSupabase()) {
      return await SupabaseDB.addCategory(category);
    } else {
      // Demo mode - use localStorage
      const categories = await this.getCategories();
      const newCategory = {
        ...category,
        id: category.id || this.generateId(),
        budget: category.budget || 0,
        created_at: new Date().toISOString(),
      };
      categories.push(newCategory);
      this.saveCategoriesLocal(categories);
      window.dispatchEvent(new Event('data-change'));
      return newCategory;
    }
  },

  /**
   * Update a category
   * @param {string} id - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated category or null if not found
   */
  async updateCategory(id, updates) {
    if (this.useSupabase()) {
      return await SupabaseDB.updateCategory(id, updates);
    } else {
      // Demo mode - use localStorage
      const categories = await this.getCategories();
      const index = categories.findIndex(c => c.id === id);
      if (index === -1) return null;

      categories[index] = {
        ...categories[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveCategoriesLocal(categories);
      window.dispatchEvent(new Event('data-change'));
      return categories[index];
    }
  },

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    if (this.useSupabase()) {
      return await SupabaseDB.deleteCategory(id);
    } else {
      // Demo mode - use localStorage
      const categories = await this.getCategories();
      const filtered = categories.filter(c => c.id !== id);
      if (filtered.length === categories.length) return false;
      this.saveCategoriesLocal(filtered);
      window.dispatchEvent(new Event('data-change'));
      return true;
    }
  },

  /**
   * Get category budget usage
   * @param {string} categoryId - Category ID or name
   * @returns {Promise<Object>} Budget info {limit, spent, percentage, exceeded}
   */
  async getCategoryBudgetUsage(categoryId) {
    const transactions = await this.getTransactions();
    const categories = await this.getCategories();
    const category = categories.find(c => c.id === categoryId || c.name === categoryId);

    if (!category) return null;

    const spent = transactions
      .filter(t => (t.category === category.name || t.category === categoryId) && t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const limit = category.budget || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return {
      limit,
      spent,
      percentage: Math.min(percentage, 100),
      exceeded: spent > limit,
      remaining: Math.max(limit - spent, 0),
    };
  },

  // ========== SETTINGS ==========

  /**
   * Get settings
   * @returns {Promise<Object>} Settings object
   */
  async getSettings() {
    if (this.useSupabase()) {
      const settings = await SupabaseDB.getSettings();
      return settings || this.getDefaultSettings();
    } else {
      // Demo mode - use localStorage
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      const defaults = this.getDefaultSettings();
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    }
  },

  /**
   * Get default settings
   * @returns {Object} Default settings
   */
  getDefaultSettings() {
    return {
      dark_mode: true,
      currency: 'IDR',
      language: 'id',
      notifications: true,
      gemini_api_key: '',
      gemini_model: 'gemini-1.5-flash',
    };
  },

  /**
   * Save settings
   * @param {Object} settings - Settings object
   * @returns {Promise<Object>} Updated settings
   */
  async saveSettings(settings) {
    if (this.useSupabase()) {
      return await SupabaseDB.updateSettings(settings);
    } else {
      // Demo mode - use localStorage
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
      window.dispatchEvent(new Event('storage-change'));
      window.dispatchEvent(new Event('data-change'));
      return settings;
    }
  },

  // ========== CHAT HISTORY ==========

  /**
   * Get chat history
   * @returns {Promise<Array>} Array of chat messages
   */
  async getChatHistory() {
    if (this.useSupabase()) {
      return await SupabaseDB.getChatHistory();
    } else {
      // Demo mode - use localStorage
      const data = localStorage.getItem(this.KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    }
  },

  /**
   * Save chat history to localStorage (demo mode only)
   * @param {Array} history - Array of chat messages
   */
  saveChatHistoryLocal(history) {
    localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(history));
  },

  /**
   * Add a chat message
   * @param {Object} message - Chat message object
   * @returns {Promise<Object>} Added message
   */
  async addChatMessage(message) {
    if (this.useSupabase()) {
      return await SupabaseDB.addChatMessage(message);
    } else {
      // Demo mode - use localStorage
      const history = await this.getChatHistory();
      const newMessage = {
        ...message,
        id: this.generateId(),
        created_at: new Date().toISOString(),
      };
      history.push(newMessage);
      this.saveChatHistoryLocal(history);
      return newMessage;
    }
  },

  /**
   * Clear chat history
   * @returns {Promise<boolean>} Success status
   */
  async clearChatHistory() {
    if (this.useSupabase()) {
      return await SupabaseDB.clearChatHistory();
    } else {
      // Demo mode - use localStorage
      localStorage.removeItem(this.KEYS.CHAT_HISTORY);
      return true;
    }
  },

  // ========== DATA MANAGEMENT ==========

  /**
   * Export all data as JSON
   * @returns {Promise<Object>} All data
   */
  async exportAllData() {
    if (this.useSupabase()) {
      return await SupabaseDB.exportData();
    } else {
      // Demo mode - export from localStorage
      return {
        transactions: await this.getTransactions(),
        categories: await this.getCategories(),
        settings: await this.getSettings(),
        chatHistory: await this.getChatHistory(),
        exportDate: new Date().toISOString(),
        version: '2.0.0',
      };
    }
  },

  /**
   * Import data from JSON
   * @param {Object} data - Data to import
   * @returns {Promise<boolean>} Success status
   */
  async importAllData(data) {
    try {
      if (this.useSupabase()) {
        return await SupabaseDB.importData(data);
      } else {
        // Demo mode - import to localStorage
        if (data.transactions) this.saveTransactionsLocal(data.transactions);
        if (data.categories) this.saveCategoriesLocal(data.categories);
        if (data.settings) await this.saveSettings(data.settings);
        if (data.chatHistory) this.saveChatHistoryLocal(data.chatHistory);
        
        window.dispatchEvent(new Event('data-change'));
        return true;
      }
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  },

  /**
   * Reset all data to defaults
   * @returns {Promise<void>}
   */
  async resetAllData() {
    if (this.isDemoMode()) {
      localStorage.removeItem(this.KEYS.TRANSACTIONS);
      localStorage.removeItem(this.KEYS.CATEGORIES);
      localStorage.removeItem(this.KEYS.CHAT_HISTORY);
      localStorage.removeItem(this.KEYS.SETTINGS);
      window.dispatchEvent(new Event('storage-change'));
      window.dispatchEvent(new Event('data-change'));
    }
    // For Supabase, user should delete data manually or we provide a clear method
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Initialize storage - load default data if needed
   * @returns {Promise<void>}
   */
  async init() {
    // Ensure default categories exist
    const categories = await this.getCategories();
    if (categories.length === 0) {
      console.log('Initializing default categories...');
    }

    // Ensure settings exist
    const settings = await this.getSettings();
    if (!settings) {
      await this.saveSettings(this.getDefaultSettings());
    }
  },
};

// Listen for storage changes from other tabs
window.addEventListener('storage', () => {
  window.dispatchEvent(new Event('storage-change'));
});

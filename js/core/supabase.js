/**
 * Supabase Integration Module
 * Handles all database operations with Supabase
 */

const SupabaseDB = {
  client: null,
  isInitialized: false,
  currentUser: null,

  /**
   * Initialize Supabase client
   * @param {string} supabaseUrl - Your Supabase project URL
   * @param {string} supabaseKey - Your Supabase anon/public key
   */
  init(supabaseUrl, supabaseKey) {
    try {
      if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return false;
      }

      this.client = supabase.createClient(supabaseUrl, supabaseKey);
      this.isInitialized = true;
      
      // Check if user is already logged in
      this.checkAuth();
      
      // Listen to auth state changes
      this.client.auth.onAuthStateChange((event, session) => {
        this.currentUser = session?.user || null;
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', this.currentUser.email);
          window.dispatchEvent(new CustomEvent('auth-change', { detail: { user: this.currentUser } }));
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          this.currentUser = null;
          window.dispatchEvent(new CustomEvent('auth-change', { detail: { user: null } }));
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      return false;
    }
  },

  /**
   * Check current authentication status
   */
  async checkAuth() {
    try {
      const { data: { session } } = await this.client.auth.getSession();
      this.currentUser = session?.user || null;
      return this.currentUser;
    } catch (error) {
      console.error('Failed to check auth:', error);
      return null;
    }
  },

  /**
   * Sign up new user
   */
  async signUp(email, password) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign in user
   */
  async signIn(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign out user
   */
  async signOut() {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      this.currentUser = null;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  },

  // ========== TRANSACTIONS ==========

  /**
   * Get all transactions for current user
   */
  async getTransactions() {
    if (!this.isAuthenticated()) return [];

    try {
      const { data, error } = await this.client
        .from('transactions')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  },

  /**
   * Add new transaction
   */
  async addTransaction(transaction) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const newTransaction = {
        ...transaction,
        user_id: this.currentUser.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();

      if (error) throw error;
      
      // Dispatch event for UI updates
      window.dispatchEvent(new Event('data-change'));
      
      return data;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  },

  /**
   * Update transaction
   */
  async updateTransaction(id, updates) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await this.client
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', this.currentUser.id)
        .select()
        .single();

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return data;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  },

  /**
   * Delete transaction
   */
  async deleteTransaction(id) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await this.client
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', this.currentUser.id);

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return true;
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  },

  // ========== CATEGORIES ==========

  /**
   * Get all categories for current user
   */
  async getCategories() {
    if (!this.isAuthenticated()) return [];

    try {
      const { data, error } = await this.client
        .from('categories')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  },

  /**
   * Add new category
   */
  async addCategory(category) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const newCategory = {
        ...category,
        user_id: this.currentUser.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return data;
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  },

  /**
   * Update category
   */
  async updateCategory(id, updates) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await this.client
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', this.currentUser.id)
        .select()
        .single();

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(id) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await this.client
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', this.currentUser.id);

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  },

  // ========== SETTINGS ==========

  /**
   * Get user settings
   */
  async getSettings() {
    if (!this.isAuthenticated()) return null;

    try {
      const { data, error } = await this.client
        .from('settings')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .single();

      if (error) {
        // If no settings found, return default
        if (error.code === 'PGRST116') {
          return this.createDefaultSettings();
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  },

  /**
   * Create default settings for new user
   */
  async createDefaultSettings() {
    if (!this.isAuthenticated()) return null;

    try {
      const defaultSettings = {
        user_id: this.currentUser.id,
        dark_mode: true,
        currency: 'IDR',
        language: 'id',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from('settings')
        .insert([defaultSettings])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create default settings:', error);
      return null;
    }
  },

  /**
   * Update settings
   */
  async updateSettings(updates) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await this.client
        .from('settings')
        .upsert({
          user_id: this.currentUser.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },

  // ========== CHAT HISTORY ==========

  /**
   * Get chat history
   */
  async getChatHistory() {
    if (!this.isAuthenticated()) return [];

    try {
      const { data, error } = await this.client
        .from('chat_history')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return [];
    }
  },

  /**
   * Add chat message
   */
  async addChatMessage(message) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const newMessage = {
        ...message,
        user_id: this.currentUser.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from('chat_history')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add chat message:', error);
      throw error;
    }
  },

  /**
   * Clear chat history
   */
  async clearChatHistory() {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await this.client
        .from('chat_history')
        .delete()
        .eq('user_id', this.currentUser.id);

      if (error) throw error;
      
      window.dispatchEvent(new Event('data-change'));
      
      return true;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw error;
    }
  },

  // ========== UTILITY ==========

  /**
   * Initialize default categories for new user
   */
  async initializeDefaultCategories() {
    if (!this.isAuthenticated()) return;

    const defaultCategories = [
      { name: 'Makanan & Minuman', type: 'expense', icon: '🍔', color: '#ef4444' },
      { name: 'Transport', type: 'expense', icon: '🚗', color: '#f59e0b' },
      { name: 'Belanja', type: 'expense', icon: '🛒', color: '#8b5cf6' },
      { name: 'Hiburan', type: 'expense', icon: '🎮', color: '#ec4899' },
      { name: 'Tagihan', type: 'expense', icon: '💡', color: '#6366f1' },
      { name: 'Kesehatan', type: 'expense', icon: '💊', color: '#10b981' },
      { name: 'Gaji', type: 'income', icon: '💰', color: '#22c55e' },
      { name: 'Bonus', type: 'income', icon: '🎁', color: '#14b8a6' },
      { name: 'Investasi', type: 'income', icon: '📈', color: '#06b6d4' },
      { name: 'Lainnya', type: 'both', icon: '📦', color: '#64748b' },
    ];

    try {
      const existingCategories = await this.getCategories();
      
      if (existingCategories.length === 0) {
        for (const category of defaultCategories) {
          await this.addCategory(category);
        }
        console.log('Default categories initialized');
      }
    } catch (error) {
      console.error('Failed to initialize default categories:', error);
    }
  },

  /**
   * Export all user data
   */
  async exportData() {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const [transactions, categories, settings, chatHistory] = await Promise.all([
        this.getTransactions(),
        this.getCategories(),
        this.getSettings(),
        this.getChatHistory(),
      ]);

      return {
        transactions,
        categories,
        settings,
        chatHistory,
        exportDate: new Date().toISOString(),
        version: '2.0.0',
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  },

  /**
   * Import data (for migration or backup restore)
   */
  async importData(data) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      // Import categories first
      if (data.categories && data.categories.length > 0) {
        for (const category of data.categories) {
          const { id, user_id, created_at, ...categoryData } = category;
          await this.addCategory(categoryData);
        }
      }

      // Import transactions
      if (data.transactions && data.transactions.length > 0) {
        for (const transaction of data.transactions) {
          const { id, user_id, created_at, ...transactionData } = transaction;
          await this.addTransaction(transactionData);
        }
      }

      // Import settings
      if (data.settings) {
        const { user_id, created_at, updated_at, ...settingsData } = data.settings;
        await this.updateSettings(settingsData);
      }

      console.log('Data imported successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  },
};

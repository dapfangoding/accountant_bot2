/**
 * Utils Module - Utility Functions
 * Common helper functions used across the app
 */

const Utils = {
  /**
   * Format number as Indonesian Rupiah
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatRupiah(amount) {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  },

  /**
   * Parse Rupiah string to number
   * @param {string} rupiahString - Rupiah formatted string
   * @returns {number} Numeric value
   */
  parseRupiah(rupiahString) {
    if (typeof rupiahString === 'number') return rupiahString;
    if (!rupiahString) return 0;
    
    // Remove all non-numeric except minus and decimal
    const cleaned = rupiahString.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  },

  /**
   * Format date to Indonesian locale
   * @param {Date|string|number} date - Date to format
   * @param {string} format - Format type: 'short', 'long', 'full'
   * @returns {string} Formatted date string
   */
  formatDate(date, format = 'short') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    const options = {
      short: { day: 'numeric', month: 'numeric' },
      long: { day: 'numeric', month: 'long', year: 'numeric' },
      full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    };

    return d.toLocaleDateString('id-ID', options[format] || options.short);
  },

  /**
   * Generate unique ID
   * @param {string} prefix - Optional prefix for the ID
   * @returns {string} Unique ID
   */
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Debounce function execution
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(fn, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Throttle function execution
   * @param {Function} fn - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(fn, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Get category by name or create if not exists
   * @param {string} name - Category name
   * @param {string} type - Category type: 'income' or 'expense'
   * @returns {Object} Category object
   */
  getOrCreateCategory(name, type = 'expense') {
    const categories = Storage.getCategories();
    let category = categories.find(c => 
      c.name.toLowerCase() === name.toLowerCase()
    );

    if (!category) {
      const colors = {
        income: '#22c55e',
        expense: '#ef4444',
      };
      const icons = {
        income: 'fa-money-bill',
        expense: 'fa-folder',
      };

      category = {
        id: Utils.generateId('cat'),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        type,
        color: colors[type] || '#6b7280',
        icon: icons[type] || 'fa-folder',
      };
      Storage.addCategory(category);
    }

    return category;
  },

  /**
   * Detect category from description
   * @param {string} description - Transaction description
   * @returns {Object|null} Detected category or null
   */
  detectCategory(description) {
    const categories = Storage.getCategories();
    const desc = description.toLowerCase();

    // Keywords mapping
    const keywords = {
      'makanan': ['makan', 'nasi', 'restoran', 'warung', 'lapak', 'kuliner', 'food', 'lunch', 'dinner', 'breakfast'],
      'transport': ['ojek', 'gojek', 'grab', 'taxi', 'bensin', 'parkir', 'tol', 'transit', 'transport'],
      'belanja': ['belanja', 'shop', 'mall', 'pasar', 'supermarket', 'hypermart', 'alfamart', 'indomaret'],
      'hiburan': ['bioskop', 'film', 'game', 'netflix', 'spotify', 'musik', 'konser', 'nonton', 'entertainment'],
      'gaji': ['gaji', 'salary', 'upah', 'honor', 'payment', 'income'],
      'bonus': ['bonus', 'reward', 'hadiah', 'prize', 'commission'],
    };

    for (const [catName, words] of Object.entries(keywords)) {
      if (words.some(word => desc.includes(word))) {
        const category = categories.find(c => c.name.toLowerCase() === catName);
        if (category) return category;
      }
    }

    // Return default "Lainnya" if no match
    return categories.find(c => c.name === 'Lainnya') || categories[0];
  },

  /**
   * Calculate balance from transactions
   * @param {Array} transactions - Array of transactions
   * @returns {Object} Balance summary
   */
  calculateBalance(transactions) {
    const result = {
      balance: 0,
      income: 0,
      expense: 0,
    };

    transactions.forEach(t => {
      const amount = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        result.income += amount;
        result.balance += amount;
      } else {
        result.expense += amount;
        result.balance -= amount;
      }
    });

    return result;
  },

  /**
   * Group transactions by date
   * @param {Array} transactions - Array of transactions
   * @returns {Object} Grouped transactions by date
   */
  groupByDate(transactions) {
    return transactions.reduce((groups, t) => {
      const date = t.date || new Date().toISOString().split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
      return groups;
    }, {});
  },

  /**
   * Group transactions by category
   * @param {Array} transactions - Array of transactions
   * @returns {Object} Grouped transactions by category
   */
  groupByCategory(transactions) {
    return transactions.reduce((groups, t) => {
      const catId = t.categoryId || 'uncategorized';
      if (!groups[catId]) groups[catId] = { total: 0, transactions: [] };
      groups[catId].total += parseFloat(t.amount) || 0;
      groups[catId].transactions.push(t);
      return groups;
    }, {});
  },

  /**
   * Get transactions within date range
   * @param {Array} transactions - All transactions
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Array} Filtered transactions
   */
  filterByDateRange(transactions, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= start && tDate <= end;
    });
  },

  /**
   * Get last N days dates
   * @param {number} days - Number of days
   * @returns {Array} Array of date strings
   */
  getLastNDays(days = 7) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type: 'success', 'error', 'warning', 'info'
   */
  showToast(message, type = 'info') {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    };

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };

    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${Utils.escapeHtml(message)}</span>`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Confirm action with dialog
   * @param {string} message - Confirmation message
   * @returns {Promise<boolean>} User confirmation
   */
  async confirm(message) {
    return new Promise((resolve) => {
      if (window.confirm(message)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  /**
   * Download file
   * @param {Blob} blob - File content as Blob
   * @param {string} filename - Filename
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

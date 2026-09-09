/**
 * App.js - Main Entry Point
 * Initializes the application and sets up routing
 */

// Define routes configuration
const routes = {
  dashboard: {
    init: () => {
      // Dashboard is auto-initialized via dashboard.js
    }
  },
  chatbot: {
    init: () => {
      // Chatbot is auto-initialized via chatbot.js
    }
  },
  transactions: {
    init: () => {
      // Transactions is auto-initialized via transactions.js
    }
  },
  categories: {
    init: () => {
      // Categories is auto-initialized via categories.js
    }
  },
  reports: {
    init: () => {
      // Reports is auto-initialized via reports.js
    }
  },
  settings: {
    init: () => {
      // Settings is auto-initialized via settings.js
    }
  }
};

/**
 * Initialize the application
 */
function initApp() {
  // Initialize dark mode from settings
  Topbar.initDarkMode();
  
  // Initialize router
  Router.init(routes);
  
  // Listen for storage changes across tabs
  window.addEventListener('storage-change', () => {
    console.log('Storage changed, refreshing data...');
  });
  
  // Handle page visibility change (for cross-tab sync)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      window.dispatchEvent(new Event('storage-change'));
    }
  });
  
  console.log('FinBot initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

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
async function initApp() {
  try {
    // Initialize Supabase
    if (typeof SupabaseDB !== 'undefined' && typeof Config !== 'undefined') {
      const supabaseInitialized = SupabaseDB.init(Config.supabase.url, Config.supabase.anonKey);
      
      if (supabaseInitialized) {
        console.log('✅ Supabase initialized');
        
        // Initialize Auth module
        if (typeof Auth !== 'undefined') {
          Auth.init();
        }
      } else {
        console.warn('⚠️ Supabase initialization failed, using demo mode');
        localStorage.setItem('demo_mode', 'true');
      }
    } else {
      console.warn('⚠️ Supabase config not found, using demo mode');
      localStorage.setItem('demo_mode', 'true');
    }

    // Initialize Storage
    if (typeof Storage !== 'undefined') {
      await Storage.init();
    }

    // Initialize dark mode from settings
    Topbar.initDarkMode();

    // Make sure sidebar active state matches the current HTML page
    Sidebar.updateActiveState();

    // Add user info to topbar if authenticated
    updateUserInfo();

    // Listen for storage changes across tabs
    window.addEventListener('storage-change', () => {
      console.log('Storage changed, refreshing data...');
    });

    // Listen for data changes (from Supabase or localStorage)
    window.addEventListener('data-change', () => {
      console.log('Data changed, triggering UI update...');
    });

    // Listen for auth changes
    window.addEventListener('auth-change', (e) => {
      console.log('Auth state changed:', e.detail.user ? 'Logged in' : 'Logged out');
      updateUserInfo();
    });

    // Handle page visibility change (for cross-tab sync)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        window.dispatchEvent(new Event('storage-change'));
      }
    });

    console.log('✅ FinBot initialized successfully!');
    
    // Show mode indicator
    if (Storage.isDemoMode()) {
      console.log('🎮 Running in DEMO mode (localStorage)');
    } else if (SupabaseDB.isAuthenticated()) {
      console.log('☁️ Running in CLOUD mode (Supabase)');
    }

  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    // Fallback to demo mode on error
    localStorage.setItem('demo_mode', 'true');
  }
}

/**
 * Update user info in topbar
 */
function updateUserInfo() {
  const userEmailEl = document.getElementById('user-email');
  const userAvatarEl = document.getElementById('user-avatar');
  
  if (typeof Auth !== 'undefined' && Auth.getCurrentUser()) {
    const user = Auth.getCurrentUser();
    const displayName = Auth.getUserDisplayName();
    
    if (userEmailEl) {
      userEmailEl.textContent = displayName;
    }
    
    if (userAvatarEl) {
      // Set avatar initial
      const initial = displayName.charAt(0).toUpperCase();
      userAvatarEl.textContent = initial;
    }
  } else if (Storage.isDemoMode()) {
    if (userEmailEl) {
      userEmailEl.textContent = 'Demo Mode';
    }
    
    if (userAvatarEl) {
      userAvatarEl.textContent = '👤';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

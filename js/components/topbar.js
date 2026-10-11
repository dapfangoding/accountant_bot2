/**
 * Topbar Component - Reusable Top Navigation Bar
 * Renders topbar with page title, dark mode toggle, and user menu
 */

const Topbar = {
  /**
   * Render topbar component
   * @param {string} pageTitle - Current page title
   */
  render(pageTitle = 'Dashboard') {
    const container = document.getElementById('topbar-container');
    if (!container) return;

    // Get user info
    const isAuthenticated = typeof SupabaseDB !== 'undefined' && SupabaseDB.isAuthenticated();
    const isDemoMode = typeof Storage !== 'undefined' && Storage.isDemoMode();
    const userName = isAuthenticated && typeof Auth !== 'undefined' ? Auth.getUserDisplayName() : 'Demo';
    const userInitial = userName.charAt(0).toUpperCase();

    container.innerHTML = `
      <header class="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <!-- Left section -->
          <div class="flex items-center gap-4">
            <!-- Mobile menu toggle -->
            <button id="mobile-menu-toggle" class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
              <i class="fas fa-bars text-lg"></i>
            </button>

            <!-- Page title -->
            <h1 id="page-title" class="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
              ${pageTitle}
            </h1>
          </div>

          <!-- Right section -->
          <div class="flex items-center gap-2 sm:gap-4">
            ${isDemoMode ? `
            <!-- Demo Mode Badge -->
            <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
              <i class="fas fa-play-circle"></i>
              <span>Mode Demo</span>
            </div>
            ` : ''}

            <!-- Dark mode toggle -->
            <button id="dark-mode-toggle"
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    title="Toggle dark mode">
              <i id="dark-mode-icon" class="fas fa-moon text-lg"></i>
            </button>

            <!-- User Profile -->
            <div class="relative">
              <button id="user-menu-toggle"
                      class="flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                  <span id="user-avatar">${userInitial}</span>
                </div>
                <span id="user-email" class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">${userName}</span>
                <i class="fas fa-chevron-down text-xs hidden sm:block"></i>
              </button>

              <!-- Dropdown Menu -->
              <div id="user-menu-dropdown" 
                   class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                ${isAuthenticated ? `
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${userName}</p>
                </div>
                ` : `
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Mode Demo</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Data lokal</p>
                </div>
                `}
                
                ${!isAuthenticated && !isDemoMode ? `
                <button id="login-btn" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <i class="fas fa-sign-in-alt w-4"></i>
                  <span>Login</span>
                </button>
                ` : ''}
                
                ${isAuthenticated ? `
                <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <i class="fas fa-sign-out-alt w-4"></i>
                  <span>Logout</span>
                </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </header>
    `;

    this.attachEventListeners();
  },

  /**
   * Attach event listeners to topbar elements
   */
  attachEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => Sidebar.toggle());
    }

    // User menu toggle
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    
    if (userMenuToggle && userMenuDropdown) {
      userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuDropdown.classList.toggle('hidden');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!userMenuToggle.contains(e.target) && !userMenuDropdown.contains(e.target)) {
          userMenuDropdown.classList.add('hidden');
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (confirm('Apakah Anda yakin ingin logout?')) {
          if (typeof Auth !== 'undefined') {
            await Auth.signOut();
          }
        }
      });
    }

    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
  },

  /**
   * Toggle dark mode
   */
  async toggleDarkMode() {
    const html = document.documentElement;
    const settings = await Storage.getSettings();

    settings.dark_mode = !settings.dark_mode;
    await Storage.saveSettings(settings);

    if (settings.dark_mode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    this.updateDarkModeIcon();

    // Dispatch event for charts to update
    window.dispatchEvent(new Event('dark-mode-change'));
  },

  /**
   * Update dark mode icon based on current mode
   */
  updateDarkModeIcon() {
    const icon = document.getElementById('dark-mode-icon');
    const html = document.documentElement;

    const isDark = html.classList.contains('dark');

    if (icon) {
      if (isDark) {
        icon.className = 'fas fa-sun text-lg';
      } else {
        icon.className = 'fas fa-moon text-lg';
      }
    }
  },

  /**
   * Initialize dark mode from settings
   */
  async initDarkMode() {
    const settings = await Storage.getSettings();
    const html = document.documentElement;

    if (settings.dark_mode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    this.updateDarkModeIcon();
  },
};

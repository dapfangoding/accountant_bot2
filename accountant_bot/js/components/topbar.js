/**
 * Topbar Component - Reusable Top Navigation Bar
 * Renders topbar with page title and dark mode toggle
 */

const Topbar = {
  /**
   * Render topbar component
   * @param {string} pageTitle - Current page title
   */
  render(pageTitle = 'Dashboard') {
    const container = document.getElementById('topbar-container');
    if (!container) return;

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
            <!-- Dark mode toggle -->
            <button id="dark-mode-toggle" 
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    title="Toggle dark mode">
              <i id="dark-mode-icon" class="fas fa-moon text-lg"></i>
            </button>

            <!-- Notifications (placeholder) -->
            <button class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors hidden sm:block">
              <i class="fas fa-bell text-lg"></i>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User avatar -->
            <div class="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                U
              </div>
              <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">User</span>
            </div>
          </div>
        </div>

        <!-- Mobile page title -->
        <div class="sm:hidden px-4 pb-3">
          <h1 class="text-lg font-semibold text-gray-800 dark:text-white">${pageTitle}</h1>
        </div>
      </header>
    `;

    this.setupEventListeners();
    this.updateDarkModeIcon();
  },

  /**
   * Setup event listeners for topbar
   */
  setupEventListeners() {
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
  },

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    const html = document.documentElement;
    const settings = Storage.getSettings();
    
    settings.darkMode = !settings.darkMode;
    Storage.saveSettings(settings);
    
    if (settings.darkMode) {
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
    const settings = Storage.getSettings();
    const html = document.documentElement;
    
    const isDark = html.classList.contains('dark') || settings.darkMode;
    
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
  initDarkMode() {
    const settings = Storage.getSettings();
    const html = document.documentElement;
    
    if (settings.darkMode) {
      html.classList.add('dark');
    }
    
    this.updateDarkModeIcon();
  },

  /**
   * Update page title
   * @param {string} title - New page title
   */
  updateTitle(title) {
    const titleEl = document.getElementById('page-title');
    const mobileTitle = document.querySelector('.sm\\:hidden h1');
    
    if (titleEl) titleEl.textContent = title;
    if (mobileTitle) mobileTitle.textContent = title;
  },
};

/**
 * Sidebar Component - Reusable Navigation Sidebar
 * Renders sidebar menu with active state management
 */

const Sidebar = {
  menuItems: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', page: 'dashboard' },
    { id: 'chatbot', label: 'Chatbot', icon: 'fa-robot', page: 'chatbot' },
    { id: 'transactions', label: 'Transaksi', icon: 'fa-list', page: 'transactions' },
    { id: 'categories', label: 'Kategori', icon: 'fa-tags', page: 'categories' },
    { id: 'reports', label: 'Laporan', icon: 'fa-chart-line', page: 'reports' },
    { id: 'settings', label: 'Pengaturan', icon: 'fa-cog', page: 'settings' },
  ],

  /**
   * Render sidebar component
   */
  render() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Mobile sidebar overlay -->
      <div id="sidebar-overlay" class="sidebar-overlay lg:hidden"></div>
      
      <!-- Sidebar -->
      <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-wallet text-white text-sm"></i>
            </div>
            <span class="text-lg font-bold text-gray-800 dark:text-white">FinBot</span>
          </div>
          <!-- Mobile close button -->
          <button id="sidebar-close" class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="mt-6 px-4 space-y-2">
          ${this.menuItems.map(item => `
            <a href="#${item.page}" 
               data-page="${item.page}"
               class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
               onclick="Sidebar.handleNavigation(event, '${item.page}')">
              <i class="fas ${item.icon} w-5"></i>
              <span class="font-medium">${item.label}</span>
            </a>
          `).join('')}
        </nav>

        <!-- Bottom section -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-primary-600 dark:text-primary-400 text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">User</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
    `;

    this.setupEventListeners();
    this.updateActiveState();
  },

  /**
   * Setup event listeners for sidebar
   */
  setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('sidebar-close');

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  },

  /**
   * Handle navigation click
   * @param {Event} event - Click event
   * @param {string} page - Target page
   */
  handleNavigation(event, page) {
    // Close mobile menu on navigation
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (window.innerWidth < 1024) {
      sidebar.classList.add('-translate-x-full');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Update active state based on current page
   */
  updateActiveState() {
    const currentPage = Router.getCurrentPage();
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const page = link.dataset.page;
      
      if (page === currentPage) {
        link.classList.add('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-900', 'dark:text-primary-300');
        link.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
      } else {
        link.classList.remove('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-900', 'dark:text-primary-300');
        link.classList.add('text-gray-600', 'dark:text-gray-400');
      }
    });
  },

  /**
   * Toggle sidebar on mobile
   */
  toggle() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.remove('-translate-x-full');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
};

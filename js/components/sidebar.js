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
   * Check if sidebar is collapsed on desktop
   */
  isCollapsed() {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  },

  /**
   * Set sidebar collapsed state
   */
  setCollapsed(collapsed) {
    localStorage.setItem('sidebar_collapsed', collapsed ? 'true' : 'false');
    this.applyCollapsedState();
  },

  /**
   * Toggle sidebar collapse state (desktop)
   */
  toggleCollapse() {
    const currentState = this.isCollapsed();
    this.setCollapsed(!currentState);
  },

  /**
   * Apply collapsed class to sidebar and main content
   */
  applyCollapsedState() {
    const sidebar = document.getElementById('sidebar');
    const mainContentWrapper = document.querySelector('.lg\\:pl-64');
    const toggleIcon = document.getElementById('desktop-collapse-icon');
    const collapsed = this.isCollapsed();

    if (sidebar) {
      if (collapsed) {
        sidebar.classList.add('lg:w-16');
        sidebar.classList.remove('lg:w-64');
      } else {
        sidebar.classList.remove('lg:w-16');
        sidebar.classList.add('lg:w-64');
      }
    }

    if (mainContentWrapper) {
      if (collapsed) {
        mainContentWrapper.classList.add('lg:pl-16');
        mainContentWrapper.classList.remove('lg:pl-64');
      } else {
        mainContentWrapper.classList.remove('lg:pl-16');
        mainContentWrapper.classList.add('lg:pl-64');
      }
    }

    // Toggle texts and layout
    document.querySelectorAll('.sidebar-text').forEach(el => {
      if (collapsed) {
        el.classList.add('lg:hidden');
      } else {
        el.classList.remove('lg:hidden');
      }
    });

    // Toggle icon rotation
    if (toggleIcon) {
      if (collapsed) {
        toggleIcon.className = 'fas fa-chevron-right text-sm';
      } else {
        toggleIcon.className = 'fas fa-chevron-left text-sm';
      }
    }
  },

  /**
   * Render sidebar component
   */
  render() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Mobile sidebar overlay -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden"></div>
      
      <!-- Sidebar -->
      <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-64 lg:w-64 bg-white dark:bg-gray-800 shadow-lg transform -translate-x-full lg:translate-x-0 transition-all duration-300 ease-in-out">
        <!-- Close button for mobile -->
        <div class="lg:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 min-w-[2rem] bg-primary-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-wallet text-white text-sm"></i>
            </div>
            <span class="text-lg font-bold text-gray-800 dark:text-white">FinBot</span>
          </div>
          <button id="sidebar-close" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors" title="Tutup">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Logo & Desktop Toggle -->
        <div class="hidden lg:flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-8 h-8 min-w-[2rem] bg-primary-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-wallet text-white text-sm"></i>
            </div>
            <span class="sidebar-text text-lg font-bold text-gray-800 dark:text-white transition-opacity duration-200">FinBot</span>
          </div>
          <!-- Desktop collapse toggle (hidden on mobile) -->
          <button id="sidebar-desktop-toggle" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors" title="Sembunyikan/Tampilkan Navigasi">
            <i id="desktop-collapse-icon" class="fas fa-chevron-left text-sm"></i>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="mt-6 px-2 space-y-2">
          ${this.menuItems.map(item => `
            <a href="${item.page}.html" 
               data-page="${item.page}"
               title="${item.label}"
               class="sidebar-link flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
               onclick="Sidebar.handleNavigation(event, '${item.page}')">
              <i class="fas ${item.icon} w-5 min-w-[1.25rem] text-center"></i>
              <span class="sidebar-text font-medium whitespace-nowrap">${item.label}</span>
            </a>
          `).join('')}
        </nav>

        <!-- Bottom section -->
        <div class="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center gap-3 px-2 py-2">
            <div class="w-8 h-8 min-w-[2rem] bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-primary-600 dark:text-primary-400 text-sm"></i>
            </div>
            <div class="sidebar-text flex-1 overflow-hidden">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">User</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
    `;

    this.setupEventListeners();
    this.applyCollapsedState();
    this.updateActiveState();
  },

  /**
   * Setup event listeners for sidebar
   */
  setupEventListeners() {
    // Desktop collapse toggle
    const desktopToggle = document.getElementById('sidebar-desktop-toggle');
    if (desktopToggle) {
      desktopToggle.addEventListener('click', () => {
        if (window.innerWidth >= 1024) {
          this.toggleCollapse();
        }
      });
    }

    // Mobile menu toggle (from topbar)
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Close button for mobile
    const closeBtn = document.getElementById('sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    // Overlay click to close
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.close();
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
    if (window.innerWidth < 1024) {
      this.close();
    }
  },

  /**
   * Update active state based on current page
   */
  updateActiveState() {
    const path = window.location.pathname;
    let currentPage = path.split('/').pop().replace('.html', '');
    
    // Default to dashboard if root or empty
    if (!currentPage || currentPage === 'index') currentPage = 'dashboard';
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const page = link.dataset.page;
      
      if (page === currentPage) {
        link.classList.add('active', 'bg-primary-500', 'text-white', 'dark:bg-primary-600');
        link.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        
        // Add specific icon color if needed
        const icon = link.querySelector('i');
        if (icon) icon.classList.add('text-white');
      } else {
        link.classList.remove('active', 'bg-primary-500', 'text-white', 'dark:bg-primary-600');
        link.classList.add('text-gray-600', 'dark:text-gray-400');
        
        const icon = link.querySelector('i');
        if (icon) icon.classList.remove('text-white');
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
      overlay?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay?.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },

  /**
   * Close sidebar on mobile
   */
  close() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
    document.body.style.overflow = '';
  },
};

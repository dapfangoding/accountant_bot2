/**
 * Router Module - Hash-based Navigation
 * Handles page routing and browser history
 */

const Router = {
  currentPage: null,
  routes: {},

  /**
   * Initialize router with route definitions
   * @param {Object} routes - Route configuration
   */
  init(routes) {
    this.routes = routes;
    
    // Handle initial load
    this.handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleHashChange());
  },

  /**
   * Handle hash change event
   */
  handleHashChange() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const route = this.routes[hash];

    if (route) {
      this.currentPage = hash;
      this.updateSidebarActive(hash);
      
      // Call page init function if exists
      if (typeof route.init === 'function') {
        route.init();
      }
    } else {
      // Redirect to dashboard if route not found
      this.navigate('dashboard');
    }
  },

  /**
   * Navigate to a page
   * @param {string} page - Page name (without #)
   */
  navigate(page) {
    window.location.hash = page;
  },

  /**
   * Update sidebar active state
   * @param {string} page - Current page name
   */
  updateSidebarActive(page) {
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-900', 'dark:text-primary-300');
      link.classList.add('text-gray-600', 'dark:text-gray-400');
    });

    // Add active class to current page link
    const activeLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.remove('text-gray-600', 'dark:text-gray-400');
      activeLink.classList.add('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-900', 'dark:text-primary-300');
    }

    // Update mobile menu state
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
  },

  /**
   * Get current page name
   * @returns {string} Current page name
   */
  getCurrentPage() {
    return this.currentPage || 'dashboard';
  },

  /**
   * Get query parameters from hash
   * @returns {Object} Query parameters
   */
  getQueryParams() {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    
    if (!queryString) return {};

    const params = {};
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });

    return params;
  },

  /**
   * Navigate with query parameters
   * @param {string} page - Page name
   * @param {Object} params - Query parameters
   */
  navigateWithParams(page, params = {}) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    window.location.hash = queryString ? `${page}?${queryString}` : page;
  },

  /**
   * Register a new route
   * @param {string} name - Route name
   * @param {Object} config - Route configuration
   */
  registerRoute(name, config) {
    this.routes[name] = config;
  },

  /**
   * Go back in history
   */
  goBack() {
    history.back();
  },

  /**
   * Go forward in history
   */
  goForward() {
    history.forward();
  },

  /**
   * Replace current history state without adding new entry
   * @param {string} page - Page name
   */
  replace(page) {
    window.location.replace(`#${page}`);
  },
};

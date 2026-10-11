/**
 * Authentication Module
 * Handles user authentication and protected routes
 */

const Auth = {
  /**
   * Initialize authentication
   */
  init() {
    // Check if user is authenticated on page load
    this.checkAuthStatus();

    // Listen to auth changes
    window.addEventListener('auth-change', (e) => {
      this.handleAuthChange(e.detail.user);
    });
  },

  /**
   * Check if user is authenticated
   */
  async checkAuthStatus() {
    const user = await SupabaseDB.checkAuth();
    
    // If not authenticated and not on login page, redirect to login
    if (!user && !this.isPublicPage()) {
      this.redirectToLogin();
    }
    
    return user;
  },

  /**
   * Check if current page is public (doesn't require auth)
   */
  isPublicPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['login.html', 'register.html', 'index.html'];
    return publicPages.includes(currentPage);
  },

  /**
   * Handle authentication state changes
   */
  handleAuthChange(user) {
    if (user) {
      // User logged in
      this.onLogin(user);
    } else {
      // User logged out
      this.onLogout();
    }
  },

  /**
   * On user login
   */
  async onLogin(user) {
    console.log('User logged in:', user.email);
    
    // Initialize default categories for new users
    await SupabaseDB.initializeDefaultCategories();
    
    // Redirect to dashboard if on login page
    if (this.isPublicPage()) {
      window.location.href = 'dashboard.html';
    } else {
      // Reload current page to load user data
      window.location.reload();
    }
  },

  /**
   * On user logout
   */
  onLogout() {
    console.log('User logged out');
    this.redirectToLogin();
  },

  /**
   * Redirect to login page
   */
  redirectToLogin() {
    if (!this.isPublicPage()) {
      window.location.href = 'login.html';
    }
  },

  /**
   * Sign up new user
   */
  async signUp(email, password, confirmPassword) {
    // Validate inputs
    if (!email || !password) {
      return { success: false, error: 'Email dan password harus diisi' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password minimal 6 karakter' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Password tidak cocok' };
    }

    // Sign up with Supabase
    const result = await SupabaseDB.signUp(email, password);
    
    if (result.success) {
      return { 
        success: true, 
        message: 'Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.' 
      };
    }

    return result;
  },

  /**
   * Sign in user
   */
  async signIn(email, password) {
    // Validate inputs
    if (!email || !password) {
      return { success: false, error: 'Email dan password harus diisi' };
    }

    // Sign in with Supabase
    const result = await SupabaseDB.signIn(email, password);
    
    if (result.success) {
      return { success: true, message: 'Login berhasil!' };
    }

    return result;
  },

  /**
   * Sign out user
   */
  async signOut() {
    const result = await SupabaseDB.signOut();
    
    if (result.success) {
      return { success: true, message: 'Logout berhasil!' };
    }

    return result;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return SupabaseDB.currentUser;
  },

  /**
   * Get user display name or email
   */
  getUserDisplayName() {
    const user = this.getCurrentUser();
    if (!user) return 'Guest';
    
    return user.user_metadata?.name || user.email.split('@')[0];
  },
};

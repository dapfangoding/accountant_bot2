/**
 * Charts Component - Chart.js Wrapper
 * Provides reusable chart creation functions with dark mode support
 */

const Charts = {
  instances: {},

  /**
   * Get current theme colors based on dark mode
   * @returns {Object} Theme colors
   */
  getThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    
    return {
      textColor: isDark ? '#9ca3af' : '#4b5563',
      gridColor: isDark ? '#374151' : '#e5e7eb',
      background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    };
  },

  /**
   * Destroy existing chart instance
   * @param {string} canvasId - Canvas element ID
   */
  destroyChart(canvasId) {
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
      delete this.instances[canvasId];
    }
  },

  /**
   * Create a pie/doughnut chart
   * @param {string} canvasId - Canvas element ID
   * @param {Object} config - Chart configuration
   */
  createPieChart(canvasId, config) {
    this.destroyChart(canvasId);
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const theme = this.getThemeColors();

    this.instances[canvasId] = new Chart(ctx, {
      type: config.type || 'doughnut',
      data: {
        labels: config.labels || [],
        datasets: [{
          data: config.data || [],
          backgroundColor: config.colors || [
            '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', 
            '#8b5cf6', '#ec4899', '#10b981', '#6b7280'
          ],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: config.legendPosition || 'bottom',
            labels: {
              color: theme.textColor,
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${Utils.formatRupiah(value)} (${percentage}%)`;
              }
            },
          },
        },
      },
    });
  },

  /**
   * Create a bar chart
   * @param {string} canvasId - Canvas element ID
   * @param {Object} config - Chart configuration
   */
  createBarChart(canvasId, config) {
    this.destroyChart(canvasId);
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const theme = this.getThemeColors();
    const isDark = document.documentElement.classList.contains('dark');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: config.labels || [],
        datasets: config.datasets || [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: theme.textColor,
              padding: 15,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label || ''}: ${Utils.formatRupiah(context.parsed.y)}`;
              }
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: theme.gridColor,
              drawBorder: false,
            },
            ticks: {
              color: theme.textColor,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: theme.gridColor,
              drawBorder: false,
            },
            ticks: {
              color: theme.textColor,
              callback: function(value) {
                return Utils.formatRupiah(value);
              },
            },
          },
        },
      },
    });
  },

  /**
   * Create a line chart
   * @param {string} canvasId - Canvas element ID
   * @param {Object} config - Chart configuration
   */
  createLineChart(canvasId, config) {
    this.destroyChart(canvasId);
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const theme = this.getThemeColors();
    const isDark = document.documentElement.classList.contains('dark');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: config.labels || [],
        datasets: config.datasets || [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: theme.textColor,
              padding: 15,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label || ''}: ${Utils.formatRupiah(context.parsed.y)}`;
              }
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: theme.gridColor,
              drawBorder: false,
            },
            ticks: {
              color: theme.textColor,
            },
          },
          y: {
            beginAtZero: config.beginAtZero !== false,
            grid: {
              color: theme.gridColor,
              drawBorder: false,
            },
            ticks: {
              color: theme.textColor,
              callback: function(value) {
                return Utils.formatRupiah(value);
              },
            },
          },
        },
      },
    });
  },

  /**
   * Update all charts when dark mode changes
   */
  updateAllCharts() {
    // Re-render all charts with new theme
    Object.keys(this.instances).forEach(canvasId => {
      const chart = this.instances[canvasId];
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      // Store config and recreate
      const config = canvas._chartConfig;
      if (config) {
        this.destroyChart(canvasId);
        
        if (config.type === 'pie' || config.type === 'doughnut') {
          this.createPieChart(canvasId, config);
        } else if (config.type === 'bar') {
          this.createBarChart(canvasId, config);
        } else if (config.type === 'line') {
          this.createLineChart(canvasId, config);
        }
      }
    });
  },

  /**
   * Listen for dark mode changes
   */
  init() {
    window.addEventListener('dark-mode-change', () => {
      this.updateAllCharts();
    });
  },
};

// Initialize charts module
Charts.init();

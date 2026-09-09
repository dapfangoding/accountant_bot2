/**
 * Reports Page - Financial Reports & Analytics
 * Shows detailed reports with filters and charts
 */

let reportChart = null;

function initReports() {
  Sidebar.render();
  Topbar.render('Laporan');
  setupDateFilters();
  renderReportSummary();
  renderCategoryBreakdown();
  renderTrendChart();
  
  window.addEventListener('storage-change', () => {
    renderReportSummary();
    renderCategoryBreakdown();
    renderTrendChart();
  });
}

/**
 * Setup date filter controls
 */
function setupDateFilters() {
  const periodSelect = document.getElementById('report-period');
  if (periodSelect) {
    periodSelect.addEventListener('change', handlePeriodChange);
  }
  
  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  
  if (startDateInput) startDateInput.value = firstDayOfMonth;
  if (endDateInput) endDateInput.value = today;
}

/**
 * Handle period preset change
 */
function handlePeriodChange() {
  const period = document.getElementById('report-period')?.value;
  const today = new Date();
  let start, end;
  
  switch (period) {
    case 'today':
      start = end = today.toISOString().split('T')[0];
      break;
    case 'week':
      start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
      end = new Date().toISOString().split('T')[0];
      break;
    case 'month':
      start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      end = new Date().toISOString().split('T')[0];
      break;
    case 'year':
      start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      end = new Date().toISOString().split('T')[0];
      break;
    case 'all':
      start = '2020-01-01';
      end = new Date().toISOString().split('T')[0];
      break;
    default:
      return;
  }
  
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  
  if (startDateInput) startDateInput.value = start;
  if (endDateInput) endDateInput.value = end;
  
  applyDateFilter();
}

/**
 * Apply date filter
 */
function applyDateFilter() {
  const startDate = document.getElementById('start-date')?.value;
  const endDate = document.getElementById('end-date')?.value;
  
  if (!startDate || !endDate) return;
  
  renderReportSummary();
  renderCategoryBreakdown();
  renderTrendChart();
}

/**
 * Get filtered transactions by date range
 */
function getFilteredTransactions() {
  const startDate = document.getElementById('start-date')?.value;
  const endDate = document.getElementById('end-date')?.value;
  
  if (!startDate || !endDate) return Storage.getTransactions();
  
  return Utils.filterByDateRange(Storage.getTransactions(), startDate, endDate);
}

/**
 * Render report summary cards
 */
function renderReportSummary() {
  const container = document.getElementById('report-summary');
  if (!container) return;
  
  const transactions = getFilteredTransactions();
  const balance = Utils.calculateBalance(transactions);
  
  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <i class="fas fa-wallet text-blue-600 dark:text-blue-400"></i>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Saldo Bersih</span>
        </div>
        <p class="text-xl font-bold text-gray-800 dark:text-white">${Utils.formatRupiah(balance.balance)}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <i class="fas fa-arrow-down text-green-600 dark:text-green-400"></i>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Total Pemasukan</span>
        </div>
        <p class="text-xl font-bold text-green-600 dark:text-green-400">${Utils.formatRupiah(balance.income)}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <i class="fas fa-arrow-up text-red-600 dark:text-red-400"></i>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</span>
        </div>
        <p class="text-xl font-bold text-red-600 dark:text-red-400">${Utils.formatRupiah(balance.expense)}</p>
      </div>
    </div>
  `;
}

/**
 * Render category breakdown
 */
function renderCategoryBreakdown() {
  const container = document.getElementById('category-breakdown');
  if (!container) return;
  
  const transactions = getFilteredTransactions();
  const categories = Storage.getCategories();
  
  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense');
  const grouped = Utils.groupByCategory(expenses);
  
  // Calculate total
  const total = Object.values(grouped).reduce((sum, g) => sum + g.total, 0);
  
  if (total === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Belum ada pengeluaran pada periode ini</p>
      </div>
    `;
    return;
  }
  
  // Sort by amount descending
  const sorted = Object.entries(grouped)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5); // Top 5
  
  container.innerHTML = `
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top 5 Pengeluaran per Kategori</h3>
    <div class="space-y-3">
      ${sorted.map(([catId, info]) => {
        const category = categories.find(c => c.id === catId) || { name: 'Lainnya', color: '#6b7280' };
        const percentage = ((info.total / total) * 100).toFixed(1);
        
        return `
          <div>
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" style="background-color: ${category.color}"></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${category.name}</span>
              </div>
              <div class="text-right">
                <span class="text-sm font-semibold text-gray-800 dark:text-white">${Utils.formatRupiah(info.total)}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">(${percentage}%)</span>
              </div>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-500" style="width: ${percentage}%; background-color: ${category.color}"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render trend line chart
 */
function renderTrendChart() {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  
  const transactions = getFilteredTransactions();
  const startDate = document.getElementById('start-date')?.value;
  const endDate = document.getElementById('end-date')?.value;
  
  if (!startDate || !endDate) return;
  
  // Generate date range
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  // Calculate daily totals
  const incomeData = [];
  const expenseData = [];
  const labels = [];
  
  dates.forEach(date => {
    const dayTransactions = transactions.filter(t => t.date === date);
    
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    incomeData.push(income);
    expenseData.push(expense);
    
    const d = new Date(date);
    labels.push(d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
  });
  
  // Store config for updates
  canvas._chartConfig = {
    type: 'line',
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  Charts.createLineChart('trendChart', {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  });
}

document.addEventListener('DOMContentLoaded', initReports);

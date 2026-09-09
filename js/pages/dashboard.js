/**
 * Dashboard Page - Main Overview
 * Shows summary cards, charts, and recent transactions
 */

function initDashboard() {
  Sidebar.render();
  Topbar.render('Dashboard');
  renderSummaryCards();
  renderExpensePieChart();
  renderIncomeExpenseBarChart();
  renderRecentTransactions();
  
  // Listen for storage changes to refresh data
  window.addEventListener('storage-change', () => {
    renderSummaryCards();
    renderExpensePieChart();
    renderIncomeExpenseBarChart();
    renderRecentTransactions();
  });
}

/**
 * Render summary cards (Balance, Income, Expense)
 */
function renderSummaryCards() {
  const container = document.getElementById('dashboard-summary');
  if (!container) return;

  const transactions = Storage.getTransactions();
  const balance = Utils.calculateBalance(transactions);

  container.innerHTML = `
    <!-- Balance Card -->
    <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg card-hover">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <i class="fas fa-wallet text-xl"></i>
        </div>
        <span class="text-xs bg-white/20 px-3 py-1 rounded-full">Saldo Saat Ini</span>
      </div>
      <p class="text-sm text-white/80 mb-1">Total Saldo</p>
      <h2 class="text-2xl sm:text-3xl font-bold">${Utils.formatRupiah(balance.balance)}</h2>
    </div>

    <!-- Income Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg card-hover border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
          <i class="fas fa-arrow-down text-green-600 dark:text-green-400 text-xl"></i>
        </div>
        <span class="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">+ Pemasukan</span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Pemasukan</p>
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">${Utils.formatRupiah(balance.income)}</h2>
    </div>

    <!-- Expense Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg card-hover border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
          <i class="fas fa-arrow-up text-red-600 dark:text-red-400 text-xl"></i>
        </div>
        <span class="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">- Pengeluaran</span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Pengeluaran</p>
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">${Utils.formatRupiah(balance.expense)}</h2>
    </div>
  `;
}

/**
 * Render expense pie chart by category
 */
function renderExpensePieChart() {
  const canvas = document.getElementById('expensePieChart');
  if (!canvas) return;

  const transactions = Storage.getTransactions();
  const categories = Storage.getCategories();
  
  // Filter expense transactions
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Group by category
  const grouped = Utils.groupByCategory(expenses);
  
  // Prepare chart data
  const labels = [];
  const data = [];
  const colors = [];

  Object.entries(grouped).forEach(([catId, info]) => {
    const category = categories.find(c => c.id === catId);
    if (category) {
      labels.push(category.name);
      data.push(info.total);
      colors.push(category.color);
    } else {
      labels.push('Lainnya');
      data.push(info.total);
      colors.push('#6b7280');
    }
  });

  // Store config for dark mode updates
  canvas._chartConfig = {
    type: 'doughnut',
    labels,
    data,
    colors,
  };

  Charts.createPieChart('expensePieChart', {
    labels,
    data,
    colors,
    legendPosition: 'bottom',
  });
}

/**
 * Render income vs expense bar chart (last 7 days)
 */
function renderIncomeExpenseBarChart() {
  const canvas = document.getElementById('incomeExpenseChart');
  if (!canvas) return;

  const transactions = Storage.getTransactions();
  const last7Days = Utils.getLastNDays(7);
  
  // Prepare data for each day
  const incomeData = [];
  const expenseData = [];
  const labels = [];

  last7Days.forEach(date => {
    const dayTransactions = transactions.filter(t => {
      const tDate = t.date || new Date().toISOString().split('T')[0];
      return tDate === date;
    });

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    incomeData.push(income);
    expenseData.push(expense);
    
    // Format date label (e.g., "Sen, 1 Jan")
    const d = new Date(date);
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    const dayNum = d.getDate();
    labels.push(`${dayName}, ${dayNum}`);
  });

  // Store config for dark mode updates
  canvas._chartConfig = {
    type: 'bar',
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        backgroundColor: '#22c55e',
        borderRadius: 4,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  };

  Charts.createBarChart('incomeExpenseChart', {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        backgroundColor: '#22c55e',
        borderRadius: 4,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  });
}

/**
 * Render recent transactions table
 */
function renderRecentTransactions() {
  const container = document.getElementById('recentTransactions');
  if (!container) return;

  const transactions = Storage.getTransactions();
  const categories = Storage.getCategories();
  
  // Sort by date descending and take first 5
  const recent = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-receipt text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500 dark:text-gray-400">Belum ada transaksi</p>
        <a href="#chatbot" class="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">
          Tambah transaksi pertama
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
            <th class="pb-3 pl-2">Deskripsi</th>
            <th class="pb-3 hidden sm:table-cell">Tanggal</th>
            <th class="pb-3 text-right pr-2">Jumlah</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          ${recent.map((t, index) => {
            const category = categories.find(c => c.id === t.categoryId);
            const isIncome = t.type === 'income';
            
            return `
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="py-3 pl-2">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: ${category?.color || '#6b7280'}20">
                      <i class="fas ${category?.icon || 'fa-folder'} text-sm" style="color: ${category?.color || '#6b7280'}"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-800 dark:text-white text-sm">${Utils.escapeHtml(t.description)}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 sm:hidden">${Utils.formatDate(t.date, 'short')}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 hidden sm:table-cell">
                  <span class="text-sm text-gray-500 dark:text-gray-400">${Utils.formatDate(t.date, 'short')}</span>
                </td>
                <td class="py-3 text-right pr-2">
                  <span class="font-semibold text-sm ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                    ${isIncome ? '+' : '-'}${Utils.formatRupiah(t.amount)}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="mt-4 text-center">
      <a href="#transactions" class="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
        Lihat Semua Transaksi <i class="fas fa-arrow-right ml-1"></i>
      </a>
    </div>
  `;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);

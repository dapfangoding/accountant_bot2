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
  renderDetailedBreakdown();
  
  window.addEventListener('storage-change', () => {
    renderReportSummary();
    renderCategoryBreakdown();
    renderTrendChart();
    renderDetailedBreakdown();
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
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="bg-surface-container-low rounded-lg p-4 border border-outline-variant/30 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-base" data-icon="account_balance">account_balance</span>
          </div>
          <span class="text-label-md text-on-surface-variant">Saldo Bersih</span>
        </div>
        <p class="text-headline-sm font-bold text-on-surface">${Utils.formatRupiah(balance.balance)}</p>
      </div>

      <div class="bg-surface-container-low rounded-lg p-4 border border-outline-variant/30 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-lg bg-green-950/40 text-green-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-base" data-icon="south_west">south_west</span>
          </div>
          <span class="text-label-md text-on-surface-variant">Total Pemasukan</span>
        </div>
        <p class="text-headline-sm font-bold text-green-400">${Utils.formatRupiah(balance.income)}</p>
      </div>

      <div class="bg-surface-container-low rounded-lg p-4 border border-outline-variant/30 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-lg bg-red-950/40 text-red-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-base" data-icon="north_east">north_east</span>
          </div>
          <span class="text-label-md text-on-surface-variant">Total Pengeluaran</span>
        </div>
        <p class="text-headline-sm font-bold text-red-400">${Utils.formatRupiah(balance.expense)}</p>
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
    <h3 class="text-headline-sm font-bold text-on-surface mb-4">Pengeluaran per Kategori</h3>
    <div class="space-y-3">
      ${sorted.map(([catId, info]) => {
        const category = categories.find(c => c.id === catId) || { name: 'Lainnya', color: '#6b7280' };
        const percentage = ((info.total / total) * 100).toFixed(1);
        
        return `
          <div>
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" style="background-color: ${category.color}"></div>
                <span class="text-label-md font-label-md text-on-surface">${category.name}</span>
              </div>
              <div class="text-right">
                <span class="text-label-md font-label-md font-bold text-on-surface">${Utils.formatRupiah(info.total)}</span>
                <span class="text-label-caps text-on-surface-variant ml-2">(${percentage}%)</span>
              </div>
            </div>
            <div class="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" style="width: ${percentage}%; background-color: ${category.color}"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render detailed breakdown table
 */
function renderDetailedBreakdown() {
  const container = document.getElementById('detailed-breakdown');
  if (!container) return;
  
  const transactions = getFilteredTransactions();
  const categories = Storage.getCategories();
  
  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 bg-surface-container-low rounded-lg border border-outline-variant/30">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4 border border-outline-variant/20">
          <span class="material-symbols-outlined text-primary text-[28px]" data-icon="receipt_long">receipt_long</span>
        </div>
        <h3 class="text-headline-sm font-bold text-on-surface mb-2">Belum ada transaksi</h3>
        <p class="text-body-sm text-on-surface-variant">Tidak ada transaksi pada periode yang dipilih.</p>
      </div>
    `;
    return;
  }
  
  const sorted = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = `
    <div class="rounded-lg border border-outline-variant/20 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-surface-container-highest/50 text-on-surface-variant text-label-caps">
          <tr>
            <th class="py-3 px-4 font-bold">Tanggal</th>
            <th class="py-3 px-4 font-bold">Deskripsi</th>
            <th class="py-3 px-4 font-bold">Kategori</th>
            <th class="py-3 px-4 text-right font-bold">Jumlah</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/10">
          ${sorted.map(t => {
            const category = categories.find(c => c.id === t.categoryId) || { name: 'Lainnya', color: '#6b7280', icon: 'fa-folder' };
            const isIncome = t.type === 'income';
            return `
              <tr class="hover:bg-surface-container/50 transition-colors">
                <td class="py-3 px-4 text-body-sm text-on-surface-variant">${Utils.formatDate(t.date, 'long')}</td>
                <td class="py-3 px-4 text-body-sm text-on-surface">${Utils.escapeHtml(t.description)}</td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-label-md ${isIncome ? 'bg-green-950/40 text-green-400' : 'bg-red-950/40 text-red-400'}">
                    <span class="material-symbols-outlined text-[14px]" data-icon="${isIncome ? 'south_west' : 'north_east'}">${isIncome ? 'south_west' : 'north_east'}</span>
                    ${category.name}
                  </span>
                </td>
                <td class="py-3 px-4 text-right text-body-sm font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}">
                  ${isIncome ? '+' : '-'}${Utils.formatRupiah(t.amount)}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Export filtered transactions to Excel
 */
window.exportToExcel = function() {
  const transactions = getFilteredTransactions();
  const categories = Storage.getCategories();
  
  const data = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId) || { name: 'Lainnya' };
    return {
      'No': '',
      'Tanggal': Utils.formatDate(t.date, 'long'),
      'Tipe': t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      'Kategori': category.name,
      'Deskripsi': t.description,
      'Jumlah': t.type === 'income' ? t.amount : -t.amount,
    };
  });
  
  data.forEach((row, i) => row['No'] = i + 1);
  
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
  
  const filename = `laporan_keuangan_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  
  Utils.showToast('File Excel berhasil diunduh', 'success');
};

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

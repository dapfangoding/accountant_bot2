/**
 * Transactions Page - Transaction Management
 * Shows all transactions with filtering, editing, and export features
 */

let currentPage = 1;
const itemsPerPage = 10;
let filteredTransactions = [];

function initTransactions() {
  Sidebar.render();
  Topbar.render('Transaksi');
  setupFilters();
  renderTransactionsTable();
  setupEventListeners();
  
  // Listen for storage changes
  window.addEventListener('storage-change', () => {
    applyFilters();
  });
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const categoryFilter = document.getElementById('category-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(() => applyFilters(), 300));
  }
  
  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }
  
  if (categoryFilter) {
    populateCategoryFilter();
    categoryFilter.addEventListener('change', applyFilters);
  }
}

/**
 * Populate category filter dropdown
 */
function populateCategoryFilter() {
  const select = document.getElementById('category-filter');
  if (!select) return;
  
  const categories = Storage.getCategories();
  
  select.innerHTML = `
    <option value="">Semua Kategori</option>
    ${categories.map(cat => `
      <option value="${cat.id}">${cat.name}</option>
    `).join('')}
  `;
}

/**
 * Apply filters to transactions
 */
function applyFilters() {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const categoryFilter = document.getElementById('category-filter');
  
  let transactions = Storage.getTransactions();
  
  // Search filter
  const searchTerm = searchInput?.value.toLowerCase().trim() || '';
  if (searchTerm) {
    transactions = transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Type filter
  const typeValue = typeFilter?.value || '';
  if (typeValue) {
    transactions = transactions.filter(t => t.type === typeValue);
  }
  
  // Category filter
  const categoryValue = categoryFilter?.value || '';
  if (categoryValue) {
    transactions = transactions.filter(t => t.categoryId === categoryValue);
  }
  
  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  filteredTransactions = transactions;
  currentPage = 1;
  renderTransactionsTable();
}

/**
 * Render transactions table with pagination
 */
function renderTransactionsTable() {
  const container = document.getElementById('transactions-table-body');
  const paginationContainer = document.getElementById('pagination');
  
  if (!container) return;
  
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageTransactions = filteredTransactions.slice(start, end);
  
  const categories = Storage.getCategories();
  
  if (pageTransactions.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-receipt text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-500 dark:text-gray-400">Tidak ada transaksi</p>
          </div>
        </td>
      </tr>
    `;
    
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }
  
  container.innerHTML = pageTransactions.map((t, index) => {
    const category = categories.find(c => c.id === t.categoryId);
    const isIncome = t.type === 'income';
    const globalIndex = start + index + 1;
    
    return `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700" data-id="${t.id}">
        <td class="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 w-16">${globalIndex}</td>
        <td class="py-3 px-4">
          <span class="text-sm text-gray-500 dark:text-gray-400">${Utils.formatDate(t.date, 'long')}</span>
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isIncome ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
            ${isIncome ? 'Masuk' : 'Keluar'}
          </span>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded flex items-center justify-center" style="background-color: ${category?.color || '#6b7280'}20">
              <i class="fas ${category?.icon || 'fa-folder'} text-xs" style="color: ${category?.color || '#6b7280'}"></i>
            </div>
            <span class="text-sm font-medium text-gray-800 dark:text-white view-mode">${Utils.escapeHtml(t.description)}</span>
            <input type="text" class="edit-mode hidden text-sm font-medium bg-transparent border border-primary-500 rounded px-2 py-1 focus:outline-none w-full" value="${Utils.escapeHtml(t.description)}" />
          </div>
        </td>
        <td class="py-3 px-4 text-right">
          <span class="view-mode font-semibold text-sm ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
            ${isIncome ? '+' : '-'}${Utils.formatRupiah(t.amount)}
          </span>
          <input type="number" class="edit-mode hidden text-sm font-semibold bg-transparent border border-primary-500 rounded px-2 py-1 focus:outline-none w-32 text-right" value="${t.amount}" />
        </td>
        <td class="py-3 px-4 text-right">
          <div class="view-mode flex items-center justify-end gap-2">
            <button onclick="editTransaction('${t.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors" title="Edit">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <button onclick="deleteTransaction('${t.id}')" class="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors" title="Hapus">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
          <div class="edit-mode hidden flex items-center justify-end gap-2">
            <button onclick="saveTransaction('${t.id}')" class="p-1.5 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors" title="Simpan">
              <i class="fas fa-check text-sm"></i>
            </button>
            <button onclick="cancelEdit('${t.id}')" class="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded transition-colors" title="Batal">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  renderPagination(totalPages);
}

/**
 * Render pagination controls
 */
function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  if (!container) return;
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '<div class="flex items-center justify-between gap-2 flex-wrap">';
  html += `<span class="text-sm text-gray-500 dark:text-gray-400">Halaman ${currentPage} dari ${totalPages}</span>`;
  html += '<div class="flex gap-1">';
  
  // Previous button
  html += `
    <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"' : 'class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"'}>
      <i class="fas fa-chevron-left text-xs"></i>
    </button>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `
        <button onclick="goToPage(${i})" class="px-3 py-1 rounded ${i === currentPage ? 'bg-primary-500 text-white' : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span class="px-2 text-gray-400">...</span>';
    }
  }
  
  // Next button
  html += `
    <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"' : 'class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"'}>
      <i class="fas fa-chevron-right text-xs"></i>
    </button>
  `;
  
  html += '</div></div>';
  container.innerHTML = html;
}

/**
 * Go to specific page
 */
function goToPage(page) {
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTransactionsTable();
}

/**
 * Edit transaction (switch to edit mode)
 */
window.editTransaction = function(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  
  row.classList.add('editing');
  row.querySelectorAll('.view-mode').forEach(el => el.classList.add('hidden'));
  row.querySelectorAll('.edit-mode').forEach(el => el.classList.remove('hidden'));
};

/**
 * Save transaction edits
 */
window.saveTransaction = async function(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  
  const descriptionInput = row.querySelector('.edit-mode input[type="text"]');
  const amountInput = row.querySelector('.edit-mode input[type="number"]');
  
  const description = descriptionInput?.value.trim();
  const amount = parseFloat(amountInput?.value || '0');
  
  if (!description || amount <= 0) {
    Utils.showToast('Deskripsi dan jumlah harus diisi', 'error');
    return;
  }
  
  const updated = Storage.updateTransaction(id, { description, amount });
  
  if (updated) {
    Utils.showToast('Transaksi berhasil diperbarui', 'success');
    applyFilters();
  } else {
    Utils.showToast('Gagal memperbarui transaksi', 'error');
  }
};

/**
 * Cancel edit
 */
window.cancelEdit = function(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  
  row.classList.remove('editing');
  row.querySelectorAll('.view-mode').forEach(el => el.classList.remove('hidden'));
  row.querySelectorAll('.edit-mode').forEach(el => el.classList.add('hidden'));
};

/**
 * Delete transaction
 */
window.deleteTransaction = async function(id) {
  if (!await Utils.confirm('Yakin ingin menghapus transaksi ini?')) return;
  
  const deleted = Storage.deleteTransaction(id);
  
  if (deleted) {
    Utils.showToast('Transaksi berhasil dihapus', 'success');
    applyFilters();
  } else {
    Utils.showToast('Gagal menghapus transaksi', 'error');
  }
};

/**
 * Export transactions to Excel
 */
window.exportToExcel = function() {
  const transactions = filteredTransactions.length > 0 ? filteredTransactions : Storage.getTransactions();
  const categories = Storage.getCategories();
  
  // Prepare data for export
  const data = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return {
      'No': '',
      'Tanggal': Utils.formatDate(t.date, 'long'),
      'Tipe': t.type === 'income' ? 'Masuk' : 'Keluar',
      'Kategori': category?.name || 'Lainnya',
      'Deskripsi': t.description,
      'Jumlah': t.type === 'income' ? t.amount : -t.amount,
    };
  });
  
  // Add numbering
  data.forEach((row, i) => row['No'] = i + 1);
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 15 }, // Tanggal
    { wch: 10 }, // Tipe
    { wch: 15 }, // Kategori
    { wch: 30 }, // Deskripsi
    { wch: 15 }, // Jumlah
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
  
  // Download file
  const filename = `transaksi_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  
  Utils.showToast('File Excel berhasil diunduh', 'success');
};

/**
 * Setup additional event listeners
 */
function setupEventListeners() {
  // Export button
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToExcel);
  }
  
  // Reset filters button
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('search-input').value = '';
      document.getElementById('type-filter').value = '';
      document.getElementById('category-filter').value = '';
      applyFilters();
    });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTransactions);

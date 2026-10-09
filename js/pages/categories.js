/**
 * Categories Page - Category Management
 * CRUD operations for transaction categories
 */

let activeCategoryTab = 'expense';

function initCategories() {
  Sidebar.render();
  Topbar.render('Kategori');
  
  // Set initial active tab classes
  const tabExpense = document.getElementById('tab-expense');
  const tabIncome = document.getElementById('tab-income');
  if (tabExpense && tabIncome) {
    tabExpense.className = "flex-1 py-2.5 rounded text-label-md font-bold bg-surface-container-high text-primary text-center shadow-sm transition-all";
    tabIncome.className = "flex-1 py-2.5 rounded text-label-md text-on-surface-variant hover:text-on-surface text-center transition-all";
  }
  
  renderCategoriesList();
  setupEventListeners();
  
  window.addEventListener('storage-change', () => {
    renderCategoriesList();
  });
}

function setActiveTab(tab) {
  activeCategoryTab = tab;
  const tabExpense = document.getElementById('tab-expense');
  const tabIncome = document.getElementById('tab-income');
  
  if (tabExpense && tabIncome) {
    if (tab === 'expense') {
      tabExpense.className = "flex-1 py-2.5 rounded text-label-md font-bold bg-surface-container-high text-primary text-center shadow-sm transition-all";
      tabIncome.className = "flex-1 py-2.5 rounded text-label-md text-on-surface-variant hover:text-on-surface text-center transition-all";
    } else {
      tabIncome.className = "flex-1 py-2.5 rounded text-label-md font-bold bg-surface-container-high text-primary text-center shadow-sm transition-all";
      tabExpense.className = "flex-1 py-2.5 rounded text-label-md text-on-surface-variant hover:text-on-surface text-center transition-all";
    }
  }
  renderCategoriesList();
}

/**
 * Render categories list
 */
function renderCategoriesList() {
  const container = document.getElementById('categories-list');
  if (!container) return;
  
  const categories = Storage.getCategories();
  const transactions = Storage.getTransactions();
  
  // Dynamic tab count badges
  const expenseCount = categories.filter(c => c.type === 'expense').length;
  const incomeCount = categories.filter(c => c.type === 'income').length;
  
  const tabExpense = document.getElementById('tab-expense');
  const tabIncome = document.getElementById('tab-income');
  if (tabExpense) tabExpense.textContent = `Pengeluaran (${expenseCount})`;
  if (tabIncome) tabIncome.textContent = `Pemasukan (${incomeCount})`;
  
  // Filter by active tab
  const filteredCategories = categories.filter(c => c.type === activeCategoryTab);
  
  // Count transactions per category
  const counts = {};
  transactions.forEach(t => {
    counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
  });
  
  if (filteredCategories.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-surface-container-low rounded-lg border border-outline-variant/30">
        <div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-on-surface-variant text-2xl" data-icon="category">category</span>
        </div>
        <p class="text-on-surface-variant">Belum ada kategori untuk tipe ini</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${filteredCategories.map(cat => {
        const budgetInfo = Storage.getCategoryBudgetUsage(cat.id);
        const budgetHtml = cat.budgetEnabled && budgetInfo ? `
          <div class="mt-3 pt-3 border-t border-outline-variant/30">
            <div class="flex justify-between items-center mb-2 text-xs">
              <span class="text-on-surface-variant">Terpakai</span>
              <span class="font-semibold ${budgetInfo.exceeded ? 'text-red-400' : 'text-on-surface'}">
                ${Utils.formatRupiah(budgetInfo.spent)} / ${Utils.formatRupiah(budgetInfo.limit)}
              </span>
            </div>
            <div class="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-300 ${budgetInfo.exceeded ? 'bg-red-500' : 'bg-primary'}" style="width: ${budgetInfo.percentage}%"></div>
            </div>
            ${budgetInfo.exceeded ? '<p class="text-xs text-red-400 mt-1 flex items-center gap-1">⚠️ Melebihi budget</p>' : ''}
          </div>
        ` : `
          <div class="mt-3 pt-3 border-t border-outline-variant/10 text-xs text-on-surface-variant flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">info</span>
            <span>Tanpa batas pengeluaran</span>
          </div>
        `;
        
        return `
          <div onclick="openCategoryModal('edit', '${cat.id}')" class="bg-surface-container-low rounded-xl p-4 shadow-sm border border-outline-variant/30 hover:border-primary/50 cursor-pointer card-hover transition-all duration-200">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: ${cat.color}20">
                  <i class="fas ${cat.icon} text-lg" style="color: ${cat.color}"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-on-surface text-body-lg">${cat.name}</h3>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cat.type === 'income' ? 'bg-green-950/40 text-green-400 border border-green-500/20' : 'bg-red-950/40 text-red-400 border border-red-500/20'}">
                    ${cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-on-surface-variant">${counts[cat.id] || 0} transaksi</span>
              <span class="w-3 h-3 rounded-full" style="background-color: ${cat.color}"></span>
            </div>
            ${budgetHtml}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Open Modal Form (Add or Edit)
 */
window.openCategoryModal = function(mode, id = null) {
  const modal = document.getElementById('category-modal');
  if (!modal) return;
  
  const modalTitle = document.getElementById('modal-title');
  const addBtn = document.getElementById('add-category-btn');
  const saveBtn = document.getElementById('save-category-btn');
  const deleteBtnContainer = document.getElementById('delete-category-btn-container');
  
  const nameInput = document.getElementById('category-name');
  const typeSelect = document.getElementById('category-type');
  const colorInput = document.getElementById('category-color');
  const iconSelect = document.getElementById('category-icon');
  const budgetInput = document.getElementById('category-budget');
  const budgetCheckbox = document.getElementById('category-budget-enabled');
  
  // Reset form
  if (nameInput) nameInput.value = '';
  if (typeSelect) typeSelect.value = activeCategoryTab;
  if (colorInput) colorInput.value = '#ef4444';
  if (iconSelect) iconSelect.value = 'fa-folder';
  if (budgetInput) budgetInput.value = '';
  if (budgetCheckbox) budgetCheckbox.checked = false;
  document.getElementById('budget-input-container')?.classList.add('hidden');
  
  if (mode === 'add') {
    if (modalTitle) modalTitle.textContent = 'Tambah Kategori';
    addBtn?.classList.remove('hidden');
    saveBtn?.classList.add('hidden');
    deleteBtnContainer?.classList.add('hidden');
    window.editingCategoryId = null;
  } else if (mode === 'edit' && id) {
    const categories = Storage.getCategories();
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    if (modalTitle) modalTitle.textContent = 'Edit Kategori';
    addBtn?.classList.add('hidden');
    saveBtn?.classList.remove('hidden');
    
    // Disable deletion if it's the last category
    if (categories.length > 1) {
      deleteBtnContainer?.classList.remove('hidden');
    } else {
      deleteBtnContainer?.classList.add('hidden');
    }
    
    if (nameInput) nameInput.value = category.name;
    if (typeSelect) typeSelect.value = category.type;
    if (colorInput) colorInput.value = category.color;
    if (iconSelect) iconSelect.value = category.icon;
    if (budgetInput) budgetInput.value = category.budgetLimit || '';
    if (budgetCheckbox) {
      budgetCheckbox.checked = !!category.budgetEnabled;
      toggleBudgetInput();
    }
    
    window.editingCategoryId = id;
  }
  
  modal.classList.remove('hidden');
};

/**
 * Close Modal Form
 */
window.closeCategoryModal = function() {
  const modal = document.getElementById('category-modal');
  modal?.classList.add('hidden');
  window.editingCategoryId = null;
};

/**
 * Add new category
 */
window.addCategory = function() {
  const nameInput = document.getElementById('category-name');
  const typeSelect = document.getElementById('category-type');
  const colorInput = document.getElementById('category-color');
  const iconSelect = document.getElementById('category-icon');
  const budgetInput = document.getElementById('category-budget');
  const budgetCheckbox = document.getElementById('category-budget-enabled');
  
  const name = nameInput?.value.trim();
  const type = typeSelect?.value || 'expense';
  const color = colorInput?.value || '#6b7280';
  const icon = iconSelect?.value || 'fa-folder';
  const budgetLimit = budgetCheckbox?.checked ? parseFloat(budgetInput?.value || 0) : null;
  
  if (!name) {
    Utils.showToast('Nama kategori harus diisi', 'error');
    return;
  }
  
  const category = {
    id: Utils.generateId('cat'),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    type,
    color,
    icon,
    budgetLimit: budgetLimit || null,
    budgetEnabled: !!budgetCheckbox?.checked,
  };
  
  Storage.addCategory(category);
  Utils.showToast('Kategori berhasil ditambahkan', 'success');
  closeCategoryModal();
  renderCategoriesList();
};

window.toggleBudgetInput = function() {
  const checkbox = document.getElementById('category-budget-enabled');
  const container = document.getElementById('budget-input-container');
  const typeLabel = document.getElementById('budget-limit-type');
  if (checkbox && container) {
    if (checkbox.checked) {
      container.classList.remove('hidden');
      if (typeLabel) typeLabel.textContent = "Limit Pengeluaran";
    } else {
      container.classList.add('hidden');
      if (typeLabel) typeLabel.textContent = "No Limit";
    }
  }
};

/**
 * Save edited category
 */
window.saveCategory = function() {
  if (!window.editingCategoryId) return;
  
  const nameInput = document.getElementById('category-name');
  const typeSelect = document.getElementById('category-type');
  const colorInput = document.getElementById('category-color');
  const iconSelect = document.getElementById('category-icon');
  const budgetInput = document.getElementById('category-budget');
  const budgetCheckbox = document.getElementById('category-budget-enabled');
  
  const name = nameInput?.value.trim();
  const type = typeSelect?.value || 'expense';
  const color = colorInput?.value || '#6b7280';
  const icon = iconSelect?.value || 'fa-folder';
  const budgetLimit = budgetCheckbox?.checked ? parseFloat(budgetInput?.value || 0) : null;
  
  if (!name) {
    Utils.showToast('Nama kategori harus diisi', 'error');
    return;
  }
  
  const updated = Storage.updateCategory(window.editingCategoryId, {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    type,
    color,
    icon,
    budgetLimit: budgetLimit || null,
    budgetEnabled: !!budgetCheckbox?.checked,
  });
  
  if (updated) {
    Utils.showToast('Kategori berhasil diperbarui', 'success');
    closeCategoryModal();
    renderCategoriesList();
  }
};

/**
 * Delete category inside modal
 */
window.deleteCurrentCategory = async function() {
  if (!window.editingCategoryId) return;
  
  if (!await Utils.confirm('Hapus kategori ini? Transaksi yang menggunakan kategori ini akan tetap ada.')) return;
  
  const deleted = Storage.deleteCategory(window.editingCategoryId);
  
  if (deleted) {
    Utils.showToast('Kategori berhasil dihapus', 'success');
    closeCategoryModal();
    renderCategoriesList();
  }
};

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const tabExpense = document.getElementById('tab-expense');
  const tabIncome = document.getElementById('tab-income');
  if (tabExpense) {
    tabExpense.addEventListener('click', () => setActiveTab('expense'));
  }
  if (tabIncome) {
    tabIncome.addEventListener('click', () => setActiveTab('income'));
  }
}

document.addEventListener('DOMContentLoaded', initCategories);

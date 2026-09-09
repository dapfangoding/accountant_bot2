/**
 * Categories Page - Category Management
 * CRUD operations for transaction categories
 */

function initCategories() {
  Sidebar.render();
  Topbar.render('Kategori');
  renderCategoriesList();
  setupEventListeners();
  
  window.addEventListener('storage-change', () => {
    renderCategoriesList();
  });
}

/**
 * Render categories list
 */
function renderCategoriesList() {
  const container = document.getElementById('categories-list');
  if (!container) return;
  
  const categories = Storage.getCategories();
  const transactions = Storage.getTransactions();
  
  // Count transactions per category
  const counts = {};
  transactions.forEach(t => {
    counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
  });
  
  if (categories.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-tags text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500 dark:text-gray-400">Belum ada kategori</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${categories.map(cat => `
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 card-hover">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: ${cat.color}20">
                <i class="fas ${cat.icon} text-lg" style="color: ${cat.color}"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">${cat.name}</h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cat.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                  ${cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </div>
            </div>
            <div class="flex gap-1">
              <button onclick="editCategory('${cat.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors">
                <i class="fas fa-edit text-sm"></i>
              </button>
              ${categories.length > 1 ? `
                <button onclick="deleteCategory('${cat.id}')" class="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors">
                  <i class="fas fa-trash text-sm"></i>
                </button>
              ` : ''}
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">${counts[cat.id] || 0} transaksi</span>
            <span class="w-3 h-3 rounded-full" style="background-color: ${cat.color}"></span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Add new category
 */
window.addCategory = function() {
  const nameInput = document.getElementById('category-name');
  const typeSelect = document.getElementById('category-type');
  const colorInput = document.getElementById('category-color');
  const iconSelect = document.getElementById('category-icon');
  
  const name = nameInput?.value.trim();
  const type = typeSelect?.value || 'expense';
  const color = colorInput?.value || '#6b7280';
  const icon = iconSelect?.value || 'fa-folder';
  
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
  };
  
  Storage.addCategory(category);
  Utils.showToast('Kategori berhasil ditambahkan', 'success');
  
  // Reset form
  if (nameInput) nameInput.value = '';
  
  renderCategoriesList();
};

/**
 * Edit category (show modal)
 */
window.editCategory = function(id) {
  const categories = Storage.getCategories();
  const category = categories.find(c => c.id === id);
  
  if (!category) return;
  
  const nameInput = document.getElementById('category-name');
  const typeSelect = document.getElementById('category-type');
  const colorInput = document.getElementById('category-color');
  const iconSelect = document.getElementById('category-icon');
  
  if (nameInput) nameInput.value = category.name;
  if (typeSelect) typeSelect.value = category.type;
  if (colorInput) colorInput.value = category.color;
  if (iconSelect) iconSelect.value = category.icon;
  
  // Store editing ID
  window.editingCategoryId = id;
  
  // Scroll to form
  document.getElementById('add-category-form')?.scrollIntoView({ behavior: 'smooth' });
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
  
  const name = nameInput?.value.trim();
  const type = typeSelect?.value || 'expense';
  const color = colorInput?.value || '#6b7280';
  const icon = iconSelect?.value || 'fa-folder';
  
  if (!name) {
    Utils.showToast('Nama kategori harus diisi', 'error');
    return;
  }
  
  const updated = Storage.updateCategory(window.editingCategoryId, {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    type,
    color,
    icon,
  });
  
  if (updated) {
    Utils.showToast('Kategori berhasil diperbarui', 'success');
    window.editingCategoryId = null;
    
    // Reset form
    if (nameInput) nameInput.value = '';
    
    renderCategoriesList();
  }
};

/**
 * Delete category
 */
window.deleteCategory = async function(id) {
  if (!await Utils.confirm('Hapus kategori ini? Transaksi yang menggunakan kategori ini akan tetap ada.')) return;
  
  const deleted = Storage.deleteCategory(id);
  
  if (deleted) {
    Utils.showToast('Kategori berhasil dihapus', 'success');
    renderCategoriesList();
  }
};

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const addBtn = document.getElementById('add-category-btn');
  const saveBtn = document.getElementById('save-category-btn');
  
  if (addBtn) {
    addBtn.addEventListener('click', addCategory);
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveCategory);
  }
}

document.addEventListener('DOMContentLoaded', initCategories);

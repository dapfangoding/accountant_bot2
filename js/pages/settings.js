/**
 * Settings Page - Application Settings
 * Dark mode, data export/import, reset options
 */

function initSettings() {
  Sidebar.render();
  Topbar.render('Pengaturan');
  renderSettings();
  setupEventListeners();
}

/**
 * Render settings page content
 */
function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;
  
  const settings = Storage.getSettings();
  const transactions = Storage.getTransactions();
  const categories = Storage.getCategories();
  
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Appearance Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-palette text-primary-500"></i>
          Tampilan
        </h3>
        <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Mode Gelap</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Aktifkan tema gelap untuk tampilan yang lebih nyaman di malam hari</p>
          </div>
          <button id="dark-mode-toggle-settings" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}"></span>
          </button>
        </div>
      </div>
      
      <!-- Data Management Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-database text-primary-500"></i>
          Manajemen Data
        </h3>
        
        <div class="space-y-4">
          <!-- Export Data -->
          <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p class="font-medium text-gray-700 dark:text-gray-300">Ekspor Data</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Unduh semua data dalam format JSON untuk backup</p>
            </div>
            <button onclick="exportData()" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <i class="fas fa-download"></i>
              Ekspor
            </button>
          </div>
          
          <!-- Import Data -->
          <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p class="font-medium text-gray-700 dark:text-gray-300">Impor Data</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pulihkan data dari file JSON backup</p>
            </div>
            <label class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
              <i class="fas fa-upload"></i>
              Impor
              <input type="file" id="import-file" accept=".json" class="hidden" onchange="importData(this)">
            </label>
          </div>
        </div>
      </div>
      
      <!-- Statistics Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-chart-bar text-primary-500"></i>
          Statistik Aplikasi
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-2xl font-bold text-gray-800 dark:text-white">${transactions.length}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Transaksi</p>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">${transactions.filter(t => t.type === 'income').length}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pemasukan</p>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">${transactions.filter(t => t.type === 'expense').length}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pengeluaran</p>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">${categories.length}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
          </div>
        </div>
      </div>
      
      <!-- Danger Zone -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
          <i class="fas fa-exclamation-triangle"></i>
          Zona Bahaya
        </h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-red-700 dark:text-red-300">Reset Semua Data</p>
            <p class="text-sm text-red-600 dark:text-red-400">Hapus semua transaksi dan kategori. Tindakan ini tidak dapat dibatalkan!</p>
          </div>
          <button onclick="resetAllData()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <i class="fas fa-trash"></i>
            Reset
          </button>
        </div>
      </div>
      
      <!-- App Info -->
      <div class="text-center py-6">
        <div class="flex items-center justify-center gap-3 mb-2">
          <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <i class="fas fa-wallet text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">FinBot</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Asisten Keuangan Pribadi</p>
          </div>
        </div>
        <p class="text-sm text-gray-400 dark:text-gray-500">Versi 1.0.0</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">© 2024 FinBot. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Setup dark mode toggle
  const toggleBtn = document.getElementById('dark-mode-toggle-settings');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => Topbar.toggleDarkMode());
  }
}

/**
 * Export all data to JSON file
 */
window.exportData = function() {
  const data = Storage.exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const filename = `finbot_backup_${new Date().toISOString().split('T')[0]}.json`;
  
  Utils.downloadFile(blob, filename);
  Utils.showToast('Data berhasil diekspor', 'success');
};

/**
 * Import data from JSON file
 */
window.importData = function(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      const success = Storage.importAllData(data);
      
      if (success) {
        Utils.showToast('Data berhasil diimpor', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        Utils.showToast('Format file tidak valid', 'error');
      }
    } catch (error) {
      Utils.showToast('Gagal membaca file', 'error');
      console.error('Import error:', error);
    }
  };
  reader.readAsText(file);
  
  // Reset input
  input.value = '';
};

/**
 * Reset all application data
 */
window.resetAllData = async function() {
  if (!await Utils.confirm('⚠️ PERINGATAN: Semua data akan dihapus permanen! Apakah Anda yakin?')) return;
  if (!await Utils.confirm('Konfirmasi sekali lagi: Tindakan ini TIDAK DAPAT dibatalkan!')) return;
  
  Storage.resetAllData();
  Utils.showToast('Semua data telah direset', 'success');
  setTimeout(() => window.location.reload(), 1000);
};

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Listen for dark mode changes
  window.addEventListener('dark-mode-change', () => {
    renderSettings();
  });
  
  // Listen for storage changes
  window.addEventListener('storage-change', () => {
    renderSettings();
  });
}

document.addEventListener('DOMContentLoaded', initSettings);

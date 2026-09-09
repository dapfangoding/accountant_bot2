/**
 * Chatbot Page - AI-powered Transaction Management
 * Handles chat interface and natural language commands
 */

let chatMessages = [];

function initChatbot() {
  Sidebar.render();
  Topbar.render('Chatbot');
  loadChatHistory();
  renderChatMessages();
  setupEventListeners();
  
  // Listen for storage changes
  window.addEventListener('storage-change', () => {
    // Refresh if transactions changed
  });
}

/**
 * Load chat history from storage
 */
function loadChatHistory() {
  chatMessages = Storage.getChatHistory();
  
  // If empty, add welcome message
  if (chatMessages.length === 0) {
    chatMessages = [{
      id: Utils.generateId('msg'),
      role: 'assistant',
      content: 'Halo! Saya FinBot, asisten keuangan pribadi Anda. Saya bisa membantu Anda:\n\n• Menambah transaksi (contoh: "tambah pengeluaran 50000 untuk makan siang")\n• Menghapus transaksi (contoh: "hapus transaksi makan siang")\n• Mengubah transaksi (contoh: "ubah makan siang jadi 75000")\n• Melihat laporan (contoh: "tampilkan laporan bulan ini")\n\nApa yang bisa saya bantu?',
      timestamp: new Date().toISOString(),
    }];
    Storage.saveChatHistory(chatMessages);
  }
}

/**
 * Render all chat messages
 */
function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.innerHTML = chatMessages.map(msg => `
    <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 chat-bubble">
      <div class="max-w-[85%] sm:max-w-[75%]">
        <div class="${msg.role === 'user' 
          ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'
        } px-4 py-3 shadow-sm">
          <p class="text-sm whitespace-pre-wrap">${formatMessageContent(msg.content)}</p>
        </div>
        <p class="text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}">
          ${new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  `).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

/**
 * Format message content (convert simple markdown)
 */
function formatMessageContent(content) {
  return Utils.escapeHtml(content)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">$1</code>')
    .replace(/\n/g, '<br>');
}

/**
 * Add a message to chat
 */
function addMessage(role, content) {
  const message = {
    id: Utils.generateId('msg'),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
  
  chatMessages.push(message);
  Storage.saveChatHistory(chatMessages);
  renderChatMessages();
  
  return message;
}

/**
 * Process user command
 */
async function processCommand(input) {
  const text = input.toLowerCase().trim();
  
  // Intent: Add transaction
  if (text.match(/^(tambah|add|input|catat)/)) {
    return handleAddTransaction(input);
  }
  
  // Intent: Delete transaction
  if (text.match(/^(hapus|delete|remove)/)) {
    return handleDeleteTransaction(input);
  }
  
  // Intent: Update transaction
  if (text.match(/^(ubah|update|edit)/)) {
    return handleUpdateTransaction(input);
  }
  
  // Intent: Show report/summary
  if (text.match(/^(laporan|report|ringkasan|summary|saldo|balance)/)) {
    return handleReport(input);
  }
  
  // Intent: List transactions
  if (text.match(/^(list|daftar|show|tampilkan|riwayat)/)) {
    return handleListTransactions(input);
  }
  
  // Intent: Help
  if (text.match(/^(help|bantuan|apa yang bisa|how to)/)) {
    return getHelpMessage();
  }
  
  // Default: Unknown command
  return {
    success: false,
    message: 'Maaf, saya tidak memahami perintah tersebut. Coba gunakan salah satu format berikut:\n\n• `tambah pengeluaran 50000 untuk makan siang`\n• `tambah pemasukan 5000000 untuk gaji`\n• `hapus transaksi makan siang`\n• `ubah makan siang jadi 75000`\n• `laporan bulan ini`\n\nKetik `help` untuk bantuan lebih lanjut.',
  };
}

/**
 * Handle add transaction command
 */
function handleAddTransaction(input) {
  const text = input.toLowerCase();
  
  // Pattern: tambah [tipe] [jumlah] untuk [deskripsi]
  // Example: "tambah pengeluaran 50000 untuk makan siang"
  const patterns = [
    /(?:tambah|add|input|catat)\s+(pengeluaran|expense|keluar|pemasukan|income|masuk)\s+([\d.]+)\s+(?:untuk|for)?\s*(.+)/i,
    /(?:tambah|add|input|catat)\s+([\d.]+)\s+(?:untuk|for)?\s*(.+)/i,
  ];
  
  let match = null;
  for (const pattern of patterns) {
    match = input.match(pattern);
    if (match) break;
  }
  
  if (!match) {
    return {
      success: false,
      message: 'Format tidak dikenali. Gunakan format:\n`tambah [pengeluaran/pemasukan] [jumlah] untuk [deskripsi]`\n\nContoh:\n• `tambah pengeluaran 50000 untuk makan siang`\n• `tambah pemasukan 5000000 untuk gaji`',
    };
  }
  
  // Extract values
  let type = 'expense';
  let amount = 0;
  let description = '';
  
  if (match[1]) {
    const firstMatch = match[1].toLowerCase();
    if (firstMatch.includes('masuk') || firstMatch.includes('income') || firstMatch.includes('pemasukan')) {
      type = 'income';
    }
    
    // Check if first match is a number
    if (/^[\d.]+$/.test(firstMatch)) {
      amount = parseFloat(firstMatch.replace(/\./g, ''));
      description = match[2] || match[3] || 'Transaksi';
    } else {
      amount = parseFloat(match[2]?.replace(/\./g, '') || '0');
      description = match[3] || match[2] || 'Transaksi';
    }
  }
  
  if (amount <= 0) {
    return {
      success: false,
      message: 'Jumlah harus lebih dari 0.',
    };
  }
  
  // Detect category
  const category = Utils.detectCategory(description);
  
  // Create transaction
  const transaction = {
    id: Utils.generateId('trx'),
    date: new Date().toISOString().split('T')[0],
    type,
    amount,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    categoryId: category.id,
  };
  
  Storage.addTransaction(transaction);
  
  const balance = Utils.calculateBalance(Storage.getTransactions());
  
  return {
    success: true,
    message: `✅ Transaksi berhasil ditambahkan!\n\n📝 **Detail**:\n• Tipe: ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}\n• Jumlah: ${Utils.formatRupiah(amount)}\n• Deskripsi: ${transaction.description}\n• Kategori: ${category.name}\n\n💰 **Saldo Anda**: ${Utils.formatRupiah(balance.balance)}`,
    transaction,
  };
}

/**
 * Handle delete transaction command
 */
function handleDeleteTransaction(input) {
  const text = input.toLowerCase();
  const transactions = Storage.getTransactions();
  
  // Extract search term after "hapus"
  const searchTerm = text.replace(/^(hapus|delete|remove)\s+/i, '').trim();
  
  if (!searchTerm) {
    return {
      success: false,
      message: 'Sebutkan deskripsi transaksi yang ingin dihapus.\n\nContoh: `hapus transaksi makan siang`',
    };
  }
  
  // Find matching transactions (case insensitive, partial match)
  const matches = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm)
  );
  
  if (matches.length === 0) {
    return {
      success: false,
      message: `Tidak ditemukan transaksi dengan deskripsi "${searchTerm}".`,
    };
  }
  
  if (matches.length > 1) {
    // Multiple matches - show list
    const list = matches.map((t, i) => 
      `${i + 1}. ${t.description} - ${Utils.formatRupiah(t.amount)} (${Utils.formatDate(t.date)})`
    ).join('\n');
    
    return {
      success: false,
      message: `Ditemukan ${matches.length} transaksi yang cocok:\n\n${list}\n\nHarap spesifikkan lagi deskripsinya.`,
    };
  }
  
  // Single match - delete it
  const deleted = Storage.deleteTransaction(matches[0].id);
  
  if (deleted) {
    const balance = Utils.calculateBalance(Storage.getTransactions());
    return {
      success: true,
      message: `✅ Transaksi "${matches[0].description}" berhasil dihapus.\n\n💰 **Saldo Anda**: ${Utils.formatRupiah(balance.balance)}`,
    };
  }
  
  return {
    success: false,
    message: 'Gagal menghapus transaksi.',
  };
}

/**
 * Handle update transaction command
 */
function handleUpdateTransaction(input) {
  const text = input.toLowerCase();
  const transactions = Storage.getTransactions();
  
  // Pattern: ubah [deskripsi] jadi [nilai baru]
  const match = text.match(/^(ubah|update|edit)\s+(.+?)\s+jadi\s+(.+)/i);
  
  if (!match) {
    return {
      success: false,
      message: 'Format tidak dikenali. Gunakan format:\n`ubah [deskripsi] jadi [nilai baru]`\n\nContoh:\n• `ubah makan siang jadi 75000` (update jumlah)\n• `ubah makan siang jadi makan malam` (update deskripsi)',
    };
  }
  
  const searchDesc = match[2].trim();
  const newValue = match[3].trim();
  
  // Find matching transaction
  const found = transactions.find(t => 
    t.description.toLowerCase().includes(searchDesc)
  );
  
  if (!found) {
    return {
      success: false,
      message: `Tidak ditemukan transaksi dengan deskripsi "${searchDesc}".`,
    };
  }
  
  // Check if new value is a number (update amount)
  const newAmount = parseFloat(newValue.replace(/\./g, ''));
  
  if (!isNaN(newAmount) && newAmount > 0) {
    // Update amount
    Storage.updateTransaction(found.id, { amount: newAmount });
    
    const balance = Utils.calculateBalance(Storage.getTransactions());
    return {
      success: true,
      message: `✅ Transaksi berhasil diubah!\n\n📝 **Detail**:\n• Deskripsi: ${found.description}\n• Jumlah baru: ${Utils.formatRupiah(newAmount)}\n\n💰 **Saldo Anda**: ${Utils.formatRupiah(balance.balance)}`,
    };
  } else {
    // Update description
    Storage.updateTransaction(found.id, { 
      description: newValue.charAt(0).toUpperCase() + newValue.slice(1) 
    });
    
    return {
      success: true,
      message: `✅ Deskripsi transaksi berhasil diubah dari "${found.description}" menjadi "${newValue}".`,
    };
  }
}

/**
 * Handle report request
 */
function handleReport(input) {
  const transactions = Storage.getTransactions();
  const balance = Utils.calculateBalance(transactions);
  
  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const monthBalance = Utils.calculateBalance(monthTransactions);
  
  return {
    success: true,
    message: `📊 **Laporan Keuangan**\n\n💰 **Saldo Total**: ${Utils.formatRupiah(balance.balance)}\n\n📈 **Bulan Ini**:\n• Pemasukan: ${Utils.formatRupiah(monthBalance.income)}\n• Pengeluaran: ${Utils.formatRupiah(monthBalance.expense)}\n• Saldo Bulan: ${Utils.formatRupiah(monthBalance.balance)}\n\n📝 **Total Transaksi**: ${transactions.length}\n\nKetik \`laporan detail\` untuk melihat breakdown per kategori.`,
  };
}

/**
 * Handle list transactions request
 */
function handleListTransactions(input) {
  const transactions = Storage.getTransactions();
  
  if (transactions.length === 0) {
    return {
      success: true,
      message: 'Belum ada transaksi. Gunakan perintah `tambah` untuk menambahkan transaksi pertama Anda.',
    };
  }
  
  // Get last 5 transactions
  const recent = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  const list = recent.map((t, i) => 
    `${i + 1}. ${t.description} - ${t.type === 'income' ? '+' : '-'}${Utils.formatRupiah(t.amount)} (${Utils.formatDate(t.date)})`
  ).join('\n');
  
  return {
    success: true,
    message: `📝 **5 Transaksi Terakhir**:\n\n${list}\n\nTotal: ${transactions.length} transaksi.\n\nBuka halaman **Transaksi** untuk melihat semua data.`,
  };
}

/**
 * Get help message
 */
function getHelpMessage() {
  return {
    success: true,
    message: `🤖 **FinBot Helper**\n\nSaya bisa membantu Anda mengelola keuangan dengan perintah berikut:\n\n**Tambah Transaksi**:\n• \`tambah pengeluaran 50000 untuk makan siang\`\n• \`tambah pemasukan 5000000 untuk gaji\`\n\n**Hapus Transaksi**:\n• \`hapus transaksi makan siang\`\n\n**Ubah Transaksi**:\n• \`ubah makan siang jadi 75000\` (update jumlah)\n• \`ubah makan siang jadi makan malam\` (update deskripsi)\n\n**Laporan**:\n• \`laporan\` - Lihat ringkasan\n• \`riwayat\` - Lihat transaksi terakhir\n\n**Lainnya**:\n• \`saldo\` - Cek saldo saat ini\n• \`help\` - Tampilkan bantuan ini`,
  };
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const inputField = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSendMessage);
  }
  
  if (inputField) {
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
    
    // Auto-resize textarea
    inputField.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });
  }
  
  // Clear chat button
  const clearBtn = document.getElementById('clear-chat');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Hapus semua riwayat chat?')) {
        Storage.clearChatHistory();
        chatMessages = [];
        loadChatHistory();
        renderChatMessages();
      }
    });
  }
}

/**
 * Handle send message
 */
async function handleSendMessage() {
  const inputField = document.getElementById('chat-input');
  const input = inputField?.value.trim();
  
  if (!input) return;
  
  // Add user message
  addMessage('user', input);
  inputField.value = '';
  inputField.style.height = 'auto';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Process command
  setTimeout(async () => {
    const result = await processCommand(input);
    hideTypingIndicator();
    addMessage('assistant', result.message);
  }, 500);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'flex justify-start mb-4';
  typingDiv.innerHTML = `
    <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initChatbot);

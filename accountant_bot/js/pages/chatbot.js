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
      content: 'Halo! Saya **FinBot AI**. Siap bantu catat & kelola keuangan Anda dengan bahasa sehari-hari.\n\nCoba ketik "tambah pengeluaran 50000 untuk makan siang" atau klik tombol cepat di atas! 🚀',
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

   if (chatMessages.length === 0) {
     container.innerHTML = '';
     return;
   }

   container.innerHTML = `
     <div class="flex justify-center">
       <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant text-label-caps">
         <span class="material-symbols-outlined text-primary text-[13px]" data-icon="lock" style="font-variation-settings: 'FILL' 1;">lock</span>
         <span>256-BIT ENCRYPTED • PERCAKAPAN AMAN</span>
       </div>
     </div>
   ` + chatMessages.map(msg => {
     const isUser = msg.role === 'user';
     const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
     
     if (isUser) {
       return `
         <div class="flex flex-col items-end max-w-[88%] ml-auto space-y-1">
           <div class="bg-gradient-to-br from-primary-container to-emerald-700 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md shadow-primary-container/20">
             <p class="text-body-md font-medium whitespace-pre-wrap">${formatMessageContent(msg.content)}</p>
           </div>
           <div class="flex items-center gap-1 text-label-md text-on-surface-variant pr-1">
             <span>${time}</span>
             <span class="material-symbols-outlined text-[13px] text-primary" data-icon="done_all" style="font-variation-settings: 'FILL' 1;">done_all</span>
           </div>
         </div>
       `;
     } else {
       return `
         <div class="flex gap-2.5 items-start max-w-[95%]">
           <div class="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0 mt-0.5">
             <span class="material-symbols-outlined text-primary text-[16px]" data-icon="smart_toy">smart_toy</span>
           </div>
           <div class="space-y-1 w-full">
             <div class="bg-surface-container-high border border-white/5 rounded-2xl rounded-tl-sm p-3.5 text-on-surface shadow-sm flex flex-col gap-2">
               <p class="text-body-md leading-relaxed whitespace-pre-wrap">${formatMessageContent(msg.content)}</p>
               <div class="flex justify-end pt-1">
                 <span class="text-label-md text-on-surface-variant/70">${time}</span>
               </div>
             </div>
           </div>
         </div>
       `;
     }
   }).join('');

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
  const settings = Storage.getSettings();
  
  // Try Gemini if API Key exists
  if (settings.geminiApiKey) {
    try {
      const geminiResult = await processWithGemini(input, settings.geminiApiKey);
      if (geminiResult) return geminiResult;
    } catch (error) {
      console.error('Gemini error:', error);
      // Fallback to local regex if Gemini fails
    }
  }

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
  
  // Intent: Category management
  if (text.match(/^(tambah|add|buat).*kategori/)) {
    return handleAddCategory(input);
  }
  
  if (text.match(/^(ubah|update|edit).*kategori/)) {
    return handleUpdateCategory(input);
  }
  
  if (text.match(/^(hapus|delete|remove).*kategori/)) {
    return handleDeleteCategory(input);
  }
  
  if (text.match(/^(lihat|tampilkan|show|list).*kategori/)) {
    return handleListCategories(input);
  }
  
  // Intent: Budget analysis
  if (text.match(/^(budget|anggaran|analisis|analysis|pengeluaran per kategori)/)) {
    return handleBudgetAnalysis(input);
  }

  // Default: Unknown command
  return {
    success: false,
    message: 'Maaf, saya tidak memahami perintah tersebut. Coba gunakan salah satu format berikut:\n\n• `tambah pengeluaran 50000 untuk makan siang`\n• `tambah pemasukan 5000000 untuk gaji`\n• `hapus transaksi makan siang`\n• `ubah makan siang jadi 75000`\n• `laporan bulan ini`\n\nKetik `help` untuk bantuan lebih lanjut.',
  };
}

/**
 * Process command using Gemini AI Function Calling
 */
async function processWithGemini(input, apiKey) {
  const settings = Storage.getSettings();
  const model = settings.geminiModel || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const categories = Storage.getCategories().map(c => c.name).join(', ');
  const today = new Date().toISOString().split('T')[0];

  const payload = {
    contents: [{ parts: [{ text: input }] }],
    tools: [{
      function_declarations: [
        {
          name: "add_transaction",
          description: "Menambah transaksi pengeluaran atau pemasukan baru",
          parameters: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["income", "expense"], description: "Tipe transaksi" },
              amount: { type: "number", description: "Jumlah uang dalam angka" },
              description: { type: "string", description: "Deskripsi singkat transaksi" },
              category: { type: "string", description: `Kategori yang paling cocok. Pilihan: ${categories}` }
            },
            required: ["type", "amount", "description"]
          }
        },
        {
          name: "delete_transaction",
          description: "Menghapus transaksi berdasarkan kata kunci deskripsi",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Kata kunci transaksi yang ingin dihapus" }
            },
            required: ["query"]
          }
        },
        {
          name: "get_report",
          description: "Melihat laporan atau ringkasan keuangan",
          parameters: {
            type: "object",
            properties: {
              period: { type: "string", enum: ["today", "this_month", "all"], description: "Periode laporan" }
            }
          }
        },
        {
          name: "add_category",
          description: "Menambah kategori pengeluaran atau pemasukan baru",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Nama kategori" },
              type: { type: "string", enum: ["income", "expense"], description: "Tipe kategori" },
              budgetLimit: { type: "number", description: "Batas budget (opsional)" },
              budgetEnabled: { type: "boolean", description: "Aktifkan budget limit" }
            },
            required: ["name"]
          }
        },
        {
          name: "update_category",
          description: "Mengubah kategori yang sudah ada",
          parameters: {
            type: "object",
            properties: {
              oldName: { type: "string", description: "Nama kategori lama" },
              newName: { type: "string", description: "Nama kategori baru" },
              type: { type: "string", enum: ["income", "expense"], description: "Tipe kategori" },
              budgetLimit: { type: "number", description: "Batas budget (opsional)" },
              budgetEnabled: { type: "boolean", description: "Aktifkan budget limit" }
            },
            required: ["oldName", "newName"]
          }
        },
        {
          name: "delete_category",
          description: "Menghapus kategori",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Nama kategori yang ingin dihapus" }
            },
            required: ["name"]
          }
        },
        {
          name: "get_budget_analysis",
          description: "Mendapatkan analisis budget per kategori",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      ]
    }],
    system_instruction: {
      parts: [{ text: `Anda adalah FinBot, asisten keuangan. Hari ini tanggal ${today}. Gunakan function calling untuk memproses perintah user. Jika user hanya menyapa atau bertanya umum, jawablah dengan sopan.

Kemampuan Anda:
- Menambah transaksi (add_transaction)
- Menghapus transaksi (delete_transaction)
- Melihat laporan (get_report)
- Menambah kategori (add_category) - bisa set budget limit
- Mengubah kategori (update_category) - bisa ubah nama, tipe, budget
- Menghapus kategori (delete_category)
- Analisis budget per kategori (get_budget_analysis) - tampilkan spending vs budget, peringatan over budget

Contoh perintah user ke function:
- "tambah kategori Biaya Penelitian pemasukan" -> add_category {name: "Biaya Penelitian", type: "income"}
- "tambah kategori Makanan pengeluaran budget 2000000" -> add_category {name: "Makanan", type: "expense", budgetLimit: 2000000, budgetEnabled: true}
- "ubah kategori Transport jadi Transport budget 1000000" -> update_category {oldName: "Transport", newName: "Transport", budgetLimit: 1000000, budgetEnabled: true}
- "hapus kategori Hiburan" -> delete_category {name: "Hiburan"}
- "analisis budget" -> get_budget_analysis {}
- "laporan bulan ini" -> get_report {period: "this_month"}` }]
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const call = candidate?.content?.parts?.find(p => p.functionCall);

  if (call) {
    const { name, args } = call.functionCall;
    
    if (name === 'add_transaction') {
      const typeStr = args.type === 'income' ? 'pemasukan' : 'pengeluaran';
      const simInput = `tambah ${typeStr} ${args.amount} untuk ${args.description}`;
      return handleAddTransaction(simInput);
    }
    
    if (name === 'delete_transaction') {
      return handleDeleteTransaction(`hapus ${args.query}`);
    }
    
    if (name === 'get_report') {
      return handleReport(args.period || 'bulan ini');
    }
    
    if (name === 'add_category') {
      const typeStr = args.type === 'income' ? 'pemasukan' : 'pengeluaran';
      const budgetStr = args.budgetLimit ? ` budget: ${args.budgetLimit}` : '';
      const simInput = `tambah kategori ${args.name} ${typeStr}${budgetStr}`;
      return handleAddCategory(simInput);
    }
    
    if (name === 'update_category') {
      const typeStr = args.type ? (args.type === 'income' ? 'pemasukan' : 'pengeluaran') : '';
      const budgetStr = args.budgetLimit !== undefined ? (args.budgetEnabled ? ` budget: ${args.budgetLimit}` : ' budget: 0') : '';
      const simInput = `ubah kategori ${args.oldName} jadi ${args.newName} ${typeStr}${budgetStr}`.trim();
      return handleUpdateCategory(simInput);
    }
    
    if (name === 'delete_category') {
      return handleDeleteCategory(`hapus kategori ${args.name}`);
    }
    
    if (name === 'get_budget_analysis') {
      return handleBudgetAnalysis('budget');
    }
  }

  if (candidate?.content?.parts?.[0]?.text) {
    return {
      success: true,
      message: candidate.content.parts[0].text
    };
  }

  return null;
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
 * Handle add category command
 * Format: tambah kategori [nama] [pengeluaran/pemasukan] [budget: jumlah]
 */
function handleAddCategory(input) {
  const text = input.toLowerCase();
  
  // Pattern: tambah kategori [nama] [tipe] [budget: xxx]
  const match = text.match(/^(tambah|add|buat)\s+kategori\s+(.+?)(?:\s+(pengeluaran|expense|pemasukan|income|keluar|masuk))?(?:\s+budget[:\s]+([\d.]+))?$/i);
  
  if (!match) {
    return {
      success: false,
      message: 'Format tidak dikenali. Gunakan format:\n`tambah kategori [nama] [pengeluaran/pemasukan] [budget: jumlah]`\n\nContoh:\n• `tambah kategori Biaya Penelitian pemasukan`\n• `tambah kategori Makanan pengeluaran budget: 2000000`\n• `tambah kategori Transport` (default: pengeluaran, no budget)',
    };
  }
  
  const name = match[2].trim();
  const typeStr = match[3]?.toLowerCase();
  const budgetStr = match[4];
  
  let type = 'expense';
  if (typeStr && (typeStr.includes('masuk') || typeStr.includes('income') || typeStr.includes('pemasukan'))) {
    type = 'income';
  }
  
  const budgetLimit = budgetStr ? parseFloat(budgetStr.replace(/\./g, '')) : null;
  
  if (!name) {
    return {
      success: false,
      message: 'Nama kategori harus diisi.',
    };
  }
  
  // Check if category already exists
  const existing = Storage.getCategories().find(c => 
    c.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existing) {
    return {
      success: false,
      message: `Kategori "${name}" sudah ada. Gunakan perintah \`ubah kategori ${name}\` untuk mengedit.`,
    };
  }
  
  const category = {
    id: Utils.generateId('cat'),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    type,
    color: type === 'income' ? '#22c55e' : '#ef4444',
    icon: type === 'income' ? 'fa-money-bill' : 'fa-folder',
    budgetLimit: budgetLimit || null,
    budgetEnabled: budgetLimit !== null && budgetLimit > 0,
  };
  
  Storage.addCategory(category);
  
  return {
    success: true,
    message: `✅ Kategori berhasil ditambahkan!\n\n📝 **Detail**:\n• Nama: ${category.name}\n• Tipe: ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}\n${category.budgetEnabled ? `• Budget: ${Utils.formatRupiah(category.budgetLimit)}` : '• Budget: Tidak ada batasan'}\n\nKlik halaman **Kategori** untuk melihat budget bar.`,
  };
}

/**
 * Handle update category command
 * Format: ubah kategori [nama lama] jadi [nama baru] [tipe] [budget: xxx]
 */
function handleUpdateCategory(input) {
  const text = input.toLowerCase();
  
  const match = text.match(/^(ubah|update|edit)\s+kategori\s+(.+?)\s+jadi\s+(.+?)(?:\s+(pengeluaran|expense|pemasukan|income|keluar|masuk))?(?:\s+budget[:\s]+([\d.]+))?$/i);
  
  if (!match) {
    return {
      success: false,
      message: 'Format tidak dikenali. Gunakan format:\n`ubah kategori [nama lama] jadi [nama baru] [pengeluaran/pemasukan] [budget: jumlah]`\n\nContoh:\n• `ubah kategori Makanan jadi Makanan & Minuman`\n• `ubah kategori Transport jadi Transport budget: 1000000`\n• `ubah kategori Gaji jadi Bonus pemasukan`',
    };
  }
  
  const oldName = match[2].trim();
  const newName = match[3].trim();
  const typeStr = match[4]?.toLowerCase();
  const budgetStr = match[5];
  
  const category = Storage.getCategories().find(c => 
    c.name.toLowerCase() === oldName.toLowerCase()
  );
  
  if (!category) {
    return {
      success: false,
      message: `Kategori "${oldName}" tidak ditemukan.`,
    };
  }
  
  const updates = { name: newName.charAt(0).toUpperCase() + newName.slice(1) };
  
  if (typeStr) {
    updates.type = (typeStr.includes('masuk') || typeStr.includes('income') || typeStr.includes('pemasukan')) ? 'income' : 'expense';
    updates.color = updates.type === 'income' ? '#22c55e' : '#ef4444';
    updates.icon = updates.type === 'income' ? 'fa-money-bill' : 'fa-folder';
  }
  
  if (budgetStr !== undefined) {
    if (budgetStr) {
      updates.budgetLimit = parseFloat(budgetStr.replace(/\./g, ''));
      updates.budgetEnabled = updates.budgetLimit > 0;
    } else {
      updates.budgetLimit = null;
      updates.budgetEnabled = false;
    }
  }
  
  Storage.updateCategory(category.id, updates);
  
  return {
    success: true,
    message: `✅ Kategori "${oldName}" berhasil diubah menjadi "${updates.name}".\n\n${updates.type ? `• Tipe: ${updates.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}` : ''}\n${updates.budgetLimit !== undefined ? (updates.budgetEnabled ? `• Budget: ${Utils.formatRupiah(updates.budgetLimit)}` : '• Budget: Dihapus (no limit)') : ''}`,
  };
}

/**
 * Handle delete category command
 */
function handleDeleteCategory(input) {
  const text = input.toLowerCase();
  const searchTerm = text.replace(/^(hapus|delete|remove)\s+kategori\s+/i, '').trim();
  
  if (!searchTerm) {
    return {
      success: false,
      message: 'Sebutkan nama kategori yang ingin dihapus.\n\nContoh: `hapus kategori Makanan`',
    };
  }
  
  const category = Storage.getCategories().find(c => 
    c.name.toLowerCase().includes(searchTerm)
  );
  
  if (!category) {
    return {
      success: false,
      message: `Kategori "${searchTerm}" tidak ditemukan.`,
    };
  }
  
  // Check if category has transactions
  const transactions = Storage.getTransactions().filter(t => t.categoryId === category.id);
  
  if (transactions.length > 0) {
    return {
      success: false,
      message: `Kategori "${category.name}" memiliki ${transactions.length} transaksi. Hapus transaksi terlebih dahulu atau pindahkan ke kategori lain.`,
    };
  }
  
  Storage.deleteCategory(category.id);
  
  return {
    success: true,
    message: `✅ Kategori "${category.name}" berhasil dihapus.`,
  };
}

/**
 * Handle list categories command
 */
function handleListCategories(input) {
  const categories = Storage.getCategories();
  
  if (categories.length === 0) {
    return {
      success: true,
      message: 'Belum ada kategori. Gunakan `tambah kategori [nama]` untuk membuat kategori baru.',
    };
  }
  
  const list = categories.map((cat, i) => {
    const budgetInfo = Storage.getCategoryBudgetUsage(cat.id);
    const budgetText = cat.budgetEnabled && budgetInfo 
      ? `\n   💰 Budget: ${Utils.formatRupiah(budgetInfo.spent)} / ${Utils.formatRupiah(budgetInfo.limit)} (${budgetInfo.percentage.toFixed(1)}%)${budgetInfo.exceeded ? ' ⚠️ OVER' : ''}`
      : cat.budgetEnabled ? '\n   💰 Budget: 0 / ' + Utils.formatRupiah(cat.budgetLimit) + ' (0%)' : '\n   💰 Budget: No limit';
    
    return `${i + 1}. **${cat.name}** (${cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'})${budgetText}`;
  }).join('\n');
  
  return {
    success: true,
    message: `📋 **Daftar Kategori** (${categories.length}):\n\n${list}\n\nGunakan \`tambah kategori\`, \`ubah kategori\`, atau \`hapus kategori\` untuk mengelola.`,
  };
}

/**
 * Handle budget analysis command
 */
function handleBudgetAnalysis(input) {
  const categories = Storage.getCategories();
  const transactions = Storage.getTransactions();
  
  const expenseCategories = categories.filter(c => c.type === 'expense');
  
  if (expenseCategories.length === 0) {
    return {
      success: true,
      message: 'Belum ada kategori pengeluaran untuk dianalisis.',
    };
  }
  
  // Calculate spending per category
  const analysis = expenseCategories.map(cat => {
    const spent = transactions
      .filter(t => t.categoryId === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    const budgetInfo = Storage.getCategoryBudgetUsage(cat.id);
    
    return {
      name: cat.name,
      spent,
      limit: cat.budgetLimit || 0,
      enabled: cat.budgetEnabled,
      percentage: budgetInfo?.percentage || 0,
      exceeded: budgetInfo?.exceeded || false,
    };
  }).sort((a, b) => b.spent - a.spent);
  
  const totalSpent = analysis.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = analysis.filter(c => c.enabled).reduce((sum, c) => sum + c.limit, 0);
  
  let output = `📊 **Analisis Budget per Kategori**\n\n`;
  
  if (totalBudget > 0) {
    output += `💰 **Total Budget**: ${Utils.formatRupiah(totalBudget)}\n`;
    output += `📈 **Total Terpakai**: ${Utils.formatRupiah(totalSpent)} (${totalBudget > 0 ? ((totalSpent/totalBudget)*100).toFixed(1) : 0}%)\n\n`;
  }
  
  output += `**Detail per Kategori**:\n`;
  
  analysis.forEach((cat, i) => {
    const icon = cat.exceeded ? '🔴' : cat.enabled && cat.percentage >= 80 ? '🟡' : cat.enabled ? '🟢' : '⚪';
    output += `\n${i + 1}. ${icon} **${cat.name}**\n`;
    output += `   💸 Terpakai: ${Utils.formatRupiah(cat.spent)}`;
    
    if (cat.enabled) {
      output += `\n   📊 Budget: ${Utils.formatRupiah(cat.limit)} (${cat.percentage.toFixed(1)}%)`;
      if (cat.exceeded) output += ` ⚠️ **MELEBIHI BATAS**`;
      const remaining = cat.limit - cat.spent;
      if (remaining > 0) output += `\n   💵 Sisa: ${Utils.formatRupiah(remaining)}`;
    } else {
      output += `\n   📊 Budget: No limit`;
    }
  });
  
  // Add insights
  const overBudget = analysis.filter(c => c.exceeded);
  const nearLimit = analysis.filter(c => c.enabled && !c.exceeded && c.percentage >= 80);
  
  if (overBudget.length > 0 || nearLimit.length > 0) {
    output += `\n\n⚠️ **Peringatan**:\n`;
    overBudget.forEach(c => {
      output += `• ${c.name} melebihi budget ${Utils.formatRupiah(c.limit)} (terpakai ${Utils.formatRupiah(c.spent)})\n`;
    });
    nearLimit.forEach(c => {
      output += `• ${c.name} mendekati batas (${c.percentage.toFixed(1)}% terpakai)\n`;
    });
  }
  
  output += `\n💡 Ketik \`laporan detail\` untuk breakdown transaksi per kategori.`;
  
  return {
    success: true,
    message: output,
  };
}

/**
 * Get help message
 */
function getHelpMessage() {
  return {
    success: true,
    message: `🤖 **FinBot Helper**\n\nSaya bisa membantu Anda mengelola keuangan dengan perintah berikut:\n\n**Tambah Transaksi**:\n• \`tambah pengeluaran 50000 untuk makan siang\`\n• \`tambah pemasukan 5000000 untuk gaji\`\n\n**Hapus Transaksi**:\n• \`hapus transaksi makan siang\`\n\n**Ubah Transaksi**:\n• \`ubah makan siang jadi 75000\` (update jumlah)\n• \`ubah makan siang jadi makan malam\` (update deskripsi)\n\n**Kelola Kategori**:\n• \`tambah kategori [nama] [pengeluaran/pemasukan] [budget: jumlah]\`\n• \`ubah kategori [nama lama] jadi [nama baru] [tipe] [budget: jumlah]\`\n• \`hapus kategori [nama]\`\n• \`lihat kategori\` - Daftar semua kategori & budget\n\n**Budget & Analisis**:\n• \`budget\` atau \`analisis\` - Analisis budget per kategori\n• \`laporan\` - Ringkasan keuangan\n• \`riwayat\` - Transaksi terakhir\n\n**Lainnya**:\n• \`saldo\` - Cek saldo saat ini\n• \`help\` - Tampilkan bantuan ini`,
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
  const result = await processCommand(input);
  hideTypingIndicator();
  addMessage('assistant', result.message);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'flex gap-2.5 items-center';
  typingDiv.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-primary text-[16px]" data-icon="smart_toy">smart_toy</span>
    </div>
    <div class="flex items-center gap-2 px-3.5 py-2 rounded-2xl rounded-tl-sm bg-surface-container-high border border-white/5">
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 0ms;"></span>
        <span class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 150ms;"></span>
        <span class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 300ms;"></span>
      </div>
      <span class="text-label-md text-on-surface-variant ml-1">FinBot sedang menganalisis...</span>
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

# FinBot AI Chatbot - Fitur & Spesifikasi Lengkap

## Deskripsi Umum
FinBot adalah asisten keuangan berbasis AI yang dapat memahami perintah natural language untuk mengelola transaksi keuangan pribadi. Mendukung dua mode: **regex pattern matching lokal** dan **Gemini AI function calling** (jika API key tersedia).

---

## Fitur Utama

### 1. **Tambah Transaksi**
- **Perintah**: `tambah [tipe] [jumlah] untuk [deskripsi]`
- **Contoh**:
  - `tambah pengeluaran 50000 untuk makan siang`
  - `tambah pemasukan 5000000 untuk gaji`
  - `tambah 100000 untuk transport` (default: pengeluaran)
- **Kemampuan**:
  - Parsing natural language (fleksibel urutan kata)
  - Auto-detect kategori berdasarkan kata kunci deskripsi
  - Support angka dengan/tanpa pemisah ribuan (`.`)
  - Validasi jumlah > 0
  - Otomatis set tanggal hari ini
  - Tampilkan saldo real-time setelah transaksi
- **Response**:
  ```
  ✅ Transaksi berhasil ditambahkan!
  
  📝 Detail:
  • Tipe: Pengeluaran
  • Jumlah: Rp 50.000
  • Deskripsi: Makan siang
  • Kategori: Makanan & Minuman
  
  💰 Saldo Anda: Rp 2.450.000
  ```

### 2. **Hapus Transaksi**
- **Perintah**: `hapus [kata kunci deskripsi]`
- **Contoh**:
  - `hapus transaksi makan siang`
  - `hapus gaji`
- **Kemampuan**:
  - Pencarian partial match (case-insensitive)
  - Jika multiple match, tampilkan list untuk dipilih
  - Jika single match, langsung hapus
  - Konfirmasi penghapusan dengan detail transaksi
  - Update saldo real-time
- **Response untuk multiple match**:
  ```
  Ditemukan 3 transaksi yang cocok:
  
  1. Makan siang - Rp 50.000 (08 Okt 2026)
  2. Makan siang kemarin - Rp 75.000 (07 Okt 2026)
  3. Makan siang minggu lalu - Rp 60.000 (01 Okt 2026)
  
  Harap spesifikkan lagi deskripsinya.
  ```

### 3. **Ubah Transaksi**
- **Perintah**: `ubah [deskripsi lama] jadi [nilai baru]`
- **Contoh**:
  - `ubah makan siang jadi 75000` (update jumlah)
  - `ubah makan siang jadi makan malam` (update deskripsi)
- **Kemampuan**:
  - Deteksi otomatis apakah nilai baru adalah angka (update amount) atau teks (update deskripsi)
  - Pencarian transaksi case-insensitive
  - Validasi jumlah baru > 0
  - Capitalize otomatis untuk deskripsi baru
- **Response**:
  ```
  ✅ Transaksi berhasil diubah!
  
  📝 Detail:
  • Deskripsi: Makan siang
  • Jumlah baru: Rp 75.000
  
  💰 Saldo Anda: Rp 2.425.000
  ```

### 4. **Laporan Keuangan**
- **Perintah**: `laporan`, `report`, `ringkasan`, `summary`, `saldo`, `balance`
- **Kemampuan**:
  - Tampilkan saldo total
  - Breakdown pemasukan/pengeluaran bulan berjalan
  - Total transaksi all-time
  - Hint untuk laporan detail per kategori
- **Response**:
  ```
  📊 Laporan Keuangan
  
  💰 Saldo Total: Rp 2.425.000
  
  📈 Bulan Ini:
  • Pemasukan: Rp 5.000.000
  • Pengeluaran: Rp 2.575.000
  • Saldo Bulan: Rp 2.425.000
  
  📝 Total Transaksi: 47
  
  Ketik `laporan detail` untuk melihat breakdown per kategori.
  ```

### 5. **Riwayat Transaksi**
- **Perintah**: `list`, `daftar`, `show`, `tampilkan`, `riwayat`
- **Kemampuan**:
  - Tampilkan 5 transaksi terbaru
  - Sort descending by date
  - Format compact dengan icon +/- untuk tipe
  - Link ke halaman Transaksi untuk full list
- **Response**:
  ```
  📝 5 Transaksi Terakhir:
  
  1. Gaji Oktober - +Rp 5.000.000 (01 Okt 2026)
  2. Transport - -Rp 50.000 (08 Okt 2026)
  3. Makan siang - -Rp 75.000 (08 Okt 2026)
  4. Belanja bulanan - -Rp 500.000 (07 Okt 2026)
  5. Freelance project - +Rp 1.200.000 (05 Okt 2026)
  
  Total: 47 transaksi.
  
  Buka halaman Transaksi untuk melihat semua data.
  ```

### 6. **Bantuan (Help)**
- **Perintah**: `help`, `bantuan`, `apa yang bisa`, `how to`
- **Kemampuan**:
  - Tampilkan semua perintah yang tersedia
  - Contoh format untuk setiap intent
  - Grouping by kategori (Tambah, Hapus, Ubah, Laporan, Lainnya)
- **Response**:
  ```
  🤖 FinBot Helper
  
  Saya bisa membantu Anda mengelola keuangan dengan perintah berikut:
  
  **Tambah Transaksi**:
  • `tambah pengeluaran 50000 untuk makan siang`
  • `tambah pemasukan 5000000 untuk gaji`
  
  **Hapus Transaksi**:
  • `hapus transaksi makan siang`
  
  **Ubah Transaksi**:
  • `ubah makan siang jadi 75000` (update jumlah)
  • `ubah makan siang jadi makan malam` (update deskripsi)
  
  **Laporan**:
  • `laporan` - Lihat ringkasan
  • `riwayat` - Lihat transaksi terakhir
  
  **Lainnya**:
  • `saldo` - Cek saldo saat ini
  • `help` - Tampilkan bantuan ini
  ```

## UI/UX Features

### Quick Action Chips
Tombol cepat di atas area chat:
- **Analisis**: Trigger analisis keuangan
- **Laporan**: Tampilkan laporan bulan ini
- **Saldo**: Cek saldo saat ini
- **Bantuan**: Tampilkan help message

### Chat Interface
- **Auto-scroll**: Scroll to bottom saat pesan baru
- **Typing indicator**: 3-dot animation saat AI memproses
- **Message animation**: Slide-in effect untuk setiap pesan
- **Timestamp**: Format `HH:MM` (24-hour) untuk setiap pesan
- **Read receipt**: Double-check icon untuk pesan user
- **Bot avatar**: Robot icon dengan background primary color
- **Auto-resize input**: Textarea expand saat ketik (max 150px)

### Input Bar
- **Floating design**: Sticky di bottom dengan backdrop blur
- **Enter to send**: Submit dengan Enter (Shift+Enter untuk newline)
- **Attachment button**: Icon paperclip (visual only, belum functional)
- **Voice input button**: Mic icon (visual only, belum functional)
- **Send button**: Icon paper plane dengan primary color

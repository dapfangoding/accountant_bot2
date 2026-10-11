# FinBot AI - Asisten Keuangan Pribadi ☁️

Aplikasi manajemen keuangan pribadi berbasis web dengan **cloud database (Supabase)** dan struktur multi-file yang modular dan mudah di-maintain.

## 🆕 Fitur Baru: Cloud Database dengan Supabase!

- ✅ **Sinkronisasi Cloud**: Data tersimpan di cloud dan bisa diakses dari device mana saja
- ✅ **Authentication**: Login/register dengan email dan password
- ✅ **Real-time Sync**: Data otomatis tersinkronisasi antar device
- ✅ **Secure**: Row Level Security (RLS) untuk keamanan data
- ✅ **Demo Mode**: Tetap bisa digunakan tanpa login (data lokal di browser)
- ✅ **Migration Ready**: Export/import data dari localStorage ke cloud

## 📁 Struktur Folder

```
/workspace/
├── index.html                    # Entry point (redirect ke dashboard)
├── login.html                    # Halaman login (NEW)
├── register.html                 # Halaman register (NEW)
├── dashboard.html                # Halaman dashboard utama
├── chatbot.html                  # Halaman chatbot AI
├── transactions.html             # Halaman tabel transaksi
├── categories.html               # Halaman manajemen kategori
├── reports.html                  # Halaman laporan keuangan
├── settings.html                 # Halaman pengaturan
│
├── supabase_schema.sql           # Database schema untuk Supabase (NEW)
├── SUPABASE_SETUP.md             # Panduan setup Supabase (NEW)
│
├── css/
│   ├── tailwind.config.js        # Konfigurasi tema Tailwind
│   └── custom.css                # Custom styles tambahan
│
├── js/
│   ├── core/
│   │   ├── config.js             # Config & credentials (NEW)
│   │   ├── supabase.js           # Supabase integration (NEW)
│   │   ├── auth.js               # Authentication module (NEW)
│   │   ├── storage.js            # Unified storage (localStorage + Supabase)
│   │   ├── router.js             # Hash-based routing
│   │   └── utils.js              # Fungsi utility
│   │
│   ├── components/
│   │   ├── sidebar.js            # Komponen sidebar
│   │   ├── topbar.js             # Komponen topbar (updated with user menu)
│   │   └── charts.js             # Wrapper Chart.js
│   │
│   ├── pages/
│   │   ├── dashboard.js          # Logic halaman dashboard
│   │   ├── chatbot.js            # Logic halaman chatbot
│   │   ├── transactions.js       # Logic halaman transaksi
│   │   ├── categories.js         # Logic halaman kategori
│   │   ├── reports.js            # Logic halaman laporan
│   │   └── settings.js           # Logic halaman pengaturan
│   │
│   └── app.js                    # Main entry point (updated)
│
└── README.md                     # Dokumentasi ini
```

## 🚀 Fitur Utama

### Dashboard
- Ringkasan saldo, pemasukan, dan pengeluaran
- Grafik pie: pengeluaran per kategori
- Grafik bar: pemasukan vs pengeluaran 7 hari terakhir
- 5 transaksi terbaru

### Chatbot AI
- Tambah transaksi dengan perintah natural
- Hapus dan ubah transaksi via chat
- Laporan keuangan otomatis
- Deteksi kategori otomatis dari deskripsi

### Transaksi
- Tabel lengkap dengan filter & search
- Edit inline (edit/save/cancel/delete)
- Export ke Excel (.xlsx)
- Pagination (10 item/halaman)

### Kategori
- CRUD kategori lengkap
- Pilihan warna dan ikon custom
- Default: Makanan, Transport, Belanja, Hiburan, Gaji, Bonus, Lainnya

### Laporan
- Filter periode (hari/minggu/bulan/tahun/custom)
- Breakdown per kategori
- Top 5 pengeluaran
- Tren harian (line chart)

### Pengaturan
- Toggle dark mode
- Export/Import data (JSON backup)
- Reset semua data
- Statistik aplikasi

## 🛠️ Teknologi

- **Supabase** - Cloud database & authentication (NEW)
- **Tailwind CSS** - Styling framework (via CDN)
- **Chart.js** - Visualisasi grafik
- **SheetJS (XLSX)** - Export Excel
- **Font Awesome** - Icon library
- **Vanilla JavaScript** - No framework, no build step

## 🚀 Quick Start

### Opsi 1: Mode Demo (Tanpa Setup)

1. Download atau clone repository
2. Buka `dashboard.html` di browser
3. Klik **"Coba Mode Demo"** di halaman login
4. Data tersimpan di browser (localStorage)

### Opsi 2: Cloud Mode (Dengan Supabase)

1. **Setup Supabase** (5 menit):
   ```bash
   # Ikuti panduan lengkap di SUPABASE_SETUP.md
   ```
   - Buat akun di [supabase.com](https://supabase.com)
   - Buat project baru
   - Jalankan `supabase_schema.sql` di SQL Editor
   - Copy Project URL dan API Key

2. **Konfigurasi App**:
   - Edit `js/core/config.js`
   - Paste Project URL dan Anon Key

3. **Jalankan App**:
   - Buka `register.html` untuk daftar
   - Atau buka `login.html` untuk login
   - Data tersimpan di cloud ☁️

📖 **Panduan lengkap**: Lihat [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

## 📦 Deploy

### Vercel

1. Push kode ke repository GitHub
2. Login ke [Vercel](https://vercel.com)
3. Import repository
4. Deploy otomatis (static site)

### Netlify

1. Push kode ke repository GitHub
2. Login ke [Netlify](https://netlify.com)
3. "Add new site" → "Import an existing project"
4. Pilih repository dan deploy

### Manual (Local Server)

```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx serve .
```

Buka browser: `http://localhost:8000`

## 🔧 Customization

### Mengubah Warna Tema

Edit `css/tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#3b82f6', // Ubah warna utama di sini
  }
}
```

### Menambah Menu Sidebar

Edit `js/components/sidebar.js`:

```javascript
menuItems: [
  { id: 'baru', label: 'Menu Baru', icon: 'fa-star', page: 'baru' },
]
```

### Menambah Halaman Baru

1. Buat file HTML baru (misal: `baru.html`)
2. Buat file JS di `js/pages/baru.js`
3. Include scripts di HTML dengan urutan yang benar
4. Daftarkan route di `js/app.js`

## ⌨️ Perintah Chatbot

| Perintah | Contoh |
|----------|--------|
| Tambah pengeluaran | `tambah pengeluaran 50000 untuk makan siang` |
| Tambah pemasukan | `tambah pemasukan 5000000 untuk gaji` |
| Hapus transaksi | `hapus transaksi makan siang` |
| Ubah transaksi | `ubah makan siang jadi 75000` |
| Lihat laporan | `laporan` atau `saldo` |
| Lihat riwayat | `riwayat` atau `list transaksi` |
| Bantuan | `help` |

## 🔐 Penyimpanan Data

### Cloud Mode (Supabase) ☁️

Data tersimpan di cloud database PostgreSQL:
- ✅ **Multi-device sync**: Akses dari mana saja
- ✅ **Secure**: Row Level Security (RLS)
- ✅ **Scalable**: Unlimited data (free tier: 500MB)
- ✅ **Backup**: Auto backup oleh Supabase
- ✅ **Real-time**: Sinkronisasi otomatis

Tabel yang digunakan:
- `transactions` - Semua transaksi
- `categories` - Kategori transaksi
- `settings` - Pengaturan user
- `chat_history` - Riwayat chat

### Demo Mode (localStorage)

Data tersimpan di browser:
- `finance_transactions` - Semua transaksi
- `finance_categories` - Kategori transaksi
- `finance_settings` - Pengaturan aplikasi
- `finance_chat_history` - Riwayat chat

⚠️ **Penting**: Data hanya tersimpan di browser yang digunakan. Clear cache/browser = data hilang. Gunakan fitur Export/Import untuk backup.

## 🐛 Troubleshooting

### Supabase Connection Issues

**Error: "Failed to initialize Supabase"**
- Periksa `js/core/config.js` - pastikan URL dan key sudah benar
- Format URL harus: `https://xxxxx.supabase.co`
- Pastikan anon key lengkap (biasanya sangat panjang)

**Error: "User not authenticated"**
- Session expired - logout dan login kembali
- Clear browser cache dan cookies
- Periksa browser console untuk error details

**Data tidak tersinkronisasi**
- Periksa koneksi internet
- Cek Supabase Dashboard > Project Status
- Pastikan RLS policies aktif di semua tabel

### General Issues

**Halaman tidak menampilkan data**
- Pastikan semua file JS ter-load dengan urutan benar
- Cek console browser untuk error (F12)
- Clear localStorage dan refresh

**Chart tidak muncul**
- Pastikan Chart.js CDN ter-load
- Cek ukuran container chart (harus ada height)

**Dark mode tidak berfungsi**
- Clear localStorage atau settings di Supabase
- Refresh halaman dan coba lagi

**Export Excel tidak bekerja**
- Pastikan SheetJS CDN ter-load
- Cek popup blocker browser

### Migration dari localStorage ke Supabase

Jika sudah punya data di demo mode dan ingin migrate:

1. Export data dari demo mode
2. Login dengan akun Supabase
3. Import data melalui halaman Settings

📖 Detail lengkap: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

## 📝 License

MIT License - Bebas digunakan untuk keperluan pribadi maupun komersial.

## 👨‍💻 Kontribusi

Silakan fork, modifikasi, dan submit pull request untuk improvement.

---

**FinBot v1.0.0** - Asisten Keuangan Pribadi Anda

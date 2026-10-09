# FinBot - Asisten Keuangan Pribadi

Aplikasi manajemen keuangan pribadi berbasis web dengan struktur multi-file yang modular dan mudah di-maintain.

## 📁 Struktur Folder

```
/workspace/
├── index.html                    # Entry point (redirect ke dashboard)
├── dashboard.html                # Halaman dashboard utama
├── chatbot.html                  # Halaman chatbot AI
├── transactions.html             # Halaman tabel transaksi
├── categories.html               # Halaman manajemen kategori
├── reports.html                  # Halaman laporan keuangan
├── settings.html                 # Halaman pengaturan
│
├── css/
│   ├── tailwind.config.js        # Konfigurasi tema Tailwind
│   └── custom.css                # Custom styles tambahan
│
├── js/
│   ├── core/
│   │   ├── storage.js            # Wrapper localStorage
│   │   ├── router.js             # Hash-based routing
│   │   └── utils.js              # Fungsi utility
│   │
│   ├── components/
│   │   ├── sidebar.js            # Komponen sidebar
│   │   ├── topbar.js             # Komponen topbar
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
│   └── app.js                    # Main entry point
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

- **Tailwind CSS** - Styling framework (via CDN)
- **Chart.js** - Visualisasi grafik
- **SheetJS (XLSX)** - Export Excel
- **Font Awesome** - Icon library
- **Vanilla JavaScript** - No framework, no build step

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

Semua data disimpan di **localStorage** browser:
- `finance_transactions` - Semua transaksi
- `finance_categories` - Kategori transaksi
- `finance_settings` - Pengaturan aplikasi
- `finance_chat_history` - Riwayat chat

⚠️ **Penting**: Data hanya tersimpan di browser yang digunakan. Clear cache/browser = data hilang. Gunakan fitur Export/Import untuk backup.

## 🐛 Troubleshooting

### Halaman tidak menampilkan data
- Pastikan semua file JS ter-load dengan urutan benar
- Cek console browser untuk error
- Clear localStorage dan refresh

### Chart tidak muncul
- Pastikan Chart.js CDN ter-load
- Cek ukuran container chart (harus ada height)

### Dark mode tidak berfungsi
- Clear localStorage
- Pastikan `settings.darkMode` tersimpan dengan benar

### Export Excel tidak bekerja
- Pastikan SheetJS CDN ter-load
- Cek popup blocker browser

## 📝 License

MIT License - Bebas digunakan untuk keperluan pribadi maupun komersial.

## 👨‍💻 Kontribusi

Silakan fork, modifikasi, dan submit pull request untuk improvement.

---

**FinBot v1.0.0** - Asisten Keuangan Pribadi Anda

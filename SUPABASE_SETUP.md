# Setup Guide: Integrasi Supabase untuk FinBot AI

Panduan lengkap untuk mengintegrasikan Supabase sebagai cloud database untuk aplikasi FinBot AI.

---

## 📋 Langkah-langkah Setup

### 1. Buat Akun Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** dan daftar dengan GitHub/Google/Email
3. Setelah login, klik **"New project"**

### 2. Buat Project Baru

1. Pilih **Organization** (atau buat baru jika belum ada)
2. Isi detail project:
   - **Name**: `finbot-ai` (atau nama pilihan Anda)
   - **Database Password**: Buat password yang kuat (simpan di tempat aman!)
   - **Region**: Pilih region terdekat (contoh: Southeast Asia (Singapore))
   - **Pricing Plan**: Pilih **Free** untuk development
3. Klik **"Create new project"**
4. Tunggu beberapa menit hingga project selesai dibuat

### 3. Setup Database Schema

1. Setelah project dibuat, buka **SQL Editor** dari sidebar kiri
2. Klik **"New query"**
3. Copy semua isi dari file `supabase_schema.sql` di root project
4. Paste ke SQL Editor
5. Klik **"Run"** atau tekan `Ctrl+Enter`
6. Pastikan semua queries berhasil dijalankan (✅ hijau)

### 4. Verifikasi Tabel

1. Buka **Table Editor** dari sidebar kiri
2. Pastikan tabel-tabel berikut sudah dibuat:
   - ✅ `transactions`
   - ✅ `categories`
   - ✅ `settings`
   - ✅ `chat_history`

### 5. Enable Authentication

1. Buka **Authentication** > **Providers** dari sidebar
2. Pastikan **Email** provider sudah enabled (default: ON)
3. (Opsional) Konfigurasi email templates di **Authentication** > **Email Templates**
4. (Opsional) Matikan **"Confirm email"** untuk testing:
   - Buka **Authentication** > **Settings**
   - Scroll ke **"Email Auth"**
   - Toggle OFF **"Enable email confirmations"** (untuk development)

### 6. Dapatkan API Credentials

1. Buka **Settings** > **API** dari sidebar kiri
2. Di section **Project API keys**, salin:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (key yang panjang)

### 7. Konfigurasi Aplikasi

1. Buka file `js/core/config.js` di project FinBot
2. Replace placeholder dengan credentials Anda:

```javascript
const Config = {
  supabase: {
    url: 'https://xxxxx.supabase.co', // ⬅️ Paste Project URL Anda
    anonKey: 'eyJhbGc...', // ⬅️ Paste anon key Anda
  },
  // ... rest of config
};
```

3. **PENTING**: Jangan commit credentials ke GitHub!
   - Tambahkan `js/core/config.js` ke `.gitignore`
   - Atau gunakan environment variables (untuk production)

---

## 🧪 Testing Setup

### Test 1: Registrasi User Baru

1. Buka aplikasi di browser: `register.html`
2. Daftar dengan email dan password (contoh: `test@example.com` / `password123`)
3. Jika berhasil, Anda akan diredirect ke `login.html` setelah 3 detik
4. Cek **Authentication** > **Users** di Supabase Dashboard
   - User baru Anda harus muncul di list

### Test 2: Login

1. Buka `login.html`
2. Login dengan email dan password yang tadi didaftarkan
3. Jika berhasil, Anda akan masuk ke `dashboard.html`
4. Periksa browser console (F12) - tidak boleh ada error

### Test 3: Tambah Transaksi

1. Di dashboard, klik tombol **"+ Transaksi Baru"**
2. Isi form dan submit
3. Transaksi harus muncul di dashboard
4. Cek di Supabase Dashboard:
   - Buka **Table Editor** > **transactions**
   - Transaksi Anda harus ada di tabel

### Test 4: Kategori Default

1. Setelah login pertama kali, kategori default harus otomatis dibuat
2. Buka halaman **Kategori** di aplikasi
3. Anda harus melihat 10 kategori default (Makanan, Transport, dll)
4. Cek di Supabase: **Table Editor** > **categories**

---

## 🔒 Row Level Security (RLS)

Supabase sudah dikonfigurasi dengan RLS policies yang aman:

- ✅ User hanya bisa melihat data mereka sendiri
- ✅ User tidak bisa mengakses data user lain
- ✅ Setiap operasi (SELECT, INSERT, UPDATE, DELETE) terproteksi
- ✅ Queries otomatis difilter berdasarkan `user_id`

**Jangan disable RLS** kecuali untuk testing!

---

## 🎯 Mode Demo (Tanpa Login)

Aplikasi tetap bisa digunakan tanpa login menggunakan **localStorage**:

1. Di halaman login, klik **"Coba Mode Demo"**
2. Data akan disimpan di browser (tidak tersinkron ke cloud)
3. Cocok untuk testing atau preview aplikasi

---

## 🔄 Migrasi Data

### Export Data dari localStorage ke Supabase

Jika Anda sudah punya data di localStorage dan ingin migrate ke Supabase:

1. Buka browser console (F12)
2. Jalankan script ini:

```javascript
// Export data dari localStorage
const data = await Storage.exportAllData();
console.log('Data exported:', data);

// Download sebagai file JSON
const dataStr = JSON.stringify(data, null, 2);
const blob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'finbot-backup.json';
a.click();
```

3. Login dengan akun Supabase
4. Import data:

```javascript
// Upload file JSON dan import
const data = /* paste JSON data here */;
await Storage.importAllData(data);
console.log('Data imported successfully!');
```

---

## 🚀 Deploy ke Production

### Rekomendasi Hosting

- **Vercel** (Recommended): Deploy otomatis dari GitHub
- **Netlify**: Mudah dan gratis
- **GitHub Pages**: Untuk static hosting

### Environment Variables

Untuk production, gunakan environment variables:

1. Di Vercel/Netlify, tambahkan environment variables:
   - `SUPABASE_URL`: Project URL Anda
   - `SUPABASE_ANON_KEY`: Anon key Anda

2. Update `config.js` untuk membaca dari env:

```javascript
const Config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://xxxxx.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGc...',
  },
};
```

---

## 🐛 Troubleshooting

### Error: "Failed to initialize Supabase"

**Penyebab**: Credentials salah atau tidak diisi

**Solusi**:
1. Cek `js/core/config.js` - pastikan URL dan key sudah benar
2. Pastikan URL format: `https://xxxxx.supabase.co` (ada https://)
3. Pastikan anon key lengkap (biasanya sangat panjang)

### Error: "User not authenticated"

**Penyebab**: Session expired atau belum login

**Solusi**:
1. Logout dan login kembali
2. Clear browser cache dan cookies
3. Cek browser console untuk error details

### Error: "Failed to fetch"

**Penyebab**: Network issue atau CORS

**Solusi**:
1. Cek koneksi internet
2. Buka Supabase Dashboard > Settings > API
3. Pastikan **"Disable SSL"** dalam keadaan OFF

### Transaksi tidak muncul setelah ditambahkan

**Penyebab**: RLS policy atau data tidak tersimpan

**Solusi**:
1. Buka browser console - cek error
2. Pastikan `user_id` cocok dengan auth user
3. Cek Supabase Dashboard > Table Editor - apakah data ada?

### Kategori default tidak dibuat otomatis

**Penyebab**: Function `initializeDefaultCategories` gagal

**Solusi**:
1. Login dan reload halaman
2. Buka console, jalankan manual:
   ```javascript
   await SupabaseDB.initializeDefaultCategories();
   ```

---

## 📊 Monitoring & Analytics

### Supabase Dashboard

Monitor penggunaan di **Home** > **Project Usage**:
- Database size
- Bandwidth usage
- Auth users count
- API requests

### Database Performance

1. Buka **Database** > **Logs**
2. Monitor slow queries
3. Check error logs

---

## 🔐 Security Best Practices

1. ✅ **Jangan commit credentials ke Git**
   - Add `config.js` to `.gitignore`
   - Use environment variables

2. ✅ **Enable RLS** pada semua tabel
   - Sudah dikonfigurasi di `supabase_schema.sql`

3. ✅ **Use strong passwords** untuk database

4. ✅ **Enable email confirmation** untuk production

5. ✅ **Rate limiting**: Enable di Supabase settings

6. ✅ **Backup database** secara berkala

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 💡 Tips

1. **Development**: Gunakan mode demo untuk testing cepat
2. **Testing**: Buat separate Supabase project untuk staging
3. **Backup**: Export data berkala menggunakan fungsi export
4. **Performance**: Index sudah dioptimalkan di schema
5. **Cost**: Free tier cukup untuk 50,000+ rows

---

## ✅ Checklist Setup

- [ ] Buat akun Supabase
- [ ] Buat project baru
- [ ] Jalankan SQL schema
- [ ] Verifikasi tabel dibuat
- [ ] Enable email authentication
- [ ] Copy API credentials
- [ ] Update `config.js` dengan credentials
- [ ] Test registrasi user
- [ ] Test login
- [ ] Test tambah transaksi
- [ ] Test kategori default
- [ ] Verifikasi RLS policies

---

**Selamat! Aplikasi FinBot AI Anda sekarang menggunakan cloud database! 🎉**

Jika ada pertanyaan atau masalah, cek Troubleshooting section atau buka issue di GitHub.

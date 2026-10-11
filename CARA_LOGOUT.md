# 🚪 Cara Logout dari FinBot AI

Ada **3 cara mudah** untuk logout dari aplikasi:

---

## **Cara 1: Tombol Logout di Sidebar (RECOMMENDED)** ⭐

Tombol logout permanen ada di **bagian bawah sidebar**:

1. Lihat ke **bagian bawah sidebar** (menu navigasi kiri)
2. Anda akan melihat:
   - Avatar user dengan nama Anda
   - **Tombol "Logout"** berwarna merah
3. Klik tombol **"Logout"**
4. Konfirmasi logout
5. Anda akan diredirect ke halaman login

```
┌─────────────────────┐
│  FinBot             │
│                     │
│  Dashboard          │
│  Chatbot            │
│  Transaksi          │
│  Kategori           │
│  Laporan            │
│  Pengaturan         │
│                     │
│  ·····················
│  👤 Nama User       │
│  📧 email@user.com  │
│  ┌─────────────────┐│
│  │ 🚪 Logout       ││  ← KLIK DI SINI
│  └─────────────────┘│
└─────────────────────┘
```

---

## **Cara 2: Melalui User Menu (Topbar)**

User menu dropdown di **kanan atas**:

1. Klik **avatar/nama Anda** di pojok kanan atas (sebelah dark mode toggle)
2. Dropdown menu akan muncul menampilkan:
   - Email Anda
   - Tombol **"Logout"** berwarna merah
3. Klik **"Logout"**
4. Konfirmasi logout
5. Redirect ke login page

```
                    ┌──────────────────┐
                    │ Signed in as     │
                    │ email@user.com   │
                    ├──────────────────┤
[🌙] [👤 User ▼] ← │ 🚪 Logout        │ ← KLIK DI SINI
                    └──────────────────┘
```

---

## **Cara 3: Manual (Browser URL)**

Langsung akses halaman login:

1. Ketik di address bar: `login.html`
2. Atau langsung URL lengkap: `http://localhost:8000/login.html`
3. Session akan otomatis di-clear

---

## 📌 Catatan Penting

### **Setelah Logout:**
- ✅ Session JWT token akan dihapus
- ✅ Anda diredirect ke halaman login
- ✅ Data tetap tersimpan di cloud (jika menggunakan Supabase)
- ✅ Data tetap tersimpan di browser (jika mode demo)

### **Login Kembali:**
- Buka `login.html`
- Masukkan email dan password
- Atau klik "Coba Mode Demo" untuk mode offline

### **Demo Mode:**
- Jika menggunakan demo mode (tanpa login), logout akan:
  - Clear flag demo_mode dari localStorage
  - Redirect ke login page
  - Data demo tetap tersimpan di browser

---

## 🔍 Troubleshooting

### **Tombol logout tidak terlihat?**
1. Scroll sidebar ke bawah
2. Tombol logout ada di **paling bawah** sidebar
3. Pastikan sidebar tidak di-collapse (tombol hamburger)

### **Dropdown user menu tidak muncul?**
1. Klik avatar/nama user di topbar kanan atas
2. Pastikan JavaScript tidak ada error (F12 → Console)
3. Refresh halaman

### **Logout tidak berfungsi?**
1. Cek browser console (F12) untuk error
2. Clear browser cache
3. Refresh dan coba lagi

### **Stuck setelah logout?**
1. Manually navigate ke `login.html`
2. Clear browser cookies
3. Hard refresh (Ctrl+F5)

---

## 🎯 Visual Guide

### **Desktop:**
```
┌────────────────────────────────────────────┐
│  FinBot    Dashboard            🌙 👤 User ▼│ ← Klik di sini (Cara 2)
├──────┬─────────────────────────────────────┤
│      │                                     │
│ 🏠   │    Dashboard Content                │
│ 🤖   │                                     │
│ 📊   │                                     │
│ 🏷️   │                                     │
│ 📈   │                                     │
│ ⚙️   │                                     │
│      │                                     │
│ ···  │                                     │
│ 👤   │                                     │
│ User │                                     │
│ 🚪   │                                     │ ← Atau klik di sini (Cara 1)
└──────┴─────────────────────────────────────┘
```

### **Mobile:**
```
┌─────────────────────────┐
│ ☰  Dashboard      🌙 👤 │ ← Klik avatar (Cara 2)
├─────────────────────────┤
│                         │
│   Dashboard Content     │
│                         │
│                         │
└─────────────────────────┘

Atau buka sidebar (☰):
┌─────────────────┐
│  FinBot         │
│                 │
│  🏠 Dashboard   │
│  🤖 Chatbot     │
│  📊 Transaksi   │
│  🏷️ Kategori    │
│  📈 Laporan     │
│  ⚙️ Pengaturan  │
│                 │
│  ············   │
│  👤 User        │
│  🚪 Logout      │ ← Klik di sini (Cara 1)
└─────────────────┘
```

---

## 🔐 Keamanan

- Session token akan **otomatis expired** setelah beberapa waktu
- Untuk keamanan, **selalu logout** setelah selesai menggunakan aplikasi
- Terutama jika menggunakan komputer/device publik

---

**Cara tercepat: Klik tombol Logout merah di bagian bawah sidebar!** 🚪

*Updated: 2026-10-11*

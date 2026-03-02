# LaundryKu — Product Requirements Document (PRD)
## MVP 1 | Smart Laundry Dashboard
**Version:** 1.0
**Last Updated:** 24 Februari 2026
**Status:** Ready for Development

---

## 1. OVERVIEW

### 1.1 Product Summary
LaundryKu adalah web-based dashboard management untuk pelaku usaha laundry di Indonesia. Fokus utama MVP 1 adalah pencatatan operasional harian dan **insight keuangan cerdas** (profit per layanan, smart inventory, health score) sebagai USP yang membedakan dari kompetitor.

### 1.2 Tagline
"Kelola Cerdas, Untung Lebih"

### 1.3 Target User
- Pemilik usaha laundry skala kecil-menengah (1-5 outlet)
- Usia 25-50 tahun
- Familiar dengan smartphone/laptop, tapi bukan orang teknis
- Berlokasi di Indonesia

### 1.4 Business Model
Subscription-based dengan 2 tier (Regular & Pro) dan 4 durasi (1, 3, 6, 12 bulan).

### 1.5 Tech Stack

#### Frontend Dashboard (`frontend/`)
- **Bundler:** Vite 6 (SPA — tidak butuh SSR/SEO)
- **Framework:** React 19
- **Routing:** React Router v7 — library mode (`createBrowserRouter`)
- **Styling:** Tailwind CSS v4 (config via `@theme` di `globals.css`)
- **State:** Zustand (auth + outlet store)
- **Data Fetching:** TanStack React Query v5 + Axios
- **Forms:** React Hook Form + Zod v4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Font:** Manrope (heading) + Nunito Sans (body) via Google Fonts

#### Backend
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL
- **ORM:** TypeORM / Prisma *(TBD)*
- **Auth:** JWT (access + refresh token), bcrypt
- **Payment Gateway:** Midtrans / Xendit
- **Hosting:** VPS (DigitalOcean / IDCloudHost)

> **Catatan:** Landing page (marketing) akan dibuat terpisah menggunakan Next.js di masa depan.

---

## 2. USER ROLES & AUTHENTICATION

### 2.1 Roles

| Role | Auth Method | Deskripsi |
|------|-------------|-----------|
| **Owner** | Email + Password | Pemilik usaha. Akses penuh ke semua outlet & fitur sesuai plan. |
| **Staff** | Username + PIN (6 digit) | Karyawan outlet. Akses terbatas pada operasional harian outlet yang ditugaskan. |

### 2.2 Auth Flow

#### Owner Registration
1. Input: nama, email, phone, password
2. Email verification
3. Onboarding: buat outlet pertama (nama outlet, alamat, phone outlet)
4. Pilih plan (Regular/Pro) → pilih durasi → payment
5. Redirect ke dashboard outlet

#### Owner Login
1. Input: email + password
2. Sistem cek jumlah outlet:
   - **1 outlet** → langsung ke Dashboard Outlet
   - **>1 outlet** → ke Overview Dashboard (multi-outlet)
3. Owner bisa switch antar outlet kapanpun

#### Staff Login
1. Toggle "Login sebagai Staff" di halaman `/login` yang sama dengan Owner
   - Tab/toggle Owner: form email + password
   - Tab/toggle Staff: form username + PIN 6 digit (OTP-style, 6 kotak terpisah)
2. Input: username + PIN 6 digit
3. Langsung masuk ke Dashboard Outlet yang ditugaskan
4. Tidak bisa switch outlet

### 2.3 Session & Security
- JWT token dengan refresh token
- Owner: multi-device allowed, session tracking
- Staff: single device per akun (opsional untuk MVP)
- Password: bcrypt hashing
- PIN: hashed juga
- Rate limiting pada login endpoint

---

## 3. SUBSCRIPTION & BILLING

### 3.1 Plan Comparison

| Fitur | Regular | Pro |
|-------|---------|-----|
| Input order & tracking status | ✅ | ✅ |
| Database pelanggan | ✅ | ✅ |
| Catat pengeluaran (kategori dasar) | ✅ | ✅ |
| Laporan pemasukan & pengeluaran | ✅ | ✅ |
| Data karyawan & absensi | ✅ | ✅ |
| Kelola jenis layanan & harga | ✅ | ✅ |
| Profil outlet & pengaturan | ✅ | ✅ |
| **Profit per Layanan** | ❌ | ✅ |
| **Smart Expense Tracker (detail)** | ❌ | ✅ |
| **Smart Inventory + Prediksi Restock** | ❌ | ✅ |
| **Dashboard Kesehatan Bisnis** | ❌ | ✅ |
| **Laporan Advanced (export PDF/Excel)** | ❌ | ✅ |
| **Peringatan Anomali Pengeluaran** | ❌ | ✅ |

### 3.2 Pricing

| Durasi | Regular | Pro | Diskon Pro |
|--------|---------|-----|------------|
| 1 Bulan | Rp 49.000 | Rp 99.000 | — |
| 3 Bulan | Rp 129.000 | Rp 269.000 | ~9% |
| 6 Bulan | Rp 239.000 | Rp 499.000 | ~16% |
| 1 Tahun | Rp 449.000 | Rp 899.000 | ~24% |

### 3.3 Subscription Rules
- 1 subscription = 1 outlet
- Setiap outlet bisa punya plan & durasi berbeda
- Outlet ke-3 dan seterusnya mendapat diskon 15%
- Subscription menempel ke outlet, bukan ke user
- Grace period: 3 hari setelah expired sebelum fitur dinonaktifkan
- Downgrade dari Pro ke Regular: fitur Pro di-lock, data tetap tersimpan
- Upgrade dari Regular ke Pro: langsung aktif, prorata sisa waktu
  - Formula: `harga_harian_regular = price_paid / total_hari_durasi`
  - `kredit = harga_harian_regular × sisa_hari`
  - `yang_dibayar = harga_Pro_durasi_baru - kredit`
  - Owner bebas pilih durasi Pro yang berbeda dari durasi Regular sebelumnya

### 3.4 Payment Flow
1. Owner pilih outlet → pilih plan → pilih durasi
2. Hitung harga (termasuk diskon multi-outlet jika applicable)
3. Redirect ke payment gateway (Midtrans/Xendit)
4. Callback: update status subscription
5. Kirim email konfirmasi

---

## 4. MENU STRUCTURE & PAGES

### 4.1 Sidebar Navigation (Outlet Dashboard)

```
┌─────────────────────────────┐
│ 🔵 LaundryKu               │
│ [Nama Outlet] ▾             │
│                             │
│ 📊 Dashboard                │
│ 📝 Order                    │
│ 👥 Pelanggan                │
│ 💰 Keuangan                 │
│    ├── Pemasukan             │
│    ├── Pengeluaran           │
│    └── 🔒 Profit Layanan    │ ← Pro only
│ 📦 Inventory          🔒    │ ← Pro only (smart features)
│ 👔 Karyawan                 │
│ ⚙️ Pengaturan               │
│    ├── Outlet                │
│    ├── Layanan & Harga       │
│    ├── Staff                 │
│    └── Subscription          │
│                             │
│ ─────────────────────────── │
│ 👤 Profil Owner             │
│ 🚪 Logout                   │
└─────────────────────────────┘
```

### 4.2 Overview Dashboard (Multi-Outlet, untuk Owner >1 outlet)

```
┌─────────────────────────────┐
│ 🔵 LaundryKu               │
│ Overview                    │
│                             │
│ 🏠 Overview Dashboard       │
│ 🏪 Outlet Saya              │
│    ├── Outlet A (Pro)        │
│    ├── Outlet B (Regular)    │
│    └── + Tambah Outlet       │
│ 👤 Profil                   │
│ 🚪 Logout                   │
└─────────────────────────────┘
```

---

## 5. DETAILED PAGE SPECIFICATIONS

### 5.1 Dashboard (Home)

**URL:** `/dashboard`
**Access:** Owner + Staff

**Content:**
- **Header:** Nama outlet, tanggal hari ini, greeting
- **Stat Cards (4 kartu):**
  - Pendapatan hari ini (vs kemarin, % perubahan)
  - Order aktif (berapa yang mendekati deadline)
  - Pengeluaran hari ini
  - [PRO] Health Score / [REGULAR] Total pelanggan bulan ini
- **Order Terbaru:** 5 order terakhir dengan status
- **Grafik:** Pendapatan 7 hari terakhir (line chart)
- **[PRO] Quick Insight:** 1-2 insight singkat (misal: "Layanan Express margin-nya turun 5% minggu ini")
- **[PRO] Alert:** Stok menipis, anomali pengeluaran

---

### 5.2 Order Management

**URL:** `/orders`
**Access:** Owner + Staff

#### 5.2.1 Halaman List Order
- **Filter:** Status (Semua / Masuk / Proses / Siap Diambil / Selesai / Dibatalkan), Tanggal, Layanan
- **Search:** Cari by nama pelanggan, nomor order
- **Tabel kolom:** Order ID, Pelanggan, Layanan, Qty, Total, Status, Pembayaran, Tanggal Masuk, Estimasi Selesai, Aksi
- **Format Order Number:** `ORD-XXXX` — counter naik selamanya per outlet, tidak pernah reset. Unik per outlet (outlet berbeda bisa punya nomor yang sama).
- **Aksi per row:** Lihat detail, Update status, Edit, Hapus
- **Tombol:** + Buat Order Baru
- **Pagination:** 20 item per page

#### 5.2.2 Buat Order Baru
- **Form fields:**
  - Pelanggan: autocomplete dari database / input baru (nama, phone)
  - Jenis layanan: dropdown dari daftar layanan outlet
  - Qty: angka (kg / pcs sesuai unit layanan)
  - Harga: auto-calculate dari layanan × qty (bisa override manual)
  - Catatan: text area (opsional, misal: "ada noda di kerah")
  - Estimasi selesai: date picker (auto-suggest berdasarkan layanan)
  - Status pembayaran: Belum Bayar / DP / Lunas
  - Jumlah bayar: jika DP, input nominal
  - Metode pembayaran: Tunai / Transfer / QRIS
- **Multi-item order:** Bisa tambah lebih dari 1 layanan dalam 1 order
- **Summary:** Total harga, sisa bayar
- **Action:** Simpan & Buat Nota / Simpan Draft

#### 5.2.3 Detail Order
- Semua info order
- Timeline status (Masuk → Proses → Siap → Selesai)
- Tombol update status (next step)
- Riwayat pembayaran
- Tombol: Edit, Cetak Nota (buka tab baru, printable), Tandai Lunas

#### 5.2.4 Status Flow
```
Masuk → Proses → Siap Diambil → Selesai
  └→ Dibatalkan (bisa dari status manapun kecuali Selesai)
```

---

### 5.3 Pelanggan

**URL:** `/customers`
**Access:** Owner + Staff (staff: lihat & tambah saja)

#### 5.3.1 List Pelanggan
- **Tabel kolom:** Nama, Phone, Total Order, Total Spending, Terakhir Order, Aksi
- **Search:** Nama atau phone
- **Sort:** Nama, total order, total spending, terakhir order
- **Aksi:** Lihat detail, Edit, Hapus

#### 5.3.2 Detail Pelanggan
- Info pelanggan (nama, phone, alamat, catatan)
- Statistik: total order, total spending, rata-rata per order
- Riwayat order (list order pelanggan ini)

#### 5.3.3 Tambah/Edit Pelanggan
- **Fields:** Nama (required), Phone (required, unique per outlet), Alamat (opsional), Catatan (opsional)

---

### 5.4 Keuangan

#### 5.4.1 Pemasukan
**URL:** `/finance/income`
**Access:** Owner only

- **Ringkasan atas:** Total pemasukan bulan ini, vs bulan lalu (% perubahan)
- **Grafik:** Pemasukan harian (bar chart) dalam 1 bulan
- **Tabel:** List transaksi masuk — **hanya order yang LUNAS** (`payment_status = 'paid'`). DP / partial payment tidak masuk laporan income sampai order dilunasi penuh.
  - Kolom: Tanggal, Order ID, Pelanggan, Layanan, Jumlah, Metode Bayar
- **Filter:** Rentang tanggal, metode pembayaran, layanan
- **Export:** [PRO] Export ke PDF / Excel

#### 5.4.2 Pengeluaran
**URL:** `/finance/expenses`
**Access:** Owner (full) + Staff (form catat saja — lihat keterangan di bawah)

**Akses Staff di halaman ini:**
- ✅ Bisa membuka form catat pengeluaran
- ✅ Bisa input kategori dasar (Bahan Baku, Operasional, Gaji, Lain-lain)
- ❌ TIDAK bisa input sub-kategori (Pro only, Owner only)
- ❌ TIDAK bisa lihat daftar semua pengeluaran, grafik, atau summary keuangan

**Regular:**
- Catat pengeluaran manual
- Kategori dasar: Bahan Baku, Operasional (listrik/air/sewa), Gaji, Lain-lain
- List pengeluaran dengan filter tanggal & kategori (Owner only)
- Total pengeluaran per periode (Owner only)

**Pro (Smart Expense Tracker):**
- Semua fitur Regular +
- **Sub-kategori detail:**
  - Bahan Baku: deterjen, pewangi, plastik, hanger, dll
  - Operasional: listrik, air, sewa, internet, maintenance mesin
  - Gaji: per karyawan
  - Marketing: promo, diskon
  - Lain-lain: custom
- **Biaya per kg cucian:** total pengeluaran ÷ total kg cucian (auto-calculate)
- **Perbandingan antar periode:** chart perbandingan bulan ini vs bulan lalu
- **Anomali alert:** Notifikasi jika kategori tertentu naik >20% dari rata-rata 3 bulan terakhir
- **Trend chart:** pengeluaran per kategori dalam 6 bulan

**Form Catat Pengeluaran:**
- Fields: Tanggal, Kategori, Sub-kategori [PRO], Jumlah (Rp), Catatan
- Bisa catat recurring expense (misal: gaji bulanan)

#### 5.4.3 Profit per Layanan [PRO ONLY]
**URL:** `/finance/profit`
**Access:** Owner only (Pro plan)

- **Tabel utama:**
  - Kolom: Nama Layanan, Total Order, Total Revenue, Estimated Cost, Profit, Margin (%)
  - Sort by margin tertinggi/terendah
- **Cost allocation logic:**
  - Owner set persentase alokasi biaya per layanan (one-time setup)
  - Atau sistem auto-estimate berdasarkan proporsi revenue
- **Visualisasi:**
  - Bar chart: revenue vs cost per layanan
  - Ranking: layanan paling profitable → paling tidak profitable
  - Highlight merah: layanan dengan margin <20%
- **Insight box:** "Layanan [Express] memiliki margin tertinggi (72%). Pertimbangkan untuk mempromosikannya."
- **Filter:** Periode (mingguan / bulanan / custom)

---

### 5.5 Inventory [PRO: Smart Features]

**URL:** `/inventory`
**Access:** Owner + Staff (staff: lihat stok & catat pemakaian saja)

**Regular:**
- Inventory menu tidak muncul di sidebar
- (Data inventory bisa diinput oleh Pro, Regular tidak punya akses)

**Pro:**

#### 5.5.1 Daftar Stok
- **Tabel:** Nama Item, Kategori, Stok Saat Ini, Unit, Minimum Stok, Status, Aksi
- **Status badge:**
  - 🟢 Aman: stok > 2x minimum
  - 🟡 Perhatian: stok antara 1x-2x minimum
  - 🔴 Kritis: stok ≤ minimum
- **Aksi:** Edit, Restock (catat barang masuk), Lihat riwayat

#### 5.5.2 Catat Stok Masuk (Restock)
- Fields: Item, Qty masuk, Harga beli, Tanggal, Supplier (opsional), Catatan

#### 5.5.3 Catat Pemakaian
- Bisa manual: pilih item, qty keluar, tanggal
- Bisa auto-linked ke order (opsional, advanced): set rumus pemakaian per layanan

#### 5.5.4 Prediksi Restock
- Berdasarkan rata-rata pemakaian harian (dari data 30 hari terakhir)
- Tampilkan: "Deterjen cair estimasi habis dalam X hari"
- Alert otomatis saat stok mencapai minimum

#### 5.5.5 Riwayat Inventory
- Log semua pergerakan stok (masuk/keluar) per item
- Filter: item, tanggal, tipe (masuk/keluar)

---

### 5.6 Karyawan

**URL:** `/employees`
**Access:** Owner only

#### 5.6.1 List Karyawan/Staff
- Tabel: Nama, Username, Role (Kasir/Operator), Phone, Status (Aktif/Nonaktif), Terakhir Login, Aksi
- Aksi: Edit, Reset PIN, Nonaktifkan, Hapus

#### 5.6.2 Tambah Staff
- Fields: Nama, Phone, Username (unique per outlet), PIN 6 digit, Role

#### 5.6.3 Absensi Sederhana
- Staff bisa clock-in/clock-out dari dashboard-nya
- Owner lihat: tabel absensi per karyawan per hari
- Summary: total hari kerja per bulan

---

### 5.7 Pengaturan

#### 5.7.1 Profil Outlet
**URL:** `/settings/outlet`
- Fields: Nama outlet, Alamat, No. telepon, Logo (upload gambar)

#### 5.7.2 Layanan & Harga
**URL:** `/settings/services`
- CRUD jenis layanan
- Fields per layanan: Nama, Harga, Unit (kg/pcs/meter), Estimasi durasi (jam), Status (aktif/nonaktif)
- Bisa reorder urutan tampilan

#### 5.7.3 Kelola Staff
**URL:** `/settings/staff`
- Sama dengan halaman Karyawan (shortcut)

#### 5.7.4 Subscription
**URL:** `/settings/subscription`
- Info plan saat ini (Regular/Pro), tanggal mulai, tanggal berakhir
- Tombol: Upgrade ke Pro / Perpanjang / Ganti Durasi
- Riwayat pembayaran

---

### 5.8 Overview Dashboard (Multi-Outlet)

**URL:** `/overview`
**Access:** Owner with >1 outlet

- **Stat Cards:**
  - Total pendapatan semua outlet (hari ini & bulan ini)
  - Total order aktif semua outlet
  - Total pengeluaran bulan ini
  - Outlet paling perform (by revenue)
- **Tabel Outlet:**
  - Kolom: Nama Outlet, Plan, Pendapatan Bulan Ini, Order Bulan Ini, Status Subscription
  - Klik row → masuk ke dashboard outlet tersebut
- **Tombol:** + Tambah Outlet Baru

---

### 5.9 Dashboard Kesehatan Bisnis [PRO ONLY]

**URL:** `/dashboard` (widget di halaman dashboard utama)
**Access:** Pro plan only. Regular plan TIDAK memiliki Health Score.
- Regular: stat card ke-4 di dashboard = **"Total Pelanggan Bulan Ini"**
- Pro: stat card ke-4 di dashboard = **Health Score gauge (0-100)**

**Health Score (0-100):**
Kalkulasi berdasarkan weighted average dari 5 komponen (semua aktif di Pro karena Pro memiliki inventory):
- Rasio profit margin (bobot 30%): margin >50% = skor tinggi
- Tren pendapatan (bobot 25%): naik = skor tinggi
- Rasio pengeluaran (bobot 20%): pengeluaran <60% dari pendapatan = skor tinggi
- Inventory health (bobot 15%): tidak ada stok kritis = skor tinggi
- Order completion rate (bobot 10%): >95% selesai tepat waktu = skor tinggi

**Tampilan:**
- Gauge chart / circular progress dengan skor
- Warna: 0-40 Merah, 41-70 Kuning, 71-100 Hijau
- Breakdown per komponen
- 2-3 saran aksi berdasarkan skor terendah

---

## 6. PERMISSION MATRIX

| Fitur | Owner | Staff |
|-------|-------|-------|
| Lihat Dashboard | ✅ | ✅ (tanpa revenue details) |
| Buat/Edit/Hapus Order | ✅ | ✅ |
| Update Status Order | ✅ | ✅ |
| Lihat/Tambah Pelanggan | ✅ | ✅ |
| Edit/Hapus Pelanggan | ✅ | ❌ |
| Catat Pengeluaran | ✅ | ✅ (form input saja, 4 kategori dasar, tanpa sub-kategori) |
| Lihat Laporan Keuangan (income, summary, grafik) | ✅ | ❌ |
| Lihat Daftar Pengeluaran | ✅ | ❌ |
| Lihat Profit per Layanan | ✅ (Pro) | ❌ |
| Lihat/Kelola Inventory | ✅ (Pro) | ⚠️ (lihat stok & catat pemakaian) |
| Kelola Karyawan/Staff | ✅ | ❌ |
| Kelola Layanan & Harga | ✅ | ❌ |
| Setting Outlet | ✅ | ❌ |
| Manage Subscription | ✅ | ❌ |
| Overview Multi-Outlet | ✅ | ❌ |
| Clock-in / Clock-out | ❌ | ✅ |

---

## 7. NOTA / INVOICE

### 7.1 Nota Order (Printable)
- **Layout:** A5 / thermal printer (58mm / 80mm)
- **Content:**
  - Logo + Nama Outlet
  - Alamat & telepon outlet
  - Order ID + tanggal
  - Nama pelanggan
  - List item: layanan, qty, harga satuan, subtotal
  - Total harga
  - Status pembayaran + jumlah dibayar + sisa
  - Estimasi selesai
  - Catatan (jika ada)
- **Action:** Print (browser print dialog), Download PDF [PRO]

---

## 8. NOTIFICATION SYSTEM (In-App)

MVP 1 menggunakan in-app notification saja (bell icon di header). Tidak ada WhatsApp/email notification di MVP 1.

### 8.1 Trigger Notifikasi

| Event | Penerima | Pesan |
|-------|----------|-------|
| Order baru dibuat | Owner | "Order baru #ORD-XXXX dari [Pelanggan]" |
| Order mendekati deadline (H-1) | Owner + Staff | "Order #ORD-XXXX deadline besok" |
| Order overdue | Owner + Staff | "Order #ORD-XXXX sudah melewati estimasi" |
| [PRO] Stok mencapai minimum | Owner | "[Item] sudah mencapai stok minimum" |
| [PRO] Anomali pengeluaran | Owner | "Pengeluaran [Kategori] naik X% dari rata-rata" |
| Subscription hampir habis (H-7) | Owner | "Subscription outlet [Nama] berakhir dalam 7 hari" |
| Subscription expired | Owner | "Subscription outlet [Nama] telah berakhir" |

---

## 9. NON-FUNCTIONAL REQUIREMENTS

### 9.1 Performance
- Page load: <2 detik
- API response: <500ms untuk operasi CRUD biasa
- Dashboard dengan chart: <3 detik
- Support concurrent users: minimal 100 per server

### 9.2 Security
- HTTPS everywhere
- JWT + refresh token
- Password hashing (bcrypt, min 10 rounds)
- SQL injection prevention (parameterized queries / ORM)
- XSS prevention
- CSRF protection
- Rate limiting: 100 req/min per user
- Data isolation: outlet A tidak bisa akses data outlet B

### 9.3 Responsive Design
- Desktop-first, tapi harus usable di tablet dan mobile
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)
- Sidebar collapsible di mobile (hamburger menu)

### 9.4 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 10. FUTURE ROADMAP (Post MVP 1)

### MVP 2 (Planned)
- WhatsApp integration (Fonnte) untuk kirim nota & notifikasi
- Kalkulator Break-Even
- Multi-payment partial tracking
- Customer loyalty / membership

### MVP 3 (Planned)
- AI Financial Advisor (chatbot insight)
- Goal Tracking (target omzet)
- Simulasi Harga
- Laporan Pajak UMKM
- Benchmarking industri

### MVP 4 (Planned)
- Mobile app (wrapper: Capacitor / React Native)
- Sustainability Score
- IoT integration (mesin cuci)
- Pickup & delivery management

---

## 11. DESIGN SYSTEM REFERENCE

Refer to `design-system-v2.jsx` artifact for complete visual specifications:
- **Brand:** LaundryKu
- **Primary Color:** #00B4D8 (Cyan)
- **Secondary Color:** #FFB703 (Amber)
- **Font Heading:** Manrope (weight 500-800)
- **Font Body:** Nunito Sans (weight 400-700)
- **Border Radius:** 8px (sm) to 24px (2xl)
- **Shadows:** 5 levels (none to xl)

---

*End of PRD — LaundryKu MVP 1*

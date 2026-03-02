import {
  ShoppingBag,
  Users,
  Wallet,
  BarChart3,
  TrendingUp,
  Shield,
  ClipboardList,
  Clock,
  Bell,
  FileText,
  Package,
  Zap,
} from "lucide-react";

/* ──────────────────────────── FEATURES (Home — 6 items) ──────────────────────────── */

export const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Kelola Order",
    description:
      "Catat dan lacak semua order laundry dari masuk hingga selesai. Nota otomatis siap cetak.",
  },
  {
    icon: Users,
    title: "Data Pelanggan",
    description:
      "Database pelanggan lengkap dengan riwayat order dan preferensi layanan.",
  },
  {
    icon: Wallet,
    title: "Pencatatan Keuangan",
    description:
      "Catat pemasukan dan pengeluaran outlet secara detail dan terorganisir.",
  },
  {
    icon: BarChart3,
    title: "Laporan & Insight",
    description:
      "Dashboard visual dengan grafik pendapatan, tren order, dan performa outlet.",
  },
  {
    icon: TrendingUp,
    title: "Analisis Profit",
    description:
      "Hitung profit per layanan dan identifikasi layanan paling menguntungkan.",
    pro: true,
  },
  {
    icon: Shield,
    title: "Health Score",
    description:
      "Skor kesehatan bisnis harian berdasarkan 5 metrik operasional kunci.",
    pro: true,
  },
];

/* ──────────────────────────── FEATURES FULL (Features page — 12 items) ──────────────────────────── */

export const FEATURES_FULL = [
  {
    icon: ShoppingBag,
    title: "Kelola Order",
    description:
      "Input order dengan detail layanan, berat, harga. Tracking status real-time dari Diterima hingga Selesai.",
    category: "Operasional",
  },
  {
    icon: Users,
    title: "Data Pelanggan",
    description:
      "Database pelanggan lengkap. Lihat riwayat order, total spending, dan frekuensi kunjungan.",
    category: "Operasional",
  },
  {
    icon: ClipboardList,
    title: "Manajemen Karyawan",
    description:
      "Tambah staff dengan akun terpisah (username + PIN). Atur akses per role dan per outlet.",
    category: "Operasional",
  },
  {
    icon: Clock,
    title: "Absensi Staff",
    description:
      "Catat jam masuk dan pulang karyawan. Laporan kehadiran bulanan otomatis.",
    category: "Operasional",
  },
  {
    icon: Wallet,
    title: "Pencatatan Keuangan",
    description:
      "Input pemasukan (otomatis dari order) dan pengeluaran (manual). Kategori custom per outlet.",
    category: "Keuangan",
  },
  {
    icon: BarChart3,
    title: "Laporan Pendapatan",
    description:
      "Grafik pendapatan harian, mingguan, bulanan. Filter per layanan, periode, dan status.",
    category: "Keuangan",
  },
  {
    icon: FileText,
    title: "Nota Otomatis",
    description:
      "Generate dan cetak nota order dengan branding outlet. Format thermal printer ready.",
    category: "Operasional",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    description:
      "Alert untuk order baru, order overdue, dan anomali pengeluaran. Stay on top of everything.",
    category: "Operasional",
  },
  {
    icon: TrendingUp,
    title: "Analisis Profit per Layanan",
    description:
      "Breakdown profit setiap layanan. Tahu mana yang paling menguntungkan dan mana yang perlu adjust harga.",
    category: "Insight Pro",
    pro: true,
  },
  {
    icon: Package,
    title: "Smart Inventory",
    description:
      "Tracking stok deterjen, pewangi, plastik. Alert otomatis saat stok menipis.",
    category: "Insight Pro",
    pro: true,
  },
  {
    icon: Shield,
    title: "Health Score",
    description:
      "Skor kesehatan bisnis 0-100 setiap hari. Berdasarkan revenue trend, order volume, expenses, dan lainnya.",
    category: "Insight Pro",
    pro: true,
  },
  {
    icon: Zap,
    title: "Anomali Alert",
    description:
      "Deteksi otomatis pengeluaran tidak wajar, penurunan order mendadak, atau pola mencurigakan.",
    category: "Insight Pro",
    pro: true,
  },
];

/* ──────────────────────────── PRICING ──────────────────────────── */

export const PRICING_PLANS = [
  {
    name: "Regular",
    price: "99.000",
    period: "/bulan",
    description: "Untuk laundry yang baru mulai go digital",
    features: [
      "Kelola order & nota otomatis",
      "Data pelanggan lengkap",
      "Pencatatan pengeluaran",
      "Laporan pendapatan",
      "Manajemen karyawan & absensi",
      "1 outlet",
    ],
    cta: "Mulai Regular",
    popular: false,
  },
  {
    name: "Pro",
    price: "199.000",
    period: "/bulan",
    description: "Untuk laundry yang ingin scale up",
    features: [
      "Semua fitur Regular",
      "Profit per layanan",
      "Smart Inventory",
      "Health Score harian",
      "Anomali alert",
      "Export PDF & Excel",
      "Multi-outlet (hingga 5)",
    ],
    cta: "Mulai Pro",
    popular: true,
  },
];

/* ──────────────────────────── COMPARISON TABLE ──────────────────────────── */

export const COMPARISON_FEATURES = [
  { name: "Kelola Order & Nota", regular: true, pro: true },
  { name: "Data Pelanggan", regular: true, pro: true },
  { name: "Pencatatan Pengeluaran", regular: true, pro: true },
  { name: "Laporan Pendapatan", regular: true, pro: true },
  { name: "Manajemen Karyawan", regular: true, pro: true },
  { name: "Absensi Staff", regular: true, pro: true },
  { name: "Notifikasi", regular: true, pro: true },
  { name: "Jumlah Outlet", regular: "1", pro: "Hingga 5" },
  { name: "Profit per Layanan", regular: false, pro: true },
  { name: "Smart Inventory", regular: false, pro: true },
  { name: "Health Score", regular: false, pro: true },
  { name: "Anomali Alert", regular: false, pro: true },
  { name: "Export PDF & Excel", regular: false, pro: true },
];

/* ──────────────────────────── TESTIMONIALS ──────────────────────────── */

export const TESTIMONIALS = [
  {
    name: "Ibu Sari",
    business: "Sari Laundry, Jakarta",
    quote:
      "Sejak pakai LaundryKu, pencatatan order jadi rapi dan saya bisa lihat mana layanan yang paling untung. Revenue naik 25%!",
    avatar: "/avatars/sari.jpg",
  },
  {
    name: "Pak Budi",
    business: "Fresh Clean Laundry, Bandung",
    quote:
      "Health Score-nya bantu saya tahu kapan perlu improve operasional. Omzet naik 30% dalam 3 bulan!",
    avatar: "/avatars/budi.jpg",
  },
  {
    name: "Mbak Dina",
    business: "Dina Laundry Express, Surabaya",
    quote:
      "Karyawan saya bisa input order sendiri lewat akun staff. Saya cukup pantau dari HP. Praktis banget!",
    avatar: "/avatars/dina.jpg",
  },
  {
    name: "Pak Agus",
    business: "Agus Laundry Premium, Yogyakarta",
    quote:
      "Dulu pakai Excel, sekarang semua otomatis. Nota langsung cetak, laporan tinggal klik. Hemat waktu banget.",
    avatar: "/avatars/agus.jpg",
  },
];

/* ──────────────────────────── HOW IT WORKS ──────────────────────────── */

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Daftar & Setup Outlet",
    description:
      "Buat akun gratis, isi data outlet Anda dalam 2 menit. Langsung bisa pakai.",
  },
  {
    step: 2,
    title: "Mulai Catat Order",
    description:
      "Input order harian, sistem otomatis generate nota dan tracking status.",
  },
  {
    step: 3,
    title: "Dapatkan Insight",
    description:
      "Lihat laporan keuangan, profit per layanan, dan health score bisnis Anda.",
  },
];

/* ──────────────────────────── STATS ──────────────────────────── */

export const STATS = [
  { value: 2000, suffix: "+", label: "Outlet Aktif" },
  { value: 150, suffix: "rb+", label: "Order/bulan" },
  { value: 99.9, suffix: "%", label: "Uptime" },
  { value: 50, suffix: "+", label: "Kota" },
];

/* ──────────────────────────── TEAM ──────────────────────────── */

export const TEAM = [
  {
    name: "Zhafran Tharif",
    role: "Founder & CEO",
    bio: "Passionate tentang teknologi dan UMKM Indonesia. Membangun LaundryKu untuk membantu pelaku usaha laundry go digital.",
    avatar: "/avatars/zhafran.jpg",
  },
  {
    name: "Tim Engineering",
    role: "Development Team",
    bio: "Tim developer berpengalaman yang fokus membangun platform yang reliable, fast, dan user-friendly.",
    avatar: "/avatars/team.jpg",
  },
];

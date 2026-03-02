# F6 Finance — Design Document

**Date:** 2026-02-22
**Status:** Approved
**Scope:** Frontend only (mock data), 3 halaman keuangan

---

## Overview

F6 Finance menambahkan modul keuangan ke LaundryKu dashboard dengan 3 halaman:

1. `/finance/income` — Pemasukan (Owner only)
2. `/finance/expenses` — Pengeluaran (Owner full, Staff input only)
3. `/finance/profit` — Profit per Layanan (Pro plan, Owner only)

## Routing & Navigation

Sidebar: collapsible group "Keuangan" dengan 3 submenu.

```
app/(dashboard)/finance/
├── income/page.tsx
├── expenses/page.tsx
└── profit/page.tsx
```

## Halaman 1: Pemasukan (`/finance/income`)

**Access:** Owner only

### Layout
- **Summary Cards** (2): Total Pemasukan Bulan Ini (+ % vs bulan lalu), Jumlah Transaksi Lunas
- **Bar Chart** (recharts BarChart): Pendapatan harian, X=tanggal, Y=Rp, warna cyan #00B4D8
- **Filter Bar**: Date range, payment method, service
- **Tabel Transaksi**: Date, Order ID, Customer, Service, Amount, Payment Method + Pagination
- **Export** (Pro only): PDF/Excel button, disabled untuk Regular

### Data
- Filter orders where `payment_status = 'paid'`
- DP partial payments don't count until fully paid

## Halaman 2: Pengeluaran (`/finance/expenses`)

**Access:** Owner (full), Staff (input form only)

### Owner View
- **Summary Cards** (3): Total Pengeluaran Bulan Ini (+ % vs bulan lalu), Biaya per Kg (Pro), Kategori Tertinggi
- **Expense Trend Chart**: 6 bulan terakhir; Regular = total per bulan, Pro = stacked per category + anomaly marker (>20%)
- **Filter Bar**: Date range, category, search notes
- **Tabel Pengeluaran**: Date, Category, Sub-category (Pro), Amount, Notes, Created by + Edit/Delete actions + Pagination
- **Tombol "Catat Pengeluaran"** → ExpenseFormModal

### Staff View
- Heading + tombol "Catat Pengeluaran" saja
- Modal form dengan 4 kategori dasar (tanpa subcategory)

### ExpenseFormModal
- Fields: Tanggal, Kategori, Sub-kategori (Pro), Jumlah (Rp), Catatan, Recurring toggle
- Zod validation via `schemas/expense.ts`

### Default Categories
1. Bahan Baku — subcats: deterjen, pewangi, plastik, hanger, setrika_spray
2. Operasional — subcats: listrik, air, sewa, internet, maintenance_mesin
3. Gaji — per karyawan (dynamic)
4. Marketing — subcats: promo, diskon, iklan
5. Lain-lain — custom

## Halaman 3: Profit per Layanan (`/finance/profit`)

**Access:** Pro plan, Owner only. Non-Pro → upgrade prompt.

### Layout
- **Period Filter**: Minggu Ini, Bulan Ini, Custom range
- **Main Table**: Service Name, Total Orders, Total Revenue, Estimated Cost, Profit, Margin %
  - Sortable by margin
  - Row merah jika margin <20%; hijau >50%, kuning 20-50%
- **Bar Chart** (recharts BarChart): Revenue vs Cost per service (grouped bars), cyan vs coral
- **Insight Box**: Style ProInsightBox, e.g. "Service [X] has highest margin..."
- **Cost Allocation Setup**: Button → CostAllocationModal
  - List semua service + % allocation input
  - Total harus = 100%

## Komponen Baru

| Component | Path |
|-----------|------|
| IncomeChart | components/finance/IncomeChart.tsx |
| IncomeSummaryCards | components/finance/IncomeSummaryCards.tsx |
| IncomeTable | components/finance/IncomeTable.tsx |
| ExpenseFormModal | components/finance/ExpenseFormModal.tsx |
| ExpenseTable | components/finance/ExpenseTable.tsx |
| ExpenseTrendChart | components/finance/ExpenseTrendChart.tsx |
| ExpenseSummaryCards | components/finance/ExpenseSummaryCards.tsx |
| ProfitTable | components/finance/ProfitTable.tsx |
| ProfitChart | components/finance/ProfitChart.tsx |
| CostAllocationModal | components/finance/CostAllocationModal.tsx |
| FinanceFilterBar | components/finance/FinanceFilterBar.tsx |

## Supporting Files

| File | Purpose |
|------|---------|
| schemas/expense.ts | Zod schema untuk expense form |
| hooks/useFinanceFilters.ts | Filter state (date range, category, etc.) |
| services/finance.ts | API service layer (mock data) |
| types/index.ts | New types: Expense, IncomeTransaction, ProfitAnalysis, CostAllocation |

## Data Strategy

Mock data inline, sesuai pattern F3-F5. Service file disiapkan untuk nanti diganti API call.

## Permission Matrix

| Action | Regular Owner | Pro Owner | Staff |
|--------|:---:|:---:|:---:|
| View income | ✅ | ✅ | ❌ |
| View expense list | ✅ | ✅ | ❌ |
| View profit | ❌ | ✅ | ❌ |
| Input expense (4 basic) | ✅ | ✅ | ✅ |
| Input expense (subcats) | ❌ | ✅ | ❌ |
| Anomaly alerts | ❌ | ✅ | ❌ |
| Export PDF/Excel | ❌ | ✅ | ❌ |

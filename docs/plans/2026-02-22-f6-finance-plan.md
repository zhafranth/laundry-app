# F6 Finance — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 3 finance pages (Income, Expenses, Profit) with mock data, following existing LaundryKu FE patterns.

**Architecture:** Each page is a `"use client"` component under `app/(dashboard)/finance/`. Components live in `components/finance/`. Mock data inline (no API calls). Reuse existing StatCard, Pagination, Badge, Skeleton. Charts use recharts (already installed). Sidebar nav already has "Keuangan" group — needs minor update for staff access.

**Tech Stack:** Next.js, Tailwind CSS v4, recharts, React Hook Form + Zod, Zustand (auth store), React Query (for future API integration)

---

## Reference Files

Before implementing any task, read these files to understand the exact patterns:

| Pattern | File |
|---------|------|
| Page structure | `frontend/app/(dashboard)/orders/page.tsx` |
| Filter bar | `frontend/components/orders/OrderFilterBar.tsx` |
| Table | `frontend/components/orders/OrderTable.tsx` |
| Modal form (RHF+Zod) | `frontend/components/customers/CustomerFormModal.tsx` |
| Filter hook | `frontend/hooks/useOrderFilters.ts` |
| StatCard | `frontend/components/dashboard/StatCard.tsx` |
| RevenueChart (recharts) | `frontend/components/dashboard/RevenueChart.tsx` |
| ProInsightBox | `frontend/components/dashboard/ProInsightBox.tsx` |
| Nav config | `frontend/config/nav.ts` |
| SidebarNavItem | `frontend/components/layout/SidebarNavItem.tsx` |
| Types | `frontend/types/index.ts` |
| Query keys | `frontend/lib/query-keys.ts` |
| Zod schema | `frontend/schemas/customer.ts` |

---

## Task 1: Foundation — Types, Schema, Hooks, Query Keys

**Files:**
- Modify: `frontend/types/index.ts` (append new types)
- Create: `frontend/schemas/expense.ts`
- Create: `frontend/hooks/useFinanceFilters.ts`
- Modify: `frontend/lib/query-keys.ts` (add income & profit keys)

### Step 1: Add finance types to `types/index.ts`

Append after the Overview section (after line 231):

```typescript
// ===== Finance: Expense =====

export type ExpenseCategorySlug =
  | "bahan_baku"
  | "operasional"
  | "gaji"
  | "marketing"
  | "lain_lain";

export interface ExpenseCategory {
  id: string;
  outletId: string;
  name: string;
  slug: ExpenseCategorySlug;
  isDefault: boolean;
  sortOrder: number;
}

export interface ExpenseSubcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface Expense {
  id: string;
  outletId: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  amount: number;
  expenseDate: string;
  notes: string | null;
  isRecurring: boolean;
  recurringDay: number | null;
  createdByName: string;
  createdByType: "owner" | "staff";
  createdAt: string;
  updatedAt: string;
}

// ===== Finance: Income =====

export interface IncomeTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  serviceSummary: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
}

export interface IncomeDailySeries {
  date: string;
  label: string;
  amount: number;
}

export interface IncomeSummary {
  totalIncome: number;
  totalIncomeChangePercent: number;
  totalTransactions: number;
  dailyChart: IncomeDailySeries[];
  transactions: IncomeTransaction[];
}

// ===== Finance: Profit (Pro) =====

export interface ProfitByService {
  serviceId: string;
  serviceName: string;
  totalOrders: number;
  totalRevenue: number;
  estimatedCost: number;
  profit: number;
  marginPercent: number;
}

export interface CostAllocation {
  serviceId: string;
  serviceName: string;
  allocationPercent: number;
}

// ===== Finance: Expense Summary =====

export interface ExpenseSummary {
  totalExpenses: number;
  totalExpensesChangePercent: number;
  costPerKg: number | null; // Pro only
  highestCategory: string;
  highestCategoryAmount: number;
}

export interface ExpenseTrendSeries {
  month: string;
  label: string;
  total: number;
  // Pro: per-category breakdown
  bahan_baku?: number;
  operasional?: number;
  gaji?: number;
  marketing?: number;
  lain_lain?: number;
}
```

### Step 2: Create expense Zod schema

Create `frontend/schemas/expense.ts`:

```typescript
import { z } from "zod";

export const expenseSchema = z.object({
  expenseDate: z.string().min(1, { message: "Tanggal wajib diisi" }),
  categoryId: z.string().min(1, { message: "Pilih kategori" }),
  subcategoryId: z.string().optional(),
  amount: z.number().positive({ message: "Jumlah harus lebih dari 0" }),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringDay: z.number().min(1).max(31).optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
```

### Step 3: Create finance filter hooks

Create `frontend/hooks/useFinanceFilters.ts`:

Follow pattern from `hooks/useOrderFilters.ts`. Create two filter state types:

```typescript
import { useState, useCallback } from "react";

// ── Income Filters ──
export type IncomeFilterState = {
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  serviceId: string;
  page: number;
};

const DEFAULT_INCOME_FILTERS: IncomeFilterState = {
  dateFrom: "",
  dateTo: "",
  paymentMethod: "",
  serviceId: "",
  page: 1,
};

export function useIncomeFilters() {
  const [filters, setFilters] = useState<IncomeFilterState>(DEFAULT_INCOME_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof IncomeFilterState>(key: K, value: IncomeFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_INCOME_FILTERS), []);

  return { filters, updateFilter, resetFilters };
}

// ── Expense Filters ──
export type ExpenseFilterState = {
  categoryId: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  page: number;
};

const DEFAULT_EXPENSE_FILTERS: ExpenseFilterState = {
  categoryId: "",
  dateFrom: "",
  dateTo: "",
  search: "",
  page: 1,
};

export function useExpenseFilters() {
  const [filters, setFilters] = useState<ExpenseFilterState>(DEFAULT_EXPENSE_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof ExpenseFilterState>(key: K, value: ExpenseFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_EXPENSE_FILTERS), []);

  return { filters, updateFilter, resetFilters };
}
```

### Step 4: Add income & profit query keys

Modify `frontend/lib/query-keys.ts` — add after the existing `expenses` block (after line 67):

```typescript
  // Finance: Income
  income: {
    summary: (outletId: string, params?: { dateFrom?: string; dateTo?: string; paymentMethod?: string; serviceId?: string }) =>
      ["income", outletId, "summary", params] as const,
    list: (outletId: string, params?: { page?: number; pageSize?: number; dateFrom?: string; dateTo?: string; paymentMethod?: string; serviceId?: string }) =>
      ["income", outletId, params] as const,
  },

  // Finance: Profit (Pro)
  profit: {
    list: (outletId: string, period?: string) =>
      ["profit", outletId, period] as const,
    costAllocations: (outletId: string) =>
      ["profit", outletId, "allocations"] as const,
  },
```

### Step 5: Commit

```bash
git add frontend/types/index.ts frontend/schemas/expense.ts frontend/hooks/useFinanceFilters.ts frontend/lib/query-keys.ts
git commit -m "feat(f6): add finance types, expense schema, filter hooks, query keys"
```

---

## Task 2: Sidebar Nav — Staff Access to Pengeluaran

**Problem:** Currently `Keuangan` has `roles: ["owner"]`. Staff needs to see "Pengeluaran" sub-item (but NOT Pemasukan or Profit).

**Files:**
- Modify: `frontend/config/nav.ts` — add `roles` to `NavSubItem`, update Keuangan config
- Modify: `frontend/components/layout/SidebarNavItem.tsx` — filter sub-items by role

### Step 1: Add `roles` to NavSubItem interface

In `frontend/config/nav.ts`, update the `NavSubItem` interface (lines 14-18):

```typescript
export interface NavSubItem {
  label: string;
  href: string;
  proOnly?: boolean;
  /** If set, only these roles can see this sub-item. Defaults to parent's roles. */
  roles?: UserRole[];
}
```

### Step 2: Update Keuangan nav config

Change lines 52-62 in `frontend/config/nav.ts`:

```typescript
  {
    label: "Keuangan",
    href: "/finance",
    icon: Wallet,
    roles: ["owner", "staff"], // Both can see the group
    subItems: [
      { label: "Pemasukan", href: "/finance/income", roles: ["owner"] },
      { label: "Pengeluaran", href: "/finance/expenses" }, // Both roles (inherits parent)
      { label: "Profit Layanan", href: "/finance/profit", proOnly: true, roles: ["owner"] },
    ],
  },
```

### Step 3: Filter sub-items by role in SidebarNavItem

In `frontend/components/layout/SidebarNavItem.tsx`, the component needs access to the user's `role`. Add it to props:

Update interface (line 11-15):
```typescript
interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  plan: PlanType;
  role: UserRole;
}
```

Update function signature (line 25):
```typescript
export function SidebarNavItem({ item, isCollapsed, plan, role }: SidebarNavItemProps) {
```

In the sub-items map (line 109), add role filtering before the existing lock check:

```typescript
{item.subItems!
  .filter((sub) => !sub.roles || sub.roles.includes(role))
  .map((sub) => {
    // ... existing lock check & render logic (unchanged)
  })}
```

### Step 4: Pass `role` prop from Sidebar

In `frontend/components/layout/Sidebar.tsx`, find where `SidebarNavItem` is rendered and add `role={role}`:

```tsx
<SidebarNavItem
  key={item.href}
  item={item}
  isCollapsed={isCollapsed}
  plan={plan}
  role={role}
/>
```

Make sure `role` is extracted from auth store (should already be: `const role = user?.role ?? "staff"`).

### Step 5: Commit

```bash
git add frontend/config/nav.ts frontend/components/layout/SidebarNavItem.tsx frontend/components/layout/Sidebar.tsx
git commit -m "feat(f6): add staff access to Pengeluaran sub-item in sidebar"
```

---

## Task 3: Income Page (`/finance/income`)

**Files:**
- Create: `frontend/app/(dashboard)/finance/income/page.tsx`
- Create: `frontend/components/finance/IncomeChart.tsx`
- Create: `frontend/components/finance/IncomeTable.tsx`
- Create: `frontend/components/finance/IncomeFilterBar.tsx`

### Step 1: Create IncomeChart component

Create `frontend/components/finance/IncomeChart.tsx`:

- Follow `components/dashboard/RevenueChart.tsx` pattern
- Use recharts `BarChart` (not AreaChart) for daily income
- X-axis: date labels (1-31), Y-axis: Rp amount
- Bar color: `#00B4D8` (cyan)
- Custom tooltip with dark navy bg (same as RevenueChart CustomTooltip)
- `formatRupiah` helper (same as RevenueChart)
- Props: `{ data: IncomeDailySeries[]; isLoading?: boolean }`
- Title: "Pendapatan Harian"
- Empty state: dashed border placeholder
- Skeleton loading state

Key differences from RevenueChart:
- `BarChart` + `Bar` instead of `AreaChart` + `Area`
- No gradient fill — use solid `fill="#00B4D8"` with `radius={[4, 4, 0, 0]}` for rounded top
- Height: 220px (slightly taller than RevenueChart's 180px)

### Step 2: Create IncomeFilterBar component

Create `frontend/components/finance/IncomeFilterBar.tsx`:

- Follow `components/orders/OrderFilterBar.tsx` pattern exactly
- Props: `{ filters: IncomeFilterState; onFilterChange; onReset }`
- Fields:
  - Date From (date input)
  - Date To (date input)
  - Payment Method (select: Semua, Tunai, Transfer, QRIS)
  - Service (select: Semua + mock service list)
  - Reset button (conditional, shown when hasActiveFilters)
- Use same styles: `selectStyle`, `dateInputStyle` from OrderFilterBar

### Step 3: Create IncomeTable component

Create `frontend/components/finance/IncomeTable.tsx`:

- Follow `components/orders/OrderTable.tsx` pattern exactly
- Props: `{ data: IncomeTransaction[]; isLoading?: boolean }`
- Columns:
  1. Tanggal — formatted date
  2. No. Order — bold cyan (#00B4D8), monospace-ish
  3. Pelanggan — name
  4. Layanan — service summary (truncated)
  5. Jumlah — right-aligned, bold, Rp formatted
  6. Metode — payment method badge (capitalize)
- Table styling: same as OrderTable (thStyle, tdStyle, hover #F5F7FA, header bg #F5F7FA)
- Skeleton loading rows: `Array.from({ length: 8 })`
- Empty state: centered icon + "Belum ada transaksi pemasukan"

### Step 4: Create Income page

Create `frontend/app/(dashboard)/finance/income/page.tsx`:

- `"use client"` component
- Get `user` and `activeOutletId` from `useAuthStore`
- Check `user?.role === "owner"` — if staff, show access denied message
- Use `useIncomeFilters()` hook
- Mock data: inline `MOCK_INCOME_SUMMARY` constant with realistic data
  - 7-10 mock transactions (laundry orders, paid)
  - Daily chart data for current month (28-31 days)
  - totalIncome: ~Rp 8.500.000
  - totalIncomeChangePercent: +12.5
  - totalTransactions: 47
- Layout (top to bottom):
  1. **Page header**: Wallet icon + "Pemasukan" + month badge
  2. **Summary cards** (2 cards, `grid grid-cols-1 sm:grid-cols-2 gap-4`):
     - Card 1: Total Pemasukan (Rp), changePercent, icon: TrendingUp, iconColor: #00C853, iconBg: rgba(0,200,83,0.1)
     - Card 2: Transaksi Lunas, icon: CheckCircle, iconColor: #00B4D8, iconBg: rgba(0,180,216,0.1)
  3. **IncomeChart**: `data={mockData.dailyChart}`
  4. **IncomeFilterBar**: `filters={filters} onFilterChange={updateFilter} onReset={resetFilters}`
  5. **IncomeTable**: `data={filteredTransactions}`
  6. **Pagination**: `page={filters.page} totalPages={totalPages} onPageChange={...}`
  7. **Export button** (Pro only): at top-right of table section, disabled for Regular with ProBadge
- Wrap chart & table in white cards with `rounded-2xl` border `1.5px solid #E8EDF2` shadow

### Step 5: Commit

```bash
git add frontend/app/\(dashboard\)/finance/income/page.tsx frontend/components/finance/IncomeChart.tsx frontend/components/finance/IncomeTable.tsx frontend/components/finance/IncomeFilterBar.tsx
git commit -m "feat(f6): add income page with chart, table, and filters"
```

---

## Task 4: Expenses Page (`/finance/expenses`)

**Files:**
- Create: `frontend/app/(dashboard)/finance/expenses/page.tsx`
- Create: `frontend/components/finance/ExpenseSummaryCards.tsx`
- Create: `frontend/components/finance/ExpenseTrendChart.tsx`
- Create: `frontend/components/finance/ExpenseTable.tsx`
- Create: `frontend/components/finance/ExpenseFilterBar.tsx`
- Create: `frontend/components/finance/ExpenseFormModal.tsx`

### Step 1: Create ExpenseFormModal

Create `frontend/components/finance/ExpenseFormModal.tsx`:

- Follow `components/customers/CustomerFormModal.tsx` pattern exactly
- Props:
  ```typescript
  interface ExpenseFormModalProps {
    mode: "create" | "edit";
    defaultValues?: Partial<ExpenseFormValues>;
    categories: ExpenseCategory[];
    subcategories?: ExpenseSubcategory[]; // Pro only
    isPro: boolean;
    onSubmit: (values: ExpenseFormValues) => void;
    onClose: () => void;
    isPending: boolean;
  }
  ```
- RHF + zodResolver with `expenseSchema`
- Fields:
  1. Tanggal — `<input type="date">` with register("expenseDate")
  2. Kategori — `<select>` mapped from `categories` prop
  3. Sub-kategori — `<select>` only if `isPro && selectedCategory has subcategories`, mapped from filtered subcategories
  4. Jumlah — `<input type="number">` with `register("amount", { valueAsNumber: true })`, placeholder "Rp 0"
  5. Catatan — `<textarea>` optional, follow the textarea onBlur pattern from CustomerFormModal
  6. Recurring — checkbox toggle, if checked show day-of-month select (1-31)
- Modal styling: same as CustomerFormModal (backdrop, rounded-2xl, shadow, fade-up animation)
- Header: "Catat Pengeluaran" (create) or "Edit Pengeluaran" (edit)
- Footer: Cancel (ghost) + Submit (primary) buttons

### Step 2: Create ExpenseTable

Create `frontend/components/finance/ExpenseTable.tsx`:

- Follow `components/orders/OrderTable.tsx` pattern
- Props: `{ data: Expense[]; isLoading?: boolean; isOwner: boolean; onEdit?: (e: Expense) => void; onDelete?: (e: Expense) => void }`
- Columns:
  1. Tanggal — formatted date
  2. Kategori — category name with colored dot indicator
  3. Sub-kategori — subcategory name or "-" (Pro only column, hide if all null)
  4. Jumlah — right-aligned, bold, Rp formatted
  5. Catatan — truncated notes or "-"
  6. Dicatat oleh — createdByName
  7. Aksi — Edit + Delete buttons (owner only)
- Category color dots:
  - bahan_baku: #00B4D8 (cyan)
  - operasional: #FFB703 (amber)
  - gaji: #7C4DFF (purple)
  - marketing: #00C853 (green)
  - lain_lain: #8899AA (gray)
- Skeleton & empty state: same pattern as OrderTable

### Step 3: Create ExpenseFilterBar

Create `frontend/components/finance/ExpenseFilterBar.tsx`:

- Follow OrderFilterBar pattern
- Props: `{ filters: ExpenseFilterState; categories: ExpenseCategory[]; onFilterChange; onReset }`
- Fields:
  - Search (debounced, 400ms) — search notes
  - Category dropdown (from `categories` prop)
  - Date From / Date To
  - Reset button
- Styles: same selectStyle, inputStyle, dateInputStyle as OrderFilterBar

### Step 4: Create ExpenseTrendChart

Create `frontend/components/finance/ExpenseTrendChart.tsx`:

- Props: `{ data: ExpenseTrendSeries[]; isPro: boolean; isLoading?: boolean }`
- Regular: Simple `BarChart` with single cyan bars (total per month)
- Pro: `BarChart` with stacked bars (one color per category)
  - bahan_baku: #00B4D8
  - operasional: #FFB703
  - gaji: #7C4DFF
  - marketing: #00C853
  - lain_lain: #8899AA
- X-axis: month labels (Jan, Feb, etc.), Y-axis: Rp
- Custom tooltip (same dark style as RevenueChart)
- Title: "Tren Pengeluaran 6 Bulan"
- Height: 240px
- Legend for Pro (small colored dots + labels below chart)

### Step 5: Create ExpenseSummaryCards

Create `frontend/components/finance/ExpenseSummaryCards.tsx`:

- Props: `{ summary: ExpenseSummary; isPro: boolean; isLoading?: boolean }`
- Renders 2-3 StatCard components:
  1. Total Pengeluaran Bulan Ini — icon: TrendingDown, color: #EF2D56, bg: rgba(239,45,86,0.1), changePercent from summary
  2. Biaya per Kg (Pro only) — icon: Scale, color: #7C4DFF, bg: rgba(124,77,255,0.1), value: `Rp ${costPerKg}/kg`
  3. Kategori Tertinggi — icon: BarChart3, color: #FFB703, bg: rgba(255,183,3,0.1), value: category name, subLabel: amount
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` (or 2 cols for Regular)

### Step 6: Create Expenses page

Create `frontend/app/(dashboard)/finance/expenses/page.tsx`:

- `"use client"` component
- Get `user` and `activeOutletId` from useAuthStore
- Determine: `const isOwner = user?.role === "owner"`, `const isPro = user?.plan === "pro"`
- Use `useExpenseFilters()` hook
- Mock data:
  - `MOCK_CATEGORIES`: 5 categories (Bahan Baku, Operasional, Gaji, Marketing, Lain-lain)
  - `MOCK_SUBCATEGORIES`: Pro subcategories per category
  - `MOCK_EXPENSES`: 15-20 expense records across categories
  - `MOCK_EXPENSE_SUMMARY`: totals + costPerKg + highestCategory
  - `MOCK_TREND_DATA`: 6 months of trend data (with category breakdown for Pro)
- Modal state: `expenseToEdit`, `showForm`, `showDelete`
- **Owner view** (top to bottom):
  1. Page header: Receipt icon + "Pengeluaran" + "Catat Pengeluaran" button (top-right)
  2. ExpenseSummaryCards
  3. ExpenseTrendChart (inside white card)
  4. ExpenseFilterBar
  5. ExpenseTable with edit/delete actions
  6. Pagination
- **Staff view**:
  1. Page header: Receipt icon + "Catat Pengeluaran"
  2. Only the "Catat Pengeluaran" button prominently centered
  3. Info text: "Anda hanya dapat mencatat pengeluaran. Hubungi owner untuk melihat laporan."
- ExpenseFormModal: opened on "Catat Pengeluaran" click or edit click
  - Staff: 4 basic categories only (no subcategories)
  - Owner Pro: categories + subcategories
  - Owner Regular: categories only (no subcategories)

### Step 7: Commit

```bash
git add frontend/app/\(dashboard\)/finance/expenses/page.tsx frontend/components/finance/ExpenseSummaryCards.tsx frontend/components/finance/ExpenseTrendChart.tsx frontend/components/finance/ExpenseTable.tsx frontend/components/finance/ExpenseFilterBar.tsx frontend/components/finance/ExpenseFormModal.tsx
git commit -m "feat(f6): add expenses page with form, table, chart, and filters"
```

---

## Task 5: Profit Page (`/finance/profit`) — Pro Only

**Files:**
- Create: `frontend/app/(dashboard)/finance/profit/page.tsx`
- Create: `frontend/components/finance/ProfitTable.tsx`
- Create: `frontend/components/finance/ProfitChart.tsx`
- Create: `frontend/components/finance/CostAllocationModal.tsx`

### Step 1: Create ProfitTable

Create `frontend/components/finance/ProfitTable.tsx`:

- Props: `{ data: ProfitByService[]; isLoading?: boolean; sortBy: string; sortOrder: "asc" | "desc"; onSort: (field: string) => void }`
- Columns (all sortable):
  1. Layanan — service name, bold
  2. Total Order — number
  3. Total Pendapatan — Rp formatted, right-aligned
  4. Estimasi Biaya — Rp formatted, right-aligned
  5. Profit — Rp formatted, right-aligned, bold
  6. Margin — percentage with color coding:
     - \>50%: #00C853 (green) bg rgba(0,200,83,0.1)
     - 20-50%: #FFB703 (amber) bg rgba(255,183,3,0.1)
     - <20%: #EF2D56 (red) bg rgba(239,45,86,0.1)
- Row styling: rows with margin <20% get subtle red left border
- Sort indicators: chevron up/down in column headers (follow CustomerTable pattern if any)
- Skeleton & empty state: standard pattern

### Step 2: Create ProfitChart

Create `frontend/components/finance/ProfitChart.tsx`:

- Props: `{ data: ProfitByService[]; isLoading?: boolean }`
- recharts `BarChart` with grouped (side-by-side) bars:
  - Revenue bar: `#00B4D8` (cyan)
  - Cost bar: `#EF2D56` (coral/red)
- X-axis: service names
- Y-axis: Rp formatted
- Custom tooltip (dark style)
- Title: "Pendapatan vs Biaya per Layanan"
- Legend: two colored dots (Pendapatan, Biaya)
- Height: 260px

### Step 3: Create CostAllocationModal

Create `frontend/components/finance/CostAllocationModal.tsx`:

- Props: `{ allocations: CostAllocation[]; onSubmit: (allocations: CostAllocation[]) => void; onClose: () => void; isPending: boolean }`
- Form: list of services with % input per service
- Each row: Service Name (label) + `<input type="number">` (0-100, step 1)
- Footer shows **Total: XX%** — highlighted red if not 100%
- Submit disabled if total !== 100
- Validation: total must equal exactly 100%
- Modal styling: same pattern as CustomerFormModal
- Note: this does NOT use RHF — simple useState with array of allocations, since it's a dynamic list with a global constraint (sum = 100)

### Step 4: Create Profit page

Create `frontend/app/(dashboard)/finance/profit/page.tsx`:

- `"use client"` component
- Check: `isPro = user?.plan === "pro"`, `isOwner = user?.role === "owner"`
- **Non-Pro gate**: If `!isPro`, show upgrade prompt:
  - Centered container with Lock icon
  - "Fitur Pro" heading
  - "Upgrade ke paket Pro untuk melihat profit per layanan, alokasi biaya, dan insight profitabilitas."
  - Button: "Upgrade ke Pro" (links to /settings/subscription)
  - Style: white card, centered, subtle shadow
- **Pro owner view** (top to bottom):
  1. Page header: BarChart3 icon + "Profit per Layanan" + Badge variant="pro"
  2. Period filter: 3 buttons (Minggu Ini, Bulan Ini, Custom) — like tabs, active = cyan bg
  3. ProfitChart (inside white card)
  4. ProfitTable (sortable, inside white card)
  5. ProInsightBox with 1-2 insights (reuse existing component)
     - e.g. "Layanan Express Kilat memiliki margin tertinggi (72%). Pertimbangkan untuk mempromosikannya."
  6. "Atur Alokasi Biaya" button → opens CostAllocationModal
- Mock data:
  - `MOCK_PROFIT_DATA`: 5-6 services with varied margins
  - `MOCK_COST_ALLOCATIONS`: matching services with % split
  - `MOCK_PROFIT_INSIGHTS`: 1-2 DashboardInsight items
- Sort state: `sortBy` and `sortOrder` with toggle handler

### Step 5: Commit

```bash
git add frontend/app/\(dashboard\)/finance/profit/page.tsx frontend/components/finance/ProfitTable.tsx frontend/components/finance/ProfitChart.tsx frontend/components/finance/CostAllocationModal.tsx
git commit -m "feat(f6): add profit page with table, chart, and cost allocation (Pro only)"
```

---

## Task 6: Build Verification & Polish

### Step 1: Run build to check for errors

```bash
cd frontend && npm run build
```

Fix any TypeScript or build errors.

### Step 2: Visual review

- Open each page in browser
- Verify responsive layout (desktop + mobile)
- Check sidebar navigation (owner vs staff)
- Check Pro vs Regular gating
- Verify all mock data renders correctly

### Step 3: Final commit

```bash
git add -A
git commit -m "fix(f6): address build errors and polish finance pages"
```

---

## Design Styling Quick Reference

| Element | Style |
|---------|-------|
| Card border | `1.5px solid #E8EDF2` |
| Card radius | `rounded-2xl` (16px) |
| Card shadow | `0 2px 8px rgba(11,29,53,0.07)` |
| Table header bg | `#F5F7FA` |
| Table header text | `0.7rem`, uppercase, `#8899AA`, `Manrope 700` |
| Table body text | `0.8125rem`, `Nunito Sans 600`, `#1A2D45` |
| Input border | `1.5px solid #E8EDF2`, radius `10px` |
| Input height | `40px` |
| Modal backdrop | `rgba(11,29,53,0.5)` |
| Modal animation | `fade-up 0.2s ease` |
| Primary color | `#00B4D8` |
| Heading font | `Manrope, system-ui` weight 700-800 |
| Body font | `Nunito Sans, system-ui` weight 400-600 |
| Rp formatting | `value.toLocaleString("id-ID")` |

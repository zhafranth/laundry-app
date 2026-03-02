"use client";

import { useState } from "react";
import { Receipt, Plus, Info } from "lucide-react";
import { useAuthStore } from "@/store";
import { useExpenseFilters } from "@/hooks/useFinanceFilters";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ExpenseSummaryCards } from "@/components/finance/ExpenseSummaryCards";
import { ExpenseTrendChart } from "@/components/finance/ExpenseTrendChart";
import { ExpenseFilterBar } from "@/components/finance/ExpenseFilterBar";
import { ExpenseTable } from "@/components/finance/ExpenseTable";
import { ExpenseFormModal } from "@/components/finance/ExpenseFormModal";
import type {
  Expense,
  ExpenseCategory,
  ExpenseSubcategory,
  ExpenseSummary,
  ExpenseTrendSeries,
} from "@/types";
import type { ExpenseFormValues as ExpenseFormSchema } from "@/schemas/expense";

const PAGE_SIZE = 20;

// ── Mock Categories ──
const MOCK_CATEGORIES: ExpenseCategory[] = [
  { id: "cat-1", outletId: "o1", name: "Bahan Baku", slug: "bahan_baku", isDefault: true, sortOrder: 1 },
  { id: "cat-2", outletId: "o1", name: "Operasional", slug: "operasional", isDefault: true, sortOrder: 2 },
  { id: "cat-3", outletId: "o1", name: "Gaji", slug: "gaji", isDefault: true, sortOrder: 3 },
  { id: "cat-4", outletId: "o1", name: "Marketing", slug: "marketing", isDefault: true, sortOrder: 4 },
  { id: "cat-5", outletId: "o1", name: "Lain-lain", slug: "lain_lain", isDefault: true, sortOrder: 5 },
];

const MOCK_SUBCATEGORIES: ExpenseSubcategory[] = [
  { id: "sc-1", categoryId: "cat-1", name: "Deterjen", slug: "deterjen", sortOrder: 1 },
  { id: "sc-2", categoryId: "cat-1", name: "Pewangi", slug: "pewangi", sortOrder: 2 },
  { id: "sc-3", categoryId: "cat-1", name: "Plastik", slug: "plastik", sortOrder: 3 },
  { id: "sc-4", categoryId: "cat-1", name: "Hanger", slug: "hanger", sortOrder: 4 },
  { id: "sc-5", categoryId: "cat-2", name: "Listrik", slug: "listrik", sortOrder: 1 },
  { id: "sc-6", categoryId: "cat-2", name: "Air", slug: "air", sortOrder: 2 },
  { id: "sc-7", categoryId: "cat-2", name: "Sewa", slug: "sewa", sortOrder: 3 },
  { id: "sc-8", categoryId: "cat-2", name: "Internet", slug: "internet", sortOrder: 4 },
  { id: "sc-9", categoryId: "cat-2", name: "Maintenance Mesin", slug: "maintenance_mesin", sortOrder: 5 },
  { id: "sc-10", categoryId: "cat-4", name: "Promo", slug: "promo", sortOrder: 1 },
  { id: "sc-11", categoryId: "cat-4", name: "Diskon", slug: "diskon", sortOrder: 2 },
  { id: "sc-12", categoryId: "cat-4", name: "Iklan", slug: "iklan", sortOrder: 3 },
];

const MOCK_EXPENSES: Expense[] = [
  { id: "e1", outletId: "o1", categoryId: "cat-1", categoryName: "Bahan Baku", subcategoryId: "sc-1", subcategoryName: "Deterjen", amount: 350000, expenseDate: "2026-02-22", notes: "Beli deterjen 5 liter", isRecurring: false, recurringDay: null, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-22T08:00:00", updatedAt: "2026-02-22T08:00:00" },
  { id: "e2", outletId: "o1", categoryId: "cat-2", categoryName: "Operasional", subcategoryId: "sc-5", subcategoryName: "Listrik", amount: 1200000, expenseDate: "2026-02-20", notes: "Tagihan listrik bulan Februari", isRecurring: true, recurringDay: 20, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-20T09:00:00", updatedAt: "2026-02-20T09:00:00" },
  { id: "e3", outletId: "o1", categoryId: "cat-1", categoryName: "Bahan Baku", subcategoryId: "sc-2", subcategoryName: "Pewangi", amount: 180000, expenseDate: "2026-02-19", notes: "Pewangi softener 3 liter", isRecurring: false, recurringDay: null, createdByName: "Andi", createdByType: "staff", createdAt: "2026-02-19T10:30:00", updatedAt: "2026-02-19T10:30:00" },
  { id: "e4", outletId: "o1", categoryId: "cat-3", categoryName: "Gaji", subcategoryId: null, subcategoryName: null, amount: 2500000, expenseDate: "2026-02-15", notes: "Gaji Andi bulan Feb", isRecurring: true, recurringDay: 15, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-15T08:00:00", updatedAt: "2026-02-15T08:00:00" },
  { id: "e5", outletId: "o1", categoryId: "cat-3", categoryName: "Gaji", subcategoryId: null, subcategoryName: null, amount: 2500000, expenseDate: "2026-02-15", notes: "Gaji Budi bulan Feb", isRecurring: true, recurringDay: 15, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-15T08:00:00", updatedAt: "2026-02-15T08:00:00" },
  { id: "e6", outletId: "o1", categoryId: "cat-2", categoryName: "Operasional", subcategoryId: "sc-6", subcategoryName: "Air", amount: 450000, expenseDate: "2026-02-18", notes: "Tagihan PDAM", isRecurring: true, recurringDay: 18, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-18T09:00:00", updatedAt: "2026-02-18T09:00:00" },
  { id: "e7", outletId: "o1", categoryId: "cat-4", categoryName: "Marketing", subcategoryId: "sc-10", subcategoryName: "Promo", amount: 200000, expenseDate: "2026-02-17", notes: "Voucher diskon pelanggan baru", isRecurring: false, recurringDay: null, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-17T14:00:00", updatedAt: "2026-02-17T14:00:00" },
  { id: "e8", outletId: "o1", categoryId: "cat-1", categoryName: "Bahan Baku", subcategoryId: "sc-3", subcategoryName: "Plastik", amount: 95000, expenseDate: "2026-02-16", notes: "Plastik packing 2 roll", isRecurring: false, recurringDay: null, createdByName: "Andi", createdByType: "staff", createdAt: "2026-02-16T11:00:00", updatedAt: "2026-02-16T11:00:00" },
  { id: "e9", outletId: "o1", categoryId: "cat-5", categoryName: "Lain-lain", subcategoryId: null, subcategoryName: null, amount: 150000, expenseDate: "2026-02-14", notes: "Beli ember + gayung", isRecurring: false, recurringDay: null, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-14T10:00:00", updatedAt: "2026-02-14T10:00:00" },
  { id: "e10", outletId: "o1", categoryId: "cat-2", categoryName: "Operasional", subcategoryId: "sc-9", subcategoryName: "Maintenance Mesin", amount: 500000, expenseDate: "2026-02-12", notes: "Servis mesin cuci #2", isRecurring: false, recurringDay: null, createdByName: "Owner", createdByType: "owner", createdAt: "2026-02-12T08:00:00", updatedAt: "2026-02-12T08:00:00" },
];

const MOCK_SUMMARY: ExpenseSummary = {
  totalExpenses: 8125000,
  totalExpensesChangePercent: -5.3,
  costPerKg: 2750,
  highestCategory: "Gaji",
  highestCategoryAmount: 5000000,
};

const MOCK_TREND: ExpenseTrendSeries[] = [
  { month: "2025-09", label: "Sep", total: 7200000, bahan_baku: 1500000, operasional: 2000000, gaji: 2500000, marketing: 700000, lain_lain: 500000 },
  { month: "2025-10", label: "Okt", total: 7800000, bahan_baku: 1700000, operasional: 2100000, gaji: 2500000, marketing: 800000, lain_lain: 700000 },
  { month: "2025-11", label: "Nov", total: 8100000, bahan_baku: 1600000, operasional: 2200000, gaji: 2500000, marketing: 900000, lain_lain: 900000 },
  { month: "2025-12", label: "Des", total: 8500000, bahan_baku: 1800000, operasional: 2300000, gaji: 2500000, marketing: 1000000, lain_lain: 900000 },
  { month: "2026-01", label: "Jan", total: 8300000, bahan_baku: 1650000, operasional: 2150000, gaji: 2500000, marketing: 1100000, lain_lain: 900000 },
  { month: "2026-02", label: "Feb", total: 8125000, bahan_baku: 625000, operasional: 2150000, gaji: 5000000, marketing: 200000, lain_lain: 150000 },
];

export default function ExpensesPage() {
  const user = useAuthStore((s) => s.user);
  const { filters, updateFilter, resetFilters } = useExpenseFilters();

  const isOwner = user?.role === "owner";
  const isPro = user?.plan === "pro";

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  // Staff-only view: just the "Catat Pengeluaran" button + form
  if (!isOwner) {
    return (
      <div className="flex flex-col gap-5 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: "rgba(239,45,86,0.10)" }}
          >
            <Receipt size={20} color="#EF2D56" />
          </div>
          <h1
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#0B1D35",
              margin: 0,
            }}
          >
            Catat Pengeluaran
          </h1>
        </div>

        {/* Staff CTA */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl"
          style={{
            padding: "48px 24px",
            background: "white",
            border: "1.5px solid #E8EDF2",
            boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{ width: 64, height: 64, background: "rgba(0,180,216,0.10)" }}
          >
            <Plus size={28} color="#00B4D8" />
          </div>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#0B1D35",
              marginBottom: 8,
            }}
          >
            Catat Pengeluaran Baru
          </p>
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.85rem",
              color: "#8899AA",
              textAlign: "center",
              maxWidth: 360,
              marginBottom: 20,
            }}
          >
            Anda dapat mencatat pengeluaran harian. Hubungi owner untuk melihat laporan lengkap.
          </p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Catat Pengeluaran
          </Button>
        </div>

        {/* Info banner */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(0,180,216,0.06)", border: "1px solid rgba(0,180,216,0.15)" }}
        >
          <Info size={16} style={{ color: "#00B4D8", flexShrink: 0 }} />
          <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.8125rem", color: "#1A2D45" }}>
            Anda hanya dapat mencatat pengeluaran. Hubungi owner untuk melihat laporan dan grafik.
          </p>
        </div>

        {/* Form Modal */}
        {showForm && (
          <ExpenseFormModal
            mode="create"
            categories={MOCK_CATEGORIES.filter((c) => ["bahan_baku", "operasional", "gaji", "lain_lain"].includes(c.slug))}
            isPro={false}
            onSubmit={(values: ExpenseFormSchema) => {
              console.log("Staff expense:", values);
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
            isPending={false}
          />
        )}
      </div>
    );
  }

  // Owner view: full page
  let filtered = [...MOCK_EXPENSES];
  if (filters.categoryId) {
    filtered = filtered.filter((e) => e.categoryId === filters.categoryId);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((e) => e.notes?.toLowerCase().includes(q));
  }
  if (filters.dateFrom) {
    filtered = filtered.filter((e) => e.expenseDate >= filters.dateFrom);
  }
  if (filters.dateTo) {
    filtered = filtered.filter((e) => e.expenseDate <= filters.dateTo);
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: "rgba(239,45,86,0.10)" }}
          >
            <Receipt size={20} color="#EF2D56" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Pengeluaran
            </h1>
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.78rem", color: "#8899AA", margin: 0 }}>
              Februari 2026
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
          <Plus size={16} />
          Catat Pengeluaran
        </Button>
      </div>

      {/* Summary Cards */}
      <ExpenseSummaryCards summary={MOCK_SUMMARY} isPro={isPro ?? false} />

      {/* Trend Chart */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid #E8EDF2",
          boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
        }}
      >
        <ExpenseTrendChart data={MOCK_TREND} isPro={isPro ?? false} />
      </div>

      {/* Filter Bar */}
      <ExpenseFilterBar
        filters={filters}
        categories={MOCK_CATEGORIES}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Table */}
      <ExpenseTable
        data={paged}
        isOwner={isOwner}
        isPro={isPro}
        onEdit={(e) => { setEditTarget(e); setShowForm(true); }}
        onDelete={(e) => setDeleteTarget(e)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(p) => updateFilter("page", p)}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <ExpenseFormModal
          key={editTarget?.id ?? "create"}
          mode={editTarget ? "edit" : "create"}
          defaultValues={
            editTarget
              ? {
                  expenseDate: editTarget.expenseDate,
                  categoryId: editTarget.categoryId,
                  subcategoryId: editTarget.subcategoryId ?? undefined,
                  amount: editTarget.amount,
                  notes: editTarget.notes ?? "",
                  isRecurring: editTarget.isRecurring,
                  recurringDay: editTarget.recurringDay ?? undefined,
                }
              : undefined
          }
          categories={MOCK_CATEGORIES}
          subcategories={isPro ? MOCK_SUBCATEGORIES : undefined}
          isPro={isPro ?? false}
          onSubmit={(values: ExpenseFormSchema) => {
            console.log("Expense:", values);
            setShowForm(false);
            setEditTarget(null);
          }}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          isPending={false}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(11,29,53,0.5)" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="rounded-2xl p-6"
            style={{
              background: "white",
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 16px 48px rgba(11,29,53,0.18)",
              animation: "fade-up 0.2s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0B1D35",
                marginBottom: 8,
              }}
            >
              Hapus Pengeluaran?
            </p>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.85rem",
                color: "#5A6B80",
                marginBottom: 20,
              }}
            >
              Pengeluaran &quot;{deleteTarget.notes || deleteTarget.categoryName}&quot; sebesar Rp{" "}
              {deleteTarget.amount.toLocaleString("id-ID")} akan dihapus. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setDeleteTarget(null)}>
                Batal
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  console.log("Delete:", deleteTarget.id);
                  setDeleteTarget(null);
                }}
                style={{ background: "#EF2D56" }}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

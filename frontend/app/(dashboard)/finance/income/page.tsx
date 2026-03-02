"use client";

import { Wallet, TrendingUp, CheckCircle, Lock } from "lucide-react";
import { useAuthStore } from "@/store";
import { useIncomeFilters } from "@/hooks/useFinanceFilters";
import { StatCard } from "@/components/dashboard/StatCard";
import { IncomeChart } from "@/components/finance/IncomeChart";
import { IncomeFilterBar } from "@/components/finance/IncomeFilterBar";
import { IncomeTable } from "@/components/finance/IncomeTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import type { IncomeDailySeries, IncomeTransaction } from "@/types";

const PAGE_SIZE = 20;

// ── Mock Data ──

const MOCK_DAILY_CHART: IncomeDailySeries[] = Array.from({ length: 28 }, (_, i) => ({
  date: `2026-02-${String(i + 1).padStart(2, "0")}`,
  label: `${i + 1}`,
  amount: Math.floor(Math.random() * 600000) + 150000,
}));

const MOCK_TRANSACTIONS: IncomeTransaction[] = [
  { id: "1", orderNumber: "ORD-0201-001", customerName: "Budi Santoso", serviceSummary: "Cuci Setrika (3 kg)", totalAmount: 45000, paymentMethod: "tunai", paidAt: "2026-02-22T10:30:00" },
  { id: "2", orderNumber: "ORD-0201-002", customerName: "Siti Nurhaliza", serviceSummary: "Express Kilat (5 kg)", totalAmount: 125000, paymentMethod: "transfer", paidAt: "2026-02-22T09:15:00" },
  { id: "3", orderNumber: "ORD-0201-003", customerName: "Ahmad Dahlan", serviceSummary: "Cuci Lipat (2 kg)", totalAmount: 24000, paymentMethod: "qris", paidAt: "2026-02-21T16:45:00" },
  { id: "4", orderNumber: "ORD-0201-004", customerName: "Dewi Lestari", serviceSummary: "Setrika Only (4 kg)", totalAmount: 40000, paymentMethod: "tunai", paidAt: "2026-02-21T14:20:00" },
  { id: "5", orderNumber: "ORD-0201-005", customerName: "Rina Marlina", serviceSummary: "Cuci Setrika (7 kg)", totalAmount: 105000, paymentMethod: "transfer", paidAt: "2026-02-21T11:00:00" },
  { id: "6", orderNumber: "ORD-0201-006", customerName: "Joko Widodo", serviceSummary: "Express Kilat (3 kg), Dry Cleaning (2 pcs)", totalAmount: 195000, paymentMethod: "qris", paidAt: "2026-02-20T15:30:00" },
  { id: "7", orderNumber: "ORD-0201-007", customerName: "Mega Wati", serviceSummary: "Cuci Lipat (10 kg)", totalAmount: 120000, paymentMethod: "tunai", paidAt: "2026-02-20T09:00:00" },
  { id: "8", orderNumber: "ORD-0201-008", customerName: "Fahri Rahman", serviceSummary: "Cuci Setrika (4 kg)", totalAmount: 60000, paymentMethod: "transfer", paidAt: "2026-02-19T13:45:00" },
  { id: "9", orderNumber: "ORD-0201-009", customerName: "Anisa Putri", serviceSummary: "Express Kilat (6 kg)", totalAmount: 150000, paymentMethod: "qris", paidAt: "2026-02-19T10:20:00" },
  { id: "10", orderNumber: "ORD-0201-010", customerName: "Hendra Gunawan", serviceSummary: "Cuci Setrika (5 kg)", totalAmount: 75000, paymentMethod: "tunai", paidAt: "2026-02-18T16:00:00" },
];

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function IncomePage() {
  const user = useAuthStore((s) => s.user);
  const { filters, updateFilter, resetFilters } = useIncomeFilters();

  const isOwner = user?.role === "owner";
  const isPro = user?.plan === "pro";

  // Access guard: staff cannot view income
  if (!isOwner) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{
          height: 400,
          background: "#F5F7FA",
          border: "1.5px dashed #C4CDD6",
        }}
      >
        <Lock size={40} color="#8899AA" style={{ marginBottom: 12 }} />
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#5A6B80",
          }}
        >
          Akses Terbatas
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.85rem",
            color: "#8899AA",
            marginTop: 4,
          }}
        >
          Hanya owner yang dapat melihat halaman pemasukan
        </p>
      </div>
    );
  }

  // Filter mock data
  let filtered = [...MOCK_TRANSACTIONS];
  if (filters.paymentMethod) {
    filtered = filtered.filter((t) => t.paymentMethod === filters.paymentMethod);
  }
  if (filters.dateFrom) {
    filtered = filtered.filter((t) => t.paidAt >= filters.dateFrom);
  }
  if (filters.dateTo) {
    filtered = filtered.filter((t) => t.paidAt <= filters.dateTo + "T23:59:59");
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE);
  const totalIncome = MOCK_TRANSACTIONS.reduce((s, t) => s + t.totalAmount, 0);

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: "rgba(0,180,216,0.10)" }}
          >
            <Wallet size={20} color="#00B4D8" />
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
              Pemasukan
            </h1>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.78rem",
                color: "#8899AA",
                margin: 0,
              }}
            >
              Februari 2026
            </p>
          </div>
        </div>

        {/* Export button (Pro only) */}
        <button
          disabled={!isPro}
          style={{
            height: 38,
            padding: "0 16px",
            borderRadius: 10,
            border: isPro ? "none" : "1.5px solid #E8EDF2",
            background: isPro ? "#00B4D8" : "#F5F7FA",
            color: isPro ? "white" : "#8899AA",
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: isPro ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Export
          {!isPro && <Badge variant="pro" />}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Pemasukan Bulan Ini"
          value={formatRupiah(totalIncome)}
          icon={<TrendingUp size={20} />}
          iconColor="#00C853"
          iconBg="rgba(0,200,83,0.10)"
          changePercent={12.5}
          changeLabel="vs bulan lalu"
        />
        <StatCard
          label="Transaksi Lunas"
          value={String(MOCK_TRANSACTIONS.length)}
          icon={<CheckCircle size={20} />}
          iconColor="#00B4D8"
          iconBg="rgba(0,180,216,0.10)"
        />
      </div>

      {/* Chart */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid #E8EDF2",
          boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
        }}
      >
        <IncomeChart data={MOCK_DAILY_CHART} />
      </div>

      {/* Filter Bar */}
      <IncomeFilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Table */}
      <IncomeTable data={paged} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(p) => updateFilter("page", p)}
        />
      )}
    </div>
  );
}

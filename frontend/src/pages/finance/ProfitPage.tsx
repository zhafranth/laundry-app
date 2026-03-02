import { useState, useMemo } from "react";
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Settings2,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProInsightBox } from "@/components/dashboard/ProInsightBox";
import { ProfitChart } from "@/components/finance/ProfitChart";
import { ProfitTable } from "@/components/finance/ProfitTable";
import { CostAllocationModal } from "@/components/finance/CostAllocationModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ProfitByService, CostAllocation, DashboardInsight } from "@/types";

// ── Mock Data ──

const MOCK_PROFIT: ProfitByService[] = [
  { serviceId: "s1", serviceName: "Cuci Setrika", totalOrders: 120, totalRevenue: 1800000, estimatedCost: 720000, profit: 1080000, marginPercent: 60.0 },
  { serviceId: "s2", serviceName: "Express Kilat", totalOrders: 45, totalRevenue: 1125000, estimatedCost: 562500, profit: 562500, marginPercent: 50.0 },
  { serviceId: "s3", serviceName: "Cuci Lipat", totalOrders: 80, totalRevenue: 960000, estimatedCost: 528000, profit: 432000, marginPercent: 45.0 },
  { serviceId: "s4", serviceName: "Setrika Only", totalOrders: 35, totalRevenue: 350000, estimatedCost: 140000, profit: 210000, marginPercent: 60.0 },
  { serviceId: "s5", serviceName: "Dry Cleaning", totalOrders: 12, totalRevenue: 600000, estimatedCost: 480000, profit: 120000, marginPercent: 20.0 },
  { serviceId: "s6", serviceName: "Cuci Sepatu", totalOrders: 8, totalRevenue: 200000, estimatedCost: 170000, profit: 30000, marginPercent: 15.0 },
];

const MOCK_ALLOCATIONS: CostAllocation[] = [
  { serviceId: "s1", serviceName: "Cuci Setrika", allocationPercent: 30 },
  { serviceId: "s2", serviceName: "Express Kilat", allocationPercent: 20 },
  { serviceId: "s3", serviceName: "Cuci Lipat", allocationPercent: 20 },
  { serviceId: "s4", serviceName: "Setrika Only", allocationPercent: 10 },
  { serviceId: "s5", serviceName: "Dry Cleaning", allocationPercent: 15 },
  { serviceId: "s6", serviceName: "Cuci Sepatu", allocationPercent: 5 },
];

const MOCK_INSIGHTS: DashboardInsight[] = [
  { id: "pi-1", text: "Cuci Setrika memiliki margin tertinggi (60%) dengan 120 order. Pertimbangkan untuk meningkatkan kapasitas layanan ini.", type: "success" },
  { id: "pi-2", text: "Cuci Sepatu hanya memiliki margin 15%. Evaluasi biaya bahan atau naikkan harga untuk meningkatkan profitabilitas.", type: "warning" },
  { id: "pi-3", text: "Total revenue bulan ini Rp 5.035.000 dengan rata-rata margin 41.7%. Performa cukup sehat.", type: "info" },
];

type PeriodFilter = "week" | "month" | "custom";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function ProfitPage() {
  const user = useAuthStore((s) => s.user);

  const isOwner = user?.role === "owner";
  const isPro = user?.plan === "pro";

  const [period, setPeriod] = useState<PeriodFilter>("month");
  const [sortBy, setSortBy] = useState("marginPercent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAllocation, setShowAllocation] = useState(false);

  // Access guard: staff cannot view
  if (!isOwner) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{ height: 400, background: "#F5F7FA", border: "1.5px dashed #C4CDD6" }}
      >
        <Lock size={40} color="#8899AA" style={{ marginBottom: 12 }} />
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "1rem", color: "#5A6B80" }}>
          Akses Terbatas
        </p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.85rem", color: "#8899AA", marginTop: 4 }}>
          Hanya owner yang dapat melihat halaman profit
        </p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{
          height: 400,
          background: "linear-gradient(135deg, rgba(255,183,3,0.04) 0%, rgba(0,180,216,0.04) 100%)",
          border: "1.5px dashed rgba(255,183,3,0.35)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{ width: 64, height: 64, background: "rgba(255,183,3,0.10)" }}
        >
          <ArrowUpRight size={28} color="#FFB703" />
        </div>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.1rem", color: "#0B1D35", marginBottom: 6 }}>
          Fitur Pro
        </p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.85rem", color: "#5A6B80", textAlign: "center", maxWidth: 400, marginBottom: 16 }}>
          Profit per Layanan tersedia untuk paket Pro. Upgrade untuk melihat analisis profit, margin, dan rekomendasi otomatis.
        </p>
        <Badge variant="pro" />
      </div>
    );
  }

  // Sort data (period filter will apply when connected to real API)
  const sorted = useMemo(() => {
    const copy = [...MOCK_PROFIT];
    copy.sort((a, b) => {
      const aVal = a[sortBy as keyof ProfitByService] ?? 0;
      const bVal = b[sortBy as keyof ProfitByService] ?? 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return copy;
  }, [sortBy, sortOrder]);

  function handleSort(field: string) {
    if (field === sortBy) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }

  // Summary stats
  const totalRevenue = MOCK_PROFIT.reduce((s, p) => s + p.totalRevenue, 0);
  const totalProfit = MOCK_PROFIT.reduce((s, p) => s + p.profit, 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const bestService = [...MOCK_PROFIT].sort((a, b) => b.marginPercent - a.marginPercent)[0];

  const periodOptions: { value: PeriodFilter; label: string }[] = [
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: "rgba(0,200,83,0.10)" }}
          >
            <TrendingUp size={20} color="#00C853" />
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
              Profit per Layanan
            </h1>
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.78rem", color: "#8899AA", margin: 0 }}>
              Februari 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Filter */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1.5px solid #E8EDF2" }}>
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                style={{
                  height: 36,
                  padding: "0 14px",
                  border: "none",
                  background: period === opt.value ? "#00B4D8" : "white",
                  color: period === opt.value ? "white" : "#5A6B80",
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Cost Allocation Button */}
          <Button variant="ghost" onClick={() => setShowAllocation(true)}>
            <Settings2 size={15} />
            Alokasi Biaya
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Profit Bulan Ini"
          value={formatRupiah(totalProfit)}
          icon={<DollarSign size={20} />}
          iconColor="#00C853"
          iconBg="rgba(0,200,83,0.10)"
          changePercent={8.2}
          changeLabel="vs bulan lalu"
        />
        <StatCard
          label="Rata-rata Margin"
          value={`${avgMargin.toFixed(1)}%`}
          icon={<BarChart3 size={20} />}
          iconColor="#00B4D8"
          iconBg="rgba(0,180,216,0.10)"
        />
        <StatCard
          label="Layanan Terbaik"
          value={bestService?.serviceName ?? "-"}
          icon={<TrendingUp size={20} />}
          iconColor="#FFB703"
          iconBg="rgba(255,183,3,0.10)"
          subLabel={bestService ? `margin ${bestService.marginPercent.toFixed(1)}%` : ""}
        />
      </div>

      {/* Insight Box */}
      <ProInsightBox insights={MOCK_INSIGHTS} />

      {/* Chart */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid #E8EDF2",
          boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
        }}
      >
        <ProfitChart data={sorted} />
      </div>

      {/* Table */}
      <ProfitTable
        data={sorted}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Cost Allocation Modal */}
      {showAllocation && (
        <CostAllocationModal
          allocations={MOCK_ALLOCATIONS}
          onSubmit={(updated) => {
            console.log("Updated allocations:", updated);
            setShowAllocation(false);
          }}
          onClose={() => setShowAllocation(false)}
          isPending={false}
        />
      )}
    </div>
  );
}

"use client";

import { TrendingDown, Scale, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import type { ExpenseSummary } from "@/types";

interface ExpenseSummaryCardsProps {
  summary: ExpenseSummary;
  isPro: boolean;
  isLoading?: boolean;
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function ExpenseSummaryCards({ summary, isPro, isLoading }: ExpenseSummaryCardsProps) {
  return (
    <div className={`grid gap-4 ${isPro ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      <StatCard
        label="Total Pengeluaran Bulan Ini"
        value={formatRupiah(summary.totalExpenses)}
        icon={<TrendingDown size={20} />}
        iconColor="#EF2D56"
        iconBg="rgba(239,45,86,0.10)"
        changePercent={summary.totalExpensesChangePercent}
        changeLabel="vs bulan lalu"
        isLoading={isLoading}
      />

      {isPro && (
        <StatCard
          label="Biaya per Kg"
          value={summary.costPerKg != null ? formatRupiah(summary.costPerKg) + "/kg" : "\u2014"}
          icon={<Scale size={20} />}
          iconColor="#7C4DFF"
          iconBg="rgba(124,77,255,0.10)"
          isLoading={isLoading}
        />
      )}

      <StatCard
        label="Kategori Tertinggi"
        value={summary.highestCategory}
        icon={<BarChart3 size={20} />}
        iconColor="#FFB703"
        iconBg="rgba(255,183,3,0.10)"
        subLabel={formatRupiah(summary.highestCategoryAmount)}
        isLoading={isLoading}
      />
    </div>
  );
}

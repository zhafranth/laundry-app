"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";
import type { IncomeDailySeries } from "@/types";

interface IncomeChartProps {
  data: IncomeDailySeries[];
  isLoading?: boolean;
}

function formatRupiah(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2"
      style={{
        background: "#0B1D35",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      <p
        style={{
          fontFamily: "Nunito Sans, system-ui",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.55)",
          marginBottom: 2,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#00B4D8",
        }}
      >
        Rp {payload[0].value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

export function IncomeChart({ data, isLoading }: IncomeChartProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton style={{ width: 140, height: 18 }} />
        <Skeleton style={{ width: "100%", height: 220 }} />
      </div>
    );
  }

  const isEmpty = !data || data.length === 0;

  return (
    <div>
      <p
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#0B1D35",
          marginBottom: 16,
        }}
      >
        Pendapatan Harian
      </p>

      {isEmpty ? (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: 220, background: "#F5F7FA", border: "1px dashed #C4CDD6" }}
        >
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.8rem",
              color: "#8899AA",
            }}
          >
            Belum ada data pendapatan
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF2" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{
                fontSize: 11,
                fill: "#8899AA",
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: "#8899AA",
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatRupiah}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amount"
              fill="#00B4D8"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

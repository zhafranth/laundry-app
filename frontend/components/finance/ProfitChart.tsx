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
import type { ProfitByService } from "@/types";

interface ProfitChartProps {
  data: ProfitByService[];
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
  payload?: { name: string; value: number; color: string }[];
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
      <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
            fontSize: "0.75rem",
            color: entry.color,
            margin: "2px 0",
          }}
        >
          {entry.name}: Rp {entry.value.toLocaleString("id-ID")}
        </p>
      ))}
    </div>
  );
}

export function ProfitChart({ data, isLoading }: ProfitChartProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton style={{ width: 220, height: 18 }} />
        <Skeleton style={{ width: "100%", height: 260 }} />
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
        Pendapatan vs Biaya per Layanan
      </p>

      {isEmpty ? (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: 260, background: "#F5F7FA", border: "1px dashed #C4CDD6" }}
        >
          <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA" }}>
            Belum ada data
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF2" vertical={false} />
              <XAxis
                dataKey="serviceName"
                tick={{ fontSize: 11, fill: "#8899AA", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8899AA", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatRupiah}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalRevenue" name="Pendapatan" fill="#00B4D8" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="estimatedCost" name="Biaya" fill="#EF2D56" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 px-2">
            <div className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#00B4D8" }} />
              <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.72rem", fontWeight: 600, color: "#5A6B80" }}>
                Pendapatan
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#EF2D56" }} />
              <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.72rem", fontWeight: 600, color: "#5A6B80" }}>
                Biaya
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

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
import type { ExpenseTrendSeries } from "@/types";

interface ExpenseTrendChartProps {
  data: ExpenseTrendSeries[];
  isPro: boolean;
  isLoading?: boolean;
}

function formatRupiah(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

const CATEGORY_STACK = [
  { key: "bahan_baku", name: "Bahan Baku", color: "#00B4D8" },
  { key: "operasional", name: "Operasional", color: "#FFB703" },
  { key: "gaji", name: "Gaji", color: "#7C4DFF" },
  { key: "marketing", name: "Marketing", color: "#00C853" },
  { key: "lain_lain", name: "Lain-lain", color: "#8899AA" },
];

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
      <p
        style={{
          fontFamily: "Nunito Sans, system-ui",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.55)",
          marginBottom: 4,
        }}
      >
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

export function ExpenseTrendChart({ data, isPro, isLoading }: ExpenseTrendChartProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton style={{ width: 180, height: 18 }} />
        <Skeleton style={{ width: "100%", height: 240 }} />
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
        Tren Pengeluaran 6 Bulan
      </p>

      {isEmpty ? (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: 240, background: "#F5F7FA", border: "1px dashed #C4CDD6" }}
        >
          <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA" }}>
            Belum ada data tren
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF2" vertical={false} />
              <XAxis
                dataKey="label"
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
              {isPro ? (
                CATEGORY_STACK.map((cat) => (
                  <Bar
                    key={cat.key}
                    dataKey={cat.key}
                    name={cat.name}
                    stackId="expenses"
                    fill={cat.color}
                    radius={cat.key === "lain_lain" ? [4, 4, 0, 0] : undefined}
                    maxBarSize={40}
                  />
                ))
              ) : (
                <Bar dataKey="total" name="Total" fill="#00B4D8" radius={[4, 4, 0, 0]} maxBarSize={40} />
              )}
            </BarChart>
          </ResponsiveContainer>

          {/* Legend for Pro */}
          {isPro && (
            <div className="flex flex-wrap items-center gap-4 mt-3 px-2">
              {CATEGORY_STACK.map((cat) => (
                <div key={cat.key} className="flex items-center gap-1.5">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                  <span
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#5A6B80",
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

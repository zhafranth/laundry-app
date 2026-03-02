"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProfitByService } from "@/types";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

interface ProfitTableProps {
  data: ProfitByService[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const thStyle: React.CSSProperties = {
  fontFamily: "Manrope, system-ui",
  fontWeight: 700,
  fontSize: "0.7rem",
  color: "#8899AA",
  letterSpacing: "0.05em",
  textTransform: "uppercase" as const,
  padding: "10px 14px",
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
  cursor: "pointer",
  userSelect: "none" as const,
};

const tdStyle: React.CSSProperties = {
  fontFamily: "Nunito Sans, system-ui",
  fontSize: "0.8125rem",
  color: "#1A2D45",
  padding: "12px 14px",
  verticalAlign: "middle" as const,
};

function SortIcon({ field, sortBy, sortOrder }: { field: string; sortBy: string; sortOrder: string }) {
  if (field !== sortBy) return <ChevronDown size={12} style={{ opacity: 0.3, marginLeft: 2 }} />;
  return sortOrder === "asc" ? (
    <ChevronUp size={12} style={{ opacity: 0.8, marginLeft: 2 }} />
  ) : (
    <ChevronDown size={12} style={{ opacity: 0.8, marginLeft: 2 }} />
  );
}

function getMarginStyle(margin: number): { color: string; bg: string } {
  if (margin >= 50) return { color: "#00C853", bg: "rgba(0,200,83,0.10)" };
  if (margin >= 20) return { color: "#FFB703", bg: "rgba(255,183,3,0.10)" };
  return { color: "#EF2D56", bg: "rgba(239,45,86,0.10)" };
}

export function ProfitTable({ data, isLoading, sortBy, sortOrder, onSort }: ProfitTableProps) {
  const rows = isLoading ? Array.from({ length: 5 }) : data;

  if (!isLoading && data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{ height: 220, background: "#F5F7FA", border: "1.5px dashed #C4CDD6" }}
      >
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.9rem", color: "#5A6B80" }}>
          Belum ada data profit
        </p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", marginTop: 4 }}>
          Data profit akan tersedia setelah ada order dan alokasi biaya
        </p>
      </div>
    );
  }

  const columns = [
    { key: "serviceName", label: "Layanan" },
    { key: "totalOrders", label: "Total Order" },
    { key: "totalRevenue", label: "Pendapatan" },
    { key: "estimatedCost", label: "Est. Biaya" },
    { key: "profit", label: "Profit" },
    { key: "marginPercent", label: "Margin" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #E8EDF2", background: "white" }}>
      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #E8EDF2", background: "#F5F7FA" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  style={{
                    ...thStyle,
                    textAlign: ["totalRevenue", "estimatedCost", "profit", "marginPercent"].includes(col.key)
                      ? ("right" as const)
                      : ("left" as const),
                  }}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    <SortIcon field={col.key} sortBy={sortBy} sortOrder={sortOrder} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (isLoading || !row) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #F0F3F7" }}>
                    {columns.map((_, j) => (
                      <td key={j} style={tdStyle}>
                        <Skeleton style={{ height: 14, width: j === 0 ? 120 : 70 }} />
                      </td>
                    ))}
                  </tr>
                );
              }

              const p = row as ProfitByService;
              const margin = getMarginStyle(p.marginPercent);

              return (
                <tr
                  key={p.serviceId}
                  style={{
                    borderBottom: "1px solid #F0F3F7",
                    borderLeft: p.marginPercent < 20 ? "3px solid #EF2D56" : "3px solid transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#F5F7FA")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "white")}
                >
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{p.serviceName}</td>
                  <td style={tdStyle}>{p.totalOrders}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{formatRupiah(p.totalRevenue)}</td>
                  <td style={{ ...tdStyle, textAlign: "right", color: "#5A6B80" }}>{formatRupiah(p.estimatedCost)}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{formatRupiah(p.profit)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <span
                      className="inline-flex items-center rounded-md px-2 py-0.5"
                      style={{
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: margin.color,
                        background: margin.bg,
                      }}
                    >
                      {p.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

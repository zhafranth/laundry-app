"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Expense, ExpenseCategorySlug } from "@/types";

const CATEGORY_COLORS: Record<ExpenseCategorySlug, string> = {
  bahan_baku: "#00B4D8",
  operasional: "#FFB703",
  gaji: "#7C4DFF",
  marketing: "#00C853",
  lain_lain: "#8899AA",
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ExpenseTableProps {
  data: Expense[];
  isLoading?: boolean;
  isOwner: boolean;
  isPro?: boolean;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
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
};

const tdStyle: React.CSSProperties = {
  fontFamily: "Nunito Sans, system-ui",
  fontSize: "0.8125rem",
  color: "#1A2D45",
  padding: "12px 14px",
  verticalAlign: "middle" as const,
};

export function ExpenseTable({
  data,
  isLoading,
  isOwner,
  isPro,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const rows = isLoading ? Array.from({ length: 8 }) : data;
  const hasSubcategories = isPro && data.some((e) => e.subcategoryName);

  if (!isLoading && data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{
          height: 220,
          background: "#F5F7FA",
          border: "1.5px dashed #C4CDD6",
        }}
      >
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#5A6B80",
          }}
        >
          Belum ada pengeluaran tercatat
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8rem",
            color: "#8899AA",
            marginTop: 4,
          }}
        >
          Klik &quot;Catat Pengeluaran&quot; untuk menambahkan
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #E8EDF2", background: "white" }}
    >
      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #E8EDF2", background: "#F5F7FA" }}>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Kategori</th>
              {hasSubcategories && <th style={thStyle}>Sub-kategori</th>}
              <th style={{ ...thStyle, textAlign: "right" }}>Jumlah</th>
              <th style={thStyle}>Catatan</th>
              <th style={thStyle}>Dicatat oleh</th>
              {isOwner && <th style={{ ...thStyle, textAlign: "center" }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((expense, i) => {
              if (isLoading || !expense) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #F0F3F7" }}>
                    {Array.from({ length: 5 + (hasSubcategories ? 1 : 0) + (isOwner ? 1 : 0) }).map((_, j) => (
                      <td key={j} style={tdStyle}>
                        <Skeleton style={{ height: 14, width: j === 4 ? 120 : 70 }} />
                      </td>
                    ))}
                  </tr>
                );
              }

              const e = expense as Expense;
              const catSlug = (e.categoryName?.toLowerCase().replace(/[\s-]+/g, "_") || "lain_lain") as ExpenseCategorySlug;
              const dotColor = CATEGORY_COLORS[catSlug] || "#8899AA";

              return (
                <tr
                  key={e.id}
                  style={{
                    borderBottom: "1px solid #F0F3F7",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(ev) =>
                    ((ev.currentTarget as HTMLTableRowElement).style.background = "#F5F7FA")
                  }
                  onMouseLeave={(ev) =>
                    ((ev.currentTarget as HTMLTableRowElement).style.background = "white")
                  }
                >
                  <td style={{ ...tdStyle, fontSize: "0.78rem", color: "#5A6B80" }}>
                    {formatDate(e.expenseDate)}
                  </td>
                  <td style={tdStyle}>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontWeight: 600 }}>{e.categoryName}</span>
                    </div>
                  </td>
                  {hasSubcategories && (
                    <td style={{ ...tdStyle, fontSize: "0.78rem", color: "#5A6B80" }}>
                      {e.subcategoryName || "\u2014"}
                    </td>
                  )}
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>
                    {formatRupiah(e.amount)}
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 160 }}>
                    <p
                      style={{
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 160,
                        fontSize: "0.78rem",
                        color: "#5A6B80",
                      }}
                      title={e.notes || ""}
                    >
                      {e.notes || "\u2014"}
                    </p>
                  </td>
                  <td style={{ ...tdStyle, fontSize: "0.78rem", color: "#5A6B80" }}>
                    {e.createdByName}
                  </td>
                  {isOwner && (
                    <td
                      style={{ ...tdStyle, textAlign: "center" }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {onEdit && (
                          <button
                            title="Edit"
                            onClick={() => onEdit(e)}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "none",
                              background: "rgba(0,180,216,0.08)",
                              color: "#00B4D8",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            title="Hapus"
                            onClick={() => onDelete(e)}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "none",
                              background: "rgba(239,45,86,0.08)",
                              color: "#EF2D56",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

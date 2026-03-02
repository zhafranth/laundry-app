"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import type { IncomeTransaction, PaymentMethod } from "@/types";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  tunai: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
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

interface IncomeTableProps {
  data: IncomeTransaction[];
  isLoading?: boolean;
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

export function IncomeTable({ data, isLoading }: IncomeTableProps) {
  const rows = isLoading ? Array.from({ length: 8 }) : data;

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
          Belum ada transaksi pemasukan
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8rem",
            color: "#8899AA",
            marginTop: 4,
          }}
        >
          Transaksi akan muncul saat order berstatus lunas
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
              <th style={thStyle}>No. Order</th>
              <th style={thStyle}>Pelanggan</th>
              <th style={thStyle}>Layanan</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Jumlah</th>
              <th style={thStyle}>Metode</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx, i) => {
              if (isLoading || !tx) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #F0F3F7" }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={tdStyle}>
                        <Skeleton style={{ height: 14, width: j === 2 ? 120 : 70 }} />
                      </td>
                    ))}
                  </tr>
                );
              }

              const t = tx as IncomeTransaction;

              return (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: "1px solid #F0F3F7",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background = "#F5F7FA")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background = "white")
                  }
                >
                  <td style={{ ...tdStyle, fontSize: "0.78rem", color: "#5A6B80" }}>
                    {formatDate(t.paidAt)}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                        color: "#00B4D8",
                      }}
                    >
                      {t.orderNumber}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{t.customerName}</td>
                  <td style={{ ...tdStyle, maxWidth: 180 }}>
                    <p
                      style={{
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 180,
                        fontSize: "0.78rem",
                        color: "#5A6B80",
                      }}
                      title={t.serviceSummary}
                    >
                      {t.serviceSummary}
                    </p>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>
                    {formatRupiah(t.totalAmount)}
                  </td>
                  <td style={tdStyle}>
                    <span
                      className="inline-flex items-center rounded-md px-2 py-0.5"
                      style={{
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        color: "#00B4D8",
                        background: "rgba(0,180,216,0.08)",
                      }}
                    >
                      {PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod}
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

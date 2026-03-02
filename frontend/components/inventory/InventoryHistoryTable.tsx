import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import type { InventoryLog } from "@/types";

interface Props {
  logs: InventoryLog[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TH_STYLE: React.CSSProperties = {
  padding: "10px 14px",
  textAlign: "left",
  fontFamily: "Manrope, system-ui",
  fontWeight: 700,
  fontSize: "0.72rem",
  color: "#8899AA",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  background: "#F5F7FA",
};

const TD_STYLE: React.CSSProperties = {
  padding: "12px 14px",
  fontFamily: "Nunito Sans, system-ui",
  fontSize: "0.8125rem",
  color: "#0B1D35",
  verticalAlign: "middle",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function InventoryHistoryTable({ logs, isLoading, page, totalPages, onPageChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #E8EDF2", background: "white", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #E8EDF2" }}>
                <th style={TH_STYLE}>Tanggal</th>
                <th style={TH_STYLE}>Tipe</th>
                <th style={{ ...TH_STYLE, textAlign: "right" }}>Qty</th>
                <th style={{ ...TH_STYLE, textAlign: "right" }}>Harga Satuan</th>
                <th style={TH_STYLE}>Supplier</th>
                <th style={TH_STYLE}>Catatan</th>
                <th style={TH_STYLE}>Oleh</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F0F3F7" }}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} style={TD_STYLE}>
                          <Skeleton style={{ height: 16, borderRadius: 6, width: "75%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : logs.length === 0
                ? (
                  <tr>
                    <td colSpan={7} style={{ ...TD_STYLE, textAlign: "center", padding: "48px 0", color: "#8899AA" }}>
                      <ArrowUpCircle size={32} style={{ margin: "0 auto 8px", opacity: 0.3, display: "block" }} />
                      <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 600 }}>Belum ada riwayat pergerakan</span>
                    </td>
                  </tr>
                )
                : logs.map((log, idx) => {
                    const isMasuk = log.type === "masuk";
                    const isLast = idx === logs.length - 1;
                    return (
                      <tr
                        key={log.id}
                        style={{ borderBottom: isLast ? "none" : "1px solid #F0F3F7", transition: "background 0.12s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#FAFBFC")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                      >
                        {/* Tanggal */}
                        <td style={{ ...TD_STYLE, color: "#5A6B80" }}>
                          {formatDate(log.logDate)}
                        </td>

                        {/* Tipe */}
                        <td style={TD_STYLE}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 10px",
                              borderRadius: 999,
                              background: isMasuk ? "rgba(34,197,94,0.10)" : "rgba(124,58,237,0.10)",
                              fontFamily: "Manrope, system-ui",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              color: isMasuk ? "#16A34A" : "#7C3AED",
                            }}
                          >
                            {isMasuk ? (
                              <ArrowUpCircle size={12} />
                            ) : (
                              <ArrowDownCircle size={12} />
                            )}
                            {isMasuk ? "Masuk" : "Keluar"}
                          </span>
                        </td>

                        {/* Qty */}
                        <td style={{ ...TD_STYLE, textAlign: "right", fontWeight: 700 }}>
                          <span style={{ color: isMasuk ? "#16A34A" : "#7C3AED" }}>
                            {isMasuk ? "+" : "−"}{log.qty.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* Harga Satuan */}
                        <td style={{ ...TD_STYLE, textAlign: "right" }}>
                          {log.unitCost != null ? (
                            <span style={{ color: "#5A6B80" }}>{formatRupiah(log.unitCost)}</span>
                          ) : (
                            <span style={{ color: "#C4CDD6" }}>—</span>
                          )}
                        </td>

                        {/* Supplier */}
                        <td style={{ ...TD_STYLE, color: "#5A6B80" }}>
                          {log.supplier ?? <span style={{ color: "#C4CDD6" }}>—</span>}
                        </td>

                        {/* Catatan */}
                        <td style={{ ...TD_STYLE, color: "#5A6B80", maxWidth: 200 }}>
                          {log.notes ? (
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                              {log.notes}
                            </span>
                          ) : (
                            <span style={{ color: "#C4CDD6" }}>—</span>
                          )}
                        </td>

                        {/* Oleh */}
                        <td style={{ ...TD_STYLE, color: "#8899AA" }}>
                          {log.createdByName}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

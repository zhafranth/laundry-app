import { History, Pencil, Plus, Trash2, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { InventoryStatusBadge, getInventoryStatus } from "./InventoryStatusBadge";
import type { InventoryItem } from "@/types";

interface Props {
  items: InventoryItem[];
  isLoading: boolean;
  isOwner: boolean;
  onRestock: (item: InventoryItem) => void;
  onUsage: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onHistory: (item: InventoryItem) => void;
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

function ActionBtn({
  onClick,
  title,
  color,
  bg,
  children,
}: {
  onClick: () => void;
  title: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: "none",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.75")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
    >
      {children}
    </button>
  );
}

export function InventoryTable({
  items,
  isLoading,
  isOwner,
  onRestock,
  onUsage,
  onEdit,
  onDelete,
  onHistory,
}: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #E8EDF2", background: "white", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #E8EDF2" }}>
              <th style={TH_STYLE}>Nama Item</th>
              <th style={TH_STYLE}>Kategori</th>
              <th style={{ ...TH_STYLE, textAlign: "right" }}>Stok Saat Ini</th>
              <th style={{ ...TH_STYLE, textAlign: "right" }}>Min. Stok</th>
              <th style={TH_STYLE}>Status</th>
              <th style={TH_STYLE}>Prediksi Habis</th>
              <th style={{ ...TH_STYLE, textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F0F3F7" }}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} style={TD_STYLE}>
                        <Skeleton style={{ height: 18, borderRadius: 6, width: j === 6 ? 96 : "80%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              : items.length === 0
              ? (
                <tr>
                  <td colSpan={7} style={{ ...TD_STYLE, textAlign: "center", padding: "48px 0", color: "#8899AA" }}>
                    <TrendingDown size={32} style={{ margin: "0 auto 8px", opacity: 0.4, display: "block" }} />
                    <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 600 }}>Belum ada item inventory</span>
                  </td>
                </tr>
              )
              : items.map((item, idx) => {
                  const status = getInventoryStatus(item);
                  const isLast = idx === items.length - 1;
                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: isLast ? "none" : "1px solid #F0F3F7", transition: "background 0.12s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#FAFBFC")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                    >
                      {/* Nama */}
                      <td style={TD_STYLE}>
                        <span style={{ fontWeight: 700, color: "#0B1D35" }}>{item.name}</span>
                      </td>

                      {/* Kategori */}
                      <td style={TD_STYLE}>
                        <span
                          style={{
                            background: "#F0F3F7",
                            color: "#5A6B80",
                            fontFamily: "Manrope, system-ui",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            padding: "2px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* Stok Saat Ini */}
                      <td style={{ ...TD_STYLE, textAlign: "right" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: status === "kritis" ? "#DC2626" : status === "perhatian" ? "#B45309" : "#16A34A",
                          }}
                        >
                          {item.currentStock.toLocaleString("id-ID")}
                        </span>
                        <span style={{ color: "#8899AA", marginLeft: 4, fontSize: "0.75rem" }}>{item.unit}</span>
                      </td>

                      {/* Min Stok */}
                      <td style={{ ...TD_STYLE, textAlign: "right", color: "#5A6B80" }}>
                        {item.minimumStock.toLocaleString("id-ID")}
                        <span style={{ color: "#8899AA", marginLeft: 4, fontSize: "0.75rem" }}>{item.unit}</span>
                      </td>

                      {/* Status */}
                      <td style={TD_STYLE}>
                        <InventoryStatusBadge status={status} />
                      </td>

                      {/* Prediksi Habis */}
                      <td style={TD_STYLE}>
                        {item.estimatedDaysLeft != null ? (
                          <span
                            style={{
                              fontFamily: "Manrope, system-ui",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              color: item.estimatedDaysLeft <= 3 ? "#DC2626" : item.estimatedDaysLeft <= 7 ? "#B45309" : "#16A34A",
                            }}
                          >
                            ~{item.estimatedDaysLeft} hari
                          </span>
                        ) : (
                          <span style={{ color: "#C4CDD6", fontSize: "0.78rem" }}>—</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td style={{ ...TD_STYLE, textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                          {isOwner && (
                            <ActionBtn
                              onClick={() => onRestock(item)}
                              title="Restock"
                              color="#0077B6"
                              bg="rgba(0,180,216,0.10)"
                            >
                              <Plus size={14} />
                            </ActionBtn>
                          )}
                          <ActionBtn
                            onClick={() => onUsage(item)}
                            title="Catat Pemakaian"
                            color="#7C3AED"
                            bg="rgba(124,58,237,0.10)"
                          >
                            <TrendingDown size={14} />
                          </ActionBtn>
                          <ActionBtn
                            onClick={() => onHistory(item)}
                            title="Riwayat"
                            color="#5A6B80"
                            bg="#F0F3F7"
                          >
                            <History size={14} />
                          </ActionBtn>
                          {isOwner && (
                            <>
                              <ActionBtn
                                onClick={() => onEdit(item)}
                                title="Edit"
                                color="#FFB703"
                                bg="rgba(255,183,3,0.10)"
                              >
                                <Pencil size={14} />
                              </ActionBtn>
                              <ActionBtn
                                onClick={() => onDelete(item)}
                                title="Hapus"
                                color="#EF4444"
                                bg="rgba(239,68,68,0.10)"
                              >
                                <Trash2 size={14} />
                              </ActionBtn>
                            </>
                          )}
                        </div>
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

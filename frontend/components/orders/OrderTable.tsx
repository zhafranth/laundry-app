import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import type { Order, OrderPaymentStatus } from "@/types";

const PAYMENT_LABELS: Record<OrderPaymentStatus, { label: string; color: string }> = {
  belum_bayar: { label: "Belum Bayar", color: "#EF2D56" },
  dp: { label: "DP", color: "#FFB703" },
  lunas: { label: "Lunas", color: "#00C853" },
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

function formatDateShort(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onDelete?: (order: Order) => void;
  onMarkPaid?: (order: Order) => void;
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

export function OrderTable({
  orders,
  isLoading,
  onDelete,
  onMarkPaid,
}: OrderTableProps) {
  const navigate = useNavigate();

  const rows = isLoading ? Array.from({ length: 8 }) : orders;

  if (!isLoading && orders.length === 0) {
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
          Tidak ada order ditemukan
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8rem",
            color: "#8899AA",
            marginTop: 4,
          }}
        >
          Coba ubah filter atau buat order baru
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
              <th style={thStyle}>No. Order</th>
              <th style={thStyle}>Pelanggan</th>
              <th style={thStyle}>Layanan</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Pembayaran</th>
              <th style={thStyle}>Tgl Masuk</th>
              <th style={thStyle}>Est. Selesai</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order, i) => {
              if (isLoading || !order) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #F0F3F7" }}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} style={tdStyle}>
                        <Skeleton style={{ height: 14, width: j === 1 ? 120 : 70 }} />
                      </td>
                    ))}
                  </tr>
                );
              }

              const o = order as Order;
              const payment = PAYMENT_LABELS[o.paymentStatus] ?? PAYMENT_LABELS.belum_bayar;
              const servicesSummary = o.items
                .map((it) => `${it.serviceName} (${it.qty} ${it.unit})`)
                .join(", ");

              return (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.id}`)}
                  style={{
                    borderBottom: "1px solid #F0F3F7",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "#F5F7FA")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "white")
                  }
                >
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                        color: "#00B4D8",
                      }}
                    >
                      {o.orderNumber}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <p style={{ fontWeight: 700, margin: 0 }}>{o.customer.name}</p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#8899AA",
                        margin: 0,
                      }}
                    >
                      {o.customer.phone}
                    </p>
                  </td>
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
                      title={servicesSummary}
                    >
                      {servicesSummary}
                    </p>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>
                    {formatRupiah(o.totalAmount)}
                  </td>
                  <td style={tdStyle}>
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: payment.color,
                      }}
                    >
                      {payment.label}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: "0.78rem", color: "#5A6B80" }}>
                    {formatDate(o.createdAt)}
                  </td>
                  <td style={{ ...tdStyle, fontSize: "0.78rem", color: "#5A6B80" }}>
                    {formatDateShort(o.estimatedFinishedAt)}
                  </td>
                  <td
                    style={{ ...tdStyle, textAlign: "center" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <button
                        title="Lihat detail"
                        onClick={() => navigate(`/orders/${o.id}`)}
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
                        <Eye size={14} />
                      </button>

                      {o.paymentStatus !== "lunas" &&
                        o.status !== "selesai" &&
                        o.status !== "dibatalkan" &&
                        onMarkPaid && (
                          <button
                            title="Tandai lunas"
                            onClick={() => onMarkPaid(o)}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "none",
                              background: "rgba(0,200,83,0.08)",
                              color: "#00C853",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                      {o.status !== "selesai" && o.status !== "dibatalkan" && onDelete && (
                        <button
                          title="Hapus"
                          onClick={() => onDelete(o)}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

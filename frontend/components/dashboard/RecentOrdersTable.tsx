import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DashboardRecentOrder, OrderStatus } from "@/types";

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; color: "success" | "warning" | "error" | "info" | "neutral" }
> = {
  masuk: { label: "Masuk", color: "neutral" },
  proses: { label: "Proses", color: "info" },
  siap_diambil: { label: "Siap Diambil", color: "warning" },
  selesai: { label: "Selesai", color: "success" },
  dibatalkan: { label: "Dibatalkan", color: "error" },
  overdue: { label: "Overdue", color: "error" },
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

interface RecentOrdersTableProps {
  orders: DashboardRecentOrder[];
  isLoading?: boolean;
}

export function RecentOrdersTable({ orders, isLoading }: RecentOrdersTableProps) {
  const navigate = useNavigate();

  function handleRowClick(orderId: string) {
    navigate(`/orders/${orderId}`);
  }

  const rows = isLoading ? Array.from({ length: 5 }) : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#0B1D35",
          }}
        >
          Order Terbaru
        </p>
        {!isLoading && orders.length > 0 && (
          <button
            onClick={() => navigate("/orders")}
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "#00B4D8",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Lihat semua →
          </button>
        )}
      </div>

      {!isLoading && orders.length === 0 ? (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: 140, background: "#F5F7FA", border: "1px dashed #C4CDD6" }}
        >
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.8rem",
              color: "#8899AA",
            }}
          >
            Belum ada order
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((order, i) => {
            if (isLoading || !order) {
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-3"
                  style={{ background: "#F5F7FA" }}
                >
                  <Skeleton style={{ width: 56, height: 14 }} />
                  <Skeleton style={{ flex: 1, height: 14 }} />
                  <Skeleton style={{ width: 60, height: 22 }} />
                  <Skeleton style={{ width: 72, height: 14 }} />
                </div>
              );
            }

            const o = order as DashboardRecentOrder;
            const statusInfo = STATUS_MAP[o.status] ?? STATUS_MAP.masuk;

            return (
              <button
                key={o.id}
                onClick={() => handleRowClick(o.id)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors w-full"
                style={{
                  background: "#F5F7FA",
                  border: "1px solid transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#EEF3F8";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8EDF2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#F5F7FA";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                }}
              >
                {/* Order number */}
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#00B4D8",
                    minWidth: 64,
                    flexShrink: 0,
                  }}
                >
                  {o.orderNumber}
                </span>

                {/* Customer + service */}
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate"
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      color: "#1A2D45",
                    }}
                  >
                    {o.customerName}
                  </p>
                  <p
                    className="truncate"
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.7rem",
                      color: "#8899AA",
                    }}
                  >
                    {o.services}
                  </p>
                </div>

                {/* Status badge */}
                <Badge variant="status" color={statusInfo.color}>
                  {statusInfo.label}
                </Badge>

                {/* Amount */}
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#0B1D35",
                    flexShrink: 0,
                  }}
                >
                  {formatRupiah(o.totalAmount)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

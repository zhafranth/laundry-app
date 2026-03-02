import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  X,
  Trash2,
} from "lucide-react";

import { useAuthStore } from "@/store";
import { orderService } from "@/services/order";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import type { Order, OrderStatus, PaymentMethod } from "@/types";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  tunai: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

const PAYMENT_STATUS_CONFIG = {
  belum_bayar: { label: "Belum Bayar", color: "#EF2D56" },
  dp: { label: "DP", color: "#FFB703" },
  lunas: { label: "Lunas", color: "#00C853" },
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  masuk: "proses",
  proses: "siap_diambil",
  siap_diambil: "selesai",
  selesai: null,
  dibatalkan: null,
  overdue: "siap_diambil",
};

const NEXT_STATUS_LABEL: Record<OrderStatus, string> = {
  masuk: "Mulai Proses",
  proses: "Tandai Siap Diambil",
  siap_diambil: "Selesai",
  selesai: "",
  dibatalkan: "",
  overdue: "Tandai Siap Diambil",
};

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#8899AA", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 700, fontSize: "0.8125rem", color: valueColor ?? "#0B1D35", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

function MarkPaidModal({ order, onConfirm, onClose, isPending }: { order: Order; onConfirm: (method: PaymentMethod) => void; onClose: () => void; isPending: boolean }) {
  const [method, setMethod] = useState<PaymentMethod>("tunai");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,29,53,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl p-6" style={{ background: "white", width: "100%", maxWidth: 400, boxShadow: "0 16px 48px rgba(11,29,53,0.18)" }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", marginBottom: 4 }}>Tandai Lunas</p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80", marginBottom: 20 }}>Sisa bayar: {formatRupiah(order.remainingAmount)}</p>
        <div className="flex flex-col gap-3 mb-5">
          <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068" }}>Metode Pembayaran</label>
          <div className="flex gap-2">
            {(["tunai", "transfer", "qris"] as PaymentMethod[]).map((m) => (
              <button key={m} type="button" onClick={() => setMethod(m)} style={{ flex: 1, height: 40, borderRadius: 10, border: `2px solid ${method === m ? "#00B4D8" : "#E8EDF2"}`, background: method === m ? "rgba(0,180,216,0.06)" : "white", color: method === m ? "#00B4D8" : "#5A6B80", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Batal</Button>
          <Button variant="primary" fullWidth loading={isPending} onClick={() => onConfirm(method)}>Konfirmasi Lunas</Button>
        </div>
      </div>
    </div>
  );
}

function CancelModal({ order, onConfirm, onClose, isPending }: { order: Order; onConfirm: (note?: string) => void; onClose: () => void; isPending: boolean }) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,29,53,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl p-6" style={{ background: "white", width: "100%", maxWidth: 400, boxShadow: "0 16px 48px rgba(11,29,53,0.18)" }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", marginBottom: 4 }}>Batalkan Order?</p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80", marginBottom: 16 }}>{order.orderNumber} · {order.customer.name}</p>
        <div className="flex flex-col gap-1.5 mb-5">
          <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068" }}>Alasan (opsional)</label>
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: pelanggan cancel, barang tidak jadi..." style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8EDF2", fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#0B1D35", outline: "none", resize: "none" }} />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Tidak</Button>
          <Button variant="danger" fullWidth loading={isPending} onClick={() => onConfirm(note || undefined)}>Batalkan Order</Button>
        </div>
      </div>
    </div>
  );
}

export function OrderDetailPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const [showMarkPaid, setShowMarkPaid] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders.detail(activeOutletId ?? "", orderId ?? ""),
    queryFn: () => orderService.getDetail(activeOutletId!, orderId!),
    enabled: !!activeOutletId && !!orderId,
  });

  const order = data?.data;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(activeOutletId ?? "", orderId ?? "") });
  };

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: ({ status, note }: { status: OrderStatus; note?: string }) =>
      orderService.updateStatus(activeOutletId!, orderId!, status, note),
    onSuccess: invalidate,
  });

  const { mutate: markPaid, isPending: isMarkingPaid } = useMutation({
    mutationFn: (method: PaymentMethod) =>
      orderService.markPaid(activeOutletId!, orderId!, order?.remainingAmount ?? 0, method),
    onSuccess: () => { invalidate(); setShowMarkPaid(false); },
  });

  const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
    mutationFn: () => orderService.delete(activeOutletId!, orderId!),
    onSuccess: () => { navigate("/orders"); },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 pb-8">
        <div className="flex items-center gap-4">
          <Skeleton style={{ width: 38, height: 38, borderRadius: 10 }} />
          <Skeleton style={{ width: 200, height: 24 }} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: 300 }}>
        <p style={{ fontFamily: "Nunito Sans, system-ui", color: "#8899AA" }}>Order tidak ditemukan.</p>
        <button onClick={() => navigate("/orders")} style={{ marginTop: 12, color: "#00B4D8", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "Manrope, system-ui" }}>
          ← Kembali ke daftar order
        </button>
      </div>
    );
  }

  const nextStatus = NEXT_STATUS[order.status];
  const payConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus] ?? PAYMENT_STATUS_CONFIG.belum_bayar;

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #E8EDF2", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#5A6B80", flexShrink: 0 }}
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.25rem", color: "#0B1D35", margin: 0 }}>{order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", margin: "3px 0 0" }}>
              {order.customer.name} · {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/orders/${orderId}/print`, "_blank")}
            style={{ height: 38, padding: "0 14px", borderRadius: 10, border: "1.5px solid #E8EDF2", background: "white", color: "#5A6B80", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Printer size={14} />
            Cetak Nota
          </button>

          {order.paymentStatus !== "lunas" && order.status !== "selesai" && order.status !== "dibatalkan" && (
            <Button variant="secondary" size="sm" leftIcon={<CreditCard size={14} />} onClick={() => setShowMarkPaid(true)}>
              Tandai Lunas
            </Button>
          )}

          {nextStatus && order.status !== "selesai" && order.status !== "dibatalkan" && (
            <Button variant="primary" size="sm" rightIcon={<ChevronRight size={14} />} loading={isUpdatingStatus} onClick={() => updateStatus({ status: nextStatus })}>
              {NEXT_STATUS_LABEL[order.status]}
            </Button>
          )}
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Order Info */}
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #E8EDF2", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: "#0B1D35", marginBottom: 16 }}>Informasi Order</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoRow label="No. Order" value={order.orderNumber} valueColor="#00B4D8" />
              <InfoRow label="Pelanggan" value={order.customer.name} />
              <InfoRow label="Nomor HP" value={order.customer.phone} />
              <InfoRow label="Est. Selesai" value={order.estimatedFinishedAt ? new Date(order.estimatedFinishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
              {order.notes && <div className="col-span-2"><InfoRow label="Catatan" value={order.notes} valueColor="#5A6B80" /></div>}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #E8EDF2", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: "#0B1D35", marginBottom: 16 }}>Detail Layanan</p>
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#F8FAFC" }}>
                  <div>
                    <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: "#0B1D35", margin: 0 }}>{item.serviceName}</p>
                    <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.78rem", color: "#8899AA", margin: 0 }}>{item.qty} {item.unit} × {formatRupiah(item.pricePerUnit)}</p>
                  </div>
                  <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.9rem", color: "#0B1D35" }}>{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: "1.5px solid #E8EDF2" }}>
              <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.9rem", color: "#5A6B80" }}>Total</span>
              <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.125rem", color: "#0B1D35" }}>{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #E8EDF2", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: "#0B1D35", marginBottom: 16 }}>Pembayaran</p>
            <div className="flex flex-col gap-3">
              <InfoRow label="Status" value={payConfig.label} valueColor={payConfig.color} />
              <InfoRow label="Total" value={formatRupiah(order.totalAmount)} />
              <InfoRow label="Dibayar" value={formatRupiah(order.paidAmount)} valueColor="#00C853" />
              {order.remainingAmount > 0 && <InfoRow label="Sisa Bayar" value={formatRupiah(order.remainingAmount)} valueColor="#FFB703" />}
              {order.paymentMethod && <InfoRow label="Metode" value={PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod} />}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Timeline */}
          <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #E8EDF2", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: "#0B1D35", marginBottom: 20 }}>Status Order</p>
            <OrderTimeline currentStatus={order.status} history={order.statusHistory} />
          </div>

          {/* Danger zone */}
          {order.status !== "selesai" && order.status !== "dibatalkan" && (
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1.5px solid rgba(239,45,86,0.15)", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}>
              <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8125rem", color: "#EF2D56", marginBottom: 12 }}>Tindakan Berbahaya</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => setShowCancel(true)} className="flex items-center gap-2 w-full" style={{ height: 38, borderRadius: 10, border: "1.5px solid rgba(239,45,86,0.25)", background: "rgba(239,45,86,0.04)", color: "#EF2D56", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", paddingLeft: 12 }}>
                  <X size={14} />
                  Batalkan Order
                </button>
                <button onClick={() => { if (confirm(`Hapus order ${order.orderNumber}? Tindakan ini tidak bisa dibatalkan.`)) { deleteOrder(); } }} className="flex items-center gap-2 w-full" style={{ height: 38, borderRadius: 10, border: "1.5px solid rgba(239,45,86,0.25)", background: "rgba(239,45,86,0.04)", color: "#EF2D56", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", paddingLeft: 12, opacity: isDeleting ? 0.6 : 1 }} disabled={isDeleting}>
                  <Trash2 size={14} />
                  Hapus Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showMarkPaid && (
        <MarkPaidModal order={order} onConfirm={(method) => markPaid(method)} onClose={() => setShowMarkPaid(false)} isPending={isMarkingPaid} />
      )}
      {showCancel && (
        <CancelModal order={order} onConfirm={(note) => updateStatus({ status: "dibatalkan", note })} onClose={() => setShowCancel(false)} isPending={isUpdatingStatus} />
      )}
    </div>
  );
}

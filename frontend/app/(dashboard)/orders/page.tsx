"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "@/store";
import { orderService } from "@/services/order";
import { queryKeys } from "@/lib/query-keys";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { OrderFilterBar } from "@/components/orders/OrderFilterBar";
import { OrderTable } from "@/components/orders/OrderTable";
import type { Order, PaymentMethod } from "@/types";

const PAGE_SIZE = 20;

// Mark paid modal (simple inline)
function MarkPaidModal({
  order,
  onConfirm,
  onClose,
  isPending,
}: {
  order: Order;
  onConfirm: (method: PaymentMethod, amount: number) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [method, setMethod] = useState<PaymentMethod>("tunai");
  const remaining = order.remainingAmount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6"
        style={{
          background: "white",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 16px 48px rgba(11,29,53,0.18)",
          animation: "fade-up 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "1rem",
            color: "#0B1D35",
            marginBottom: 4,
          }}
        >
          Tandai Lunas
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8125rem",
            color: "#5A6B80",
            marginBottom: 20,
          }}
        >
          {order.orderNumber} · Sisa: Rp {remaining.toLocaleString("id-ID")}
        </p>

        <div className="flex flex-col gap-3 mb-5">
          <label
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "#3D5068",
            }}
          >
            Metode Pembayaran
          </label>
          <div className="flex gap-2">
            {(["tunai", "transfer", "qris"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  border: `2px solid ${method === m ? "#00B4D8" : "#E8EDF2"}`,
                  background: method === m ? "rgba(0,180,216,0.06)" : "white",
                  color: method === m ? "#00B4D8" : "#5A6B80",
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={isPending}
            onClick={() => onConfirm(method, remaining)}
          >
            Konfirmasi Lunas
          </Button>
        </div>
      </div>
    </div>
  );
}

// Delete confirmation modal
function DeleteModal({
  order,
  onConfirm,
  onClose,
  isPending,
}: {
  order: Order;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6"
        style={{
          background: "white",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 16px 48px rgba(11,29,53,0.18)",
          animation: "fade-up 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "1rem",
            color: "#0B1D35",
            marginBottom: 8,
          }}
        >
          Hapus Order?
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8125rem",
            color: "#5A6B80",
            marginBottom: 20,
          }}
        >
          Order {order.orderNumber} ({order.customer.name}) akan dihapus
          permanen. Tindakan ini tidak bisa dibatalkan.
        </p>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            fullWidth
            loading={isPending}
            onClick={onConfirm}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const { filters, updateFilter, resetFilters } = useOrderFilters();

  const [markPaidOrder, setMarkPaidOrder] = useState<Order | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);

  const queryParams = {
    page: filters.page,
    pageSize: PAGE_SIZE,
    ...(filters.status && { status: filters.status }),
    ...(filters.search && { search: filters.search }),
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders.list(activeOutletId ?? "", queryParams),
    queryFn: () => orderService.getList(activeOutletId!, queryParams),
    enabled: !!activeOutletId,
  });

  const orders = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const total = data?.meta?.total ?? 0;

  const { mutate: markPaid, isPending: isMarkPaidPending } = useMutation({
    mutationFn: ({
      orderId,
      method,
      amount,
    }: {
      orderId: string;
      method: PaymentMethod;
      amount: number;
    }) => orderService.markPaid(activeOutletId!, orderId, amount, method),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.list(activeOutletId ?? "", {}),
      });
      setMarkPaidOrder(null);
    },
  });

  const { mutate: deleteOrd, isPending: isDeletePending } = useMutation({
    mutationFn: (orderId: string) =>
      orderService.delete(activeOutletId!, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.list(activeOutletId ?? "", {}),
      });
      setDeleteOrder(null);
    },
  });

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(0,180,216,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBag size={18} color="#00B4D8" />
            </div>
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.375rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Order
            </h1>
          </div>
          {!isLoading && (
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8rem",
                color: "#8899AA",
                marginTop: 4,
                marginLeft: 50,
              }}
            >
              {total.toLocaleString("id-ID")} order ditemukan
            </p>
          )}
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => router.push("/orders/new")}
        >
          Buat Order Baru
        </Button>
      </div>

      {/* ── Filter ── */}
      <OrderFilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* ── Table ── */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onMarkPaid={(order) => setMarkPaidOrder(order)}
        onDelete={(order) => setDeleteOrder(order)}
      />

      {/* ── Pagination ── */}
      {!isLoading && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(p) => updateFilter("page", p)}
        />
      )}

      {/* ── Modals ── */}
      {markPaidOrder && (
        <MarkPaidModal
          order={markPaidOrder}
          onConfirm={(method, amount) =>
            markPaid({
              orderId: markPaidOrder.id,
              method,
              amount,
            })
          }
          onClose={() => setMarkPaidOrder(null)}
          isPending={isMarkPaidPending}
        />
      )}

      {deleteOrder && (
        <DeleteModal
          order={deleteOrder}
          onConfirm={() => deleteOrd(deleteOrder.id)}
          onClose={() => setDeleteOrder(null)}
          isPending={isDeletePending}
        />
      )}
    </div>
  );
}

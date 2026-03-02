import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Pencil,
  User,
  Phone,
  MapPin,
  StickyNote,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import { useAuthStore } from "@/store";
import { customerService } from "@/services/customer";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import type { CustomerFormValues } from "@/schemas/customer";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ORDER_PAGE_SIZE = 10;

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);
  const userRole = useAuthStore((s) => s.user?.role);
  const isOwner = userRole === "owner";

  const [showEdit, setShowEdit] = useState(false);
  const [orderPage, setOrderPage] = useState(1);

  const { data: customerData, isLoading: isCustomerLoading } = useQuery({
    queryKey: queryKeys.customers.detail(activeOutletId ?? "", id ?? ""),
    queryFn: () => customerService.getDetail(activeOutletId!, id!),
    enabled: !!activeOutletId && !!id,
  });

  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: queryKeys.customers.orders(activeOutletId ?? "", id ?? "", {
      page: orderPage,
    }),
    queryFn: () =>
      customerService.getOrders(activeOutletId!, id!, {
        page: orderPage,
        pageSize: ORDER_PAGE_SIZE,
      }),
    enabled: !!activeOutletId && !!id,
  });

  const { mutate: updateCustomer, isPending: isUpdating } = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      customerService.update(activeOutletId!, id!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(activeOutletId ?? "", id ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", activeOutletId],
      });
      setShowEdit(false);
    },
  });

  const customer = customerData?.data;
  const orders = ordersData?.data ?? [];
  const ordersTotalPages = ordersData?.meta?.totalPages ?? 1;
  const ordersTotal = ordersData?.meta?.total ?? 0;

  const avgPerOrder =
    customer && customer.totalOrders > 0
      ? Math.round(customer.totalSpending / customer.totalOrders)
      : 0;

  if (isCustomerLoading) {
    return (
      <div className="flex flex-col gap-5 pb-8">
        <div className="flex items-center gap-3">
          <Skeleton style={{ width: 36, height: 36, borderRadius: 10 }} />
          <div className="flex flex-col gap-2">
            <Skeleton style={{ width: 180, height: 16 }} />
            <Skeleton style={{ width: 120, height: 12 }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} style={{ height: 90, borderRadius: 16 }} />
          ))}
        </div>
        <Skeleton style={{ height: 200, borderRadius: 16 }} />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 300, gap: 16 }}>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "1rem", color: "#0B1D35" }}>
          Pelanggan tidak ditemukan
        </p>
        <Button variant="ghost" leftIcon={<ArrowLeft size={15} />} onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Back + header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1.5px solid #E8EDF2",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} color="#5A6B80" />
          </button>
          <div>
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.375rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              {customer.name}
            </h1>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8rem",
                color: "#8899AA",
                marginTop: 2,
              }}
            >
              Pelanggan sejak {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <Button
            variant="ghost"
            leftIcon={<Pencil size={14} />}
            onClick={() => setShowEdit(true)}
          >
            Edit
          </Button>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          {
            icon: <ShoppingBag size={18} color="#00B4D8" />,
            label: "Total Order",
            value: `${customer.totalOrders} order`,
          },
          {
            icon: <TrendingUp size={18} color="#00C853" />,
            label: "Total Spending",
            value: formatRupiah(customer.totalSpending),
          },
          {
            icon: <TrendingUp size={18} color="#FFB703" />,
            label: "Rata-rata per Order",
            value: avgPerOrder > 0 ? formatRupiah(avgPerOrder) : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 flex flex-col gap-2"
            style={{ border: "1.5px solid #E8EDF2", background: "white" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(0,180,216,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stat.icon}
            </div>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.78rem",
                color: "#8899AA",
                margin: 0,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Info card ── */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#0B1D35",
            margin: 0,
          }}
        >
          Informasi Pelanggan
        </p>

        <div className="flex flex-col gap-3">
          {[
            {
              icon: <User size={14} color="#8899AA" />,
              label: "Nama",
              value: customer.name,
            },
            {
              icon: <Phone size={14} color="#8899AA" />,
              label: "Nomor HP",
              value: customer.phone,
            },
            {
              icon: <MapPin size={14} color="#8899AA" />,
              label: "Alamat",
              value: customer.address ?? "—",
            },
            {
              icon: <StickyNote size={14} color="#8899AA" />,
              label: "Catatan",
              value: customer.notes ?? "—",
            },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "#F5F7FA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {row.icon}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    color: "#8899AA",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {row.label}
                </p>
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: row.value === "—" ? "#C4CDD6" : "#0B1D35",
                    margin: 0,
                    marginTop: 1,
                  }}
                >
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Order history ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1.5px solid #F0F3F7" }}
        >
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#0B1D35",
              margin: 0,
            }}
          >
            Riwayat Order
          </p>
          {ordersTotal > 0 && (
            <span
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.78rem",
                color: "#8899AA",
              }}
            >
              {ordersTotal} order
            </span>
          )}
        </div>

        {isOrdersLoading ? (
          <div className="flex flex-col">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5"
                style={{
                  height: 60,
                  borderBottom: i < 3 ? "1px solid #F0F3F7" : "none",
                }}
              >
                <Skeleton style={{ width: 80, height: 12 }} />
                <div className="flex-1" />
                <Skeleton style={{ width: 60, height: 24, borderRadius: 8 }} />
                <Skeleton style={{ width: 80, height: 12 }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ minHeight: 120, gap: 8 }}
          >
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8125rem",
                color: "#8899AA",
                margin: 0,
              }}
            >
              Belum ada riwayat order
            </p>
          </div>
        ) : (
          <div>
            {orders.map((order, i) => (
              <button
                key={order.id}
                type="button"
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{
                  height: 64,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 20px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: i < orders.length - 1 ? "1px solid #F0F3F7" : "none",
                  background: "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "white")
                }
              >
                {/* Order number + date */}
                <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#0B1D35",
                      margin: 0,
                    }}
                  >
                    {order.orderNumber}
                  </p>
                  <p
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.78rem",
                      color: "#8899AA",
                      margin: 0,
                      marginTop: 2,
                    }}
                  >
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <OrderStatusBadge status={order.status} />

                {/* Amount */}
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#0B1D35",
                    margin: 0,
                    minWidth: 100,
                    textAlign: "right",
                  }}
                >
                  {formatRupiah(order.totalAmount)}
                </p>

                <ChevronRight size={14} color="#C4CDD6" />
              </button>
            ))}
          </div>
        )}

        {/* Order pagination */}
        {ordersTotalPages > 1 && (
          <div
            className="flex items-center justify-center gap-2 px-5 py-3"
            style={{ borderTop: "1.5px solid #F0F3F7" }}
          >
            <button
              disabled={orderPage <= 1}
              onClick={() => setOrderPage((p) => p - 1)}
              style={{
                height: 32,
                padding: "0 12px",
                borderRadius: 8,
                border: "1.5px solid #E8EDF2",
                background: orderPage <= 1 ? "#F5F7FA" : "white",
                color: orderPage <= 1 ? "#C4CDD6" : "#3D5068",
                fontFamily: "Manrope, system-ui",
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: orderPage <= 1 ? "default" : "pointer",
              }}
            >
              ← Prev
            </button>
            <span
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.78rem",
                color: "#5A6B80",
              }}
            >
              {orderPage} / {ordersTotalPages}
            </span>
            <button
              disabled={orderPage >= ordersTotalPages}
              onClick={() => setOrderPage((p) => p + 1)}
              style={{
                height: 32,
                padding: "0 12px",
                borderRadius: 8,
                border: "1.5px solid #E8EDF2",
                background: orderPage >= ordersTotalPages ? "#F5F7FA" : "white",
                color: orderPage >= ordersTotalPages ? "#C4CDD6" : "#3D5068",
                fontFamily: "Manrope, system-ui",
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: orderPage >= ordersTotalPages ? "default" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {showEdit && (
        <CustomerFormModal
          mode="edit"
          defaultValues={{
            name: customer.name,
            phone: customer.phone,
            address: customer.address ?? "",
            notes: customer.notes ?? "",
          }}
          onSubmit={(values) => updateCustomer(values)}
          onClose={() => setShowEdit(false)}
          isPending={isUpdating}
        />
      )}
    </div>
  );
}

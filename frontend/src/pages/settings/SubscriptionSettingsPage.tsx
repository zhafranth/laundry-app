import { useQuery } from "@tanstack/react-query";
import {
  Crown,
  Zap,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Receipt,
} from "lucide-react";

import { subscriptionService } from "@/services/subscription";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { PlanType, PaymentStatusType } from "@/types";

// ── Format helpers ────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(v);
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

// ── Status helpers ─────────────────────────────────────────────────────────────

type SubStatus = "active" | "expiring" | "expired";

function getStatusConfig(status: SubStatus) {
  const map = {
    active: { label: "Aktif", color: "#00C853", bg: "rgba(0,200,83,0.10)", icon: CheckCircle2 },
    expiring: { label: "Hampir Habis", color: "#FFB703", bg: "rgba(255,183,3,0.10)", icon: Clock },
    expired: { label: "Expired", color: "#EF2D56", bg: "rgba(239,45,86,0.10)", icon: XCircle },
  };
  return map[status];
}

function getPaymentStatusConfig(status: PaymentStatusType) {
  const map: Record<PaymentStatusType, { label: string; color: string; bg: string }> = {
    paid: { label: "Lunas", color: "#00C853", bg: "rgba(0,200,83,0.10)" },
    pending: { label: "Menunggu", color: "#FFB703", bg: "rgba(255,183,3,0.10)" },
    failed: { label: "Gagal", color: "#EF2D56", bg: "rgba(239,45,86,0.10)" },
    expired: { label: "Expired", color: "#8899AA", bg: "#F5F7FA" },
  };
  return map[status];
}

function durationLabel(months: number) {
  if (months === 1) return "1 Bulan";
  if (months === 3) return "3 Bulan";
  if (months === 6) return "6 Bulan";
  if (months === 12) return "1 Tahun";
  return `${months} Bulan`;
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function CurrentPlanSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ border: "1.5px solid #E8EDF2", background: "white" }}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <Skeleton style={{ width: 120, height: 32, borderRadius: 8 }} />
          <Skeleton style={{ width: 72, height: 26, borderRadius: 20 }} />
        </div>
        <div className="flex gap-6">
          <Skeleton style={{ width: 140, height: 40, borderRadius: 8 }} />
          <Skeleton style={{ width: 140, height: 40, borderRadius: 8 }} />
        </div>
        <Skeleton style={{ width: 180, height: 38, borderRadius: 10 }} />
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: "1px solid #F0F3F6" }}>
          <Skeleton style={{ width: 32, height: 32, borderRadius: 8 }} />
          <div className="flex flex-col gap-1.5" style={{ flex: 1 }}>
            <Skeleton style={{ width: 160, height: 14, borderRadius: 6 }} />
            <Skeleton style={{ width: 100, height: 12, borderRadius: 6 }} />
          </div>
          <Skeleton style={{ width: 90, height: 14, borderRadius: 6 }} />
          <Skeleton style={{ width: 64, height: 24, borderRadius: 8 }} />
        </div>
      ))}
    </>
  );
}

// ── Plan Feature List ─────────────────────────────────────────────────────────

const PLAN_FEATURES: Record<PlanType, string[]> = {
  regular: [
    "Input order & tracking status",
    "Database pelanggan",
    "Catat pengeluaran",
    "Laporan pemasukan & pengeluaran",
    "Data karyawan & absensi",
    "Kelola layanan & harga",
  ],
  pro: [
    "Semua fitur Regular",
    "Profit per Layanan",
    "Smart Expense Tracker",
    "Smart Inventory + Prediksi Restock",
    "Dashboard Kesehatan Bisnis",
    "Export PDF & Excel",
    "Peringatan Anomali Pengeluaran",
  ],
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export function SubscriptionSettingsPage() {
  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: queryKeys.subscriptions.current,
    queryFn: subscriptionService.getCurrent,
  });

  const { data: histData, isLoading: histLoading } = useQuery({
    queryKey: queryKeys.subscriptions.history,
    queryFn: subscriptionService.getHistory,
  });

  const subscription = subData?.data;
  const history = histData?.data ?? [];

  const isPro = subscription?.plan === "pro";
  const daysLeft = subscription ? daysUntil(subscription.endDate) : null;

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Page Header */}
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
          <Crown size={18} color="#00B4D8" />
        </div>
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
            Subscription
          </h1>
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.78rem",
              color: "#8899AA",
              margin: "2px 0 0",
            }}
          >
            Kelola paket dan riwayat pembayaran outlet
          </p>
        </div>
      </div>

      {/* ── Current Plan Card ── */}
      {subLoading ? (
        <CurrentPlanSkeleton />
      ) : subscription ? (
        <div
          className="rounded-2xl p-6"
          style={{
            border: isPro ? "1.5px solid rgba(255,183,3,0.35)" : "1.5px solid #E8EDF2",
            background: isPro
              ? "linear-gradient(135deg, #fffdf0 0%, #fffbe6 100%)"
              : "white",
          }}
        >
          <div className="flex flex-col gap-5">
            {/* Plan name + status badge */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isPro ? "rgba(255,183,3,0.15)" : "rgba(0,180,216,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isPro ? (
                    <Crown size={22} color="#FFB703" />
                  ) : (
                    <Zap size={22} color="#00B4D8" />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "#0B1D35",
                      margin: 0,
                    }}
                  >
                    Paket {isPro ? "Pro" : "Regular"}
                  </p>
                  <p
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.78rem",
                      color: "#8899AA",
                      margin: "2px 0 0",
                    }}
                  >
                    {subscription.outletName}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              {(() => {
                const cfg = getStatusConfig(subscription.status);
                const StatusIcon = cfg.icon;
                return (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 12px",
                      borderRadius: 20,
                      background: cfg.bg,
                      color: cfg.color,
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    <StatusIcon size={12} />
                    {cfg.label}
                  </span>
                );
              })()}
            </div>

            {/* Dates */}
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} color="#8899AA" />
                <div>
                  <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.72rem", color: "#8899AA", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Mulai
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.8125rem", color: "#0B1D35", margin: 0 }}>
                    {fmtDate(subscription.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={15} color="#8899AA" />
                <div>
                  <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.72rem", color: "#8899AA", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Berakhir
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.8125rem", color: daysLeft !== null && daysLeft <= 7 ? "#EF2D56" : "#0B1D35", margin: 0 }}>
                    {fmtDate(subscription.endDate)}
                    {daysLeft !== null && daysLeft >= 0 && daysLeft <= 30 && (
                      <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.72rem", color: daysLeft <= 7 ? "#EF2D56" : "#FFB703", marginLeft: 8 }}>
                        ({daysLeft} hari lagi)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {PLAN_FEATURES[subscription.plan].map((feat) => (
                <span
                  key={feat}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: isPro ? "rgba(255,183,3,0.10)" : "rgba(0,180,216,0.07)",
                    fontFamily: "Nunito Sans, system-ui",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: isPro ? "#B78200" : "#0077B6",
                  }}
                >
                  <CheckCircle2 size={11} />
                  {feat}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {!isPro && (
                <Button
                  variant="primary"
                  leftIcon={<TrendingUp size={15} />}
                  style={{ background: "linear-gradient(135deg, #FFB703, #FF8C00)" }}
                >
                  Upgrade ke Pro
                </Button>
              )}
              <Button variant="outline" leftIcon={<CalendarDays size={15} />}>
                Perpanjang {isPro ? "Pro" : "Regular"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* No subscription */
        <div
          className="rounded-2xl p-8 flex flex-col items-center gap-4"
          style={{ border: "1.5px solid #E8EDF2", background: "white" }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(0,180,216,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Crown size={26} color="#00B4D8" opacity={0.5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", margin: "0 0 6px" }}>
              Belum ada subscription aktif
            </p>
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#8899AA", margin: 0 }}>
              Pilih paket untuk mulai menggunakan LaundryKu
            </p>
          </div>
          <Button variant="primary" leftIcon={<Crown size={15} />}>
            Pilih Paket
          </Button>
        </div>
      )}

      {/* ── Payment History ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} color="#5A6B80" />
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "1rem",
              color: "#0B1D35",
              margin: 0,
            }}
          >
            Riwayat Pembayaran
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid #E8EDF2", background: "white" }}
        >
          {/* Table Header */}
          <div
            className="grid px-5 py-3"
            style={{
              background: "#F5F7FA",
              borderBottom: "1.5px solid #E8EDF2",
              gridTemplateColumns: "1fr auto auto auto",
              gap: "12px",
            }}
          >
            {["Paket", "Tanggal", "Jumlah", "Status"].map((h) => (
              <p
                key={h}
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "#5A6B80",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {histLoading ? (
            <HistorySkeleton />
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Receipt size={28} color="#C4CDD6" />
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.8125rem",
                  color: "#8899AA",
                  margin: 0,
                }}
              >
                Belum ada riwayat pembayaran
              </p>
            </div>
          ) : (
            history.map((item) => {
              const statusCfg = getPaymentStatusConfig(item.status);
              return (
                <div
                  key={item.id}
                  className="grid px-5 py-4 items-center"
                  style={{
                    gridTemplateColumns: "1fr auto auto auto",
                    gap: "12px",
                    borderBottom: "1px solid #F0F3F6",
                  }}
                >
                  {/* Paket */}
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background:
                          item.plan === "pro"
                            ? "rgba(255,183,3,0.12)"
                            : "rgba(0,180,216,0.09)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.plan === "pro" ? (
                        <Crown size={15} color="#FFB703" />
                      ) : (
                        <Zap size={15} color="#00B4D8" />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "Manrope, system-ui",
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                          color: "#0B1D35",
                          margin: 0,
                        }}
                      >
                        Paket {item.plan === "pro" ? "Pro" : "Regular"}
                      </p>
                      <p
                        style={{
                          fontFamily: "Nunito Sans, system-ui",
                          fontSize: "0.75rem",
                          color: "#8899AA",
                          margin: "1px 0 0",
                        }}
                      >
                        {durationLabel(item.durationMonths)}
                      </p>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <p
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.8125rem",
                      color: "#5A6B80",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.paidAt ? fmtDate(item.paidAt) : fmtDate(item.createdAt)}
                  </p>

                  {/* Jumlah */}
                  <p
                    style={{
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      color: "#0B1D35",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtCurrency(item.amount)}
                  </p>

                  {/* Status */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: statusCfg.bg,
                      color: statusCfg.color,
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {statusCfg.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

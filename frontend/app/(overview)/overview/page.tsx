"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, TrendingUp, ShoppingBag, Receipt, Star } from "lucide-react";
import { useAuthStore } from "@/store";
import { dashboardService } from "@/services/dashboard";
import { queryKeys } from "@/lib/query-keys";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OutletOverviewRow, PlanType, SubscriptionStatus } from "@/types";

function formatRupiah(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
  return `Rp ${value.toLocaleString("id-ID")}`;
}

const SUB_STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: "Aktif",
  expiring: "Hampir Habis",
  expired: "Kadaluarsa",
};

const SUB_STATUS_COLOR: Record<
  SubscriptionStatus,
  "success" | "warning" | "error"
> = {
  active: "success",
  expiring: "warning",
  expired: "error",
};

function OutletRow({
  outlet,
  onSelect,
}: {
  outlet: OutletOverviewRow;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(outlet.id)}
      className="flex items-center gap-4 rounded-xl px-4 py-3.5 w-full text-left transition-colors"
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
      {/* Outlet avatar */}
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: "linear-gradient(135deg, #00B4D8, #0077B6)",
          color: "white",
          fontFamily: "Manrope, system-ui",
          fontWeight: 800,
          fontSize: "1rem",
        }}
      >
        {outlet.name.charAt(0).toUpperCase()}
      </div>

      {/* Name + plan */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="truncate"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#0B1D35",
            }}
          >
            {outlet.name}
          </p>
          {outlet.plan === "pro" && <Badge variant="pro" />}
        </div>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.75rem",
            color: "#8899AA",
            marginTop: 1,
          }}
        >
          {outlet.monthlyOrders} order bulan ini
        </p>
      </div>

      {/* Revenue */}
      <div className="text-right hidden sm:block">
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#0B1D35",
          }}
        >
          {formatRupiah(outlet.monthlyRevenue)}
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.7rem",
            color: "#8899AA",
          }}
        >
          pendapatan bulan ini
        </p>
      </div>

      {/* Status */}
      <Badge
        variant="status"
        color={SUB_STATUS_COLOR[outlet.subscriptionStatus]}
      >
        {SUB_STATUS_LABEL[outlet.subscriptionStatus]}
      </Badge>
    </button>
  );
}

function OutletRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3.5"
      style={{ background: "#F5F7FA" }}
    >
      <Skeleton style={{ width: 40, height: 40, borderRadius: 12 }} />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton style={{ width: "40%", height: 14 }} />
        <Skeleton style={{ width: "25%", height: 12 }} />
      </div>
      <Skeleton style={{ width: 72, height: 14 }} />
      <Skeleton style={{ width: 60, height: 22 }} />
    </div>
  );
}

export default function OverviewPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setActiveOutlet = useAuthStore((s) => s.setActiveOutlet);

  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: dashboardService.getOverview,
    enabled: !!user,
    retry: false,
  });

  const outlets: OutletOverviewRow[] = data?.data ?? [];

  // Aggregate stats
  const totalRevenue = outlets.reduce((sum, o) => sum + o.monthlyRevenue, 0);
  const totalOrders = outlets.reduce((sum, o) => sum + o.activeOrders, 0);
  const totalMonthlyOrders = outlets.reduce((sum, o) => sum + o.monthlyOrders, 0);
  const bestOutlet = outlets.reduce(
    (best, o) => (!best || o.monthlyRevenue > best.monthlyRevenue ? o : best),
    null as OutletOverviewRow | null
  );

  function handleSelectOutlet(id: string) {
    setActiveOutlet(id);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "1.375rem",
              color: "#0B1D35",
            }}
          >
            Overview
          </h1>
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: "#8899AA",
              marginTop: 2,
            }}
          >
            Ringkasan semua outlet Anda
          </p>
        </div>
        <Button
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => router.push("/onboarding")}
        >
          Tambah Outlet
        </Button>
      </div>

      {/* ── Aggregate Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Pendapatan Bulan Ini"
          value={formatRupiah(totalRevenue)}
          icon={<TrendingUp size={18} />}
          iconColor="#00B4D8"
          iconBg="rgba(0,180,216,0.12)"
          isLoading={isLoading}
        />
        <StatCard
          label="Order Aktif Semua Outlet"
          value={String(totalOrders)}
          icon={<ShoppingBag size={18} />}
          iconColor="#7C4DFF"
          iconBg="rgba(124,77,255,0.12)"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Order Bulan Ini"
          value={String(totalMonthlyOrders)}
          icon={<Receipt size={18} />}
          iconColor="#FF6B35"
          iconBg="rgba(255,107,53,0.12)"
          isLoading={isLoading}
        />
        <StatCard
          label="Outlet Terbaik"
          value={bestOutlet?.name ?? "-"}
          icon={<Star size={18} />}
          iconColor="#FFB703"
          iconBg="rgba(255,183,3,0.12)"
          isLoading={isLoading}
        />
      </div>

      {/* ── Outlet List ── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid #E8EDF2",
          boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#0B1D35",
            }}
          >
            Outlet Saya
          </p>
          {!isLoading && outlets.length > 0 && (
            <span
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
                fontSize: "0.75rem",
                color: "#8899AA",
              }}
            >
              {outlets.length} outlet
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            <>
              <OutletRowSkeleton />
              <OutletRowSkeleton />
              <OutletRowSkeleton />
            </>
          ) : outlets.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-xl gap-3 py-10"
              style={{ background: "#F5F7FA", border: "1px dashed #C4CDD6" }}
            >
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.875rem",
                  color: "#8899AA",
                }}
              >
                Belum ada outlet yang terdaftar
              </p>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Plus size={13} />}
                onClick={() => router.push("/onboarding")}
              >
                Tambah Outlet
              </Button>
            </div>
          ) : (
            outlets.map((outlet) => (
              <OutletRow
                key={outlet.id}
                outlet={outlet}
                onSelect={handleSelectOutlet}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

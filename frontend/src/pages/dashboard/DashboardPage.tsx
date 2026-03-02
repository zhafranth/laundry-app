import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Receipt,
  Users,
  Clock,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { dashboardService } from "@/services/dashboard";
import { outletService } from "@/services/outlet";
import { queryKeys } from "@/lib/query-keys";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { HealthScoreGauge } from "@/components/dashboard/HealthScoreGauge";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { ProInsightBox } from "@/components/dashboard/ProInsightBox";
import { ProAlertBanner } from "@/components/dashboard/ProAlertBanner";
import { StaffClockWidget } from "@/components/dashboard/StaffClockWidget";

function formatRupiah(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const activeOutletId = useAuthStore((s) => s.activeOutletId);
  const isPro = user?.plan === "pro";
  const isOwner = user?.role === "owner";

  const { data: outletsData } = useQuery({
    queryKey: queryKeys.outlets.list,
    queryFn: outletService.getMyOutlets,
    enabled: !!user,
  });

  const outlets = outletsData?.data ?? [];
  const activeOutlet = outlets.find((o) => o.id === activeOutletId) ?? outlets[0];
  const outletName = activeOutlet?.name ?? "Outlet";

  const { data: dashData, isLoading } = useQuery({
    queryKey: queryKeys.reports.dashboard(activeOutletId ?? "", "today"),
    queryFn: () => dashboardService.getStats(activeOutletId!),
    enabled: !!activeOutletId,
    retry: false,
  });

  const stats = dashData?.data;

  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* ── Header Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.375rem",
                color: "#0B1D35",
              }}
            >
              {greeting}, {user?.name?.split(" ")[0] ?? "Pengguna"}!
            </h1>
            {isPro && <Badge variant="pro" />}
          </div>
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: "#8899AA",
            }}
          >
            {outletName} · {today}
          </p>
        </div>

        {/* Quick action */}
        <button
          onClick={() => navigate("/orders/new")}
          className="hidden sm:flex items-center gap-2 rounded-xl px-4"
          style={{
            height: 40,
            background: "linear-gradient(135deg, #00B4D8, #0077B6)",
            border: "none",
            color: "white",
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8125rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,180,216,0.30)",
            flexShrink: 0,
          }}
        >
          <Zap size={14} />
          Buat Order
        </button>
      </div>

      {/* ── Staff Clock-In/Out Widget ── */}
      {!isOwner && <StaffClockWidget />}

      {/* ── PRO Alerts ── */}
      {isPro && stats?.alerts && stats.alerts.length > 0 && (
        <ProAlertBanner alerts={stats.alerts} />
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Pendapatan Hari Ini"
          value={isLoading ? "" : formatRupiah(stats?.todayRevenue ?? 0)}
          icon={<DollarSign size={18} />}
          iconColor="#00B4D8"
          iconBg="rgba(0,180,216,0.12)"
          changePercent={stats?.todayRevenueChangePercent}
          changeLabel="vs kemarin"
          isLoading={isLoading}
        />

        <StatCard
          label="Order Aktif"
          value={isLoading ? "" : String(stats?.activeOrders ?? 0)}
          icon={<ShoppingBag size={18} />}
          iconColor="#7C4DFF"
          iconBg="rgba(124,77,255,0.12)"
          isLoading={isLoading}
          subLabel={
            stats?.approachingDeadlineCount
              ? `${stats.approachingDeadlineCount} mendekati deadline`
              : undefined
          }
        />

        {isOwner && (
          <StatCard
            label="Pengeluaran Hari Ini"
            value={isLoading ? "" : formatRupiah(stats?.todayExpenses ?? 0)}
            icon={<Receipt size={18} />}
            iconColor="#FF6B35"
            iconBg="rgba(255,107,53,0.12)"
            isLoading={isLoading}
          />
        )}

        {isPro ? (
          <StatCard
            label=""
            value=""
            icon={<Clock size={18} />}
            iconColor="#00C853"
            iconBg="rgba(0,200,83,0.12)"
            isLoading={isLoading}
          >
            {!isLoading && (
              <HealthScoreGauge score={stats?.healthScore ?? 0} />
            )}
          </StatCard>
        ) : (
          <StatCard
            label="Pelanggan Bulan Ini"
            value={isLoading ? "" : String(stats?.monthlyCustomers ?? 0)}
            icon={<Users size={18} />}
            iconColor="#FFB703"
            iconBg="rgba(255,183,3,0.12)"
            isLoading={isLoading}
          />
        )}
      </div>

      {/* ── PRO Insights ── */}
      {isPro && stats?.insights && stats.insights.length > 0 && (
        <ProInsightBox insights={stats.insights} />
      )}

      {/* ── Charts + Recent Orders ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "white",
            border: "1.5px solid #E8EDF2",
            boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
          }}
        >
          <RevenueChart
            data={stats?.revenueChart ?? []}
            isLoading={isLoading}
          />
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "white",
            border: "1.5px solid #E8EDF2",
            boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
          }}
        >
          <RecentOrdersTable
            orders={stats?.recentOrders ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

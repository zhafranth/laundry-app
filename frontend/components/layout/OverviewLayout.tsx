
import { ReactNode } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store";
import { OVERVIEW_NAV_ITEMS } from "@/config/nav";
import { BrandLogo } from "./BrandLogo";
import { Avatar } from "@/components/ui/Avatar";

interface OverviewLayoutProps {
  children: ReactNode;
}

export function OverviewLayout({ children }: OverviewLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F5F7FA" }}>
      {/* ── Overview Sidebar ── */}
      <aside
        className="flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden"
        style={{
          width: 220,
          background: "#0B1D35",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 45% at 50% 0%, rgba(0,180,216,0.07) 0%, transparent 55%)",
          }}
        />

        {/* Brand */}
        <div className="relative z-10 px-5 py-5 flex-shrink-0">
          <BrandLogo theme="dark" size="md" href="/overview" />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          <p
            className="px-4 mb-1 uppercase tracking-widest"
            style={{
              color: "rgba(255,255,255,0.30)",
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.625rem",
            }}
          >
            Menu
          </p>
          {OVERVIEW_NAV_ITEMS.map((item) => {
            const isActive = item.exactMatch
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 rounded-[10px]"
                style={{
                  height: 44,
                  color: isActive ? "#00B4D8" : "rgba(255,255,255,0.55)",
                  background: isActive ? "rgba(0,180,216,0.12)" : "transparent",
                  borderLeft: isActive ? "3px solid #00B4D8" : "3px solid transparent",
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user info + logout */}
        <div
          className="relative z-10 px-3 pb-5 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}
        >
          {/* User info */}
          <div
            className="flex items-center gap-2.5 px-3 mb-1 rounded-[10px]"
            style={{ height: 48 }}
          >
            <Avatar name={user?.name ?? "U"} size="sm" />
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{
                  color: "white",
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                }}
              >
                {user?.name ?? "-"}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.7rem",
                }}
              >
                Owner
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 rounded-[10px] transition-colors"
            style={{
              height: 40,
              color: "rgba(255,255,255,0.40)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(239,45,86,0.08)";
              el.style.color = "#EF2D56";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "transparent";
              el.style.color = "rgba(255,255,255,0.40)";
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

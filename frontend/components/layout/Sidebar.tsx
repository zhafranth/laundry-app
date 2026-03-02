import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useAuthStore } from "@/store";
import { filterNavItems, NAV_ITEMS } from "@/config/nav";
import { BrandLogo } from "./BrandLogo";
import { SidebarNavItem } from "./SidebarNavItem";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapsedChange: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  isCollapsed,
  onCollapsedChange,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const plan = user?.plan ?? "regular";
  const role = user?.role ?? "staff";
  const navItems = filterNavItems(NAV_ITEMS, role, plan);

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  const sidebarContent = (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{ background: "#0B1D35" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(0,180,216,0.07) 0%, transparent 60%)",
        }}
      />

      {/* ── Brand ── */}
      <div className="relative z-10 px-5 py-5 flex-shrink-0">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}
            >
              <svg width="14" height="14" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                <path
                  d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6"
                  stroke="#FFB703"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                />
                <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4" />
              </svg>
            </div>
          </div>
        ) : (
          <BrandLogo theme="dark" size="md" />
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
        {!isCollapsed && (
          <p
            className="px-4 mb-1 mt-1 uppercase tracking-widest"
            style={{
              color: "rgba(255,255,255,0.30)",
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.625rem",
            }}
          >
            Menu
          </p>
        )}

        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            plan={plan}
            role={role}
          />
        ))}
      </nav>

      {/* ── Bottom: Logout + Collapse toggle ── */}
      <div
        className="relative z-10 px-3 pb-5 flex-shrink-0 flex flex-col gap-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}
      >
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center rounded-[10px] transition-colors ${isCollapsed ? "justify-center" : "gap-3 px-4"}`}
          style={{
            height: 44,
            color: "rgba(255,255,255,0.40)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
            fontSize: "0.875rem",
            width: "100%",
          }}
          title={isCollapsed ? "Keluar" : undefined}
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
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Keluar</span>}
        </button>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onCollapsedChange}
          className="hidden lg:flex items-center justify-center rounded-[10px] transition-colors"
          style={{
            height: 36,
            color: "rgba(255,255,255,0.25)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
          title={isCollapsed ? "Perluas sidebar" : "Kerucutkan sidebar"}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ══ Desktop Sidebar ══ */}
      <aside
        className={`hidden lg:block flex-shrink-0 h-screen sticky top-0 ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
      >
        {sidebarContent}
      </aside>

      {/* ══ Mobile Drawer + Backdrop ══ */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="sidebar-backdrop fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(11,29,53,0.55)", backdropFilter: "blur(2px)" }}
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            className="sidebar-mobile-enter fixed top-0 left-0 h-full z-50 lg:hidden sidebar-expanded"
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

import { Bell, Menu, ChevronDown, LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { queryKeys } from "@/lib/query-keys";
import { outletService } from "@/services/outlet";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { useDisclosure } from "@/hooks/useDisclosure";
import type { DropdownItem } from "@/components/ui/Dropdown";

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const activeOutletId = useAuthStore((s) => s.activeOutletId);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const userDropdown = useDisclosure();

  const { data: outletsData } = useQuery({
    queryKey: queryKeys.outlets.list,
    queryFn: outletService.getMyOutlets,
    enabled: !!user,
  });

  const outlets = outletsData?.data ?? [];
  const activeOutlet = outlets.find((o) => o.id === activeOutletId);
  const outletName = activeOutlet?.name ?? (outlets[0]?.name ?? "Outlet");

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  const userMenuItems: DropdownItem[] = [
    {
      label: user?.name ?? "Pengguna",
      icon: <User size={15} />,
      onClick: () => {},
      disabled: true,
    },
    {
      label: "Keluar",
      icon: <LogOut size={15} />,
      onClick: handleLogout,
      danger: true,
      dividerAbove: true,
    },
  ];

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: "white",
        borderBottom: "1px solid #E8EDF2",
        boxShadow: "0 1px 4px rgba(11,29,53,0.06)",
      }}
    >
      {/* ── Left: Hamburger + Outlet name ── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden flex items-center justify-center rounded-[10px] transition-colors"
          style={{
            width: 36,
            height: 36,
            color: "#3D5068",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Buka menu"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#F5F7FA";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Menu size={20} />
        </button>

        {/* Outlet name chip */}
        <button
          className="flex items-center gap-1.5 rounded-[10px] px-3 transition-colors"
          style={{
            height: 36,
            background: "#F5F7FA",
            border: "1px solid #E8EDF2",
            cursor: outlets.length > 1 ? "pointer" : "default",
            color: "#1A2D45",
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.875rem",
          }}
          onMouseEnter={(e) => {
            if (outlets.length > 1)
              (e.currentTarget as HTMLButtonElement).style.background = "#E8EDF2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#F5F7FA";
          }}
        >
          <span className="truncate max-w-[140px] lg:max-w-[200px]">{outletName}</span>
          {outlets.length > 1 && <ChevronDown size={14} style={{ color: "#8899AA", flexShrink: 0 }} />}
        </button>
      </div>

      {/* ── Right: Date + Bell + Avatar ── */}
      <div className="flex items-center gap-2">
        {/* Date chip (hidden on mobile) */}
        <div
          className="hidden lg:flex items-center px-3 rounded-[8px]"
          style={{
            height: 32,
            background: "#F5F7FA",
            border: "1px solid #E8EDF2",
            color: "#8899AA",
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          {formatDate(new Date())}
        </div>

        {/* Bell */}
        <button
          className="relative flex items-center justify-center rounded-[10px] transition-colors"
          style={{
            width: 36,
            height: 36,
            color: "#3D5068",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Notifikasi"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#F5F7FA";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Bell size={19} />
          {/* Unread dot placeholder — real count from API in F9 */}
          <span
            className="absolute top-1 right-1"
            style={{
              width: 7,
              height: 7,
              background: "#EF2D56",
              borderRadius: "50%",
              border: "1.5px solid white",
            }}
          />
        </button>

        {/* Avatar + Dropdown */}
        <Dropdown
          trigger={
            <button
              className="flex items-center gap-2 rounded-[10px] px-1 transition-colors"
              style={{
                height: 36,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Menu pengguna"
            >
              <Avatar name={user?.name ?? "U"} size="sm" />
              <ChevronDown
                size={13}
                style={{ color: "#8899AA", flexShrink: 0 }}
                className="hidden lg:block"
              />
            </button>
          }
          items={userMenuItems}
          isOpen={userDropdown.isOpen}
          onOpen={userDropdown.onOpen}
          onClose={userDropdown.onClose}
          align="right"
        />
      </div>
    </header>
  );
}



import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Lock } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "@/config/nav";
import type { PlanType, UserRole } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  plan: PlanType;
  role: UserRole;
}

const ITEM_BASE: React.CSSProperties = {
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 600,
  fontSize: "0.875rem",
  textDecoration: "none",
  transition: "background 0.15s, color 0.15s",
};

export function SidebarNavItem({ item, isCollapsed, plan, role }: SidebarNavItemProps) {
  const { pathname } = useLocation();
  const isActive = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);
  const hasSubItems = !!item.subItems?.length;

  const [isExpanded, setIsExpanded] = useState(isActive);
  const Icon = item.icon;

  const activeItemStyle: React.CSSProperties = {
    color: "#00B4D8",
    background: "rgba(0,180,216,0.12)",
    borderLeft: "3px solid #00B4D8",
    fontWeight: 700,
  };
  const inactiveItemStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.55)",
    background: "transparent",
    borderLeft: "3px solid transparent",
  };

  /* ── Collapsed: icon-only pill ── */
  if (isCollapsed) {
    return (
      <Link
        to={item.href}
        title={item.label}
        className="flex items-center justify-center rounded-[10px]"
        style={{
          height: 44,
          ...(isActive ? activeItemStyle : inactiveItemStyle),
        }}
        onMouseEnter={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
        }}
      >
        <Icon size={20} />
      </Link>
    );
  }

  /* ── Expanded with sub-items: accordion ── */
  if (hasSubItems) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded((p) => !p)}
          className="w-full flex items-center gap-3 px-4 rounded-[10px]"
          style={{
            height: 44,
            ...(isActive || isExpanded ? activeItemStyle : inactiveItemStyle),
            border: "none",
            cursor: "pointer",
            ...ITEM_BASE,
          }}
          onMouseEnter={(e) => {
            if (!isActive && !isExpanded)
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            if (!isActive && !isExpanded)
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Icon size={18} style={{ flexShrink: 0 }} />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            size={14}
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              opacity: 0.5,
            }}
          />
        </button>

        {isExpanded && (
          <div
            className="mt-1 ml-6 pl-3"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            {item.subItems!
              .filter((sub) => !sub.roles || sub.roles.includes(role))
              .map((sub) => {
              const isSubActive = pathname === sub.href || pathname.startsWith(sub.href);
              const isLocked = sub.proOnly && plan === "regular";

              if (isLocked) {
                return (
                  <div
                    key={sub.href}
                    className="flex items-center gap-2 px-3 rounded-[8px]"
                    style={{
                      height: 36,
                      color: "rgba(255,255,255,0.25)",
                      cursor: "not-allowed",
                    }}
                  >
                    <span
                      className="flex-1 truncate"
                      style={{
                        fontFamily: "Nunito Sans, system-ui",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                      }}
                    >
                      {sub.label}
                    </span>
                    <Lock size={11} style={{ flexShrink: 0, opacity: 0.6 }} />
                    <Badge variant="pro" />
                  </div>
                );
              }

              return (
                <Link
                  key={sub.href}
                  to={sub.href}
                  className="flex items-center px-3 rounded-[8px]"
                  style={{
                    height: 36,
                    color: isSubActive ? "#00B4D8" : "rgba(255,255,255,0.50)",
                    background: isSubActive ? "rgba(0,180,216,0.10)" : "transparent",
                    fontFamily: "Nunito Sans, system-ui",
                    fontWeight: isSubActive ? 700 : 600,
                    fontSize: "0.8125rem",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubActive)
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubActive)
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ── Simple item ── */
  return (
    <Link
      to={item.href}
      className="flex items-center gap-3 px-4 rounded-[10px]"
      style={{
        height: 44,
        ...(isActive ? activeItemStyle : inactiveItemStyle),
        ...ITEM_BASE,
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span>{item.label}</span>
    </Link>
  );
}

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wallet,
  Package,
  UserCog,
  Settings,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { UserRole, PlanType } from "@/types";

export interface NavSubItem {
  label: string;
  href: string;
  proOnly?: boolean;
  /** If set, only these roles can see this sub-item. Defaults to parent's roles. */
  roles?: UserRole[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  /** top-level proOnly → hidden entirely for Regular (not just locked) */
  proOnly?: boolean;
  subItems?: NavSubItem[];
  /** use exact path match for active state */
  exactMatch?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "staff"],
    exactMatch: true,
  },
  {
    label: "Order",
    href: "/orders",
    icon: ClipboardList,
    roles: ["owner", "staff"],
  },
  {
    label: "Pelanggan",
    href: "/customers",
    icon: Users,
    roles: ["owner", "staff"],
  },
  {
    label: "Keuangan",
    href: "/finance",
    icon: Wallet,
    roles: ["owner", "staff"],
    subItems: [
      { label: "Pemasukan", href: "/finance/income", roles: ["owner"] },
      { label: "Pengeluaran", href: "/finance/expenses" },
      {
        label: "Profit Layanan",
        href: "/finance/profit",
        proOnly: true,
        roles: ["owner"],
      },
    ],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["owner", "staff"],
    proOnly: true, // hidden entirely for Regular (not just locked)
  },
  {
    label: "Karyawan",
    href: "/employees",
    icon: UserCog,
    roles: ["owner"],
  },
  {
    label: "Pengaturan",
    href: "/settings",
    icon: Settings,
    roles: ["owner"],
    subItems: [
      { label: "Profil Outlet", href: "/settings/outlet" },
      { label: "Layanan & Harga", href: "/settings/services" },
      { label: "Kelola Staff", href: "/settings/staff" },
      { label: "Subscription", href: "/settings/subscription" },
    ],
  },
];

export const OVERVIEW_NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
    roles: ["owner"],
    exactMatch: true,
  },
  {
    label: "Daftar Outlet",
    href: "/overview/outlets",
    icon: Building2,
    roles: ["owner"],
  },
  {
    label: "Profil",
    href: "/overview/profile",
    icon: UserCog,
    roles: ["owner"],
  },
];

/**
 * Filter NAV_ITEMS based on user role and plan.
 * - Items not in user's `roles` are excluded entirely.
 * - Top-level `proOnly` items (Inventory) are hidden for Regular owners.
 * - Sub-item `proOnly` (Profit Layanan) is kept — SidebarNavItem renders the lock UI.
 */
export function filterNavItems(
  items: NavItem[],
  role: UserRole,
  plan: PlanType = "regular"
): NavItem[] {
  return items.filter((item) => {
    if (!item.roles.includes(role)) return false;
    // Hide top-level proOnly items entirely for Regular owners
    if (item.proOnly && plan === "regular") return false;
    return true;
  });
}

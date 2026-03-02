"use client";

import { ReactNode } from "react";
import { useToggle } from "@/hooks/useToggle";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, toggleCollapsed] = useToggle(false);
  const { isOpen: isMobileOpen, onOpen: openMobile, onClose: closeMobile } = useDisclosure();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F5F7FA" }}>
      <Sidebar
        isCollapsed={isCollapsed}
        onCollapsedChange={toggleCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobile}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuOpen={openMobile} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

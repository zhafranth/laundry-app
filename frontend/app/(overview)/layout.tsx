import { ReactNode } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { OverviewLayout } from "@/components/layout/OverviewLayout";

interface OverviewGroupLayoutProps {
  children: ReactNode;
}

export default function OverviewGroupLayout({ children }: OverviewGroupLayoutProps) {
  return (
    <AuthGuard>
      <OverviewLayout>{children}</OverviewLayout>
    </AuthGuard>
  );
}

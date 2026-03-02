"use client";

import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/types";

type StatusColor = "success" | "warning" | "error" | "info" | "neutral";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: StatusColor }
> = {
  masuk: { label: "Masuk", color: "neutral" },
  proses: { label: "Proses", color: "info" },
  siap_diambil: { label: "Siap Diambil", color: "warning" },
  selesai: { label: "Selesai", color: "success" },
  dibatalkan: { label: "Dibatalkan", color: "error" },
  overdue: { label: "Overdue", color: "error" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.masuk;
  return (
    <Badge variant="status" color={config.color}>
      {config.label}
    </Badge>
  );
}

export { STATUS_CONFIG };

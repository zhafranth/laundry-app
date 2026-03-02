import type { InventoryItem, InventoryStatus } from "@/types";

export function getInventoryStatus(item: InventoryItem): InventoryStatus {
  if (item.currentStock <= item.minimumStock) return "kritis";
  if (item.currentStock <= 2 * item.minimumStock) return "perhatian";
  return "aman";
}

const STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; dot: string; bg: string; color: string }
> = {
  aman: { label: "Aman", dot: "#22C55E", bg: "rgba(34,197,94,0.10)", color: "#16A34A" },
  perhatian: { label: "Perhatian", dot: "#FFB703", bg: "rgba(255,183,3,0.10)", color: "#B45309" },
  kritis: { label: "Kritis", dot: "#EF4444", bg: "rgba(239,68,68,0.10)", color: "#DC2626" },
};

interface Props {
  status: InventoryStatus;
  size?: "sm" | "md";
}

export function InventoryStatusBadge({ status, size = "md" }: Props) {
  const cfg = STATUS_CONFIG[status];
  const dotSize = size === "sm" ? 6 : 7;
  const fontSize = size === "sm" ? "0.72rem" : "0.78rem";
  const padding = size === "sm" ? "2px 8px" : "3px 10px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding,
        borderRadius: 999,
        background: cfg.bg,
        fontFamily: "Manrope, system-ui",
        fontWeight: 700,
        fontSize,
        color: cfg.color,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

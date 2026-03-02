"use client";

import { Package, TrendingDown, X } from "lucide-react";
import { useState } from "react";
import type { DashboardAlert } from "@/types";

interface ProAlertBannerProps {
  alerts: DashboardAlert[];
}

const ALERT_CONFIG = {
  stock: {
    icon: Package,
    iconColor: "#EF2D56",
    bg: "rgba(239,45,86,0.06)",
    border: "rgba(239,45,86,0.18)",
    accentColor: "#EF2D56",
  },
  expense: {
    icon: TrendingDown,
    iconColor: "#FF6B35",
    bg: "rgba(255,107,53,0.06)",
    border: "rgba(255,107,53,0.18)",
    accentColor: "#FF6B35",
  },
};

export function ProAlertBanner({ alerts }: ProAlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (!visible.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {visible.map((alert) => {
        const config = ALERT_CONFIG[alert.type];
        const Icon = config.icon;

        return (
          <div
            key={alert.id}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 28,
                height: 28,
                background: `${config.accentColor}18`,
              }}
            >
              <Icon size={14} style={{ color: config.iconColor }} />
            </div>
            <p
              className="flex-1"
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#1A2D45",
                lineHeight: 1.5,
              }}
            >
              {alert.text}
            </p>
            <button
              onClick={() => setDismissed((prev) => new Set([...prev, alert.id]))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#8899AA",
                padding: 2,
                flexShrink: 0,
              }}
              aria-label="Tutup notifikasi"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

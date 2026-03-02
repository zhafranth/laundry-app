"use client";

import { TrendingUp, AlertTriangle, Info } from "lucide-react";
import type { DashboardInsight } from "@/types";

interface ProInsightBoxProps {
  insights: DashboardInsight[];
}

const INSIGHT_CONFIG = {
  success: {
    icon: TrendingUp,
    iconColor: "#00C853",
    bg: "rgba(0,200,83,0.06)",
    border: "rgba(0,200,83,0.15)",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "#FFB703",
    bg: "rgba(255,183,3,0.06)",
    border: "rgba(255,183,3,0.18)",
  },
  info: {
    icon: Info,
    iconColor: "#7C4DFF",
    bg: "rgba(124,77,255,0.06)",
    border: "rgba(124,77,255,0.15)",
  },
};

export function ProInsightBox({ insights }: ProInsightBoxProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {insights.map((insight) => {
        const config = INSIGHT_CONFIG[insight.type];
        const Icon = config.icon;

        return (
          <div
            key={insight.id}
            className="flex items-start gap-3 rounded-xl px-4 py-3"
            style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
            }}
          >
            <Icon size={16} style={{ color: config.iconColor, flexShrink: 0, marginTop: 1 }} />
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#1A2D45",
                lineHeight: 1.5,
              }}
            >
              {insight.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

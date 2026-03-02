"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  /** Percentage change vs reference period. Undefined = no trend to show. */
  changePercent?: number;
  changeLabel?: string;
  subLabel?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

function TrendBadge({ percent }: { percent: number }) {
  const isUp = percent > 0;
  const isFlat = percent === 0;

  const color = isFlat ? "#8899AA" : isUp ? "#00C853" : "#EF2D56";
  const bg = isFlat
    ? "rgba(136,153,170,0.10)"
    : isUp
      ? "rgba(0,200,83,0.10)"
      : "rgba(239,45,86,0.10)";

  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
      style={{
        background: bg,
        color,
        fontSize: "0.7rem",
        fontWeight: 700,
        fontFamily: "Manrope, system-ui",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={11} />
      {isFlat ? "0%" : `${isUp ? "+" : ""}${percent.toFixed(1)}%`}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon,
  iconColor,
  iconBg,
  changePercent,
  changeLabel,
  subLabel,
  isLoading,
  children,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "white",
        boxShadow: "0 2px 8px rgba(11,29,53,0.07)",
        border: "1.5px solid #E8EDF2",
        minHeight: 120,
      }}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 40, height: 40, background: iconBg, color: iconColor }}
        >
          {icon}
        </div>

        {/* Trend badge */}
        {!isLoading && changePercent !== undefined && (
          <TrendBadge percent={changePercent} />
        )}
        {isLoading && <Skeleton style={{ width: 52, height: 22 }} />}
      </div>

      {/* Value */}
      <div>
        {isLoading ? (
          <>
            <Skeleton style={{ width: "60%", height: 28, marginBottom: 6 }} />
            <Skeleton style={{ width: "40%", height: 14 }} />
          </>
        ) : (
          <>
            {/* Custom children (e.g. HealthScoreGauge) or default value */}
            {children ?? (
              <p
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "#0B1D35",
                  lineHeight: 1.2,
                }}
              >
                {value}
              </p>
            )}
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
                fontSize: "0.75rem",
                color: "#8899AA",
                marginTop: 2,
              }}
            >
              {label}
              {changeLabel && changePercent !== undefined && (
                <span style={{ marginLeft: 4 }}>{changeLabel}</span>
              )}
              {subLabel && !changeLabel && (
                <span style={{ marginLeft: 4 }}>{subLabel}</span>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

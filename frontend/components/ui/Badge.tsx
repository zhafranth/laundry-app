"use client";

import { ReactNode } from "react";

type BadgeVariant = "pro" | "count" | "status";
type StatusColor = "success" | "warning" | "error" | "info" | "neutral";

interface BaseBadgeProps {
  className?: string;
}

interface ProBadgeProps extends BaseBadgeProps {
  variant: "pro";
}

interface CountBadgeProps extends BaseBadgeProps {
  variant: "count";
  count: number;
  /** max before showing "+" suffix, default 99 */
  max?: number;
}

interface StatusBadgeProps extends BaseBadgeProps {
  variant: "status";
  color?: StatusColor;
  children: ReactNode;
}

type BadgeProps = ProBadgeProps | CountBadgeProps | StatusBadgeProps;

const STATUS_STYLES: Record<StatusColor, React.CSSProperties> = {
  success: { background: "#00C853", color: "white" },
  warning: { background: "#FFB703", color: "white" },
  error: { background: "#EF2D56", color: "white" },
  info: { background: "#7C4DFF", color: "white" },
  neutral: { background: "rgba(136,153,170,0.12)", color: "#8899AA" },
};

export function Badge(props: BadgeProps) {
  if (props.variant === "pro") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 ${props.className ?? ""}`}
        style={{
          background: "rgba(255,183,3,0.12)",
          color: "#FFB703",
          fontSize: "0.625rem",
          fontWeight: 700,
          fontFamily: "Manrope, system-ui",
          letterSpacing: "0.06em",
          lineHeight: 1,
          border: "1px solid rgba(255,183,3,0.25)",
        }}
      >
        PRO
      </span>
    );
  }

  if (props.variant === "count") {
    const { count, max = 99, className = "" } = props;
    const display = count > max ? `${max}+` : String(count);
    if (count === 0) return null;

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full ${className}`}
        style={{
          minWidth: 18,
          height: 18,
          padding: "0 5px",
          background: "#EF2D56",
          color: "white",
          fontSize: "0.6rem",
          fontWeight: 700,
          fontFamily: "Manrope, system-ui",
          lineHeight: 1,
        }}
      >
        {display}
      </span>
    );
  }

  // status variant
  const { color = "neutral", children, className = "" } = props as StatusBadgeProps;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${className}`}
      style={{
        ...STATUS_STYLES[color],
        fontSize: "0.75rem",
        fontWeight: 700,
        fontFamily: "Manrope, system-ui",
      }}
    >
      {children}
    </span>
  );
}

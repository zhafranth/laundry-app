"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_STYLES = {
  primary: {
    background: "linear-gradient(135deg, #00B4D8, #0077B6)",
    color: "#FFFFFF",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,180,216,0.30)",
  },
  secondary: {
    background: "#FFB703",
    color: "#0B1D35",
    border: "none",
    boxShadow: "0 4px 12px rgba(255,183,3,0.25)",
  },
  outline: {
    background: "transparent",
    color: "#00B4D8",
    border: "1.5px solid #00B4D8",
  },
  ghost: {
    background: "#E8EDF2",
    color: "#0B1D35",
    border: "none",
  },
} as const;

const SIZE_MAP = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${SIZE_MAP[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        ...VARIANT_STYLES[variant],
        fontFamily: "var(--font-heading)",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #00B4D8, #0077B6)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,180,216,0.30)",
  },
  secondary: {
    background: "#E0F7FA",
    color: "#0077B6",
    border: "none",
  },
  outline: {
    background: "white",
    color: "#00B4D8",
    border: "2px solid #00B4D8",
  },
  ghost: {
    background: "#E8EDF2",
    color: "#5A6B80",
    border: "none",
  },
  danger: {
    background: "#EF2D56",
    color: "white",
    border: "none",
  },
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-4 text-xs rounded-[10px]",
  md: "h-12 px-6 text-sm rounded-[12px]",
  lg: "h-14 px-8 text-base rounded-[14px]",
};

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-[700] transition-all duration-150 cursor-pointer select-none",
        "active:scale-[0.98]",
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-50 cursor-not-allowed active:scale-100" : "hover:brightness-110",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...VARIANT_STYLES[variant],
        fontFamily: "Manrope, system-ui",
        ...style,
      }}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

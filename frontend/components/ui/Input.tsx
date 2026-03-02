"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, onRightIconClick, id, className = "", style, ...rest },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            color: error ? "#EF2D56" : "#3D5068",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#8899AA" }}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          {...rest}
          className={["w-full h-12 px-4 text-sm outline-none transition-all duration-150", leftIcon ? "pl-11" : "", rightIcon ? "pr-11" : "", "rounded-[12px]", className].filter(Boolean).join(" ")}
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 500,
            color: "#0B1D35",
            background: "white",
            border: `2px solid ${error ? "#EF2D56" : "#E8EDF2"}`,
            ...style,
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#00B4D8";
            e.currentTarget.style.boxShadow = error
              ? "0 0 0 3px rgba(239,45,86,0.12)"
              : "0 0 0 3px rgba(0,180,216,0.12)";
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF2D56" : "#E8EDF2";
            e.currentTarget.style.boxShadow = "none";
            rest.onBlur?.(e);
          }}
        />

        {rightIcon && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#8899AA" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0B1D35")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8899AA")}
          >
            {rightIcon}
          </button>
        )}
      </div>

      {(error || hint) && (
        <p
          className="text-xs"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
            color: error ? "#EF2D56" : "#8899AA",
          }}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

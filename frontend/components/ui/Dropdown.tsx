"use client";

import { ReactNode, useEffect, useRef } from "react";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** Render a divider above this item */
  dividerAbove?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** Alignment relative to trigger, default "right" */
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  isOpen,
  onOpen,
  onClose,
  align = "right",
  className = "",
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => (isOpen ? onClose() : onOpen())} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 py-1 rounded-[12px] overflow-hidden"
          style={{
            minWidth: 180,
            background: "white",
            boxShadow: "0 8px 24px rgba(11,29,53,0.12), 0 2px 8px rgba(11,29,53,0.06)",
            border: "1px solid #E8EDF2",
            top: "100%",
            ...(align === "right" ? { right: 0 } : { left: 0 }),
            animation: "fade-up 0.15s ease forwards",
          }}
          role="menu"
        >
          {items.map((item, idx) => (
            <div key={idx}>
              {item.dividerAbove && (
                <div
                  style={{ height: 1, background: "#E8EDF2", margin: "4px 0" }}
                  role="separator"
                />
              )}
              <button
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    onClose();
                  }
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
                style={{
                  color: item.danger ? "#EF2D56" : "#1A2D45",
                  fontSize: "0.875rem",
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: 600,
                  background: "transparent",
                  border: "none",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) {
                    (e.currentTarget as HTMLButtonElement).style.background = item.danger
                      ? "rgba(239,45,86,0.06)"
                      : "#F5F7FA";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                {item.icon && (
                  <span
                    style={{
                      color: item.danger ? "#EF2D56" : "#8899AA",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

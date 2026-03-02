"use client";

import { type ReactNode, type CSSProperties, type ElementType } from "react";

interface StarBorderProps {
  as?: ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children?: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
}

export default function StarBorder({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  children,
  style,
  ...rest
}: StarBorderProps) {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-xl ${className}`}
      style={{
        padding: "1px",
        ...style,
      }}
      {...rest}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          overflow: "hidden",
          borderRadius: "inherit",
        }}
      >
        <div
          className="absolute"
          style={{
            top: "-200%",
            left: "-200%",
            right: "-200%",
            bottom: "-200%",
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 90deg, transparent 180deg)`,
            animation: `star-border-spin ${speed} linear infinite`,
          }}
        />
      </div>
      <div
        className="relative z-10 rounded-[inherit]"
        style={{
          background: "inherit",
          backgroundColor: "inherit",
        }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes star-border-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Component>
  );
}

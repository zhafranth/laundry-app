"use client";

import { type CSSProperties } from "react";

interface AuroraProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Aurora({
  colorStops = ["#00B4D8", "#0B1D35", "#FFB703"],
  blend = 0.5,
  amplitude = 1.0,
  speed = 1.0,
  className = "",
  style,
}: AuroraProps) {
  const duration = 8 / speed;

  const gradients = colorStops.map((color, i) => {
    const offset = (i / colorStops.length) * 100;
    const size = 40 + blend * 30;
    return `radial-gradient(ellipse ${size}% ${size}% at ${30 + offset * 0.4}% ${40 + (i % 2) * 20}%, ${color}40 0%, transparent 70%)`;
  });

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={style}
    >
      {colorStops.map((color, i) => {
        const baseDelay = i * (duration / colorStops.length);
        const moveRange = 20 * amplitude;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              background: gradients[i],
              opacity: 0.6 + blend * 0.3,
              animation: `aurora-move-${i} ${duration}s ease-in-out ${baseDelay}s infinite alternate`,
              willChange: "transform",
            }}
          />
        );
      })}
      <style jsx global>{`
        ${colorStops
          .map(
            (_, i) => `
          @keyframes aurora-move-${i} {
            0% {
              transform: translate(${-20 * amplitude}px, ${-15 * amplitude}px) scale(1);
            }
            33% {
              transform: translate(${15 * amplitude}px, ${10 * amplitude}px) scale(1.05);
            }
            66% {
              transform: translate(${-10 * amplitude}px, ${20 * amplitude}px) scale(0.95);
            }
            100% {
              transform: translate(${20 * amplitude}px, ${-10 * amplitude}px) scale(1.02);
            }
          }
        `
          )
          .join("\n")}
      `}</style>
    </div>
  );
}

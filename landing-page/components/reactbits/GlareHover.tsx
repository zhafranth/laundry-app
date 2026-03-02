"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";

interface GlareHoverProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareSize?: number;
  glareAngle?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  style?: CSSProperties;
}

export default function GlareHover({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.4)",
  glareOpacity = 0.8,
  glareSize = 300,
  glareAngle = 135,
  transitionDuration = 300,
  playOnce = false,
  style,
}: GlareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (playOnce && hasPlayed) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (playOnce && hasPlayed) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playOnce) {
      setHasPlayed(true);
    }
  };

  const angleRad = (glareAngle * Math.PI) / 180;
  const gradientX = Math.cos(angleRad);
  const gradientY = Math.sin(angleRad);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          background: `radial-gradient(${glareSize}px circle at ${position.x}px ${position.y}px, ${glareColor} 0%, transparent 70%)`,
          transition: `opacity ${transitionDuration}ms ease`,
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          opacity: isHovered ? glareOpacity * 0.5 : 0,
          background: `linear-gradient(${glareAngle}deg, transparent 40%, ${glareColor} 50%, transparent 60%)`,
          transform: isHovered
            ? `translateX(${(position.x / (containerRef.current?.offsetWidth ?? 1) - 0.5) * 100}%)`
            : "translateX(-100%)",
          transition: `opacity ${transitionDuration}ms ease, transform ${transitionDuration}ms ease`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

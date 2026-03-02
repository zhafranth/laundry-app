"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  style?: CSSProperties;
}

export default function TiltedCard({
  children,
  className = "",
  maxTilt = 15,
  perspective = 1000,
  scale = 1.05,
  speed = 400,
  glare = true,
  maxGlare = 0.3,
  style,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
  );
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [glareOpacity, setGlareOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    );

    if (glare) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY });
      setGlareOpacity(maxGlare);
    }
  };

  const handleMouseLeave = () => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
    );
    setGlareOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform,
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            background: `linear-gradient(
              ${Math.atan2(glarePosition.y - 50, glarePosition.x - 50) * (180 / Math.PI) + 90}deg,
              rgba(255, 255, 255, ${glareOpacity}) 0%,
              transparent 80%
            )`,
            transition: `opacity ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
          }}
        />
      )}
    </div>
  );
}

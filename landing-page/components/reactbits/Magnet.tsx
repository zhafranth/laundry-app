"use client";

import {
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  useCallback,
} from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 0.5,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  className = "",
  style,
}: MagnetProps) {
  const magnetRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !magnetRef.current) return;

      const rect = magnetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        const moveX = distanceX * magnetStrength * strength;
        const moveY = distanceY * magnetStrength * strength;

        setTransform(`translate3d(${moveX}px, ${moveY}px, 0)`);
        setIsActive(true);
      } else {
        setTransform("translate3d(0, 0, 0)");
        setIsActive(false);
      }
    },
    [disabled, padding, magnetStrength]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("translate3d(0, 0, 0)");
    setIsActive(false);
  }, []);

  return (
    <div
      ref={magnetRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{
        transform,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

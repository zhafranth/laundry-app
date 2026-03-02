"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  config?: { tension?: number; friction?: number };
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedContent({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  className = "",
  style,
}: AnimatedContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasAnimated(true);
          }
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, hasAnimated, delay]);

  const sign = reverse ? -1 : 1;
  const translateX = direction === "horizontal" ? sign * distance : 0;
  const translateY = direction === "vertical" ? sign * distance : 0;

  const tension = config.tension ?? 50;
  const friction = config.friction ?? 25;
  const duration = Math.max(0.4, friction * 0.03);
  const easing = `cubic-bezier(${Math.min(0.1, 10 / tension)}, ${Math.min(0.9, friction / 30)}, 0.25, 1)`;

  const animatedStyle: CSSProperties = {
    transform: isVisible
      ? "translate3d(0, 0, 0) scale(1)"
      : `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
    opacity: animateOpacity ? (isVisible ? 1 : initialOpacity) : 1,
    transition: `transform ${duration}s ${easing}, opacity ${duration}s ${easing}`,
    willChange: "transform, opacity",
    ...style,
  };

  return (
    <div ref={ref} className={className} style={animatedStyle}>
      {children}
    </div>
  );
}

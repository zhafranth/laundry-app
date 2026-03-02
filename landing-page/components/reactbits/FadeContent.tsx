"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
  style?: CSSProperties;
}

export default function FadeContent({
  children,
  blur = false,
  duration = 1000,
  easing = "ease-out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = "",
  style,
}: FadeContentProps) {
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

  const durationSec = duration / 1000;

  const fadeStyle: CSSProperties = {
    opacity: isVisible ? 1 : initialOpacity,
    filter: blur ? (isVisible ? "blur(0px)" : "blur(10px)") : undefined,
    transition: [
      `opacity ${durationSec}s ${easing}`,
      blur ? `filter ${durationSec}s ${easing}` : "",
    ]
      .filter(Boolean)
      .join(", "),
    willChange: "opacity, filter",
    ...style,
  };

  return (
    <div ref={ref} className={className} style={fadeStyle}>
      {children}
    </div>
  );
}

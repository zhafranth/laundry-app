"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(
    direction === "down" ? to : from
  );

  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 / duration;
  const stiffness = 100 / (duration * duration);

  const springConfig: SpringOptions = {
    damping,
    stiffness,
    restDelta: 0.001,
  };

  const springValue = useSpring(motionValue, springConfig);

  const handleAnimationStart = useCallback(() => {
    if (onStart) onStart();
  }, [onStart]);

  const handleAnimationEnd = useCallback(() => {
    if (onEnd) onEnd();
  }, [onEnd]);

  useEffect(() => {
    if (isInView && startWhen) {
      const timeout = setTimeout(() => {
        handleAnimationStart();
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [
    isInView,
    startWhen,
    delay,
    motionValue,
    direction,
    from,
    to,
    handleAnimationStart,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const value = Math.round(latest);
      setDisplayValue(value);

      if (
        (direction === "up" && value >= to) ||
        (direction === "down" && value <= from)
      ) {
        handleAnimationEnd();
      }
    });

    return () => unsubscribe();
  }, [springValue, to, from, direction, handleAnimationEnd]);

  const formattedValue = separator
    ? displayValue.toLocaleString("en-US").replace(/,/g, separator)
    : displayValue.toString();

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formattedValue}
    </span>
  );
};

export default CountUp;

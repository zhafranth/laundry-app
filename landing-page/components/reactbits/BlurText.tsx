"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, type TargetAndTransition } from "motion/react";

type AnimationState = TargetAndTransition;

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationState;
  animationTo?: AnimationState;
  easing?: string | number[];
  onAnimationComplete?: () => void;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "-100px",
  animationFrom,
  animationTo,
  easing = [0.25, 0.1, 0.25, 1],
  onAnimationComplete,
}) => {
  const elements = useMemo(() => {
    if (animateBy === "words") {
      return text.split(" ");
    }
    return text.split("");
  }, [text, animateBy]);

  const getDirectionOffset = () => {
    switch (direction) {
      case "top":
        return { y: -20, x: 0 };
      case "bottom":
        return { y: 20, x: 0 };
      case "left":
        return { x: -20, y: 0 };
      case "right":
        return { x: 20, y: 0 };
      default:
        return { y: -20, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  const defaultFrom: AnimationState = animationFrom ?? {
    filter: "blur(10px)",
    opacity: 0,
    y: offset.y,
    x: offset.x,
  };

  const defaultTo: AnimationState = animationTo ?? {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    x: 0,
  };

  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: rootMargin as `${number}px`,
  });

  let completedCount = 0;

  const handleComplete = () => {
    completedCount++;
    if (completedCount === elements.length && onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <p ref={ref} className={`blur-text-wrapper flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={defaultFrom}
          animate={isInView ? defaultTo : defaultFrom}
          transition={{
            duration: 0.5,
            delay: index * (delay / 1000),
            ease: easing as [number, number, number, number],
          }}
          onAnimationComplete={handleComplete}
          style={{
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
        >
          {element === " " ? "\u00A0" : element}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;

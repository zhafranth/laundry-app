"use client";

import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  enableScale?: boolean;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  rotationStart?: string;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  enableBlur: boolean;
  blurStrength: number;
  enableScale: boolean;
}

const Word: React.FC<WordProps> = ({
  children,
  progress,
  range,
  enableBlur,
  blurStrength,
  enableScale,
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const blurValue = useTransform(progress, range, [blurStrength, 0]);
  const scale = useTransform(progress, range, [0.95, 1]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <span className="relative mr-[0.25em] mt-[0.25em] inline-block">
      <span className="invisible">{children}</span>
      <motion.span
        className="absolute left-0 top-0"
        style={{
          opacity,
          filter: enableBlur ? filter : undefined,
          scale: enableScale ? scale : undefined,
          display: "inline-block",
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  enableScale = false,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "5deg",
  rotationStart = "0deg",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
    ...(scrollContainerRef && { container: scrollContainerRef }),
  });

  const words = useMemo(() => children.split(" "), [children]);

  const rotation = useTransform(
    scrollYProgress,
    [0, 1],
    [rotationStart, rotationEnd]
  );

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${containerClassName}`}
      style={{ rotateX: rotation }}
    >
      <p className={`flex flex-wrap ${textClassName}`}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[start, end]}
              enableBlur={enableBlur}
              blurStrength={blurStrength}
              enableScale={enableScale}
            >
              {word}
            </Word>
          );
        })}
      </p>
    </motion.div>
  );
};

export default ScrollReveal;

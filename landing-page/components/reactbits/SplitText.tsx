"use client";

import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView, type TargetAndTransition } from "motion/react";

type AnimationState = TargetAndTransition;

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: AnimationState;
  animationTo?: AnimationState;
  easing?: string | number[];
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify";
  onLetterAnimationComplete?: () => void;
  onWordAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  className = "",
  delay = 100,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  easing = [0.25, 0.1, 0.25, 1],
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
  onWordAnimationComplete,
}) => {
  const words = useMemo(() => text.split(" "), [text]);
  const letters = useMemo(() => {
    const result: { letter: string; wordIndex: number }[] = [];
    words.forEach((word, wordIndex) => {
      for (const letter of word) {
        result.push({ letter, wordIndex });
      }
      if (wordIndex < words.length - 1) {
        result.push({ letter: "\u00A0", wordIndex });
      }
    });
    return result;
  }, [words]);

  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: rootMargin as `${number}px`,
  });

  const [completedLetters, setCompletedLetters] = useState(0);
  const [completedWords, setCompletedWords] = useState(0);
  const totalLetters = letters.length;
  const totalWords = words.length;

  const handleLetterComplete = useCallback(() => {
    setCompletedLetters((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (completedLetters === totalLetters && onLetterAnimationComplete) {
      onLetterAnimationComplete();
    }
  }, [completedLetters, totalLetters, onLetterAnimationComplete]);

  const handleWordComplete = useCallback(() => {
    setCompletedWords((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (completedWords === totalWords && onWordAnimationComplete) {
      onWordAnimationComplete();
    }
  }, [completedWords, totalWords, onWordAnimationComplete]);

  let letterIndex = 0;

  return (
    <p
      ref={ref}
      className={`split-text-wrapper overflow-hidden inline ${className}`}
      style={{ textAlign, whiteSpace: "normal", wordSpacing: "0.25em" }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((letter) => {
            const currentIndex = letterIndex++;
            return (
              <motion.span
                key={currentIndex}
                initial={animationFrom}
                animate={isInView ? animationTo : animationFrom}
                transition={{
                  duration: 0.5,
                  delay: currentIndex * (delay / 1000),
                  ease: easing as [number, number, number, number],
                }}
                onAnimationComplete={handleLetterComplete}
                style={{ display: "inline-block", willChange: "transform, opacity" }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span style={{ display: "inline-block", width: "0.25em" }}>
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </p>
  );
};

export default SplitText;

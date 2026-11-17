"use client";

import { useEffect, useState, useRef } from "react";

export interface AnimatedNumberProps {
  value: number | undefined | null;
  duration?: number; // duration in ms, default 1300ms
  decimals?: number; // number of decimal places
  format?: "integer" | "decimal" | "percent" | "rating" | "raw";
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * AnimatedNumber
 * Smoothly counts up from 0 to target value on mount or value change.
 * Uses high-performance requestAnimationFrame with an easeOutExpo curve for sleek 60-120fps motion.
 */
export function AnimatedNumber({
  value,
  duration = 1300,
  decimals,
  format = "integer",
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedNumberProps) {
  const numericTarget = typeof value === "number" && !isNaN(value) ? value : 0;
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;

    if (numericTarget === 0) {
      setDisplayValue(0);
      return;
    }

    // Ease-Out Expo curve: fast initial acceleration, smooth deceleration to exact finish
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = numericTarget * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [numericTarget, duration]);

  // Formatting helper
  let formattedString = "";
  if (format === "integer") {
    const num = Math.round(displayValue);
    formattedString = new Intl.NumberFormat("en-US").format(num);
  } else if (format === "percent") {
    const dec = decimals ?? 1;
    formattedString = `${displayValue.toFixed(dec)}%`;
  } else if (format === "rating") {
    const dec = decimals ?? 2;
    formattedString = displayValue.toFixed(dec);
  } else if (format === "decimal") {
    const dec = decimals ?? 1;
    formattedString = displayValue.toFixed(dec);
  } else {
    formattedString = displayValue.toString();
  }

  return (
    <span className={className}>
      {prefix}
      {formattedString}
      {suffix}
    </span>
  );
}

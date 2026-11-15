"use client";

import { motion } from "framer-motion";
import { ReactNode, useId } from "react";

export interface SlidingOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SlidingToggleProps<T extends string> {
  options: SlidingOption<T>[];
  value: T;
  onChange: (value: T) => void;
  id?: string;
  size?: "sm" | "md";
  variant?: "pill" | "rounded";
}

export function SlidingToggle<T extends string>({
  options,
  value,
  onChange,
  id,
  size = "sm",
  variant = "rounded",
}: SlidingToggleProps<T>) {
  const autoId = useId();
  const layoutId = id || `sliding-toggle-${autoId}`;

  const isPill = variant === "pill";

  return (
    <div
      className={`relative inline-flex items-center p-1 bg-slate-900/90 border border-slate-800 backdrop-blur-md ${
        isPill ? "rounded-full" : "rounded-xl"
      }`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative z-10 inline-flex items-center gap-1.5 font-mono text-xs font-medium transition-colors duration-200 ${
              size === "sm" ? "px-3 py-1.5" : "px-4 py-2"
            } ${isPill ? "rounded-full" : "rounded-lg"} ${
              isSelected
                ? "text-cyan-300 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 z-[-1] bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/50 shadow-md shadow-cyan-500/20 ${
                  isPill ? "rounded-full" : "rounded-lg"
                }`}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                }}
              />
            )}
            {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

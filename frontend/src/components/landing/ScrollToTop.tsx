"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Force scroll to top on every page reload / refresh
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const toggleVisibility = () => {
        if (window.scrollY > 280) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener("scroll", toggleVisibility, { passive: true });
      return () => window.removeEventListener("scroll", toggleVisibility);
    }
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 25 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center group select-none"
        >
          {/* Tooltip on Hover */}
          <span className="mr-3 px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-cyan-300 bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:inline-block whitespace-nowrap">
            Lên đầu trang ↑
          </span>

          {/* Main Floating Button */}
          <button
            onClick={scrollToTop}
            aria-label="Tua ngược lên đầu trang"
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#071329]/90 hover:bg-[#0c1f42] border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-30 pointer-events-none" />

            {/* Glowing Arrow Icon */}
            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

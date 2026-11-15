"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    if (prefersReducedMotion || !canHover) {
      return;
    }

    setActive(true);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number | null = null;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      // Fluid exponential smoothing (factor 0.12 for snappy yet smooth response)
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      document.documentElement.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`);

      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* 1. Ambient Neon Aura Layer (shifts cyan/purple based on cursor position) */}
      <div className="cursor-glow-ambient" aria-hidden="true" />

      {/* 2. Google Stitch Illuminated Dotted Grid Layer (dots light up under cursor) */}
      {active && <div className="cursor-grid-highlight" aria-hidden="true" />}

      {/* 3. Soft Cursor Halo Spotlight */}
      {active && <div className="cursor-spotlight-orb" aria-hidden="true" />}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
}

export function StitchBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bloomed, setBloomed] = useState(false);

  // Trigger neon entrance animation shortly after mount ("đang không có gì rồi nhảy neon ra")
  useEffect(() => {
    const timer = setTimeout(() => {
      setBloomed(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Canvas particle grid with gentle repulsion physics ("nhảy hiệu ứng nhẹ thôi")
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Gentle mouse repulsion parameters ("vùng lan rộng hơn 1 tí nữa")
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 165, // Vùng lan rộng tự nhiên, bao quát hơn
      repelStrength: 0.95, // Lực đẩy mềm mại, nhịp nhàng
    };

    // Grid configuration - Mật độ hạt dày đặc hơn, khoảng cách 19px
    const spacing = 19; // Số lượng chấm nhiều, mật độ chuẩn Google Stitch
    const dots: Dot[] = [];

    const initDots = () => {
      dots.length = 0;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = c * spacing;
          const originY = r * spacing;
          dots.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            baseRadius: 1.05, // Hạt trắng rõ nét, đậm hơn theo yêu cầu
          });
        }
      }
    };

    setupCanvas();
    initDots();

    // Resize handler with High-DPI support
    const handleResize = () => {
      setupCanvas();
      initDots();
    };

    // Pointer move handler
    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    // Physics constants
    const springFactor = 0.09; // Quick, elastic return
    const friction = 0.84; // Smooth fluid damping

    // Main render loop with batched path optimization (60-120fps silky smooth)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mX = mouse.x;
      const mY = mouse.y;
      const mRadius = mouse.radius;
      const mRadiusSq = mRadius * mRadius;

      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // 1. Calculate distance from cursor
        const dx = dot.x - mX;
        const dy = dot.y - mY;
        const distSq = dx * dx + dy * dy;

        // 2. Gentle quadratic repulsion (tách hạt nhẹ nhàng)
        if (distSq < mRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = Math.pow(1 - dist / mRadius, 2.0) * mouse.repelStrength;
          const angle = Math.atan2(dy, dx);
          dot.vx += Math.cos(angle) * force * 1.35;
          dot.vy += Math.sin(angle) * force * 1.35;
        }

        // 3. Spring physics (kéo hạt về vị trí lưới ban đầu)
        const homeDx = dot.originX - dot.x;
        const homeDy = dot.originY - dot.y;
        dot.vx += homeDx * springFactor;
        dot.vy += homeDy * springFactor;

        // 4. Apply friction
        dot.vx *= friction;
        dot.vy *= friction;

        // 5. Soft displacement clamp (giữ hạt di chuyển nhịp nhàng trên diện rộng)
        const displacement = Math.sqrt(homeDx * homeDx + homeDy * homeDy);
        if (displacement > 9.5) {
          dot.vx *= 0.6;
          dot.vy *= 0.6;
        }

        dot.x += dot.vx;
        dot.y += dot.vy;

        // 6. Fast batched arc: 1 beginPath + 1 fill for all dots = 50x faster execution
        ctx.moveTo(dot.x + dot.baseRadius, dot.y);
        ctx.arc(dot.x, dot.y, dot.baseRadius, 0, Math.PI * 2);
      }

      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#05070b]">
      {/* 1. GOOGLE STITCH CONTINUOUS FLOWING NEON WAVE
          Positioned strictly in the lower-middle half (y: 46% to 100%)
          Upper 46% remains pitch black so text is 100% glare-free & crisp */}
      <div
        className={`absolute left-0 right-0 top-[42%] bottom-0 w-full h-[58%] overflow-visible transition-all duration-700 pointer-events-none ${
          bloomed ? "stitch-neon-entrance-active" : "stitch-neon-entrance-hidden"
        }`}
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1600 700"
          className="w-full h-full preserve-3d animate-stitch-shimmer"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Broad Diffused Color-Bleed Gradient ("Loan màu") */}
            <linearGradient id="stitchGradWide" x1="0%" y1="30%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#312e81" stopOpacity="0.3" />
              <stop offset="15%" stopColor="#4c1d95" stopOpacity="0.75" />
              <stop offset="35%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="52%" stopColor="#06b6d4" stopOpacity="0.95" />
              <stop offset="72%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="90%" stopColor="#c026d3" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.2" />
            </linearGradient>

            {/* Radiant Body Aurora Gradient */}
            <linearGradient id="stitchGradBody" x1="0%" y1="20%" x2="100%" y2="60%">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.4" />
              <stop offset="18%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="38%" stopColor="#00f2fe" stopOpacity="0.98" />
              <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.92" />
              <stop offset="78%" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="95%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>

            {/* Ultra-luminous Electric Core Ribbon */}
            <linearGradient id="stitchGradCore" x1="0%" y1="40%" x2="100%" y2="40%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.1" />
              <stop offset="20%" stopColor="#c084fc" stopOpacity="0.7" />
              <stop offset="42%" stopColor="#00f2fe" stopOpacity="1" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#e879f9" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.1" />
            </linearGradient>

            {/* Secondary Undulating Ribbon Gradient */}
            <linearGradient id="stitchGradSecondary" x1="100%" y1="20%" x2="0%" y2="70%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.25" />
            </linearGradient>

            {/* Gaussian Blur Filters for Smooth Silk Loan Màu */}
            <filter id="stitchBlurBroad" x="-30%" y="-40%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="55" />
            </filter>
            <filter id="stitchBlurMid" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
            <filter id="stitchBlurCore" x="-15%" y="-20%" width="130%" height="140%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {/* 1. Broad Diffused Color-Bleed Foundation Layer ("Loan màu" bao phủ mượt mà) */}
          <path
            d="M -120 280 C 320 440, 560 590, 960 540 C 1260 500, 1450 360, 1750 300"
            fill="none"
            stroke="url(#stitchGradWide)"
            strokeWidth="250"
            strokeLinecap="round"
            filter="url(#stitchBlurBroad)"
            opacity="0.75"
            className="animate-stitch-wave-ambient"
          />

          {/* 2. Secondary Flowing Wave Ribbon (Lượn sóng ngược pha nhịp nhàng) */}
          <path
            d="M -100 350 C 300 520, 720 610, 1060 520 C 1320 440, 1500 280, 1720 260"
            fill="none"
            stroke="url(#stitchGradSecondary)"
            strokeWidth="120"
            strokeLinecap="round"
            filter="url(#stitchBlurMid)"
            opacity="0.75"
            className="animate-stitch-wave-secondary"
          />

          {/* 3. Primary Vibrant Mid-Body Ribbon (Sóng chính lượn sống động) */}
          <path
            d="M -120 280 C 320 440, 560 590, 960 540 C 1260 500, 1450 360, 1750 300"
            fill="none"
            stroke="url(#stitchGradBody)"
            strokeWidth="125"
            strokeLinecap="round"
            filter="url(#stitchBlurMid)"
            opacity="0.9"
            className="animate-stitch-wave-primary"
          />

          {/* 4. Weaving Cyan-Turquoise Accent Ribbon (Dải sóng đan xen chuyển động nhanh) */}
          <path
            d="M -90 320 C 350 490, 680 580, 1040 500 C 1300 420, 1490 310, 1740 330"
            fill="none"
            stroke="url(#stitchGradCore)"
            strokeWidth="50"
            strokeLinecap="round"
            filter="url(#stitchBlurMid)"
            opacity="0.85"
            className="animate-stitch-wave-core"
          />

          {/* 5. Radiant Electric Core Filament (Trục neon phát sáng rực rỡ và dao động mạnh) */}
          <path
            d="M -120 280 C 320 440, 560 590, 960 540 C 1260 500, 1450 360, 1750 300"
            fill="none"
            stroke="url(#stitchGradCore)"
            strokeWidth="42"
            strokeLinecap="round"
            filter="url(#stitchBlurCore)"
            opacity="1"
            className="animate-stitch-wave-core"
          />
        </svg>
      </div>

      {/* 2. GENTLE INTERACTIVE CANVAS DOT GRID ("nhảy hiệu ứng nhẹ thôi")
          Rendered on top of the entire scene including the neon wave */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 transform-gpu"
      />
    </div>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

interface BankItem {
  name: string;
  shortName: string;
  logo: string;
  bgClass: string;
  borderHover: string;
}

const BANKS: BankItem[] = [
  {
    name: "BIDV SmartBanking",
    shortName: "BIDV",
    logo: "/banks/bidv.png",
    bgClass: "bg-white",
    borderHover: "hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
  },
  {
    name: "MB Bank",
    shortName: "MBBank",
    logo: "/banks/mbbank.png",
    bgClass: "bg-white",
    borderHover: "hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
  },
  {
    name: "VCB Digibank",
    shortName: "Vietcombank",
    logo: "/banks/vietcombank.png",
    bgClass: "bg-white",
    borderHover: "hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
  },
  {
    name: "VietinBank iPay",
    shortName: "VietinBank",
    logo: "/banks/vietinbank.png",
    bgClass: "bg-white",
    borderHover: "hover:border-sky-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]",
  },
  {
    name: "TPBank Mobile",
    shortName: "TPBank",
    logo: "/banks/tpbank.png",
    bgClass: "bg-[#5b2384]",
    borderHover: "hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
  },
  {
    name: "TNEX",
    shortName: "TNEX",
    logo: "/banks/tnex.png",
    bgClass: "bg-white",
    borderHover: "hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
  },
  {
    name: "Liobank",
    shortName: "Liobank",
    logo: "/banks/liobank.png",
    bgClass: "bg-black border border-slate-700/80",
    borderHover: "hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
  },
];

const SHOWCASE_WORDS = [
  {
    word: "Intelligence.",
    subtitle: "Lắng nghe tiếng nói thật. Bóc tách 7 khía cạnh trải nghiệm bằng AI.",
  },
  {
    word: "Experience.",
    subtitle: "Giải mã hành trình khách hàng số & khắc phục triệt để điểm nghẽn.",
  },
  {
    word: "Benchmark.",
    subtitle: "Đối sánh năng lực cạnh tranh trực quan giữa 7 ngân hàng thương mại.",
  },
  {
    word: "Sentiment.",
    subtitle: "Định lượng chỉ số cảm xúc ròng (NSS) theo từng phiên bản ứng dụng.",
  },
];

export function StitchShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cycle showcase words & descriptions every 3.2s
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % SHOWCASE_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Track scroll progress as soon as the component enters the screen (start 90%) until it locks to top (start start)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start start"],
  });

  // Physics-based spring smoothing to eliminate mouse-wheel stepping and make the zoom silky smooth (60-120fps)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.25,
    restDelta: 0.0001,
  });

  // Scale: Starts clearly compact (0.60 on desktop, 0.74 on mobile) -> smoothly expands to 1.0 (true full screen) as it enters
  const scale = useTransform(
    smoothProgress,
    [0, 0.95],
    [isMobile ? 0.74 : 0.6, 1.0]
  );

  // Border radius: Smooth transition from 32px rounded floating window -> 0px flush full screen
  const borderRadius = useTransform(smoothProgress, [0, 0.95], ["32px", "0px"]);

  // Opacity: Smooth fade-in at very start
  const opacity = useTransform(smoothProgress, [0, 0.15], [0.85, 1]);

  // Floating live badge: prominent when card is small, smoothly fades out as canvas zooms to full
  const previewBadgeOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const previewBadgeY = useTransform(smoothProgress, [0, 0.3], [0, -15]);

  // Center typography scale & depth on scroll
  const centerScale = useTransform(smoothProgress, [0, 0.95], [0.92, 1.0]);

  // Duplicate bank items 3 times for seamless infinite horizontal loop
  const marqueeBanks = [...BANKS, ...BANKS, ...BANKS];

  return (
    <section
      ref={containerRef}
      className="relative h-[105vh] bg-transparent"
      id="platform"
    >
      {/* Sticky Viewport Container: Stays fixed while user smoothly scrolls through zoom track */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Animated Expanding Canvas (Google Stitch Signature Zoom: small preview -> 100% full screen) */}
        <motion.div
          style={{
            scale,
            borderRadius,
            opacity,
          }}
          className="relative w-full h-full bg-[#02050e]/98 border border-cyan-500/25 shadow-[0_0_120px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-7 select-none"
        >
          {/* =========================================================================
              DYNAMIC LIVING NEON AURORA BLOOM (Harmonious Cyan & Deep Sapphire Midnight)
              ========================================================================= */}
          {/* Blob 1: Vibrant Cyan & Electric Blue Aurora */}
          <motion.div
            animate={{
              x: [-45, 45, -30, -45],
              y: [-25, 35, -20, -25],
              scale: [1, 1.2, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] md:w-[1100px] h-[380px] sm:h-[500px] bg-gradient-to-r from-cyan-500/30 via-sky-600/25 to-blue-700/30 blur-[130px] rounded-full pointer-events-none"
          />

          {/* Blob 2: Deep Sapphire & Navy Fluid Atmosphere */}
          <motion.div
            animate={{
              x: [35, -40, 25, 35],
              y: [20, -30, 15, 20],
              scale: [1.1, 0.9, 1.15, 1.1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[320px] sm:h-[420px] bg-gradient-to-br from-cyan-400/20 via-blue-600/30 to-indigo-800/20 blur-[105px] rounded-full pointer-events-none"
          />

          {/* Blob 3: Center Focal Spotlight directly illuminating behind text */}
          <motion.div
            animate={{
              scale: [0.9, 1.2, 0.9],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[500px] h-[220px] sm:h-[300px] bg-gradient-to-tr from-cyan-400/30 via-sky-300/35 to-blue-500/30 blur-[75px] rounded-full pointer-events-none"
          />

          {/* Canvas Dot Matrix Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.35) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* =========================================================================
              FLOATING PREVIEW BADGE (Visible when small, fades out as you zoom full)
              ========================================================================= */}
          <motion.div
            style={{ opacity: previewBadgeOpacity, y: previewBadgeY }}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/40 shadow-xl backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              ✦ Trực Quan Hóa Trải Nghiệm Ngân Hàng Số • Cuộn để phóng to full
            </span>
          </motion.div>

          {/* =========================================================================
              TOP ROW: Clean Brand Identity (Left) + Dashboard Link (Right)
              ========================================================================= */}
          <div className="relative z-20 flex items-center justify-between w-full">
            {/* Top-Left: Minimal Brand Tag like Stitch BETA */}
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm tracking-wider font-extrabold text-white">
                VDBI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                AI INTELLIGENCE
              </span>
            </div>

            {/* Top-Right: Direct Dashboard Action */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>100% Dữ Liệu Thực</span>
              </span>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-black bg-white hover:bg-slate-200 transition shadow-md shadow-white/10"
              >
                <span>Mở Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              CENTER: DYNAMIC LIVING TYPOGRAPHY & INTRO BUTTON
              (Đã bỏ hoàn toàn các badge con phía trên theo đúng yêu cầu)
              ========================================================================= */}
          <motion.div
            style={{ scale: centerScale }}
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-20 my-auto text-center flex flex-col items-center max-w-4xl px-4 py-4 sm:py-6"
          >
            {/* Giant Editorial Headline (High-Contrast Neon Cyan Gradient - Crystal Clear) */}
            <div className="h-[75px] sm:h-[110px] md:h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={wordIndex}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none"
                >
                  <span className="text-gradient-neon-sync">
                    {SHOWCASE_WORDS[wordIndex].word}
                  </span>
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Concise statement explaining website application */}
            <div className="h-[50px] sm:h-[60px] mt-3 sm:mt-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="text-base sm:text-xl md:text-2xl text-slate-100 font-light max-w-2xl leading-relaxed text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                >
                  {SHOWCASE_WORDS[wordIndex].subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Play Intro / Explore Dashboard Button (Google Stitch capsule button style) */}
            <div className="mt-6 sm:mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-semibold text-cyan-100 bg-[#071329]/90 hover:bg-[#0c1f42] border border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl group"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                  <Play className="w-3 h-3 fill-current translate-x-0.5" />
                </div>
                <span>Khám phá nền tảng</span>
              </Link>
            </div>
          </motion.div>

          {/* =========================================================================
              BOTTOM: BIG, GLOWING BANK LOGOS MARQUEE INSIDE VIDEO CANVAS
              (Ảnh logo ngân hàng to ra, hiệu ứng neon kính cực đẹp, di chuyển tự động)
              ========================================================================= */}
          <div className="relative z-20 w-full overflow-hidden pt-3 pb-2 border-t border-cyan-500/20 bg-slate-950/50 backdrop-blur-md">
            {/* Left & Right Fade Masks for smooth gradient entry/exit */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#02050e] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#02050e] to-transparent z-10" />

            {/* Continuous Infinite Marquee of Large Bank Logos */}
            <div className="animate-marquee-infinite flex gap-4 sm:gap-6 items-center select-none py-1">
              {marqueeBanks.map((bank, idx) => (
                <Link
                  key={idx}
                  href={`/dashboard/banks?bank=${encodeURIComponent(bank.shortName)}`}
                  className={`group relative flex items-center gap-3.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#050a18]/95 border border-cyan-500/25 ${bank.borderHover} shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-105 flex-shrink-0 cursor-pointer overflow-hidden`}
                >
                  {/* Top Specular Neon Laser Line */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

                  {/* Big Bank Logo Image Box */}
                  <div
                    className={`relative w-28 sm:w-36 h-10 sm:h-12 rounded-xl ${bank.bgClass} flex items-center justify-center p-2 shadow-inner overflow-hidden transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      width={140}
                      height={48}
                      className="w-full h-full object-contain"
                      priority={idx < 7}
                    />
                  </div>

                  {/* Bank Label Details */}
                  <div className="flex flex-col text-left pr-2">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors tracking-wide whitespace-nowrap">
                      {bank.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/90 flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Đối sánh AI</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

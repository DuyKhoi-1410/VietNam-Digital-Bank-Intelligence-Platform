"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Play, Sparkles, ArrowRight } from "lucide-react";

const SHOWCASE_WORDS = [
  {
    word: "Intelligence.",
    subtitle: "Lắng nghe tiếng nói thật. Bóc tách 7 khía cạnh trải nghiệm bằng AI.",
    badge: "TRÍ TUỆ NHÂN TẠO • TRẢI NGHIỆM KHÁCH HÀNG SỐ",
  },
  {
    word: "Experience.",
    subtitle: "Giải mã hành trình khách hàng số & khắc phục triệt để điểm nghẽn.",
    badge: "PHÂN TÍCH CHUYÊN SÂU • 7 KHÍA CẠNH NGÂN HÀNG",
  },
  {
    word: "Benchmark.",
    subtitle: "Đối sánh năng lực cạnh tranh trực quan giữa 7 ngân hàng thương mại.",
    badge: "MA TRẬN CẠNH TRANH • DỮ LIỆU THỰC CHỨNG",
  },
  {
    word: "Sentiment.",
    subtitle: "Định lượng chỉ số cảm xúc ròng (NSS) theo từng phiên bản ứng dụng.",
    badge: "CHỈ SỐ CẢM XÚC RÒNG • GOOGLE PLAY REVIEWS",
  },
];

const RUNNING_APPLICATIONS_1 = [
  "LẮNG NGHE TIẾNG NÓI NGƯỜI DÙNG THẬT",
  "BÓC TÁCH CẢM XÚC 7 KHÍA CẠNH BẰNG AI (ABSA)",
  "ĐỊNH LƯỢNG ĐIỂM NGHẼN BẢO MẬT & SINH TRẮC HỌC",
  "TỐC ĐỘ GIAO DỊCH & CHUYỂN TIỀN 24/7",
  "ĐỐI SÁNH NĂNG LỰC CẠNH TRANH 7 NGÂN HÀNG SỐ",
  "RA QUYẾT ĐỊNH NÂNG CẤP SẢN PHẨM CHÍNH XÁC",
  "100% DỮ LIỆU THỰC CHỨNG TỪ GOOGLE PLAY",
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

  // Prompt note (top left): slides and fades in as canvas approaches full screen
  const noteOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);
  const noteY = useTransform(smoothProgress, [0.35, 0.85], [-12, 0]);

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
          className="relative w-full h-full bg-[#03060f]/98 border border-cyan-500/30 shadow-[0_0_120px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none"
        >
          {/* =========================================================================
              DYNAMIC LIVING NEON AURORA BLOOM (Moving, Morphing & Orbiting Light)
              ========================================================================= */}
          {/* Blob 1: Deep Cyan & Blue Orbiting Plasma */}
          <motion.div
            animate={{
              x: [-60, 50, -40, -60],
              y: [-35, 45, -25, -35],
              scale: [1, 1.22, 0.96, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] md:w-[1100px] h-[400px] sm:h-[550px] bg-gradient-to-r from-cyan-500/35 via-blue-600/40 to-violet-600/35 blur-[130px] rounded-full pointer-events-none"
          />

          {/* Blob 2: Violet, Indigo & Emerald Undulating Field */}
          <motion.div
            animate={{
              x: [50, -40, 35, 50],
              y: [30, -40, 20, 30],
              scale: [1.15, 0.9, 1.2, 1.15],
              rotate: [360, 270, 180, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] sm:h-[450px] bg-gradient-to-br from-emerald-400/25 via-cyan-400/35 to-indigo-500/30 blur-[95px] rounded-full pointer-events-none"
          />

          {/* Blob 3: Pulsating Core Light Breathing */}
          <motion.div
            animate={{
              scale: [0.85, 1.3, 0.85],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[520px] h-[240px] sm:h-[340px] bg-gradient-to-tr from-cyan-300/35 via-teal-400/30 to-sky-500/35 blur-[75px] rounded-full pointer-events-none"
          />

          {/* Canvas Dot Matrix Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.4) 1px, transparent 0)`,
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
              TOP ROW: Floating Prompt Note (Google Stitch signature) + Canvas Badge
              ========================================================================= */}
          <div className="relative z-20 flex items-start justify-between w-full">
            {/* Top-Left Floating Prompt Note */}
            <motion.div
              style={{ opacity: noteOpacity, y: noteY }}
              className="max-w-xs sm:max-w-sm rounded-2xl bg-[#0b1120]/90 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl text-left hidden md:block"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ứng Dụng Nền Tảng VDBI</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Giải mã tiếng nói khách hàng trên 7 ứng dụng ngân hàng số thương mại. Bóc tách 7 khía cạnh nghiệp vụ bằng AI để tối ưu sản phẩm và nâng cao năng lực cạnh tranh.
              </p>
            </motion.div>

            {/* Top-Right Canvas Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Không Dùng Dữ Liệu Ảo</span>
              </span>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-black bg-white hover:bg-slate-200 transition shadow-md shadow-white/10"
              >
                <span>Mở Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              CENTER: DYNAMIC LIVING TYPOGRAPHY & INTRO BUTTON (Chuyển động mượt mà)
              ========================================================================= */}
          <motion.div
            style={{ scale: centerScale }}
            animate={{
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-20 my-auto text-center flex flex-col items-center max-w-4xl px-4 py-8"
          >
            {/* Dynamic Superpower Category Badge with AnimatePresence */}
            <div className="h-8 mb-4 sm:mb-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[11px] sm:text-xs font-mono text-cyan-300 shadow-xl backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{SHOWCASE_WORDS[wordIndex].badge}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Giant Editorial Headline (Dynamic Morphing Words with Animated Aurora Shimmer) */}
            <div className="h-[90px] sm:h-[130px] md:h-[160px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={wordIndex}
                  initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -35, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none"
                >
                  <span className="text-gradient-animated drop-shadow-[0_0_55px_rgba(34,211,238,0.65)]">
                    {SHOWCASE_WORDS[wordIndex].word}
                  </span>
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Punchy concise statement explaining website application */}
            <div className="h-[60px] sm:h-[70px] mt-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={wordIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-base sm:text-xl md:text-2xl text-slate-200 font-light max-w-2xl leading-relaxed text-center"
                >
                  {SHOWCASE_WORDS[wordIndex].subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Play Intro / Explore Dashboard Button (Google Stitch capsule button style) */}
            <div className="mt-8 sm:mt-10">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-medium text-slate-100 bg-[#0a1224]/85 hover:bg-[#111e3b] border border-cyan-500/40 hover:border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl group"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                  <Play className="w-3 h-3 fill-current translate-x-0.5" />
                </div>
                <span>Khám phá nền tảng</span>
              </Link>
            </div>
          </motion.div>

          {/* =========================================================================
              BOTTOM: CONTINUOUS HORIZONTAL RUNNING TEXT TICKER (Chữ chạy ngang nói về ứng dụng)
              ========================================================================= */}
          <div className="relative z-20 w-full overflow-hidden py-3 border-t border-cyan-500/20 bg-slate-950/40 backdrop-blur-md">
            {/* Left & Right Fade Masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#03060f] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#03060f] to-transparent z-10" />

            {/* Horizontal Continuous Marquee Row */}
            <div className="animate-marquee-infinite flex gap-8 items-center text-xs font-mono font-bold tracking-wider text-cyan-300/90 whitespace-nowrap">
              {RUNNING_APPLICATIONS_1.concat(RUNNING_APPLICATIONS_1).map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-3 hover:text-white transition-colors cursor-default"
                  >
                    <span className="text-cyan-400 text-sm">✦</span>
                    <span>{item}</span>
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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
import { ArrowRight } from "lucide-react";

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

const RUNNING_APPLICATIONS = [
  "LẮNG NGHE TIẾNG NÓI NGƯỜI DÙNG THẬT",
  "BÓC TÁCH CẢM XÚC 7 KHÍA CẠNH BẰNG AI (ABSA)",
  "ĐỊNH LƯỢNG ĐIỂM NGHẼN BẢO MẬT & SINH TRẮC HỌC",
  "TỐC ĐỘ GIAO DỊCH & CHUYỂN TIỀN 24/7",
  "ĐỐI SÁNH NĂNG LỰC CẠNH TRANH 7 NGÂN HÀNG SỐ",
  "RA QUYẾT ĐỊNH NÂNG CẤP SẢN PHẨM CHÍNH XÁC",
  "100% DỮ LIỆU THỰC CHỨNG TỪ GOOGLE PLAY",
  "THEO DÕI ĐỘ HÀI LÒNG THEO TỪNG PHIÊN BẢN APP",
];

// 24 predetermined floating dust specks with staggered delays, sizes, and natural floating physics
const FLOATING_PARTICLES = [
  { id: 1, left: "7%", size: 3, duration: 8.5, delay: 0.2, xOffset: 20 },
  { id: 2, left: "14%", size: 2.5, duration: 11.2, delay: 2.1, xOffset: -15 },
  { id: 3, left: "22%", size: 4, duration: 7.8, delay: 1.4, xOffset: 30 },
  { id: 4, left: "30%", size: 2, duration: 13.0, delay: 3.5, xOffset: -25 },
  { id: 5, left: "38%", size: 3.5, duration: 9.2, delay: 0.8, xOffset: 15 },
  { id: 6, left: "46%", size: 2.5, duration: 10.5, delay: 4.2, xOffset: -20 },
  { id: 7, left: "53%", size: 4.5, duration: 8.0, delay: 1.9, xOffset: 25 },
  { id: 8, left: "61%", size: 3, duration: 12.1, delay: 2.8, xOffset: -30 },
  { id: 9, left: "69%", size: 2, duration: 9.7, delay: 0.5, xOffset: 18 },
  { id: 10, left: "77%", size: 3.5, duration: 11.5, delay: 3.1, xOffset: -12 },
  { id: 11, left: "84%", size: 4, duration: 8.9, delay: 1.2, xOffset: 22 },
  { id: 12, left: "91%", size: 2.5, duration: 10.2, delay: 4.7, xOffset: -18 },
  { id: 13, left: "11%", size: 3, duration: 12.8, delay: 5.3, xOffset: 25 },
  { id: 14, left: "27%", size: 2, duration: 9.4, delay: 6.1, xOffset: -15 },
  { id: 15, left: "42%", size: 4, duration: 11.0, delay: 5.8, xOffset: 35 },
  { id: 16, left: "58%", size: 3.5, duration: 8.3, delay: 6.5, xOffset: -25 },
  { id: 17, left: "72%", size: 2.5, duration: 13.5, delay: 7.2, xOffset: 15 },
  { id: 18, left: "87%", size: 3, duration: 9.9, delay: 6.9, xOffset: -20 },
  { id: 19, left: "18%", size: 3.5, duration: 10.8, delay: 3.8, xOffset: -10 },
  { id: 20, left: "35%", size: 2.5, duration: 12.3, delay: 4.9, xOffset: 20 },
  { id: 21, left: "50%", size: 4, duration: 7.5, delay: 2.5, xOffset: -18 },
  { id: 22, left: "66%", size: 3, duration: 11.8, delay: 5.0, xOffset: 28 },
  { id: 23, left: "81%", size: 2, duration: 9.1, delay: 1.7, xOffset: -22 },
  { id: 24, left: "95%", size: 3.5, duration: 10.6, delay: 3.3, xOffset: 16 },
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
          className="relative w-full h-full bg-[#02050e]/98 border border-cyan-500/25 shadow-[0_0_120px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none"
        >
          {/* =========================================================================
              DYNAMIC LIVING NEON AURORA BLOOM (Loang màu cực quang MẠNH MẼ & RỰC RỠ)
              ========================================================================= */}
          {/* Blob 1: Massive Deep Cyan & Royal Blue Aurora Flood */}
          <motion.div
            animate={{
              x: [-60, 60, -40, -60],
              y: [-35, 45, -30, -35],
              scale: [1, 1.3, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1200px] md:w-[1500px] h-[450px] sm:h-[650px] bg-gradient-to-r from-cyan-400/50 via-sky-500/45 to-blue-600/50 blur-[140px] rounded-full pointer-events-none"
          />

          {/* Blob 2: Vibrant Sapphire & Electric Aquamarine Fluid Swirl */}
          <motion.div
            animate={{
              x: [50, -55, 40, 50],
              y: [30, -40, 25, 30],
              scale: [1.15, 0.85, 1.25, 1.15],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] md:w-[1200px] h-[400px] sm:h-[550px] bg-gradient-to-br from-teal-300/40 via-cyan-400/55 to-indigo-600/45 blur-[115px] rounded-full pointer-events-none"
          />

          {/* Blob 3: Center Radiant Core Spotlight (Intense High-Luminance Focal Neon Glow) */}
          <motion.div
            animate={{
              scale: [0.95, 1.3, 0.95],
              opacity: [0.65, 0.95, 0.65],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[420px] bg-gradient-to-tr from-cyan-300/60 via-sky-300/65 to-blue-400/55 blur-[85px] rounded-full pointer-events-none"
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
              FLOATING GLOWING PARTICLES (Dấu chấm nhỏ li ti bay từ dưới lên rồi tan biến)
              ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {FLOATING_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  y: "105vh",
                  opacity: 0,
                  x: 0,
                }}
                animate={{
                  y: "-15vh",
                  opacity: [0, 0.25, 0.9, 0.9, 0.35, 0],
                  x: [0, p.xOffset, -p.xOffset / 2, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                }}
                className="absolute rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)]"
              />
            ))}
          </div>

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
              TOP ROW: Minimal Brand Header (Left) + Direct Dashboard Action (Right)
              ========================================================================= */}
          <div className="relative z-20 flex items-center justify-between w-full">
            {/* Top-Left: Minimal Brand Tag */}
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
              CENTER: LARGE VDBI LOGO HERO SHOWCASE & DYNAMIC LIVING TYPOGRAPHY
              (Đã căn giữa 100% hoàn hảo, đã xóa nút Khám phá nền tảng theo đúng yêu cầu)
              ========================================================================= */}
          <motion.div
            style={{ scale: centerScale }}
            className="relative z-20 my-auto mx-auto w-full max-w-4xl text-center flex flex-col items-center justify-center px-4 py-4 sm:py-6"
          >
            {/* ===================================================================
                MAJESTIC VDBI LOGO (Căn giữa hoàn hảo, hiệu ứng neon phát quang nổi khối 3D)
                =================================================================== */}
            <motion.div
              animate={{
                y: [-7, 7, -7],
                scale: [1, 1.025, 1],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="relative mb-6 sm:mb-8 group cursor-pointer"
            >
              {/* Outer Radial Ambient Neon Flare */}
              <div className="absolute inset-0 -m-6 sm:-m-10 bg-gradient-to-r from-cyan-400/40 via-sky-400/50 to-blue-500/40 blur-3xl rounded-full pointer-events-none group-hover:opacity-100 opacity-90 transition-opacity duration-500" />

              {/* Glassmorphic Capsule Showcase for VDBI Brand (100% Vector Sharpness, 0% Blur/Grain) */}
              <div className="relative px-6 sm:px-9 py-4 sm:py-5 rounded-3xl bg-slate-950/75 border border-cyan-400/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.45)] transition-all duration-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_90px_rgba(6,182,212,0.7)] flex items-center justify-center gap-4 sm:gap-6 md:gap-7 overflow-hidden">
                {/* Laser Top Specular Reflection Line */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" />

                {/* VDBI Stylized Emblem Mark */}
                <div className="relative w-16 sm:w-20 md:w-24 h-12 sm:h-14 md:h-16 flex-shrink-0">
                  <Image
                    src="/logo-mark.png"
                    alt="VDBI Emblem"
                    width={495}
                    height={223}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Laser Vertical Divider */}
                <div className="h-10 sm:h-12 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />

                {/* Vector Brand Typography (Ultra-sharp, crystal clear, vibrant neon gradient) */}
                <div className="flex flex-col text-left select-none tracking-tight">
                  <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                    Vietnam Digital
                  </span>
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight flex items-center gap-1.5 sm:gap-2">
                    <span className="text-white">Banking</span>
                    <span className="text-neon-intelligence">
                      Intelligence
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Giant Editorial Headline (High-Contrast Neon Cyan Gradient) */}
            <div className="h-[60px] sm:h-[80px] md:h-[95px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none"
                >
                  <span className="text-gradient-neon-sync">
                    {SHOWCASE_WORDS[wordIndex].word}
                  </span>
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Concise statement explaining website application */}
            <div className="h-[45px] sm:h-[55px] mt-2 sm:mt-3 flex items-center justify-center">
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
          </motion.div>

          {/* =========================================================================
              BOTTOM: CONTINUOUS HORIZONTAL RUNNING APPLICATIONS TICKER
              (Dải chữ chạy ngang vô tận tóm tắt các ứng dụng thực tế của VDBI)
              ========================================================================= */}
          <div className="relative z-20 w-full overflow-hidden py-3 border-t border-cyan-500/20 bg-slate-950/50 backdrop-blur-md">
            {/* Left & Right Fade Masks for smooth gradient entry/exit */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#02050e] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#02050e] to-transparent z-10" />

            {/* Continuous Infinite Marquee Track */}
            <div className="animate-marquee-infinite flex gap-8 items-center text-xs font-mono font-bold tracking-wider text-cyan-300/90 whitespace-nowrap">
              {RUNNING_APPLICATIONS.concat(RUNNING_APPLICATIONS).map(
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

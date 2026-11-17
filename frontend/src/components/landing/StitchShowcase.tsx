"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

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

// 76 predetermined floating dust specks with staggered delays, sizes, and natural floating physics
const FLOATING_PARTICLES = [
  { id: 1, left: "3%", size: 2.5, duration: 8.5, delay: 0.2, xOffset: 20 },
  { id: 2, left: "7%", size: 3.5, duration: 11.2, delay: 2.1, xOffset: -15 },
  { id: 3, left: "10%", size: 2, duration: 7.8, delay: 1.4, xOffset: 30 },
  { id: 4, left: "13%", size: 4, duration: 13.0, delay: 3.5, xOffset: -25 },
  { id: 5, left: "16%", size: 2.5, duration: 9.2, delay: 0.8, xOffset: 15 },
  { id: 6, left: "19%", size: 3, duration: 10.5, delay: 4.2, xOffset: -20 },
  { id: 7, left: "22%", size: 4.5, duration: 8.0, delay: 1.9, xOffset: 25 },
  { id: 8, left: "25%", size: 2, duration: 12.1, delay: 2.8, xOffset: -30 },
  { id: 9, left: "28%", size: 3.5, duration: 9.7, delay: 0.5, xOffset: 18 },
  { id: 10, left: "31%", size: 2.5, duration: 11.5, delay: 3.1, xOffset: -12 },
  { id: 11, left: "34%", size: 4, duration: 8.9, delay: 1.2, xOffset: 22 },
  { id: 12, left: "37%", size: 2, duration: 10.2, delay: 4.7, xOffset: -18 },
  { id: 13, left: "40%", size: 3.5, duration: 12.8, delay: 5.3, xOffset: 25 },
  { id: 14, left: "43%", size: 2.5, duration: 9.4, delay: 6.1, xOffset: -15 },
  { id: 15, left: "46%", size: 4.5, duration: 11.0, delay: 5.8, xOffset: 35 },
  { id: 16, left: "49%", size: 3, duration: 8.3, delay: 6.5, xOffset: -25 },
  { id: 17, left: "52%", size: 2, duration: 13.5, delay: 7.2, xOffset: 15 },
  { id: 18, left: "55%", size: 3.5, duration: 9.9, delay: 6.9, xOffset: -20 },
  { id: 19, left: "58%", size: 2.5, duration: 10.8, delay: 3.8, xOffset: -10 },
  { id: 20, left: "61%", size: 4, duration: 12.3, delay: 4.9, xOffset: 20 },
  { id: 21, left: "64%", size: 2, duration: 7.5, delay: 2.5, xOffset: -18 },
  { id: 22, left: "67%", size: 3.5, duration: 11.8, delay: 5.0, xOffset: 28 },
  { id: 23, left: "70%", size: 2.5, duration: 9.1, delay: 1.7, xOffset: -22 },
  { id: 24, left: "73%", size: 3, duration: 10.6, delay: 3.3, xOffset: 16 },
  { id: 25, left: "76%", size: 2, duration: 12.5, delay: 6.8, xOffset: -18 },
  { id: 26, left: "79%", size: 4, duration: 8.7, delay: 4.5, xOffset: 24 },
  { id: 27, left: "82%", size: 2.5, duration: 10.4, delay: 5.7, xOffset: -22 },
  { id: 28, left: "85%", size: 3, duration: 13.8, delay: 2.3, xOffset: 16 },
  { id: 29, left: "88%", size: 3.5, duration: 9.5, delay: 7.1, xOffset: -28 },
  { id: 30, left: "91%", size: 2, duration: 11.0, delay: 3.9, xOffset: 19 },
  { id: 31, left: "94%", size: 4.5, duration: 8.2, delay: 1.6, xOffset: -14 },
  { id: 32, left: "97%", size: 2.5, duration: 12.0, delay: 5.4, xOffset: 26 },
  { id: 33, left: "5%", size: 3, duration: 9.8, delay: 0.9, xOffset: -17 },
  { id: 34, left: "9%", size: 2, duration: 14.2, delay: 4.0, xOffset: 21 },
  { id: 35, left: "12%", size: 4, duration: 7.9, delay: 6.3, xOffset: -25 },
  { id: 36, left: "15%", size: 2.5, duration: 10.7, delay: 2.7, xOffset: 18 },
  { id: 37, left: "18%", size: 3.5, duration: 11.6, delay: 5.1, xOffset: -20 },
  { id: 38, left: "21%", size: 2, duration: 8.4, delay: 1.1, xOffset: 23 },
  { id: 39, left: "24%", size: 4, duration: 13.2, delay: 4.4, xOffset: -16 },
  { id: 40, left: "27%", size: 2.5, duration: 9.3, delay: 6.6, xOffset: 27 },
  { id: 41, left: "30%", size: 3, duration: 10.9, delay: 3.4, xOffset: -21 },
  { id: 42, left: "33%", size: 4.5, duration: 8.6, delay: 0.4, xOffset: 15 },
  { id: 43, left: "36%", size: 2, duration: 12.7, delay: 5.9, xOffset: -29 },
  { id: 44, left: "39%", size: 3.5, duration: 9.0, delay: 2.0, xOffset: 22 },
  { id: 45, left: "42%", size: 2.5, duration: 11.4, delay: 6.0, xOffset: -18 },
  { id: 46, left: "45%", size: 3, duration: 13.6, delay: 3.7, xOffset: 14 },
  { id: 47, left: "48%", size: 4, duration: 8.1, delay: 1.5, xOffset: -24 },
  { id: 48, left: "51%", size: 2, duration: 10.3, delay: 4.8, xOffset: 20 },
  { id: 49, left: "54%", size: 3.5, duration: 12.2, delay: 2.4, xOffset: -16 },
  { id: 50, left: "57%", size: 2.5, duration: 8.8, delay: 0.6, xOffset: 22 },
  { id: 51, left: "60%", size: 4, duration: 10.9, delay: 3.6, xOffset: -26 },
  { id: 52, left: "63%", size: 2, duration: 7.7, delay: 1.8, xOffset: 19 },
  { id: 53, left: "66%", size: 3, duration: 11.3, delay: 5.2, xOffset: -14 },
  { id: 54, left: "69%", size: 4.5, duration: 9.6, delay: 4.1, xOffset: 28 },
  { id: 55, left: "72%", size: 2.5, duration: 13.4, delay: 6.7, xOffset: -22 },
  { id: 56, left: "75%", size: 3.5, duration: 8.5, delay: 2.9, xOffset: 16 },
  { id: 57, left: "78%", size: 2, duration: 10.6, delay: 0.7, xOffset: -18 },
  { id: 58, left: "81%", size: 4, duration: 12.9, delay: 4.6, xOffset: 24 },
  { id: 59, left: "84%", size: 2.5, duration: 9.1, delay: 3.2, xOffset: -20 },
  { id: 60, left: "87%", size: 3, duration: 11.7, delay: 5.5, xOffset: 17 },
  { id: 61, left: "90%", size: 4.5, duration: 8.0, delay: 1.3, xOffset: -25 },
  { id: 62, left: "93%", size: 2, duration: 13.1, delay: 6.2, xOffset: 21 },
  { id: 63, left: "96%", size: 3.5, duration: 9.4, delay: 2.2, xOffset: -15 },
  { id: 64, left: "2%", size: 2.5, duration: 10.5, delay: 4.3, xOffset: 18 },
  { id: 65, left: "8%", size: 3, duration: 12.4, delay: 1.0, xOffset: -22 },
  { id: 66, left: "14%", size: 4, duration: 8.6, delay: 3.0, xOffset: 25 },
  { id: 67, left: "20%", size: 2, duration: 11.1, delay: 5.6, xOffset: -17 },
  { id: 68, left: "26%", size: 3.5, duration: 9.7, delay: 2.6, xOffset: 20 },
  { id: 69, left: "35%", size: 2.5, duration: 13.0, delay: 4.9, xOffset: -24 },
  { id: 70, left: "44%", size: 4, duration: 8.2, delay: 0.3, xOffset: 16 },
  { id: 71, left: "53%", size: 2, duration: 10.8, delay: 6.4, xOffset: -19 },
  { id: 72, left: "62%", size: 3.5, duration: 12.6, delay: 3.7, xOffset: 23 },
  { id: 73, left: "71%", size: 2.5, duration: 9.0, delay: 1.5, xOffset: -21 },
  { id: 74, left: "80%", size: 4, duration: 11.5, delay: 5.0, xOffset: 18 },
  { id: 75, left: "89%", size: 2, duration: 8.7, delay: 2.7, xOffset: -16 },
  { id: 76, left: "98%", size: 3.5, duration: 12.0, delay: 4.5, xOffset: 22 },
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
    stiffness: 100,
    damping: 28,
    mass: 0.2,
    restDelta: 0.001,
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
              DYNAMIC LIVING NEON AURORA BLOOM (Loang màu cực quang XANH - TÍM MẠNH MẼ & RỰC RỠ)
              ========================================================================= */}
          {/* Blob 1: Massive Deep Cyan & Royal Purple Aurora Flood (Loang màu nền sâu êm ái) */}
          <motion.div
            animate={{
              x: [-60, 60, -40, -60],
              y: [-35, 45, -30, -35],
              scale: [1, 1.25, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] sm:w-[1300px] md:w-[1550px] h-[500px] sm:h-[650px] bg-gradient-to-r from-cyan-400/35 via-indigo-500/30 to-purple-600/35 blur-[130px] rounded-full pointer-events-none transform-gpu will-change-transform"
          />

          {/* Blob 2: Vibrant Electric Violet & Magenta Swirl */}
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[1000px] md:w-[1250px] h-[420px] sm:h-[550px] bg-gradient-to-br from-cyan-300/30 via-purple-500/35 to-fuchsia-500/30 blur-[110px] rounded-full pointer-events-none transform-gpu will-change-transform"
          />

          {/* Blob 3: Center Radiant Core Spotlight - Chiếu sáng êm dịu, loang màu ăn khớp chuẩn xác với chữ (Cyan & Violet & Fuchsia) */}
          <motion.div
            animate={{
              scale: [0.95, 1.15, 0.95],
              opacity: [0.45, 0.7, 0.45],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[350px] sm:h-[450px] bg-gradient-to-r from-cyan-400/40 via-violet-500/45 to-fuchsia-400/40 blur-[85px] rounded-full pointer-events-none transform-gpu will-change-transform"
          />

          {/* Canvas Dot Matrix Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.45) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* =========================================================================
              FLOATING GLOWING PARTICLES (Dấu chấm nhỏ li ti xanh & tím bay từ dưới lên)
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
                className={`absolute rounded-full transform-gpu will-change-transform ${
                  p.id % 2 === 0
                    ? "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)]"
                    : "bg-purple-300 shadow-[0_0_12px_rgba(216,180,254,0.95)]"
                }`}
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
              CENTER: GIGANTIC HERO SHOWCASE (Neon Xanh - Tím Cyber Aurora)
              ========================================================================= */}
          <motion.div
            style={{ scale: centerScale }}
            className="relative z-20 flex-1 my-auto mx-auto w-full max-w-6xl text-center flex flex-col items-center justify-center px-4 py-4"
          >
            {/* Giant Editorial Headline (To rõ, sắc nét, Neon Xanh Tím tương phản cao cực kỳ dễ đọc) */}
            <div className="h-[75px] sm:h-[110px] md:h-[140px] lg:h-[165px] xl:h-[185px] flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={wordIndex}
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem] 2xl:text-[8.5rem] font-black tracking-tight leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] select-none whitespace-nowrap"
                >
                  <span className="text-gradient-neon-sync">
                    {SHOWCASE_WORDS[wordIndex].word}
                  </span>
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Concise statement explaining website application (Độ tương phản cao, chữ sáng rõ ràng) */}
            <div className="h-[50px] sm:h-[65px] mt-4 sm:mt-6 flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-100 font-medium max-w-3xl leading-relaxed text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
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

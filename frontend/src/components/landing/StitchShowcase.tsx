"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Play,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  Lock,
  Smartphone,
  Star,
  Activity,
  ArrowUp,
  Plus,
} from "lucide-react";

const RUNNING_APPLICATIONS_1 = [
  "LẮNG NGHE TIẾNG NÓI NGƯỜI DÙNG THẬT",
  "BÓC TÁCH CẢM XÚC 7 KHÍA CẠNH BẰNG AI (ABSA)",
  "ĐỊNH LƯỢNG ĐIỂM NGHẼN BẢO MẬT & SINH TRẮC HỌC",
  "TỐC ĐỘ GIAO DỊCH & CHUYỂN TIỀN 24/7",
  "ĐỐI SÁNH NĂNG LỰC CẠNH TRANH 7 NGÂN HÀNG SỐ",
  "RA QUYẾT ĐỊNH NÂNG CẤP SẢN PHẨM CHÍNH XÁC",
  "100% DỮ LIỆU THỰC CHỨNG TỪ GOOGLE PLAY",
];

const RUNNING_APPLICATIONS_2 = [
  "PHÂN TÍCH TRẢI NGHIỆM GIAO DIỆN UI/UX",
  "THEO DÕI ĐỘ HÀI LÒNG THEO TỪNG PHIÊN BẢN APP",
  "GIẢI MÃ NGUYÊN NHÂN NGƯỜI DÙNG ĐÁNH GIÁ 1 SAO",
  "CHỈ SỐ CẢM XÚC RÒNG (NET SENTIMENT SCORE)",
  "TỐI ƯU HÓA HÀNH TRÌNH KHÁCH HÀNG SỐ",
  "KHÔNG DÙNG DỮ LIỆU GIẢ LẬP HAY PHỎNG ĐOÁN",
];

export function StitchShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    [isMobile ? 0.74 : 0.60, 1.0]
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
              ORGANIC FLUID NEON AURORA BLOOM (Exact Google Stitch aesthetic from image)
              ========================================================================= */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] md:w-[1100px] h-[400px] sm:h-[550px] bg-gradient-to-r from-cyan-500/30 via-blue-600/35 to-violet-600/30 blur-[130px] rounded-full pointer-events-none animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] h-[300px] sm:h-[400px] bg-gradient-to-br from-emerald-400/25 via-cyan-400/30 to-indigo-500/25 blur-[90px] rounded-full pointer-events-none"
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
              PLAYFUL 3D FLOATING & BOUNCING BANKING STICKERS (Sticker ngân hàng nhảy nhảy)
              ========================================================================= */}
          {/* Sticker 1: Thẻ ngân hàng số (Top Left) */}
          <motion.div
            animate={{
              y: [-12, 14, -12],
              rotate: [-5, 7, -5],
            }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15, rotate: 12, zIndex: 40 }}
            className="absolute top-20 sm:top-24 left-4 sm:left-14 lg:left-24 z-20 px-3.5 py-2.5 rounded-2xl bg-[#0c162c]/90 border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.35)] backdrop-blur-xl flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Thẻ & Chuyển Tiền</span>
              <span className="text-[10px] font-mono text-cyan-300">Giao dịch 24/7 • QR Code</span>
            </div>
          </motion.div>

          {/* Sticker 2: Sinh trắc học & Bảo mật (Top Right) */}
          <motion.div
            animate={{
              y: [14, -12, 14],
              rotate: [6, -6, 6],
            }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            whileHover={{ scale: 1.15, rotate: -10, zIndex: 40 }}
            className="absolute top-24 sm:top-28 right-4 sm:right-14 lg:right-28 z-20 px-3.5 py-2.5 rounded-2xl bg-[#140e2c]/90 border border-violet-400/50 shadow-[0_0_30px_rgba(168,85,247,0.35)] backdrop-blur-xl flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">Sinh Trắc Học</span>
              <span className="text-[10px] font-mono text-violet-300">FaceID • Căn Cước CCCD</span>
            </div>
          </motion.div>

          {/* Sticker 3: Tốc độ & UI/UX (Bottom Left) */}
          <motion.div
            animate={{
              y: [-14, 10, -14],
              rotate: [4, -6, 4],
            }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            whileHover={{ scale: 1.15, rotate: -10, zIndex: 40 }}
            className="absolute bottom-28 sm:bottom-32 left-6 sm:left-16 lg:left-28 z-20 px-3.5 py-2.5 rounded-2xl bg-[#081c1c]/90 border border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-xl hidden sm:flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 font-bold" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Giao Diện & UI/UX</span>
              <span className="text-[10px] font-mono text-emerald-300">Tốc độ mượt mà</span>
            </div>
          </motion.div>

          {/* Sticker 4: 7 Ngân hàng số & Ma trận đối sánh (Bottom Right) */}
          <motion.div
            animate={{
              y: [12, -14, 12],
              rotate: [-5, 7, -5],
            }}
            transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            whileHover={{ scale: 1.15, rotate: 10, zIndex: 40 }}
            className="absolute bottom-28 sm:bottom-32 right-6 sm:right-16 lg:right-28 z-20 px-3.5 py-2.5 rounded-2xl bg-[#1e150a]/90 border border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur-xl hidden sm:flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-110 transition-transform">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">7 Ngân Hàng Số</span>
              <span className="text-[10px] font-mono text-amber-300">Đối sánh cạnh tranh</span>
            </div>
          </motion.div>

          {/* =========================================================================
              CENTER: GIANT EDITORIAL TYPOGRAPHY & INTRO BUTTON (Exact style as "Collaborate.")
              ========================================================================= */}
          <motion.div
            style={{ scale: centerScale }}
            className="relative z-20 my-auto text-center flex flex-col items-center max-w-4xl px-4 py-8"
          >
            {/* Superpower Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 mb-6 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>TRÍ TUỆ NHÂN TẠO • TRẢI NGHIỆM KHÁCH HÀNG SỐ</span>
            </div>

            {/* Giant Editorial Headline (Matches "Collaborate." in Google Stitch image) */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white leading-[1.02]">
              <span className="bg-gradient-to-r from-teal-200 via-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(34,211,238,0.55)]">
                Intelligence.
              </span>
            </h2>

            {/* Punchy concise statement explaining website application */}
            <p className="mt-6 text-base sm:text-xl md:text-2xl text-slate-200 font-light max-w-2xl leading-relaxed">
              Lắng nghe tiếng nói thật. Bóc tách 7 khía cạnh bằng AI. <br className="hidden sm:inline" />
              Đối sánh năng lực & tối ưu trải nghiệm ngân hàng số.
            </p>

            {/* Play Intro / Explore Dashboard Button (Exact Google Stitch button style from image) */}
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-medium text-slate-100 bg-[#0a1224]/80 hover:bg-[#111e3b] border border-cyan-500/40 hover:border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl group"
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

            {/* Horizontal Continuous Marquee Row 1 */}
            <div className="animate-marquee-infinite flex gap-8 items-center text-xs font-mono font-bold tracking-wider text-cyan-300/90 whitespace-nowrap">
              {RUNNING_APPLICATIONS_1.concat(RUNNING_APPLICATIONS_1).map((item, idx) => (
                <span key={idx} className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
                  <span className="text-cyan-400 text-sm">✦</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

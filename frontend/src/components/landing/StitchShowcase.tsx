"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  MousePointer,
  ZoomIn,
  Hand,
  Sparkles,
  ArrowUp,
  Plus,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Activity,
} from "lucide-react";

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

  // Scale: Starts clearly compact (0.60 on desktop, 0.74 on mobile) -> smoothly expands to 1.0 (true full screen) as it enters and moves to top
  const scale = useTransform(
    smoothProgress,
    [0, 1],
    [isMobile ? 0.74 : 0.60, 1.0]
  );

  // Border radius: Smooth transition from 32px rounded floating window -> 0px flush full screen
  const borderRadius = useTransform(smoothProgress, [0, 1], ["32px", "0px"]);

  // Opacity: Smooth fade-in at very start
  const opacity = useTransform(smoothProgress, [0, 0.15], [0.85, 1]);

  // Floating live badge: prominent when card is small, smoothly fades out as canvas zooms to full
  const previewBadgeOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);
  const previewBadgeY = useTransform(smoothProgress, [0, 0.35], [0, -15]);

  // Floating parallax and depth scale for the 3 internal cards
  const cardsScale = useTransform(smoothProgress, [0, 1], [0.92, 1.0]);
  const cardY1 = useTransform(smoothProgress, [0, 1], [25, 0]);
  const cardY2 = useTransform(smoothProgress, [0, 1], [0, 0]);
  const cardY3 = useTransform(smoothProgress, [0, 1], [30, 0]);

  // Prompt note (top left): slides and fades in as canvas approaches full screen
  const noteOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);
  const noteY = useTransform(smoothProgress, [0.35, 0.85], [-12, 0]);

  // Floating vertical toolstrip (right edge): slides in smoothly
  const toolstripOpacity = useTransform(smoothProgress, [0.40, 0.90], [0, 1]);
  const toolstripX = useTransform(smoothProgress, [0.40, 0.90], [24, 0]);

  // Bottom prompt bar: slides up effortlessly into position
  const barY = useTransform(smoothProgress, [0.35, 0.85], [25, 0]);
  const barOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-[180vh] bg-transparent"
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
          className="relative w-full h-full bg-[#070b14]/95 border border-cyan-500/30 shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none"
        >
          {/* Canvas Ambient Aurora Lighting */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[480px] h-[380px] bg-violet-600/15 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[620px] h-[260px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

          {/* Canvas Dot Matrix Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* =========================================================================
              FLOATING PREVIEW BADGE (Prominent when small, fades out as you zoom full)
              ========================================================================= */}
          <motion.div
            style={{ opacity: previewBadgeOpacity, y: previewBadgeY }}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/40 shadow-xl backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              ✦ VDBI Interactive Canvas • Cuộn để phóng to full
            </span>
          </motion.div>

          {/* =========================================================================
              TOP ROW: Floating Prompt Note (Google Stitch signature) + Canvas Badge
              ========================================================================= */}
          <div className="relative z-20 flex items-start justify-between w-full">
            {/* Top-Left Floating Prompt Note (Exact Stitch UX) */}
            <motion.div
              style={{ opacity: noteOpacity, y: noteY }}
              className="max-w-xs sm:max-w-sm rounded-2xl bg-[#0b1120]/90 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl text-left hidden md:block"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <div className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>VDBI Intelligence Canvas</span>
                </div>
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Tách bạch điểm sao và bản chất trải nghiệm. Bóc tách 7 khía cạnh cốt lõi (ABSA) trên 19.303 đánh giá xác thực từ 7 ngân hàng thương mại Việt Nam.
              </p>
            </motion.div>

            {/* Top-Right Canvas Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Mô Hình ABSA Trực Tuyến</span>
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
              CENTER: 3 FLOATING INTERACTIVE DESIGN CARDS (Google Stitch Aesthetic)
              ========================================================================= */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6 overflow-hidden">
            <motion.div
              style={{ scale: cardsScale }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl items-center"
            >
              {/* Card 1: Macro Market & Scorecard */}
              <motion.div
                style={{ y: cardY1 }}
                className="hidden md:flex flex-col rounded-2xl bg-gradient-to-b from-[#0e172a]/95 to-[#090d16]/95 border border-cyan-500/30 hover:border-cyan-400/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                      M1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">Thị Trường Ngân Hàng</h4>
                      <p className="text-[10px] text-slate-400 font-mono">19.303 phản hồi hợp lệ</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    4.12 ★ Avg
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tỷ lệ Tích Cực (Positive)</span>
                    <span className="text-emerald-400 font-bold font-mono">64.8%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-400 h-full w-[64.8%]" />
                    <div className="bg-amber-400 h-full w-[7.9%]" />
                    <div className="bg-rose-500 h-full w-[27.3%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span className="text-emerald-400">● Khen: 12.508</span>
                    <span className="text-amber-400">● Trung: 1.530</span>
                    <span className="text-rose-400">● Chê: 5.265</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Theo dõi: 7 ngân hàng</span>
                  <span className="text-cyan-400 font-mono flex items-center gap-1">
                    Khám phá <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Centerpiece - ABSA Aspect Radar & Heatmap */}
              <motion.div
                style={{ y: cardY2 }}
                className="flex flex-col rounded-2xl bg-gradient-to-b from-[#111c35]/98 to-[#0b101c]/98 border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.25)] p-5 backdrop-blur-2xl transition-all duration-300 relative group"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                  Lõi Phân Tích ABSA
                </div>

                <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                      M2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">7 Khía Cạnh Cốt Lõi</h4>
                      <p className="text-[10px] text-slate-400 font-mono">13.864 câu bóc tách</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    Net Sentiment
                  </span>
                </div>

                {/* Micro Aspect Bars Preview */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-[11px]">Giao diện & UI/UX</span>
                    <span className="text-emerald-400 font-mono font-semibold">+27.0 (Khen)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[78%]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-[11px]">Giao dịch & Chuyển tiền</span>
                    <span className="text-rose-400 font-mono font-semibold">-41.7 (Lỗi)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[65%]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-[11px]">Bảo mật & Đăng nhập</span>
                    <span className="text-rose-400 font-mono font-semibold">-75.6 (Sinh trắc)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[88%]" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Chỉ số NSS Chuẩn
                  </span>
                  <Link href="/dashboard/banks" className="hover:underline font-mono text-[10px]">
                    Xem Radar →
                  </Link>
                </div>
              </motion.div>

              {/* Card 3: Competitive Benchmark & Verbatim Review Explorer */}
              <motion.div
                style={{ y: cardY3 }}
                className="hidden md:flex flex-col rounded-2xl bg-gradient-to-b from-[#0e172a]/95 to-[#090d16]/95 border border-violet-500/30 hover:border-violet-400/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-mono font-bold text-xs">
                      M3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">Đối Sánh Cạnh Tranh</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Ma trận so sánh 7 ngân hàng</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-violet-300 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                    Benchmark
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between">
                    <span className="text-slate-300 font-medium">BIDV SmartBanking</span>
                    <span className="text-emerald-400 font-mono font-bold">4.21 ★</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between">
                    <span className="text-slate-300 font-medium">VCB Digibank</span>
                    <span className="text-emerald-400 font-mono font-bold">4.18 ★</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between">
                    <span className="text-slate-300 font-medium">MB Bank</span>
                    <span className="text-amber-400 font-mono font-bold">3.73 ★</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Khoảng cách hiệu năng: 0.48★</span>
                  <Link href="/dashboard/benchmark" className="text-violet-400 font-mono flex items-center gap-1 hover:underline">
                    So sánh <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* =========================================================================
              FLOATING VERTICAL TOOLBAR (Right edge - Exact Google Stitch UI)
              ========================================================================= */}
          <motion.div
            style={{ opacity: toolstripOpacity, x: toolstripX }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2 p-1.5 rounded-2xl bg-[#0b1120]/90 backdrop-blur-xl border border-slate-700/70 shadow-2xl"
          >
            <button
              className="p-2 rounded-xl text-cyan-400 bg-cyan-500/15 hover:bg-cyan-500/25 transition"
              title="Công cụ chọn (Pointer)"
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Phóng to chi tiết (Zoom)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Di chuyển canvas (Pan)"
            >
              <Hand className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Trí tuệ AI (Insights)"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </motion.div>

          {/* =========================================================================
              BOTTOM ROW: Stitch Signature Prompt Input Bar + Scroll Continuity Guide
              ========================================================================= */}
          <motion.div
            style={{ y: barY, opacity: barOpacity }}
            className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center gap-2"
          >
            {/* Floating Prompt Bar (Google Stitch equivalent) */}
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-[#0d1424]/90 hover:bg-[#111a30] border border-slate-700/80 hover:border-cyan-500/40 shadow-2xl backdrop-blur-xl transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 transition">
                  Khám phá toàn bộ 5 Module phân tích trên Dashboard...
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <ArrowUp className="w-4 h-4 font-bold" />
              </div>
            </Link>

            {/* Scroll Indicator Prompt */}
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
              <span>Cuộn tiếp để xem phương pháp luận & giá trị cốt lõi</span>
              <span className="animate-bounce">↓</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

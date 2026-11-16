"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  MousePointer,
  ZoomIn,
  Hand,
  Sparkles,
  ArrowUp,
  Plus,
  Play,
  Pause,
  BrainCircuit,
  GitCompare,
  ArrowRight,
  Radio,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2,
  Scan,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function StitchShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(1); // 0: Lắng nghe, 1: AI ABSA, 2: Đối sánh
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-cycle through the 3 cards like a dynamic product demo video
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  // Floating parallax and depth scale for the 3 internal cards
  const cardsScale = useTransform(smoothProgress, [0, 0.95], [0.92, 1.0]);

  // Prompt note (top left): slides and fades in as canvas approaches full screen
  const noteOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);
  const noteY = useTransform(smoothProgress, [0.35, 0.85], [-12, 0]);

  // Floating vertical toolstrip (right edge): slides in smoothly
  const toolstripOpacity = useTransform(smoothProgress, [0.40, 0.85], [0, 1]);
  const toolstripX = useTransform(smoothProgress, [0.40, 0.85], [24, 0]);

  // Bottom prompt bar: slides up effortlessly into position
  const barY = useTransform(smoothProgress, [0.35, 0.85], [25, 0]);
  const barOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);

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
          className="relative w-full h-full bg-[#050811]/95 border border-cyan-500/30 shadow-[0_0_100px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none"
        >
          {/* =========================================================================
              CANVAS AMBIENT LIQUID NEON AURORA (Google Stitch Signature Glow)
              ========================================================================= */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-violet-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/15 blur-[160px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: "7s" }} />

          {/* Canvas Dot Matrix Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.35) 1px, transparent 0)`,
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
              ✦ Khám phá Năng lực Nền tảng • Cuộn để phóng to full
            </span>
          </motion.div>

          {/* =========================================================================
              TOP ROW: Floating Prompt Note (Google Stitch signature) + Canvas Badge
              ========================================================================= */}
          <div className="relative z-20 flex items-start justify-between w-full">
            {/* Top-Left Floating Prompt Note (Exact Google Stitch UX: Purpose Note) */}
            <motion.div
              style={{ opacity: noteOpacity, y: noteY }}
              className="max-w-xs sm:max-w-sm rounded-2xl bg-[#0b1120]/90 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl text-left hidden md:block"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nền Tảng Này Dùng Làm Gì?</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Chuyển hóa hàng ngàn phản hồi rời rạc trên kho ứng dụng thành bản đồ hành động sắc nét. Thấu hiểu điểm nghẽn, bóc tách tính năng bằng AI và nâng cấp trải nghiệm ngân hàng số.
              </p>
            </motion.div>

            {/* Top-Right Canvas Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>3 Trụ Cột Năng Lực Trực Quan</span>
              </span>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-black bg-white hover:bg-slate-200 transition shadow-md shadow-white/10"
              >
                <span>Trải nghiệm Ngay</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              CENTER: 3D DYNAMIC FLOATING CARDS (AUTO-CYCLE & INTERACTIVE SWAPPING)
              ========================================================================= */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 sm:my-4 overflow-hidden perspective-[1200px]">
            {/* The 3 Tall Canvas Displays with Neon Aura (Matches Google Stitch Image) */}
            <motion.div
              style={{ scale: cardsScale }}
              className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl"
            >
              {/* =====================================================================
                  CARD 0: LẮNG NGHE NGƯỜI DÙNG THẬT (Cyan / Electric Blue Neon)
                  ===================================================================== */}
              <motion.div
                onClick={() => setActiveCard(0)}
                animate={{
                  scale: activeCard === 0 ? 1.05 : 0.94,
                  y: activeCard === 0 ? -10 : 10,
                  rotateY: activeCard === 0 ? 0 : 6,
                  opacity: activeCard === 0 ? 1 : 0.65,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className={`relative flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] h-[400px] sm:h-[430px] rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-shadow duration-500 overflow-hidden backdrop-blur-2xl ${
                  activeCard === 0
                    ? "bg-[#0b152a]/95 border-2 border-cyan-400 shadow-[0_0_60px_rgba(6,182,212,0.45)] z-30"
                    : "bg-[#080e1c]/80 border border-slate-800 hover:border-cyan-500/40 z-10"
                }`}
              >
                {/* Internal Fluid Neon Glow */}
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/25 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/25 blur-3xl rounded-full pointer-events-none" />

                {/* Card Header */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40">
                      <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                      TRỤ CỘT 01
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      Lắng nghe
                    </span>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                    Lắng Nghe Người Dùng Thật
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
                    Thu thập hàng ngàn phản hồi thực tế từ kho ứng dụng, khử trùng lặp và làm sạch để thấu cảm trải nghiệm người dùng.
                  </p>
                </div>

                {/* Animated Interactive Visual: Floating Feedback Stream */}
                <div className="relative z-10 space-y-2.5 my-auto">
                  <motion.div
                    animate={{ x: activeCard === 0 ? [0, 4, 0] : 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="p-3 rounded-2xl bg-[#0e1c36]/90 border border-cyan-500/30 text-[11px] text-slate-200 shadow-lg flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">&quot;Giao diện chuyển tiền nhanh, mượt&quot;</span>
                  </motion.div>

                  <motion.div
                    animate={{ x: activeCard === 0 ? [0, -4, 0] : 0 }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="p-3 rounded-2xl bg-[#0e1c36]/90 border border-rose-500/30 text-[11px] text-slate-200 shadow-lg flex items-center gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="truncate">&quot;Quét khuôn mặt hay báo lỗi liên tục&quot;</span>
                  </motion.div>

                  <motion.div
                    animate={{ x: activeCard === 0 ? [0, 4, 0] : 0 }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="p-3 rounded-2xl bg-[#0e1c36]/90 border border-amber-500/30 text-[11px] text-slate-200 shadow-lg flex items-center gap-2.5"
                  >
                    <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="truncate">&quot;Cập nhật bản mới hay bị văng đột ngột&quot;</span>
                  </motion.div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-300 font-mono">
                  <span>Tiếng nói xác thực</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* =====================================================================
                  CARD 1: AI BÓC TÁCH 7 KHÍA CẠNH ABSA (Emerald / Cyan Neon Centerpiece)
                  ===================================================================== */}
              <motion.div
                onClick={() => setActiveCard(1)}
                animate={{
                  scale: activeCard === 1 ? 1.05 : 0.94,
                  y: activeCard === 1 ? -10 : 10,
                  rotateY: activeCard === 1 ? 0 : 0,
                  opacity: activeCard === 1 ? 1 : 0.65,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className={`relative flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] h-[400px] sm:h-[430px] rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-shadow duration-500 overflow-hidden backdrop-blur-2xl ${
                  activeCard === 1
                    ? "bg-[#091a24]/95 border-2 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.45)] z-30"
                    : "bg-[#06121a]/80 border border-slate-800 hover:border-emerald-500/40 z-10"
                }`}
              >
                {/* Center Highlight Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-[10px] font-bold text-slate-950 uppercase tracking-wider shadow-lg flex items-center gap-1 z-30">
                  <Sparkles className="w-3 h-3" />
                  <span>Trọng Tâm Công Nghệ</span>
                </div>

                {/* Internal Fluid Neon Glow */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/25 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/25 blur-3xl rounded-full pointer-events-none" />

                {/* Card Header */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-3 pt-1 border-b border-emerald-500/20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-400/40">
                      <BrainCircuit className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      TRỤ CỘT 02
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">AI Đa chiều</span>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                    Bóc Tách Khía Cạnh Bằng AI
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
                    Mô hình ABSA tự động chẻ nhỏ từng câu phức tạp thành 7 khía cạnh độc lập, tách bạch giữa điểm số sao và bản chất tính năng.
                  </p>
                </div>

                {/* Animated Interactive Visual: AI Sentence Decomposition */}
                <div className="relative z-10 space-y-2 my-auto">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                      <span>CÂU NGUYÊN BẢN</span>
                      <span className="text-emerald-400 font-bold">AI CHẺ NHỎ</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e2424]/90 border border-emerald-500/20">
                        <span className="text-[10px] text-slate-200 truncate">&quot;Giao diện trực quan đẹp&quot;</span>
                        <span className="text-[9px] font-mono font-semibold text-emerald-400 px-1 py-0.5 rounded bg-emerald-500/10 flex-shrink-0">
                          UI/UX • Khen
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e2424]/90 border border-rose-500/20">
                        <span className="text-[10px] text-slate-200 truncate">&quot;nhưng chuyển tiền chậm&quot;</span>
                        <span className="text-[9px] font-mono font-semibold text-rose-400 px-1 py-0.5 rounded bg-rose-500/10 flex-shrink-0">
                          Chuyển tiền • Lỗi
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e2424]/90 border border-amber-500/20">
                        <span className="text-[10px] text-slate-200 truncate">&quot;quét vân tay hay đơ&quot;</span>
                        <span className="text-[9px] font-mono font-semibold text-amber-400 px-1 py-0.5 rounded bg-amber-500/10 flex-shrink-0">
                          Bảo mật • Sửa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    7 khía cạnh độc lập
                  </span>
                  <span>Khám phá →</span>
                </div>
              </motion.div>

              {/* =====================================================================
                  CARD 2: ĐỐI SÁNH & RA QUYẾT ĐỊNH (Violet / Fuchsia Neon)
                  ===================================================================== */}
              <motion.div
                onClick={() => setActiveCard(2)}
                animate={{
                  scale: activeCard === 2 ? 1.05 : 0.94,
                  y: activeCard === 2 ? -10 : 10,
                  rotateY: activeCard === 2 ? 0 : -6,
                  opacity: activeCard === 2 ? 1 : 0.65,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className={`relative flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] h-[400px] sm:h-[430px] rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-shadow duration-500 overflow-hidden backdrop-blur-2xl ${
                  activeCard === 2
                    ? "bg-[#18112c]/95 border-2 border-violet-400 shadow-[0_0_60px_rgba(168,85,247,0.45)] z-30"
                    : "bg-[#110c20]/80 border border-slate-800 hover:border-violet-500/40 z-10"
                }`}
              >
                {/* Internal Fluid Neon Glow */}
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-violet-600/25 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-fuchsia-600/25 blur-3xl rounded-full pointer-events-none" />

                {/* Card Header */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-violet-500/20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-violet-300 bg-violet-950/70 border border-violet-500/40">
                      <GitCompare className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                      TRỤ CỘT 03
                    </span>
                    <span className="text-[10px] font-mono text-violet-300 flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      Đối sánh
                    </span>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                    Đối Sánh & Ra Quyết Định
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
                    Đặt các ngân hàng lên cùng ma trận đối sánh trực quan, nhận diện điểm mạnh, điểm nghẽn và đưa ra quyết định nâng cấp sản phẩm.
                  </p>
                </div>

                {/* Animated Interactive Visual: Benchmark Gauges */}
                <div className="relative z-10 space-y-2.5 my-auto">
                  <div className="p-3 rounded-2xl bg-[#201438]/90 border border-violet-500/30 text-xs space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Ma trận đối sánh trực tiếp</span>
                        <span className="text-violet-300 font-mono font-bold">2-4 Ngân hàng</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full w-[85%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Xác định khoảng cách năng lực</span>
                        <span className="text-cyan-300 font-mono font-bold">Chênh lệch</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[70%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Đề xuất ưu tiên xử lý cho Product</span>
                        <span className="text-emerald-300 font-mono font-bold">Hành động</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full w-[90%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 pt-3 border-t border-violet-500/20 flex items-center justify-between text-xs text-violet-300 font-mono">
                  <span>Vị thế cạnh tranh</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </motion.div>

            {/* Video-style Demo Switcher Controls (Auto-cycle pills + Play/Pause) */}
            <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 z-30">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/60 text-slate-300 hover:text-white transition shadow-lg flex items-center justify-center"
                title={isPlaying ? "Tạm dừng tự động chuyển" : "Tiếp tục tự động chuyển như video"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveCard(0)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition ${
                    activeCard === 0
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  01 Lắng nghe
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCard(1)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition ${
                    activeCard === 1
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  02 Bóc tách ABSA
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCard(2)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition ${
                    activeCard === 2
                      ? "bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  03 Đối sánh
                </button>
              </div>
            </div>
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
                  Khám phá toàn bộ tính năng và công cụ trên Dashboard...
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

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
  MessageSquareText,
  BrainCircuit,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Radio,
  SlidersHorizontal,
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
  const cardY1 = useTransform(smoothProgress, [0, 0.95], [25, 0]);
  const cardY2 = useTransform(smoothProgress, [0, 0.95], [0, 0]);
  const cardY3 = useTransform(smoothProgress, [0, 0.95], [30, 0]);

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
              ✦ Khám phá Năng lực Nền tảng • Cuộn để phóng to full
            </span>
          </motion.div>

          {/* =========================================================================
              TOP ROW: Floating Prompt Note (Google Stitch signature) + Canvas Badge
              ========================================================================= */}
          <div className="relative z-20 flex items-start justify-between w-full">
            {/* Top-Left Floating Prompt Note (Google Stitch UX: Purpose Statement) */}
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
                <span>3 Trụ Cột Năng Lực Cốt Lõi</span>
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
              CENTER: 3 ANIMATED 3D FLOATING CARDS (Introducing Platform Purpose)
              ========================================================================= */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6 overflow-hidden perspective-[1000px]">
            <motion.div
              style={{ scale: cardsScale }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full max-w-5xl items-stretch"
            >
              {/* =========================================================================
                  CARD 1: LẮNG NGHE NGƯỜI DÙNG THỰC (Voice of Customer)
                  ========================================================================= */}
              <motion.div
                style={{ y: cardY1 }}
                animate={{
                  y: [0, -8, 0],
                  rotateZ: [-0.4, 0.4, -0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.03,
                  rotateY: 4,
                  rotateX: -2,
                  transition: { duration: 0.2 },
                }}
                className="hidden md:flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0e172a]/95 via-[#0b1220]/95 to-[#080d16]/95 border border-cyan-500/30 hover:border-cyan-400/70 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* 3D Glass Glow Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-300" />

                <div>
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
                      <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                      TRỤ CỘT 01
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Tiếng nói khách hàng</span>
                  </div>

                  {/* Title & Purpose Description */}
                  <h3 className="mt-4 text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    Lắng Nghe Người Dùng Thật
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-normal">
                    Thu thập hàng ngàn phản hồi thực tế trên kho ứng dụng, khử trùng lặp và làm sạch để nắm bắt chính xác trải nghiệm người dùng mỗi ngày.
                  </p>

                  {/* 3D Visual Floating Interaction Elements (Speech Bubbles Mockup) */}
                  <div className="mt-5 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between shadow-sm group-hover:border-cyan-500/30 transition">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">&quot;Giao diện mới chuyển tiền rất mượt&quot;</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 flex-shrink-0">Khen</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between shadow-sm group-hover:border-cyan-500/30 transition">
                      <div className="flex items-center gap-2 truncate">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">&quot;Xác thực khuôn mặt báo lỗi liên tục&quot;</span>
                      </div>
                      <span className="text-[9px] font-mono text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 flex-shrink-0">Điểm nghẽn</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between shadow-sm group-hover:border-cyan-500/30 transition">
                      <div className="flex items-center gap-2 truncate">
                        <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">&quot;Vừa cập nhật phiên bản mới là bị văng&quot;</span>
                      </div>
                      <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 flex-shrink-0">Cần sửa</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-mono">
                  <span>Khám phá tiếng nói thật</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* =========================================================================
                  CARD 2: TRÍ TUỆ NHẬN THỨC ABSA (Core AI Engine - Centerpiece)
                  ========================================================================= */}
              <motion.div
                style={{ y: cardY2 }}
                animate={{
                  y: [-3, 5, -3],
                  scale: [1, 1.015, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.04,
                  rotateY: 0,
                  rotateX: -3,
                  transition: { duration: 0.2 },
                }}
                className="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#111e38]/98 via-[#0c1424]/98 to-[#070b14]/98 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.3)] p-5 backdrop-blur-2xl transition-all duration-300 relative group cursor-pointer overflow-hidden"
              >
                {/* Center Highlight Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  <span>Trọng Tâm Công Nghệ</span>
                </div>

                {/* 3D Glass Glow Background Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-400/15 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan-400/25 transition-all duration-300" />

                <div>
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-800">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-400/40">
                      <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      TRỤ CỘT 02
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">Mô hình AI đa chiều</span>
                  </div>

                  {/* Title & Purpose Description */}
                  <h3 className="mt-4 text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    Bóc Tách Khía Cạnh Bằng AI
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-normal">
                    Mô hình ABSA tự động chẻ nhỏ từng câu phức tạp thành 7 khía cạnh độc lập, tách bạch giữa điểm sao cảm tính và bản chất từng tính năng.
                  </p>

                  {/* 3D Visual Slicing Metaphor (ABSA Decomposition) */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs space-y-2">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>CÂU ĐÁNH GIÁ NGUYÊN BẢN</span>
                      <span className="text-cyan-400">AI BÓC TÁCH</span>
                    </div>

                    {/* Sliced item 1 */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                      <span className="text-[11px] text-slate-200 truncate">&quot;Giao diện trực quan đẹp&quot;</span>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 flex-shrink-0">
                        UI/UX • Khen
                      </span>
                    </div>

                    {/* Sliced item 2 */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                      <span className="text-[11px] text-slate-200 truncate">&quot;nhưng chuyển tiền bị chậm&quot;</span>
                      <span className="text-[10px] font-mono font-semibold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 flex-shrink-0">
                        Chuyển tiền • Lỗi
                      </span>
                    </div>

                    {/* Sliced item 3 */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                      <span className="text-[11px] text-slate-200 truncate">&quot;quét vân tay hay đơ&quot;</span>
                      <span className="text-[10px] font-mono font-semibold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 flex-shrink-0">
                        Bảo mật • Chê
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Bóc tách 7 khía cạnh
                  </span>
                  <span className="flex items-center gap-1 hover:underline">
                    Xem mô hình →
                  </span>
                </div>
              </motion.div>

              {/* =========================================================================
                  CARD 3: ĐỐI SÁNH VỊ THẾ CẠNH TRANH (Competitive Benchmarking & Action)
                  ========================================================================= */}
              <motion.div
                style={{ y: cardY3 }}
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0.4, -0.4, 0.4],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.03,
                  rotateY: -4,
                  rotateX: -2,
                  transition: { duration: 0.2 },
                }}
                className="hidden md:flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#13112a]/95 via-[#0e0d1f]/95 to-[#080712]/95 border border-violet-500/30 hover:border-violet-400/70 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* 3D Glass Glow Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-violet-500/20 transition-all duration-300" />

                <div>
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-violet-300 bg-violet-950/60 border border-violet-500/30">
                      <GitCompare className="w-3 h-3 text-violet-400 animate-pulse" />
                      TRỤ CỘT 03
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Đối sánh & Ra quyết định</span>
                  </div>

                  {/* Title & Purpose Description */}
                  <h3 className="mt-4 text-base font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                    Đối Sánh & Ra Quyết Định
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-normal">
                    Đặt các ngân hàng lên cùng ma trận đối sánh trực quan, tìm ra ưu thế vượt trội và phát hiện khoảng cách trải nghiệm so với đối thủ.
                  </p>

                  {/* 3D Visual Floating Action Items */}
                  <div className="mt-5 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between shadow-sm group-hover:border-violet-500/30 transition">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                        <span>Đối sánh trực tiếp 2-4 ngân hàng</span>
                      </div>
                      <span className="text-[9px] font-mono text-violet-300 px-1.5 py-0.5 rounded bg-violet-500/10">Ma trận</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between shadow-sm group-hover:border-violet-500/30 transition">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>Xác định khoảng cách năng lực tính năng</span>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/10">Chênh lệch</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between shadow-sm group-hover:border-violet-500/30 transition">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Đề xuất ưu tiên xử lý cho đội Product</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/10">Hành động</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-violet-400 font-mono">
                  <span>Khám phá công cụ đối sánh</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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

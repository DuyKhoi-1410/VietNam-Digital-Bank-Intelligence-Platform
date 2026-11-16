"use client";

import {
  BarChart3,
  Layers,
  GitCompare,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Cpu,
  Target,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import Link from "next/link";

export function ValueProps() {
  return (
    <section id="platform" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 right-10 w-[550px] h-[350px] bg-cyan-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[550px] h-[350px] bg-violet-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header (Google Stitch Layout) */}
        <div className="flex flex-col items-start max-w-3xl mb-14 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Khung Phân Tích Chiến Lược
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Ba Trụ Cột Thông Minh <br />
            <span className="text-gradient-cyan">Cho Ngân Hàng Số Việt Nam.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Hệ thống phân tích toàn diện được thiết kế riêng cho ban lãnh đạo khối ngân hàng số,
            đội ngũ sản phẩm và chuyên viên nghiên cứu UX/CX để điều hướng từ xu hướng vĩ mô đến từng câu phản hồi chi tiết.
          </p>
        </div>

        {/* Bento Grid Layout (Bố cục chia ô chuẩn phong cách Google Stitch Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* =========================================================================
              BENTO CARD 1: THÔNG MINH THỊ TRƯỜNG (Span 7)
              Layout: Text on Left + Interactive Macro NSS Chart Mockup on Right
              ========================================================================= */}
          <div className="lg:col-span-7 rounded-[32px] bg-[#070b16]/90 border border-slate-800/80 hover:border-cyan-500/50 p-7 sm:p-9 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_50px_rgba(6,182,212,0.18)] transition-all duration-500 backdrop-blur-xl">
            {/* Top Sub-Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-500/40">
                TRỤ CỘT 01
              </span>
              <span className="text-xs font-mono text-slate-400">Quỹ Đạo Vĩ Mô & Khối Lượng</span>
            </div>

            {/* Split Content: Details on Left, Mini UI Mockup on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
              {/* Left Column: Typography */}
              <div className="md:col-span-6 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  Thông Minh Thị Trường
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Nắm bắt toàn cảnh 19.303 đánh giá thực tế. Theo dõi điểm sao vĩ mô, quỹ đạo cảm xúc NLP 3 nhóm và phân bổ dịch vụ toàn hệ thống.
                </p>
                <div className="mt-5">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                  >
                    <span>Xem Thị Trường</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual UI Mockup (Google Stitch Resort Cards style) */}
              <div className="md:col-span-6 rounded-2xl bg-slate-950/85 border border-cyan-500/25 p-4 shadow-xl relative overflow-hidden flex flex-col justify-between gap-3 group-hover:border-cyan-400/50 transition-colors">
                {/* Header of Mockup */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-mono font-semibold text-slate-200">NSS Toàn Ngành</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                    +12.4% MoM
                  </span>
                </div>

                {/* Mini Bar Chart Mockup */}
                <div className="h-20 flex items-end justify-between gap-2 px-1 pt-2">
                  <div className="w-full bg-slate-800/60 rounded-t-lg h-[45%] relative group/bar overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 to-sky-400 opacity-70" />
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-t-lg h-[65%] relative group/bar overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 to-sky-400 opacity-80" />
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-t-lg h-[55%] relative group/bar overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 to-sky-400 opacity-75" />
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-t-lg h-[92%] relative group/bar overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-400 to-teal-300 opacity-100 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-t-lg h-[78%] relative group/bar overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 to-sky-400 opacity-85" />
                  </div>
                </div>

                {/* 2 Mini Bank Summary Pills */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                  <span className="text-slate-300">Vietcombank: <strong className="text-cyan-400">+18.2</strong></span>
                  <span className="text-slate-300">MB Bank: <strong className="text-teal-400">+14.5</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BENTO CARD 2: THÔNG MINH SẢN PHẨM (Span 5)
              Layout: Text + Realistic Code/Version Release Inspector Mockup
              ========================================================================= */}
          <div className="lg:col-span-5 rounded-[32px] bg-[#070b16]/90 border border-slate-800/80 hover:border-violet-500/50 p-7 sm:p-9 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_50px_rgba(139,92,246,0.18)] transition-all duration-500 backdrop-blur-xl">
            {/* Top Sub-Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-violet-300 bg-violet-950/70 border border-violet-500/40">
                TRỤ CỘT 02
              </span>
              <span className="text-xs font-mono text-slate-400">Điểm Nghẽn Phiên Bản</span>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                Thông Minh Sản Phẩm
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Nhận diện điểm mạnh, điểm yếu và rào cản theo từng phiên bản phát hành. Tách biệt điểm sao với bản chất trải nghiệm thực tế.
              </p>
            </div>

            {/* Visual Inspector Code Panel Mockup (Google Stitch Export Code style) */}
            <div className="my-5 rounded-2xl bg-slate-950/85 border border-violet-500/25 p-3.5 font-mono text-[11px] shadow-lg relative group-hover:border-violet-400/50 transition-colors">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  <span className="ml-1 text-slate-300">version-inspector.json</span>
                </div>
                <span className="text-violet-400 font-semibold">Active</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">&quot;release&quot;:</span>
                  <span className="text-cyan-300">&quot;v5.4.2 (Latest)&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">&quot;aspect&quot;:</span>
                  <span className="text-amber-300">&quot;Sinh Trắc Học (NFC)&quot;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">&quot;sentiment&quot;:</span>
                  <span className="text-rose-400 font-semibold">&quot;TIÊU CỰC (-62%)&quot;</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">7 Khía Cạnh Trải Nghiệm</span>
              <Link
                href="/dashboard/banks"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors"
              >
                <span>Xem Từng Ngân Hàng</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              BENTO CARD 3: TRÍ TUỆ NHÂN TẠO ABSA (Span 5)
              Layout: Glowing Concentric Star Badge (Google Stitch "Build with Gemini" clone)
              ========================================================================= */}
          <div className="lg:col-span-5 rounded-[32px] bg-[#070b16]/90 border border-slate-800/80 hover:border-fuchsia-500/50 p-7 sm:p-9 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_50px_rgba(217,70,239,0.18)] transition-all duration-500 backdrop-blur-xl min-h-[340px]">
            {/* Top Sub-Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-fuchsia-300 bg-fuchsia-950/70 border border-fuchsia-500/40">
                CÔNG NGHỆ LÕI
              </span>
              <span className="text-xs font-mono text-slate-400">Deep Learning NLP</span>
            </div>

            {/* Glowing Concentric Circles with 4-Point AI Star (Exact Google Stitch Star Motif) */}
            <div className="relative w-36 h-36 mx-auto my-3 flex items-center justify-center">
              {/* Outer Ripple Ring */}
              <div className="absolute inset-0 rounded-full border border-fuchsia-500/20 animate-ping opacity-35" />
              <div className="absolute inset-2 rounded-full border border-fuchsia-500/30 group-hover:border-fuchsia-400/60 transition-colors" />
              <div className="absolute inset-6 rounded-full border border-cyan-400/30 group-hover:border-cyan-300/60 transition-colors" />

              {/* Glowing Radiant Center Core */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.7)] group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              </div>
            </div>

            {/* Bottom Typography & Action */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-fuchsia-300 transition-colors">
                Trí Tuệ Nhân Tạo ABSA
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Mô hình học sâu tự động bóc tách cảm xúc đa chiều đến từng câu chữ, tách biệt cảm xúc thật và điểm sao đánh giá.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">100% Khử Trùng Lặp</span>
                <Link
                  href="/dashboard/reviews"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors"
                >
                  <span>Tra Cứu Đánh Giá AI</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BENTO CARD 4: THÔNG MINH CẠNH TRANH (Span 7)
              Layout: Interactive Head-to-Head Comparator with Blueprint Guide Lines
              (Google Stitch "Own your design" clone)
              ========================================================================= */}
          <div className="lg:col-span-7 rounded-[32px] bg-[#070b16]/90 border border-slate-800/80 hover:border-cyan-500/50 p-7 sm:p-9 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_50px_rgba(6,182,212,0.18)] transition-all duration-500 backdrop-blur-xl min-h-[340px]">
            {/* Top Sub-Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-500/40">
                TRỤ CỘT 03
              </span>
              <span className="text-xs font-mono text-slate-400">Đo Lường Đối Sánh</span>
            </div>

            {/* Blueprint Guide Comparator Widget (Exact Google Stitch Blueprint Lines) */}
            <div className="my-2 relative w-full h-[125px] rounded-2xl bg-slate-950/85 border border-cyan-500/30 p-4 overflow-hidden flex flex-col justify-center gap-2 group-hover:border-cyan-400/50 transition-colors">
              {/* Blueprint Grid Watermark */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.4) 1px, transparent 0)`,
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Blueprint Horizontal Guide Line with Crosshairs */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

              {/* Head-to-Head Comparison Bar with Delta Pill */}
              <div className="relative z-10 flex items-center justify-between gap-3 text-xs font-mono">
                {/* Bank 1 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white">Vietcombank</span>
                  <span className="text-cyan-300 font-bold ml-1">84.2</span>
                </div>

                {/* Center Delta Gap Badge (Blueprint measurement label) */}
                <div className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  Δ +3.8 pts
                </div>

                {/* Bank 2 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="font-bold text-white">Techcombank</span>
                  <span className="text-slate-300 font-bold ml-1">80.4</span>
                </div>
              </div>

              {/* Dimension Specs Marker at Bottom */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>Ma Trận Đối Đầu 7 Ngân Hàng</span>
                <span className="text-cyan-400/80">Benchmark Mode: 100% Data</span>
              </div>
            </div>

            {/* Bottom Typography & Action */}
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                Thông Minh Cạnh Tranh
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Đặt 7 ứng dụng ngân hàng thương mại số lên bàn cân so sánh trực quan về điểm sao, tỷ lệ cảm xúc và khoảng cách hiệu năng tức thì.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Khoảng Cách Hiệu Năng Số</span>
                <Link
                  href="/dashboard/benchmark"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-slate-900 border border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-200 shadow-md shadow-cyan-500/20"
                >
                  <span>Mở Ma Trận Đối Sánh</span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

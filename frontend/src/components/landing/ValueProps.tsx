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
  Sliders,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export function ValueProps() {
  return (
    <section id="platform" className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-12 bg-transparent overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 right-10 w-[700px] h-[450px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[700px] h-[450px] bg-violet-600/10 blur-[180px] rounded-full pointer-events-none" />

      {/* Massive Full-Screen Container (Chuẩn Google Stitch Cinematic Full-Width) */}
      <div className="w-full max-w-[1760px] mx-auto">
        {/* Bento Grid Layout (Bố cục chia ô to bản, trải rộng full màn hình, chuẩn Google Stitch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* =========================================================================
              BENTO CARD 1: THÔNG MINH THỊ TRƯỜNG (Span 7) - Google Stitch "Easy edits" style
              To bản, cao thoáng, có lưới chấm li ti và UI Mockup phong cách ứng dụng di động
              ========================================================================= */}
          <div className="lg:col-span-7 rounded-[36px] sm:rounded-[44px] bg-[#2b2d34] border border-slate-700/60 hover:border-cyan-500/60 p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_60px_rgba(6,182,212,0.25)] transition-all duration-500 backdrop-blur-2xl min-h-[540px] sm:min-h-[620px]">
            {/* White Dot Matrix - Chấm trắng sắc nét chuẩn nền sau cùng */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.22) 1px, transparent 1.2px)",
                backgroundSize: "19px 19px",
              }}
            />

            {/* Top Sub-Badge */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 shadow-lg">
                TRỤ CỘT 01
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400">Quỹ Đạo Vĩ Mô & Khối Lượng Đánh Giá</span>
            </div>

            {/* Split Content: Typography on Left + Rich UI Mockup on Right */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
              {/* Left Column: Big Typography */}
              <div className="md:col-span-6 flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                  Thông Minh Thị Trường
                </h3>
                <p className="mt-4 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                  Nắm bắt toàn cảnh 19.303 đánh giá thực tế. Theo dõi điểm sao vĩ mô, quỹ đạo cảm xúc NLP 3 nhóm và phân bổ dịch vụ toàn hệ thống.
                </p>
                <div className="mt-8">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 hover:bg-cyan-500/20 shadow-lg transition-all duration-200 group/btn"
                  >
                    <span>Xem Thị Trường</span>
                    <ArrowUpRight className="w-4 h-4 text-cyan-300 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: High-Fidelity UI Mockup (Google Stitch Mobile Resorts style) */}
              <div className="md:col-span-6 rounded-3xl bg-[#030611]/95 border border-slate-700/60 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between gap-5 group-hover:border-cyan-400/50 transition-colors min-h-[360px]">
                {/* Header of Mockup */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white">Chỉ số NSS Thị Trường</div>
                      <div className="text-[10px] text-slate-400">Cập nhật thời gian thực</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                    +14.8% NSS
                  </span>
                </div>

                {/* Glowing Multi-Bar Chart */}
                <div className="h-28 flex items-end justify-between gap-3 px-2 pt-2">
                  <div className="w-full bg-slate-800/50 rounded-t-xl h-[40%] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-600 to-sky-400 opacity-60" />
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-t-xl h-[65%] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-600 to-sky-400 opacity-75" />
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-t-xl h-[50%] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-600 to-sky-400 opacity-70" />
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-t-xl h-[95%] relative overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.7)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-400 via-sky-300 to-teal-200" />
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-t-xl h-[75%] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-600 to-sky-400 opacity-80" />
                  </div>
                </div>

                {/* Live Voice Quote Bubble */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-ping" />
                  <span className="text-slate-300 font-light truncate">&quot;Giao diện app mới chuyển khoản siêu mượt, rất hài lòng&quot;</span>
                  <span className="text-amber-400 font-mono font-bold ml-auto flex-shrink-0">5★</span>
                </div>

                {/* 2 Bank Pills */}
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-300">
                  <span>Vietcombank: <strong className="text-cyan-400">+18.2</strong></span>
                  <span>MB Bank: <strong className="text-teal-400">+15.4</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BENTO CARD 2: THÔNG MINH SẢN PHẨM (Span 5) - Google Stitch "Export code" style
              To bản, cao thoáng, có lưới chấm li ti và Code Inspector Panel Mockup
              ========================================================================= */}
          <div className="lg:col-span-5 rounded-[36px] sm:rounded-[44px] bg-[#2b2d34] border border-slate-700/60 hover:border-violet-500/60 p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_60px_rgba(139,92,246,0.25)] transition-all duration-500 backdrop-blur-2xl min-h-[540px] sm:min-h-[620px]">
            {/* White Dot Matrix - Chấm trắng sắc nét chuẩn nền sau cùng */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.22) 1px, transparent 1.2px)",
                backgroundSize: "19px 19px",
              }}
            />

            {/* Top Sub-Badge */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-violet-300 bg-violet-950/80 border border-violet-500/40 shadow-lg">
                TRỤ CỘT 02
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400">Điểm Nghẽn Phiên Bản</span>
            </div>

            {/* Big Typography */}
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-300 transition-colors">
                Thông Minh Sản Phẩm
              </h3>
              <p className="mt-4 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                Nhận diện điểm mạnh, điểm yếu và rào cản theo từng phiên bản phát hành. Tách biệt điểm sao với bản chất trải nghiệm thực tế.
              </p>
            </div>

            {/* Visual Inspector Code Panel Mockup (Google Stitch Export Code style - To, chi tiết, syntax highlight) */}
            <div className="relative z-10 my-6 rounded-3xl bg-[#14161d]/95 border border-slate-700/80 p-5 sm:p-6 font-mono text-xs sm:text-sm shadow-2xl overflow-hidden group-hover:border-violet-400/50 transition-colors">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-slate-300 font-medium">release-diagnostics.json</span>
                </div>
                <span className="text-violet-400 font-bold text-xs">v5.4.2</span>
              </div>
              <div className="space-y-1.5 text-slate-300 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">01</span>
                  <span className="text-cyan-300">&quot;bank&quot;: &quot;Vietcombank Digital&quot;,</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">02</span>
                  <span className="text-amber-300">&quot;aspect&quot;: &quot;Sinh Trắc Học (NFC)&quot;,</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">03</span>
                  <span className="text-rose-400 font-bold">&quot;sentiment&quot;: &quot;TIÊU CỰC (-68%)&quot;,</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">04</span>
                  <span className="text-emerald-400">&quot;ai_action&quot;: &quot;Tối ưu luồng quét thẻ CCCD&quot;</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono text-slate-400">7 Khía Cạnh Trải Nghiệm</span>
              <Link
                href="/dashboard/banks"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors"
              >
                <span>Xem Từng Ngân Hàng</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              BENTO CARD 3: TRÍ TUỆ NHÂN TẠO ABSA (Span 5) - Google Stitch "Build with Gemini" style
              To bản, biểu tượng ngôi sao 4 cánh phát quang cực lớn giữa các vòng tròn neon
              ========================================================================= */}
          <div className="lg:col-span-5 rounded-[36px] sm:rounded-[44px] bg-[#2b2d34] border border-slate-700/60 hover:border-fuchsia-500/60 p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_60px_rgba(217,70,239,0.25)] transition-all duration-500 backdrop-blur-2xl min-h-[480px] sm:min-h-[560px]">
            {/* White Dot Matrix - Chấm trắng sắc nét chuẩn nền sau cùng */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.22) 1px, transparent 1.2px)",
                backgroundSize: "19px 19px",
              }}
            />

            {/* Top Sub-Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-fuchsia-300 bg-fuchsia-950/80 border border-fuchsia-500/40 shadow-lg">
                CÔNG NGHỆ LÕI
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400">Deep Learning NLP</span>
            </div>

            {/* Monumental Concentric Circles with 4-Point AI Star (Google Stitch Star Motif) */}
            <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 mx-auto my-6 flex items-center justify-center">
              {/* Outer Ripple Ring */}
              <div className="absolute inset-0 rounded-full border border-fuchsia-500/25 animate-ping opacity-30" />
              <div className="absolute inset-3 rounded-full border border-fuchsia-500/35 group-hover:border-fuchsia-400/60 transition-colors" />
              <div className="absolute inset-8 rounded-full border border-cyan-400/35 group-hover:border-cyan-300/60 transition-colors" />

              {/* Glowing Radiant Center Core with AI 4-Point Star */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-[0_0_45px_rgba(217,70,239,0.85)] group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white filter drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
              </div>
            </div>

            {/* Bottom Typography & Action */}
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight group-hover:text-fuchsia-300 transition-colors">
                Trí Tuệ Nhân Tạo ABSA
              </h3>
              <p className="mt-3 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                Mô hình học sâu tự động bóc tách cảm xúc đa chiều đến từng câu chữ, tách biệt cảm xúc thật và điểm sao đánh giá.
              </p>
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono text-slate-400">100% Khử Trùng Lặp</span>
                <Link
                  href="/dashboard/reviews"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors"
                >
                  <span>Tra Cứu Đánh Giá AI</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BENTO CARD 4: THÔNG MINH CẠNH TRANH (Span 7) - Google Stitch "Own your design" style
              To bản, widget thước đo Blueprint kỹ thuật với thanh đối đầu trực diện
              ========================================================================= */}
          <div className="lg:col-span-7 rounded-[36px] sm:rounded-[44px] bg-[#2b2d34] border border-slate-700/60 hover:border-cyan-500/60 p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_0_60px_rgba(6,182,212,0.25)] transition-all duration-500 backdrop-blur-2xl min-h-[480px] sm:min-h-[560px]">
            {/* White Dot Matrix - Chấm trắng sắc nét chuẩn nền sau cùng */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.22) 1px, transparent 1.2px)",
                backgroundSize: "19px 19px",
              }}
            />

            {/* Top Sub-Badge */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 shadow-lg">
                TRỤ CỘT 03
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400">Đo Lường Đối Sánh Toàn Diện</span>
            </div>

            {/* Blueprint Guide Comparator Widget (Google Stitch Blueprint Lines - To, sắc sảo) */}
            <div className="relative z-10 my-4 w-full h-[160px] sm:h-[180px] rounded-3xl bg-[#030611]/95 border border-cyan-500/35 p-6 overflow-hidden flex flex-col justify-center gap-3 group-hover:border-cyan-400/60 transition-colors shadow-2xl">
              {/* Blueprint Grid Watermark */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.45) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Blueprint Horizontal Guide Line with Crosshairs */}
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

              {/* Head-to-Head Comparison Bar with Delta Pill */}
              <div className="relative z-10 flex items-center justify-between gap-4 text-xs sm:text-sm font-mono">
                {/* Bank 1 */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-white text-sm">Vietcombank</span>
                  <span className="text-cyan-300 font-bold ml-1.5 text-sm">84.2</span>
                </div>

                {/* Center Delta Gap Badge (Blueprint measurement label) */}
                <div className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.45)]">
                  Δ +3.8 pts gap
                </div>

                {/* Bank 2 */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="font-bold text-white text-sm">Techcombank</span>
                  <span className="text-slate-300 font-bold ml-1.5 text-sm">80.4</span>
                </div>
              </div>

              {/* Dimension Specs Marker at Bottom */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-cyan-400">✦</span> Ma Trận Đối Đầu 7 Ngân Hàng
                </span>
                <span className="text-cyan-400 font-semibold">Benchmark Delta: Verified</span>
              </div>
            </div>

            {/* Bottom Typography & Action */}
            <div className="relative z-10 mt-4">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                Thông Minh Cạnh Tranh
              </h3>
              <p className="mt-3 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                Đặt 7 ứng dụng ngân hàng thương mại số lên bàn cân so sánh trực quan về điểm sao, tỷ lệ cảm xúc và khoảng cách hiệu năng tức thì.
              </p>
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono text-slate-400">Khoảng Cách Hiệu Năng Số</span>
                <Link
                  href="/dashboard/benchmark"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-slate-900 border border-cyan-500/50 hover:bg-cyan-500/25 hover:border-cyan-300 transition-all duration-200 shadow-lg shadow-cyan-500/20"
                >
                  <span>Mở Ma Trận Đối Sánh</span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Building2,
  GitFork,
  Search,
  Download,
  Sparkles,
  ShieldCheck,
  Star,
  Activity,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface ShowcaseModule {
  id: string;
  number: string;
  category: string;
  title: string;
  tagline: string;
  route: string;
  theme: "dark" | "light" | "aurora";
  accentColor: string;
  renderPreview: () => React.ReactNode;
}

const MODULES_DATA: ShowcaseModule[] = [
  {
    id: "overview",
    number: "01",
    category: "Phân Tích Vĩ Mô",
    title: "Tổng Quan Thị Trường",
    tagline: "Toàn cảnh 19.303 đánh giá & chỉ số cảm xúc ròng (NSS) 7 ngân hàng số",
    route: "/dashboard",
    theme: "dark",
    accentColor: "from-cyan-500 to-blue-600",
    renderPreview: () => (
      <div className="w-full h-full bg-[#080d1a] p-5 sm:p-6 flex flex-col justify-between text-left select-none">
        {/* Mockup Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              Market Intelligence VDBI
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
            Realtime AI
          </span>
        </div>

        {/* Big Numbers Row */}
        <div className="grid grid-cols-3 gap-3 my-auto">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">Tổng Đánh Giá</span>
            <span className="text-xl sm:text-2xl font-black text-white">19.303</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 mt-1">
              ↑ 100% Real
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">Điểm Sao TB</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">4.1 ★</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">Google Play</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 shadow-inner">
            <span className="text-[10px] font-mono text-cyan-300 block mb-1">Chỉ Số NSS</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300">+42.6</span>
            <span className="text-[10px] text-cyan-400 font-mono block mt-1">Net Sentiment</span>
          </div>
        </div>

        {/* Aspect Sentiment Bars Preview */}
        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span>Bóc tách 7 khía cạnh dịch vụ (ABSA)</span>
            <span className="text-cyan-400">Tỷ lệ Tích Cực</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
              <span className="w-20 text-slate-400 truncate">Giao Dịch 24/7</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[78%]" />
                <div className="h-full bg-rose-500 w-[22%]" />
              </div>
              <span className="w-8 text-right text-emerald-400 font-bold">78%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
              <span className="w-20 text-slate-400 truncate">Giao Diện UI/UX</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[71%]" />
                <div className="h-full bg-rose-500 w-[29%]" />
              </div>
              <span className="w-8 text-right text-emerald-400 font-bold">71%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
              <span className="w-20 text-slate-400 truncate">Sinh Trắc Học</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-amber-400 w-[54%]" />
                <div className="h-full bg-rose-500 w-[46%]" />
              </div>
              <span className="w-8 text-right text-amber-400 font-bold">54%</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "bank-detail",
    number: "02",
    category: "Phân Tích Đơn Ứng Dụng",
    title: "Hồ Sơ Ngân Hàng",
    tagline: "Chi tiết năng lực & điểm nghẽn trải nghiệm từng ngân hàng theo phiên bản",
    route: "/dashboard/banks",
    theme: "light",
    accentColor: "from-blue-600 to-indigo-600",
    renderPreview: () => (
      <div className="w-full h-full bg-[#f8fafc] text-slate-900 p-5 sm:p-6 flex flex-col justify-between text-left select-none">
        {/* Mockup Header - High contrast Light UI (like center card in Google Stitch) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-950 tracking-tight">
              VCB Digibank Profile
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Top 1 Rating
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">v5.3.8 Active</span>
        </div>

        {/* Bank Chips */}
        <div className="flex gap-1.5 overflow-hidden py-1">
          {["VCB", "MB", "BIDV", "TPBank", "TNEX", "Liobank", "VietinBank"].map((b, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition-colors ${
                i === 0
                  ? "bg-slate-950 text-white"
                  : "bg-slate-200/80 text-slate-600"
              }`}
            >
              {b}
            </span>
          ))}
        </div>

        {/* Radar Aspect Breakdown Cards */}
        <div className="grid grid-cols-2 gap-2.5 my-auto">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 font-mono block">Điểm Mạnh Hàng Đầu</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">Tốc Độ Chuyển Tiền</span>
            <span className="text-xs text-emerald-600 font-bold font-mono">92% Hài lòng</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 font-mono block">Điểm Nghẽn Trải Nghiệm</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">Xác Thực FaceID CCCD</span>
            <span className="text-xs text-rose-500 font-bold font-mono">38% Tiêu cực</span>
          </div>
        </div>

        {/* Verbatim Quote Box */}
        <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200/90 text-[11px] leading-relaxed text-slate-700 italic">
          &ldquo;Giao diện mới chuyển tiền siêu mượt, quét QR tích tắc. Nhưng mong khắc phục lỗi quét NFC căn cước lúc đông người.&rdquo;
        </div>
      </div>
    ),
  },
  {
    id: "benchmark",
    number: "03",
    category: "So Sánh Đa Ứng Dụng",
    title: "Đối Sánh Cạnh Tranh",
    tagline: "Ma trận đối đầu trực diện 7 ngân hàng thương mại, bóc tách khoảng cách",
    route: "/dashboard/benchmark",
    theme: "dark",
    accentColor: "from-violet-500 to-fuchsia-600",
    renderPreview: () => (
      <div className="w-full h-full bg-[#0a0c1b] p-5 sm:p-6 flex flex-col justify-between text-left select-none">
        {/* Mockup Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <span className="text-xs font-mono font-bold text-violet-300 uppercase tracking-wider">
              7-Bank Competitive Matrix
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Benchmark Engine</span>
        </div>

        {/* Comparative Bars Mockup */}
        <div className="space-y-2.5 my-auto">
          {[
            { bank: "Vietcombank", score: "4.3★", nss: "+58", width: "95%", color: "bg-emerald-400" },
            { bank: "MB Bank", score: "4.2★", nss: "+52", width: "90%", color: "bg-blue-500" },
            { bank: "BIDV", score: "4.1★", nss: "+44", width: "82%", color: "bg-teal-400" },
            { bank: "TPBank", score: "4.0★", nss: "+39", width: "76%", color: "bg-purple-500" },
            { bank: "Liobank", score: "3.9★", nss: "+33", width: "68%", color: "bg-amber-400" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs font-mono">
              <span className="w-24 text-slate-300 font-bold truncate">{item.bank}</span>
              <div className="flex-1 h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
              </div>
              <span className="text-white font-bold text-xs">{item.score}</span>
              <span className="text-cyan-300 font-mono text-[11px] w-10 text-right">{item.nss}</span>
            </div>
          ))}
        </div>

        {/* Bottom Insight Pill */}
        <div className="p-3 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between text-xs text-violet-200">
          <span>Khoảng cách Top 1 vs Top 5</span>
          <span className="font-bold text-violet-300">+25 điểm NSS</span>
        </div>
      </div>
    ),
  },
  {
    id: "reviews",
    number: "04",
    category: "Bằng Chứng Đã Khử Trùng",
    title: "Tra Cứu Đánh Giá",
    tagline: "Tìm kiếm & điều tra phản hồi gốc có gắn nhãn khía cạnh và cảm xúc AI",
    route: "/dashboard/reviews",
    theme: "dark",
    accentColor: "from-emerald-500 to-teal-600",
    renderPreview: () => (
      <div className="w-full h-full bg-[#061214] p-5 sm:p-6 flex flex-col justify-between text-left select-none">
        {/* Mockup Header */}
        <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
              19.303 Verified Reviews
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            No Duplicate Rows
          </span>
        </div>

        {/* Search Mockup Input */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-slate-300 flex items-center justify-between">
          <span>&ldquo;lỗi đăng nhập sinh trắc học&rdquo;</span>
          <span className="text-emerald-400 text-[10px]">1.248 kết quả</span>
        </div>

        {/* Review Cards List */}
        <div className="space-y-2 my-auto">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">Người dùng MBBank • 1★</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 font-bold">
                TIÊU CỰC
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              &ldquo;Cập nhật app xong quét khuôn mặt mãi không được, toàn báo lỗi không nhận diện căn cước.&rdquo;
            </p>
            <span className="inline-block mt-1.5 text-[9px] font-mono text-cyan-400">
              #BảoMật #SinhTrắcHọc #PhiênBảnMới
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">Người dùng BIDV • 5★</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold">
                TÍCH CỰC
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              &ldquo;Chuyển khoản liên ngân hàng 24/7 cực kỳ nhanh, có thông báo biến động số dư tức thì.&rdquo;
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "reports",
    number: "05",
    category: "Quản Trị & Xuất Tệp",
    title: "Báo Cáo & Xuất Dữ Liệu",
    tagline: "Trích xuất tệp dữ liệu tổng hợp CSV & JSON phục vụ thuyết trình và báo cáo",
    route: "/dashboard/reports",
    theme: "dark",
    accentColor: "from-amber-500 to-orange-600",
    renderPreview: () => (
      <div className="w-full h-full bg-[#140e06] p-5 sm:p-6 flex flex-col justify-between text-left select-none">
        {/* Mockup Header */}
        <div className="flex items-center justify-between border-b border-amber-950 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              Executive Export Center
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400">Audit Ready</span>
        </div>

        {/* Action Cards */}
        <div className="space-y-2.5 my-auto">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">all_reviews_curated.csv</span>
              <span className="text-[10px] font-mono text-slate-400">19.303 dòng • 13 trường dữ liệu chuẩn hóa</span>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold font-mono">
              Tải CSV
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">market_sentiment_matrix.json</span>
              <span className="text-[10px] font-mono text-slate-400">Phân bổ 7 khía cạnh • NSS 7 ngân hàng</span>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold font-mono">
              Tải JSON
            </span>
          </div>
        </div>

        {/* Audit Provenance Log */}
        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center justify-between">
          <span>SHA-256 Provenance Log Verified</span>
          <span className="text-emerald-400">✓ Validated</span>
        </div>
      </div>
    ),
  },
];

export function ModulesShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -520, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 520, behavior: "smooth" });
    }
  };

  return (
    <section id="modules" className="relative py-24 sm:py-32 bg-[#03060f] border-t border-slate-900/80 overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-cyan-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-violet-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Container Header (Exact Google Stitch Layout: Title on Left, Controls on Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Header Title on Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 mb-4 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>5 PHÂN HỆ TRÍ TUỆ NHÂN TẠO • TRẢI NGHIỆM KHÁCH HÀNG SỐ</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
              Khám phá các module phân tích
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-400 font-light max-w-2xl leading-relaxed">
              Lựa chọn phân hệ chuyên sâu phù hợp với mục tiêu nghiên cứu và ra quyết định chiến lược của bạn.
            </p>
          </div>

          {/* Carousel Arrow Controls on Right (Exact Google Stitch style from image) */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={scrollLeft}
              aria-label="Cuộn sang trái"
              className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg group backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Cuộn sang phải"
              className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg group backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track of Large Module Cards (Exact Google Stitch Card Format) */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2 scroll-smooth select-none cursor-grab active:cursor-grabbing no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {MODULES_DATA.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[340px] sm:w-[440px] md:w-[480px] lg:w-[520px] flex flex-col group"
          >
            {/* The Big Module Card Showcase (To to 1 chút theo đúng ảnh Stitch) */}
            <div className="relative h-[400px] sm:h-[460px] md:h-[500px] rounded-[32px] overflow-hidden border border-slate-800/90 group-hover:border-cyan-500/50 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] group-hover:-translate-y-1 bg-[#050814]">
              {/* Module UI Mockup Preview */}
              <div className="w-full h-full">
                {item.renderPreview()}
              </div>

              {/* Hover Overlay with "Mở module" Capsule Button (Exact Stitch "Use template" style) */}
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                <Link
                  href={item.route}
                  className="px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-slate-950/90 hover:bg-white hover:text-black border border-white/30 hover:border-white shadow-2xl transition-all duration-300 transform scale-90 group-hover:scale-100 flex items-center gap-2"
                >
                  <span>Mở module {item.number}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card Metadata Info Below (Underneath Card as in Google Stitch) */}
            <div className="mt-4 sm:mt-5 px-2 text-left">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                {item.category} • Module {item.number}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 font-light line-clamp-2 leading-relaxed">
                {item.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

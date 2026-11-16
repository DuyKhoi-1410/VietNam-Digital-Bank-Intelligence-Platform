"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Search,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";

export function LandingFooter() {
  return (
    <footer id="about" className="relative bg-[#02050e] text-slate-300 overflow-hidden select-none">
      {/* Sleek Aurora Top Glowing Border */}
      <div className="relative w-full">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[100px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Col 1: Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div>
              <Link href="/" className="inline-block group">
                <Image
                  src="/logo-full.png"
                  alt="Vietnam Digital Banking Intelligence"
                  width={220}
                  height={38}
                  className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Link>
              <p className="mt-3.5 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-light">
                Nền tảng Trí tuệ Thị trường và Phân tích Cảm xúc Khía cạnh (ABSA) chuyên sâu cho 7 ứng dụng ngân hàng số hàng đầu Việt Nam.
              </p>
            </div>

            {/* System Status Pill */}
            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] text-slate-300">
                  Hệ thống hoạt động • 19,303 Dữ liệu thực
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Trường Đại học Kinh tế – ĐH Đà Nẵng (DUE)
              </p>
            </div>
          </div>

          {/* Col 2: Dashboard Modules (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Tiện Ích Dashboard</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span>Module 1: Tổng quan Thị trường</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/banks"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span>Module 2: Hồ sơ 7 Ngân hàng</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/benchmark"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span>Module 3: Đối sánh Benchmark</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reviews"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span>Module 4: Tra cứu Đánh giá</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reports"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span>Module 5: Báo cáo Chuyên sâu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: 7 Ngân hàng Số (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              <span>7 Ngân Hàng</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <Link href="/dashboard/banks?bank=Vietcombank" className="hover:text-cyan-300 transition-colors">
                  Vietcombank
                </Link>
              </li>
              <li>
                <Link href="/dashboard/banks?bank=MB%20Bank" className="hover:text-cyan-300 transition-colors">
                  MB Bank
                </Link>
              </li>
              <li>
                <Link href="/dashboard/banks?bank=Techcombank" className="hover:text-cyan-300 transition-colors">
                  Techcombank
                </Link>
              </li>
              <li>
                <Link href="/dashboard/banks?bank=VPBank" className="hover:text-cyan-300 transition-colors">
                  VPBank NEO
                </Link>
              </li>
              <li>
                <Link href="/dashboard/banks?bank=BIDV" className="hover:text-cyan-300 transition-colors">
                  BIDV SmartBanking
                </Link>
              </li>
              <li>
                <Link href="/dashboard/banks?bank=ACB" className="hover:text-cyan-300 transition-colors">
                  ACB ONE
                </Link>
              </li>
              <li>
                <Link href="/dashboard/banks?bank=TPBank" className="hover:text-cyan-300 transition-colors">
                  TPBank Mobile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Công nghệ & Truy cập nhanh (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nền Tảng AI</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Mô hình học sâu bóc tách cảm xúc đa khía cạnh (ABSA) kết hợp chuẩn mực chỉ số Net Sentiment Score (NSS).
            </p>
            <div className="pt-1">
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-100 bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 shadow-md group active:scale-98"
              >
                <span>Mở Nền Tảng Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] text-slate-500 font-mono">
              <a href="#methodology" className="hover:text-cyan-400 transition-colors">
                Phương Pháp Luận
              </a>
              <span className="text-slate-700">•</span>
              <a href="#faq" className="hover:text-cyan-400 transition-colors">
                FAQ
              </a>
              <span className="text-slate-700">•</span>
              <a href="#platform" className="hover:text-cyan-400 transition-colors">
                Trực Quan Hóa
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 <span className="text-slate-300 font-medium">Vietnam Digital Banking Intelligence</span>. Mọi quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>19,303 Google Play Reviews</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>ABSA Multi-Aspect Engine</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              <span>Quyết định 2345/QĐ-NHNN</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

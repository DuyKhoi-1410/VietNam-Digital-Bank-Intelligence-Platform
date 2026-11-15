"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Cpu } from "lucide-react";

export function LandingFooter() {
  return (
    <footer id="about" className="relative bg-[#030508] border-t border-slate-900 overflow-hidden">
      {/* Final CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="relative glass-panel rounded-3xl p-10 sm:p-16 overflow-hidden border border-slate-800 text-center flex flex-col items-center">
          {/* Neon Aurora Glow in CTA Banner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-blue-600/25 to-violet-600/20 blur-[130px] rounded-full pointer-events-none" />

          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Nền Tảng Phân Tích Thực Chiến Cho Doanh Nghiệp
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl">
            Vượt Qua Con Số <span className="text-gradient-aurora">Sao Đơn Thuần.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Khám phá các tín hiệu thực tế phía sau trải nghiệm ứng dụng ngân hàng số tại Việt Nam.
            Phân tích 19.303 đánh giá đã xác thực trên 7 ngân hàng thương mại với mô hình cảm xúc khía cạnh (ABSA) chuẩn mực.
          </p>

          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-2xl shadow-cyan-500/30 transition-all duration-200"
          >
            <span>Trải nghiệm Dashboard Ngay</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links & Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6 border-t border-slate-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-3 group">
              <Image
                src="/logo-full.png"
                alt="Vietnam Digital Banking Intelligence"
                width={210}
                height={35}
                className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Nền tảng trí tuệ thị trường và phân tích cảm xúc khía cạnh (ABSA) chuyên sâu cho các ứng dụng ngân hàng số tại Việt Nam.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs text-slate-400 font-mono">
            <a href="#platform" className="hover:text-cyan-400 transition-colors">
              Nền tảng
            </a>
            <a href="#modules" className="hover:text-cyan-400 transition-colors">
              Module phân tích
            </a>
            <a href="#methodology" className="hover:text-cyan-400 transition-colors">
              Phương pháp luận
            </a>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-900/60 text-xs text-slate-400">
          <p>© 2026 Vietnam Digital Banking Intelligence. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3 h-3 text-cyan-400" />
              Kho Dữ Liệu Thực Chứng
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3 h-3 text-emerald-400" />
              Mô Hình ABSA Engine
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

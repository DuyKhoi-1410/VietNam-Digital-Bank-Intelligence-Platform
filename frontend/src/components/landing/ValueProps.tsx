"use client";

import { BarChart3, Layers, GitCompare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ValueProps() {
  return (
    <section id="platform" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Background glow accents */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Khung Phân Tích Chiến Lược
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Ba Trụ Cột Thông Minh <br />
            <span className="text-gradient-cyan">Cho Ngân Hàng Số Việt Nam.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Hệ thống phân tích toàn diện được thiết kế riêng cho ban lãnh đạo khối ngân hàng số,
            đội ngũ sản phẩm và chuyên viên nghiên cứu UX/CX để điều hướng từ xu hướng vĩ mô đến từng câu phản hồi chi tiết.
          </p>
        </div>

        {/* Asymmetric Grid Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pillar 1: Market Intelligence (Span 7) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-8 sm:p-10 flex flex-col justify-between group hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Trụ Cột 01</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Thông Minh Thị Trường
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Nắm bắt toàn cảnh trải nghiệm ngân hàng số tại Việt Nam. Theo dõi điểm sao trung bình vĩ mô, quỹ đạo cảm xúc NLP 3 nhóm (Tích cực, Trung tính, Tiêu cực) theo tháng và phân bổ các khía cạnh dịch vụ toàn hệ thống.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Quỹ Đạo Vĩ Mô & Khối Lượng Đánh Giá</span>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
              >
                <span>Xem Thị Trường</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Product Intelligence (Span 5) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-8 sm:p-10 flex flex-col justify-between group hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Trụ Cột 02</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Thông Minh Sản Phẩm
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Nhận diện điểm mạnh, điểm yếu và các rào cản người dùng của từng ngân hàng. Tách biệt điểm sao với cảm xúc NLP, theo dõi độ chấp nhận của từng phiên bản phát hành và xem trích dẫn phản hồi gốc.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Phân Tích Khía Cạnh Trải Nghiệm</span>
              <Link
                href="/dashboard/banks"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors"
              >
                <span>Xem Từng Ngân Hàng</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Competitive Intelligence (Span 12) */}
          <div className="lg:col-span-12 glass-panel rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <GitCompare className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Trụ Cột 03 • Đo Lường Đối Sánh</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Thông Minh Cạnh Tranh
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Đặt các ứng dụng ngân hàng lên bàn cân so sánh trực quan về điểm sao, tỷ lệ cảm xúc và điểm cảm xúc ròng (NSS) theo từng khía cạnh. Nhận diện khoảng cách hiệu năng giữa ứng dụng dẫn đầu và ứng dụng tụt hậu dựa trên số liệu thực tế.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/dashboard/benchmark"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold tracking-wide text-white bg-slate-900 border border-blue-500/40 hover:bg-blue-500/15 hover:border-blue-400 transition-all duration-200 shadow-md shadow-blue-500/20"
              >
                <span>Mở Ma Trận Đối Sánh</span>
                <ArrowUpRight className="w-4 h-4 text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

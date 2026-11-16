"use client";

import Link from "next/link";
import { MessageSquareText, ShieldAlert, Cpu, ArrowRight } from "lucide-react";

export function StorySection() {
  return (
    <section id="story" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Signature Stitch Headline - "Vibe design is here" equivalent */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15] max-w-4xl">
          VietNam Digital Banking Intelligence
        </h2>

        {/* Subtitle Statement */}
        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-slate-300 font-normal leading-relaxed max-w-3xl">
          Nền tảng phân tích phản hồi người dùng dựa trên Sentiment Analysis và Aspect-Based Sentiment Analysis (ABSA), cung cấp góc nhìn chuyên sâu về trải nghiệm ngân hàng số tại Việt Nam.
        </p>

        {/* Signature Stitch Dark Pill Button - "[ Start designing ]" equivalent */}
        <div className="mt-9">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-medium text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 shadow-xl shadow-black/60 transition-all duration-200 active:scale-95 backdrop-blur-md"
          >
            <span>Bắt đầu khám phá</span>
            <ArrowRight className="w-4 h-4 text-slate-300" />
          </Link>
        </div>

        {/* 3 Core Capability Columns */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-14 border-t border-slate-800/80 text-left">
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Tiếng Nói Người Dùng Thật</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              19,303 phản hồi thực tế từ Google Play được khử trùng lặp, phản ánh chính xác từng va chạm trải nghiệm hàng ngày.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-1">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Phân Tích ABSA 7 Khía Cạnh</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tách nhỏ từng câu đánh giá phức tạp thành các khía cạnh độc lập: Đăng nhập, Giao dịch, UI/UX, Hiệu năng, Phí, Hỗ trợ, Ưu đãi.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Đối Sánh Minh Chứng Rõ Ràng</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mọi chỉ số đều đối chiếu trực tiếp với câu bình luận nguyên bản, không dùng dữ liệu giả lập hay phỏng đoán chủ quan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

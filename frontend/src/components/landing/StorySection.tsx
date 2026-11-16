"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StorySection() {
  return (
    <section id="platform" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Signature Stitch Headline - Cùng 1 hàng ngang duy nhất, to rõ, sắc sảo */}
        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.75rem] 2xl:text-[4.25rem] font-extrabold tracking-tight text-white leading-tight whitespace-nowrap select-none drop-shadow-md">
          VietNam Digital Banking Intelligence
        </h2>

        {/* Subtitle Statement */}
        <p className="mt-6 text-base sm:text-xl md:text-2xl text-slate-300 font-normal leading-relaxed max-w-4xl">
          Nền tảng phân tích phản hồi người dùng dựa trên Sentiment Analysis và Aspect-Based Sentiment Analysis (ABSA), cung cấp góc nhìn chuyên sâu về trải nghiệm ngân hàng số tại Việt Nam.
        </p>

        {/* Signature Stitch Big Pill Button (Phóng to, nổi bật với viền neon phát sáng) */}
        <div className="mt-10 sm:mt-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 sm:gap-3.5 px-10 sm:px-14 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold text-white bg-slate-900/95 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.3)] hover:shadow-[0_0_55px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300 active:scale-95 backdrop-blur-xl group"
          >
            <span>Bắt đầu khám phá</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>


      </div>
    </section>
  );
}

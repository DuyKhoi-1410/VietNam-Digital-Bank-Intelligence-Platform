"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";
import { resolveUniversalSearch, CANONICAL_BANKS, CANONICAL_ASPECTS } from "@/lib/bankMatcher";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      router.push("/dashboard/reviews?hide_sidebar=1");
      return;
    }

    // Resolve bank and aspect aliases with universal search resolver
    const { canonicalBank, canonicalAspect, cleanKeyword } = resolveUniversalSearch(query);

    const params = new URLSearchParams();
    if (canonicalBank) {
      params.set("bank", canonicalBank);
    }
    if (canonicalAspect) {
      params.set("aspect", canonicalAspect);
    }
    if (cleanKeyword) {
      params.set("keyword", cleanKeyword);
    }
    params.set("hide_sidebar", "1");

    const queryString = params.toString();
    router.push(`/dashboard/reviews${queryString ? `?${queryString}` : ""}`);
  };

  const handleQuickBankSelect = (bank: string) => {
    router.push(`/dashboard/reviews?bank=${encodeURIComponent(bank)}&hide_sidebar=1`);
  };

  const handleQuickAspectSelect = (aspect: string) => {
    router.push(`/dashboard/reviews?aspect=${encodeURIComponent(aspect)}&hide_sidebar=1`);
  };

  return (
    <section id="overview" className="relative min-h-screen flex flex-col items-center justify-start pt-28 sm:pt-[calc(50vh-190px)] pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center w-full">
        {/* Large Editorial Headline - Đảm bảo chuẩn xác đúng 2 dòng, kích thước to rõ, đậm nét */}
        <h1 className="text-4xl sm:text-5xl md:text-[4.25rem] lg:text-[4.85rem] xl:text-[5.5rem] 2xl:text-[6.15rem] font-extrabold tracking-tight text-white max-w-7xl leading-[1.08] sm:leading-[1.04] drop-shadow-2xl select-none">
          <span className="block whitespace-nowrap">Vietnam Digital Banking</span>
          <span className="block whitespace-nowrap text-gradient-aurora">Intelligence Platform.</span>
        </h1>

        {/* Subtitle Statement */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
          Chuyển hóa 19,303 phản hồi người dùng thực tế thành dữ liệu thông minh và phân tích cảm xúc đa chiều trên 7 ứng dụng ngân hàng số.
        </p>

        {/* =========================================================================
            GOOGLE STITCH SIGNATURE PROMPT & EXPLORATION CARD
            Frosted dark glass, interactive input, and Send button
            ========================================================================= */}
        <div className="mt-7 sm:mt-8 w-full max-w-2xl">
          <form
            onSubmit={handleSearch}
            className="w-full min-h-[110px] sm:min-h-[125px] bg-[#0d1322]/85 backdrop-blur-2xl border border-slate-700/60 hover:border-slate-600 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 transition-all duration-200 flex flex-col justify-between text-left"
          >
            {/* Input field */}
            <div className="w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn muốn phân tích ngân hàng hay khía cạnh nào? (VD: Vietcombank, MB, Giao diện, OTP, Chuyển tiền...)"
                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 text-base sm:text-lg font-normal py-1"
              />
            </div>

            {/* Bottom row with ONLY the Send Button at the bottom right */}
            <div className="flex items-center justify-end mt-4 pt-2">
              <button
                type="submit"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-200 text-black flex items-center justify-center transition active:scale-95 shadow-lg shadow-white/20"
                title="Gửi câu lệnh tìm kiếm"
              >
                <ArrowUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 font-bold" />
              </button>
            </div>
          </form>

          {/* Quick interactive chips */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 px-1">
            <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Truy cập nhanh:
            </span>
            {CANONICAL_BANKS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleQuickBankSelect(b)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all shadow-sm active:scale-95"
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

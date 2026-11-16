"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, SlidersHorizontal, ArrowUp, Sparkles } from "lucide-react";
import { SlidingToggle } from "@/components/ui/SlidingToggle";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"banks" | "aspects">("banks");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      router.push("/dashboard");
      return;
    }
    router.push(`/dashboard/reviews?q=${encodeURIComponent(query.trim())}`);
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
            Frosted dark glass, interactive input, bottom control bar, and suggestions
            ========================================================================= */}
        <div className="mt-7 sm:mt-8 w-full max-w-2xl">
          <form
            onSubmit={handleSearch}
            className="w-full bg-[#0d1322]/85 backdrop-blur-2xl border border-slate-700/60 hover:border-slate-600 rounded-3xl p-5 shadow-2xl shadow-black/80 transition-all duration-200 text-left"
          >
            {/* Input field */}
            <div className="w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn muốn phân tích trải nghiệm ngân hàng nào? (Ví dụ: Vietcombank, Techcombank, MBBank...)"
                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 text-base sm:text-lg font-normal py-2"
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="mt-6 pt-3 flex items-center justify-between border-t border-slate-800/80">
              {/* Left Controls: Plus + Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/reviews")}
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white transition"
                  title="Thêm bộ lọc"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <SlidingToggle<"banks" | "aspects">
                  id="hero-tab-toggle"
                  variant="pill"
                  value={activeTab}
                  onChange={setActiveTab}
                  options={[
                    { value: "banks", label: "7 Ngân hàng", icon: "🏛️" },
                    { value: "aspects", label: "7 Khía cạnh", icon: "📊" },
                  ]}
                />
              </div>

              {/* Right Controls: Filter + Mic + Send */}
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 bg-slate-900/90 border border-slate-800">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Trí tuệ ABSA</span>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/benchmark")}
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
                  title="Tùy chỉnh đối sánh"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>

                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-black flex items-center justify-center transition active:scale-95 shadow-lg shadow-white/20"
                  title="Gửi câu lệnh tìm kiếm"
                >
                  <ArrowUp className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

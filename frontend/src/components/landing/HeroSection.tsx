"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, SlidersHorizontal, Mic, ArrowUp, Sparkles, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { MarketOverviewResponse } from "@/types";
import { formatNumber } from "@/lib/utils";
import { SlidingToggle } from "@/components/ui/SlidingToggle";

const SUGGESTIONS = [
  { text: "Đăng nhập sinh trắc học Vietcombank & BIDV", target: "/dashboard/reviews?aspect=Login+%26+Authentication" },
  { text: "So sánh trải nghiệm chuyển tiền Techcombank vs MBBank", target: "/dashboard/benchmark" },
  { text: "Top điểm nghẽn trải nghiệm khiến người dùng vote 1 sao", target: "/dashboard/reviews?rating=1" },
];

export function HeroSection() {
  const router = useRouter();
  const [liveOverview, setLiveOverview] = useState<MarketOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"banks" | "aspects">("banks");

  useEffect(() => {
    let mounted = true;
    api
      .getMarketOverview()
      .then((data) => {
        if (mounted) {
          setLiveOverview(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      router.push("/dashboard");
      return;
    }
    router.push(`/dashboard/reviews?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center w-full">
        {/* Dynamic Live Dataset Badge (Retrieved strictly from BigQuery backend) */}
        <div className="mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 shadow-xl shadow-black/60 backdrop-blur-md">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Đang kết nối dữ liệu BigQuery thời gian thực...</span>
            </div>
          ) : liveOverview ? (
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>
                <strong className="text-white font-semibold">{formatNumber(liveOverview.unique_baseline_reviews)}</strong> Đánh Giá Hợp Lệ
              </span>
              <span className="text-slate-600">•</span>
              <span>
                <strong className="text-white font-semibold">{liveOverview.total_banks_tracked}</strong> Ứng Dụng Ngân Hàng
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">Live BigQuery</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vietnam Digital Banking Intelligence — Dữ Liệu Thực Chứng</span>
            </div>
          )}
        </div>

        {/* Large Editorial Headline - Màu gradient cực quang Aurora rực rỡ */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.08] sm:leading-[1.06]">
          Vietnam Digital Banking <br className="hidden sm:inline" />
          <span className="text-gradient-aurora">Intelligence Platform.</span>
        </h1>

        {/* Subtitle Statement */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          Chuyển hóa 19,303 phản hồi người dùng thực tế thành dữ liệu thông minh và phân tích cảm xúc đa chiều trên 7 ứng dụng ngân hàng số.
        </p>

        {/* =========================================================================
            GOOGLE STITCH SIGNATURE PROMPT & EXPLORATION CARD
            Frosted dark glass, interactive input, bottom control bar, and suggestions
            ========================================================================= */}
        <div className="mt-10 w-full max-w-2xl">
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

          {/* Quick Suggestions Chips - Chuẩn Google Stitch (✦ chip buttons) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item.text);
                  router.push(item.target);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition backdrop-blur-md"
              >
                <span className="text-cyan-400 text-[10px]">✦</span>
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

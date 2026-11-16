"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  MarketOverviewResponse,
  MarketTrendsResponse,
  MarketAspectsResponse,
} from "@/types";
import { formatNumber, formatPercent, formatRating, getAspectViName } from "@/lib/utils";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { AspectNSSChart } from "@/components/charts/AspectNSSChart";
import { SlidingToggle } from "@/components/ui/SlidingToggle";
import {
  TrendingUp,
  Star,
  Users,
  AlertTriangle,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  BarChart2,
  Table as TableIcon,
} from "lucide-react";

export default function MarketOverviewPage() {
  const [overview, setOverview] = useState<MarketOverviewResponse | null>(null);
  const [trends, setTrends] = useState<MarketTrendsResponse | null>(null);
  const [aspectsData, setAspectsData] = useState<MarketAspectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View toggle states: Chart vs Table
  const [trendView, setTrendView] = useState<"chart" | "table">("chart");
  const [aspectView, setAspectView] = useState<"chart" | "table">("chart");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, tr, asp] = await Promise.all([
        api.getMarketOverview(),
        api.getMarketTrends(),
        api.getMarketAspects(),
      ]);
      setOverview(ov);
      setTrends(tr);
      setAspectsData(asp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu tổng quan thị trường");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Đang đồng bộ dữ liệu phân tích thị trường...</p>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="glass-panel rounded-2xl p-8 border-rose-500/30 text-center max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Lỗi Kết Nối Máy Chủ</h3>
        <p className="text-sm text-slate-300 mb-6">{error}</p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Tải lại dữ liệu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Tổng Quan Thị Trường
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Trí tuệ dữ liệu trải nghiệm ngân hàng số toàn hệ thống trên 7 ứng dụng thương mại
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Giai đoạn: {overview.date_range}</span>
          </div>
          <button
            onClick={loadData}
            title="Làm mới dữ liệu phân tích"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Valid Reviews */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Tổng Đánh Giá Hợp Lệ</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white font-mono">
              {formatNumber(overview.unique_baseline_reviews)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              19.303 phản hồi thực tế (sau khi loại bỏ trùng lặp)
            </div>
          </div>
        </div>

        {/* Metric 2: Average Rating */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Điểm Đánh Giá Trung Bình</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white font-mono flex items-baseline gap-1">
              <span>{formatRating(overview.market_average_rating)}</span>
              <span className="text-xs text-slate-400">/ 5.00 ★</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Tính trên 7 ứng dụng ngân hàng số hàng đầu
            </div>
          </div>
        </div>

        {/* Metric 3: Positive Ratio */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Tỷ Lệ Positive Sentiment</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 font-mono">
              {formatPercent(overview.sentiment_distribution.positive_pct)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {formatNumber(overview.sentiment_distribution.positive_count)} đánh giá Positive (Tích cực)
            </div>
          </div>
        </div>

        {/* Metric 4: Evaluated Long Reviews */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Đánh Giá Chi Tiết ABSA</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-violet-300 font-mono">
              {formatNumber(aspectsData?.total_detailed_reviews || 8666)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {formatNumber(aspectsData?.total_sub_sentences || 13864)} câu bóc tách khía cạnh (đánh giá ≥ 4 từ)
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">
          Phân Bổ Sentiment Người Dùng (7 Ngân Hàng)
        </h2>
        {/* Horizontal Stacked Bar */}
        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex mb-4">
          <div
            style={{ width: `${overview.sentiment_distribution.positive_pct}%` }}
            className="bg-emerald-500 h-full"
            title={`Positive: ${formatPercent(overview.sentiment_distribution.positive_pct)}`}
          />
          <div
            style={{ width: `${overview.sentiment_distribution.neutral_pct}%` }}
            className="bg-amber-500 h-full"
            title={`Neutral: ${formatPercent(overview.sentiment_distribution.neutral_pct)}`}
          />
          <div
            style={{ width: `${overview.sentiment_distribution.negative_pct}%` }}
            className="bg-rose-500 h-full"
            title={`Negative: ${formatPercent(overview.sentiment_distribution.negative_pct)}`}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-xs font-semibold text-emerald-400">Positive (Tích cực)</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {formatPercent(overview.sentiment_distribution.positive_pct)}
            </div>
            <div className="text-[11px] text-slate-400">
              {formatNumber(overview.sentiment_distribution.positive_count)} đánh giá
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="text-xs font-semibold text-amber-400">Neutral (Trung tính)</div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              {formatPercent(overview.sentiment_distribution.neutral_pct)}
            </div>
            <div className="text-[11px] text-slate-400">
              {formatNumber(overview.sentiment_distribution.neutral_count)} đánh giá
            </div>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <div className="text-xs font-semibold text-rose-400">Negative (Tiêu cực)</div>
            <div className="text-lg font-bold text-rose-400 font-mono">
              {formatPercent(overview.sentiment_distribution.negative_pct)}
            </div>
            <div className="text-[11px] text-slate-400">
              {formatNumber(overview.sentiment_distribution.negative_count)} đánh giá
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends - Interactive Dual-Axis Chart & Table Toggle */}
      {trends && trends.monthly_trends.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Biến Động Đánh Giá Theo Thời Gian
              </h2>
              <span className="text-xs text-slate-400 font-mono">Khoảng thời gian: {trends.date_range}</span>
            </div>

            {/* Toggle View: Animated Sliding Toggle */}
            <SlidingToggle<"chart" | "table">
              id="dashboard-trend-toggle"
              value={trendView}
              onChange={setTrendView}
              options={[
                { value: "chart", label: "Biểu Đồ Xu Hướng", icon: <BarChart2 className="w-3.5 h-3.5" /> },
                { value: "table", label: "Bảng Số Liệu", icon: <TableIcon className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {trendView === "chart" ? (
            <MonthlyTrendChart data={trends.monthly_trends} dateRange={trends.date_range} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tháng Đánh Giá</th>
                    <th className="py-3 px-4">Số Lượng Đánh Giá</th>
                    <th className="py-3 px-4">Điểm Sao Trung Bình</th>
                    <th className="py-3 px-4 text-emerald-400">Positive</th>
                    <th className="py-3 px-4 text-amber-400">Neutral</th>
                    <th className="py-3 px-4 text-rose-400">Negative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {trends.monthly_trends.map((t) => (
                    <tr key={t.review_month} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-white font-medium">{t.review_month}</td>
                      <td className="py-3 px-4 text-slate-300">{formatNumber(t.review_volume)}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">{formatRating(t.average_rating)} ★</td>
                      <td className="py-3 px-4 text-emerald-400">{formatNumber(t.positive_reviews)}</td>
                      <td className="py-3 px-4 text-amber-400">{formatNumber(t.neutral_reviews)}</td>
                      <td className="py-3 px-4 text-rose-400">{formatNumber(t.negative_reviews)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 7 Banking Aspects & Pain Points */}
      {aspectsData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Aspects Breakdown (Span 8) with Chart Toggle */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  7 Khía Cạnh Trải Nghiệm Cốt Lõi (ABSA)
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {formatNumber(aspectsData.total_sub_sentences)} câu phản hồi bóc tách theo mô hình ABSA
                </span>
              </div>

              {/* Toggle View: Animated Sliding Toggle */}
              <SlidingToggle<"chart" | "table">
                id="dashboard-aspect-toggle"
                value={aspectView}
                onChange={setAspectView}
                options={[
                  { value: "chart", label: "Biểu Đồ Khía Cạnh ABSA", icon: <BarChart2 className="w-3.5 h-3.5" /> },
                  { value: "table", label: "Bảng Chi Tiết", icon: <TableIcon className="w-3.5 h-3.5" /> },
                ]}
              />
            </div>

            {aspectView === "chart" ? (
              <AspectNSSChart
                aspects={aspectsData.aspects}
                totalSubSentences={aspectsData.total_sub_sentences}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Khía Cạnh (ABSA)</th>
                      <th className="py-3 px-4">Số Câu Phản Hồi</th>
                      <th className="py-3 px-4 text-emerald-400">Positive</th>
                      <th className="py-3 px-4 text-rose-400">Negative</th>
                      <th className="py-3 px-4">Chỉ Số Hài Lòng Ròng (NSS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {aspectsData.aspects.map((asp) => (
                      <tr key={asp.aspect_name} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-white font-medium">{getAspectViName(asp.aspect_name)}</td>
                        <td className="py-3 px-4 text-slate-300">{formatNumber(asp.sub_sentence_count)}</td>
                        <td className="py-3 px-4 text-emerald-400">{formatNumber(asp.positive_count)}</td>
                        <td className="py-3 px-4 text-rose-400">{formatNumber(asp.negative_count)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              asp.net_sentiment_score >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {asp.net_sentiment_score > 0 ? "+" : ""}
                            {asp.net_sentiment_score.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pain Points (Span 4) */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 mb-4">
                <AlertTriangle className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                  Vấn Đề Bị Phàn Nàn Nhiều Nhất
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Các tính năng nhận nhiều ý kiến tiêu cực và bức xúc nhất từ người dùng:
              </p>

              <div className="space-y-3">
                {aspectsData.pain_points.slice(0, 4).map((pp) => (
                  <div key={pp.aspect_name} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                    <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                      <span>{getAspectViName(pp.aspect_name)}</span>
                      <span className="text-rose-400 font-mono">{formatNumber(pp.negative_sub_sentences)} phàn nàn</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-1">{pp.primary_complaint_driver}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Chiếm tỷ lệ: {formatPercent(pp.negative_share_pct)} • Chỉ số NSS: {pp.net_sentiment_score.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Chỉ số NSS = ((Khen ngợi - Phàn nàn) / Tổng phản hồi) × 100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

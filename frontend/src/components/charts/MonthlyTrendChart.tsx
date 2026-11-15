"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { MonthlyMarketTrend } from "@/types";
import { formatNumber, formatPercent, formatRating } from "@/lib/utils";
import { SlidingToggle } from "@/components/ui/SlidingToggle";

interface MonthlyTrendChartProps {
  data: MonthlyMarketTrend[];
  dateRange: string;
}

export function MonthlyTrendChart({ data, dateRange }: MonthlyTrendChartProps) {
  const [viewMode, setViewMode] = useState<"rating" | "sentiment">("rating");

  // Format data for Recharts
  const chartData = data.map((item) => ({
    month: item.review_month,
    volume: item.review_volume,
    rating: item.average_rating,
    positivePct: item.review_volume > 0 ? (item.positive_reviews / item.review_volume) * 100 : 0,
    negativePct: item.review_volume > 0 ? (item.negative_reviews / item.review_volume) * 100 : 0,
    positiveCount: item.positive_reviews,
    neutralCount: item.neutral_reviews,
    negativeCount: item.negative_reviews,
  }));

  return (
    <div className="w-full space-y-4">
      {/* Chart Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Xu Hướng Đánh Giá Theo Tháng
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Đối chiếu giữa số lượt đánh giá và {viewMode === "rating" ? "điểm sao trung bình" : "tỷ lệ tích cực"} ({dateRange})
          </p>
        </div>

        <SlidingToggle<"rating" | "sentiment">
          id="monthly-metric-toggle"
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: "rating", label: "★ Điểm Sao Trung Bình" },
            { value: "sentiment", label: "% Positive Sentiment" },
          ]}
        />
      </div>

      {/* Main Chart Container */}
      <div className="h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              {/* Gradient for volume area fill */}
              <linearGradient id="volumeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />

            {/* Left Y-Axis: Volume */}
            <YAxis
              yAxisId="left"
              stroke="#06b6d4"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />

            {/* Right Y-Axis: Rating or Sentiment % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={viewMode === "rating" ? "#fbbf24" : "#10b981"}
              fontSize={11}
              domain={viewMode === "rating" ? [1, 5] : [0, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (viewMode === "rating" ? `${v}★` : `${v}%`)}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass-panel p-3.5 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-2 min-w-[200px]">
                    <div className="font-bold text-white border-b border-slate-700 pb-1.5 flex justify-between items-center">
                      <span>Tháng {d.month}</span>
                      <span className="text-amber-400">{formatRating(d.rating)} ★</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-cyan-400">Số lượt đánh giá:</span>
                        <span className="font-bold text-white">{formatNumber(d.volume)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-emerald-400">Tỷ lệ Positive:</span>
                        <span className="font-bold text-emerald-400">{formatPercent(d.positivePct)} ({formatNumber(d.positiveCount)})</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-rose-400">Tỷ lệ Negative:</span>
                        <span className="font-bold text-rose-400">{formatPercent(d.negativePct)} ({formatNumber(d.negativeCount)})</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs font-mono text-slate-300">
                  {value === "volume"
                    ? "Số Lượt Đánh Giá"
                    : value === "rating"
                    ? "Điểm Sao TB (★)"
                    : "Tỷ Lệ Positive (%)"}
                </span>
              )}
            />

            {/* Volume Area (Left axis) */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="volume"
              name="volume"
              fill="url(#volumeAreaGrad)"
              stroke="#06b6d4"
              strokeWidth={2}
            />

            {/* Rating or Sentiment Line (Right axis) */}
            {viewMode === "rating" ? (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rating"
                name="rating"
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#fbbf24", stroke: "#0f172a", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#f59e0b" }}
              />
            ) : (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="positivePct"
                name="positivePct"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#10b981", stroke: "#0f172a", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#059669" }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Takeaway Footer */}
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>💡 Nhận định Data Analyst: Biểu đồ kết hợp trục kép giúp nhận diện tức thì các tháng bùng nổ phản hồi tiêu cực đi kèm sụt giảm điểm sao.</span>
      </div>
    </div>
  );
}

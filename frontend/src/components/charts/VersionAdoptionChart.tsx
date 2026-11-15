"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { VersionPerformanceItem } from "@/types";
import { formatNumber, formatPercent, formatRating } from "@/lib/utils";
import { SlidingToggle } from "@/components/ui/SlidingToggle";

interface VersionAdoptionChartProps {
  bankName: string;
  versions: VersionPerformanceItem[];
  totalVersioned: number;
}

export function VersionAdoptionChart({
  bankName,
  versions,
  totalVersioned,
}: VersionAdoptionChartProps) {
  const [chartMode, setChartMode] = useState<"dual" | "stacked">("dual");

  // Take top 8 most significant versions by review volume, then sort them chronologically (oldest -> newest, left to right)
  const topVersions = [...versions]
    .slice(0, 8)
    .sort((a, b) => {
      const pa = a.app_version.replace(/^[vV]/, "").trim().split(".").map((p) => parseInt(p, 10) || 0);
      const pb = b.app_version.replace(/^[vV]/, "").trim().split(".").map((p) => parseInt(p, 10) || 0);
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na !== nb) return na - nb;
      }
      return 0;
    });

  const chartData = topVersions.map((v) => {
    const total = v.review_count;
    const s1 = v.star_breakdown?.star_1 || 0;
    const s2 = v.star_breakdown?.star_2 || 0;
    const s3 = v.star_breakdown?.star_3 || 0;
    const s4 = v.star_breakdown?.star_4 || 0;
    const s5 = v.star_breakdown?.star_5 || 0;

    return {
      version: v.app_version,
      volume: v.review_count,
      rating: v.average_rating,
      sharePct: v.version_share_pct,
      star1: total > 0 ? (s1 / total) * 100 : 0,
      star2: total > 0 ? (s2 / total) * 100 : 0,
      star3: total > 0 ? (s3 / total) * 100 : 0,
      star4: total > 0 ? (s4 / total) * 100 : 0,
      star5: total > 0 ? (s5 / total) * 100 : 0,
      star1Count: s1,
      star5Count: s5,
    };
  });

  return (
    <div className="w-full space-y-4">
      {/* Header & Mode Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            {chartMode === "dual"
              ? "Biểu Đồ Tương Quan Số Lượng & Điểm Sao Theo Phiên Bản"
              : "Cấu Trúc Phân Bổ Điểm Đánh Giá 1★ đến 5★ Theo Phiên Bản"}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi {topVersions.length} bản phát hành chủ lực sắp xếp theo tiến trình cập nhật từ cũ đến mới nhất của {bankName}
          </p>
        </div>

        <SlidingToggle<"dual" | "stacked">
          id="version-chart-mode-toggle"
          value={chartMode}
          onChange={setChartMode}
          options={[
            { value: "dual", label: "📊 Số Lượng & Điểm Sao" },
            { value: "stacked", label: "📈 Phân Bổ 1★ - 5★ (100%)" },
          ]}
        />
      </div>

      {/* Main Chart Area */}
      <div className="h-[340px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === "dual" ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="versionBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="version"
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
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
              />

              {/* Right Y-Axis: Rating 1-5 */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#fbbf24"
                fontSize={11}
                domain={[1, 5]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}★`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="glass-panel p-3.5 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-2 min-w-[220px]">
                      <div className="font-bold text-white border-b border-slate-700 pb-1.5 flex justify-between items-center">
                        <span className="text-cyan-400">Bản build: v{d.version}</span>
                        <span className="text-amber-400 font-bold">{formatRating(d.rating)} ★</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Số lượt đánh giá:</span>
                          <span className="font-bold text-white">{formatNumber(d.volume)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Tỷ trọng trong bank:</span>
                          <span className="font-semibold text-cyan-300">{formatPercent(d.sharePct)}</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[11px]">
                          <span className="text-rose-400">1★: {formatNumber(d.star1Count)}</span>
                          <span className="text-emerald-400">5★: {formatNumber(d.star5Count)}</span>
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
                formatter={(value) => {
                  const map: Record<string, string> = {
                    volume: "Số Lượt Đánh Giá (Cột)",
                    rating: "Điểm Sao TB (Đường ★)",
                  };
                  return <span className="text-xs font-mono text-slate-300">{map[value] || value}</span>;
                }}
              />

              <Bar
                yAxisId="left"
                dataKey="volume"
                name="volume"
                fill="url(#versionBarGrad)"
                radius={[4, 4, 0, 0]}
              />

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
            </ComposedChart>
          ) : (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 25, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />

              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
              />

              <YAxis
                type="category"
                dataKey="version"
                stroke="#cbd5e1"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                width={70}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="glass-panel p-3.5 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-2 min-w-[210px]">
                      <div className="font-bold text-white border-b border-slate-700 pb-1 flex justify-between">
                        <span>Bản v{d.version}</span>
                        <span className="text-amber-400">{formatRating(d.rating)} ★</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>5 Sao:</span>
                          <span>{formatPercent(d.star5, 1)}</span>
                        </div>
                        <div className="flex justify-between text-lime-400">
                          <span>4 Sao:</span>
                          <span>{formatPercent(d.star4, 1)}</span>
                        </div>
                        <div className="flex justify-between text-amber-400">
                          <span>3 Sao:</span>
                          <span>{formatPercent(d.star3, 1)}</span>
                        </div>
                        <div className="flex justify-between text-orange-400">
                          <span>2 Sao:</span>
                          <span>{formatPercent(d.star2, 1)}</span>
                        </div>
                        <div className="flex justify-between text-rose-500 font-semibold">
                          <span>1 Sao:</span>
                          <span>{formatPercent(d.star1, 1)}</span>
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
                formatter={(value) => {
                  const map: Record<string, string> = {
                    star1: "1★",
                    star2: "2★",
                    star3: "3★",
                    star4: "4★",
                    star5: "5★",
                  };
                  return <span className="text-xs font-mono text-slate-300">{map[value] || value}</span>;
                }}
              />

              <Bar dataKey="star1" name="star1" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="star2" name="star2" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
              <Bar dataKey="star3" name="star3" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} />
              <Bar dataKey="star4" name="star4" stackId="a" fill="#84cc16" radius={[0, 0, 0, 0]} />
              <Bar dataKey="star5" name="star5" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Data Analyst Insight Banner */}
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>💡 Nhận định Data Analyst: Biểu đồ phiên bản giúp phát hiện kịp thời các đợt phát hành bị tụt điểm sao (Regression Spike) đi kèm lượng 1★ tăng đột biến, giúp đội ngũ kỹ thuật khoanh vùng lỗi của từng bản cập nhật.</span>
      </div>
    </div>
  );
}

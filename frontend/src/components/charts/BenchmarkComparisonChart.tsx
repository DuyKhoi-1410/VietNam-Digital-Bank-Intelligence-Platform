"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { BankComparisonEntry } from "@/types";
import { formatPercent, formatRating, getAspectViName } from "@/lib/utils";

interface BenchmarkComparisonChartProps {
  data: BankComparisonEntry[];
}

export function BenchmarkComparisonChart({ data }: BenchmarkComparisonChartProps) {
  const chartData = data.map((b) => ({
    bank: b.bank_name.replace(" SmartBanking", "").replace(" Mobile", "").replace(" iPay", ""),
    fullName: b.bank_name,
    rating: b.average_rating,
    positivePct: b.positive_pct,
    negativePct: b.negative_pct,
    totalReviews: b.total_reviews,
    topStrength: getAspectViName(b.top_strength_aspect),
    topStrengthNss: b.top_strength_nss,
    topWeakness: getAspectViName(b.top_weakness_aspect),
    topWeaknessNss: b.top_weakness_nss,
  }));

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          So Sánh Trực Tiếp Điểm Sao & Mức Độ Hài Lòng
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Đối chiếu giữa điểm đánh giá Google Play (★) và tỷ lệ Tích cực / Tiêu cực (%) của từng ngân hàng
        </p>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="bank"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />

            {/* Left Y-Axis: Sentiment % */}
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
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
                    <div className="font-bold text-white border-b border-slate-700 pb-1 flex justify-between">
                      <span>{d.fullName}</span>
                      <span className="text-amber-400 font-bold">{formatRating(d.rating)} ★</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-emerald-400">
                        <span>Tỷ lệ Positive:</span>
                        <span className="font-bold">{formatPercent(d.positivePct)}</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Tỷ lệ Negative:</span>
                        <span className="font-bold">{formatPercent(d.negativePct)}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400">Thế mạnh: </span>
                        <span className="text-emerald-400">{d.topStrength} (+{d.topStrengthNss.toFixed(1)})</span>
                      </div>
                      <div className="text-[11px]">
                        <span className="text-slate-400">Điểm yếu: </span>
                        <span className="text-rose-400">{d.topWeakness} ({d.topWeaknessNss.toFixed(1)})</span>
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
                  positivePct: "Tỷ Lệ Positive (%)",
                  negativePct: "Tỷ Lệ Negative (%)",
                  rating: "Điểm Sao TB (★)",
                };
                return <span className="text-xs font-mono text-slate-300">{map[value] || value}</span>;
              }}
            />

            <Bar yAxisId="left" dataKey="positivePct" name="positivePct" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="negativePct" name="negativePct" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="rating" name="rating" fill="#fbbf24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>💡 Nhận định Data Analyst: Tương quan giữa cột xanh (Tích cực) và cột vàng (Sao TB) bộc lộ ngân hàng nào có chất lượng dịch vụ đồng đều thực chất.</span>
      </div>
    </div>
  );
}

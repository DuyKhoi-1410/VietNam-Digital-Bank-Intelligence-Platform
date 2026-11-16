"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { RatingDistributionEntry } from "@/types";
import { formatNumber, formatPercent } from "@/lib/utils";

interface NormalizedRatingChartProps {
  data: RatingDistributionEntry[];
}

export function NormalizedRatingChart({ data }: NormalizedRatingChartProps) {
  const chartData = data.map((item) => ({
    bank: item.bank_name.replace(" SmartBanking", "").replace(" Mobile", "").replace(" iPay", ""),
    fullName: item.bank_name,
    totalReviews: item.total_rated_reviews,
    star1: item.star_1_pct,
    star2: item.star_2_pct,
    star3: item.star_3_pct,
    star4: item.star_4_pct,
    star5: item.star_5_pct,
  }));

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Tỷ Lệ Phân Bổ Điểm Đánh Giá Sao (1★ đến 5★)
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          So sánh tỷ lệ % từng mức sao trên toàn bộ đánh giá của mỗi ngân hàng, nhận diện độ hài lòng và tỷ lệ đánh giá tiêu cực (1-2★)
        </p>
      </div>

      {/* Chart */}
      <div className="h-[340px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => `${v}%`}
            />

            <YAxis
              type="category"
              dataKey="bank"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              width={120}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass-panel p-3.5 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-2 min-w-[220px]">
                    <div className="font-bold text-white border-b border-slate-700 pb-1 flex justify-between">
                      <span>{d.fullName}</span>
                      <span className="text-cyan-400">{formatNumber(d.totalReviews)} đánh giá</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>5 Sao (Rất hài lòng):</span>
                        <span>{formatPercent(d.star5, 1)}</span>
                      </div>
                      <div className="flex justify-between text-lime-400">
                        <span>4 Sao (Hài lòng):</span>
                        <span>{formatPercent(d.star4, 1)}</span>
                      </div>
                      <div className="flex justify-between text-amber-400">
                        <span>3 Sao (Bình thường):</span>
                        <span>{formatPercent(d.star3, 1)}</span>
                      </div>
                      <div className="flex justify-between text-orange-400">
                        <span>2 Sao (Không hài lòng):</span>
                        <span>{formatPercent(d.star2, 1)}</span>
                      </div>
                      <div className="flex justify-between text-rose-500 font-semibold">
                        <span>1 Sao (Rất không hài lòng):</span>
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
        </ResponsiveContainer>
      </div>

      {/* Analytical Guidance */}
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>💡 Nhận định Data Analyst: Tỷ trọng dải màu đỏ (1★) lớn cho thấy app đang gặp khủng hoảng trải nghiệm (friction spike), trong khi dải xanh (5★) chiếm đa số thể hiện sự trung thành thương hiệu cao.</span>
      </div>
    </div>
  );
}

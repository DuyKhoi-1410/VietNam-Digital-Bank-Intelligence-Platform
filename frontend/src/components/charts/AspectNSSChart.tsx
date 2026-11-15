"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import { AspectMetric } from "@/types";
import { formatNumber, formatPercent, getAspectViName } from "@/lib/utils";

interface AspectNSSChartProps {
  aspects: AspectMetric[];
  totalSubSentences: number;
}

export function AspectNSSChart({ aspects, totalSubSentences }: AspectNSSChartProps) {
  // Sort aspects by Net Sentiment Score descending (best performers at the top)
  const sortedData = [...aspects].sort((a, b) => b.net_sentiment_score - a.net_sentiment_score);

  const chartData = sortedData.map((asp) => ({
    aspect: getAspectViName(asp.aspect_name),
    rawAspect: asp.aspect_name,
    nss: parseFloat(asp.net_sentiment_score.toFixed(1)),
    volume: asp.sub_sentence_count,
    sharePct: totalSubSentences > 0 ? (asp.sub_sentence_count / totalSubSentences) * 100 : 0,
    positive: asp.positive_count,
    negative: asp.negative_count,
  }));

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Mức Độ Hài Lòng Theo 7 Khía Cạnh (Mô Hình ABSA)
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chỉ số NSS phản ánh mức độ hài lòng thực tế của khách hàng: Dương là Positive, Âm là Negative
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[340px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 35, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />

            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              domain={[-60, 60]}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
            />

            <YAxis
              type="category"
              dataKey="aspect"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              width={180}
            />

            <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                const isPos = d.nss >= 0;
                return (
                  <div className="glass-panel p-3.5 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-2 min-w-[220px]">
                    <div className="font-bold text-white border-b border-slate-700 pb-1.5 flex justify-between items-center">
                      <span>{d.aspect}</span>
                      <span className={`font-bold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                        NSS: {d.nss > 0 ? "+" : ""}{d.nss}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Số câu phụ phân tích:</span>
                        <span className="font-bold text-white">{formatNumber(d.volume)} ({formatPercent(d.sharePct)})</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-emerald-400">Positive:</span>
                        <span className="font-bold text-emerald-400">{formatNumber(d.positive)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-rose-400">Negative:</span>
                        <span className="font-bold text-rose-400">{formatNumber(d.negative)}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Bar dataKey="nss" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.nss >= 0 ? "#10b981" : "#f43f5e"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Guidance */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">NSS Dương: Khách hàng khen ngợi & hài lòng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">NSS Âm: Khách hàng phàn nàn & gặp lỗi</span>
          </div>
        </div>
        <span className="text-cyan-400">Quy mô: {formatNumber(totalSubSentences)} câu phản hồi bóc tách</span>
      </div>
    </div>
  );
}

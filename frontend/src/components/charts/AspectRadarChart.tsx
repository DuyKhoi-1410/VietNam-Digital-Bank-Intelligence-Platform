"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import { BankAspectScore } from "@/types";
import { getAspectViName } from "@/lib/utils";
import { SlidingToggle } from "@/components/ui/SlidingToggle";

interface AspectRadarChartProps {
  bankName: string;
  aspects: BankAspectScore[];
}

export function AspectRadarChart({ bankName, aspects }: AspectRadarChartProps) {
  const [chartType, setChartType] = useState<"radar" | "bar">("radar");

  // Recharts Radar requires positive numbers or offset for negative values
  // Since NSS ranges from -100 to +100, we normalize to a 0-100 satisfaction index for radar display:
  // Normalized Index = (NSS + 100) / 2 (where NSS 0 = Index 50, NSS +40 = Index 70)
  const radarData = aspects.map((asp) => ({
    aspect: getAspectViName(asp.aspect_name),
    rawAspect: asp.aspect_name,
    rawNss: parseFloat(asp.net_sentiment_score.toFixed(1)),
    // 0-100 scale for radar shape
    satisfactionIndex: Math.round(((asp.net_sentiment_score + 100) / 2) * 10) / 10,
    volume: asp.sub_sentence_count,
    positive: asp.positive_count,
    negative: asp.negative_count,
  }));

  return (
    <div className="w-full space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Bản Đồ Năng Lực Trải Nghiệm 7 Khía Cạnh (ABSA)
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Điểm hài lòng và năng lực phục vụ của {bankName} theo mô hình bóc tách khía cạnh ABSA
          </p>
        </div>

        <SlidingToggle<"radar" | "bar">
          id="radar-chart-type-toggle"
          value={chartType}
          onChange={setChartType}
          options={[
            { value: "radar", label: "Biểu Đồ Radar", icon: "🕸️" },
            { value: "bar", label: "Biểu Đồ Thanh NSS", icon: "📊" },
          ]}
        />
      </div>

      {chartType === "radar" ? (
        <div className="h-[360px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="aspect"
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickFormatter={(v) => `${v}`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-1.5 min-w-[200px]">
                      <div className="font-bold text-white border-b border-slate-700 pb-1">
                        {d.aspect}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-400">Điểm Cảm Xúc Ròng (NSS):</span>
                        <span className={`font-bold ${d.rawNss >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {d.rawNss > 0 ? "+" : ""}{d.rawNss}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Số câu phụ:</span>
                        <span>{d.volume}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-emerald-400">Positive:</span>
                        <span>{d.positive}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-rose-400">Negative:</span>
                        <span>{d.negative}</span>
                      </div>
                    </div>
                  );
                }}
              />

              <Radar
                name={bankName}
                dataKey="satisfactionIndex"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Legend
                verticalAlign="bottom"
                formatter={() => (
                  <span className="text-xs font-mono text-slate-300">
                    Chỉ số hài lòng tính năng: {bankName} (0: Rất thất vọng, 50: Bình thường, 100: Rất hài lòng)
                  </span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[360px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={radarData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 35, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis
                type="number"
                stroke="#64748b"
                fontSize={11}
                domain={[-100, 100]}
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
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-slate-700 shadow-2xl font-mono text-xs space-y-1 min-w-[190px]">
                      <div className="font-bold text-white border-b border-slate-700 pb-1">{d.aspect}</div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">NSS:</span>
                        <span className={`font-bold ${d.rawNss >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {d.rawNss > 0 ? "+" : ""}{d.rawNss}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Số câu phụ:</span>
                        <span className="text-white">{d.volume}</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="rawNss" radius={[4, 4, 4, 4]}>
                {radarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rawNss >= 0 ? "#10b981" : "#f43f5e"}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Analytical Guidance */}
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>💡 Nhận định Data Analyst: Các khía cạnh co thắt vào tâm thể hiện điểm nghẽn nghiêm trọng cần đội ngũ công nghệ xử lý ưu tiên.</span>
      </div>
    </div>
  );
}

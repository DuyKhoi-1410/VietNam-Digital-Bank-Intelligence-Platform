"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BenchmarkMatrixResponse,
  AspectBenchmarkResponse,
  RatingBenchmarkResponse,
} from "@/types";
import { formatNumber, formatPercent, formatRating, getAspectViName } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { BenchmarkComparisonChart } from "@/components/charts/BenchmarkComparisonChart";
import { NormalizedRatingChart } from "@/components/charts/NormalizedRatingChart";
import { SlidingToggle } from "@/components/ui/SlidingToggle";
import {
  Star,
  RefreshCw,
  AlertTriangle,
  Trophy,
  CheckSquare,
  Square,
  BarChart2,
  Table as TableIcon,
} from "lucide-react";

const ALL_BANKS = [
  "BIDV SmartBanking",
  "Liobank",
  "MB Bank",
  "TNEX",
  "TPBank Mobile",
  "VCB Digibank",
  "VietinBank iPay",
];

export default function BenchmarkPage() {
  const [selectedBanks, setSelectedBanks] = useState<string[]>([
    "BIDV SmartBanking",
    "MB Bank",
    "VCB Digibank",
  ]);

  const [matrixData, setMatrixData] = useState<BenchmarkMatrixResponse | null>(null);
  const [aspectMatrix, setAspectMatrix] = useState<AspectBenchmarkResponse | null>(null);
  const [ratingsData, setRatingsData] = useState<RatingBenchmarkResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View toggle states: Chart vs Table
  const [matrixView, setMatrixView] = useState<"chart" | "table">("chart");
  const [ratingView, setRatingView] = useState<"chart" | "table">("chart");

  // Initial load
  useEffect(() => {
    let mounted = true;
    Promise.all([api.getAspectBenchmark(), api.getRatingBenchmark()])
      .then(([asp, rat]) => {
        if (mounted) {
          setAspectMatrix(asp);
          setRatingsData(rat);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Không thể tải dữ liệu đối sánh");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Load matrix whenever selectedBanks changes
  const loadMatrix = async (banksToQuery: string[]) => {
    setLoadingMatrix(true);
    try {
      const data = await api.getBenchmarkMatrix(banksToQuery);
      setMatrixData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải ma trận đối sánh");
    } finally {
      setLoadingMatrix(false);
    }
  };

  useEffect(() => {
    loadMatrix(selectedBanks);
  }, [selectedBanks]);

  const toggleBank = (bank: string) => {
    if (selectedBanks.includes(bank)) {
      if (selectedBanks.length <= 2) {
        alert("Vui lòng chọn tối thiểu 2 ngân hàng để so sánh.");
        return;
      }
      setSelectedBanks(selectedBanks.filter((b) => b !== bank));
    } else {
      setSelectedBanks([...selectedBanks, bank]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Đang tính toán ma trận đối sánh cạnh tranh...</p>
      </div>
    );
  }

  if (error && !matrixData) {
    return (
      <div className="glass-panel rounded-2xl p-8 border-rose-500/30 text-center max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Lỗi Kết Nối Backend</h3>
        <p className="text-sm text-slate-300 mb-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Đối Sánh Cạnh Tranh
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            So sánh trực quan từ 2 đến 7 ứng dụng ngân hàng số về điểm sao, cảm xúc NLP và khía cạnh trải nghiệm
          </p>
        </div>

        <button
          onClick={() => loadMatrix(selectedBanks)}
          className="p-2 self-start sm:self-auto rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          title="Làm mới ma trận so sánh"
        >
          <RefreshCw className={`w-4 h-4 ${loadingMatrix ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      {/* Bank Selection Pills (2-7 banks) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <span className="text-xs font-mono uppercase text-slate-400 mb-3 block">
          Chọn các ngân hàng để đối sánh (Đang chọn {selectedBanks.length}/7 ngân hàng):
        </span>
        <div className="flex flex-wrap gap-2">
          {ALL_BANKS.map((b) => {
            const isSelected = selectedBanks.includes(b);
            return (
              <button
                key={b}
                onClick={() => toggleBank(b)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                <span>{b}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empirical Benchmark Key Gaps Cards */}
      {matrixData && matrixData.key_gaps.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Chênh Lệch Hiệu Năng Giữa Dẫn Đầu & Cần Cải Thiện</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matrixData.key_gaps.map((gap, idx) => (
              <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    {gap.metric_name === "Star Rating Gap"
                      ? "Chênh Lệch Điểm Sao"
                      : gap.metric_name === "Positive Sentiment Gap"
                      ? "Chênh Lệch Positive Sentiment"
                      : gap.metric_name}
                  </div>
                  <div className="text-sm text-slate-200 font-medium mb-4">
                    {gap.description}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono">
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-[10px] text-slate-400">Dẫn đầu</div>
                    <div className="text-xs font-bold text-emerald-400 truncate">{gap.leader_bank}</div>
                    <div className="text-xs font-semibold text-white">
                      <AnimatedNumber value={gap.leader_value} format="rating" />
                    </div>
                  </div>

                  <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20">
                    <div className="text-[10px] text-slate-400">Cần cải thiện</div>
                    <div className="text-xs font-bold text-rose-400 truncate">{gap.laggard_bank}</div>
                    <div className="text-xs font-semibold text-white">
                      <AnimatedNumber value={gap.laggard_value} format="rating" />
                    </div>
                  </div>

                  <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400">Chênh lệch</div>
                    <div className="text-sm font-bold text-cyan-400">
                      +<AnimatedNumber value={gap.gap_value} format="rating" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix with Chart / Table Toggle */}
      {matrixData && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Bảng Ma Trận So Sánh Trực Tiếp
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Đang đối sánh {matrixData.matrix.length} ứng dụng được lựa chọn
              </span>
            </div>

            {/* Toggle View: Animated Sliding Toggle */}
            <SlidingToggle<"chart" | "table">
              id="benchmark-matrix-toggle"
              value={matrixView}
              onChange={setMatrixView}
              options={[
                { value: "chart", label: "Biểu Đồ Đối Sánh", icon: <BarChart2 className="w-3.5 h-3.5" /> },
                { value: "table", label: "Bảng Chi Tiết", icon: <TableIcon className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {matrixView === "chart" ? (
            <BenchmarkComparisonChart data={matrixData.matrix} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Ứng Dụng Ngân Hàng</th>
                    <th className="py-3 px-4">Tổng Đánh Giá</th>
                    <th className="py-3 px-4">Điểm Sao TB</th>
                    <th className="py-3 px-4 text-emerald-400">Tỷ Lệ Positive</th>
                    <th className="py-3 px-4 text-rose-400">Tỷ Lệ Negative</th>
                    <th className="py-3 px-4">Khía Cạnh Mạnh Nhất</th>
                    <th className="py-3 px-4">Khía Cạnh Yếu Nhất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {matrixData.matrix.map((row) => (
                    <tr key={row.bank_name} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 text-white font-bold">{row.bank_name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{formatNumber(row.total_reviews)}</td>
                      <td className="py-3.5 px-4 text-amber-400 font-bold">{formatRating(row.average_rating)} ★</td>
                      <td className="py-3.5 px-4 text-emerald-400">{formatPercent(row.positive_pct)}</td>
                      <td className="py-3.5 px-4 text-rose-400">{formatPercent(row.negative_pct)}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-emerald-400 font-semibold">{getAspectViName(row.top_strength_aspect)}</div>
                        <div className="text-[10px] text-slate-400">NSS: +{row.top_strength_nss.toFixed(1)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-rose-400 font-semibold">{getAspectViName(row.top_weakness_aspect)}</div>
                        <div className="text-[10px] text-slate-400">NSS: {row.top_weakness_nss.toFixed(1)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Lưu ý: Điểm mạnh và điểm yếu được trích xuất trực tiếp từ mô hình phân tích cảm xúc khía cạnh ABSA thực chứng.
          </div>
        </div>
      )}

      {/* Aspect-by-Aspect Heatmap Matrix Grid */}
      {aspectMatrix && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Bản Đồ Nhiệt Điểm Cảm Xúc Ròng (NSS Heatmap) Theo Khía Cạnh ABSA
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Đậm xanh: Ưu thế vượt trội (+25 đến +50) • Đậm đỏ: Điểm nghẽn rủi ro cao (-25 đến -50)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Khía Cạnh Cốt Lõi (ABSA)</th>
                  <th className="py-3 px-4 text-center">TB 7 Ngân Hàng</th>
                  {ALL_BANKS.map((b) => (
                    <th key={b} className="py-3 px-2 text-center truncate max-w-[100px]" title={b}>
                      {b.replace(" SmartBanking", "").replace(" Mobile", "").replace(" iPay", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {aspectMatrix.aspect_matrix.map((row) => (
                  <tr key={row.aspect_name} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 text-white font-medium">{getAspectViName(row.aspect_name)}</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-400 bg-slate-900/60">
                      {row.market_average_nss > 0 ? "+" : ""}{row.market_average_nss.toFixed(1)}
                    </td>
                    {ALL_BANKS.map((b) => {
                      const scoreObj = row.bank_scores.find((s) => s.bank_name === b);
                      const nss = scoreObj ? scoreObj.net_sentiment_score : null;
                      return (
                        <td key={b} className="py-3 px-2 text-center">
                          {nss !== null ? (
                            <span
                              className={`inline-block min-w-[50px] py-1 px-1.5 rounded text-[11px] font-semibold transition-all ${
                                nss >= 25
                                  ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold"
                                  : nss >= 0
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : nss >= -25
                                  ? "bg-rose-500/10 text-rose-400"
                                  : "bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold"
                              }`}
                            >
                              {nss > 0 ? "+" : ""}{nss.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 100% Normalized Star Rating Distributions with Chart / Table Toggle */}
      {ratingsData && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Phân Bổ Chuẩn Hóa Điểm Đánh Giá Sao (1★ đến 5★)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Phân tích cấu trúc phân cực hài lòng trên toàn bộ 7 ứng dụng
              </span>
            </div>

            {/* Toggle View: Animated Sliding Toggle */}
            <SlidingToggle<"chart" | "table">
              id="benchmark-rating-toggle"
              value={ratingView}
              onChange={setRatingView}
              options={[
                { value: "chart", label: "Biểu Đồ Xếp Chồng 100%", icon: <BarChart2 className="w-3.5 h-3.5" /> },
                { value: "table", label: "Bảng Số Liệu", icon: <TableIcon className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {ratingView === "chart" ? (
            <NormalizedRatingChart data={ratingsData.rating_distributions} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Ngân Hàng Thương Mại</th>
                    <th className="py-3 px-3">Tổng Đánh Giá</th>
                    <th className="py-3 px-3">1 Sao</th>
                    <th className="py-3 px-3">2 Sao</th>
                    <th className="py-3 px-3">3 Sao</th>
                    <th className="py-3 px-3">4 Sao</th>
                    <th className="py-3 px-3">5 Sao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ratingsData.rating_distributions.map((r) => (
                    <tr key={r.bank_name} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-white font-medium">{r.bank_name}</td>
                      <td className="py-3 px-3 text-slate-300">{formatNumber(r.total_rated_reviews)}</td>
                      <td className="py-3 px-3 text-rose-400">{formatPercent(r.star_1_pct, 1)}</td>
                      <td className="py-3 px-3 text-rose-300">{formatPercent(r.star_2_pct, 1)}</td>
                      <td className="py-3 px-3 text-amber-400">{formatPercent(r.star_3_pct, 1)}</td>
                      <td className="py-3 px-3 text-emerald-300">{formatPercent(r.star_4_pct, 1)}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{formatPercent(r.star_5_pct, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

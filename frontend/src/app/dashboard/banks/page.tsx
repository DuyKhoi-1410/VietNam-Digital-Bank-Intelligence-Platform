"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BankListItem,
  BankScorecard,
  BankAspectsResponse,
  BankVersionsResponse,
  BankQuotesResponse,
} from "@/types";
import { formatNumber, formatPercent, formatRating, getSentimentBadgeClass, getAspectViName } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { AspectRadarChart } from "@/components/charts/AspectRadarChart";
import { VersionAdoptionChart } from "@/components/charts/VersionAdoptionChart";
import { SlidingToggle } from "@/components/ui/SlidingToggle";
import {
  Star,
  RefreshCw,
  AlertTriangle,
  Info,
  Quote,
  ShieldCheck,
  BarChart2,
  Table as TableIcon,
} from "lucide-react";

export default function BankInsightsPage() {
  const [banks, setBanks] = useState<BankListItem[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("MB Bank");
  const [scorecard, setScorecard] = useState<BankScorecard | null>(null);
  const [aspects, setAspects] = useState<BankAspectsResponse | null>(null);
  const [versions, setVersions] = useState<BankVersionsResponse | null>(null);
  const [quotes, setQuotes] = useState<BankQuotesResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View toggle states: Chart vs Table
  const [aspectView, setAspectView] = useState<"chart" | "table">("chart");
  const [versionView, setVersionView] = useState<"chart" | "table">("chart");

  // Quote filters
  const [quoteAspect, setQuoteAspect] = useState<string>("");
  const [quoteSentiment, setQuoteSentiment] = useState<string>("NEGATIVE");

  // Load initial bank list
  useEffect(() => {
    let mounted = true;
    api
      .getBanksList()
      .then((res) => {
        if (mounted) {
          const list = Array.isArray(res) ? res : (res as any)?.banks || [];
          setBanks(list);
          if (list.length > 0) {
            setSelectedBank(list[0].bank_name);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Không thể tải danh sách ngân hàng");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Load bank details whenever selectedBank changes
  const loadBankDetails = async (bankName: string) => {
    setLoadingDetails(true);
    try {
      const [sc, asp, ver, q] = await Promise.all([
        api.getBankScorecard(bankName),
        api.getBankAspects(bankName),
        api.getBankVersions(bankName),
        api.getBankQuotes(bankName, quoteAspect || undefined, quoteSentiment || undefined, 4),
      ]);
      setScorecard(sc);
      setAspects(asp);
      setVersions(ver);
      setQuotes(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu ngân hàng");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedBank) {
      loadBankDetails(selectedBank);
    }
  }, [selectedBank]);

  // Reload quotes when quote filters change
  const reloadQuotes = async () => {
    if (!selectedBank) return;
    try {
      const q = await api.getBankQuotes(
        selectedBank,
        quoteAspect || undefined,
        quoteSentiment || undefined,
        4
      );
      setQuotes(q);
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Đang tải danh mục ngân hàng phân tích...</p>
      </div>
    );
  }

  if (error && banks.length === 0) {
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
      {/* Header & Bank Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Thông Tin Ngân Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Bảng điểm chuyên sâu, tách biệt điểm sao với cảm xúc NLP và theo dõi từng phiên bản cập nhật
          </p>
        </div>

        {/* Bank Selection Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="bank-select" className="text-xs text-slate-400 font-mono hidden sm:inline">
            Chọn Ngân Hàng:
          </label>
          <select
            id="bank-select"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-cyan-400 focus:outline-none"
          >
            {banks.map((b) => (
              <option key={b.bank_name} value={b.bank_name}>
                {b.bank_name} ({formatNumber(b.total_reviews)} đánh giá)
              </option>
            ))}
          </select>

          <button
            onClick={() => loadBankDetails(selectedBank)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Làm mới dữ liệu ngân hàng"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDetails ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {loadingDetails || !scorecard ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Đang tải bảng điểm cho {selectedBank}...</p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards for Bank */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Tổng Đánh Giá Được Theo Dõi</span>
              <div className="text-3xl font-bold text-white font-mono mt-2">
                <AnimatedNumber value={scorecard.total_reviews} format="integer" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Dữ liệu theo dõi 5 tháng (07/2026 - 11/2026)</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Điểm Sao Trung Bình</span>
              <div className="text-3xl font-bold text-amber-400 font-mono mt-2 flex items-baseline gap-1">
                <AnimatedNumber value={scorecard.overall_average_rating} format="rating" />
                <span className="text-xs text-slate-400">★ / 5.00</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Điểm sao trung bình trên Google Play</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Tỷ Lệ Positive Sentiment</span>
              <div className="text-3xl font-bold text-emerald-400 font-mono mt-2">
                <AnimatedNumber value={scorecard.sentiment_percentages.positive} format="percent" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                <AnimatedNumber value={scorecard.sentiment_counts.positive} format="integer" /> đánh giá Positive (Tích cực)
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Số Câu Phụ Phân Tích ABSA</span>
              <div className="text-3xl font-bold text-violet-300 font-mono mt-2">
                <AnimatedNumber value={aspects?.bank_total_sub_sentences || 0} format="integer" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Bóc tách từ các đánh giá dài (≥ 4 từ)</div>
            </div>
          </div>

          {/* Decoupled Star Rating vs NLP Sentiment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Star Rating Breakdown */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
                <span>Phân Bổ Điểm Sao Google Play (1-5 Sao)</span>
                <Star className="w-4 h-4 text-amber-400" />
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const key = `star_${star}`;
                  const count = scorecard.star_rating_breakdown[key] || 0;
                  const pct = scorecard.total_reviews > 0 ? (count / scorecard.total_reviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-12 text-slate-300 font-semibold">{star} Sao</span>
                      <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full ${star >= 4 ? "bg-amber-400" : star === 3 ? "bg-amber-600" : "bg-rose-500"}`}
                        />
                      </div>
                      <span className="w-16 text-right text-slate-400">
                        <AnimatedNumber value={count} format="integer" />
                      </span>
                      <span className="w-12 text-right text-slate-400 text-[11px]">
                        <AnimatedNumber value={pct} format="percent" decimals={0} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NLP Sentiment Percentages */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
                <span>Phân Bổ Sentiment (NLP Độc Lập)</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </h2>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-semibold text-emerald-400">Positive (Tích cực)</span>
                    <span className="text-emerald-400 font-semibold">
                      <AnimatedNumber value={scorecard.sentiment_percentages.positive} format="percent" /> (<AnimatedNumber value={scorecard.sentiment_counts.positive} format="integer" />)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${scorecard.sentiment_percentages.positive}%` }}
                      className="bg-emerald-500 h-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-semibold text-amber-400">Neutral (Trung tính)</span>
                    <span className="text-amber-400 font-semibold">
                      <AnimatedNumber value={scorecard.sentiment_percentages.neutral} format="percent" /> (<AnimatedNumber value={scorecard.sentiment_counts.neutral} format="integer" />)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${scorecard.sentiment_percentages.neutral}%` }}
                      className="bg-amber-500 h-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-semibold text-rose-400">Negative (Tiêu cực)</span>
                    <span className="text-rose-400 font-semibold">
                      <AnimatedNumber value={scorecard.sentiment_percentages.negative} format="percent" /> (<AnimatedNumber value={scorecard.sentiment_counts.negative} format="integer" />)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${scorecard.sentiment_percentages.negative}%` }}
                      className="bg-rose-500 h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                Điểm sao và cảm xúc NLP được đánh giá hoàn toàn độc lập. Người dùng có thể chấm 5 sao nhưng vẫn báo lỗi kỹ thuật, hoặc chấm 1 sao nhưng vẫn khen giao diện thân thiện.
              </div>
            </div>
          </div>

          {/* Aspect Breakdown with Radar Chart / Table Toggle */}
          {aspects && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Hiệu Năng & Khía Cạnh Trải Nghiệm (ABSA)
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatNumber(aspects.bank_total_sub_sentences)} câu phụ phân tích
                  </span>
                </div>

                {/* Toggle View: Animated Sliding Toggle */}
                <SlidingToggle<"chart" | "table">
                  id="bank-aspect-toggle"
                  value={aspectView}
                  onChange={setAspectView}
                  options={[
                    { value: "chart", label: "Biểu Đồ Radar & NSS", icon: <BarChart2 className="w-3.5 h-3.5" /> },
                    { value: "table", label: "Bảng Chi Tiết", icon: <TableIcon className="w-3.5 h-3.5" /> },
                  ]}
                />
              </div>

              {aspectView === "chart" ? (
                <AspectRadarChart bankName={selectedBank} aspects={aspects.aspects} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Nhóm Khía Cạnh</th>
                        <th className="py-3 px-4">Số Câu Phụ</th>
                        <th className="py-3 px-4">Tỷ Trọng</th>
                        <th className="py-3 px-4 text-emerald-400">Positive</th>
                        <th className="py-3 px-4 text-rose-400">Negative</th>
                        <th className="py-3 px-4">Chỉ Số NSS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {aspects.aspects.map((asp) => (
                        <tr key={asp.aspect_name} className="hover:bg-slate-900/40">
                          <td className="py-3 px-4 text-white font-medium">{getAspectViName(asp.aspect_name)}</td>
                          <td className="py-3 px-4 text-slate-300">{formatNumber(asp.sub_sentence_count)}</td>
                          <td className="py-3 px-4 text-slate-400">{formatPercent(asp.aspect_share_pct)}</td>
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
          )}

          {/* Release Version Adoption (With Bank-Specific Denominator) */}
          {versions && versions.versions.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Tỷ Lệ Chấp Nhận & Điểm Đánh Giá Theo Phiên Bản Ứng Dụng
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Mẫu số riêng của {selectedBank}: {formatNumber(versions.total_versioned_reviews)} đánh giá có phiên bản (Toàn thị trường: {formatNumber(versions.market_versioned_denominator)})
                  </p>
                </div>

                {/* Toggle View: Animated Sliding Toggle */}
                <SlidingToggle<"chart" | "table">
                  id="bank-version-view-toggle"
                  value={versionView}
                  onChange={setVersionView}
                  options={[
                    { value: "chart", label: "Biểu Đồ Phiên Bản", icon: <BarChart2 className="w-3.5 h-3.5" /> },
                    { value: "table", label: "Bảng Chi Tiết", icon: <TableIcon className="w-3.5 h-3.5" /> },
                  ]}
                />
              </div>

              {versionView === "chart" ? (
                <VersionAdoptionChart
                  bankName={selectedBank}
                  versions={versions.versions}
                  totalVersioned={versions.total_versioned_reviews}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Phiên Bản Ứng Dụng</th>
                        <th className="py-3 px-4">Số Lượt Đánh Giá</th>
                        <th className="py-3 px-4">Tỷ Trọng Trong Ngân Hàng</th>
                        <th className="py-3 px-4">Điểm Sao Trung Bình</th>
                        <th className="py-3 px-4">Chi Tiết (1★ / 5★)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {versions.versions.map((ver) => (
                        <tr key={ver.app_version} className="hover:bg-slate-900/40">
                          <td className="py-3 px-4 text-cyan-400 font-medium">{ver.app_version}</td>
                          <td className="py-3 px-4 text-slate-300">{formatNumber(ver.review_count)}</td>
                          <td className="py-3 px-4 text-slate-400 font-semibold">{formatPercent(ver.version_share_pct)}</td>
                          <td className="py-3 px-4 text-amber-400 font-semibold">{formatRating(ver.average_rating)} ★</td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            1★: {ver.star_breakdown?.star_1 || 0} • 5★: {ver.star_breakdown?.star_5 || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Lưu ý thực nghiệm: Phân tích phiên bản phản ánh các đánh giá được ghi nhận dưới từng bản phát hành. Việc so sánh trước/sau không thể thiết lập quan hệ nhân quả tuyệt đối do các biến động ngoại sinh (ví dụ: yêu cầu sinh trắc học theo Quyết định 2345), lộ trình cập nhật cuốn chiếu và thiên lệch tự chọn của người dùng.
                </span>
              </div>
            </div>
          )}

          {/* Verbatim Quotes Section */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Quote className="w-4 h-4 text-cyan-400" />
                  <span>Trích Dẫn Phản Hồi Khách Hàng Nguyên Văn</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Các câu trích đoạn bóc tách từ đánh giá chi tiết kèm nhãn cảm xúc đã xác thực
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={quoteSentiment}
                  onChange={(e) => {
                    setQuoteSentiment(e.target.value);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="NEGATIVE">Negative (Tiêu cực)</option>
                  <option value="POSITIVE">Positive (Tích cực)</option>
                  <option value="NEUTRAL">Neutral (Trung tính)</option>
                </select>

                <button
                  onClick={reloadQuotes}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Lọc Trích Dẫn
                </button>
              </div>
            </div>

            {quotes && quotes.quotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes.quotes.map((q) => (
                  <div
                    key={q.sub_id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-cyan-400">{getAspectViName(q.aspect)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSentimentBadgeClass(q.sentiment)}`}>
                          {q.sentiment === "POSITIVE" ? "TÍCH CỰC" : q.sentiment === "NEGATIVE" ? "TIÊU CỰC" : "TRUNG TÍNH"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed mb-3">
                        &ldquo;{q.sub_sentence}&rdquo;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Người dùng: {q.user || "Ẩn danh"}</span>
                      <span className="text-amber-400">{q.rating} ★</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 font-mono">
                Không tìm thấy trích dẫn phù hợp với bộ lọc cảm xúc đã chọn.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

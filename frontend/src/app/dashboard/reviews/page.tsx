"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { resolveBankSearch, CANONICAL_BANKS } from "@/lib/bankMatcher";
import {
  PaginatedReviewsResponse,
  FilterOptionsResponse,
  ReviewDetailResponse,
} from "@/types";
import { formatNumber, getSentimentBadgeClass, getAspectViName } from "@/lib/utils";
import {
  Search,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  ExternalLink,
} from "lucide-react";

function ReviewExplorerContent() {
  const searchParams = useSearchParams();

  // Parse initial filter params from URL
  const rawBankParam = searchParams.get("bank");
  const rawKeywordParam = searchParams.get("keyword") || searchParams.get("q");
  const rawAspectParam = searchParams.get("aspect");
  const rawRatingParam = searchParams.get("rating");
  const rawSentimentParam = searchParams.get("sentiment");

  // Robust bank alias resolution from URL query params
  let initialBank = "";
  if (rawBankParam) {
    const resolved = resolveBankSearch(rawBankParam);
    initialBank = resolved.canonicalName || rawBankParam;
  }

  let initialKeyword = "";
  if (rawKeywordParam) {
    if (!initialBank) {
      const resolved = resolveBankSearch(rawKeywordParam);
      if (resolved.canonicalName) {
        initialBank = resolved.canonicalName;
        initialKeyword = resolved.cleanKeyword;
      } else {
        initialKeyword = rawKeywordParam;
      }
    } else {
      initialKeyword = rawKeywordParam;
    }
  }

  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse | null>(null);
  const [results, setResults] = useState<PaginatedReviewsResponse | null>(null);

  // Filter States
  const [selectedBank, setSelectedBank] = useState<string>(initialBank);
  const [selectedRating, setSelectedRating] = useState<string>(rawRatingParam || "");
  const [selectedSentiment, setSelectedSentiment] = useState<string>(rawSentimentParam || "");
  const [selectedAspect, setSelectedAspect] = useState<string>(rawAspectParam || "");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  // Detail Modal State
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state when searchParams changes dynamically
  useEffect(() => {
    const b = searchParams.get("bank");
    const k = searchParams.get("keyword") || searchParams.get("q");
    const a = searchParams.get("aspect");
    const r = searchParams.get("rating");
    const s = searchParams.get("sentiment");

    let resolvedBank = "";
    if (b !== null) {
      const res = resolveBankSearch(b);
      resolvedBank = res.canonicalName || b;
      setSelectedBank(resolvedBank);
    }
    if (k !== null) {
      if (!b) {
        const res = resolveBankSearch(k);
        if (res.canonicalName) {
          setSelectedBank(res.canonicalName);
          setKeyword(res.cleanKeyword);
        } else {
          setKeyword(k);
        }
      } else {
        setKeyword(k);
      }
    }
    if (a !== null) setSelectedAspect(a);
    if (r !== null) setSelectedRating(r);
    if (s !== null) setSelectedSentiment(s);
  }, [searchParams]);

  // Load filter options once
  useEffect(() => {
    let mounted = true;
    api
      .getFilterOptions()
      .then((opts) => {
        if (mounted) setFilterOptions(opts);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Execute review search with optional parameter overrides
  const executeSearch = async (
    targetPage: number = 1,
    overrides?: {
      bank?: string;
      rating?: string;
      sentiment?: string;
      aspect?: string;
      app_version?: string;
      keyword?: string;
    }
  ) => {
    setLoadingSearch(true);
    setError(null);
    try {
      const bankToUse = overrides && "bank" in overrides ? overrides.bank : selectedBank;
      const ratingToUse = overrides && "rating" in overrides ? overrides.rating : selectedRating;
      const sentimentToUse = overrides && "sentiment" in overrides ? overrides.sentiment : selectedSentiment;
      const aspectToUse = overrides && "aspect" in overrides ? overrides.aspect : selectedAspect;
      const versionToUse = overrides && "app_version" in overrides ? overrides.app_version : selectedVersion;
      const keywordToUse = overrides && "keyword" in overrides ? overrides.keyword : keyword;

      const data = await api.searchReviews({
        bank: bankToUse || undefined,
        rating: ratingToUse ? parseInt(ratingToUse) : undefined,
        sentiment: sentimentToUse || undefined,
        aspect: aspectToUse || undefined,
        app_version: versionToUse || undefined,
        keyword: keywordToUse ? keywordToUse.trim() : undefined,
        page: targetPage,
        page_size: pageSize,
      });
      setResults(data);
      setPage(targetPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tìm kiếm đánh giá");
    } finally {
      setLoading(false);
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    executeSearch(1);
  }, [selectedBank, selectedRating, selectedSentiment, selectedAspect, selectedVersion]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(1);
  };

  const handleResetFilters = () => {
    setSelectedBank("");
    setSelectedRating("");
    setSelectedSentiment("");
    setSelectedAspect("");
    setSelectedVersion("");
    setKeyword("");
    executeSearch(1, {
      bank: "",
      rating: "",
      sentiment: "",
      aspect: "",
      app_version: "",
      keyword: "",
    });
  };

  const openReviewDetail = async (id: string) => {
    setSelectedReviewId(id);
    setLoadingDetail(true);
    try {
      const detail = await api.getReviewDetail(id);
      setReviewDetail(detail);
    } catch {
      setReviewDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Tra Cứu Đánh Giá
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tìm kiếm, lọc và phân tích 19.303 đánh giá Google Play xác thực đã khử trùng lặp
          </p>
        </div>

        {results && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold">{formatNumber(results.total_items)}</span>
            <span>kết quả /</span>
            <span className="text-white font-semibold">{formatNumber(results.unique_baseline)}</span>
            <span>đánh giá chuẩn</span>
          </div>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        {/* Keyword Search Row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung nhận xét theo từ khóa (vd: OTP, sinh trắc học, lỗi đăng nhập, chuyển tiền, giao diện)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tìm Kiếm</span>
          </button>
        </form>

        {/* Multi-Criteria Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Bank */}
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Ngân Hàng
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Tất cả 7 ngân hàng</option>
              {(filterOptions?.banks || CANONICAL_BANKS).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating */}
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Số Sao Đánh Giá
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Tất cả số sao (1-5)</option>
              <option value="5">5 Sao</option>
              <option value="4">4 Sao</option>
              <option value="3">3 Sao</option>
              <option value="2">2 Sao</option>
              <option value="1">1 Sao</option>
            </select>
          </div>

          {/* Sentiment */}
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Sentiment (Cảm Xúc)
            </label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Tất cả Sentiment</option>
              <option value="POSITIVE">Positive (Tích cực)</option>
              <option value="NEUTRAL">Neutral (Trung tính)</option>
              <option value="NEGATIVE">Negative (Tiêu cực)</option>
            </select>
          </div>

          {/* Genuine Aspect */}
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Khía Cạnh (ABSA)
            </label>
            <select
              value={selectedAspect}
              onChange={(e) => setSelectedAspect(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Tất cả khía cạnh</option>
              {filterOptions?.genuine_aspects.map((a) => (
                <option key={a} value={a}>
                  {getAspectViName(a)}
                </option>
              ))}
            </select>
          </div>

          {/* App Version */}
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Phiên Bản Ứng Dụng
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Tất cả phiên bản</option>
              <option value="Not specified">Chưa xác định (17,02%)</option>
              {filterOptions?.app_versions
                .filter((v) => v !== "Not specified")
                .slice(0, 15)
                .map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="text-slate-400 font-mono text-[11px] flex flex-wrap items-center gap-2">
            {selectedBank && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-semibold text-xs">
                <span>🏛️ {selectedBank}</span>
                <button
                  type="button"
                  onClick={() => setSelectedBank("")}
                  className="hover:text-white transition-colors"
                  title="Xóa bộ lọc ngân hàng"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedAspect && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs">
                <span>Khía cạnh: &ldquo;{getAspectViName(selectedAspect)}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSelectedAspect("")}
                  className="hover:text-white transition-colors"
                  title="Xóa bộ lọc khía cạnh"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {keyword && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs">
                <span>Từ khóa: &ldquo;{keyword}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("");
                    executeSearch(1, { keyword: "" });
                  }}
                  className="hover:text-white transition-colors"
                  title="Xóa từ khóa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {!selectedBank && !selectedAspect && !keyword && (
              <span className="text-slate-500 italic">Hiển thị toàn bộ đánh giá 7 ngân hàng</span>
            )}
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-slate-400 hover:text-white font-mono text-xs hover:underline transition-colors ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đặt Lại Bộ Lọc</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      {loadingSearch ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Đang trích xuất dữ liệu đánh giá thực chứng...</p>
        </div>
      ) : results && results.reviews.length > 0 ? (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Mã Đánh Giá</th>
                  <th className="py-3 px-4">Ngân Hàng</th>
                  <th className="py-3 px-2">Số Sao</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-6">Nội Dung Nhận Xét Của Khách Hàng</th>
                  <th className="py-3 px-3">Phiên Bản</th>
                  <th className="py-3 px-3">Ngày Đăng</th>
                  <th className="py-3 px-3 text-center">Bóc Tách</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {results.reviews.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => openReviewDetail(r.id)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-cyan-400 whitespace-nowrap">{r.id}</td>
                    <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">{r.bank}</td>
                    <td className="py-3.5 px-2 text-amber-400 font-bold whitespace-nowrap">{r.rating} ★</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSentimentBadgeClass(r.sentiment_label)}`}>
                        {r.sentiment_label === "POSITIVE" ? "POSITIVE" : r.sentiment_label === "NEGATIVE" ? "NEGATIVE" : "NEUTRAL"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-sans text-slate-200 max-w-md line-clamp-2">
                      {r.comment}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {r.app_version === "Not specified" ? "Chưa xác định" : r.app_version}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {r.time ? r.time.slice(0, 10) : "-"}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReviewDetail(r.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Xem bóc tách câu phụ"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Trang <strong className="text-white">{results.page}</strong> /{" "}
              <strong className="text-white">{results.total_pages}</strong> (Tổng cộng {formatNumber(results.total_items)} đánh giá)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => executeSearch(page - 1)}
                disabled={page <= 1 || loadingSearch}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeSearch(page + 1)}
                disabled={page >= results.total_pages || loadingSearch}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:border-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Không tìm thấy đánh giá phù hợp</h3>
          <p className="text-xs text-slate-400 mb-4">
            Hãy thử nới lỏng từ khóa tìm kiếm hoặc bỏ bớt các điều kiện lọc khía cạnh/số sao.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Xóa Tất Cả Bộ Lọc
          </button>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReviewId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {selectedReviewId}
                </span>
                {reviewDetail && (
                  <span className="text-xs text-white font-medium">
                    {reviewDetail.review.bank}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedReviewId(null);
                  setReviewDetail(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Đang tải câu phụ và nhãn khía cạnh ABSA...</p>
              </div>
            ) : reviewDetail ? (
              <>
                {/* Full Original Comment */}
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Nội dung nhận xét gốc trên Google Play:
                  </label>
                  <p className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
                    {reviewDetail.review.comment}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Số Sao</span>
                    <span className="text-amber-400 font-bold">{reviewDetail.review.rating} ★</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Sentiment</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getSentimentBadgeClass(reviewDetail.review.sentiment_label)}`}>
                      {reviewDetail.review.sentiment_label === "POSITIVE" ? "POSITIVE" : reviewDetail.review.sentiment_label === "NEGATIVE" ? "NEGATIVE" : "NEUTRAL"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Phiên Bản</span>
                    <span className="text-slate-200">
                      {reviewDetail.review.app_version === "Not specified" ? "Chưa xác định" : reviewDetail.review.app_version}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Độ Dài Từ</span>
                    <span className="text-slate-200">{reviewDetail.review.word_count} từ</span>
                  </div>
                </div>

                {/* ABSA Decomposed Sub-Sentences */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block">
                      Các Câu Phụ Bóc Tách Theo Khía Cạnh ({reviewDetail.sub_sentences.length})
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {reviewDetail.review.is_long_review ? "Đánh giá dài (≥ 4 từ)" : "Đánh giá ngắn"}
                    </span>
                  </div>

                  {reviewDetail.sub_sentences.length > 0 ? (
                    <div className="space-y-2">
                      {reviewDetail.sub_sentences.map((sub) => (
                        <div
                          key={sub.sub_id}
                          className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="flex-1">
                            <span className="font-mono text-[10px] text-slate-400 block mb-0.5">
                              {sub.sub_id}
                            </span>
                            <p className="text-slate-200 font-sans italic">
                              &ldquo;{sub.sub_sentence}&rdquo;
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="font-mono text-[11px] font-semibold text-cyan-400">
                              {getAspectViName(sub.aspect)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getSentimentBadgeClass(sub.sentiment)}`}>
                              {sub.sentiment === "POSITIVE" ? "POSITIVE" : sub.sentiment === "NEGATIVE" ? "NEGATIVE" : "NEUTRAL"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 text-center font-mono">
                      {reviewDetail.absa_notice}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-mono text-xs gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Đang đồng bộ bộ lọc và tải dữ liệu đánh giá...</span>
        </div>
      }
    >
      <ReviewExplorerContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { getAspectViName } from "@/lib/utils";
import {
  Download,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Filter,
} from "lucide-react";

const SUMMARY_DATASETS = [
  {
    type: "overview",
    title: "Bảng Tổng Quan Thị Trường",
    description: "Khối lượng đánh giá tổng hợp theo tháng, điểm sao trung bình và số lượng cảm xúc từng ngân hàng.",
    rows: "35 dòng",
    grain: "(Ngân Hàng, Tháng Đánh Giá)",
  },
  {
    type: "aspect_analysis",
    title: "Bảng Phân Tích Khía Cạnh",
    description: "Tần suất cảm xúc khía cạnh chi tiết được bóc tách theo 7 nhóm trải nghiệm ngân hàng cốt lõi.",
    rows: "589 dòng",
    grain: "(Ngân Hàng, Tháng, Khía Cạnh, Cảm Xúc)",
  },
  {
    type: "rating_analysis",
    title: "Bảng Điểm Đánh Giá & Phiên Bản",
    description: "Phân bổ các phiên bản cập nhật ứng dụng và xếp hạng 1-5 sao (16.017 đánh giá có phiên bản).",
    rows: "46 dòng",
    grain: "(Ngân Hàng, Phiên Bản)",
  },
  {
    type: "sentiment_analysis",
    title: "Bảng Cảm Xúc Theo Nguồn Xử Lý",
    description: "Khối lượng cảm xúc đa nhóm phân tách theo quy trình phân đoạn đánh giá ngắn và đánh giá dài.",
    rows: "204 dòng",
    grain: "(Ngân Hàng, Tháng, Nguồn Đánh Giá, Cảm Xúc)",
  },
];

const ALL_BANKS = [
  "BIDV SmartBanking",
  "Liobank",
  "MB Bank",
  "TNEX",
  "TPBank Mobile",
  "VCB Digibank",
  "VietinBank iPay",
];

const ALL_ASPECTS = [
  "Customer Support",
  "Fee & Policy",
  "Login & Authentication",
  "Performance",
  "Promotion & Benefits",
  "Transaction & Transfer",
  "UI/UX",
];

export default function ReportsPage() {
  // Custom Filtered Export State
  const [exportBank, setExportBank] = useState<string>("");
  const [exportRating, setExportRating] = useState<string>("");
  const [exportSentiment, setExportSentiment] = useState<string>("");
  const [exportAspect, setExportAspect] = useState<string>("");
  const [exportLimit, setExportLimit] = useState<number>(500);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const handleDownloadSummary = (tableType: string, format: "csv" | "json") => {
    const url = api.getSummaryExportUrl(tableType, format);
    window.open(url, "_blank");
  };

  const handleDownloadFilteredReviews = (e: React.FormEvent) => {
    e.preventDefault();
    const url = api.getReviewsExportUrl({
      bank: exportBank || undefined,
      rating: exportRating ? parseInt(exportRating) : undefined,
      sentiment: exportSentiment || undefined,
      aspect: exportAspect || undefined,
      limit: exportLimit,
      format: exportFormat,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Báo Cáo & Xuất Dữ Liệu
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Tải trực tiếp các tập dữ liệu tổng hợp và đánh giá đã lọc dạng CSV hoặc JSON phục vụ nghiên cứu, kinh doanh và kiểm toán
        </p>
      </div>

      {/* Section 1: Official Summary Tables Downloads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Bảng Dữ Liệu Tổng Hợp (Dữ Liệu BigQuery Trực Tiếp)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUMMARY_DATASETS.map((ds) => (
            <div
              key={ds.type}
              className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{ds.type}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ds.rows}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{ds.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{ds.description}</p>
                <div className="text-[11px] font-mono text-slate-500 mb-4">Cấu trúc hạt: {ds.grain}</div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSummary(ds.type, "csv")}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tải CSV</span>
                </button>
                <button
                  onClick={() => handleDownloadSummary(ds.type, "json")}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tải JSON</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Custom Filtered Review Exporter */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Filter className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Công Cụ Xuất Đánh Giá Tùy Biến
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Xuất tập hợp con các đánh giá người dùng thực tế với các bộ lọc đã chọn, áp dụng khử trùng lặp và bảo toàn các câu phụ ABSA.
          </p>
        </div>

        <form onSubmit={handleDownloadFilteredReviews} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Lọc Theo Ngân Hàng
              </label>
              <select
                value={exportBank}
                onChange={(e) => setExportBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Tất cả 7 ngân hàng thương mại</option>
                {ALL_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Lọc Theo Số Sao
              </label>
              <select
                value={exportRating}
                onChange={(e) => setExportRating(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Tất cả số sao (1-5)</option>
                <option value="5">5 Sao</option>
                <option value="4">4 Sao</option>
                <option value="3">3 Sao</option>
                <option value="2">2 Sao</option>
                <option value="1">1 Sao</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Lọc Theo Sentiment
              </label>
              <select
                value={exportSentiment}
                onChange={(e) => setExportSentiment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Tất cả Sentiment</option>
                <option value="POSITIVE">Positive (Tích cực)</option>
                <option value="NEUTRAL">Neutral (Trung tính)</option>
                <option value="NEGATIVE">Negative (Tiêu cực)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Lọc Theo Khía Cạnh (ABSA)
              </label>
              <select
                value={exportAspect}
                onChange={(e) => setExportAspect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Tất cả khía cạnh</option>
                {ALL_ASPECTS.map((a) => (
                  <option key={a} value={a}>
                    {getAspectViName(a)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Giới hạn số dòng:</span>
                <select
                  value={exportLimit}
                  onChange={(e) => setExportLimit(parseInt(e.target.value))}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value={100}>100 đánh giá</option>
                  <option value={250}>250 đánh giá</option>
                  <option value={500}>500 đánh giá</option>
                  <option value={1000}>1.000 đánh giá (Giới Hạn An Toàn)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Định dạng:</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={() => setExportFormat("csv")}
                    />
                    <span>CSV</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="format"
                      value="json"
                      checked={exportFormat === "json"}
                      onChange={() => setExportFormat("json")}
                    />
                    <span>JSON</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Tệp Đánh Giá Đã Lọc</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Data Governance & Integrity Disclosure */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold font-mono text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cam Kết Quản Trị Dữ Liệu & Bảo Vệ Hệ Thống BigQuery</span>
        </div>
        <p className="leading-relaxed">
          • Mọi tệp xuất dữ liệu được khởi tạo thời gian thực thông qua các câu lệnh SQL chỉ đọc (Read-Only) có tham số hóa với thời gian chờ (timeout) tự động ngắt an toàn.
          <br />
          • Quy trình xuất tự động áp dụng hàm phân vùng khử trùng lặp (`ROW_NUMBER() OVER(PARTITION BY ID) = 1`), tuyệt đối ngăn ngừa hiện tượng nhân đôi số liệu làm sai lệch bảng phân tích của bạn.
          <br />
          • Phản hồi xuất dữ liệu đính kèm header HTTP `X-Row-Count` và `X-Dataset-Source` phục vụ việc truy xuất nguồn gốc và kiểm toán dữ liệu.
        </p>
      </div>
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number | undefined | null): string {
  if (val === undefined || val === null) return "0";
  return new Intl.NumberFormat("en-US").format(val);
}

export function formatPercent(val: number | undefined | null, decimals: number = 1): string {
  if (val === undefined || val === null) return "0.0%";
  return `${val.toFixed(decimals)}%`;
}

export function formatRating(val: number | undefined | null): string {
  if (val === undefined || val === null) return "0.00";
  return val.toFixed(2);
}

export function getSentimentBadgeClass(sentiment: string): string {
  const s = sentiment?.toUpperCase();
  if (s === "POSITIVE") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
  if (s === "NEGATIVE") {
    return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  }
  return "bg-amber-500/10 text-amber-400 border-amber-500/30";
}

export const ASPECT_VIETNAMESE_MAP: Record<string, string> = {
  "Login & Authentication": "Đăng nhập & Xác thực",
  "Transaction & Transfer": "Chuyển tiền & Giao dịch",
  "UI/UX": "Giao diện người dùng (UI/UX)",
  "Performance": "Hiệu năng & Tốc độ",
  "Fee & Policy": "Biểu phí & Chính sách",
  "Customer Support": "Chăm sóc & Hỗ trợ khách hàng",
  "Promotion & Benefits": "Ưu đãi & Khuyến mãi",
};

export function getAspectViName(name: string | undefined | null): string {
  if (!name) return "";
  return ASPECT_VIETNAMESE_MAP[name] || name;
}

export function getSentimentViName(sentiment: string | undefined | null): string {
  if (!sentiment) return "";
  const s = sentiment.toUpperCase();
  if (s === "POSITIVE") return "Positive";
  if (s === "NEGATIVE") return "Negative";
  if (s === "NEUTRAL") return "Neutral";
  return sentiment;
}

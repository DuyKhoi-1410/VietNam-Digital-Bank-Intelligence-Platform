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

export const COMPLAINT_DRIVER_VIETNAMESE_MAP: Record<string, string> = {
  "Bảo mật & Đăng nhập": "Lỗi quét khuôn mặt sinh trắc học, chậm mã OTP và vướng mắc xác thực theo Quyết định 2345.",
  "Hệ thống & Hiệu năng": "Ứng dụng bị văng (crash), tải chậm và lỗi mất kết nối máy chủ trong giờ cao điểm.",
  "Giao dịch & Chuyển tiền": "Tắc nghẽn xử lý giao dịch, chậm nhận tiền chuyển khoản và lỗi quét mã QR.",
  "CSKH & Phí dịch vụ": "Thời gian chờ tổng đài lâu, thắc mắc biểu phí duy trì và phản hồi hỗ trợ chậm.",
  "Giao diện & UI/UX": "Khó tìm tính năng sau khi cập nhật phiên bản mới, bố cục giao diện chưa tối ưu.",
  "Trải nghiệm chung": "Khách hàng không hài lòng về độ ổn định tổng thể và trải nghiệm chưa liền mạch.",
  "Tính năng khác": "Lỗi chậm thông báo biến động số dư và các yêu cầu bổ sung tiện ích phụ trợ.",
};

export function getComplaintDriverVi(aspectName: string | undefined | null, originalText?: string | null): string {
  if (aspectName && COMPLAINT_DRIVER_VIETNAMESE_MAP[aspectName]) {
    return COMPLAINT_DRIVER_VIETNAMESE_MAP[aspectName];
  }
  if (!originalText) return "Ghi nhận phát sinh lỗi và ý kiến tiêu cực trong quá trình sử dụng.";
  if (originalText.includes("Biometric") || originalText.includes("Decision 2345")) {
    return "Lỗi quét khuôn mặt sinh trắc học, chậm mã OTP và vướng mắc xác thực theo Quyết định 2345.";
  }
  if (originalText.includes("App crashes") || originalText.includes("server connection")) {
    return "Ứng dụng bị văng (crash), tải chậm và lỗi mất kết nối máy chủ trong giờ cao điểm.";
  }
  if (originalText.includes("Transaction delays") || originalText.includes("QR code")) {
    return "Tắc nghẽn xử lý giao dịch, chậm nhận tiền chuyển khoản và lỗi quét mã QR.";
  }
  if (originalText.includes("Hotline wait times") || originalText.includes("maintenance fees")) {
    return "Thời gian chờ tổng đài lâu, thắc mắc biểu phí duy trì và phản hồi hỗ trợ chậm.";
  }
  if (originalText.includes("Post-update navigation") || originalText.includes("interface")) {
    return "Khó tìm tính năng sau khi cập nhật phiên bản mới, bố cục giao diện chưa tối ưu.";
  }
  if (originalText.includes("General dissatisfaction") || originalText.includes("instability")) {
    return "Khách hàng không hài lòng về độ ổn định tổng thể và trải nghiệm chưa liền mạch.";
  }
  if (originalText.includes("secondary feature") || originalText.includes("notification")) {
    return "Lỗi chậm thông báo biến động số dư và các yêu cầu bổ sung tiện ích phụ trợ.";
  }
  return originalText;
}

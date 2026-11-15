"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { HealthIndicator } from "./HealthIndicator";

interface TopHeaderProps {
  onToggleMobile: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Tổng Quan Thị Trường",
    subtitle: "Quỹ đạo cảm xúc vĩ mô, điểm đánh giá trung bình và ma sát trải nghiệm",
  },
  "/dashboard/banks": {
    title: "Thông Tin Ngân Hàng",
    subtitle: "Bảng điểm chi tiết từng ngân hàng, khía cạnh ABSA và phiên bản phát hành",
  },
  "/dashboard/benchmark": {
    title: "Đối Sánh Cạnh Tranh",
    subtitle: "Ma trận so sánh đa ngân hàng, khoảng cách hiệu năng và tỷ lệ sao",
  },
  "/dashboard/reviews": {
    title: "Tra Cứu Đánh Giá",
    subtitle: "19.303 đánh giá Google Play xác thực kèm bóc tách câu phụ ABSA",
  },
  "/dashboard/reports": {
    title: "Báo Cáo & Xuất File",
    subtitle: "Tải xuống tập dữ liệu phân tích và đánh giá đã lọc dạng CSV hoặc JSON",
  },
};

export function TopHeader({ onToggleMobile }: TopHeaderProps) {
  const pathname = usePathname();
  const current = ROUTE_TITLES[pathname] || {
    title: "Dashboard",
    subtitle: "Nền Tảng Trí Tuệ Dữ Liệu Ngân Hàng Số",
  };

  return (
    <header className="h-16 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle, Mobile Brand Mark & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          aria-label="Mở thanh điều hướng"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Mobile Brand Mark */}
        <Link href="/" className="lg:hidden flex items-center pr-2 border-r border-slate-800" title="Về trang chủ">
          <Image
            src="/logo-mark.png"
            alt="Vietnam Digital Banking Intelligence"
            width={34}
            height={15}
            className="h-5 w-auto object-contain"
          />
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Hệ Thống</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-medium">{current.title}</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {current.subtitle}
          </span>
        </div>
      </div>

      {/* Right: Live Health Indicator */}
      <div className="flex items-center gap-3">
        <HealthIndicator />
      </div>
    </header>
  );
}

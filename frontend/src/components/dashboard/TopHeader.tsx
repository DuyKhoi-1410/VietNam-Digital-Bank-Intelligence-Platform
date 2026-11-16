"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, ArrowLeft, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { HealthIndicator } from "./HealthIndicator";

interface TopHeaderProps {
  sidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  onToggleMobile?: () => void;
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

export function TopHeader({
  sidebarVisible = true,
  onToggleSidebar,
  onToggleMobile,
}: TopHeaderProps) {
  const pathname = usePathname();
  const current = ROUTE_TITLES[pathname] || {
    title: "Dashboard",
    subtitle: "Nền Tảng Trí Tuệ Dữ Liệu Ngân Hàng Số",
  };

  const handleToggle = () => {
    if (onToggleSidebar) onToggleSidebar();
    else if (onToggleMobile) onToggleMobile();
  };

  return (
    <header className="h-16 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Sidebar Toggle, Brand Mark & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all duration-200 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95"
          title={sidebarVisible ? "Ẩn thanh điều hướng (Sidebar)" : "Hiện thanh điều hướng (Sidebar)"}
          aria-label={sidebarVisible ? "Ẩn thanh điều hướng" : "Hiện thanh điều hướng"}
        >
          {sidebarVisible ? (
            <PanelLeftClose className="w-5 h-5 text-cyan-400" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-cyan-400" />
          )}
        </button>

        {/* Brand Mark (always visible on mobile, or on desktop when sidebar is hidden) */}
        <Link
          href="/"
          className={`items-center pr-2 border-r border-slate-800 transition-opacity hover:opacity-80 ${
            sidebarVisible ? "flex lg:hidden" : "flex"
          }`}
          title="Về trang chủ"
        >
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

      {/* Right: Return to Landing Page Button & Live Health Indicator */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all duration-200 group active:scale-95"
          title="Về trang giới thiệu (Landing Page)"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Trang Giới Thiệu</span>
        </Link>

        <HealthIndicator />
      </div>
    </header>
  );
}

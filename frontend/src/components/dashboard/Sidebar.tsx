"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Building2,
  GitFork,
  Search,
  Download,
  Database,
  Globe,
  PanelLeftClose,
} from "lucide-react";

interface SidebarProps {
  sidebarVisible?: boolean;
  setSidebarVisible?: (visible: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  {
    name: "Tổng quan thị trường",
    href: "/dashboard",
    icon: TrendingUp,
    badge: "M1",
  },
  {
    name: "Thông tin ngân hàng",
    href: "/dashboard/banks",
    icon: Building2,
    badge: "M2",
  },
  {
    name: "Đối sánh cạnh tranh",
    href: "/dashboard/benchmark",
    icon: GitFork,
    badge: "M3",
  },
  {
    name: "Tra cứu đánh giá",
    href: "/dashboard/reviews",
    icon: Search,
    badge: "M4",
  },
  {
    name: "Báo cáo & Xuất file",
    href: "/dashboard/reports",
    icon: Download,
    badge: "M5",
  },
];

export function Sidebar({
  sidebarVisible = true,
  setSidebarVisible,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 180); // Smooth debounce
  };

  // Expanded on desktop if hovered, or on mobile if opened
  const isExpanded = (isHovered && sidebarVisible) || mobileOpen;

  return (
    <>
      {/* Mobile Backdrop Only (Only active on small screens when mobile drawer is open) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Docked / Expandable Sidebar */}
      <aside
        onMouseEnter={sidebarVisible ? handleMouseEnter : undefined}
        onMouseLeave={sidebarVisible ? handleMouseLeave : undefined}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#070b14] border-r border-slate-800 transition-[width,transform,box-shadow,opacity] duration-300 ease-out select-none ${
          mobileOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : sidebarVisible
            ? "-translate-x-full lg:translate-x-0 opacity-100"
            : "-translate-x-full lg:-translate-x-full lg:w-0 lg:opacity-0 lg:pointer-events-none"
        } ${
          sidebarVisible
            ? isHovered
              ? "lg:w-64 lg:shadow-[0_0_30px_rgba(0,0,0,0.9)] lg:border-slate-700/90"
              : "lg:w-16"
            : ""
        }`}
      >
        {/* Brand Header: Shows Logo Mark on slim rail, Full Logo on hover expansion */}
        <div className="h-16 flex items-center px-3 border-b border-slate-800/80 overflow-hidden flex-shrink-0 justify-between">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center group overflow-hidden min-w-0"
          >
            {isExpanded ? (
              <div className="flex items-center min-w-0 transition-opacity duration-200">
                <Image
                  src="/logo-full.png"
                  alt="Vietnam Digital Banking Intelligence"
                  width={180}
                  height={30}
                  className="h-7 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                  priority
                />
              </div>
            ) : (
              <div className="w-10 h-10 mx-auto flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo-mark.png"
                  alt="VDBI"
                  width={38}
                  height={17}
                  className="w-8 h-auto object-contain transition-transform group-hover:scale-110"
                  priority
                />
              </div>
            )}
          </Link>

          {/* Quick Collapse Button inside expanded Sidebar */}
          {isExpanded && (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (setSidebarVisible) setSidebarVisible(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ml-auto flex-shrink-0"
              title="Ẩn Sidebar"
            >
              <PanelLeftClose className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-5 px-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {isExpanded && (
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between whitespace-nowrap">
              <span>Module Phân Tích</span>
              <span className="text-[9px] text-cyan-400/90 font-bold">5 Modules</span>
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={!isExpanded ? item.name : undefined}
                className={`flex items-center rounded-xl text-xs font-medium transition-all group overflow-hidden ${
                  isExpanded
                    ? "px-3.5 py-2.5 gap-3"
                    : "w-10 h-10 mx-auto justify-center"
                } ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-850/80 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {isExpanded && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="truncate">{item.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 font-bold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Public Site Link & Footer Info */}
        <div className="p-2 border-t border-slate-800/80 space-y-2 flex-shrink-0 overflow-hidden">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            title={!isExpanded ? "Về Trang Giới Thiệu" : undefined}
            className={`flex items-center rounded-lg text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-850 transition-colors ${
              isExpanded ? "px-3 py-2 gap-3" : "w-10 h-10 mx-auto justify-center"
            }`}
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Về Trang Giới Thiệu</span>}
          </Link>

          {isExpanded && (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="truncate">VDBI Intelligence Engine</span>
              </div>
              <div className="text-[9px] text-slate-400">Hạ tầng: Cloud Enterprise SE-Asia</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

interface ShowcaseModule {
  id: string;
  number: string;
  category: string;
  title: string;
  tagline: string;
  route: string;
  image: string;
}

const MODULES_DATA: ShowcaseModule[] = [
  {
    id: "overview",
    number: "01",
    category: "Phân Tích Vĩ Mô",
    title: "Tổng Quan Thị Trường",
    tagline: "Toàn cảnh 19.303 đánh giá & chỉ số cảm xúc ròng (NSS) 7 ngân hàng số",
    route: "/dashboard",
    image: "/abstract/market-overview.jpg",
  },
  {
    id: "bank-detail",
    number: "02",
    category: "Phân Tích Đơn Ứng Dụng",
    title: "Hồ Sơ Ngân Hàng",
    tagline: "Chi tiết năng lực & điểm nghẽn trải nghiệm từng ngân hàng theo phiên bản",
    route: "/dashboard/banks",
    image: "/abstract/bank-profile.jpg",
  },
  {
    id: "benchmark",
    number: "03",
    category: "So Sánh Đa Ứng Dụng",
    title: "Đối Sánh Cạnh Tranh",
    tagline: "Ma trận đối đầu trực diện 7 ngân hàng thương mại, bóc tách khoảng cách",
    route: "/dashboard/benchmark",
    image: "/abstract/benchmark.jpg",
  },
  {
    id: "reviews",
    number: "04",
    category: "Bằng Chứng Đã Khử Trùng",
    title: "Tra Cứu Đánh Giá",
    tagline: "Tìm kiếm & điều tra phản hồi gốc có gắn nhãn khía cạnh và cảm xúc AI",
    route: "/dashboard/reviews",
    image: "/abstract/voice-customer.jpg",
  },
  {
    id: "reports",
    number: "05",
    category: "Quản Trị & Xuất Tệp",
    title: "Báo Cáo & Xuất Dữ Liệu",
    tagline: "Trích xuất tệp dữ liệu tổng hợp CSV & JSON phục vụ thuyết trình và báo cáo",
    route: "/dashboard/reports",
    image: "/abstract/executive-reports.jpg",
  },
];

export function ModulesShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth continuous auto-scroll that pauses on hover (rà chuột vào là dừng lại)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    const speed = 36; // 36px per second - chuyển động chầm chậm, mượt mà và thanh thoát

    const step = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isPausedRef.current && container) {
        container.scrollLeft += speed * delta;

        // Vòng lặp vô tận mượt mà: khi cuộn hết 1 bộ dữ liệu, nhảy lùi về không giật lag
        const oneSetWidth = container.scrollWidth / 3;
        if (oneSetWidth > 0 && container.scrollLeft >= oneSetWidth) {
          container.scrollLeft -= oneSetWidth;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  const handleWheel = () => {
    isPausedRef.current = true;
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 1200);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const oneSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft - 520 <= 0 && oneSetWidth > 0) {
        container.scrollLeft += oneSetWidth;
      }
      container.scrollBy({ left: -520, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const oneSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft + 520 >= oneSetWidth * 2 && oneSetWidth > 0) {
        container.scrollLeft -= oneSetWidth;
      }
      container.scrollBy({ left: 520, behavior: "smooth" });
    }
  };

  return (
    <section
      id="modules"
      className="relative py-24 sm:py-32 bg-transparent border-t border-slate-800/30 overflow-hidden"
    >
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-cyan-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-violet-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Container Header (Exact Google Stitch Layout: Title on Left, Controls on Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Header Title on Left */}
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
              Khám phá các tiện ích
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-400 font-light max-w-2xl leading-relaxed">
              Lựa chọn phân hệ chuyên sâu phù hợp với mục tiêu nghiên cứu và ra quyết định chiến lược của bạn.
            </p>
          </div>

          {/* Carousel Arrow Controls on Right (Exact Google Stitch style from image) */}
          <div
            className="flex items-center gap-3 self-end md:self-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={scrollLeft}
              aria-label="Cuộn sang trái"
              className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg group backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Cuộn sang phải"
              className="w-12 h-12 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg group backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track of Large Module Cards (Tự động di chuyển chầm chậm, rà chuột vào là đứng lại) */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
        onWheel={handleWheel}
        className="flex gap-6 sm:gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2 select-none cursor-grab active:cursor-grabbing no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[...MODULES_DATA, ...MODULES_DATA, ...MODULES_DATA].map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex-shrink-0 w-[340px] sm:w-[440px] md:w-[480px] lg:w-[520px] flex flex-col group"
          >
            {/* The Big Module Card Showcase (Đã bỏ badge trên đầu & bỏ chữ bên dưới card theo đúng yêu cầu) */}
            <div className="relative h-[420px] sm:h-[480px] md:h-[520px] rounded-[32px] overflow-hidden border border-slate-800/90 group-hover:border-cyan-500/50 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] group-hover:-translate-y-1 bg-[#050814]">
              {/* Full-bleed Abstract 3D Artwork Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 340px, 520px"
                  priority={idx < 2}
                />
                {/* Ethereal Gradient Overlay for Depth & Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050e] via-[#02050e]/30 to-transparent" />
                <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Hover Center Overlay with "Khám phá module" Capsule Button */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                <Link
                  href={item.route}
                  className="px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-black/85 hover:bg-white hover:text-black border border-white/30 hover:border-white shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 transform scale-90 group-hover:scale-100 flex items-center gap-2.5 active:scale-95"
                >
                  <span>Khám phá module</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Bottom Card Title Overlay inside card (Chỉ giữ lại Tiêu đề & Toàn cảnh...) */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7 bg-gradient-to-t from-[#02050e] via-[#02050e]/90 to-transparent">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-light line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

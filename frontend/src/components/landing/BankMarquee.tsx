"use client";

import Image from "next/image";
import Link from "next/link";

interface BankMarqueeItem {
  name: string;
  logo: string;
  bgClass: string;
  accentColor: string;
  accentGradient: string;
}

const BANKS: BankMarqueeItem[] = [
  {
    name: "BIDV SmartBanking",
    logo: "/banks/bidv.png",
    bgClass: "bg-white",
    accentColor: "#008775",
    accentGradient: "from-emerald-500 to-teal-400",
  },
  {
    name: "MB Bank",
    logo: "/banks/mbbank.png",
    bgClass: "bg-white",
    accentColor: "#002df3",
    accentGradient: "from-blue-600 to-indigo-500",
  },
  {
    name: "VCB Digibank",
    logo: "/banks/vietcombank.png",
    bgClass: "bg-white",
    accentColor: "#005a2b",
    accentGradient: "from-emerald-600 to-green-500",
  },
  {
    name: "VietinBank iPay",
    logo: "/banks/vietinbank.png",
    bgClass: "bg-white",
    accentColor: "#0068b3",
    accentGradient: "from-cyan-600 to-blue-600",
  },
  {
    name: "TPBank Mobile",
    logo: "/banks/tpbank.png",
    bgClass: "bg-[#5b2384]",
    accentColor: "#672f92",
    accentGradient: "from-purple-600 to-fuchsia-500",
  },
  {
    name: "TNEX",
    logo: "/banks/tnex.png",
    bgClass: "bg-white",
    accentColor: "#00b8e6",
    accentGradient: "from-cyan-400 to-sky-500",
  },
  {
    name: "Liobank",
    logo: "/banks/liobank.png",
    bgClass: "bg-black border border-slate-700/80",
    accentColor: "#f7941d",
    accentGradient: "from-amber-500 to-orange-500",
  },
];

export function BankMarquee() {
  // Duplicate 3 times to ensure infinite smooth seamless marquee looping on any screen width
  const marqueeItems = [...BANKS, ...BANKS, ...BANKS];

  return (
    <section className="relative py-20 bg-transparent overflow-hidden border-t border-slate-900/80">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400 mb-4 shadow-lg backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>7 Ngân Hàng Số Tiên Phong Tại Việt Nam</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          Hệ Sinh Thái{" "}
          <span className="text-gradient-aurora">7 Ứng Dụng Ngân Hàng</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Rê chuột vào thẻ để tạm dừng hoặc nhấn để xem hồ sơ phân tích chi tiết.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Track (Pause on Hover) */}
      <div className="relative w-full overflow-hidden select-none py-4">
        {/* Left Edge Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#05070b] via-[#05070b]/80 to-transparent z-20" />

        {/* Right Edge Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#05070b] via-[#05070b]/80 to-transparent z-20" />

        {/* Continuous Animated Track */}
        <div className="animate-marquee-infinite flex gap-5 sm:gap-6 py-2 px-4">
          {marqueeItems.map((bank, index) => (
            <Link
              key={`${bank.name}-${index}`}
              href={`/dashboard/banks?bank=${encodeURIComponent(bank.name)}`}
              className="group/card relative flex-shrink-0 w-[240px] sm:w-[260px] h-[145px] sm:h-[155px] rounded-2xl bg-[#0a0f1d]/90 hover:bg-[#0f172a] border border-slate-800/80 hover:border-slate-700 p-4 flex flex-col justify-between shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden"
              style={{
                boxShadow: `0 10px 30px -10px ${bank.accentColor}15`,
              }}
            >
              {/* Top Accent Color Tab (Exact style as reference image) */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${bank.accentGradient} rounded-t-2xl`}
              />

              {/* Logo Capsule Container */}
              <div
                className={`w-full h-16 ${bank.bgClass} rounded-xl p-2.5 flex items-center justify-center shadow-md transition-transform duration-300 group-hover/card:scale-[1.03]`}
              >
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  width={180}
                  height={45}
                  className="max-h-11 w-auto object-contain"
                />
              </div>

              {/* Bank Name Only (Clean & Centered) */}
              <div className="pt-2 text-center">
                <h3 className="text-sm font-semibold text-white tracking-tight group-hover/card:text-cyan-300 transition-colors truncate">
                  {bank.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

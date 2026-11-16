"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Reset scroll to top on every reload
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      // If already on landing page, smooth scroll to the very top
      if (window.location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ${
        scrolled ? "py-4 sm:py-5" : "py-6 sm:py-7"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo Brand Header - Click to scroll to top */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <Image
              src="/logo-full.png"
              alt="Vietnam Digital Banking Intelligence"
              width={260}
              height={44}
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              priority
            />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wider uppercase border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
              BETA
            </span>
          </Link>

          {/* Desktop Navigation Links - Chỉ có chữ nổi bật, thanh bar trong suốt 100% không có bất kỳ vệt màu đen nào */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            <a
              href="#overview"
              className="text-base lg:text-[1.05rem] font-medium text-slate-200 hover:text-white transition-colors tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Tổng Quan
            </a>
            <a
              href="#modules"
              className="text-base lg:text-[1.05rem] font-medium text-slate-200 hover:text-white transition-colors tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Tiện Ích
            </a>
            <a
              href="#methodology"
              className="text-base lg:text-[1.05rem] font-medium text-slate-200 hover:text-white transition-colors tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Phương Pháp Luận
            </a>
            <a
              href="#faq"
              className="text-base lg:text-[1.05rem] font-medium text-slate-200 hover:text-white transition-colors tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action - Chuẩn Stitch: Pure White Pill Button "Try now" */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold tracking-wide text-black bg-white hover:bg-slate-200 transition-all duration-200 shadow-md shadow-white/10 active:scale-95"
            >
              Trải nghiệm Dashboard
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b14]/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 space-y-4">
          <a
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base text-slate-200 hover:text-cyan-300 py-1"
          >
            Tổng Quan
          </a>
          <a
            href="#modules"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base text-slate-200 hover:text-cyan-300 py-1"
          >
            Tiện Ích
          </a>
          <a
            href="#methodology"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base text-slate-200 hover:text-cyan-300 py-1"
          >
            Phương Pháp Luận
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base text-slate-200 hover:text-cyan-300 py-1"
          >
            FAQ
          </a>
          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
            >
              <span>Trải nghiệm Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

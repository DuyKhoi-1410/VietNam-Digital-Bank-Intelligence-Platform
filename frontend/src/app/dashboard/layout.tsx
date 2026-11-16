"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopHeader } from "@/components/dashboard/TopHeader";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // If on Module 4 (Tra Cứu Đánh Giá) or arriving with search parameters from Landing Page,
  // sidebar automatically hides by default so user has maximum space for the review data table.
  const isModule4 = pathname === "/dashboard/reviews";
  const hasSearchParams =
    searchParams.get("hide_sidebar") === "1" ||
    searchParams.has("bank") ||
    searchParams.has("aspect") ||
    searchParams.has("keyword") ||
    searchParams.has("q");

  const shouldHideByDefault = isModule4 || hasSearchParams;

  const [sidebarVisible, setSidebarVisible] = useState(() => !shouldHideByDefault);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Synchronize: auto-hide sidebar whenever navigating to Module 4 or receiving search parameters
  useEffect(() => {
    if (shouldHideByDefault) {
      setSidebarVisible(false);
      setMobileOpen(false);
    }
  }, [shouldHideByDefault, pathname, searchParams]);

  const handleToggleSidebar = () => {
    // If mobile width (<1024px), toggle mobile drawer
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      // On desktop, toggle full/docked sidebar visibility
      setSidebarVisible((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ${
          sidebarVisible ? "lg:pl-16" : "lg:pl-0"
        }`}
      >
        <TopHeader
          sidebarVisible={sidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070b]" />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

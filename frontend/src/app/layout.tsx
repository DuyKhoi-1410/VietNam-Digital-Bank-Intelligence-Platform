import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vietnam Digital Banking Intelligence | Nền Tảng Phân Tích Ngân Hàng Số",
  description:
    "Nền tảng trí tuệ dữ liệu phân tích 19.303 đánh giá Google Play trên 7 ngân hàng thương mại Việt Nam bằng mô hình phân tích cảm xúc khía cạnh (ABSA).",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#05070b] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

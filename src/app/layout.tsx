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
  title: "MINIGAME GIẢI Ô CHỮ | Từ Diệt Giặc Dốt 1945 Đến Bình Dân Học Vụ Số",
  description: "Trò chơi tìm từ ma trận và giải ô chữ hàng ngang - hàng dọc đa nghĩa, đánh lạc hướng phục vụ thuyết trình Lịch sử Đảng và Bình dân học vụ số.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased">{children}</body>
    </html>
  );
}

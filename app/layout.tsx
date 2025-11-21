import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { vazir } from "./font";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanjiyo",
  description: "Iran's unified exam platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* 
      تغییر مهم: متغیرهای فونت را به html دادیم تا در سطح :root در دسترس باشند 
      و Tailwind بتواند آنها را بخواند.
    */
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

import type { NextConfig } from "next";
import dns from "dns";

// 1. اجبار Node.js به استفاده از IPv4
dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  // 2. این تنظیمات برای Supabase گاهی لازم است
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;

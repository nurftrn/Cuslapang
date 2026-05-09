import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xxxxx.supabase.co",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.1.125:3000"], // Add your development origin here
  },
};

export default nextConfig;

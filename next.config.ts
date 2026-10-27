import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Only allow cross-origin dev requests (HMR etc.) during development
  ...(isDev && {
    allowedDevOrigins: ["192.168.1.125"], // Add your development origin here
  }),
};

export default nextConfig;

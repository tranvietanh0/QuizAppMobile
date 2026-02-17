import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@quizapp/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static export for dynamic app
  output: undefined,
  // Handle dynamic routes
  experimental: {
    // Allow dynamic server usage
  },
};

export default nextConfig;

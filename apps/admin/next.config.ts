import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@quizapp/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the preview proxy domain to access the dev server without warnings
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-chat-*.space-z.ai",
  ],
  // Reduce memory pressure in dev: don't cache page data aggressively
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
};

export default nextConfig;

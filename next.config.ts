import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.215"],
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "astralae.myshopify.com",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": [
      "./AppData/**/*",
      "./OneDrive/**/*",
      "./Documents/**/*",
      "./Downloads/**/*",
      "./ai_studio/**/*",
      "./langflow*/**/*",
      "./.grok/**/*",
      "./.vscode/**/*",
      "./node_modules/**/*",
    ],
  },
};

export default nextConfig;

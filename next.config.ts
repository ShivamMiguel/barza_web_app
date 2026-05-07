import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js/Turbopack not to bundle these server-only packages.
  // They are kept as native require() calls at runtime, which prevents
  // Turbopack from analysing their large module graphs and inflating the cache.
  serverExternalPackages: ['cheerio'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Redirect old cover-*.png URLs to .jpg (images are JPEG data, extension was fixed)
      {
        source: "/cover-pendaftaran.png",
        destination: "/cover-pendaftaran.jpg",
      },
      {
        source: "/cover-informasi.png",
        destination: "/cover-informasi.jpg",
      },
      {
        source: "/cover-juklak.png",
        destination: "/cover-juklak.jpg",
      },
    ];
  },
};

export default nextConfig;

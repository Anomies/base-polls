import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com', // En yaygın Farcaster PFP hostu
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Diğer yaygın host
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net', // Diğer yaygın host
      },
      // Gerektiğinde buraya başka host adları ekleyebilirsiniz
    ],
  },
};

export default nextConfig;

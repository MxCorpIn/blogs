import type { NextConfig } from "next";

const ONE_YEAR_CACHE = "public, max-age=31536000, immutable";

/**
 * Clickjacking / framing protection + baseline security headers.
 */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Tree-shake heavy icon package - less unused JS on the client
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      // Global clickjacking protection (all routes)
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      // RSS auto-discovery on the blog listing
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</feed.xml>; rel="alternate"; type="application/rss+xml"',
          },
        ],
      },
      // Long-term cache for immutable static assets (hashed Next assets + public media)
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_CACHE }],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/demo/:path*",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_CACHE }],
      },
      {
        source: "/logo/:path*",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_CACHE }],
      },
      {
        source:
          "/:file(ossium_logo.webp|ossium_logo_64.png|ossium_logo_trans.png|favicon.ico)",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_CACHE }],
      },
    ];
  },
};

export default nextConfig;

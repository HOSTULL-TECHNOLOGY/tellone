import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds the offline "open index.html" folder (see scripts/build-offline.sh).
const STATIC = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(STATIC ? { output: "export" as const, images: { unoptimized: true } } : {}),
  poweredByHeader: false,
  devIndicators: false,
  ...(STATIC ? {} : { images: { formats: ["image/avif", "image/webp"] } }),
  async redirects() {
    if (STATIC) return [];
    // SEO-13: old slugs keep their links and rankings (Revised Website Menu, p.15)
    return [
      { source: "/tv", destination: "/media/tv", permanent: true },
      { source: "/theme-song", destination: "/media/theme-song", permanent: true },
      { source: "/movies", destination: "/media/movies", permanent: true },
      { source: "/gallery", destination: "/media/gallery", permanent: true },
      { source: "/offers", destination: "/shop/offers", permanent: true },
      // CAR-1: one canonical ward leader page
      { source: "/ward-leaders", destination: "/careers/ward-leaders", permanent: true },
      { source: "/:lang(pcm|yo|ha|ig)/ward-leaders", destination: "/:lang/careers/ward-leaders", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    if (STATIC) return { beforeFiles: [], afterFiles: [], fallback: [] };
    // English is served at the root ("/about"); other languages live in folders ("/yo/about"). Every public page
    // is rendered under /[lang], so root paths are rewritten to /en. afterFiles runs after public files and
    // app routes (images, robots.txt, sitemap.xml), so those are served as they are. Done here rather than in
    // middleware so hosts such as Netlify need no edge function.
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/:first((?!(?:en|pcm|yo|ha|ig|dashboard|api|_next)(?:/|$))[^/]+)/:rest*", destination: "/en/:first/:rest*" },
      ],
      fallback: [],
    };
  },
  async headers() {
    if (STATIC) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=()" },
        ],
      },
      { source: "/dashboard/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** AI answer engines we explicitly welcome on public pages (GEO-1). */
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "meta-externalagent", "CCBot"];

const DISALLOW = ["/dashboard", "/login", "/logout", "/search", "/*/search", "/api/", "/shop/cart", "/shop/checkout", "/shop/orders", "/*/dashboard", "/*/login"];

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

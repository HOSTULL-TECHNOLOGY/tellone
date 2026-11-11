import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { href, localeMeta, locales } from "@/lib/i18n";
import { mainNav, footerColumns, footerUtility, legalLinks } from "@/data/nav";
import { answers } from "@/data/answers";
import { factChecks } from "@/data/factchecks";
import { newsArticles, authors } from "@/data/news";
import { states } from "@/data/states";
import { projects } from "@/data/demo";
import { calEvents } from "@/data/events";
import { jobs } from "@/data/opportunities";
import { products } from "@/data/shop";

export const dynamic = "force-static";

/**
 * XML sitemap (SEO-6): English canonical URLs with hreflang alternates for the four other languages.
 * Excludes noindex pages: LGA pages (SEO-9), search, verify, login, cart, checkout and order pages.
 */
const EXCLUDE = [/^\/login/, /^\/logout/, /^\/search/, /^\/verify/, /^\/shop\/(cart|checkout|orders)/, /^\/dashboard/, /^\/states\/[^/]+\/[^/]+/];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>(["/", "/candidates", "/candidates/peter-obi", "/candidates/rabiu-musa-kwankwaso", "/news", "/sitemap"]);
  const addAll = (links: { path: string }[]) => links.forEach((l) => paths.add(l.path.split("#")[0]));
  mainNav.forEach((m) => {
    paths.add(m.path);
    m.groups.forEach((g) => addAll(g.links));
  });
  footerColumns.forEach((c) => addAll(c.links));
  addAll(footerUtility);
  addAll(legalLinks);
  answers.forEach((a) => paths.add(`/answers/${a.slug}`));
  factChecks.forEach((f) => paths.add(`/fact-check/${f.slug}`));
  newsArticles.forEach((n) => paths.add(`/news/${n.slug}`));
  authors.forEach((a) => paths.add(`/news/author/${a.slug}`));
  states.forEach((s) => paths.add(`/states/${s.slug}`));
  projects.forEach((p) => paths.add(`/projects/${p.slug}`));
  calEvents.forEach((e) => paths.add(`/events/${e.slug}`));
  jobs.forEach((j) => paths.add(`/jobs/${j.slug}`));
  products.forEach((p) => paths.add(`/shop/p/${p.slug}`));

  const base = site.url.replace(/\/$/, "");
  return [...paths]
    .filter((p) => p.startsWith("/") && !EXCLUDE.some((r) => r.test(p)))
    .sort()
    .map((p) => {
      const languages: Record<string, string> = {};
      for (const l of locales) languages[localeMeta[l].hreflang] = `${base}${href(l, p)}`;
      return { url: `${base}${p}`, changeFrequency: p === "/" || p.startsWith("/news") ? "daily" : "weekly", priority: p === "/" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8, alternates: { languages } };
    });
}

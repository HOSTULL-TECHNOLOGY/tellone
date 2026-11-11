import type { Metadata } from "next";
import { site } from "@/config/site";
import { href, localeMeta, locales, type Locale } from "./i18n";

/**
 * Per-page metadata (SEO-4/5): unique title and description, self-referencing canonical,
 * hreflang alternates for all five language folders plus x-default, Open Graph and X cards.
 * Non-English pages are noindex until translators approve them (Plan C9).
 */
export function pageMeta(locale: Locale, path: string, title: string, description: string, opts: { noindex?: boolean; image?: string; type?: "website" | "article" } = {}): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].hreflang] = href(l, path);
  languages["x-default"] = href("en", path);
  return {
    title,
    description,
    alternates: { canonical: href(locale, path), languages },
    openGraph: { title, description, url: href(locale, path), type: opts.type ?? "website", images: [opts.image ?? "/brand/tbh-one-logo.png"] },
    twitter: { card: "summary_large_image", title, description },
    robots: opts.noindex || locale !== "en" ? { index: false, follow: true } : undefined,
  };
}

/** Static params for every locale, used by every public route. */
export const localeParams = () => locales.map((lang) => ({ lang }));
export const withLocales = <T extends Record<string, string>>(items: T[]) => locales.flatMap((lang) => items.map((i) => ({ lang, ...i })));

export { site };

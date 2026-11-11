export const locales = ["en", "pcm", "yo", "ha", "ig"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { name: string; native: string; htmlLang: string; hreflang: string }> = {
  en: { name: "English", native: "English", htmlLang: "en-NG", hreflang: "en-NG" },
  pcm: { name: "Nigerian Pidgin", native: "Naijá", htmlLang: "pcm", hreflang: "pcm" },
  yo: { name: "Yorùbá", native: "Yorùbá", htmlLang: "yo", hreflang: "yo" },
  ha: { name: "Hausa", native: "Hausa", htmlLang: "ha", hreflang: "ha" },
  ig: { name: "Igbo", native: "Igbo", htmlLang: "ig", hreflang: "ig" },
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Build a public URL for a locale. English lives at the root (Revised Website Menu, p.8). */
export function href(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strip any locale prefix so the same page can be linked in another language. */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (seg && isLocale(seg)) {
    // English is served from the root but rendered internally at /en, so strip it too
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname || "/";
}

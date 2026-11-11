import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

/** Shared boilerplate for the participation pages: metadata factory and locale guard. */
export function metaFor(path: string, title: string, description: string, opts: { noindex?: boolean } = {}) {
  return async ({ params }: { params: Promise<{ lang: string }> }) => {
    const { lang } = await params;
    return pageMeta(lang as Locale, path, title, description, opts);
  };
}

export async function localeOf(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

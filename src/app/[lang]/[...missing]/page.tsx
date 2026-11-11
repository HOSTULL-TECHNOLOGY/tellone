import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";

/**
 * Catch-all so unknown URLs render [lang]/not-found.tsx inside the site chrome, instead of
 * Next's bare default 404 (there is no single root layout). The one static param emits /404
 * per language for static hosting.
 */
export const generateStaticParams = () => locales.map((lang) => ({ lang, missing: ["404"] }));
export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function Missing() {
  notFound();
}

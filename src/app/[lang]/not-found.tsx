"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import "@/styles/content.css";
import { href, locales, type Locale } from "@/lib/i18n";

/** 404 for public pages. Reads the language folder from the URL so links stay in the visitor's language. */
export default function NotFound() {
  const path = usePathname() ?? "/";
  const first = path.split("/")[1] as Locale;
  const locale: Locale = locales.includes(first) ? first : "en";
  const L = (p: string) => href(locale, p);
  return (
    <section className="section">
      <div className="container nf">
        <Compass size={48} aria-hidden />
        <p className="small muted" style={{ margin: 0, fontWeight: 650 }}>Error 404</p>
        <h1>We could not find that page</h1>
        <p>
          The page may have moved, or the link may be mistyped. If someone sent you this link asking for money or personal details, check it on the Verify page first.
        </p>
        <form role="search" action={L("/search")} className="search-inline" style={{ marginInline: "auto" }}>
          <label htmlFor="nf-q" className="sr-only">
            Search TBH One
          </label>
          <input id="nf-q" name="q" type="search" className="input" placeholder="Search TBH One" />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <Link href={L("/")} className="btn btn-outline">Home</Link>
          <Link href={L("/sitemap")} className="btn btn-ghost">Sitemap</Link>
          <Link href={L("/verify")} className="btn btn-ghost">Verify a link</Link>
        </p>
      </div>
    </section>
  );
}

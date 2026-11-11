"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { search } from "@/data/search-index";
import { href, type Locale } from "@/lib/i18n";

/** Client-side search over the prototype index. Reads ?q= once on load and keeps the URL in sync without navigating. */
export function SiteSearch({ locale }: { locale: Locale }) {
  const [draft, setDraft] = useState("");
  const [q, setQ] = useState("");
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q") ?? "";
    setDraft(initial);
    setQ(initial);
  }, []);
  const results = useMemo(() => search(q), [q]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setQ(draft);
    try {
      const url = new URL(window.location.href);
      if (draft.trim()) url.searchParams.set("q", draft.trim());
      else url.searchParams.delete("q");
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* file:// or sandboxed frames: results still update */
    }
  }

  return (
    <div>
      <form role="search" onSubmit={submit} className="search-inline">
        <label htmlFor="site-q" className="sr-only">
          Search TBH One
        </label>
        <input id="site-q" type="search" className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search, e.g. PVC, giveaway, Kano" autoComplete="off" />
        <button type="submit" className="btn btn-primary">
          <Search size={18} aria-hidden /> Search
        </button>
      </form>
      <p className="small muted" aria-live="polite" style={{ marginTop: 12 }}>
        {q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q.trim()}”` : "Type a word or phrase and press Search."}
      </p>
      {q.trim() && results.length === 0 && (
        <div className="prose">
          <p>No pages match. Try a shorter word, or browse:</p>
          <ul>
            <li><Link href={href(locale, "/answers")}>Questions Answered</Link></li>
            <li><Link href={href(locale, "/faq")}>FAQ</Link></li>
            <li><Link href={href(locale, "/sitemap")}>Sitemap</Link></li>
          </ul>
        </div>
      )}
      {results.length > 0 && (
        <ol className="search-results" role="list">
          {results.map((r) => (
            <li key={r.path}>
              <span className="chip">{r.type}</span>
              <Link href={href(locale, r.path)}>
                <strong>{r.title}</strong>
              </Link>
              {r.text && <p className="small muted">{r.text}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

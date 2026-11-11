"use client";

import Link from "next/link";
import { NewsArt } from "@/components/NewsArt";
import { useState } from "react";
import { href, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/format";

type Row = { slug: string; title: string; excerpt: string; date: string; category: string; poster: string; author: string };

/** Article list with a category filter (toggle buttons). All articles render on the server; the filter only hides rows. */
export function NewsList({ locale, rows, categories }: { locale: Locale; rows: Row[]; categories: string[] }) {
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? rows.filter((r) => r.category === cat) : rows;
  return (
    <>
      <div className="cat-filter" role="group" aria-label="Filter by category">
        <button type="button" className="btn btn-sm btn-ghost" aria-pressed={cat === null} onClick={() => setCat(null)}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className="btn btn-sm btn-ghost" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} articles shown
      </p>
      <ul className="news-list" role="list">
        {shown.map((a) => (
          <li key={a.slug} className="news-row">
            <div className="news-row-art" aria-hidden>
              <NewsArt slug={a.slug} />
            </div>
            <div>
              <p className="article-meta" style={{ margin: "0 0 6px" }}>
                <span className="chip">{a.category}</span>
                <time dateTime={a.date}>{formatDate(a.date)}</time>
                <span className="chip chip-demo">Draft article</span>
              </p>
              <h2>
                <Link href={href(locale, `/news/${a.slug}`)}>{a.title}</Link>
              </h2>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {a.excerpt}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { formatNaira } from "@/lib/format";

export type CarouselProject = {
  slug: string;
  title: string;
  category: string;
  place: string;
  raised: number;
  target: number;
  funders: number;
  statusLabel: string;
  open: boolean;
  update?: string;
};

/** Transparency projects as a swipeable row: red, green, red… cards, with arrow buttons for mouse users. */
export function ProjectCarousel({
  items,
  hrefFor,
  labels,
}: {
  items: CarouselProject[];
  hrefFor: Record<string, string>;
  labels: { raised: string; target: string; funders: string; view: string; fund: string; prev: string; next: string; region: string };
}) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.getBoundingClientRect().width ?? 320) + 20), behavior: "smooth" });
  };
  return (
    <div className="pcar">
      <div className="pcar-nav">
        <button type="button" className="pcar-btn" onClick={() => scroll(-1)} aria-label={labels.prev}>
          <ChevronLeft size={22} aria-hidden />
        </button>
        <button type="button" className="pcar-btn" onClick={() => scroll(1)} aria-label={labels.next}>
          <ChevronRight size={22} aria-hidden />
        </button>
      </div>
      <ul ref={track} className="pcar-track" role="list" aria-label={labels.region} tabIndex={0}>
        {items.map((p, i) => {
          const pct = Math.min(100, Math.round((p.raised / p.target) * 100));
          return (
            <li key={p.slug} className={`pcar-card ${i % 2 === 0 ? "pcar-r" : "pcar-g"}`}>
              <div className="pcar-top">
                <span className="pcar-cat">{p.category}</span>
                <span className="pcar-status">{p.statusLabel}</span>
              </div>
              <h3>
                <Link href={hrefFor[p.slug]}>{p.title}</Link>
              </h3>
              <p className="pcar-place">
                <MapPin size={15} aria-hidden /> {p.place}
              </p>
              <div className="pcar-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`${pct}% funded`}>
                <span style={{ width: `${pct}%` }} />
              </div>
              <dl className="pcar-figs">
                <div>
                  <dt>{labels.raised}</dt>
                  <dd>{formatNaira(p.raised)}</dd>
                </div>
                <div>
                  <dt>{labels.target}</dt>
                  <dd>{formatNaira(p.target)}</dd>
                </div>
                <div>
                  <dt>{labels.funders}</dt>
                  <dd>{p.funders}</dd>
                </div>
              </dl>
              {p.update && <p className="pcar-update">{p.update}</p>}
              <div className="pcar-actions">
                <Link href={hrefFor[p.slug]} className="btn btn-sm btn-outline">
                  {labels.view}
                </Link>
                {p.open && (
                  <Link href={`${hrefFor[p.slug]}#fund`} className="btn btn-sm btn-primary">
                    {labels.fund}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

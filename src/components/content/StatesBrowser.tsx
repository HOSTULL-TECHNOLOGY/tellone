"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { states } from "@/data/states";
import { href, type Locale } from "@/lib/i18n";

const ZONES = ["North Central", "North East", "North West", "South East", "South South", "South West"] as const;

/** Searchable list of the 36 states and the FCT, grouped by geopolitical zone. */
export function StatesBrowser({ locale }: { locale: Locale }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? states.filter((s) => s.name.toLowerCase().includes(n) || s.capital.toLowerCase().includes(n) || s.zone.toLowerCase().includes(n)) : states;
  }, [q]);
  return (
    <>
      <div className="search-inline">
        <label htmlFor="state-q" className="sr-only">
          Find a state or capital
        </label>
        <input id="state-q" className="input" type="search" placeholder="Find a state or capital, e.g. Kano or Ikeja" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="btn btn-ghost" aria-hidden>
          <Search size={18} />
        </span>
      </div>
      <p className="small muted" aria-live="polite">
        {filtered.length} of 37 shown
      </p>
      {ZONES.map((z) => {
        const list = filtered.filter((s) => s.zone === z);
        if (!list.length) return null;
        return (
          <div key={z} className="zone-block">
            <h2>{z}</h2>
            <ul className="state-links" role="list">
              {list.map((s) => (
                <li key={s.slug}>
                  <Link href={href(locale, `/states/${s.slug}`)}>
                    <strong>{s.name === "FCT" ? "Federal Capital Territory" : s.name}</strong>
                    <span>
                      Capital: {s.capital} · {s.lgas} LGAs
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {filtered.length === 0 && <p>No state matches “{q}”.</p>}
    </>
  );
}

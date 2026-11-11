"use client";

import Link from "next/link";
import { useState } from "react";
import { states } from "@/data/states";
import { presence } from "@/data/presence";
import { href, type Locale } from "@/lib/i18n";

const LEVELS = ["Starting", "Growing", "Organised", "Strong", "Very strong"];
const short = (n: string) => (n === "FCT" ? "FCT" : n.replace("Cross River", "C. River").replace("Akwa Ibom", "A. Ibom"));

/** Tile grid of the 37 states, shaded by demo presence level. Each tile is a toggle button; the selected state's figures show below. */
export function PresenceMap({ locale }: { locale: Locale }) {
  const [sel, setSel] = useState<string | null>("lagos");
  const s = states.find((x) => x.slug === sel);
  const p = presence.find((x) => x.slug === sel);
  return (
    <div>
      <div className="pmap" role="group" aria-label="States by TBH One presence">
        {states.map((st) => {
          const pr = presence.find((x) => x.slug === st.slug)!;
          return (
            <button key={st.slug} type="button" data-level={pr.level} aria-pressed={sel === st.slug} aria-label={`${st.name}: ${LEVELS[pr.level]}`} onClick={() => setSel(sel === st.slug ? null : st.slug)}>
              {short(st.name)}
            </button>
          );
        })}
      </div>
      <div className="pmap-legend" aria-label="Legend">
        {LEVELS.map((l, i) => (
          <span key={l}>
            <i className="pmap-swatch" data-level={i} />
            {l}
          </span>
        ))}
        <span className="chip chip-demo">Demo data</span>
      </div>
      <div aria-live="polite" style={{ marginTop: 20 }}>
        {s && p ? (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>{s.name === "FCT" ? "Federal Capital Territory" : `${s.name} State`}</h3>
            <p style={{ margin: "0 0 12px" }}>
              {LEVELS[p.level]} presence · {p.members.toLocaleString("en-NG")} members · {p.wardLeaders.toLocaleString("en-NG")} ward leaders · {p.projects} projects · {p.events} events
            </p>
            <Link className="btn btn-sm btn-primary" href={href(locale, `/states/${s.slug}`)}>
              Open {s.name} page
            </Link>
          </div>
        ) : (
          <p className="muted">Select a state to see its figures.</p>
        )}
      </div>
    </div>
  );
}

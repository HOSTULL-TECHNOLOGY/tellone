"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Globe2 } from "lucide-react";
import { states } from "@/data/states";
import { diasporaChapters, presence } from "@/data/presence";
import { nigeriaMapPaths, nigeriaMapViewBox } from "@/data/nigeria-map";

type Sel = { kind: "nigeria" } | { kind: "state"; slug: string } | { kind: "country"; country: string } | null;

const SHADES = ["#d9eccf", "#a3de8b", "#5fae45", "#157103", "#0f4d02"]; // presence level 0–4, light to dark

/**
 * "Active across 36 states, the FCT and N countries" explorer, laid out like the reference the client supplied:
 * country tiles, a clickable map of Nigeria's states underneath, and a "Select a location" panel.
 * Selecting a tile or a state shows its demo figures. Production: built from live member, leader and project records.
 */
export function ReachExplorer({ stateHref, statesHref, diasporaHref }: { stateHref: Record<string, string>; statesHref: string; diasporaHref: string }) {
  const [sel, setSel] = useState<Sel>(null);
  const [hover, setHover] = useState<string | null>(null);
  const totals = useMemo(
    () => presence.reduce((a, p) => ({ members: a.members + p.members, wardLeaders: a.wardLeaders + p.wardLeaders, streetLeaders: a.streetLeaders + p.streetLeaders, projects: a.projects + p.projects }), { members: 0, wardLeaders: 0, streetLeaders: 0, projects: 0 }),
    [],
  );
  const st = sel?.kind === "state" ? states.find((s) => s.slug === sel.slug) : undefined;
  const pr = sel?.kind === "state" ? presence.find((p) => p.slug === sel.slug) : sel?.kind === "nigeria" ? totals : undefined;
  const ch = sel?.kind === "country" ? diasporaChapters.find((c) => c.country === sel.country) : undefined;
  const pick = (slug: string) => setSel({ kind: "state", slug });
  const hovered = hover ? states.find((s) => s.slug === hover) : undefined;
  const fmt = (n: number) => n.toLocaleString("en-NG");

  return (
    <div className="reach">
      <div className="reach-left">
        <div className="reach-tiles" role="group" aria-label="Countries">
          <button type="button" className="reach-tile reach-tile-home" aria-pressed={sel?.kind === "nigeria" || sel?.kind === "state"} onClick={() => setSel({ kind: "nigeria" })}>
            Nigeria
          </button>
          {diasporaChapters.map((c) => (
            <button key={c.country} type="button" className="reach-tile" aria-pressed={sel?.kind === "country" && sel.country === c.country} onClick={() => setSel({ kind: "country", country: c.country })}>
              {c.country}
            </button>
          ))}
        </div>

        <figure className="reach-map">
          <figcaption className="reach-map-cap">Nigeria — click a state</figcaption>
          <svg viewBox={nigeriaMapViewBox} role="group" aria-label="Map of Nigeria's states" className="reach-svg">
            {states.map((s) => {
              const d = nigeriaMapPaths[s.slug];
              if (!d) return null;
              const level = presence.find((p) => p.slug === s.slug)?.level ?? 0;
              const on = sel?.kind === "state" && sel.slug === s.slug;
              return (
                <path
                  key={s.slug}
                  d={d}
                  className={`reach-state${on ? " is-on" : ""}`}
                  style={{ ["--fill" as string]: SHADES[level] }}
                  role="button"
                  tabIndex={0}
                  aria-label={s.name}
                  aria-pressed={on}
                  onClick={() => pick(s.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pick(s.slug);
                    }
                  }}
                  onMouseEnter={() => setHover(s.slug)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(s.slug)}
                  onBlur={() => setHover(null)}
                />
              );
            })}
          </svg>
          <p className="reach-map-hover" aria-hidden>
            {hovered ? hovered.name : " "}
          </p>
          <div className="reach-legend" aria-hidden>
            <span>Fewer members</span>
            {SHADES.map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
            <span>More</span>
          </div>
          <label className="reach-select">
            <span className="sr-only">Or choose a state</span>
            <select value={sel?.kind === "state" ? sel.slug : ""} onChange={(e) => e.target.value && pick(e.target.value)}>
              <option value="">Or choose a state…</option>
              {states.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </figure>
      </div>

      <div className="reach-panel" aria-live="polite">
        <div className="reach-panel-head">
          <h3>{st ? st.name : ch ? ch.country : sel?.kind === "nigeria" ? "Nigeria" : "Select a location"}</h3>
          <p>
            {st
              ? `${st.zone} · capital ${st.capital} · ${st.lgas} LGAs`
              : ch
                ? ch.status
                : sel?.kind === "nigeria"
                  ? "36 states and the FCT. Click a state on the map to see it."
                  : "Click a country, or a state on the map, to see TBH One there."}
          </p>
        </div>
        {pr ? (
          <div className="reach-panel-body">
            <dl className="reach-figs">
              <div>
                <dt>Members</dt>
                <dd>{fmt(pr.members)}</dd>
              </div>
              <div>
                <dt>Ward leaders</dt>
                <dd>{fmt(pr.wardLeaders)}</dd>
              </div>
              <div>
                <dt>Street leaders</dt>
                <dd>{fmt(pr.streetLeaders)}</dd>
              </div>
              <div>
                <dt>Projects</dt>
                <dd>{fmt(pr.projects)}</dd>
              </div>
            </dl>
            <Link href={st ? stateHref[st.slug] : statesHref} className="btn btn-primary">
              {st ? `TBH One in ${st.name}` : "Find your state"}
            </Link>
          </div>
        ) : ch ? (
          <div className="reach-panel-body">
            <dl className="reach-figs">
              <div>
                <dt>Members</dt>
                <dd>{fmt(ch.members)}</dd>
              </div>
              <div>
                <dt>Chapter</dt>
                <dd className="reach-small">{ch.status}</dd>
              </div>
            </dl>
            <Link href={diasporaHref} className="btn btn-primary">
              Join the {ch.country} chapter
            </Link>
          </div>
        ) : (
          <div className="reach-empty">
            <Globe2 size={44} aria-hidden strokeWidth={1.4} />
            <p className="reach-empty-title">No location selected</p>
            <p className="reach-empty-text">Click any country, or click a state on the map of Nigeria to see members, leaders and projects there.</p>
          </div>
        )}
        <p className="reach-demo">Demo data</p>
      </div>
    </div>
  );
}

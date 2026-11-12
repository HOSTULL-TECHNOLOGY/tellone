"use client";

import { useEffect, useState } from "react";
import { hero, microcopy, regions, WAVE } from "@/data/careers";
import { loadWards } from "@/lib/wards";

/**
 * Live counter of wards with a leader (CAR-3): refreshed every 60 seconds. In the prototype the figures are the
 * document's sample (3,154 of 8,809); production reads the live count from the recruitment service.
 */
export function WardCounter({ variant = "hero" }: { variant?: "hero" | "band" }) {
  const [at, setAt] = useState<string>("");
  useEffect(() => {
    const tick = () => setAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }));
    tick();
    const t = window.setInterval(tick, 60_000);
    return () => window.clearInterval(t);
  }, []);
  const filled = WAVE.filledSample;
  const open = WAVE.wards - filled;
  return (
    <div className={`wc wc-${variant}`} aria-live="polite">
      <div className="wc-bar" role="meter" aria-valuemin={0} aria-valuemax={WAVE.wards} aria-valuenow={filled} aria-label={`${filled} of ${WAVE.wards} wards have a leader`}>
        <span style={{ width: `${(filled / WAVE.wards) * 100}%` }} />
      </div>
      <p className="wc-text">
        <strong>{filled.toLocaleString("en-NG")}</strong> of {WAVE.wards.toLocaleString("en-NG")} wards have a leader · <strong>{open.toLocaleString("en-NG")}</strong> wards still need one · {hero.closes}
      </p>
      <p className="wc-meta small">
        <span className="chip chip-demo">Sample</span> {at ? `Updated ${at} WAT · refreshes every 60 seconds` : "Refreshes every 60 seconds"}
      </p>
    </div>
  );
}

/**
 * Places by region: a bar for each region (filled and open), a Check my ward button beside every bar, and a
 * state-by-state view when a region is tapped; then the full table. Figures are the sample.
 */
export function RegionChart({ checkHref }: { checkHref: string }) {
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [byState, setByState] = useState<Record<string, { name: string; wards: number; filled: number }[]>>({});
  useEffect(() => {
    if (!openRegion || byState[openRegion]) return;
    loadWards().then(({ wards }) => {
      const zone = regions.find((r) => r.region === openRegion)!.zone;
      const m = new Map<string, { name: string; wards: number; filled: number }>();
      for (const w of wards) {
        if (w.zone !== zone) continue;
        const r = m.get(w.state) ?? { name: w.stateName, wards: 0, filled: 0 };
        r.wards++;
        if (w.status === 1) r.filled++;
        m.set(w.state, r);
      }
      setByState((b) => ({ ...b, [openRegion]: [...m.values()].sort((x, y) => x.name.localeCompare(y.name)) }));
    });
  }, [openRegion, byState]);
  const total = regions.reduce((a, r) => ({ wards: a.wards + r.wards, filled: a.filled + r.filled }), { wards: 0, filled: 0 });
  const pct = (f: number, w: number) => `${Math.round((f / w) * 100)}%`;
  return (
    <div className="rc">
      <ul className="rc-bars" role="list">
        {regions.map((r) => (
          <li key={r.region}>
            <button type="button" className="rc-name" aria-expanded={openRegion === r.region} onClick={() => setOpenRegion(openRegion === r.region ? null : r.region)}>
              {r.region}
              <span className="small muted"> {openRegion === r.region ? "Hide states" : "See states"}</span>
            </button>
            <span className="rc-track" aria-hidden>
              <span className="rc-filled" style={{ width: pct(r.filled, r.wards) }} />
            </span>
            <span className="rc-num">
              {r.filled.toLocaleString("en-NG")} filled · {(r.wards - r.filled).toLocaleString("en-NG")} open
            </span>
            <a href={checkHref} className="btn btn-sm btn-outline rc-check">
              Check my ward
            </a>
            {openRegion === r.region && (
              <div className="rc-states">
                {byState[r.region] ? (
                  <ul role="list">
                    {byState[r.region].map((st) => (
                      <li key={st.name}>
                        <span>{st.name}</span>
                        <span className="rc-track" aria-hidden>
                          <span className="rc-filled" style={{ width: pct(st.filled, st.wards) }} />
                        </span>
                        <span className="rc-num">
                          {st.filled} / {st.wards}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="small muted">Loading the states…</p>
                )}
                <p className="small muted">State figures come from the sample ward list and may differ slightly from the scaled regional totals.</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="table-wrap">
        <table className="rate-table">
          <caption className="sr-only">Ward leader places by region, wave 1 (sample)</caption>
          <thead>
            <tr>
              <th scope="col">Region</th>
              <th scope="col">States</th>
              <th scope="col" className="num">Wards (places)</th>
              <th scope="col" className="num">Filled</th>
              <th scope="col" className="num">Open</th>
              <th scope="col" className="num">Share filled</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.region}>
                <td>{r.region}</td>
                <td>{r.states}</td>
                <td className="num">{r.wards.toLocaleString("en-NG")}</td>
                <td className="num">{r.filled.toLocaleString("en-NG")}</td>
                <td className="num">{(r.wards - r.filled).toLocaleString("en-NG")}</td>
                <td className="num">{pct(r.filled, r.wards)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Total</th>
              <th>36 states and the FCT</th>
              <th className="num">{total.wards.toLocaleString("en-NG")}</th>
              <th className="num">{total.filled.toLocaleString("en-NG")}</th>
              <th className="num">{(total.wards - total.filled).toLocaleString("en-NG")}</th>
              <th className="num">{pct(total.filled, total.wards)}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** "What a month could look like": a table on wider screens, cards with tabs on phones (Active shown first). */
export function ExampleMonths({ tiers, rows, title }: { tiers: { key: string; name: string; hours: string; total: string }[]; rows: [string, string, string, string][]; title: string }) {
  const [tab, setTab] = useState(1);
  return (
    <div className="em">
      <h3 className="cw-h3">{title}</h3>
      <div className="em-tabs" role="tablist" aria-label="Example months">
        {tiers.map((t, i) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === i} className={tab === i ? "is-on" : ""} onClick={() => setTab(i)}>
            {t.name}
            <span>{t.hours}</span>
          </button>
        ))}
      </div>
      <div className="em-card" role="tabpanel" aria-label={tiers[tab].name}>
        <ul role="list">
          {rows
            .filter((r) => r[tab + 1] !== "—")
            .map((r) => (
              <li key={r[0]}>
                <span>{r[0]}</span>
                <strong>{r[tab + 1]}</strong>
              </li>
            ))}
        </ul>
        <p className="em-total">
          Month total <strong>{tiers[tab].total}</strong>
        </p>
      </div>
      <div className="table-wrap em-table">
        <table className="rate-table">
          <thead>
            <tr>
              <th scope="col">Work</th>
              {tiers.map((t, i) => (
                <th key={t.key} scope="col" className={i === 1 ? "em-hl" : ""}>
                  {t.name}
                  <span className="small muted">
                    <br />
                    {t.hours}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                {[1, 2, 3].map((i) => (
                  <td key={i} className={i === 2 ? "em-hl" : ""}>
                    {r[i]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Month total</th>
              {tiers.map((t, i) => (
                <th key={t.key} className={i === 1 ? "em-hl" : ""}>
                  {t.total}
                </th>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Exit-intent pop-up (desktop: pointer leaves through the top of the window), once per visit. */
export function ExitIntent({ checkHref }: { checkHref: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("tbh-exit-intent") === "1";
    } catch {}
    if (seen) return;
    const onOut = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget) return;
      setOpen(true);
      try {
        sessionStorage.setItem("tbh-exit-intent", "1");
      } catch {}
      document.removeEventListener("mouseout", onOut);
    };
    const t = window.setTimeout(() => document.addEventListener("mouseout", onOut), 8000);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);
  if (!open) return null;
  return (
    <div className="ei" role="dialog" aria-modal="true" aria-labelledby="ei-t">
      <div className="ei-box">
        <p id="ei-t">{microcopy.exitIntent.text}</p>
        <div className="form-actions">
          <a href={checkHref} className="btn btn-primary" onClick={() => setOpen(false)}>
            {microcopy.exitIntent.yes}
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} autoFocus>
            {microcopy.exitIntent.no}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Share this page: WhatsApp and copy link. */
export function ShareRow({ message, url }: { message: string; url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="cw-share-row">
      <a className="btn btn-outline" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener">
        Share on WhatsApp
      </a>
      <button
        type="button"
        className="btn btn-outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
          } catch {}
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2500);
        }}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

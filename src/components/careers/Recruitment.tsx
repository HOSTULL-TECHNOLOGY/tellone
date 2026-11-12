"use client";

import { useEffect, useState } from "react";
import { hero, regions, WAVE } from "@/data/careers";

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

/** Places by region: bar chart plus table (mobile note in the document). */
export function RegionChart() {
  const total = regions.reduce((a, r) => ({ wards: a.wards + r.wards, filled: a.filled + r.filled }), { wards: 0, filled: 0 });
  return (
    <div className="rc">
      <ul className="rc-bars" role="list" aria-hidden>
        {regions.map((r) => (
          <li key={r.region}>
            <span className="rc-name">{r.region}</span>
            <span className="rc-track">
              <span className="rc-filled" style={{ width: `${(r.filled / r.wards) * 100}%` }} />
            </span>
            <span className="rc-num">
              {r.filled.toLocaleString("en-NG")} / {r.wards.toLocaleString("en-NG")}
            </span>
          </li>
        ))}
      </ul>
      <div className="table-wrap">
        <table className="rate-table">
          <caption className="sr-only">Ward leader places by region, wave 1</caption>
          <thead>
            <tr>
              <th scope="col">Region</th>
              <th scope="col" className="num">
                Wards (places)
              </th>
              <th scope="col" className="num">
                Filled (sample)
              </th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.region}>
                <td>{r.region}</td>
                <td className="num">{r.wards.toLocaleString("en-NG")}</td>
                <td className="num">{r.filled.toLocaleString("en-NG")}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Total</th>
              <th className="num">{total.wards.toLocaleString("en-NG")}</th>
              <th className="num">{total.filled.toLocaleString("en-NG")}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

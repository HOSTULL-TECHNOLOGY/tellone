"use client";

import { useEffect, useState } from "react";
import { DEMO_MODE } from "@/config/site";
import { INEC_IREV_URL, phaseAt, timeToElection, type CampaignPhase } from "@/lib/campaign";

/** Countdown to polls opening (8:00 am WAT, Saturday 16 January 2027). */
export function BigCountdown() {
  const [t, setT] = useState<ReturnType<typeof timeToElection> | null>(null);
  useEffect(() => {
    const tick = () => setT(timeToElection());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="bigcount" role="timer" aria-label="Time until polls open on Saturday 16 January 2027">
      <span>
        <strong>{t?.days ?? "—"}</strong> days
      </span>
      <span>
        <strong>{t ? String(t.hours).padStart(2, "0") : "—"}</strong> hours
      </span>
      <span>
        <strong>{t ? String(t.minutes).padStart(2, "0") : "—"}</strong> minutes
      </span>
    </div>
  );
}

const PHASES: { key: CampaignPhase; title: string; when: string; text: string }[] = [
  { key: "campaign", title: "Campaign period", when: "Until 11:59 pm, Thu 14 Jan 2027", text: "Election updates, events, giveaways, coupons and campaign banners run as normal." },
  { key: "cutoff", title: "Campaign cut-off", when: "From 11:59 pm, Thu 14 Jan 2027", text: "All promotion, giveaways, coupons and broadcasts stop automatically. The site shows neutral voting information only." },
  { key: "election-day", title: "Election Day", when: "Sat 16 Jan 2027", text: "The ticker and this page link only to INEC’s official Result Viewing Portal. TBH One does not collate results." },
  { key: "post-election", title: "After the vote", when: "From 17 Jan 2027", text: "Shop dispatch resumes and TBH One transitions to its longer-term civic platform." },
];

/** Shows which phase the site is in now; reviewers can preview with ?phase= in demo mode. */
export function PhaseCards() {
  const [phase, setPhase] = useState<CampaignPhase>("campaign");
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("phase") as CampaignPhase | null;
    setPhase(DEMO_MODE && forced ? forced : phaseAt());
  }, []);
  return (
    <>
      <div className="phases">
        {PHASES.map((p) => (
          <div key={p.key} className="phase" data-current={p.key === phase ? "true" : undefined}>
            {p.key === phase && <span className="chip chip-ok">Current phase</span>}
            <h3>{p.title}</h3>
            <p className="small muted">{p.when}</p>
            <p className="small">{p.text}</p>
          </div>
        ))}
      </div>
      {(phase === "election-day" || phase === "post-election") && (
        <p style={{ marginTop: 16 }}>
          <a className="btn btn-primary" href={INEC_IREV_URL} target="_blank" rel="noopener">
            Official results: INEC Result Viewing Portal (IReV)
          </a>
        </p>
      )}
    </>
  );
}

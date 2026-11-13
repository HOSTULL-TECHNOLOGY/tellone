"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { phaseAt, timeToElection, INEC_IREV_URL, type CampaignPhase } from "@/lib/campaign";
import { DEMO_MODE } from "@/config/site";
import { nextMilestone } from "@/data/timeline";
import { useLiveStats } from "@/lib/useLiveStats";
import { visibleStats } from "@/lib/stats";
import type { Dict } from "@/i18n";

/** Live election strip below the top bar (WEB-1). Switches to neutral info at the cut-off. */
export function Ticker({ t, electionHref, initialPhase }: { t: Dict; electionHref: string; initialPhase: CampaignPhase }) {
  const [phase, setPhase] = useState<CampaignPhase>(initialPhase);
  const [days, setDays] = useState<number | null>(null);
  const stats = useLiveStats();

  useEffect(() => {
    const tick = () => {
      const forced = new URLSearchParams(window.location.search).get("phase") as CampaignPhase | null;
      setPhase(DEMO_MODE && forced ? forced : phaseAt());
      setDays(timeToElection().days);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const milestone = nextMilestone();
  let body: React.ReactNode;
  if (phase === "election-day" || phase === "post-election") {
    body = (
      <a href={INEC_IREV_URL} rel="noopener" target="_blank">
        {t.ticker.electionDay}
        <span className="sr-only"> ({t.common.newTab})</span>
      </a>
    );
  } else if (phase === "cutoff") {
    body = <Link href={electionHref}>{t.ticker.neutral}</Link>;
  } else {
    body = (
      <Link href={electionHref} className="ticker-link">
        {milestone && (
          <span className="ticker-lead">
            INEC: {milestone.title} · {milestone.dateLabel}
          </span>
        )}
        <span aria-hidden="true" className="ticker-sep ticker-lead">·</span>
        <span>
          <strong>{days ?? "—"}</strong> {t.ticker.toElection}
        </span>
        {stats && visibleStats(stats).members && (
          <>
            <span aria-hidden="true" className="ticker-sep ticker-members">·</span>
            <span className="ticker-members">
              <strong>{stats.members.toLocaleString("en-NG")}</strong> {t.ticker.members}
              {stats.demo && <span className="ticker-demo"> ({t.common.demo})</span>}
            </span>
          </>
        )}
      </Link>
    );
  }

  return (
    <div className="ticker band-red" role="region" aria-label={t.ticker.label}>
      <div className="container ticker-row">
        <span className="chip chip-live ticker-badge">{phase === "campaign" ? "Live" : "Info"}</span>
        <p className="ticker-text">{body}</p>
      </div>
    </div>
  );
}

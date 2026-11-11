"use client";

import { CountUp } from "@/components/ui/CountUp";
import Link from "next/link";
import { useLiveStats } from "@/lib/useLiveStats";
import { formatNaira } from "@/lib/format";
import type { Dict } from "@/i18n";

/** WEB-2: total members, joins today, funds raised and the opt-in "just joined" feed. */
export function LiveBlock({ t, joinHref, transparencyHref }: { t: Dict; joinHref: string; transparencyHref: string }) {
  const s = useLiveStats();
  return (
    <div className="live">
      <dl className="live-stats" aria-live="polite">
        <div>
          <dt>{t.live.members}</dt>
          <dd>{s ? <CountUp value={s.members} /> : "—"}</dd>
        </div>
        <div>
          <dt>{t.live.today}</dt>
          <dd>{s ? <CountUp value={s.joinedToday} /> : "—"}</dd>
        </div>
        <div>
          <dt>
            <Link href={transparencyHref}>{t.live.raised}</Link>
          </dt>
          <dd>{s ? <CountUp value={s.raisedNaira} format={formatNaira} /> : "—"}</dd>
        </div>
      </dl>
      <div className="live-feed panel">
        <div className="live-feed-head">
          <h3>{t.live.feedTitle}</h3>
          {s?.demo && (
            <span className="chip chip-demo" title={t.common.demoTitle}>
              {t.common.demo}
            </span>
          )}
        </div>
        <ul role="list">
          {(s?.recent ?? []).slice(0, 5).map((r, i) => (
            <li key={`${r.firstName}-${i}`}>
              <span className="live-dot" aria-hidden />
              <span>
                <strong>{r.firstName}</strong> {t.live.joinedFrom} {r.state}
              </span>
              <span className="muted small">{r.minutesAgo} min</span>
            </li>
          ))}
        </ul>
        <p className="small muted">{t.live.feedNote}</p>
        <p className="small muted">{t.live.refresh}</p>
        <Link href={joinHref} className="btn btn-primary btn-block">
          {t.hero.join}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { CountUp } from "@/components/ui/CountUp";
import Link from "next/link";
import { useLiveStats } from "@/lib/useLiveStats";
import { visibleStats } from "@/lib/stats";
import { campaignDates } from "@/config/site";
import { WAVE } from "@/data/careers";
import { formatNaira } from "@/lib/format";
import type { Dict } from "@/i18n";

/**
 * WEB-2: total members, joins today, funds raised and the opt-in "just joined" feed. Each counter appears only once
 * the real figure reaches site.liveThresholds; until then the block shows true momentum messages (founding members,
 * wards that need a leader, days to Election Day). Figures are never invented.
 */
export function LiveBlock({ t, joinHref, transparencyHref, wardsHref }: { t: Dict; joinHref: string; transparencyHref: string; wardsHref: string }) {
  const s = useLiveStats();
  const show = visibleStats(s);
  const days = Math.max(0, Math.ceil((campaignDates.electionDay.getTime() - Date.now()) / 86_400_000));
  const e = t.live.early;
  return (
    <div className="live">
      {show.members ? (
        <dl className="live-stats" aria-live="polite">
          <div>
            <dt>{t.live.members}</dt>
            <dd>
              <CountUp value={s!.members} />
            </dd>
          </div>
          {show.today && (
            <div>
              <dt>{t.live.today}</dt>
              <dd>
                <CountUp value={s!.joinedToday} />
              </dd>
            </div>
          )}
          {show.raised && (
            <div>
              <dt>
                <Link href={transparencyHref}>{t.live.raised}</Link>
              </dt>
              <dd>
                <CountUp value={s!.raisedNaira} format={formatNaira} />
              </dd>
            </div>
          )}
        </dl>
      ) : (
        <ul className="live-stats live-early" role="list">
          <li>
            <strong>{e.founding}</strong>
            <span>{e.foundingText}</span>
          </li>
          <li>
            <strong>
              <CountUp value={WAVE.wards} /> <small>{e.wards}</small>
            </strong>
            <span>
              {e.wardsText} <Link href={wardsHref}>{e.leader}</Link>
            </span>
          </li>
          <li>
            <strong>
              <CountUp value={days} /> <small>{e.days}</small>
            </strong>
            <span>{e.daysText}</span>
          </li>
        </ul>
      )}
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
          {(show.members ? s?.recent ?? [] : []).slice(0, 5).map((r, i) => (
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

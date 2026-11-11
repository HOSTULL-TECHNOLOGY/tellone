"use client";

import Link from "next/link";
import { useLiveStats } from "@/lib/useLiveStats";
import type { Dict } from "@/i18n";

/** Live member counter band in the footer (Revised Website Menu, Footer; WEB-2). */
export function FooterCounter({ t, joinHref }: { t: Dict; joinHref: string }) {
  const s = useLiveStats();
  const latest = s?.recent[0];
  return (
    <div className="footer-counter">
      <div className="container footer-counter-row" aria-live="polite">
        {s ? (
          <p>
            <strong className="footer-counter-num">{s.members.toLocaleString("en-NG")}</strong> {t.footer.membersBand}
            <span aria-hidden> · </span>
            <strong>{s.joinedToday.toLocaleString("en-NG")}</strong> {t.footer.joinedToday}
            {latest && (
              <>
                <span aria-hidden> · </span>
                <span>
                  {latest.firstName} {t.live.joinedFrom} {latest.state}
                </span>
              </>
            )}
            {s.demo && (
              <span className="chip chip-demo" title={t.common.demoTitle}>
                {t.common.demo}
              </span>
            )}
          </p>
        ) : (
          <p className="muted">{t.live.refresh}</p>
        )}
        <Link href={joinHref} className="btn btn-primary btn-sm">
          {t.topbar.join}
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { site } from "@/config/site";
import type { Dict } from "@/i18n";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="currentColor" d="M4.6 2.3 13.4 12l-8.8 9.7c-.4-.2-.6-.7-.6-1.2V3.5c0-.5.2-1 .6-1.2Zm10 8.5 2.4-2.5 3.3 1.9c1 .6 1 1.9 0 2.5l-3.3 1.9-2.4-2.5L13.7 12l.9-1.2ZM5.8 1.6l10 5.7-2.2 2.3L5.8 1.6Zm7.8 12.8 2.2 2.3-10 5.7 7.8-8Z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3 0 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5.9-1.4 1.3-2.8 1.3-2.9 0 0-2.6-1-2.6-4Zm-2.5-7.6c.7-.8 1.2-2 1-3.2-1 0-2.2.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.3-.6 3-1.4Z" />
    </svg>
  );
}

/**
 * App store badges (WEB-8). Store URLs are pending until the apps launch (10 Nov 2026);
 * until then the badges link to /app and say so, rather than pointing at a guessed listing.
 */
export function StoreBadges({ t, appHref, compact = false }: { t: Dict["app"]; appHref: string; compact?: boolean }) {
  const items = [
    { key: "android", label: t.googlePlay, url: site.apps.android, icon: <PlayIcon /> },
    { key: "ios", label: t.appStore, url: site.apps.ios, icon: <AppleIcon /> },
  ];
  return (
    <div className={`store-badges${compact ? " store-badges-compact" : ""}`}>
      <div className="store-badges-row">
        {items.map((b) =>
          b.url ? (
            <a key={b.key} className="store-badge" href={b.url} rel="noopener" target="_blank">
              {b.icon}
              <span>{b.label}</span>
            </a>
          ) : (
            <Link key={b.key} className="store-badge" href={appHref} aria-describedby="badge-pending">
              {b.icon}
              <span>{b.label}</span>
            </Link>
          ),
        )}
      </div>
      {(!site.apps.android || !site.apps.ios) && (
        <p id="badge-pending" className="small muted">
          {t.badgePending}
        </p>
      )}
    </div>
  );
}

"use client";

import { href, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Gift, LogIn } from "lucide-react";
import { useSession } from "@/lib/auth";
import { phaseAt, promotionsAllowed } from "@/lib/campaign";
import { readPref, writePref } from "@/lib/prefs";
import { Notice } from "@/components/ui/Page";
import { simulate } from "@/components/ui/Form";
import { DEMO_MODE } from "@/config/site";

const KEY = "tbh-giveaway-entries";
const today = () => new Date(Date.now() + 3_600_000).toISOString().slice(0, 10); // WAT date

type Entry = { userId: string; day: string; ref: string; at: string };
function readEntries(): Entry[] {
  try {
    const v = JSON.parse(readPref(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/**
 * Daily giveaway entry (NC-9, MB-5). One free entry per member per day. Never conditioned on voting,
 * PVC or polling-unit data (GR-2). Closes automatically at the campaign cut-off (GR-3).
 * PROTOTYPE: entries are stored in this browser; production draws are recorded server-side.
 */
export function GiveawayEntry({ locale }: { locale: Locale }) {
  const { ready, user } = useSession();
  const [closed, setClosed] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("phase");
    const phase = DEMO_MODE && forced ? (forced as ReturnType<typeof phaseAt>) : phaseAt();
    setClosed(!promotionsAllowed(phase));
    setEntries(readEntries());
  }, []);

  if (closed)
    return (
      <Notice tone="info" title="The daily giveaway has ended">
        Giveaways stopped at 11:59 pm on Thursday 14 January 2027, 24 hours before polls open, as the Electoral Act requires.
      </Notice>
    );
  if (!ready) return <div className="gv-entry" aria-busy="true" />;

  const mine = user ? entries.filter((e) => e.userId === user.id) : [];
  const todays = mine.find((e) => e.day === today());

  return (
    <div className="gv-entry" id="enter">
      {!user ? (
        <>
          <p>Entry is free for members. Sign in or join to enter today&apos;s draw.</p>
          <div className="form-actions">
            <Link href={`${href(locale, "/login")}?next=${encodeURIComponent(href(locale, "/giveaway"))}`} className="btn btn-primary">
              <LogIn size={16} aria-hidden /> Sign in to enter
            </Link>
            <Link href={href(locale, "/join")} className="btn btn-outline">
              Join free
            </Link>
          </div>
        </>
      ) : todays ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={22} aria-hidden />
          <div>
            <strong>You&apos;re in today&apos;s draw, {user.firstName}.</strong>
            <div className="small">
              Entry reference {todays.ref}. Come back tomorrow for another free entry.
            </div>
          </div>
        </div>
      ) : (
        <>
          <p>
            Signed in as <strong>{user.firstName}</strong>. One free entry per member per day.
          </p>
          <label className="check">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
            <span>I have read the rules. I understand entry does not depend on how I vote, my voter&apos;s card or my polling unit.</span>
          </label>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={!confirm || busy}
            onClick={async () => {
              setBusy(true);
              await simulate();
              const e: Entry = { userId: user.id, day: today(), ref: `GVW-${today().replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`, at: new Date().toISOString() };
              const all = [e, ...readEntries()];
              writePref(KEY, JSON.stringify(all));
              setEntries(all);
              setBusy(false);
            }}
          >
            <Gift size={18} aria-hidden /> {busy ? "Entering…" : "Enter today's giveaway"}
          </button>
        </>
      )}
      {user && mine.length > 0 && (
        <div className="gv-history">
          <h3>Your entries</h3>
          <ul role="list">
            {mine.slice(0, 7).map((e) => (
              <li key={e.ref}>
                <span>{new Date(e.day).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
                <span className="muted">{e.ref}</span>
                <span className="badge badge-muted">Draw pending</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

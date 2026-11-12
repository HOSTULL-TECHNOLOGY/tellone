"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clock, Upload, X } from "lucide-react";
import { quiz, vision, waLink } from "@/data/careers";
import { site } from "@/config/site";
import { useSession } from "@/lib/auth";
import { readPref, writePref } from "@/lib/prefs";
import { useToast } from "@/components/ui/Toast";

/**
 * Vision Points (CAR-26 to CAR-31): the live Vision Meter. Signed-out visitors see the sample meter from the
 * document; members get working tiles (follow → proof → pending → verified), the non-social route and the quiz.
 * SIMULATED: proofs are "checked" in the browser after a few seconds; production uses the review queue (CAR-29).
 */
type TileState = "none" | "followed" | "checking" | "verified" | "unclear" | "removed";
type VState = { consent: boolean; tiles: Partial<Record<string, TileState>>; handles: Partial<Record<string, string>>; channel: boolean; events: number; quiz: "none" | "passed" | "failed-once" | "failed"; invites: number };
const EMPTY: VState = { consent: false, tiles: {}, handles: {}, channel: false, events: 0, quiz: "none", invites: 0 };
const key = (uid: string) => `tbh-vision:${uid}`;

export function readVision(uid: string): VState {
  try {
    return { ...EMPTY, ...JSON.parse(readPref(key(uid)) ?? "{}") };
  } catch {
    return EMPTY;
  }
}

/** Points: verified social + bonus + other actions; pending is shown separately. Total counts up to 100. */
export function visionTotals(v: VState) {
  let verified = 0;
  let pending = 0;
  let followed = 0;
  for (const p of vision.platforms) {
    const s = v.tiles[p.key];
    if (s === "verified") {
      verified += p.points;
      followed++;
    } else if (s === "checking") pending += p.points;
  }
  if (followed === vision.platforms.length) verified += vision.bonus.points;
  const other = (v.channel ? 10 : 0) + Math.min(v.events, 2) * 15 + (v.quiz === "passed" ? 20 : 0) + Math.min(v.invites, 4) * 5;
  const raw = verified + other;
  return { verified: Math.min(100, raw), pending: Math.min(pending, Math.max(0, 100 - Math.min(100, raw))), followed, extra: Math.max(0, raw - 100) };
}
export const levelFor = (n: number) => vision.levels.find((l) => n >= l.min && n <= l.max) ?? vision.levels[0];
const strengthFor = (n: number) => (n >= 100 ? "Excellent" : n >= 75 ? "Very strong" : n >= 50 ? "Strong" : n >= 25 ? "Good" : "Fair");

export function VisionMeter({ registerHref, eventsHref }: { registerHref: string; eventsHref: string }) {
  const { ready, user } = useSession();
  const toast = useToast();
  const [v, setV] = useState<VState>(EMPTY);
  const [proofFor, setProofFor] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  useEffect(() => {
    if (user) setV(readVision(user.id));
  }, [user]);
  const save = useCallback(
    (next: VState) => {
      setV(next);
      if (user) writePref(key(user.id), JSON.stringify(next));
    },
    [user],
  );

  // Simulated review: "checking" tiles are verified a few seconds later
  useEffect(() => {
    const checking = Object.entries(v.tiles).filter(([, s]) => s === "checking");
    if (!checking.length) return;
    const t = window.setTimeout(() => {
      const next = { ...v, tiles: { ...v.tiles } };
      for (const [k] of checking) next.tiles[k] = "verified";
      const before = levelFor(visionTotals(v).verified).name;
      const tot = visionTotals(next).verified;
      const p = vision.platforms.find((x) => x.key === checking[0][0])!;
      save(next);
      const lvl = levelFor(tot);
      toast(tot >= 100 ? vision.copy.full : lvl.name !== before ? vision.copy.levelUp(lvl.name, tot) : vision.copy.toast(p.points, p.name, lvl.name, tot));
    }, 3500);
    return () => window.clearTimeout(t);
  }, [v, save, toast]);

  const tot = useMemo(() => visionTotals(v), [v]);

  if (!ready) return <div className="vm vm-loading" aria-busy="true" />;

  if (!user)
    return (
      <div className="vm vm-sample">
        <div className="vm-head">
          <h3>{vision.panelTitle}</h3>
          <p>{vision.panelText}</p>
        </div>
        <Meter verified={28} pending={10} />
        <p className="vm-line">
          <strong>Meter (live, sample):</strong> {vision.sampleMeter}
        </p>
        <p className="vm-line">
          <strong>Application strength (sample):</strong> {vision.sampleStrength}
        </p>
        <p className="small muted">{vision.pendingNote}</p>
        <Link href={registerHref} className="btn btn-primary">
          Register free to start earning
        </Link>
      </div>
    );

  const meterTotal = tot.verified + tot.pending;
  const level = levelFor(meterTotal);
  const nextLevel = vision.levels.find((l) => l.min > meterTotal);
  const follows = nextLevel ? Math.ceil((nextLevel.min - meterTotal) / 10) : 0;

  return (
    <div className="vm">
      <div className="vm-head">
        <h3>{vision.panelTitle}</h3>
        <p>{vision.panelText}</p>
      </div>
      <Meter verified={tot.verified} pending={tot.pending} />
      <p className="vm-line" aria-live="polite">
        Your Vision Meter: <strong>{meterTotal} / 100</strong> · Level: <strong>{level.name}</strong> · {tot.followed} of {vision.platforms.length} platforms followed · {tot.pending} points pending
      </p>
      <p className="vm-line">
        Application strength: <strong>{strengthFor(meterTotal)}</strong>
        {nextLevel && follows > 0 ? ` · Tip: ${vision.copy.nudge(follows, nextLevel.name)}` : ` · ${level.message}`}
      </p>
      {tot.extra > 0 && <p className="small">+{tot.extra} points above 100 were added to your Impact Points.</p>}

      <label className="vm-consent">
        <input type="checkbox" checked={v.consent} onChange={(e) => save(e.target.checked ? { ...v, consent: true } : { ...v, consent: false, tiles: {}, handles: {} })} />
        <span>{vision.copy.consent}</span>
      </label>

      <ul className="vm-tiles" role="list" aria-label="Official accounts">
        {vision.platforms.map((p) => {
          const s = v.tiles[p.key] ?? "none";
          const url = site.social[p.key] ?? "#";
          return (
            <li key={p.key} className={`vm-tile vm-${s}`}>
              <div>
                <strong>{p.name}</strong>
                <span className="small muted">
                  {p.account} · +{p.points} points
                </span>
              </div>
              {!v.consent ? (
                <span className="small muted">Tick the consent box to start</span>
              ) : s === "none" || s === "removed" ? (
                <a
                  className="btn btn-sm btn-primary"
                  href={url}
                  target="_blank"
                  rel="noopener"
                  onClick={() => save({ ...v, tiles: { ...v.tiles, [p.key]: "followed" } })}
                >
                  Follow
                </a>
              ) : s === "followed" || s === "unclear" ? (
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setProofFor(p.key)}>
                  <Upload size={14} aria-hidden /> I’ve followed · Upload proof
                </button>
              ) : s === "checking" ? (
                <span className="vm-state">
                  <Clock size={14} aria-hidden /> Checking… +{p.points} pending
                </span>
              ) : (
                <span className="vm-state vm-ok">
                  <Check size={14} aria-hidden /> Verified · +{p.points} points
                </span>
              )}
              {s === "unclear" && <p className="small vm-warn">{vision.tileStates[4][1]}</p>}
              {s === "removed" && <p className="small vm-warn">{vision.tileStates[5][1]}</p>}
            </li>
          );
        })}
      </ul>

      <h4 className="vm-sub">Other ways to earn Vision Points (for everyone, up to 80)</h4>
      <ul className="vm-other" role="list">
        <li>
          <span>Join the TBH One WhatsApp Channel · +10</span>
          {v.channel ? (
            <span className="vm-state vm-ok">
              <Check size={14} aria-hidden /> Joined
            </span>
          ) : (
            <a className="btn btn-sm btn-outline" href={waLink("JOIN CHANNEL")} target="_blank" rel="noopener" onClick={() => save({ ...v, channel: true })}>
              Join the Channel
            </a>
          )}
        </li>
        <li>
          <span>Attend a TBH One event or village meeting · +15 (up to 2)</span>
          <span className="vm-state">
            {Math.min(v.events, 2)} of 2 checked in · <Link href={eventsHref}>Find an event</Link>{" "}
            {v.events < 2 && (
              <button type="button" className="linklike small" onClick={() => save({ ...v, events: v.events + 1 })}>
                Demo: check in
              </button>
            )}
          </span>
        </li>
        <li>
          <span>Pass the Vision Quiz (8 of 10 correct) · +20</span>
          {v.quiz === "passed" ? (
            <span className="vm-state vm-ok">
              <Check size={14} aria-hidden /> Passed
            </span>
          ) : v.quiz === "failed" ? (
            <span className="vm-state">No retakes left</span>
          ) : (
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setQuizOpen(true)}>
              {v.quiz === "failed-once" ? "Retake the quiz (last try)" : "Take the quiz"}
            </button>
          )}
        </li>
        <li>
          <span>Invite a friend who registers as a member · +5 (up to 4)</span>
          <span className="vm-state">
            {Math.min(v.invites, 4)} of 4 ·{" "}
            <a href={`https://wa.me/?text=${encodeURIComponent(`Join TBH One free and lead your ward: https://${site.domain}/careers?ref=${user.id}`)}`} target="_blank" rel="noopener">
              Share your invite link
            </a>{" "}
            {v.invites < 4 && (
              <button type="button" className="linklike small" onClick={() => save({ ...v, invites: v.invites + 1 })}>
                Demo: a friend registered
              </button>
            )}
          </span>
        </li>
      </ul>
      <p className="small muted">{vision.copy.offline}</p>
      <p className="small muted">{vision.copy.fairness}</p>

      {proofFor && (
        <ProofForm
          platform={vision.platforms.find((p) => p.key === proofFor)!}
          initialHandle={v.handles[proofFor] ?? ""}
          onCancel={() => setProofFor(null)}
          onSubmit={(handle, unclear) => {
            const p = vision.platforms.find((x) => x.key === proofFor)!;
            save({ ...v, handles: { ...v.handles, [proofFor]: handle }, tiles: { ...v.tiles, [proofFor]: unclear ? "unclear" : "checking" } });
            setProofFor(null);
            toast(unclear ? vision.tileStates[4][1] : `Thanks, ${user.firstName}! Your ${p.name} follow is being checked. +${p.points} pending points are on your Vision Meter.`);
          }}
        />
      )}
      {quizOpen && (
        <Quiz
          onClose={() => setQuizOpen(false)}
          onDone={(score) => {
            const passed = score >= 8;
            save({ ...v, quiz: passed ? "passed" : v.quiz === "failed-once" ? "failed" : "failed-once" });
            setQuizOpen(false);
            toast(passed ? `You passed the Vision Quiz (${score}/10): +20 Vision Points.` : `You scored ${score}/10. You need 8 to pass.${v.quiz === "none" ? " You have one retake." : ""}`);
          }}
        />
      )}
    </div>
  );
}

function Meter({ verified, pending }: { verified: number; pending: number }) {
  const total = Math.min(100, verified + pending);
  return (
    <div className="vm-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={total} aria-label={`Vision Meter ${total} out of 100, ${pending} pending`}>
      <span className="vm-fill" style={{ width: `${verified}%` }} />
      <span className="vm-pending" style={{ left: `${verified}%`, width: `${Math.min(pending, 100 - verified)}%` }} />
      {[25, 50, 75].map((m) => (
        <i key={m} style={{ left: `${m}%` }} aria-hidden />
      ))}
      <b>{total}</b>
    </div>
  );
}

function ProofForm({ platform, initialHandle, onCancel, onSubmit }: { platform: { name: string }; initialHandle: string; onCancel: () => void; onSubmit: (handle: string, unclear: boolean) => void }) {
  const [handle, setHandle] = useState(initialHandle);
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");
  return (
    <form
      className="vm-proof"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^@?[\w.]{2,30}$/.test(handle.trim())) return setErr("Enter your username, for example @yourname.");
        if (!file) return setErr("Upload a screenshot as proof.");
        // Prototype check: a tiny image cannot show the username and the Following button
        onSubmit(handle.trim(), file.size < 4000);
      }}
    >
      <p>
        <strong>{platform.name}:</strong> {vision.copy.proof}
      </p>
      <label>
        <span>{vision.copy.handle(platform.name)}</span>
        <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourname" />
      </label>
      <label>
        <span>Screenshot</span>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      {err && <p className="field-error">{err}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-sm">
          Submit proof
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          <X size={14} aria-hidden /> Cancel
        </button>
      </div>
    </form>
  );
}

/** The 10-question Vision Quiz; answer order is shuffled so the right answer is not always first. */
function Quiz({ onClose, onDone }: { onClose: () => void; onDone: (score: number) => void }) {
  const order = useMemo(() => quiz.map((q, i) => q.options.map((_, j) => j).sort((a, b) => ((a * 7 + i * 3) % 5) - ((b * 7 + i * 3) % 5))), []);
  const [ans, setAns] = useState<(number | null)[]>(quiz.map(() => null));
  return (
    <form
      className="vm-quiz"
      onSubmit={(e) => {
        e.preventDefault();
        onDone(ans.filter((a, i) => a === quiz[i].answer).length);
      }}
    >
      <h4>The Vision Quiz · 10 questions · 8 correct to pass</h4>
      <ol>
        {quiz.map((q, i) => (
          <li key={q.q}>
            <fieldset>
              <legend>{q.q}</legend>
              {order[i].map((j) => (
                <label key={j}>
                  <input type="radio" name={`q${i}`} checked={ans[i] === j} onChange={() => setAns(ans.map((a, k) => (k === i ? j : a)))} required />
                  <span>{q.options[j]}</span>
                </label>
              ))}
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Submit answers
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

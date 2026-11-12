"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { messages } from "@/data/careers";
import { readPref, writePref } from "@/lib/prefs";
import { useToast } from "@/components/ui/Toast";

/** Ward leader training (CAR-9): four modules, two hours in total; finishing them issues the leader ID (simulated). */
export const MODULES = [
  { title: "Event safety", mins: 35, points: ["The safety checklist: police notified, marshals assigned, exits mapped", "No children without parents, and never paid attendance", "Check in on the app during every event; never work alone", "What to do if something goes wrong: Report a Concern and the toll-free line"] },
  { title: "Vetting street leaders", mins: 30, points: ["One street leader per street; they must live on the street they lead", "Check ID and meet in person with another leader present", "Endorse only people you know; the Code of Conduct comes first", "Never ask how anyone will vote or for their PVC number"] },
  { title: "Approvals", mins: 25, points: ["Review task proof: photo, location and count", "Approve or query within 48 hours", "You cannot approve your own fee claims; a different person approves and releases every payment", "Fees are for work done, never linked to votes, PVCs or polling units"] },
  { title: "Project management", mins: 30, points: ["Propose a project with a clear budget, e.g. a borehole repair or a clinic clean-up", "Manage it once funded and keep receipts", "Upload proof of delivery: 5% of the delivered value, up to ₦50,000, is your fee", "Report progress to funders on the project page"] },
];

export function LeaderTraining() {
  const [done, setDone] = useState<boolean[]>(MODULES.map(() => false));
  const toast = useToast();
  useEffect(() => {
    try {
      const v = JSON.parse(readPref("tbh-leader-training") ?? "[]");
      if (Array.isArray(v) && v.length === MODULES.length) setDone(v);
    } catch {}
  }, []);
  const mark = (i: number) => {
    const next = done.map((d, j) => (j === i ? true : d));
    setDone(next);
    writePref("tbh-leader-training", JSON.stringify(next));
    if (next.every(Boolean)) toast(messages.trained);
  };
  const total = MODULES.reduce((a, m) => a + m.mins, 0);
  const finished = done.every(Boolean);
  return (
    <div className="lt">
      <p className="lt-progress" aria-live="polite">
        {done.filter(Boolean).length} of {MODULES.length} modules complete · {total / 60} hours in total
      </p>
      <ol className="lt-mods" role="list">
        {MODULES.map((m, i) => (
          <li key={m.title} className={done[i] ? "is-done" : ""}>
            <div className="lt-head">
              {done[i] ? <CheckCircle2 size={22} aria-hidden /> : <Circle size={22} aria-hidden />}
              <h3>
                {i + 1}. {m.title}
              </h3>
              <span className="small muted">{m.mins} minutes</span>
            </div>
            <ul className="cw-list">
              {m.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {!done[i] && (
              <button type="button" className="btn btn-sm btn-primary" onClick={() => mark(i)}>
                Complete this module
              </button>
            )}
          </li>
        ))}
      </ol>
      {finished && (
        <div className="lt-done" role="status">
          <CheckCircle2 size={28} aria-hidden />
          <p>
            <strong>{messages.trained}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

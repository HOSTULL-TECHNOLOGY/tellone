"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { messages, WAVE } from "@/data/careers";
import { readApplications, saveApplication, type Application } from "@/lib/wards";
import type { DemoUser } from "@/lib/auth";
import { Tracker } from "./ApplyFlow";
import { readVision, visionTotals, levelFor } from "./VisionMeter";

/**
 * Member dashboard: "Apply to be a Ward Leader" (CAR-10, CAR-11). Shows the progress tracker from Registered to
 * Recruit street leaders, with the SMS / WhatsApp messages sent at each step. "Next step" simulates the state team.
 */
const stageMessages = (a: Application, name: string): { at: number; text: string; out?: boolean }[] => {
  const fill = (m: string) => m.replace(/\{name\}/g, name).replace(/\{ref\}/g, a.ref).replace(/\{ward\}/g, a.ward.name);
  const list: { at: number; text: string; out?: boolean }[] = [{ at: 1, text: fill(messages.received) }];
  if (a.stage >= 3) list.push({ at: 3, text: `Good news, ${name}: you’ve been shortlisted for ${a.ward.name}. Your state team will call you to check your ID, endorser and payment details. TBH One never asks for money.` });
  if (a.stage >= 4) list.push({ at: 4, text: fill(messages.approved) });
  if (a.stage >= 6) list.push({ at: 6, text: messages.trained });
  return list;
};

export function WardLeaderStatus({ user, applyHref, boostHref, trainingHref }: { user: DemoUser; applyHref: string; boostHref: string; trainingHref: string }) {
  const [app, setApp] = useState<Application | null>(null);
  const [vp, setVp] = useState(0);
  useEffect(() => {
    setApp(readApplications().find((a) => a.userId === user.id) ?? null);
    setVp(visionTotals(readVision(user.id)).verified);
  }, [user.id]);
  const open = WAVE.wards - WAVE.filledSample;

  if (!app)
    return (
      <section className="dpanel wls">
        <div className="dpanel-head"><h2>Apply to be a Ward Leader</h2></div>
        <p>
          Wave 1 is recruiting one ward leader for each of the 8,809 wards. {open.toLocaleString("en-NG")} wards still need a leader. Your details are already filled in; the application takes 10 minutes.
        </p>
        <div className="form-actions">
          <Link href={applyHref} className="btn btn-primary">
            Apply to be a Ward Leader
          </Link>
          <Link href={boostHref} className="btn btn-outline">
            Boost your chances: Vision Meter {vp} / 100 ({levelFor(vp).name})
          </Link>
        </div>
        <div className="wls-msgs">
          <p className="small muted">Reminders we send if you have registered but not applied</p>
          <ul className="ap-msgs" role="list">
            <li>
              {messages.nudge24h.replace("{name}", user.firstName)}
              <time>After 24 hours</time>
            </li>
            <li>
              {messages.nudge3d.replace("{name}", user.firstName)}
              <time>After 3 days</time>
            </li>
          </ul>
        </div>
      </section>
    );

  const advance = () => {
    const next = { ...app, stage: Math.min(app.stage + 1, 6) };
    saveApplication(next);
    setApp(next);
  };
  return (
    <section className="dpanel wls">
      <div className="dpanel-head"><h2>Your ward leader application</h2></div>
      <p>
        <strong>{app.ref}</strong> · {app.ward.name} ward, {app.ward.lga}, {app.ward.stateName} {app.hours ? <>· {app.hours}</> : null}
      </p>
      <Tracker stage={app.stage} />
      <ul className="ap-msgs" role="list" aria-label="Messages sent to you">
        {stageMessages(app, user.firstName).map((m, i) => (
          <li key={i} className={m.out ? "is-out" : ""}>
            {m.text}
            <time>{["", "Application received", "", "Shortlisted", "Verified and approved", "", "Training complete"][m.at]}</time>
          </li>
        ))}
      </ul>
      <div className="form-actions">
        {app.stage === 4 && (
          <Link href={trainingHref} className="btn btn-primary">
            Start your 2-hour training
          </Link>
        )}
        {app.stage < 6 && (
          <button type="button" className="btn btn-outline btn-sm" onClick={advance}>
            Demo: next step ({["", "", "", "state team shortlists you", "verification call done, approved", "training complete", "leader ID issued"][app.stage + 1]})
          </button>
        )}
        <Link href={boostHref} className="btn btn-ghost btn-sm">
          Vision Meter: {vp} / 100
        </Link>
      </div>
    </section>
  );
}

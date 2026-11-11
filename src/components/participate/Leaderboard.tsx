"use client";

import { useEffect, useState } from "react";
import { readPref, writePref } from "@/lib/prefs";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";

type Row = { firstName: string; state: string; points: number };

/** Opt-in leaderboard: shows first name and state only. Members choose whether to appear. */
export function Leaderboard({ rows }: { rows: Row[] }) {
  const { user } = useSession();
  const [optIn, setOptIn] = useState(false);
  const toast = useToast();
  useEffect(() => setOptIn(readPref("tbh-leaderboard-optin") === "1"), []);
  const me: Row | null = user && optIn ? { firstName: user.firstName, state: user.state, points: 100 } : null;
  const all = [...rows, ...(me ? [me] : [])].sort((a, b) => b.points - a.points);
  return (
    <div className="stack">
      <span className="chip chip-demo">Demo data</span>
      <table className="rate-table">
        <caption className="sr-only">Impact Points leaderboard, this month</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Member</th>
            <th scope="col">State</th>
            <th scope="col" className="num">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {all.map((r, i) => (
            <tr key={r.firstName + r.state} aria-current={r === me ? "true" : undefined}>
              <td>{i + 1}</td>
              <td>
                {r.firstName}
                {r === me && <span className="badge badge-ok"> You</span>}
              </td>
              <td>{r.state}</td>
              <td className="num">{r.points.toLocaleString("en-NG")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {user ? (
        <label className="choice">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => {
              setOptIn(e.target.checked);
              writePref("tbh-leaderboard-optin", e.target.checked ? "1" : null);
              toast(e.target.checked ? "You now appear on the leaderboard (first name and state only)" : "You are hidden from the leaderboard");
            }}
          />
          <span>Show me on the leaderboard (first name and state only)</span>
        </label>
      ) : (
        <p className="small muted">Members choose whether to appear. The leaderboard never shows surnames, phone numbers or wards.</p>
      )}
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { SubmitButton, simulate } from "@/components/ui/Form";
import { leaderRegister, LEADER_ID_PATTERN, type LeaderRecord } from "@/data/leader-ids";

type Result = { kind: "valid"; rec: LeaderRecord } | { kind: "invalid"; rec?: LeaderRecord; reason: string } | { kind: "unknown"; id: string };

/** Checks a leader ID against the (demo) register: valid, invalid (bad format, suspended or expired) or unknown. */
export function LeaderIdCheck() {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function check(e: FormEvent) {
    e.preventDefault();
    const id = value.trim().toUpperCase().replace(/\s+/g, "");
    if (!id) {
      setError("Enter a leader ID, for example TBH-LDR-00042.");
      setResult(null);
      return;
    }
    setError("");
    setBusy(true);
    await simulate(500);
    setBusy(false);
    if (!LEADER_ID_PATTERN.test(id)) return setResult({ kind: "invalid", reason: "This is not a TBH One leader ID format. Real IDs look like TBH-LDR- followed by five digits." });
    const rec = leaderRegister.find((r) => r.id === id);
    if (!rec) return setResult({ kind: "unknown", id });
    if (rec.status !== "Active") return setResult({ kind: "invalid", rec, reason: `This ID is ${rec.status.toLowerCase()}. The holder is not currently authorised to act for TBH One.` });
    setResult({ kind: "valid", rec });
  }

  return (
    <div>
      <form onSubmit={check} noValidate style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        <div className="field" style={{ flex: "1 1 240px" }}>
          <label htmlFor="leader-id">Leader ID</label>
          <input
            id="leader-id"
            className="input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="TBH-LDR-00042"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-invalid={!!error}
            aria-describedby={error ? "leader-id-e" : "leader-id-h"}
          />
          {error ? (
            <p id="leader-id-e" className="field-error">{error}</p>
          ) : (
            <p id="leader-id-h" className="field-hint">Printed on the leader&apos;s ID card and shown in their app profile.</p>
          )}
        </div>
        <SubmitButton busy={busy}>Check ID</SubmitButton>
      </form>
      <div aria-live="polite" style={{ marginTop: 16 }}>
        {result?.kind === "valid" && (
          <div className="verify-result valid">
            <CheckCircle2 size={24} aria-hidden />
            <div>
              <strong>Valid: {result.rec.id}</strong>
              <p style={{ margin: "4px 0 0" }}>
                Active {result.rec.role.toLowerCase()}, {result.rec.area}. A valid ID never entitles anyone to collect money from you in cash or to a personal account.
              </p>
            </div>
          </div>
        )}
        {result?.kind === "invalid" && (
          <div className="verify-result invalid">
            <XCircle size={24} aria-hidden />
            <div>
              <strong>Not valid{result.rec ? `: ${result.rec.id}` : ""}</strong>
              <p style={{ margin: "4px 0 0" }}>{result.reason} Do not pay or share personal details. Please report it.</p>
            </div>
          </div>
        )}
        {result?.kind === "unknown" && (
          <div className="verify-result unknown">
            <HelpCircle size={24} aria-hidden />
            <div>
              <strong>Unknown: {result.id}</strong>
              <p style={{ margin: "4px 0 0" }}>This ID is in the right format but is not on the register. Treat the person with caution until confirmed, and report it if they ask for money.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

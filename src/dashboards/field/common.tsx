"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { readPref, writePref } from "@/lib/prefs";
import { AuditList, Panel } from "@/components/dashboard/kit";
import "@/styles/dash-field.css";

/** State persisted in localStorage so prototype actions survive reloads. */
export function usePersisted<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = readPref(key);
      if (raw !== null) setV(JSON.parse(raw));
    } catch {
      /* ignore corrupt value */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (next: T | ((p: T) => T)) =>
      setV((prev) => {
        const val = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writePref(key, JSON.stringify(val));
        return val;
      }),
    [key],
  );
  return [v, set];
}

export type AuditItem = { at: string; who: string; what: string };
const stamp = () => new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** Visible audit trail for important actions (SH-14). */
export function useAudit(key: string, who: string, seed: AuditItem[] = []) {
  const [items, setItems] = usePersisted<AuditItem[]>(`tbh-audit-${key}`, seed);
  const log = useCallback((what: string) => setItems((p) => [{ at: stamp(), who, what }, ...p].slice(0, 40)), [setItems, who]);
  return { items, log };
}
export function AuditPanel({ items, title = "Audit log" }: { items: AuditItem[]; title?: string }) {
  return (
    <Panel title={title}>
      {items.length ? <AuditList items={items} /> : <p className="muted small">No actions recorded yet.</p>}
      <p className="small muted">Every create, edit, approve and pay action is logged and visible to administrators (SH-14).</p>
    </Panel>
  );
}

/** Trigger a real file download from the browser. */
export function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function toCsv(rows: Record<string, string | number>[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export const fmtDate = (iso: string, time = false) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: time ? undefined : "numeric", hour: time ? "2-digit" : undefined, minute: time ? "2-digit" : undefined, timeZone: "Africa/Lagos" });

export function DemoTag() {
  return <span className="chip chip-demo">Demo data</span>;
}

export function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="fstat">
      <span className="fstat-label">{label}</span>
      <span className="fstat-value">{children}</span>
    </div>
  );
}

/** A tick list where every item must be checked (used for safety checklists and gates). */
export function Checklist({ items, value, onChange, legend }: { items: string[]; value: string[]; onChange: (v: string[]) => void; legend: string }) {
  return (
    <fieldset className="plain">
      <legend>{legend}</legend>
      {items.map((it) => (
        <label key={it} className="check">
          <input type="checkbox" checked={value.includes(it)} onChange={(e) => onChange(e.target.checked ? [...value, it] : value.filter((x) => x !== it))} />
          <span>{it}</span>
        </label>
      ))}
    </fieldset>
  );
}

/** Placeholder "photo" for demo proof items (no real photographs are used as evidence). */
export function ProofThumb({ hue, label }: { hue: number; label: string }) {
  return (
    <div className="proof-thumb" style={{ ["--h" as string]: hue }} role="img" aria-label={label}>
      <span>Demo proof photo</span>
    </div>
  );
}

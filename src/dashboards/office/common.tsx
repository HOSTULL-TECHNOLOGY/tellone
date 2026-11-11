"use client";

import { useCallback, useEffect, useState } from "react";
import { readPref, writePref } from "@/lib/prefs";

/** React state persisted in localStorage (prototype). Reads after mount to avoid hydration mismatches. */
export function usePersisted<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = readPref(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* keep initial */
    }
    setReady(true);
  }, [key]);
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        writePref(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );
  return [value, set, ready] as const;
}

export type AuditEntry = { at: string; who: string; what: string };

/** Append-only audit log per dashboard (SH-14). */
export function useAudit(key: string, seed: AuditEntry[] = []) {
  const [log, setLog] = usePersisted<AuditEntry[]>(key, seed);
  const add = useCallback((who: string, what: string) => setLog((l) => [{ at: stamp(), who, what }, ...l].slice(0, 200)), [setLog]);
  return [log, add] as const;
}

export function stamp(d = new Date()) {
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });
}

/** Ticking clock so countdowns update live. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

export function fmtDuration(ms: number) {
  const neg = ms < 0;
  const a = Math.abs(ms);
  const d = Math.floor(a / 86_400_000);
  const h = Math.floor((a % 86_400_000) / 3_600_000);
  const m = Math.floor((a % 3_600_000) / 60_000);
  const s = Math.floor((a % 60_000) / 1000);
  const body = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m ${String(s).padStart(2, "0")}s`;
  return neg ? `${body} overdue` : body;
}

/** Client-side CSV download (no server needed). */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
export const daysAgo = (d: number) => hoursAgo(d * 24);
export const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
export const shortDateTime = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });

/** EC-10 / GR-1: electoral terms that may never appear in coupons, targeting or member data. */
const ELECTORAL = /\b(vot(e|es|ed|er|ers|ing)|pvc|permanent voter|voter'?s? card|polling|ballot|inec|election day)\b/i;
export const mentionsElectoral = (s: string) => ELECTORAL.test(s);

/** Short naira for KPI tiles (large display type): ₦515k, ₦7.32m. Give the exact figure in the tile's sub-line. */
export const nairaShort = (n: number) => (Math.abs(n) >= 1e6 ? `₦${(n / 1e6).toFixed(2)}m` : Math.abs(n) >= 1e5 ? `₦${Math.round(n / 1e3)}k` : `₦${Math.round(n).toLocaleString("en-NG")}`);

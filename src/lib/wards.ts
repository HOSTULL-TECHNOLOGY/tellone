"use client";

import { readPref, writePref } from "./prefs";
import { states } from "@/data/states";

/**
 * Ward finder logic (CAR-17 to CAR-22). The 8,809-ward list is loaded only when someone uses the finder
 * (a separate script chunk, so it also works in the offline preview), then searched in the browser.
 */
export type Ward = { id: string; state: string; stateName: string; zone: string; lga: string; name: string; lat: number; lon: number; status: 0 | 1 | 2 };
export type Place = { place: string; kind: string; ward: Ward };

let cache: Promise<{ wards: Ward[]; places: Place[] }> | null = null;

export function loadWards() {
  if (!cache) {
    cache = Promise.all([import("@/data/wards"), import("@/data/landmarks")]).then(([w, l]) => {
      const wards: Ward[] = [];
      const byKey = new Map<string, Ward>();
      for (const [slug, lgas] of Object.entries(w.WARD_DATA)) {
        const st = states.find((s) => s.slug === slug);
        for (const [lga, rows] of lgas)
          for (const [name, la, lo, status, ws] of rows) {
            const ward: Ward = { id: `${slug}/${slugify(lga)}/${ws}`, state: slug, stateName: st?.name ?? slug, zone: st?.zone ?? "", lga, name, lat: la / 1e4, lon: lo / 1e4, status };
            wards.push(ward);
            byKey.set(`${slug}|${lga}|${ws}`, ward);
          }
      }
      const places: Place[] = l.LANDMARKS.map(([place, kind, st, lga, , ws]) => ({ place, kind, ward: byKey.get(`${st}|${lga}|${ws}`)! })).filter((p) => p.ward);
      return { wards, places };
    });
  }
  return cache;
}

export const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Lower-case, no accents, and common spelling variants folded together (Unguwan / Ungwan / Angwan, Sabongari / Sabon Gari). */
export function norm(s: string) {
  return ` ${s} `
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/ (unguwan|unguwar|ungwar|anguwan|angwan|ungwa) /g, " ungwan ")
    .replace(/sabongari/g, "sabon gari")
    .replace(/ +/g, " ")
    .trim();
}

function lev(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const t = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return d[b.length];
}

/** How well a query matches a name: 0 = no match, higher is better. Tolerates one or two typos per word. */
function score(q: string, name: string) {
  const n = norm(name);
  if (!q) return 0;
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(` ${q}`) || n.includes(q)) return 60;
  const qw = q.split(" ");
  const nw = n.split(" ");
  let hit = 0;
  for (const w of qw) if (nw.some((x) => x.startsWith(w) || (w.length >= 5 && lev(w, x.slice(0, w.length)) <= (w.length >= 8 ? 2 : 1)))) hit++;
  return hit === qw.length ? 40 + hit : 0;
}

export type Suggestion = { label: string; detail: string; ward: Ward; kind: "place" | "ward" };

export function search(data: { wards: Ward[]; places: Place[] }, query: string, limit = 8): Suggestion[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const out: (Suggestion & { s: number })[] = [];
  for (const p of data.places) {
    const s = score(q, p.place);
    if (s) out.push({ s: s + 5, kind: "place", label: p.place, detail: `${p.ward.name} ward, ${p.ward.lga}`, ward: p.ward });
  }
  for (const w of data.wards) {
    const s = score(q, w.name);
    if (s) out.push({ s, kind: "ward", label: `${w.name} ward`, detail: `${w.lga}, ${w.stateName}`, ward: w });
  }
  // An LGA name brings up that LGA's first wards so people can narrow down
  if (out.length < limit)
    for (const w of data.wards) if (score(q, w.lga) >= 60 && !out.some((o) => o.ward.id === w.id)) out.push({ s: 30, kind: "ward", label: `${w.name} ward`, detail: `${w.lga}, ${w.stateName}`, ward: w });
  return out.sort((a, b) => b.s - a.s || a.label.localeCompare(b.label)).slice(0, limit);
}

/** Several wards (or places) in different states or LGAs sharing the name the person typed. */
export function sharedName(sugs: Suggestion[]) {
  const top = sugs.filter((s) => s.kind === "ward");
  if (top.length < 2) return null;
  const n = norm(top[0].label);
  const same = top.filter((s) => norm(s.label) === n);
  return same.length > 1 ? top[0].ward.name : null;
}

const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export function nearest(wards: Ward[], at: { lat: number; lon: number }, n = 6) {
  return wards
    .map((w) => ({ w, d: km(at, w) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n);
}

/** Two wards are both plausible when the location is about as close to each (ward points are centres, not outlines). */
export function nearBoundary(near: { w: Ward; d: number }[]) {
  if (near.length < 2) return null;
  const [a, b] = near;
  return b.d - a.d < 0.25 && b.d < 3 ? [a.w, b.w] : null;
}

export const neighbours = (wards: Ward[], w: Ward, n = 3) =>
  nearest(
    wards.filter((x) => x.state === w.state && x.id !== w.id),
    w,
    n,
  ).map((x) => x.w);

/* ----------------------------------------------------------- what the visitor found or applied for (this browser) */
const FOUND = "tbh-ward-found";
const APPS = "tbh-wl-applications";
export type FoundWard = { id: string; name: string; lga: string; state: string; stateName: string };
export function saveFound(w: Ward | FoundWard) {
  writePref(FOUND, JSON.stringify({ id: w.id, name: w.name, lga: w.lga, state: w.state, stateName: w.stateName }));
}
export function readFound(): FoundWard | null {
  try {
    return JSON.parse(readPref(FOUND) ?? "null");
  } catch {
    return null;
  }
}

export type Application = {
  ref: string;
  userId: string;
  ward: FoundWard;
  at: string;
  endorser: { name: string; role: string; phone: string };
  stage: number; // index in the progress tracker (1 = applied)
  vision: number;
};
export function readApplications(): Application[] {
  try {
    const v = JSON.parse(readPref(APPS) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function saveApplication(a: Application) {
  writePref(APPS, JSON.stringify([a, ...readApplications().filter((x) => x.ref !== a.ref)]));
}
/** Wards applied for in this browser count as "application in progress" in the finder. */
export const appliedWardIds = () => new Set(readApplications().map((a) => a.ward.id));

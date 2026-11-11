/**
 * DEMO presence figures per state (members, leaders, projects, events) for the prototype.
 * Deterministic so the same numbers appear on state pages, the presence map and dashboards.
 * Production: built from live member, leader, project and event records (PRD SEO-9).
 */
import { states } from "./states";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}

export type StatePresence = { slug: string; members: number; wardLeaders: number; streetLeaders: number; projects: number; events: number; level: 0 | 1 | 2 | 3 | 4 };

const WEIGHT: Record<string, number> = { lagos: 1, kano: 0.95, fct: 0.8, anambra: 0.85, enugu: 0.75, kaduna: 0.7, rivers: 0.7, oyo: 0.65, imo: 0.65, delta: 0.6, abia: 0.6 };

export const presence: StatePresence[] = states.map((s) => {
  const h = hash(s.slug);
  const w = WEIGHT[s.slug] ?? 0.2 + (h % 40) / 100;
  const members = Math.round(8_000 + w * 140_000 + (h % 9_000));
  const wardLeaders = Math.round(members / 520);
  const streetLeaders = Math.round(members / 38);
  const projects = Math.round(w * 60 + (h % 12));
  const events = Math.round(w * 25 + (h % 6));
  const level = (w >= 0.8 ? 4 : w >= 0.6 ? 3 : w >= 0.4 ? 2 : w >= 0.25 ? 1 : 0) as StatePresence["level"];
  return { slug: s.slug, members, wardLeaders, streetLeaders, projects, events, level };
});

export const presenceOf = (slug: string) => presence.find((p) => p.slug === slug)!;

export const diasporaChapters = [
  { country: "United Kingdom", members: 18_400, status: "Chapter active" },
  { country: "United States", members: 15_900, status: "Chapter active" },
  { country: "Canada", members: 7_200, status: "Chapter active" },
  { country: "Germany", members: 4_100, status: "Chapter active" },
  { country: "Ghana", members: 3_600, status: "Chapter forming" },
  { country: "Togo", members: 1_100, status: "Chapter forming" },
  { country: "Ireland", members: 2_300, status: "Chapter forming" },
  { country: "South Africa", members: 2_900, status: "Chapter forming" },
];

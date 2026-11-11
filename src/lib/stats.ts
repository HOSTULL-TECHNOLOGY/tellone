import { DEMO_MODE } from "@/config/site";

export type LiveStats = {
  members: number;
  joinedToday: number;
  raisedNaira: number;
  recent: { firstName: string; state: string; minutesAgo: number }[];
  updatedAt: string;
  demo: boolean;
};

const DEMO_NAMES: [string, string][] = [
  ["Halima", "Kano"], ["Chinedu", "Enugu"], ["Tunde", "Oyo"], ["Aisha", "Kaduna"], ["Emeka", "Anambra"],
  ["Funmi", "Lagos"], ["Musa", "Bauchi"], ["Ngozi", "Imo"], ["Ibrahim", "Sokoto"], ["Blessing", "Rivers"],
  ["Yetunde", "Ogun"], ["Sani", "Katsina"], ["Ifeoma", "Abia"], ["Daniel", "Plateau"], ["Zainab", "FCT"],
  ["Efe", "Delta"], ["Amina", "Niger"], ["Kelechi", "Ebonyi"], ["Bola", "Kwara"], ["Uche", "Cross River"],
];

/**
 * Demo figures only (clearly labelled in the UI). They start from the example in the Revised Website
 * Menu ("1,284,560 members · 2,316 joined today") and grow slowly so the 60-second refresh is visible.
 * Replace with the CRM/ledger query when the backend is connected.
 */
export function demoStats(now = new Date()): LiveStats {
  const ref = Date.UTC(2026, 9, 21, 12); // 21 Oct 2026, date of the menu doc
  const minutes = Math.max(0, Math.floor((now.getTime() - ref) / 60_000));
  const watMidnight = new Date(now.getTime() + 3_600_000);
  const minutesToday = watMidnight.getUTCHours() * 60 + watMidnight.getUTCMinutes();
  const seed = Math.floor(now.getTime() / 60_000);
  const recent = Array.from({ length: 6 }, (_, i) => {
    const [firstName, state] = DEMO_NAMES[(seed + i * 7) % DEMO_NAMES.length];
    return { firstName, state, minutesAgo: i * 2 + 1 };
  });
  return {
    members: 1_284_560 + minutes * 2,
    joinedToday: 1_100 + Math.round(minutesToday * 1.6),
    raisedNaira: 48_250_000 + minutes * 1_500,
    recent,
    updatedAt: now.toISOString(),
    demo: true,
  };
}

export async function getStats(): Promise<LiveStats | null> {
  if (DEMO_MODE) return demoStats();
  // Live source not connected yet: return null so the UI shows an honest pending state.
  return null;
}

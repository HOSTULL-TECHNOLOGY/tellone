/**
 * DEMO transparency figures. Production: generated from the finance ledger, never typed by hand (PRD GR-8, FN-5).
 * Categories follow the Concept Note's public transparency commitment.
 */
export const spendCategories = ["Team", "Technology", "Voter contact", "Media", "Street activation", "Community projects", "Rewards"] as const;

export type MonthReport = { month: string; label: string; income: number; spend: Record<(typeof spendCategories)[number], number>; published: string };

export const monthlyReports: MonthReport[] = [
  {
    month: "2026-10",
    label: "October 2026",
    income: 48_250_000,
    published: "2026-11-05",
    spend: { Team: 6_100_000, Technology: 9_400_000, "Voter contact": 4_250_000, Media: 7_800_000, "Street activation": 3_950_000, "Community projects": 2_640_000, Rewards: 1_200_000 },
  },
  {
    month: "2026-09",
    label: "September 2026",
    income: 12_600_000,
    published: "2026-10-05",
    spend: { Team: 2_400_000, Technology: 3_900_000, "Voter contact": 600_000, Media: 1_850_000, "Street activation": 700_000, "Community projects": 0, Rewards: 0 },
  },
];

export const contracts = [
  { vendor: "Aba Garment Cluster", category: "Merch printing", value: 7_360_000, awarded: "2026-10-12", reason: "Lowest compliant bid for 1,000 T-shirts; met 48-hour dispatch and brand-approval criteria." },
  { vendor: "Northern Promo Supplies (Kaduna)", category: "Caps & wristbands", value: 2_940_000, awarded: "2026-10-14", reason: "Only bidder with stock in Kaduna and Kano warehouses; price within budget." },
  { vendor: "Ankara Prints Ltd (Lagos)", category: "Fliers & posters", value: 1_850_000, awarded: "2026-10-16", reason: "Best combined score on price, turnaround and proof-of-delivery reporting." },
];

export const reportsToCsv = (reports: MonthReport[]) => {
  const head = ["Month", "Income (NGN)", ...spendCategories.map((c) => `${c} (NGN)`), "Total spend (NGN)", "Published"];
  const rows = reports.map((r) => {
    const total = spendCategories.reduce((n, c) => n + r.spend[c], 0);
    return [r.label, r.income, ...spendCategories.map((c) => r.spend[c]), total, r.published];
  });
  return [head, ...rows].map((row) => row.map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : String(v))).join(",")).join("\n");
};

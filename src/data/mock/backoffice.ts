/**
 * DEMO back-office data for the National, Finance, Safeguarding, DPO, Call Centre, Shopper,
 * Shop Operations and Delivery dashboards. All names, figures and records are fictional samples
 * for design review. Phone numbers use the reserved demo pattern 0800 000 xxxx and are never real.
 * Timestamps are relative to "now" so countdowns stay meaningful during review.
 */
import { states } from "@/data/states";
import type { Order, OrderLine } from "@/lib/orders";
import type { OrderState } from "@/data/shop";

const H = 3_600_000;
const ago = (hours: number) => new Date(Date.now() - hours * H).toISOString();
const ahead = (hours: number) => new Date(Date.now() + hours * H).toISOString();

/* ------------------------------------------------------------------ National */
export const benchmarks = [
  { label: "Registered members", target: 5_000_000, actual: 1_290_420 },
  { label: "Project funders", target: 500_000, actual: 84_310 },
  { label: "Country coordinators", target: 200, actual: 63 },
  { label: "Ward leaders", target: 10_000, actual: 3_418 },
  { label: "Street leaders", target: 800_000, actual: 121_560 },
  { label: "Creatives", target: 500, actual: 212 },
  { label: "Language translators", target: 500, actual: 147 },
  { label: "Executed projects", target: 7_500, actual: 486 },
];

/** Deterministic per-state demo activity (members, ward leaders, street leaders, projects delivered). */
export const stateActivity = states.map((s, i) => {
  const seed = (i * 7919 + s.name.length * 131) % 1000;
  const members = 8_000 + ((seed * 97) % 72_000) + (["Lagos", "Kano", "Anambra", "FCT", "Rivers", "Enugu", "Kaduna", "Oyo"].includes(s.name) ? 60_000 : 0);
  const wardLeaders = Math.round(members / 380);
  const streetLeaders = Math.round(members / 11);
  const delivered = Math.round(members / 2_700);
  const coverage = Math.min(4, Math.floor(members / 26_000)); // 0–4 for the tile map
  return { slug: s.slug, state: s.name, zone: s.zone, members, wardLeaders, streetLeaders, delivered, coverage };
});

export const diaspora = [
  { country: "United Kingdom", chapters: 9, members: 21_400, tellOne: 38_210 },
  { country: "United States", chapters: 11, members: 18_950, tellOne: 31_080 },
  { country: "Canada", chapters: 6, members: 9_310, tellOne: 15_420 },
  { country: "Germany", chapters: 4, members: 5_120, tellOne: 8_330 },
  { country: "Ghana", chapters: 3, members: 4_870, tellOne: 7_010 },
  { country: "South Africa", chapters: 3, members: 3_960, tellOne: 5_640 },
  { country: "Ireland", chapters: 2, members: 2_210, tellOne: 3_090 },
  { country: "Togo", chapters: 1, members: 1_180, tellOne: 1_620 },
  { country: "United Arab Emirates", chapters: 2, members: 1_940, tellOne: 2_480 },
];

/** Concept Note spend categories (Public Transparency Commitment). */
export const spendCategories = [
  { category: "Team", raised: 9_200_000, spent: 7_850_000 },
  { category: "Technology", raised: 6_400_000, spent: 5_120_000 },
  { category: "Voter contact", raised: 8_900_000, spent: 6_010_000 },
  { category: "Media", raised: 14_300_000, spent: 11_940_000 },
  { category: "Street activation", raised: 7_100_000, spent: 5_480_000 },
  { category: "Community projects", raised: 11_600_000, spent: 6_930_000 },
  { category: "Rewards", raised: 2_150_000, spent: 1_870_000 },
];
export const weeklySpend = [3.1, 3.8, 4.2, 5.0, 5.6, 6.3, 7.1]; // ₦m per week, last 7 weeks

export type PipelineProject = { id: string; title: string; state: string; stage: "Proposed" | "Approved" | "Published" | "Funded" | "Delivered"; target: number; raised: number; daysInStage: number };
export const pipeline: PipelineProject[] = [
  { id: "P-1041", title: "Fliers for Adeniran Ogunsanya Street", state: "Lagos", stage: "Published", target: 250_000, raised: 187_500, daysInStage: 6 },
  { id: "P-1042", title: "Hausa radio slots, Kano city", state: "Kano", stage: "Published", target: 1_800_000, raised: 1_134_000, daysInStage: 9 },
  { id: "P-1043", title: "Borehole repair, Ward 4 Nsukka", state: "Enugu", stage: "Funded", target: 640_000, raised: 640_000, daysInStage: 4 },
  { id: "P-1044", title: "Village meeting PA system, Zaria", state: "Kaduna", stage: "Approved", target: 380_000, raised: 0, daysInStage: 12 },
  { id: "P-1045", title: "Igbo translation of the manifesto summary", state: "Anambra", stage: "Published", target: 420_000, raised: 96_000, daysInStage: 23 },
  { id: "P-1046", title: "Call centre credit (December)", state: "FCT", stage: "Published", target: 2_500_000, raised: 1_410_000, daysInStage: 7 },
  { id: "P-1047", title: "Posters for Rumuola Road", state: "Rivers", stage: "Delivered", target: 180_000, raised: 180_000, daysInStage: 2 },
  { id: "P-1048", title: "Classroom desks, Ilorin West", state: "Kwara", stage: "Proposed", target: 900_000, raised: 0, daysInStage: 3 },
  { id: "P-1049", title: "Theme song promotion, Ibadan radio", state: "Oyo", stage: "Funded", target: 1_200_000, raised: 1_200_000, daysInStage: 19 },
  { id: "P-1050", title: "Street lights repair, Jos North", state: "Plateau", stage: "Approved", target: 560_000, raised: 0, daysInStage: 16 },
  { id: "P-1051", title: "SMS broadcast credit, North East", state: "Bauchi", stage: "Published", target: 750_000, raised: 312_000, daysInStage: 4 },
  { id: "P-1052", title: "Merch giveaway, Onitsha market", state: "Anambra", stage: "Delivered", target: 300_000, raised: 300_000, daysInStage: 1 },
];
export const STALLED_DAYS = 14;

export const contentStats = {
  briefsOpen: 37,
  published: 1_284,
  inReview: 58,
  adSpend: 18_450_000,
  reach: [
    { label: "WhatsApp", value: 4_820_000 },
    { label: "Facebook", value: 3_910_000 },
    { label: "TikTok", value: 3_240_000 },
    { label: "X", value: 1_870_000 },
    { label: "Instagram", value: 1_520_000 },
    { label: "Radio (est.)", value: 6_200_000 },
  ],
};

export const calendarItems = [
  { date: "2026-11-09", title: "Website and Shop go live (MVP)" },
  { date: "2026-11-10", title: "Android and iOS apps live" },
  { date: "2026-11-30", title: "Release 1.1" },
  { date: "2026-12-14", title: "Release 1.2" },
  { date: "2026-12-15", title: "Security and load tests begin" },
  { date: "2027-01-05", title: "Code freeze — critical fixes only" },
  { date: "2027-01-14", title: "Campaign cut-off 11:59 pm: giveaways, broadcasts and paid ads auto-stop" },
  { date: "2027-01-16", title: "Election Day — Presidential & National Assembly" },
];

export type ManagedUser = { id: string; name: string; state: string; roles: string[]; vetting: "Vetted" | "Pending" | "Failed"; status: "Active" | "Suspended" };
export const managedUsers: ManagedUser[] = [
  { id: "M-20411", name: "Chinedu Okeke", state: "Enugu", roles: ["Member", "Ward leader"], vetting: "Vetted", status: "Active" },
  { id: "M-20412", name: "Aisha Lawan", state: "Kaduna", roles: ["Member"], vetting: "Pending", status: "Active" },
  { id: "M-20413", name: "Tunde Bakare", state: "Oyo", roles: ["Member", "Street leader"], vetting: "Vetted", status: "Active" },
  { id: "M-20414", name: "Blessing Ike", state: "Rivers", roles: ["Member", "Creator"], vetting: "Vetted", status: "Active" },
  { id: "M-20415", name: "Sani Danjuma", state: "Kano", roles: ["Member"], vetting: "Pending", status: "Active" },
  { id: "M-20416", name: "Yemi Alade-Johnson", state: "Lagos", roles: ["Member", "State coordinator"], vetting: "Vetted", status: "Active" },
  { id: "M-20417", name: "Ifeanyi Nnaji", state: "Abia", roles: ["Member", "Street leader"], vetting: "Failed", status: "Suspended" },
  { id: "M-20418", name: "Zainab Musa", state: "Sokoto", roles: ["Member", "Translator"], vetting: "Vetted", status: "Active" },
  { id: "M-20419", name: "Efe Omoregie", state: "Edo", roles: ["Member"], vetting: "Pending", status: "Active" },
  { id: "M-20420", name: "Ngozi Chukwu", state: "Anambra", roles: ["Member", "Country coordinator"], vetting: "Vetted", status: "Active" },
];
export const grantableRoles = ["Street leader", "Ward leader", "State coordinator", "Country coordinator", "Creator", "Translator", "Associate", "Vendor", "Delivery partner"];

export const aiVisibility = {
  visitsByLanguage: [
    { label: "English", value: 412_300 },
    { label: "Pidgin", value: 96_800 },
    { label: "Hausa", value: 71_200 },
    { label: "Yorùbá", value: 58_900 },
    { label: "Igbo", value: 44_100 },
  ],
  topQueries: [
    { q: "how to join tbh one", clicks: 18_420 },
    { q: "when is election 2027 nigeria", clicks: 15_910 },
    { q: "peter obi running mate", clicks: 12_300 },
    { q: "where to collect pvc", clicks: 9_870 },
    { q: "tbh one fund a project", clicks: 6_540 },
    { q: "we will not steal your money", clicks: 5_210 },
  ],
  vitals: [
    { metric: "LCP (p75, mobile)", value: "2.1 s", target: "< 2.5 s", ok: true },
    { metric: "INP (p75, mobile)", value: "180 ms", target: "< 200 ms", ok: true },
    { metric: "CLS (p75, mobile)", value: "0.04", target: "< 0.1", ok: true },
  ],
  panel: [
    { engine: "ChatGPT", mentioned: 34, accurate: 31, cited: 22 },
    { engine: "Gemini", mentioned: 29, accurate: 27, cited: 18 },
    { engine: "Perplexity", mentioned: 38, accurate: 35, cited: 33 },
    { engine: "Copilot", mentioned: 26, accurate: 24, cited: 17 },
    { engine: "Google AI Overviews", mentioned: 31, accurate: 29, cited: 21 },
  ],
  crawlers: [
    { bot: "GPTBot", visits: 14_210 },
    { bot: "OAI-SearchBot", visits: 6_830 },
    { bot: "ClaudeBot", visits: 9_420 },
    { bot: "PerplexityBot", visits: 7_960 },
    { bot: "Google-Extended", visits: 11_070 },
    { bot: "Bingbot", visits: 22_540 },
    { bot: "Applebot", visits: 4_310 },
  ],
};

/* ------------------------------------------------------------------ Finance */
export type Contribution = { id: string; at: string; contributor: string; method: "Card" | "Bank transfer" | "USSD"; project: string; category: string; amount: number; country: string; status: "Settled" | "Held — ID check" | "Held — legal review" | "Held — foreign source" | "Returned"; ref: string };
export const contributions: Contribution[] = [
  { id: "C-90311", at: ago(2), contributor: "Adaeze Okafor", method: "Card", project: "Fliers for Adeniran Ogunsanya Street", category: "Street activation", amount: 10_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD02" },
  { id: "C-90312", at: ago(3), contributor: "Musa Garba", method: "USSD", project: "Hausa radio slots, Kano city", category: "Media", amount: 5_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD09" },
  { id: "C-90313", at: ago(5), contributor: "Okon Etim Enterprises Ltd", method: "Bank transfer", project: "Call centre credit (December)", category: "Voter contact", amount: 1_250_000, country: "Nigeria", status: "Held — ID check", ref: "PSK_T_83KD1A" },
  { id: "C-90314", at: ago(7), contributor: "Chika Nwosu", method: "Card", project: "Igbo translation of the manifesto summary", category: "Media", amount: 45_000, country: "United Kingdom", status: "Held — foreign source", ref: "PSK_T_83KD22" },
  { id: "C-90315", at: ago(9), contributor: "Funmilayo Adeyemi", method: "Bank transfer", project: "Borehole repair, Ward 4 Nsukka", category: "Community projects", amount: 50_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD2F" },
  { id: "C-90316", at: ago(11), contributor: "Northern Traders Association", method: "Bank transfer", project: "SMS broadcast credit, North East", category: "Voter contact", amount: 6_000_000, country: "Nigeria", status: "Held — legal review", ref: "PSK_T_83KD31" },
  { id: "C-90317", at: ago(14), contributor: "Ibrahim Sule", method: "USSD", project: "Village meeting PA system, Zaria", category: "Street activation", amount: 2_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD3C" },
  { id: "C-90318", at: ago(20), contributor: "Grace Etim", method: "Card", project: "Theme song promotion, Ibadan radio", category: "Media", amount: 25_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD40" },
  { id: "C-90319", at: ago(26), contributor: "Tobi Bello", method: "Card", project: "Posters for Rumuola Road", category: "Street activation", amount: 15_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD47" },
  { id: "C-90320", at: ago(31), contributor: "Emeka Obi", method: "Bank transfer", project: "Team salaries (adopt a salary)", category: "Team", amount: 200_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD52" },
  { id: "C-90321", at: ago(38), contributor: "Kemi Lawal", method: "Card", project: "Technology: member platform hosting", category: "Technology", amount: 30_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD5D" },
  { id: "C-90322", at: ago(44), contributor: "Halima Bako", method: "USSD", project: "Merch giveaway, Onitsha market", category: "Rewards", amount: 3_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD61" },
  { id: "C-90323", at: ago(52), contributor: "Daniel Akpan", method: "Card", project: "Classroom desks, Ilorin West", category: "Community projects", amount: 20_000, country: "United States", status: "Held — foreign source", ref: "PSK_T_83KD6B" },
  { id: "C-90324", at: ago(60), contributor: "Blessing Ike", method: "Bank transfer", project: "Street lights repair, Jos North", category: "Community projects", amount: 75_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD70" },
  { id: "C-90325", at: ago(70), contributor: "Yusuf Abdullahi", method: "Card", project: "Hausa radio slots, Kano city", category: "Media", amount: 100_000, country: "Nigeria", status: "Settled", ref: "PSK_T_83KD7E" },
  { id: "C-90326", at: ago(80), contributor: "Sani Umar", method: "USSD", project: "Fliers for Adeniran Ogunsanya Street", category: "Street activation", amount: 1_000, country: "Nigeria", status: "Returned", ref: "PSK_T_83KD82" },
];

export type Payout = { id: string; payee: string; kind: "Street leader task" | "Creator fee" | "Vendor invoice" | "Delivery fee" | "Ward leader project mgmt"; reference: string; amount: number; account: string; proof: "Approved proof" | "Proof pending" | "Delivery confirmed"; status: "Awaiting approval" | "Approved — awaiting release" | "Released" | "Rejected"; approver?: string; releaser?: string; at: string };
export const payouts: Payout[] = [
  { id: "PO-5501", payee: "Musa Garba", kind: "Street leader task", reference: "Flier drop · 300 fliers · Gama Road", amount: 1_500, account: "OPay ••• 4412", proof: "Approved proof", status: "Awaiting approval", at: ago(3) },
  { id: "PO-5502", payee: "Tobi Bello", kind: "Creator fee", reference: "Brief CR-118 · 30-second Pidgin skit", amount: 45_000, account: "GTBank ••• 0193", proof: "Approved proof", status: "Awaiting approval", at: ago(6) },
  { id: "PO-5503", payee: "Ankara Prints Ltd (Lagos)", kind: "Vendor invoice", reference: "INV-2207 · 5,000 fliers", amount: 185_000, account: "Zenith ••• 7720", proof: "Delivery confirmed", status: "Approved — awaiting release", approver: "Ngozi Adebayo", at: ago(10) },
  { id: "PO-5504", payee: "Funmilayo Adeyemi", kind: "Delivery fee", reference: "Pickup hub · 14 orders handed over", amount: 7_000, account: "Access ••• 8834", proof: "Delivery confirmed", status: "Awaiting approval", at: ago(12) },
  { id: "PO-5505", payee: "Bala Yakubu", kind: "Street leader task", reference: "Door-to-door · 4-hour shift · Zaria", amount: 1_500, account: "PalmPay ••• 2201", proof: "Proof pending", status: "Awaiting approval", at: ago(15) },
  { id: "PO-5506", payee: "Kano Textile Works", kind: "Vendor invoice", reference: "INV-2210 · 400 Hausa T-shirts", amount: 1_120_000, account: "UBA ••• 5561", proof: "Delivery confirmed", status: "Released", approver: "Ngozi Adebayo", releaser: "Emeka Obi", at: ago(40) },
  { id: "PO-5507", payee: "Chiamaka Eze", kind: "Ward leader project mgmt", reference: "P-1043 borehole repair · supervision", amount: 20_000, account: "First Bank ••• 3009", proof: "Approved proof", status: "Awaiting approval", at: ago(20) },
];
export const SECOND_REVIEWER = "Ngozi Adebayo";

export type ReconLine = { id: string; date: string; source: "Paystack settlement" | "Bank statement"; reference: string; amount: number; matched: boolean; note?: string };
export const reconLines: ReconLine[] = [
  { id: "R-1", date: ago(24), source: "Paystack settlement", reference: "STL-20261022-01", amount: 1_342_800, matched: true },
  { id: "R-2", date: ago(24), source: "Bank statement", reference: "TRF/PAYSTACK/221026", amount: 1_342_800, matched: true },
  { id: "R-3", date: ago(30), source: "Bank statement", reference: "NIP/OKONETIM/1250000", amount: 1_250_000, matched: false, note: "Large contribution — linked to held ledger line C-90313" },
  { id: "R-4", date: ago(48), source: "Paystack settlement", reference: "STL-20261021-01", amount: 918_400, matched: false, note: "Settlement short by ₦1,000 (refund C-90326)" },
  { id: "R-5", date: ago(48), source: "Bank statement", reference: "TRF/PAYSTACK/211026", amount: 917_400, matched: false },
  { id: "R-6", date: ago(72), source: "Bank statement", reference: "CHG/SMS-ALERT", amount: 52, matched: false, note: "Bank charge — post to Technology" },
];

export const fraudFlags = [
  { id: "F-301", kind: "Duplicate photo", detail: "Proof photo for task T-8812 matches T-8790 (same hash, two street leaders, Ojo LGA).", severity: "High", at: ago(5) },
  { id: "F-302", kind: "Repeat bank account", detail: "3 payees share account ••• 4412 (Musa G., Abdul R., Lawal T.).", severity: "High", at: ago(9) },
  { id: "F-303", kind: "Unusual payout pattern", detail: "Ward 7 Ikeja: 19 door-to-door shifts logged in 24 hours by 2 leaders.", severity: "Medium", at: ago(16) },
  { id: "F-304", kind: "Duplicate photo", detail: "Delivery proof reused across orders TBH-26-4410 and TBH-26-4419.", severity: "Low", at: ago(30) },
];

/* ------------------------------------------------------------------ Safeguarding (restricted) */
export type Incident = {
  id: string;
  type: "Sexual abuse or exploitation" | "Violence or threat" | "Harassment" | "Child safeguarding" | "Fraud or scam" | "Unsafe event";
  severity: "Critical" | "High" | "Low";
  reportedAt: string;
  location: string;
  reporter: string; // "Anonymous" when chosen
  summary: string;
  status: "New" | "Triaged" | "Escalated" | "Resolved";
  owner?: string;
  actions: { at: string; by: string; note: string }[];
  outcome?: string;
  subject?: string; // user whose roles may be suspended
};
export const SG_TARGET_HOURS: Record<Incident["severity"], number> = { Critical: 1, High: 24, Low: 72 };
export const incidents: Incident[] = [
  { id: "SG-0412", type: "Violence or threat", severity: "Critical", reportedAt: ago(0.35), location: "Zaria, Kaduna", reporter: "Anonymous", summary: "Street leader threatened by a group while distributing fliers near the market; leader has moved to a safe place.", status: "New", actions: [], subject: "M-20412 · Aisha Lawan (street leader)" },
  { id: "SG-0411", type: "Sexual abuse or exploitation", severity: "Critical", reportedAt: ago(1.4), location: "Ikeja, Lagos", reporter: "Anonymous", summary: "Report of inappropriate demands made to a volunteer by a ward-level organiser in exchange for paid tasks.", status: "Triaged", owner: "Halima Bako", actions: [{ at: ago(1.2), by: "Halima Bako", note: "Triaged. Reporter offered support line; organiser's roles flagged for suspension review." }], subject: "M-20417 · Ifeanyi Nnaji (ward organiser)" },
  { id: "SG-0410", type: "Unsafe event", severity: "High", reportedAt: ago(5), location: "Nsukka, Enugu", reporter: "Chinedu Okeke (ward leader)", summary: "Village meeting venue has a single exit and crowd expected above 300; police notice not yet filed.", status: "Triaged", owner: "Halima Bako", actions: [{ at: ago(4), by: "Halima Bako", note: "Asked ward leader to move venue or cap attendance at 150." }] },
  { id: "SG-0409", type: "Child safeguarding", severity: "High", reportedAt: ago(20), location: "Bauchi, Bauchi", reporter: "Anonymous", summary: "Under-18s seen distributing merch for a street leader.", status: "New", actions: [], subject: "M-20415 · Sani Danjuma (street leader)" },
  { id: "SG-0408", type: "Fraud or scam", severity: "Low", reportedAt: ago(30), location: "Online (WhatsApp)", reporter: "Tunde Bakare", summary: "Fake 'TBH One' WhatsApp number asking members to pay ₦2,000 registration fee.", status: "Escalated", owner: "Halima Bako", actions: [{ at: ago(28), by: "Halima Bako", note: "Escalated to Verify page owner and call centre script updated." }] },
  { id: "SG-0407", type: "Harassment", severity: "Low", reportedAt: ago(90), location: "Port Harcourt, Rivers", reporter: "Blessing Ike", summary: "Creator received abusive messages after a published skit.", status: "Resolved", owner: "Halima Bako", actions: [{ at: ago(80), by: "Halima Bako", note: "Advised on blocking/reporting; comments moderated." }], outcome: "Resolved — support provided, no further contact reported." },
];
export const escalationContacts = [
  { role: "Police — Nigeria Police Force state command", when: "Immediate danger, violence, threats", contact: "State command duty line — published in the Safeguarding Policy at launch" },
  { role: "Medical — nearest general hospital emergency unit", when: "Injury, sexual assault care", contact: "Hospital list per state — maintained by state focal points" },
  { role: "Legal adviser (TBH One)", when: "Allegations against staff/leaders, evidence handling", contact: "Named adviser — to be confirmed by the National Coordination team" },
  { role: "National Safeguarding Lead", when: "All Critical incidents within 1 hour", contact: "Internal on-call rota (in-app)" },
  { role: "Child protection referral", when: "Any concern involving under-18s", contact: "State social welfare referral point — to be confirmed" },
];
export const weeklySg = [
  { week: "Wk 39", critical: 1, high: 4, low: 9 },
  { week: "Wk 40", critical: 2, high: 5, low: 11 },
  { week: "Wk 41", critical: 1, high: 6, low: 8 },
  { week: "Wk 42", critical: 3, high: 7, low: 12 },
];

/* ------------------------------------------------------------------ DPO */
export const consentRegister = [
  { type: "Membership", granted: 1_290_420, withdrawn: 2_184, pendingOptOut: 0 },
  { type: "SMS / WhatsApp updates", granted: 1_012_330, withdrawn: 18_406, pendingOptOut: 37 },
  { type: "AI calls", granted: 640_210, withdrawn: 9_820, pendingOptOut: 12 },
  { type: "Photos & stories", granted: 88_940, withdrawn: 1_102, pendingOptOut: 3 },
];
export type DataRequest = { id: string; kind: "Access" | "Correction" | "Deletion"; subject: string; receivedAt: string; status: "Received" | "Identity verified" | "In progress" | "Completed"; notes?: string };
export const dataRequests: DataRequest[] = [
  { id: "DR-118", kind: "Deletion", subject: "Member M-18822 (Lagos)", receivedAt: ago(26 * 24), status: "In progress" },
  { id: "DR-119", kind: "Access", subject: "Member M-19104 (Kano)", receivedAt: ago(21 * 24), status: "Identity verified" },
  { id: "DR-120", kind: "Correction", subject: "Member M-19987 (Enugu) — wrong LGA", receivedAt: ago(9 * 24), status: "Received" },
  { id: "DR-121", kind: "Deletion", subject: "Member M-20033 (Diaspora, UK)", receivedAt: ago(3 * 24), status: "Received" },
  { id: "DR-122", kind: "Access", subject: "Former street leader M-15521 (Oyo)", receivedAt: ago(31 * 24), status: "In progress" },
  { id: "DR-117", kind: "Correction", subject: "Member M-17710 (FCT)", receivedAt: ago(40 * 24), status: "Completed", notes: "Phone number corrected; confirmation sent." },
];
export type Breach = { id: string; title: string; detectedAt: string; severity: "High" | "Medium" | "Low"; affected: number; steps: Record<string, boolean>; status: "Open" | "Notified" | "Closed" };
export const BREACH_STEPS = ["Contain the breach", "Assess risk to people", "Notify NDPC within 72 hours", "Notify affected people (if high risk)", "Record lessons and close"];
export const breaches: Breach[] = [
  { id: "BR-07", title: "Ward leader exported a street roster to a personal spreadsheet", detectedAt: ago(20), severity: "Medium", affected: 46, steps: { "Contain the breach": true, "Assess risk to people": true }, status: "Open" },
  { id: "BR-06", title: "Mis-sent SMS batch exposed first names to the wrong ward", detectedAt: ago(15 * 24), severity: "Low", affected: 212, steps: Object.fromEntries(["Contain the breach", "Assess risk to people", "Notify NDPC within 72 hours", "Record lessons and close"].map((s) => [s, true])), status: "Closed" },
];
export const featureFlags = [
  { key: "contacts-import", label: "Contact list import", risk: "Shares data about people who have not joined (Concept Note data protection note, NF-9)." },
  { key: "gmail-connect", label: "Gmail connect", risk: "Reads a member's address book; requires a lawful basis and published notice." },
  { key: "whatsapp-connect", label: "WhatsApp connect", risk: "Imported contacts must never be messaged by TBH One." },
];
export const accessLog = [
  { at: ago(0.5), who: "Sani Umar (call centre)", what: "Viewed member summary M-19104", purpose: "Caller lookup" },
  { at: ago(1), who: "Ibrahim Sule (state coordinator)", what: "Exported aggregated Kaduna ward CSV", purpose: "Weekly report" },
  { at: ago(2), who: "Halima Bako (safeguarding)", what: "Opened case SG-0411", purpose: "Triage" },
  { at: ago(3), who: "Emeka Obi (finance)", what: "Viewed contributor C-90313 ID documents", purpose: "Large contribution check" },
  { at: ago(6), who: "Funmilayo Adeyemi (ward leader)", what: "Viewed street roster, Ward 4", purpose: "Task assignment" },
  { at: ago(9), who: "Grace Etim (national)", what: "Granted Ward leader role to M-20411", purpose: "Role admin" },
  { at: ago(26), who: "Funmilayo Adeyemi (ward leader)", what: "Downloaded roster (blocked by policy)", purpose: "—" },
];

/* ------------------------------------------------------------------ Call centre */
export type Escalation = { id: string; caller: string; phone: string; language: string; reason: string; waitingSince: string; status: "Waiting" | "With agent" | "Resolved"; transcript: { who: "AI" | "Caller"; text: string }[] };
export const escalations: Escalation[] = [
  {
    id: "ESC-771",
    caller: "Member M-19104",
    phone: "08000000021",
    language: "Hausa",
    reason: "Payment taken twice for a project",
    waitingSince: ago(0.15),
    status: "Waiting",
    transcript: [
      { who: "AI", text: "Hello, this is the TBH One AI assistant — an automated program, not a person. How can I help?" },
      { who: "Caller", text: "Na biya sau biyu don aikin rediyo na Kano." },
      { who: "AI", text: "I understand you were charged twice for the Kano radio project. I can't see payment details, so I'm passing you to a person on our team. Please don't share your card number." },
    ],
  },
  {
    id: "ESC-772",
    caller: "Guest caller",
    phone: "08000000022",
    language: "Pidgin",
    reason: "Wants to report someone collecting money in TBH One's name",
    waitingSince: ago(0.4),
    status: "Waiting",
    transcript: [
      { who: "AI", text: "Hello, this is the TBH One AI assistant — an automated program, not a person. How can I help?" },
      { who: "Caller", text: "One man for my area dey collect money say na TBH One registration." },
      { who: "AI", text: "TBH One membership is free — nobody should collect a fee. I'll connect you to a person who can take a report. If you feel unsafe, contact the police." },
    ],
  },
  {
    id: "ESC-773",
    caller: "Member M-20033",
    phone: "08000000023",
    language: "English",
    reason: "Diaspora member asking how to donate from abroad",
    waitingSince: ago(1.1),
    status: "With agent",
    transcript: [
      { who: "AI", text: "Hello, this is the TBH One AI assistant — an automated program, not a person. How can I help?" },
      { who: "Caller", text: "I live in Manchester. How can I fund a project?" },
      { who: "AI", text: "Funds from outside Nigeria need legal clearance before they can be accepted. Meanwhile you can join a diaspora chapter and support Tell One or in-kind help. Would you like a person to explain more?" },
    ],
  },
];
export const callerDirectory = [
  { phone: "08000000021", memberId: "M-19104", firstName: "Abubakar", state: "Kano", lga: "Nassarawa", joined: "2026-11-12", roles: ["Member", "Project funder"], points: 1_240, openTickets: 1 },
  { phone: "08000000023", memberId: "M-20033", firstName: "Chioma", state: "Anambra", lga: "Awka South", joined: "2026-11-15", roles: ["Member"], points: 310, openTickets: 0, country: "United Kingdom" },
  { phone: "08000000001", memberId: "M-10001", firstName: "Adaeze", state: "Lagos", lga: "Surulere", joined: "2026-11-09", roles: ["Member", "Shopper"], points: 820, openTickets: 0 },
  { phone: "08000000002", memberId: "M-10002", firstName: "Musa", state: "Kano", lga: "Nassarawa", joined: "2026-11-09", roles: ["Member", "Street leader"], points: 2_310, openTickets: 2 },
];
export type Ticket = { id: string; subject: string; route: "Support" | "Safeguarding" | "Finance"; priority: "Urgent" | "High" | "Normal"; caller: string; createdAt: string; status: "Open" | "In progress" | "Closed"; slaHours: number };
export const tickets: Ticket[] = [
  { id: "TK-4410", subject: "Order TBH-26-104233 not delivered", route: "Support", priority: "Normal", caller: "M-10001", createdAt: ago(20), status: "In progress", slaHours: 48 },
  { id: "TK-4411", subject: "Street leader payout delayed", route: "Finance", priority: "High", caller: "M-10002", createdAt: ago(10), status: "Open", slaHours: 24 },
  { id: "TK-4412", subject: "Cannot sign in — SMS code not arriving", route: "Support", priority: "Normal", caller: "M-19987", createdAt: ago(4), status: "Open", slaHours: 48 },
];
export const SLA_BY_PRIORITY = { Urgent: 1, High: 24, Normal: 48 } as const;

/* ------------------------------------------------------------------ Shop: vendors, demo orders, fraud */
export const vendorPerformance = [
  { vendor: "Aba Garment Cluster", orders: 412, onTime: 0.96, returns: 0.012, units: 3_840, revenue: 30_720_000, margin: 0.22 },
  { vendor: "Kano Textile Works", orders: 288, onTime: 0.93, returns: 0.018, units: 2_310, revenue: 18_480_000, margin: 0.2 },
  { vendor: "Ankara Prints Ltd (Lagos)", orders: 197, onTime: 0.89, returns: 0.025, units: 6_920, revenue: 9_410_000, margin: 0.25 },
  { vendor: "Northern Promo Supplies (Kaduna)", orders: 154, onTime: 0.81, returns: 0.031, units: 4_150, revenue: 7_860_000, margin: 0.18 },
];
export const shopFraud = [
  { id: "SF-21", kind: "Repeated coupon use", detail: "WELCOME500 used on 6 accounts sharing one device and delivery address in Ikorodu.", at: ago(4) },
  { id: "SF-22", kind: "Unusual bulk order", detail: "3 × Event pack (600 items) ordered by a new guest account, delivery to a residential address in Abuja.", at: ago(11) },
  { id: "SF-23", kind: "Chargeback", detail: "Card chargeback on TBH-26-998102 (₦16,000) — customer says the card was stolen.", at: ago(30) },
];

const names = [
  ["Adaeze Okafor", "Lagos", "Surulere"], ["Musa Garba", "Kano", "Nassarawa"], ["Chinedu Okeke", "Enugu", "Nsukka"], ["Aisha Lawan", "Kaduna", "Zaria"],
  ["Tunde Bakare", "Oyo", "Ibadan North"], ["Blessing Ike", "Rivers", "Obio/Akpor"], ["Zainab Musa", "Sokoto", "Sokoto North"], ["Efe Omoregie", "Edo", "Oredo"],
  ["Ngozi Chukwu", "Anambra", "Onitsha North"], ["Ibrahim Sule", "FCT", "Abuja Municipal"], ["Kelechi Uba", "Imo", "Owerri Municipal"], ["Halima Usman", "Bauchi", "Bauchi"],
];
const demoLines: OrderLine[][] = [
  [{ slug: "tbh-one-tagline-t-shirt", name: "‘We will not steal your money’ T-shirt", unitPrice: 8_000, qty: 2, size: "L", colour: "White" }],
  [{ slug: "tbh-one-cap", name: "TBH One cap", unitPrice: 5_500, qty: 1, colour: "Black" }, { slug: "sticker-sheet", name: "Sticker sheet (20 stickers)", unitPrice: 1_200, qty: 3 }],
  [{ slug: "tagline-t-shirt-hausa", name: "‘Ba za mu saci kuɗinku ba’ T-shirt", unitPrice: 8_000, qty: 3, size: "M", colour: "Green" }],
  [{ slug: "street-banner-3m", name: "Street banner (3 m)", unitPrice: 18_000, qty: 2 }],
  [{ slug: "ward-starter-pack-50", name: "Ward starter pack (50 T-shirts)", unitPrice: 400_000, qty: 1 }],
  [{ slug: "tbh-one-wristband-5-pack", name: "Wristbands, pack of 5", unitPrice: 2_500, qty: 4 }],
];
const flow: OrderState[] = ["Paid", "Sent to vendor", "Packed", "Dispatched", "Out for delivery", "Delivered"];

/** Demo orders for Shop Operations and Delivery when the browser has few real checkouts. Clearly prefixed DEMO. */
export function buildDemoOrders(): Order[] {
  return names.map(([name, state, lga], i) => {
    const lines = demoLines[i % demoLines.length];
    const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
    const fee = subtotal >= 20_000 ? 0 : state === "Lagos" || state === "FCT" ? 2_000 : 3_500;
    const stateIdx = [0, 1, 2, 3, 3, 4, 5, 5, 0, 1, 2, 4][i];
    const createdH = [3, 8, 30, 52, 70, 26, 96, 120, 60, 5, 74, 130][i];
    const hist = flow.slice(0, stateIdx + 1).map((s, k) => ({ state: s, at: ago(createdH - k * 6) }));
    const pickup = i % 5 === 3;
    return {
      number: `DEMO-26-${String(510200 + i * 37)}`,
      createdAt: ago(createdH),
      buyer: { name, phone: `080000001${String(i).padStart(2, "0")}` },
      delivery: {
        method: pickup ? "pickup" : "courier",
        zone: pickup ? "Free pickup at a ward-leader hub" : state === "Lagos" || state === "FCT" ? "Lagos and Abuja" : "Other state capitals",
        state,
        lga,
        address: pickup ? undefined : `${12 + i} ${["Market Road", "Hospital Road", "Station Street", "Church Avenue"][i % 4]}, ${lga}`,
        pickupPoint: pickup ? `Ward hub, ${lga}` : undefined,
        fee,
        estimate: state === "Lagos" || state === "FCT" ? "1–3 working days" : "3–5 working days",
      },
      lines,
      subtotal,
      discount: 0,
      vat: Math.round(((subtotal + fee) * 0.075) / 1.075),
      total: subtotal + fee,
      payment: { method: (["card", "transfer", "ussd"] as const)[i % 3], status: "Paid (simulated)", reference: `PSK_T_DEMO${i}` },
      state: flow[stateIdx],
      history: hist,
      courier: stateIdx >= 3 ? "Courier partner A (demo)" : undefined,
      tracking: stateIdx >= 3 ? `TRKDEMO${i}NG` : undefined,
    };
  });
}

/* ------------------------------------------------------------------ Delivery partner */
export const DELIVERY_CODE_HINT = "Each customer receives a 4-digit delivery code by SMS. Demo code for every shipment: 4321.";
export const DEMO_DELIVERY_CODE = "4321";
export const FAILED_REASONS = ["Customer not available", "Wrong or incomplete address", "Customer refused delivery", "Area unsafe to enter", "Vehicle breakdown"];

export { ahead, ago };

/**
 * DEMO DATA for the field and partner dashboards (member, street leader, ward leader, state coordinator,
 * country coordinator, creator, vendor, NDC aspirant). Names, places and figures are illustrative.
 * Rates follow PRD decision 3; Impact Points rewards follow PRD decision 7.
 */

/* ---------- Impact Points & rewards (Concept Note §7, PRD decision 7) ---------- */
export const pointActions = [
  { key: "join", label: "Become a member", points: 100 },
  { key: "refer", label: "Refer a member (after they verify)", points: 50 },
  { key: "event", label: "Attend an event or village meeting", points: 40 },
  { key: "project", label: "Complete a community project", points: 150 },
  { key: "merch", label: "Distribute merch", points: 30 },
  { key: "register", label: "Help someone register to vote", points: 60 },
  { key: "content", label: "Create approved content", points: 80 },
  { key: "groups", label: "Join a volunteer or support sub-group", points: 20 },
];
export const rewardTiers = [
  { points: 500, reward: "₦500 airtime" },
  { points: 1000, reward: "1 GB data" },
  { points: 2500, reward: "TBH One T-shirt" },
  { points: 5000, reward: "Priority training pass" },
];

/* ---------- Today's action (MB-1), rotates daily ---------- */
export const dailyActions = [
  { kind: "Tell One", title: "Call one relative at home", text: "Share why ‘We will not steal your money’ matters to your family. Log the call in your Tell One log.", cta: "Open Tell One log", path: "/dashboard/member/tell-one" },
  { kind: "Bring One", title: "Bring one friend on the fence", text: "Send your referral link to one friend and help them join for free.", cta: "Get my referral link", path: "/dashboard/member/referrals" },
  { kind: "Help One", title: "Back a project near you", text: "Pick one published project in your state and follow every naira to delivery.", cta: "See projects near me", path: "/dashboard/member/projects" },
  { kind: "Bring One", title: "Bring a neighbour to a village meeting", text: "Village meetings explain the message face to face. RSVP and invite one person.", cta: "Events near me", path: "/dashboard/member/events" },
  { kind: "Help One", title: "Join a support sub-group", text: "Sub-groups organise help for people in need in your area.", cta: "Find groups", path: "/dashboard/member/groups" },
];

export const memberDemo = {
  points: 1240,
  pointsThisWeek: 180,
  memberSince: "2026-11-09",
  memberNo: "TBH-M-0042317",
  completed: ["join", "refer", "groups"],
  referrals: [
    { firstName: "Tolu", state: "Lagos", status: "Verified", points: 50, joined: "2026-11-11" },
    { firstName: "Chidi", state: "Lagos", status: "Verified", points: 50, joined: "2026-11-14" },
    { firstName: "Aisha", state: "Ogun", status: "Pending verification", points: 0, joined: "2026-11-20" },
  ],
  contributions: [
    { ref: "TBH-FND-71842", projectSlug: "fliers-adeniran-ogunsanya-street-surulere", projectTitle: "Fliers and distribution for Adeniran Ogunsanya Street", state: "Lagos", amount: 5000, date: "2026-11-12", target: 250000, raised: 187500, spent: 120000, status: "In delivery", proof: ["Print invoice from vendor", "Photo: 5,000 fliers delivered to ward hub"] },
    { ref: "TBH-FND-71993", projectSlug: "borehole-repair-ward-4-nsukka", projectTitle: "Community borehole repair, Ward 4", state: "Enugu", amount: 10000, date: "2026-11-15", target: 640000, raised: 640000, spent: 598500, status: "Delivered", proof: ["Pump parts receipt", "Photo: working borehole, 2 Dec 2026", "Ward leader sign-off"] },
  ],
  giveawayHistory: [
    { date: "2026-11-18", prize: "₦5,000 airtime (20 winners)", result: "Not selected" },
    { date: "2026-11-19", prize: "TBH One cap (50 winners)", result: "Not selected" },
  ],
};

export const memberBenefits = [
  { kind: "Training", title: "Digital marketing for small businesses", where: "Online", states: ["All"], when: "Every Tuesday" },
  { kind: "Training", title: "Street leader safety and conduct", where: "Surulere LGA secretariat", states: ["Lagos"], when: "Sat 21 Nov 2026" },
  { kind: "Job", title: "Field data associate (project-based)", where: "Lagos", states: ["Lagos"], when: "Apply by 30 Nov 2026" },
  { kind: "Job", title: "Hausa translator (per assignment)", where: "Remote", states: ["All"], when: "Rolling" },
  { kind: "Business", title: "Merch vendor call: caps and wristbands", where: "Nationwide", states: ["All"], when: "Bids close 28 Nov 2026" },
  { kind: "Discount", title: "10% off at Mama Put Kitchen, Yaba", where: "Lagos", states: ["Lagos"], when: "To 14 Jan 2027" },
  { kind: "Discount", title: "15% off chargers, Farm Centre", where: "Kano", states: ["Kano"], when: "To 31 Dec 2026" },
  { kind: "Airtime/data", title: "Monthly airtime and data rewards", where: "Via Impact Points", states: ["All"], when: "Monthly" },
  { kind: "Merch", title: "Free merch for active distributors", where: "Through your street leader", states: ["All"], when: "While stock lasts" },
  { kind: "Vendorship", title: "Become a registered TBH One vendor", where: "Vendors Center", states: ["All"], when: "Open" },
];

export const memberEvents = [
  { id: "ev-m1", title: "Village meeting: why ‘We will not steal your money’ matters", when: "2026-11-21T16:00:00+01:00", where: "Ward 4 town hall, Surulere", state: "Lagos", organiser: "Surulere Ward 4 leaders" },
  { id: "ev-m2", title: "Street leader recruitment drive", when: "2026-11-24T10:00:00+01:00", where: "Bode Thomas Street, Surulere", state: "Lagos", organiser: "TBH One Lagos" },
  { id: "ev-m3", title: "Tell One evening with the UK chapter", when: "2026-11-27T19:00:00+01:00", where: "Online", state: "All", organiser: "TBH One UK chapter" },
  { id: "ev-m4", title: "Community clean-up and project walk", when: "2026-11-29T08:00:00+01:00", where: "Ojuelegba market road", state: "Lagos", organiser: "Volunteer sub-group" },
  { id: "ev-m5", title: "Kano North youth town hall", when: "2026-11-25T15:00:00+01:00", where: "Gama Road, Nassarawa", state: "Kano", organiser: "Nassarawa ward leaders" },
];

export const recommendedProjects = [
  { slug: "hausa-radio-advert-kano-city", title: "Hausa radio advert slots in Kano city", state: "Kano", target: 1800000, raised: 1134000, category: "Media & Promotion" },
  { slug: "fliers-adeniran-ogunsanya-street-surulere", title: "Fliers and distribution for Adeniran Ogunsanya Street", state: "Lagos", target: 250000, raised: 187500, category: "Street Activation" },
];

export const memberGroups = [
  { id: "g1", name: "Surulere volunteer sub-group", kind: "Volunteer", members: 64 },
  { id: "g2", name: "Lagos creatives support group", kind: "Support", members: 212 },
  { id: "g3", name: "Ward 4 project helpers", kind: "Volunteer", members: 31 },
];

/* ---------- Street leader (SL-1…SL-10) — PRD decision 3 rate card ---------- */
export const rateCard = [
  { type: "Flier drop", unit: "per 100 fliers", rate: 500, per: 100 },
  { type: "Poster run", unit: "per 20 posters", rate: 1000, per: 20 },
  { type: "Door-to-door", unit: "per 4-hour shift", rate: 1500, per: 1 },
  { type: "Merch distribution", unit: "per 20 items", rate: 500, per: 20 },
  { type: "Village meeting host", unit: "per meeting", rate: 5000, per: 1 },
] as const;
export type TaskType = (typeof rateCard)[number]["type"];
export const rateFor = (type: string, qty: number) => {
  const r = rateCard.find((x) => x.type === type);
  return r ? Math.round((qty / r.per) * r.rate) : 0;
};

export type FieldTask = { id: string; type: TaskType; quantity: number; deadline: string; area: string; assignedBy: string; status: "To do" | "Submitted" | "Approved" | "Rejected" | "Paid" };
export const streetTasks: FieldTask[] = [
  { id: "T-3301", type: "Flier drop", quantity: 300, deadline: "2026-11-21", area: "Gama Road, houses 1–80", assignedBy: "Hauwa Sani (ward leader)", status: "To do" },
  { id: "T-3302", type: "Door-to-door", quantity: 1, deadline: "2026-11-22", area: "Gama Road, blocks C–E", assignedBy: "Hauwa Sani (ward leader)", status: "To do" },
  { id: "T-3303", type: "Poster run", quantity: 40, deadline: "2026-11-23", area: "Gama junction and market gate", assignedBy: "Hauwa Sani (ward leader)", status: "To do" },
];
export const streetEarnings = [
  { id: "E-1101", task: "Flier drop, 200 fliers", amount: 1000, status: "Paid", date: "2026-11-14" },
  { id: "E-1102", task: "Door-to-door, 4-hour shift", amount: 1500, status: "Paid", date: "2026-11-15" },
  { id: "E-1103", task: "Merch distribution, 40 items", amount: 1000, status: "Approved", date: "2026-11-18" },
  { id: "E-1104", task: "Poster run, 20 posters", amount: 1000, status: "Pending", date: "2026-11-19" },
];
export const streetMembers = [
  { firstName: "Abubakar", status: "Verified", joined: "2026-11-10" },
  { firstName: "Zainab", status: "Verified", joined: "2026-11-12" },
  { firstName: "Ifeanyi", status: "Pending", joined: "2026-11-18" },
  { firstName: "Hadiza", status: "Verified", joined: "2026-11-19" },
  { firstName: "Sadiq", status: "Pending", joined: "2026-11-20" },
  { firstName: "Maryam", status: "Verified", joined: "2026-11-20" },
];
export const streetBlocks = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M"].map((b, i) => ({ block: `Block ${b}`, houses: 8 + (i % 4) * 2, visited: [8, 10, 6, 0, 4, 12, 0, 2, 10, 0, 3, 8][i] }));
export const materials = [
  { item: "Fliers (Hausa)", received: 800, distributed: 500 },
  { item: "Posters", received: 120, distributed: 80 },
  { item: "Stickers", received: 300, distributed: 120 },
  { item: "T-shirts", received: 20, distributed: 14 },
];
export const trainingModules = [
  { id: "safety", title: "Safety in the field", minutes: 8, required: true, points: ["Work in pairs after dark", "Check in and out of every shift", "Leave if anyone becomes aggressive", "Report concerns in one tap"] },
  { id: "conduct", title: "Code of conduct", minutes: 6, required: true, points: ["Never offer money or gifts for votes", "Never ask how anyone will vote", "Never collect voter's card (PVC) numbers", "Be respectful to everyone, whatever their view"] },
  { id: "reporting", title: "Logging tasks and proof", minutes: 5, required: false, points: ["Take one clear photo per task", "Count accurately — counts are checked", "Duplicate photos are flagged automatically"] },
];
export const wardMessages = [
  { id: "m1", from: "Hauwa Sani (ward leader)", at: "2026-11-19T18:20:00+01:00", text: "Fliers for Saturday are at the ward hub from 9am. Please collect before 11am." },
  { id: "m2", from: "Hauwa Sani (ward leader)", at: "2026-11-20T08:05:00+01:00", text: "Reminder: safety check-in is required before the door-to-door shift." },
];
export const wardRanking = [
  { firstName: "Musa", street: "Gama Road", points: 860 },
  { firstName: "Bilkisu", street: "Hotoro Road", points: 1010 },
  { firstName: "Kabiru", street: "Tudun Murtala", points: 640 },
  { firstName: "Rahila", street: "Kawo Street", points: 590 },
  { firstName: "Danjuma", street: "Gidan Maza", points: 470 },
];

/* ---------- Ward leader (WL-1…WL-12) ---------- */
export const wardStreetLeaders = [
  { id: "SL-01", name: "Musa G.", street: "Gama Road", tasksDone: 14, approvalRate: 93, training: "Complete", lastCheckIn: "Today 07:42" },
  { id: "SL-02", name: "Bilkisu A.", street: "Hotoro Road", tasksDone: 19, approvalRate: 97, training: "Complete", lastCheckIn: "Today 08:10" },
  { id: "SL-03", name: "Kabiru D.", street: "Tudun Murtala", tasksDone: 9, approvalRate: 82, training: "Complete", lastCheckIn: "Yesterday 17:55" },
  { id: "SL-04", name: "Rahila J.", street: "Kawo Street", tasksDone: 7, approvalRate: 88, training: "1 of 2 modules", lastCheckIn: "2 days ago" },
  { id: "SL-05", name: "Danjuma Y.", street: "Gidan Maza", tasksDone: 4, approvalRate: 75, training: "Not started", lastCheckIn: "Never" },
];
export type Proof = { id: string; leader: string; leaderId: string; type: TaskType; count: number; gps: string; takenAt: string; submittedAt: string; ownSubmission?: boolean; duplicate?: boolean; photoHue: number };
export const proofQueue: Proof[] = [
  { id: "P-5501", leader: "Bilkisu A.", leaderId: "SL-02", type: "Flier drop", count: 300, gps: "12.0112, 8.5498 (±12 m)", takenAt: "2026-11-20T10:14:00+01:00", submittedAt: "2026-11-20T10:20:00+01:00", photoHue: 110 },
  { id: "P-5502", leader: "Kabiru D.", leaderId: "SL-03", type: "Poster run", count: 40, gps: "12.0069, 8.5551 (±9 m)", takenAt: "2026-11-20T12:02:00+01:00", submittedAt: "2026-11-20T12:05:00+01:00", photoHue: 30 },
  { id: "P-5503", leader: "Rahila J.", leaderId: "SL-04", type: "Door-to-door", count: 1, gps: "12.0140, 8.5420 (±20 m)", takenAt: "2026-11-17T15:40:00+01:00", submittedAt: "2026-11-17T19:00:00+01:00", photoHue: 200 },
  { id: "P-5504", leader: "Kabiru D.", leaderId: "SL-03", type: "Flier drop", count: 200, gps: "12.0069, 8.5551 (±9 m)", takenAt: "2026-11-20T12:02:00+01:00", submittedAt: "2026-11-20T12:30:00+01:00", duplicate: true, photoHue: 30 },
  { id: "P-5505", leader: "You (ward leader)", leaderId: "SELF", type: "Village meeting host", count: 1, gps: "12.0101, 8.5480 (±15 m)", takenAt: "2026-11-19T18:00:00+01:00", submittedAt: "2026-11-19T20:30:00+01:00", ownSubmission: true, photoHue: 0 },
];
export const wardStreets = [
  { street: "Gama Road", leader: "Musa G.", houses: 96, visited: 71, materials: 520 },
  { street: "Hotoro Road", leader: "Bilkisu A.", houses: 120, visited: 104, materials: 690 },
  { street: "Tudun Murtala", leader: "Kabiru D.", houses: 84, visited: 40, materials: 300 },
  { street: "Kawo Street", leader: "Rahila J.", houses: 60, visited: 22, materials: 180 },
  { street: "Gidan Maza", leader: "Danjuma Y.", houses: 75, visited: 8, materials: 60 },
  { street: "Sabon Gari Lane", leader: null, houses: 70, visited: 0, materials: 0 },
  { street: "Market Close", leader: null, houses: 40, visited: 0, materials: 0 },
  { street: "Unguwa Uku Road", leader: null, houses: 110, visited: 0, materials: 0 },
];
export const wardIncidents = [
  { id: "INC-2201", type: "Harassment at distribution point", severity: "High", status: "With state focal point", reported: "2026-11-18", restricted: false },
  { id: "INC-2207", type: "Restricted", severity: "Critical", status: "Routed to National Safeguarding Lead", reported: "2026-11-19", restricted: true },
  { id: "INC-2210", type: "Lost materials (posters)", severity: "Low", status: "Resolved", reported: "2026-11-20", restricted: false },
];
export const recruitment = [
  { name: "Aminu S.", street: "Sabon Gari Lane", stage: "Applied", vetting: "ID check pending" },
  { name: "Grace O.", street: "Market Close", stage: "Interviewed", vetting: "References received" },
  { name: "Yakubu I.", street: "Unguwa Uku Road", stage: "Vetted", vetting: "Cleared" },
  { name: "Fatima B.", street: "Unguwa Uku Road", stage: "Training", vetting: "Cleared" },
];

/* ---------- State coordinator (ST-1…ST-11) — Kaduna demo ---------- */
export const stateLgas = [
  { lga: "Kaduna North", wards: 12, leaders: 11, streetsCovered: 148, members: 18240, activity: 4, overdue: 0 },
  { lga: "Kaduna South", wards: 13, leaders: 9, streetsCovered: 102, members: 15410, activity: 3, overdue: 1 },
  { lga: "Zaria", wards: 13, leaders: 10, streetsCovered: 120, members: 16880, activity: 3, overdue: 0 },
  { lga: "Sabon Gari", wards: 11, leaders: 6, streetsCovered: 51, members: 7920, activity: 2, overdue: 2 },
  { lga: "Chikun", wards: 12, leaders: 5, streetsCovered: 38, members: 6410, activity: 2, overdue: 1 },
  { lga: "Igabi", wards: 12, leaders: 3, streetsCovered: 19, members: 3280, activity: 1, overdue: 3 },
  { lga: "Kajuru", wards: 10, leaders: 1, streetsCovered: 4, members: 910, activity: 1, overdue: 0 },
  { lga: "Kachia", wards: 12, leaders: 4, streetsCovered: 22, members: 2700, activity: 1, overdue: 0 },
  { lga: "Jema'a", wards: 12, leaders: 5, streetsCovered: 30, members: 3900, activity: 2, overdue: 0 },
  { lga: "Soba", wards: 11, leaders: 0, streetsCovered: 0, members: 640, activity: 0, overdue: 0 },
  { lga: "Ikara", wards: 10, leaders: 2, streetsCovered: 9, members: 1210, activity: 1, overdue: 1 },
  { lga: "Kauru", wards: 11, leaders: 0, streetsCovered: 0, members: 380, activity: 0, overdue: 0 },
];
export const statePipeline = [
  { id: "PR-KD-14", title: "Fliers for Zaria city wards", lga: "Zaria", cost: 420000, stage: "Funded" },
  { id: "PR-KD-15", title: "Hausa radio slots, Kaduna", lga: "Kaduna North", cost: 1500000, stage: "Published" },
  { id: "PR-KD-16", title: "Borehole repair, Gonin Gora", lga: "Chikun", cost: 580000, stage: "Approved" },
  { id: "PR-KD-17", title: "Village meeting PA system", lga: "Igabi", cost: 210000, stage: "Proposed" },
  { id: "PR-KD-18", title: "Posters for Kafanchan market", lga: "Jema'a", cost: 160000, stage: "Delivered" },
  { id: "PR-KD-19", title: "Translation into Gbagyi", lga: "Chikun", cost: 120000, stage: "Proposed" },
];
export const stateApprovals = [
  { id: "AP-901", kind: "Ward leader application", subject: "Sabon Gari — Jushi ward", detail: "ID verified, 2 references", age: "6 h" },
  { id: "AP-902", kind: "Community project proposal", subject: "Village meeting PA system, Igabi", detail: "₦210,000 · 3 quotes attached", age: "1 day" },
  { id: "AP-903", kind: "Escalated task approval", subject: "Poster run proof, Ikara (over 48 h)", detail: "Ward leader inactive", age: "3 days" },
  { id: "AP-904", kind: "Ward leader application", subject: "Soba — Maigana ward", detail: "ID check pending", age: "2 days" },
];
export const stateIncidents = [
  { id: "INC-KD-31", type: "Threat to a street leader", lga: "Zaria", severity: "Critical", reportedAt: Date.now() - 22 * 60_000 },
  { id: "INC-KD-29", type: "Fake TBH One payment link circulating", lga: "Kaduna South", severity: "High", reportedAt: Date.now() - 9 * 3600_000 },
  { id: "INC-KD-24", type: "Damaged materials at warehouse", lga: "Kaduna North", severity: "Low", reportedAt: Date.now() - 40 * 3600_000 },
];
export const statePayments = [
  { id: "PAY-KD-77", payee: "Ward leader, Zaria (project management)", amount: 85000, firstReview: "Approved by Ward focal point", reason: "Above ₦50,000 threshold" },
  { id: "PAY-KD-78", payee: "Logistics vendor, Kaduna", amount: 240000, firstReview: "Approved by State logistics", reason: "Above ₦50,000 threshold" },
];
export const stateEvents = [
  { id: "SE-1", title: "Zaria youth town hall", lga: "Zaria", date: "2026-11-28", checklist: 3, policeNotice: true },
  { id: "SE-2", title: "Kafanchan village meeting", lga: "Jema'a", date: "2026-11-30", checklist: 2, policeNotice: false },
  { id: "SE-3", title: "Kaduna North leaders' training", lga: "Kaduna North", date: "2026-12-02", checklist: 3, policeNotice: true },
];
export const stateLogistics = [
  { item: "Fliers", warehouse: 42000, dispatched: 31000, confirmed: 28500 },
  { item: "Posters", warehouse: 6800, dispatched: 5200, confirmed: 4900 },
  { item: "T-shirts", warehouse: 1900, dispatched: 1400, confirmed: 1200 },
];

/* ---------- Country coordinator (CC-1…CC-9) — UK chapter demo ---------- */
export const chapter = { name: "TBH One UK chapter", country: "United Kingdom", timeZone: "Europe/London", members: 1840, activeThisWeek: 412, conversations: 2930 };
export const homeStates = [
  { state: "Anambra", members: 310 }, { state: "Lagos", members: 280 }, { state: "Imo", members: 190 }, { state: "Enugu", members: 170 },
  { state: "Edo", members: 140 }, { state: "Oyo", members: 120 }, { state: "Kano", members: 95 }, { state: "Delta", members: 92 },
  { state: "Rivers", members: 88 }, { state: "Abia", members: 80 }, { state: "Kaduna", members: 61 }, { state: "FCT", members: 58 },
];
export const talkingPoints = [
  { lang: "English", text: "We will not steal your money. When public money is not stolen, there is enough for roads, schools, clinics and jobs." },
  { lang: "Pidgin", text: "We no go thief your money. If dem no thief the money, e go reach road, school, hospital and work for everybody." },
  { lang: "Yorùbá", text: "A ò ní jí owó yín. Bí wọn kò bá jí owó ìlú, owó yóò tó fún ọ̀nà, ilé-ẹ̀kọ́, ilé-ìwòsàn àti iṣẹ́." },
  { lang: "Hausa", text: "Ba za mu saci kuɗinku ba. Idan ba a sace kuɗin jama'a ba, za a sami isasshen kuɗi don hanyoyi, makarantu, asibitoci da ayyukan yi." },
  { lang: "Igbo", text: "Anyị agaghị ezu ohi ego unu. Ọ bụrụ na e zughị ego ọha, ọ ga-ezu maka okporo ụzọ, ụlọ akwụkwọ, ụlọ ọgwụ na ọrụ." },
];
export const chapterEvents = [
  { id: "CE-1", title: "Tell One calling night", startUtc: "2026-11-27T19:00:00Z", where: "Online (video call)", rsvps: 84 },
  { id: "CE-2", title: "Skills bank onboarding", startUtc: "2026-12-03T18:30:00Z", where: "Online", rsvps: 36 },
  { id: "CE-3", title: "London in-person meet-up", startUtc: "2026-12-06T14:00:00Z", where: "Community hall, Peckham", rsvps: 120 },
];
export const skillsBank = [
  { name: "Ngozi A.", skills: ["Design", "Social media"], hours: 4 },
  { name: "Tunde B.", skills: ["Web development"], hours: 6 },
  { name: "Halima K.", skills: ["Legal", "Translation (Hausa)"], hours: 3 },
  { name: "Emeka O.", skills: ["Video editing", "Media"], hours: 5 },
  { name: "Bisi L.", skills: ["Data analysis"], hours: 2 },
];
export const remoteTasks = [
  { id: "RT-1", title: "Design WhatsApp cards for Tell One week 4", skill: "Design" },
  { id: "RT-2", title: "Fix accessibility issues on a ward microsite", skill: "Web development" },
  { id: "RT-3", title: "Review volunteer agreement wording", skill: "Legal" },
  { id: "RT-4", title: "Cut 30-second Tell One explainer", skill: "Video editing" },
];
export const hometownProjects = [
  { id: "HP-1", title: "Community borehole repair, Ward 4, Nsukka", lga: "Nsukka, Enugu", need: "Engineer to review repair plan (skills)" },
  { id: "HP-2", title: "Fliers for Onitsha main market", lga: "Onitsha North, Anambra", need: "Design of Igbo flier (skills)" },
  { id: "HP-3", title: "Village meeting PA system, Ihiala", lga: "Ihiala, Anambra", need: "Donated PA equipment (in-kind)" },
];
export const chapterRanking = [
  { chapter: "United Kingdom", conversations: 2930 },
  { chapter: "United States", conversations: 2610 },
  { chapter: "Canada", conversations: 1480 },
  { chapter: "Germany", conversations: 960 },
  { chapter: "Ghana", conversations: 720 },
  { chapter: "Togo", conversations: 210 },
];

/* ---------- Creators, associates, translators (CR-1…CR-9) ---------- */
export type Brief = { id: string; title: string; kind: "Video" | "Graphic" | "Translation" | "Copy" | "Audio"; language: string; location: string; fee: number; deadline: string; skills: string[]; peopleFeatured: boolean };
export const briefs: Brief[] = [
  { id: "BR-401", title: "30-second skit: ‘Where did the road money go?’", kind: "Video", language: "Pidgin", location: "Lagos", fee: 60000, deadline: "2026-11-28", skills: ["Video"], peopleFeatured: true },
  { id: "BR-402", title: "Translate the Bring One explainer into Yorùbá", kind: "Translation", language: "Yorùbá", location: "Remote", fee: 25000, deadline: "2026-11-25", skills: ["Translation"], peopleFeatured: false },
  { id: "BR-403", title: "Instagram carousel: corruption chain (8 slides)", kind: "Graphic", language: "English", location: "Remote", fee: 40000, deadline: "2026-11-27", skills: ["Design"], peopleFeatured: false },
  { id: "BR-404", title: "Hausa radio jingle script, 45 seconds", kind: "Copy", language: "Hausa", location: "Kano", fee: 30000, deadline: "2026-11-30", skills: ["Copywriting"], peopleFeatured: false },
  { id: "BR-405", title: "Market vox pops, Ibadan (with consent forms)", kind: "Video", language: "Yorùbá", location: "Oyo", fee: 80000, deadline: "2026-12-04", skills: ["Video"], peopleFeatured: true },
];
export const translationMemory = [
  { term: "We will not steal your money.", English: "We will not steal your money.", Pidgin: "We no go thief your money.", Yorùbá: "A ò ní jí owó yín.", Hausa: "Ba za mu saci kuɗinku ba.", Igbo: "Anyị agaghị ezu ohi ego unu." },
  { term: "Tell One", English: "Tell One", Pidgin: "Tell One", Yorùbá: "Tell One (Sọ fún ẹnìkan)", Hausa: "Tell One (Faɗa wa ɗaya)", Igbo: "Tell One (Gwa otu onye)" },
  { term: "Bring One", English: "Bring One", Pidgin: "Bring One", Yorùbá: "Bring One (Mú ẹnìkan wá)", Hausa: "Bring One (Kawo ɗaya)", Igbo: "Bring One (Kpọta otu onye)" },
  { term: "Help One", English: "Help One", Pidgin: "Help One", Yorùbá: "Help One (Ran ẹnìkan lọ́wọ́)", Hausa: "Help One (Taimaki ɗaya)", Igbo: "Help One (Nyere otu onye aka)" },
  { term: "Nigeria Democratic Congress (NDC)", English: "Nigeria Democratic Congress (NDC)", Pidgin: "Nigeria Democratic Congress (NDC)", Yorùbá: "Nigeria Democratic Congress (NDC)", Hausa: "Nigeria Democratic Congress (NDC)", Igbo: "Nigeria Democratic Congress (NDC)" },
  { term: "Fund a Project", English: "Fund a Project", Pidgin: "Fund Project", Yorùbá: "Ṣe Onígbọ̀wọ́ Iṣẹ́ Àkànṣe", Hausa: "Ɗauki Nauyin Aiki", Igbo: "Kwado Ọrụ" },
];
export const creatorPerformance = [
  { title: "Skit: ‘Market prices’ (Pidgin)", views: 182400, shares: 9200, engagement: 7.1 },
  { title: "Carousel: Help One explained", views: 64100, shares: 2100, engagement: 5.4 },
  { title: "Yorùbá tagline poster", views: 41000, shares: 3300, engagement: 8.2 },
];

/* ---------- Vendors (VN-1…VN-10) ---------- */
export const vendorProfile = { company: "Ankara Prints Ltd", rc: "RC 1234567 (demo)", city: "Lagos", categories: ["Print", "Merch"], verification: "Verified", since: "2026-10-28" };
export const rfqs = [
  { id: "RFQ-210", title: "50,000 A5 fliers, Hausa and English", category: "Print", location: "Kano", closes: "2026-11-26", criteria: "Price 50%, delivery time 30%, past performance 20%" },
  { id: "RFQ-211", title: "2,000 tagline T-shirts (mixed sizes)", category: "Merch", location: "Lagos", closes: "2026-11-28", criteria: "Price 40%, quality sample 40%, delivery time 20%" },
  { id: "RFQ-212", title: "300 street banners (3 m)", category: "Print", location: "Kaduna", closes: "2026-12-01", criteria: "Price 50%, delivery time 30%, local presence 20%" },
];
export const vendorBids = [
  { id: "BID-88", rfq: "RFQ-198 · 20,000 posters, Lagos", amount: 1900000, outcome: "Awarded", reason: "Lowest compliant price; 5-day delivery" },
  { id: "BID-91", rfq: "RFQ-201 · 1,000 caps", amount: 4200000, outcome: "Not awarded", reason: "Award went to a bid 12% lower with the same delivery time" },
  { id: "BID-95", rfq: "RFQ-206 · Sticker sheets", amount: 620000, outcome: "Under evaluation", reason: "Evaluation closes 24 Nov 2026" },
];
export type VendorOrder = { id: string; item: string; qty: number; value: number; due: string; delivered: boolean; confirmedBy?: string; invoiced: boolean; paid: "Unpaid" | "Processing" | "Paid" };
export const vendorOrders: VendorOrder[] = [
  { id: "PO-3301", item: "Posters A2, Lagos wards", qty: 20000, value: 1900000, due: "2026-11-20", delivered: true, confirmedBy: "Funmilayo Adeyemi (ward leader)", invoiced: true, paid: "Paid" },
  { id: "PO-3307", item: "Sticker sheets", qty: 10000, value: 620000, due: "2026-11-24", delivered: true, confirmedBy: "TBH One Lagos logistics", invoiced: false, paid: "Unpaid" },
  { id: "PO-3312", item: "Tagline T-shirts, Yorùbá", qty: 800, value: 3200000, due: "2026-11-29", delivered: false, invoiced: false, paid: "Unpaid" },
];
export const profitShare = [
  { period: "Week 46 (9–15 Nov)", units: 412, revenue: 3296000, vendorShare: 2307200, campaignMargin: 988800, status: "Settled" },
  { period: "Week 47 (16–22 Nov)", units: 538, revenue: 4304000, vendorShare: 3012800, campaignMargin: 1291200, status: "Awaiting Finance reconciliation" },
];
export const vendorOffers = [
  { id: "OF-1", title: "15% off printing for members' businesses", redemptions: 37, active: true, codes: ["TBH-OF1-K7P2", "TBH-OF1-Q9M4", "TBH-OF1-Z2X8"] },
  { id: "OF-2", title: "Free design proof on orders over ₦20,000", redemptions: 12, active: true, codes: ["TBH-OF2-A1B2"] },
];
export const sponsorships = [
  { id: "SP-1", what: "Daily giveaway, 24 Nov 2026 — 50 caps", reach: "Est. 210,000 impressions", status: "Booked" },
  { id: "SP-2", what: "Shared ad slot, Lagos radio, week 48", reach: "Est. 1.2m listeners", status: "Report due 5 Dec" },
];

/* ---------- NDC aspirant services (AS-1…AS-7) ---------- */
export const packages = [
  { id: "PK-PHOTO", name: "Profile photoshoot", price: 0, note: "Free for NDC aspirants", includes: "Studio and outdoor shoot, 20 retouched images, usage rights" },
  { id: "PK-WEB", name: "Personal website", price: 150000, note: "Discounted", includes: "5-page campaign site, hosting until Feb 2027, accessibility checked" },
  { id: "PK-WIKI", name: "Wikipedia profile support", price: 50000, note: "Discounted", includes: "Sourcing guidance only — we never pay for or write promotional Wikipedia edits" },
  { id: "PK-MEDIA", name: "Media production", price: 250000, note: "Discounted", includes: "Two 60-second videos, captions in two languages" },
  { id: "PK-PR", name: "PR & speaking engagements", price: 120000, note: "Discounted", includes: "Media list, 3 pitched appearances, speaking notes" },
  { id: "PK-MKT", name: "Marketing campaign", price: 300000, note: "Discounted", includes: "4-week social plan, creative pack, reporting" },
];
export type AspirantOrder = { id: string; pkg: string; status: "Scheduled" | "In production" | "Review" | "Delivered"; due: string; amount: number; deliverable?: string; decision?: "Approved" | "Changes requested"; comments?: string };
export const aspirantOrders: AspirantOrder[] = [
  { id: "AO-120", pkg: "Profile photoshoot", status: "Delivered", due: "2026-11-12", amount: 0, deliverable: "20 retouched portraits", decision: "Approved" },
  { id: "AO-121", pkg: "Personal website", status: "Review", due: "2026-11-24", amount: 150000, deliverable: "Draft site: home, about, plan, events, contact" },
  { id: "AO-122", pkg: "Media production", status: "In production", due: "2026-12-01", amount: 250000 },
  { id: "AO-123", pkg: "PR & speaking engagements", status: "Scheduled", due: "2026-12-05", amount: 120000 },
];
export const sharedAdSlots = [
  { id: "SA-1", outlet: "Daily newspaper, half page (Abuja edition)", date: "2026-12-02", slots: 6, taken: 4, costPerSlot: 85000 },
  { id: "SA-2", outlet: "Radio, 60 s joint spot (Minna FM)", date: "2026-12-05", slots: 4, taken: 1, costPerSlot: 45000 },
  { id: "SA-3", outlet: "TV, 30 s joint spot (regional)", date: "2026-12-09", slots: 5, taken: 5, costPerSlot: 160000 },
];
export const aspirantCalendar = [
  { date: "2026-11-24", what: "Website review call", kind: "Review" },
  { date: "2026-11-27", what: "Video shoot, Minna", kind: "Shoot" },
  { date: "2026-12-02", what: "Shared newspaper advert runs", kind: "Advert" },
  { date: "2026-12-05", what: "Radio interview (pitched)", kind: "Media" },
];

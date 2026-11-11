/**
 * The 16 stakeholder dashboards from the Stakeholder Dashboards PRD (§2, §5–13, §17).
 * Each role has its own navigation and its own screens; only the shell is shared.
 * `scope` mirrors PRD §3 "Data scope by role".
 */
export type RoleKey =
  | "member"
  | "street-leader"
  | "ward-leader"
  | "state-coordinator"
  | "country-coordinator"
  | "creator"
  | "vendor"
  | "aspirant"
  | "national"
  | "finance"
  | "safeguarding"
  | "dpo"
  | "call-centre"
  | "shopper"
  | "shop-ops"
  | "delivery";

export type RoleSection = { slug: string; label: string; icon: string; prd?: string };
export type Role = {
  key: RoleKey;
  label: string;
  short: string;
  description: string;
  scope: string;
  twoFactor: boolean; // SH-2: every role above Member
  sections: RoleSection[];
};

export const roles: Role[] = [
  {
    key: "member",
    label: "Member & Project Funder",
    short: "Member",
    description: "What can I do today, what have I earned, and where did my money go?",
    scope: "Own data only, plus public project data",
    twoFactor: false,
    sections: [
      { slug: "overview", label: "Today", icon: "Sun", prd: "MB-1, MB-2" },
      { slug: "points", label: "Impact Points", icon: "Award", prd: "MB-2, MB-3, MB-11" },
      { slug: "referrals", label: "Referrals", icon: "UserPlus", prd: "MB-4" },
      { slug: "giveaway", label: "Daily giveaway", icon: "Gift", prd: "MB-5" },
      { slug: "benefits", label: "Benefits", icon: "Briefcase", prd: "MB-6" },
      { slug: "events", label: "Events near me", icon: "CalendarDays", prd: "MB-7" },
      { slug: "projects", label: "My funded projects", icon: "HandCoins", prd: "MB-8, MB-9" },
      { slug: "tell-one", label: "Tell One log", icon: "Phone", prd: "MB-10" },
      { slug: "groups", label: "Groups", icon: "Users", prd: "MB-12" },
      { slug: "id-card", label: "Member ID", icon: "IdCard", prd: "MB-13" },
      { slug: "apply", label: "Apply for a role", icon: "BadgeCheck", prd: "MB-14" },
      { slug: "settings", label: "Profile & privacy", icon: "Settings", prd: "SH-13" },
    ],
  },
  {
    key: "street-leader",
    label: "Street Leader",
    short: "Street leader",
    description: "Big buttons, few words, works offline. Every task ends in a photo and a payment.",
    scope: "Own street; members by first name and status only",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Today's tasks", icon: "ListChecks", prd: "SL-1" },
      { slug: "log", label: "Log a task", icon: "Camera", prd: "SL-2" },
      { slug: "earnings", label: "My earnings", icon: "Wallet", prd: "SL-3" },
      { slug: "street", label: "My street", icon: "MapPin", prd: "SL-4" },
      { slug: "materials", label: "Materials", icon: "Package", prd: "SL-5" },
      { slug: "recruit", label: "Recruit", icon: "UserPlus", prd: "SL-6" },
      { slug: "safety", label: "Safety check-in", icon: "ShieldCheck", prd: "SL-7" },
      { slug: "training", label: "Training", icon: "GraduationCap", prd: "SL-8" },
      { slug: "messages", label: "Messages", icon: "MessageSquare", prd: "SL-9" },
      { slug: "rank", label: "Points & rank", icon: "Trophy", prd: "SL-10" },
    ],
  },
  {
    key: "ward-leader",
    label: "Ward Leader",
    short: "Ward leader",
    description: "Run the ward like a small team: assign work, approve proof, host meetings, propose projects.",
    scope: "Own ward and its streets",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Ward overview", icon: "LayoutDashboard", prd: "WL-1" },
      { slug: "roster", label: "Street leaders", icon: "Users", prd: "WL-2" },
      { slug: "approvals", label: "Approval queue", icon: "ClipboardCheck", prd: "WL-3" },
      { slug: "assign", label: "Assign tasks", icon: "ListPlus", prd: "WL-4" },
      { slug: "coverage", label: "Coverage map", icon: "Map", prd: "WL-5" },
      { slug: "events", label: "Events", icon: "CalendarDays", prd: "WL-6" },
      { slug: "projects", label: "Projects", icon: "HandCoins", prd: "WL-7" },
      { slug: "materials", label: "Materials", icon: "Package", prd: "WL-8" },
      { slug: "earnings", label: "My earnings", icon: "Wallet", prd: "WL-9" },
      { slug: "incidents", label: "Incidents", icon: "ShieldAlert", prd: "WL-10" },
      { slug: "broadcast", label: "Broadcast", icon: "Megaphone", prd: "WL-11" },
      { slug: "recruitment", label: "Recruitment", icon: "UserPlus", prd: "WL-12" },
    ],
  },
  {
    key: "state-coordinator",
    label: "State Coordinator & Focal Point",
    short: "State coordinator",
    description: "Spot weak wards, unblock approvals and respond to incidents across one state.",
    scope: "Own state, its LGAs and wards (aggregated; no individual member records)",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "State scorecard", icon: "LayoutDashboard", prd: "ST-1" },
      { slug: "map", label: "LGA & ward map", icon: "Map", prd: "ST-2" },
      { slug: "weak-spots", label: "Weak spots", icon: "TriangleAlert", prd: "ST-3" },
      { slug: "pipeline", label: "Project pipeline", icon: "GitBranch", prd: "ST-4" },
      { slug: "approvals", label: "Approvals", icon: "ClipboardCheck", prd: "ST-5" },
      { slug: "logistics", label: "Materials & logistics", icon: "Truck", prd: "ST-6" },
      { slug: "events", label: "Events", icon: "CalendarDays", prd: "ST-7" },
      { slug: "incidents", label: "Incident queue", icon: "ShieldAlert", prd: "ST-8" },
      { slug: "payments", label: "Payments review", icon: "Banknote", prd: "ST-9" },
      { slug: "leaderboards", label: "Leaderboards", icon: "Trophy", prd: "ST-10" },
      { slug: "export", label: "Export", icon: "Download", prd: "ST-11" },
    ],
  },
  {
    key: "country-coordinator",
    label: "Country Coordinator (Diaspora)",
    short: "Country coordinator",
    description: "Turn Nigerians abroad into Tell One messengers and skilled volunteers — no cash handling.",
    scope: "Own diaspora chapter",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Chapter overview", icon: "LayoutDashboard", prd: "CC-1" },
      { slug: "home-states", label: "Home-state map", icon: "Map", prd: "CC-2" },
      { slug: "tell-one", label: "Tell One campaign", icon: "Phone", prd: "CC-3" },
      { slug: "events", label: "Chapter events", icon: "CalendarDays", prd: "CC-4" },
      { slug: "skills", label: "Skills bank", icon: "Wrench", prd: "CC-5" },
      { slug: "in-kind", label: "In-kind support", icon: "Gift", prd: "CC-6" },
      { slug: "funding-offers", label: "Funding offers", icon: "Scale", prd: "CC-7" },
      { slug: "hometown", label: "Hometown projects", icon: "House", prd: "CC-8" },
      { slug: "leaderboard", label: "Chapter ranking", icon: "Trophy", prd: "CC-9" },
    ],
  },
  {
    key: "creator",
    label: "Creators, Associates & Translators",
    short: "Creator",
    description: "Pick up paid briefs, submit work, pass creative and compliance review, get paid.",
    scope: "Own briefs and tasks",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Open briefs", icon: "Inbox", prd: "CR-1" },
      { slug: "work", label: "My work", icon: "SquareKanban", prd: "CR-2" },
      { slug: "submit", label: "Submit work", icon: "Upload", prd: "CR-3" },
      { slug: "reviews", label: "Review feedback", icon: "MessageSquareText", prd: "CR-4" },
      { slug: "earnings", label: "Earnings", icon: "Wallet", prd: "CR-5" },
      { slug: "assets", label: "Asset library", icon: "FolderOpen", prd: "CR-6" },
      { slug: "performance", label: "Performance", icon: "ChartColumn", prd: "CR-7" },
      { slug: "translation-memory", label: "Translation memory", icon: "Languages", prd: "CR-8" },
      { slug: "conduct", label: "Code of conduct", icon: "FilePen", prd: "CR-9" },
    ],
  },
  {
    key: "vendor",
    label: "Vendors, Partners & Businesses",
    short: "Vendor",
    description: "Bid, deliver, invoice, list member offers and sponsor giveaways — with a public procurement trail.",
    scope: "Own company's records",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Company profile", icon: "Building", prd: "VN-1" },
      { slug: "requests", label: "Open requests", icon: "Inbox", prd: "VN-2" },
      { slug: "bids", label: "My bids", icon: "Gavel", prd: "VN-3" },
      { slug: "orders", label: "Orders", icon: "Package", prd: "VN-4" },
      { slug: "invoices", label: "Invoices & payments", icon: "Receipt", prd: "VN-5" },
      { slug: "profit-share", label: "Merch profit-share", icon: "ChartPie", prd: "VN-6" },
      { slug: "offers", label: "Member offers", icon: "Tag", prd: "VN-7" },
      { slug: "sponsorships", label: "Sponsorships", icon: "Megaphone", prd: "VN-8" },
      { slug: "reports", label: "Partner reports", icon: "ChartColumn", prd: "VN-9" },
      { slug: "conflicts", label: "Conflict of interest", icon: "FilePen", prd: "VN-10" },
    ],
  },
  {
    key: "aspirant",
    label: "NDC Aspirant Services",
    short: "NDC aspirant",
    description: "Order, track and approve TBH One service-line work in one place.",
    scope: "Own service orders",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Packages", icon: "Boxes", prd: "AS-1" },
      { slug: "orders", label: "My orders", icon: "ListOrdered", prd: "AS-2" },
      { slug: "review", label: "Review & approve", icon: "SquareCheck", prd: "AS-3" },
      { slug: "shared-ads", label: "Shared ads", icon: "Newspaper", prd: "AS-4" },
      { slug: "invoices", label: "Invoices & spend", icon: "Receipt", prd: "AS-5" },
      { slug: "calendar", label: "Calendar", icon: "CalendarDays", prd: "AS-6" },
      { slug: "assets", label: "Assets", icon: "FolderOpen", prd: "AS-7" },
    ],
  },
  {
    key: "national",
    label: "National Command Centre",
    short: "National team",
    description: "The whole movement at a glance: reach, funding, delivery and risk.",
    scope: "Everything, aggregated",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Movement scorecard", icon: "LayoutDashboard", prd: "NC-1" },
      { slug: "map", label: "National map", icon: "Map", prd: "NC-2" },
      { slug: "funding", label: "Funding & spend", icon: "Banknote", prd: "NC-3" },
      { slug: "pipeline", label: "Project pipeline", icon: "GitBranch", prd: "NC-4" },
      { slug: "content", label: "Content & media", icon: "Clapperboard", prd: "NC-5" },
      { slug: "calendar", label: "Countdown & calendar", icon: "CalendarClock", prd: "NC-6" },
      { slug: "risk", label: "Risk panel", icon: "ShieldAlert", prd: "NC-7" },
      { slug: "publisher", label: "Project publisher", icon: "FilePlus", prd: "NC-8" },
      { slug: "giveaways", label: "Giveaway manager", icon: "Gift", prd: "NC-9" },
      { slug: "users", label: "Users & roles", icon: "UserCog", prd: "NC-10" },
      { slug: "visibility", label: "Search & AI visibility", icon: "Search", prd: "NC-11" },
    ],
  },
  {
    key: "finance",
    label: "Finance Controller",
    short: "Finance",
    description: "Every naira traceable: reconcile, hold, approve and release with two signatures, publish reports.",
    scope: "All financial records",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Inflows ledger", icon: "BookOpen", prd: "FN-1" },
      { slug: "payouts", label: "Payout queue", icon: "Banknote", prd: "FN-2" },
      { slug: "reconciliation", label: "Reconciliation", icon: "Scale", prd: "FN-3" },
      { slug: "holds", label: "Holds & clearance", icon: "Lock", prd: "FN-4" },
      { slug: "reports", label: "Public spend report", icon: "FileChartColumn", prd: "FN-5, FN-6" },
      { slug: "fraud", label: "Fraud flags", icon: "Siren", prd: "FN-7" },
      { slug: "audit", label: "Audit log", icon: "ScrollText", prd: "SH-14" },
    ],
  },
  {
    key: "safeguarding",
    label: "Safeguarding Lead & Focal Points",
    short: "Safeguarding",
    description: "Triage, escalate and resolve incidents within response-time targets. Restricted access.",
    scope: "Incident records only",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Incident queue", icon: "Siren", prd: "SG-1" },
      { slug: "cases", label: "Case records", icon: "FolderLock", prd: "SG-2" },
      { slug: "contacts", label: "Escalation contacts", icon: "PhoneCall", prd: "SG-3" },
      { slug: "suspensions", label: "Suspensions", icon: "UserX", prd: "SG-4" },
      { slug: "report", label: "Weekly report", icon: "FileChartColumn", prd: "SG-5" },
    ],
  },
  {
    key: "dpo",
    label: "Data Protection Officer",
    short: "DPO",
    description: "Consent, data requests, feature approvals and breaches under the NDPA 2023 and GDPR.",
    scope: "Consent and request logs",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Consent register", icon: "ClipboardList", prd: "DP-1" },
      { slug: "requests", label: "Data requests", icon: "Inbox", prd: "DP-2" },
      { slug: "breaches", label: "Breach log", icon: "ShieldAlert", prd: "DP-3" },
      { slug: "features", label: "Feature approvals", icon: "ToggleRight", prd: "DP-4" },
      { slug: "access-log", label: "Access log", icon: "ScrollText", prd: "DP-5" },
    ],
  },
  {
    key: "call-centre",
    label: "Call Centre Agent",
    short: "Call centre",
    description: "Answer escalations from the AI Call Agent and route tickets to support, safeguarding or finance.",
    scope: "Caller's member record only (no payment details)",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Escalations", icon: "Headset", prd: "CA-2" },
      { slug: "lookup", label: "Caller lookup", icon: "Search", prd: "CA-1" },
      { slug: "tickets", label: "Tickets", icon: "Ticket", prd: "CA-3" },
      { slug: "scripts", label: "Scripted answers", icon: "BookOpenText", prd: "CA-4" },
    ],
  },
  {
    key: "shopper",
    label: "Shopper",
    short: "Shopper",
    description: "Your orders, coupons, partner offers, tracking and returns.",
    scope: "Own orders, coupons and offers",
    twoFactor: false,
    sections: [
      { slug: "overview", label: "My orders", icon: "Package", prd: "EC-17, EC-21" },
      { slug: "coupons", label: "Coupons", icon: "Ticket", prd: "EC-7, EC-8" },
      { slug: "offers", label: "Partner offers", icon: "Tag", prd: "EC-9" },
      { slug: "returns", label: "Returns & refunds", icon: "Undo2", prd: "EC-22" },
      { slug: "addresses", label: "Delivery details", icon: "MapPin", prd: "EC-11" },
      { slug: "support", label: "Order support", icon: "LifeBuoy", prd: "SH-11" },
    ],
  },
  {
    key: "shop-ops",
    label: "Shop Operations",
    short: "Shop operations",
    description: "Sales, stock and late orders at a glance — and stop coupon abuse.",
    scope: "All products, orders, coupons and shop vendors",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "Sales overview", icon: "LayoutDashboard", prd: "EC-ADM-1" },
      { slug: "orders", label: "Orders & fulfilment", icon: "Package", prd: "EC-17, EC-18" },
      { slug: "products", label: "Products", icon: "Shirt", prd: "EC-ADM-2" },
      { slug: "coupons", label: "Coupons & offers", icon: "Ticket", prd: "EC-ADM-3" },
      { slug: "returns", label: "Returns & refunds", icon: "Undo2", prd: "EC-22" },
      { slug: "vendors", label: "Vendor performance", icon: "Factory", prd: "EC-18, EC-24" },
      { slug: "fraud", label: "Fraud alerts", icon: "Siren", prd: "EC-ADM-4" },
    ],
  },
  {
    key: "delivery",
    label: "Delivery Partner",
    short: "Delivery partner",
    description: "Assigned shipments only: collect, deliver and confirm with a photo or code.",
    scope: "Assigned shipments only",
    twoFactor: true,
    sections: [
      { slug: "overview", label: "My shipments", icon: "Truck", prd: "EC-19" },
      { slug: "pickups", label: "Pickups", icon: "PackageOpen", prd: "EC-19" },
      { slug: "confirm", label: "Confirm delivery", icon: "PackageCheck", prd: "EC-21" },
      { slug: "failed", label: "Failed deliveries", icon: "PackageX", prd: "EC-21" },
    ],
  },
];

export const roleByKey = (k: string) => roles.find((r) => r.key === k);
export const dashboardPaths = () => roles.flatMap((r) => r.sections.map((s) => ({ role: r.key, section: s.slug })));

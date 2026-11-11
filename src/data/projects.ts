/**
 * DEMO fundable projects (Concept Note §5 categories). Names, places and figures are illustrative
 * and labelled "Demo data" on every page; replace with published records before launch.
 */
export type ProjectCategory = "Team & Technology" | "Voter Contact" | "Media & Promotion" | "Street Activation" | "Community & Rewards";
export type ProjectStatus = "open" | "funded" | "delivering" | "delivered";

export type FundableProject = {
  slug: string;
  title: string;
  category: ProjectCategory;
  state: string;
  lga: string;
  summary: string;
  funds: string[]; // what the money pays for
  target: number;
  raised: number;
  spent: number;
  funders: number;
  status: ProjectStatus;
  proposedBy: string;
  published: string;
  updates: { date: string; text: string }[];
  proof: { label: string; status: "pending" | "uploaded" }[];
};

export const PROJECT_CATEGORIES: ProjectCategory[] = ["Team & Technology", "Voter Contact", "Media & Promotion", "Street Activation", "Community & Rewards"];
export const STATUS_LABEL: Record<ProjectStatus, string> = { open: "Open for funding", funded: "Fully funded", delivering: "In delivery", delivered: "Delivered" };

export const projects: FundableProject[] = [
  {
    slug: "fliers-adeniran-ogunsanya-street-surulere",
    title: "Fliers and distribution for Adeniran Ogunsanya Street",
    category: "Street Activation", state: "Lagos", lga: "Surulere",
    summary: "Print 5,000 tagline fliers in English and Pidgin and pay street leaders to distribute them door to door on Adeniran Ogunsanya Street and the adjoining closes.",
    funds: ["5,000 A5 fliers (two languages)", "Distribution fees for 4 street leaders at the published rate", "Photo proof of every drop"],
    target: 250_000, raised: 187_500, spent: 60_000, funders: 64, status: "open", proposedBy: "Surulere Ward 4 leaders", published: "2026-10-12",
    updates: [{ date: "2026-10-21", text: "5,000 fliers printed. Street leader distribution starts Saturday." }, { date: "2026-10-12", text: "Project approved by the Lagos state team and published for funding." }],
    proof: [{ label: "Printer's invoice", status: "uploaded" }, { label: "Distribution photos (GPS and time-stamped)", status: "pending" }],
  },
  {
    slug: "hausa-radio-advert-kano-city",
    title: "Hausa radio advert slots in Kano city",
    category: "Media & Promotion", state: "Kano", lga: "Kano Municipal",
    summary: "Buy a two-week schedule of 60-second Hausa radio adverts carrying the tagline “Ba za mu saci kuɗinku ba” on a Kano city station during morning and evening drive time.",
    funds: ["28 radio slots of 60 seconds", "Hausa voice-over recording", "Station airing certificate as proof"],
    target: 1_800_000, raised: 1_134_000, spent: 0, funders: 412, status: "open", proposedBy: "Kano state media team", published: "2026-10-09",
    updates: [{ date: "2026-10-20", text: "Two-week schedule agreed with the station. The first slot airs once the project is fully funded." }],
    proof: [{ label: "Station contract", status: "pending" }, { label: "Airing certificate", status: "pending" }],
  },
  {
    slug: "borehole-repair-ward-4-nsukka",
    title: "Community borehole repair, Ward 4",
    category: "Community & Rewards", state: "Enugu", lga: "Nsukka",
    summary: "Repair the broken solar pump on the Ward 4 community borehole so about 300 households have clean drinking water again — an H-One project proposed by the ward.",
    funds: ["Replacement submersible pump", "Solar controller and wiring", "Local technician's labour"],
    target: 640_000, raised: 640_000, spent: 455_000, funders: 198, status: "delivering", proposedBy: "Nsukka Ward 4 leader", published: "2026-09-30",
    updates: [{ date: "2026-10-18", text: "Fully funded. Pump parts purchased; repair photos will be posted on completion." }, { date: "2026-10-05", text: "Funding target reached." }],
    proof: [{ label: "Parts receipts", status: "uploaded" }, { label: "Before-and-after photos", status: "pending" }, { label: "Community sign-off", status: "pending" }],
  },
  {
    slug: "call-centre-setup",
    title: "24-hour call centre setup",
    category: "Voter Contact", state: "FCT", lga: "Abuja Municipal",
    summary: "Set up the human call centre that handles escalations from the AI Call Agent and answers members, funders and voters around the clock (Concept Note strategy 18).",
    funds: ["20 agent workstations and headsets", "Telephony software licence for three months", "Agent training"],
    target: 6_500_000, raised: 2_210_000, spent: 0, funders: 845, status: "open", proposedBy: "National Coordination team", published: "2026-10-15",
    updates: [{ date: "2026-10-15", text: "Published for funding. Supplier quotes are listed on the Transparency page." }],
    proof: [{ label: "Supplier invoices", status: "pending" }, { label: "Photos of the working centre", status: "pending" }],
  },
  {
    slug: "ai-call-agent-credit",
    title: "AI Call Agent credit for November",
    category: "Voter Contact", state: "FCT", lga: "Abuja Municipal",
    summary: "Pay for one month of the Obi/Kwankwaso AI Call Agent so it can answer voter questions 24/7 in five languages and hand complex calls to the human call centre.",
    funds: ["AI platform usage for 30 days", "Telephony minutes"],
    target: 3_000_000, raised: 960_000, spent: 0, funders: 301, status: "open", proposedBy: "National Coordination team", published: "2026-10-16",
    updates: [{ date: "2026-10-16", text: "Published for funding." }],
    proof: [{ label: "Platform usage statement", status: "pending" }],
  },
  {
    slug: "adopt-a-salary-translator-igbo",
    title: "Adopt a salary: Igbo translator for one month",
    category: "Team & Technology", state: "Anambra", lga: "Awka South",
    summary: "Pay one month's project fees for a translator who turns campaign content into Igbo, as part of the 500+ translator network.",
    funds: ["Project-based fees for one translator, one month"],
    target: 180_000, raised: 180_000, spent: 180_000, funders: 52, status: "delivered", proposedBy: "Translator network lead", published: "2026-09-20",
    updates: [{ date: "2026-10-20", text: "Delivered: 46 pieces translated and approved. Fees paid against approved work." }],
    proof: [{ label: "Approved translation log", status: "uploaded" }, { label: "Payout record", status: "uploaded" }],
  },
  {
    slug: "posters-sabon-gari-zaria",
    title: "Posters for Sabon Gari market, Zaria",
    category: "Street Activation", state: "Kaduna", lga: "Sabon Gari",
    summary: "Print and put up 1,000 Hausa and English posters around Sabon Gari market with the permission of shop owners.",
    funds: ["1,000 A3 posters", "Poster-run fees at the published rate", "Photo proof"],
    target: 320_000, raised: 96_000, spent: 0, funders: 31, status: "open", proposedBy: "Sabon Gari ward leaders", published: "2026-10-18",
    updates: [{ date: "2026-10-18", text: "Published for funding." }],
    proof: [{ label: "Printer's invoice", status: "pending" }, { label: "Poster-run photos", status: "pending" }],
  },
  {
    slug: "theme-song-promotion-ibadan",
    title: "Theme song promotion in Ibadan",
    category: "Media & Promotion", state: "Oyo", lga: "Ibadan North",
    summary: "Play the Yorùbá theme song “A Kí Í Jí Owó Yín” on Ibadan radio and at three weekend market activations.",
    funds: ["Radio airplay for 2 weeks", "Sound system hire for 3 market days"],
    target: 900_000, raised: 405_000, spent: 0, funders: 140, status: "open", proposedBy: "Oyo state team", published: "2026-10-14",
    updates: [{ date: "2026-10-14", text: "Published for funding." }],
    proof: [{ label: "Station airing certificate", status: "pending" }, { label: "Market activation photos", status: "pending" }],
  },
  {
    slug: "sms-broadcast-rivers",
    title: "SMS broadcast credit for Rivers members",
    category: "Voter Contact", state: "Rivers", lga: "Port Harcourt",
    summary: "Send opt-in SMS updates (event reminders, voter information) to Rivers members who consented to SMS — never to imported contacts.",
    funds: ["SMS credit for 200,000 messages"],
    target: 700_000, raised: 700_000, spent: 0, funders: 233, status: "funded", proposedBy: "Rivers state team", published: "2026-10-02",
    updates: [{ date: "2026-10-19", text: "Fully funded. Messages will be sent only to members with SMS consent." }],
    proof: [{ label: "Provider statement", status: "pending" }],
  },
  {
    slug: "translation-tiv-voter-guide",
    title: "Translate the voter guide into Tiv",
    category: "Media & Promotion", state: "Benue", lga: "Makurdi",
    summary: "Fund a translation of the Election Day voter guide into Tiv so more Benue voters can read it in their own language.",
    funds: ["Translation and review", "Audio recording for radio"],
    target: 150_000, raised: 42_000, spent: 0, funders: 19, status: "open", proposedBy: "Translator network lead", published: "2026-10-17",
    updates: [{ date: "2026-10-17", text: "Published for funding." }],
    proof: [{ label: "Approved translation", status: "pending" }],
  },
  {
    slug: "merch-giveaway-maiduguri",
    title: "Free merch for Maiduguri street leaders",
    category: "Community & Rewards", state: "Borno", lga: "Maiduguri",
    summary: "Provide 300 T-shirts and caps for street leaders and volunteers to distribute in Maiduguri, earning Impact Points for every verified hand-over.",
    funds: ["200 T-shirts", "100 caps", "Delivery to the ward-leader hub"],
    target: 2_150_000, raised: 610_000, spent: 0, funders: 88, status: "open", proposedBy: "Borno state team", published: "2026-10-13",
    updates: [{ date: "2026-10-13", text: "Published for funding." }],
    proof: [{ label: "Vendor delivery note", status: "pending" }, { label: "Distribution log", status: "pending" }],
  },
  {
    slug: "tv-advert-port-harcourt",
    title: "TV advert slots in Port Harcourt",
    category: "Media & Promotion", state: "Rivers", lga: "Port Harcourt",
    summary: "Run the 30-second “We will not steal your money” TV spot on a Port Harcourt station for one week.",
    funds: ["14 TV slots of 30 seconds", "Station airing certificate"],
    target: 2_400_000, raised: 300_000, spent: 0, funders: 57, status: "open", proposedBy: "Rivers state team", published: "2026-10-20",
    updates: [{ date: "2026-10-20", text: "Published for funding." }],
    proof: [{ label: "Station contract", status: "pending" }],
  },
  {
    slug: "laptops-content-team",
    title: "Laptops for the content team",
    category: "Team & Technology", state: "Lagos", lga: "Ikeja",
    summary: "Buy four refurbished laptops for the creatives who produce the paid social media adverts (Concept Note strategy 2).",
    funds: ["4 refurbished laptops", "Editing software licences for 3 months"],
    target: 1_600_000, raised: 1_600_000, spent: 1_540_000, funders: 176, status: "delivered", proposedBy: "Content lead", published: "2026-09-25",
    updates: [{ date: "2026-10-10", text: "Delivered: laptops purchased and assigned; serial numbers recorded in the asset register." }],
    proof: [{ label: "Purchase receipts", status: "uploaded" }, { label: "Asset register entry", status: "uploaded" }],
  },
  {
    slug: "school-chairs-gwagwalada",
    title: "Classroom chairs for a primary school, Gwagwalada",
    category: "Community & Rewards", state: "FCT", lga: "Gwagwalada",
    summary: "Replace 60 broken pupils' chairs at a community primary school, proposed by the ward and delivered by a local carpenter.",
    funds: ["60 wooden chairs", "Delivery and assembly"],
    target: 540_000, raised: 120_000, spent: 0, funders: 44, status: "open", proposedBy: "Gwagwalada ward leaders", published: "2026-10-19",
    updates: [{ date: "2026-10-19", text: "Published for funding after ward and state approval." }],
    proof: [{ label: "Carpenter's invoice", status: "pending" }, { label: "Before-and-after photos", status: "pending" }],
  },
];

export const projectBySlug = (s: string) => projects.find((p) => p.slug === s);

/**
 * DEMO CONTENT for design review. Every item here is sample data and is labelled "Demo data" in the UI.
 * Project types, categories, prices rules and roles come from the Concept Note and PRD; the specific
 * names, places and figures are illustrative and must be replaced by published records before launch.
 */

export type Project = {
  slug: string;
  title: string;
  category: "Team & Technology" | "Voter Contact" | "Media & Promotion" | "Street Activation" | "Community & Rewards";
  state: string;
  lga: string;
  target: number;
  raised: number;
  funders: number;
  status: "open" | "funded" | "delivering" | "delivered";
  update: string;
  updatedAt: string;
};

export const projects: Project[] = [
  {
    slug: "fliers-adeniran-ogunsanya-street-surulere",
    title: "Fliers and distribution for Adeniran Ogunsanya Street",
    category: "Street Activation",
    state: "Lagos",
    lga: "Surulere",
    target: 250_000,
    raised: 187_500,
    funders: 64,
    status: "open",
    update: "5,000 fliers printed; street leader distribution starts Saturday.",
    updatedAt: "2026-10-21",
  },
  {
    slug: "hausa-radio-advert-kano-city",
    title: "Hausa radio advert slots in Kano city",
    category: "Media & Promotion",
    state: "Kano",
    lga: "Kano Municipal",
    target: 1_800_000,
    raised: 1_134_000,
    funders: 412,
    status: "open",
    update: "Two-week schedule agreed with the station; first slot airs once fully funded.",
    updatedAt: "2026-10-20",
  },
  {
    slug: "borehole-repair-ward-4-nsukka",
    title: "Community borehole repair, Ward 4",
    category: "Community & Rewards",
    state: "Enugu",
    lga: "Nsukka",
    target: 640_000,
    raised: 640_000,
    funders: 198,
    status: "delivering",
    update: "Fully funded. Pump parts purchased; repair photos will be posted on completion.",
    updatedAt: "2026-10-18",
  },
];

export type EventItem = {
  slug: string;
  title: string;
  start: string; // ISO with +01:00
  end: string;
  place: string;
  online?: boolean;
  organiser: string;
  category: "TBH One" | "Village meeting" | "Diaspora chapter" | "Training";
};

export const events: EventItem[] = [
  {
    slug: "village-meeting-ikorodu-ward-4",
    title: "Village meeting: why ‘We will not steal your money’ matters",
    start: "2026-11-14T16:00:00+01:00",
    end: "2026-11-14T18:00:00+01:00",
    place: "Ward 4 town hall, Ikorodu, Lagos",
    organiser: "Ikorodu Ward 4 leaders",
    category: "Village meeting",
  },
  {
    slug: "tell-one-uk-chapter-call",
    title: "Tell One evening: call home with the UK chapter",
    start: "2026-11-15T19:00:00+01:00",
    end: "2026-11-15T20:30:00+01:00",
    place: "Online",
    online: true,
    organiser: "TBH One UK chapter",
    category: "Diaspora chapter",
  },
  {
    slug: "street-leader-safety-training-kaduna",
    title: "Street leader safety and conduct training",
    start: "2026-11-18T10:00:00+01:00",
    end: "2026-11-18T13:00:00+01:00",
    place: "Kaduna North, Kaduna",
    organiser: "TBH One Kaduna state team",
    category: "Training",
  },
];

export type Product = { slug: string; name: string; price: number; category: string; variants?: string[]; stock: "in" | "low" | "out" };
export const products: Product[] = [
  { slug: "tbh-one-tagline-t-shirt", name: "‘We will not steal your money’ T-shirt", price: 8_000, category: "T-shirts", variants: ["S", "M", "L", "XL", "XXL"], stock: "in" },
  { slug: "tbh-one-cap", name: "TBH One cap", price: 5_500, category: "Caps", stock: "in" },
  { slug: "tbh-one-wristband-5-pack", name: "Wristbands, pack of 5", price: 2_500, category: "Wristbands", stock: "low" },
  { slug: "ward-starter-pack-50", name: "Ward starter pack (50 T-shirts)", price: 340_000, category: "Packs", stock: "in" },
];

export const leaderboard = [
  { firstName: "Halima", state: "Kano", points: 4_820 },
  { firstName: "Chinedu", state: "Enugu", points: 4_310 },
  { firstName: "Yetunde", state: "Ogun", points: 3_975 },
  { firstName: "Musa", state: "Bauchi", points: 3_640 },
  { firstName: "Blessing", state: "Rivers", points: 3_205 },
];

export type Article = { slug: string; title: string; excerpt: string; author: string; date: string; category: string; poster: "en" | "ha" | "yo" | "ig" };
export const articles: Article[] = [
  {
    slug: "what-tell-one-bring-one-help-one-asks-of-you",
    title: "What Tell One, Bring One, Help One asks of every member",
    excerpt: "Three person-to-person actions, explained with examples for Nigerians at home and in the diaspora.",
    author: "TBH One Editorial Desk",
    date: "2026-10-22",
    category: "Explainers",
    poster: "yo",
  },
  {
    slug: "how-project-funding-replaces-membership-dues",
    title: "How project funding replaces membership dues",
    excerpt: "Members choose and fund published projects in their own street, city or language — and can follow every naira to delivery.",
    author: "TBH One Editorial Desk",
    date: "2026-10-21",
    category: "Transparency",
    poster: "ig",
  },
  {
    slug: "the-tagline-in-five-languages",
    title: "‘We will not steal your money’ — the tagline in five languages",
    excerpt: "English, Pidgin, Yorùbá, Hausa and Igbo versions of the one promise that carries the campaign.",
    author: "TBH One Editorial Desk",
    date: "2026-10-20",
    category: "The Message",
    poster: "ha",
  },
];

export const giveawayDemo = {
  prize: "₦5,000 airtime, 20 winners",
  sponsor: "Funded through a published giveaway project",
};

export const couponDemo = { code: "TBHWEEK1", text: "10% off caps and wristbands for members this week" };

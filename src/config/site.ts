/**
 * Single source of truth for official TBH One details.
 *
 * Placeholder policy (Implementation Plan, C5):
 * - Values marked `null` are official details nobody has supplied yet. They are NEVER
 *   invented, because a wrong phone number or bank account could send a member's money
 *   or messages to a stranger. The UI renders an honest "pending" state instead of a blank.
 * - Replace a `null` with the approved value and every page picks it up.
 */

export const site = {
  name: "TBH One",
  alternateNames: ["TBH ONE", "Tell One, Bring One, Help One"],
  fullName: "TBH One — Tell One, Bring One, Help One",
  description:
    "TBH One is a free, community-powered movement mobilising Nigerians at home and abroad for Peter Obi, Rabiu Musa Kwankwaso and the Nigeria Democratic Congress (NDC) ahead of the 16 January 2027 election.",
  // The production domain has not been confirmed; set NEXT_PUBLIC_SITE_URL at deploy time.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  copyrightYear: 2026,

  /** Public web address shown on the site, in SMS copy and on leader IDs (Careers Landing Page document). */
  domain: "www.tbhone.com.ng",
  // Official channels. WhatsApp, toll-free line and social handles from the Careers Landing Page: Ward Leaders
  // (Wave 1) document; the digital lead registers each handle before launch (CAR-36). Email from the updated Careers
  // page copy; the postal address stays pending.
  contact: {
    whatsappNumber: "2349045699268" as string | null, // E.164 without "+": 0904 569 9268
    whatsappDisplay: "0904 569 9268",
    tollFree: "0800 555 333 111" as string | null, // free, 24 hours
    tollFreeTel: "0800555333111",
    email: "info@tbhone.com.ng" as string | null,
    pressEmail: null as string | null,
    address: null as string | null,
  },
  /** Official accounts: the confirmed @tbhonenigeria handle on all 13 channels (11 platforms + Telegram + WhatsApp Channel) (Careers document, Vision Points). */
  handle: "@tbhonenigeria",
  social: {
    instagram: "https://www.instagram.com/tbhonenigeria" as string | null,
    facebook: "https://www.facebook.com/tbhonenigeria" as string | null,
    x: "https://x.com/tbhonenigeria" as string | null,
    tiktok: "https://www.tiktok.com/@tbhonenigeria" as string | null,
    youtube: "https://www.youtube.com/@tbhonenigeria" as string | null,
    threads: "https://www.threads.net/@tbhonenigeria" as string | null,
    linkedin: "https://www.linkedin.com/company/tbhonenigeria" as string | null,
    kingschat: "https://kingschat.online/user/tbhonenigeria" as string | null,
    snapchat: "https://www.snapchat.com/add/tbhonenigeria" as string | null,
    substack: "https://tbhonenigeria.substack.com" as string | null,
    pinterest: "https://www.pinterest.com/tbhonenigeria" as string | null,
    // Telegram channel on the same handle. WhatsApp Channel: until its channel link is issued, the button opens a
    // chat with the official number asking to join (replace with the https://whatsapp.com/channel/… link).
    telegram: "https://t.me/tbhonenigeria" as string | null,
    whatsapp: "https://wa.me/2349045699268?text=JOIN%20CHANNEL" as string | null,
  },
  apps: {
    android: null as string | null,
    ios: null as string | null,
  },
  /**
   * Featured video in the homepage Media Hub (TBH One TV). Paste the ID from a YouTube link, e.g. the part after
   * "v=" in https://www.youtube.com/watch?v=XXXXXXXXXXX. Use an official NDC, Peter Obi or TBH One upload.
   * Left empty until the client supplies one: the site never invents video links.
   */
  ndcOfficialSite: null as string | null,

  hashtags: ["#WeWillNotStealYourMoney", "#VotePeopleWhoWillNotStealYourMoney"],
  hashtagAcronyms: ["#WWNSYM", "#VPWWNSYM"],

  /**
   * Public counters ("The movement, live", the ticker and the footer band) show a figure only once the real figure
   * reaches this level. Below it, the site shows true momentum messages instead of a small number. Never replace
   * the real figures with invented ones.
   */
  liveThresholds: { members: 1000, joinedToday: 50, raisedNaira: 1_000_000 },

  /** Launch of membership, website and Shop (PRD §20). */
  launchDate: "2026-11-09",
} as const;

/** All campaign dates are WAT (UTC+1). Rules read these, never hardcoded strings. */
export const campaignDates = {
  electionDay: new Date("2027-01-16T08:00:00+01:00"), // polls open, Saturday 16 January 2027
  campaignCutoff: new Date("2027-01-14T23:59:00+01:00"), // GR-3, EC-25
  electionDayStart: new Date("2027-01-16T00:00:00+01:00"),
  shopDispatchResumes: new Date("2027-01-17T00:00:00+01:00"),
  postElection: new Date("2027-01-17T00:00:00+01:00"),
};

/**
 * Demo mode shows clearly labelled sample data (counters, projects, events, leaderboards)
 * so the prototype can be reviewed. Turn off in production; sections then fall back to
 * honest empty states until live data exists.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

/** Display names for the official social platforms, in the order the Careers document lists them. */
export const socialLabels: Record<keyof typeof site.social, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X (Twitter)",
  tiktok: "TikTok",
  youtube: "YouTube",
  threads: "Threads",
  linkedin: "LinkedIn",
  kingschat: "KingsChat",
  snapchat: "Snapchat",
  substack: "Substack",
  pinterest: "Pinterest",
  telegram: "Telegram",
  whatsapp: "WhatsApp Channel",
};

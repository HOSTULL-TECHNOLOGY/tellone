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

  // Official channels — pending until supplied by the National Coordination team.
  contact: {
    whatsappNumber: null as string | null, // E.164 without "+", e.g. "234..."
    tollFree: null as string | null,
    email: null as string | null,
    pressEmail: null as string | null,
    address: null as string | null,
  },
  social: {
    x: null as string | null,
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
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

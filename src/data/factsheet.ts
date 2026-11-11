/**
 * Fact Sheet — the single source of truth for citeable facts (PRD GEO-3).
 * Reused on About, Transparency, Press, state pages and answers so figures never conflict.
 * Every entry names its source and date.
 */
export type Fact = { id: string; fact: string; value: string; date: string; source: string; url?: string };

export const CONCEPT_NOTE = "TBH One Concept Note (Revised), October 2026";
export const PRD = "TBH One Stakeholder Dashboards & E-commerce PRD, 21 October 2026";
export const MENU_DOC = "TBH One Revised Website Menu, 21 October 2026";
export const INEC_SOURCE = "INEC revised 2027 general election timetable (reported by Channels TV, 26 Feb 2026)";
export const INEC_URL_REPORT = "https://www.channelstv.com/2026/02/26/inec-releases-revised-election-timetable-presidential-poll-to-hold-jan-16/";
export const TICKET_SOURCE = "Politico.ng, 31 May 2026";
export const TICKET_URL = "https://www.politico.ng/2026/05/31/2027-peter-obi-names-kwankwaso-as-running-mate-after-securing-ndc-ticket/";

export const facts: Fact[] = [
  { id: "name", fact: "Full name", value: "TBH One — Tell One, Bring One, Help One", date: "October 2026", source: CONCEPT_NOTE },
  { id: "what", fact: "What TBH One is", value: "A free, community and people-powered initiative for Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress (NDC)", date: "October 2026", source: CONCEPT_NOTE },
  { id: "ticket", fact: "NDC presidential ticket", value: "Peter Obi (presidential candidate) and Rabiu Musa Kwankwaso (running mate), named at the NDC special convention in Abuja on 30 May 2026", date: "30 May 2026", source: TICKET_SOURCE, url: TICKET_URL },
  { id: "election", fact: "Presidential and National Assembly elections", value: "Saturday 16 January 2027", date: "26 February 2026", source: INEC_SOURCE, url: INEC_URL_REPORT },
  { id: "governorship", fact: "Governorship and State Assembly elections", value: "Saturday 6 February 2027", date: "26 February 2026", source: INEC_SOURCE, url: INEC_URL_REPORT },
  { id: "cutoff", fact: "End of campaigning for the January polls", value: "11:59 pm, Thursday 14 January 2027 (24 hours before polls open)", date: "July 2026", source: "INEC campaign timetable (reported by P.M. News, 29 Jul 2026)", url: "https://pmnewsnigeria.com/2026/07/29/2027-inec-settles-controversy-over-election-timetable-change/" },
  { id: "tagline", fact: "Tagline", value: "We will not steal your money.", date: "October 2026", source: CONCEPT_NOTE },
  { id: "belief", fact: "Core belief", value: "Nigeria’s money belongs to Nigerians", date: "October 2026", source: CONCEPT_NOTE },
  { id: "hashtags", fact: "Official hashtags", value: "#WeWillNotStealYourMoney (#WWNSYM) and #VotePeopleWhoWillNotStealYourMoney (#VPWWNSYM)", date: "October 2026", source: CONCEPT_NOTE },
  { id: "membership", fact: "Membership", value: "Free and open to every Nigerian at home and abroad; no dues and no invitation needed", date: "October 2026", source: CONCEPT_NOTE },
  { id: "funding", fact: "Funding model", value: "Members and supporters fund specific published projects; every project shows a live progress bar and a monthly spend summary is published", date: "October 2026", source: CONCEPT_NOTE },
  { id: "launch", fact: "Website, membership and Shop launch", value: "9 November 2026; Android and iOS apps on 10 November 2026", date: "21 October 2026", source: PRD },
  { id: "geography", fact: "Electoral geography covered", value: "36 states and the FCT, 774 LGAs, 8,809 electoral wards", date: "October 2026", source: CONCEPT_NOTE },
  { id: "languages", fact: "Languages", value: "English, Nigerian Pidgin, Yorùbá, Hausa and Igbo", date: "October 2026", source: CONCEPT_NOTE },
];

export const factById = (id: string) => facts.find((f) => f.id === id)!;

/** Success benchmarks (targets, not achievements) — Concept Note §3. */
export const benchmarks = [
  { benchmark: "Registered members", target: "5,000,000", meaning: "Free, open sign-up — the reach and awareness layer of the movement" },
  { benchmark: "Project funders", target: "500,000", meaning: "Members and supporters who fund at least one published project" },
  { benchmark: "Country coordinators", target: "200+", meaning: "Diaspora organising leads driving Tell One in every country with a Nigerian community" },
  { benchmark: "Ward leaders", target: "10,000", meaning: "Ward-level organising leads across Nigeria’s 8,809 electoral wards" },
  { benchmark: "Street leaders", target: "800,000+", meaning: "Street-level organising leads coordinating outreach, distribution and projects" },
  { benchmark: "Creatives", target: "500+", meaning: "Designers, editors and copywriters producing paid social media ads" },
  { benchmark: "Language translators", target: "500+", meaning: "Translating all campaign content into Nigeria’s languages" },
  { benchmark: "Executed projects", target: "7,500", meaning: "H-One community projects delivered across all 774 LGAs" },
];

export const taglines = [
  { lang: "English", code: "en", text: "We will not steal your money." },
  { lang: "Nigerian Pidgin", code: "pcm", text: "We no go thief your money." },
  { lang: "Yorùbá", code: "yo", text: "A ò ní jí owó yín." },
  { lang: "Hausa", code: "ha", text: "Ba za mu saci kuɗinku ba." },
  { lang: "Igbo", code: "ig", text: "Anyị agaghị ezu ohi ego unu." },
];

export const corruptionChain = ["more jobs", "less militancy", "less terrorism", "better healthcare", "better roads & infrastructure", "reliable electricity", "clean drinking water", "better education"];

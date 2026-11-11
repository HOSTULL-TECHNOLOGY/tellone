/**
 * Fact Check desk (PRD SEO-11). Only claims that can be checked against a named, dated source.
 * Claims are paraphrased from the kinds of questions and rumours the PRD anticipates; none quote real people.
 */
import { CONCEPT_NOTE, INEC_SOURCE, INEC_URL_REPORT, PRD, TICKET_SOURCE, TICKET_URL } from "./factsheet";

export type Verdict = "True" | "False" | "Misleading" | "Outdated";
export type FactCheck = {
  slug: string;
  claim: string;
  verdict: Verdict;
  rating: 1 | 2 | 3 | 4 | 5; // ClaimReview: 1 = false … 5 = true
  summary: string; // 40–60 words
  evidence: string[];
  sources: { label: string; url?: string; date?: string }[];
  checked: string; // ISO date
  claimSeen: string;
};

export const factChecks: FactCheck[] = [
  {
    slug: "tbh-one-membership-fee",
    claim: "TBH One charges members a joining fee or monthly dues.",
    verdict: "False",
    rating: 1,
    summary:
      "False. TBH One membership is free and open to every Nigerian at home and abroad, with no paid membership and no invitation requirement. Members are encouraged — not required — to fund specific published projects instead of paying dues. Anyone asking for a joining fee is not acting for TBH One.",
    evidence: [
      "The Concept Note (Section 5, Membership & Funding Model) states that membership is free and that there is no paid membership.",
      "The Stakeholder PRD defines the Member role as any registered Nigerian aged 18+, with no payment step in sign-up.",
      "Report anyone requesting a fee on the Report a Concern page and check payment links on the Verify page.",
    ],
    sources: [{ label: CONCEPT_NOTE }, { label: PRD }],
    checked: "2026-10-23",
    claimSeen: "Messages circulating on WhatsApp and social media",
  },
  {
    slug: "presidential-election-date-february",
    claim: "Nigeria’s 2027 presidential election will be held on 20 February 2027.",
    verdict: "Outdated",
    rating: 2,
    summary:
      "Outdated. 20 February 2027 was INEC’s original date. After the Electoral Act 2026 took effect, INEC published a revised timetable in February 2026 moving the presidential and National Assembly elections to Saturday 16 January 2027. Governorship elections moved to 6 February 2027.",
    evidence: [
      "INEC’s revised timetable, reported on 26 February 2026, sets the presidential and National Assembly elections for Saturday 16 January 2027.",
      "INEC later confirmed that campaigns for those polls end on 14 January 2027, 24 hours before voting.",
      "Always confirm election dates with INEC directly.",
    ],
    sources: [
      { label: INEC_SOURCE, url: INEC_URL_REPORT, date: "26 February 2026" },
      { label: "P.M. News — INEC settles controversy over election timetable change", url: "https://pmnewsnigeria.com/2026/07/29/2027-inec-settles-controversy-over-election-timetable-change/", date: "29 July 2026" },
      { label: "Independent National Electoral Commission", url: "https://inecnigeria.org/" },
    ],
    checked: "2026-10-23",
    claimSeen: "Older news articles and social media posts",
  },
  {
    slug: "tbh-one-collects-pvc-numbers",
    claim: "TBH One asks members to register their PVC number to join or win prizes.",
    verdict: "False",
    rating: 1,
    summary:
      "False. TBH One’s platform has no field anywhere that records voting intention, PVC numbers or how a person voted, and giveaways and rewards are never conditioned on voting, PVCs or polling-unit data. Do not share your PVC or its number with anyone claiming to represent TBH One.",
    evidence: [
      "PRD guardrail GR-1: no field anywhere records voting intention, PVC number or how a person voted.",
      "PRD guardrail GR-2: giveaway entry, rewards and benefits are never conditioned on voting, PVC or polling-unit data.",
      "The Concept Note’s governance note requires that rewards cannot be portrayed as inducements under the Electoral Act.",
    ],
    sources: [{ label: PRD }, { label: CONCEPT_NOTE }],
    checked: "2026-10-23",
    claimSeen: "Unverified messages using TBH One branding",
  },
  {
    slug: "tbh-one-official-candidate-website",
    claim: "TBH One is Peter Obi’s official campaign website.",
    verdict: "Misleading",
    rating: 2,
    summary:
      "Misleading. TBH One supports the Obi–Kwankwaso ticket and works with the Nigeria Democratic Congress, but it is a community-powered initiative, not the candidates’ official campaign site. It does not speak for Peter Obi, Rabiu Musa Kwankwaso or the NDC; their official statements come from their own channels.",
    evidence: [
      "The Concept Note describes TBH One as a community and people-powered initiative working with the NDC.",
      "PRD requirement GEO-4: structured data links to the candidates’ official accounts and must never present TBH One as their official site.",
    ],
    sources: [{ label: CONCEPT_NOTE }, { label: PRD }],
    checked: "2026-10-23",
    claimSeen: "Social media posts sharing TBH One links",
  },
  {
    slug: "kwankwaso-ndc-running-mate",
    claim: "Rabiu Musa Kwankwaso is Peter Obi’s running mate on the NDC ticket.",
    verdict: "True",
    rating: 5,
    summary:
      "True. Peter Obi was declared the Nigeria Democratic Congress presidential flagbearer at a special convention in Abuja on 30 May 2026 and named Senator Rabiu Musa Kwankwaso, former Governor of Kano State, as his running mate in the same speech.",
    evidence: ["Politico.ng reported the nomination and running-mate announcement on 31 May 2026.", "Other national outlets reported the same announcement."],
    sources: [
      { label: TICKET_SOURCE, url: TICKET_URL, date: "31 May 2026" },
      { label: "2027 Nigerian general election — Wikipedia", url: "https://en.wikipedia.org/wiki/2027_Nigerian_general_election" },
    ],
    checked: "2026-10-23",
    claimSeen: "Questions from members and the public",
  },
  {
    slug: "giveaway-requires-proof-of-vote",
    claim: "To claim a TBH One giveaway prize you must show proof of how you voted.",
    verdict: "False",
    rating: 1,
    summary:
      "False. TBH One giveaways are general participation rewards funded through published giveaway projects. They are never conditioned on how anyone votes, on showing a voter’s card, or on the polling period, and all giveaways stop at the campaign cut-off, 24 hours before polls open.",
    evidence: [
      "Concept Note governance note on giveaways, free airtime/data and free merch.",
      "PRD guardrails GR-2 and GR-3: no conditions linked to voting; giveaways auto-stop at the cut-off.",
    ],
    sources: [{ label: CONCEPT_NOTE }, { label: PRD }],
    checked: "2026-10-23",
    claimSeen: "Messages promising prizes after Election Day",
  },
];

export const factCheckBySlug = (s: string) => factChecks.find((f) => f.slug === s);

/**
 * DEMO event calendar (WEB-5). Verified organisers submit events and the state team approves them;
 * these entries are illustrative and labelled "Demo data". All times are WAT (+01:00).
 */
export type Organiser = "NDC" | "Campaign" | "TBH One" | "Obidient Movement" | "Kwankwasiyya Movement" | "Unions & associations" | "Diaspora chapter";
export type CalEvent = {
  slug: string;
  title: string;
  start: string;
  end: string;
  state: string; // "Online" for virtual events
  place: string;
  online?: boolean;
  organiser: Organiser;
  organiserName: string;
  summary: string;
  safety: { item: string; done: boolean }[]; // WL-6: police notice, marshals, exits
};

export const ORGANISERS: Organiser[] = ["NDC", "Campaign", "TBH One", "Obidient Movement", "Kwankwasiyya Movement", "Unions & associations", "Diaspora chapter"];

const fullChecklist = [
  { item: "Police notice submitted", done: true },
  { item: "Marshals assigned", done: true },
  { item: "Exits and first aid point marked", done: true },
];

export const calEvents: CalEvent[] = [
  { slug: "village-meeting-ikorodu-ward-4", title: "Village meeting: why ‘We will not steal your money’ matters", start: "2026-11-14T16:00:00+01:00", end: "2026-11-14T18:00:00+01:00", state: "Lagos", place: "Ward 4 town hall, Ikorodu", organiser: "TBH One", organiserName: "Ikorodu Ward 4 leaders", summary: "An open village meeting led by ward and street leaders to explain the message face to face, answer questions and invite neighbours to join.", safety: fullChecklist },
  { slug: "tell-one-uk-chapter-call", title: "Tell One evening: call home with the UK chapter", start: "2026-11-15T19:00:00+01:00", end: "2026-11-15T20:30:00+01:00", state: "Online", place: "Online video call", online: true, organiser: "Diaspora chapter", organiserName: "TBH One UK chapter", summary: "Diaspora members practise the weekly talking points together, then call family at home. Times shown in WAT; the chapter shares local times.", safety: [{ item: "Online event — no venue checks needed", done: true }] },
  { slug: "street-leader-safety-training-kaduna", title: "Street leader safety and conduct training", start: "2026-11-18T10:00:00+01:00", end: "2026-11-18T13:00:00+01:00", state: "Kaduna", place: "Kaduna North", organiser: "TBH One", organiserName: "TBH One Kaduna state team", summary: "The required training before a street leader's first task: safety, conduct, reporting incidents and logging proof.", safety: fullChecklist },
  { slug: "ndc-state-rally-kano", title: "NDC state rally", start: "2026-11-21T11:00:00+01:00", end: "2026-11-21T15:00:00+01:00", state: "Kano", place: "Kano city (venue confirmed by the party)", organiser: "NDC", organiserName: "NDC Kano state chapter", summary: "A party-organised rally listed here as submitted by the NDC state chapter. Check the party's official channels for final details.", safety: [{ item: "Police notice submitted", done: true }, { item: "Marshals assigned", done: true }, { item: "Exits and first aid point marked", done: false }] },
  { slug: "campaign-town-hall-enugu", title: "Campaign town hall on public spending", start: "2026-11-22T14:00:00+01:00", end: "2026-11-22T17:00:00+01:00", state: "Enugu", place: "Enugu (venue confirmed by the campaign)", organiser: "Campaign", organiserName: "Presidential Campaign Council, Enugu", summary: "A town hall on how stopping the diversion of public funds pays for roads, schools and clinics.", safety: fullChecklist },
  { slug: "obidient-community-cleanup-onitsha", title: "Community clean-up and voter information desk", start: "2026-11-28T08:00:00+01:00", end: "2026-11-28T12:00:00+01:00", state: "Anambra", place: "Onitsha North", organiser: "Obidient Movement", organiserName: "Obidient Movement, Onitsha", summary: "A Help One activity: a morning clean-up with a voter information desk explaining PVC collection.", safety: fullChecklist },
  { slug: "kwankwasiyya-youth-forum-katsina", title: "Youth forum on jobs and skills", start: "2026-11-29T15:00:00+01:00", end: "2026-11-29T18:00:00+01:00", state: "Katsina", place: "Katsina", organiser: "Kwankwasiyya Movement", organiserName: "Kwankwasiyya Movement, Katsina", summary: "A youth forum listed by the Kwankwasiyya Movement with its consent.", safety: fullChecklist },
  { slug: "market-traders-association-meeting-aba", title: "Market traders' association meeting", start: "2026-12-02T16:00:00+01:00", end: "2026-12-02T18:00:00+01:00", state: "Abia", place: "Aba", organiser: "Unions & associations", organiserName: "Aba traders' association (demo)", summary: "TBH One explains member discounts, vendorship and how traders can fund a street project.", safety: fullChecklist },
  { slug: "diaspora-skills-bank-canada", title: "Skills bank evening: remote volunteer tasks", start: "2026-12-05T18:00:00+01:00", end: "2026-12-05T19:30:00+01:00", state: "Online", place: "Online video call", online: true, organiser: "Diaspora chapter", organiserName: "TBH One Canada chapter", summary: "Diaspora professionals pick up remote volunteer tasks in design, tech, legal and media — no cash handling.", safety: [{ item: "Online event — no venue checks needed", done: true }] },
  { slug: "village-meeting-dutse", title: "Village meeting with the town crier", start: "2026-12-06T16:00:00+01:00", end: "2026-12-06T18:00:00+01:00", state: "Jigawa", place: "Dutse", organiser: "TBH One", organiserName: "Dutse ward leaders", summary: "Traditional town criers carry the message, then ward leaders answer questions face to face.", safety: fullChecklist },
  { slug: "creators-workshop-lagos", title: "Creators' workshop: making a 30-second skit", start: "2026-12-09T10:00:00+01:00", end: "2026-12-09T14:00:00+01:00", state: "Lagos", place: "Yaba", organiser: "TBH One", organiserName: "TBH One content team", summary: "A hands-on workshop for UGC creators on briefs, AI-use declarations, consent forms and the two-step review.", safety: fullChecklist },
  { slug: "ndc-candidates-forum-abuja", title: "NDC candidates' forum", start: "2026-12-12T11:00:00+01:00", end: "2026-12-12T14:00:00+01:00", state: "FCT", place: "Abuja (venue confirmed by the party)", organiser: "NDC", organiserName: "NDC national secretariat", summary: "A party event listed as submitted by the NDC. Check official party channels for final details.", safety: fullChecklist },
];

export const eventBySlug = (s: string) => calEvents.find((e) => e.slug === s);

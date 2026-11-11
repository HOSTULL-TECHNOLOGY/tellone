/**
 * Questions Answered hub (PRD SEO-10, AEO-1/2): one page per high-volume question,
 * a 40–60-word direct answer first, then detail and sources. Built only from approved facts.
 */
import { CONCEPT_NOTE, INEC_SOURCE, INEC_URL_REPORT, MENU_DOC, PRD, TICKET_SOURCE, TICKET_URL } from "./factsheet";

export type AnswerSource = { label: string; url?: string; date?: string };
export type Answer = {
  slug: string;
  topic: "The movement" | "Elections & voting" | "Membership" | "Projects & money" | "Candidates & party" | "Leaders & volunteers" | "Shop & rewards" | "Safety & privacy";
  question: string;
  answer: string; // 40–60 words, answer-first
  detail: string[];
  links: { label: string; path: string }[];
  sources: AnswerSource[];
  related: string[];
};

const CN: AnswerSource = { label: CONCEPT_NOTE };
const PRDS: AnswerSource = { label: PRD };
const MENU: AnswerSource = { label: MENU_DOC };
const INEC: AnswerSource = { label: INEC_SOURCE, url: INEC_URL_REPORT, date: "26 February 2026" };
const TICKET: AnswerSource = { label: TICKET_SOURCE, url: TICKET_URL, date: "31 May 2026" };
const INEC_OFFICIAL: AnswerSource = { label: "Independent National Electoral Commission (INEC)", url: "https://inecnigeria.org/" };

export const answers: Answer[] = [
  {
    slug: "what-is-tbh-one",
    topic: "The movement",
    question: "What is TBH One?",
    answer:
      "TBH One — Tell One, Bring One, Help One — is a free, community and people-powered initiative for Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress (NDC). It asks every Nigerian, at home or abroad, to move one more person before the election on Saturday 16 January 2027.",
    detail: [
      "TBH One turns each person’s existing influence — financial, social or relational — into one unit of democratic participation through three actions: Tell One, Bring One and Help One.",
      "Membership is free. Instead of paying dues, members fund specific published projects and can follow every naira to proof of delivery.",
    ],
    links: [{ label: "About TBH One", path: "/about" }, { label: "The T-B-H Framework", path: "/framework" }],
    sources: [CN],
    related: ["what-does-tbh-stand-for", "how-do-i-join-tbh-one", "is-tbh-one-the-official-campaign"],
  },
  {
    slug: "what-does-tbh-stand-for",
    topic: "The movement",
    question: "What does TBH stand for?",
    answer:
      "TBH stands for Tell One, Bring One, Help One. Tell One asks Nigerians abroad to tell family at home who to vote for. Bring One asks you to convince one friend who is sitting on the fence. Help One asks you to support a person or community in need.",
    detail: ["The three actions are called T-One, B-One and H-One. Together they are the movement’s theory of change: one person, one conversation, one act of help at a time."],
    links: [{ label: "The T-B-H Framework", path: "/framework" }],
    sources: [CN],
    related: ["what-is-tell-one", "what-is-bring-one", "what-is-help-one"],
  },
  {
    slug: "what-is-tell-one",
    topic: "The movement",
    question: "What is Tell One (T-One)?",
    answer:
      "Tell One is the diaspora action. Nigerians abroad who cannot vote tell their family back home who to vote for. Because many people abroad support relatives at home, that relationship of trust carries weight, so T-One asks them to make a direct, personal case for Obi and Kwankwaso.",
    detail: ["Diaspora members organise through country chapters led by country coordinators. TBH One targets 200+ country coordinators.", "Diaspora members can log their Tell One conversations in the member dashboard — only the count and the relative, never any voting data."],
    links: [{ label: "Diaspora Chapters", path: "/diaspora" }, { label: "The T-B-H Framework", path: "/framework" }],
    sources: [CN, PRDS],
    related: ["can-nigerians-abroad-take-part", "what-is-bring-one", "can-diaspora-members-donate"],
  },
  {
    slug: "what-is-bring-one",
    topic: "The movement",
    question: "What is Bring One (B-One)?",
    answer:
      "Bring One asks every member to bring and convince one friend who is sitting on the fence: share the vision, talk about why Nigeria needs leaders who will not steal its money, help them register, and go to the polls together on Election Day.",
    detail: ["Everyone has meaningful influence over at least one person. B-One turns that influence into a concrete commitment rather than a general appeal."],
    links: [{ label: "Become a Member", path: "/join" }],
    sources: [CN],
    related: ["what-is-tell-one", "what-is-help-one", "how-do-i-join-tbh-one"],
  },
  {
    slug: "what-is-help-one",
    topic: "The movement",
    question: "What is Help One (H-One)?",
    answer:
      "Help One asks members to support a community or a person in need. It channels TBH One’s community projects into genuine, earned loyalty at the grassroots. Citizens propose projects with a cost; approved projects are published for funding and documented through to delivery.",
    detail: ["TBH One’s benchmark is 7,500 H-One community projects delivered across all 774 Local Government Areas."],
    links: [{ label: "Fund a Project", path: "/projects" }],
    sources: [CN],
    related: ["how-does-project-funding-work", "can-i-propose-a-community-project", "what-is-bring-one"],
  },
  {
    slug: "is-tbh-one-the-official-campaign",
    topic: "Candidates & party",
    question: "Is TBH One the official Obi–Kwankwaso campaign?",
    answer:
      "No. TBH One is a community-powered supporting initiative working with the Nigeria Democratic Congress (NDC). It is not the candidates’ official campaign website and does not speak for Peter Obi, Rabiu Musa Kwankwaso or the NDC. Official statements come from the candidates’ and the party’s own channels.",
    detail: ["Supporting movements such as the Obidient Movement and the Kwankwasiyya Movement are shown on this site only with their consent."],
    links: [{ label: "The Candidates", path: "/candidates" }, { label: "NDC", path: "/ndc" }],
    sources: [CN, PRDS],
    related: ["who-are-the-ndc-candidates", "what-is-the-ndc", "what-is-tbh-one"],
  },
  {
    slug: "who-are-the-ndc-candidates",
    topic: "Candidates & party",
    question: "Who are the NDC presidential candidates for 2027?",
    answer:
      "Peter Obi is the Nigeria Democratic Congress (NDC) presidential candidate for the 2027 election, and Rabiu Musa Kwankwaso is his running mate. Obi was declared the party’s flagbearer and named Kwankwaso at the NDC special convention in Abuja on 30 May 2026.",
    detail: ["Peter Obi is a former two-term Governor of Anambra State. Rabiu Musa Kwankwaso is a former Governor of Kano State and former Minister of Defence."],
    links: [{ label: "The Candidates", path: "/candidates" }],
    sources: [TICKET],
    related: ["who-is-peter-obi", "who-is-rabiu-musa-kwankwaso", "when-is-the-2027-presidential-election"],
  },
  {
    slug: "who-is-peter-obi",
    topic: "Candidates & party",
    question: "Who is Peter Obi?",
    answer:
      "Peter Obi is the Nigeria Democratic Congress (NDC) presidential candidate for the 16 January 2027 election. He served as Governor of Anambra State from 2006 to 2014 and was a presidential candidate in 2023. He was declared NDC flagbearer on 30 May 2026.",
    detail: ["TBH One supports his candidacy but is not his official campaign. Official statements come from his own channels."],
    links: [{ label: "Peter Obi profile", path: "/candidates/peter-obi" }],
    sources: [TICKET, { label: "Peter Obi — Wikipedia", url: "https://en.wikipedia.org/wiki/Peter_Obi" }],
    related: ["who-is-rabiu-musa-kwankwaso", "who-are-the-ndc-candidates"],
  },
  {
    slug: "who-is-rabiu-musa-kwankwaso",
    topic: "Candidates & party",
    question: "Who is Rabiu Musa Kwankwaso?",
    answer:
      "Rabiu Musa Kwankwaso is Peter Obi’s running mate on the Nigeria Democratic Congress (NDC) ticket for 2027. He is a former Governor of Kano State, a former Minister of Defence and the leader of the Kwankwasiyya Movement. Obi named him as running mate on 30 May 2026.",
    detail: ["TBH One supports the Obi–Kwankwaso ticket but does not speak for him."],
    links: [{ label: "Rabiu Musa Kwankwaso profile", path: "/candidates/rabiu-musa-kwankwaso" }],
    sources: [TICKET, { label: "Rabiu Kwankwaso — Wikipedia", url: "https://en.wikipedia.org/wiki/Rabiu_Kwankwaso" }],
    related: ["who-is-peter-obi", "who-are-the-ndc-candidates"],
  },
  {
    slug: "what-is-the-ndc",
    topic: "Candidates & party",
    question: "What is the NDC?",
    answer:
      "The NDC is the Nigeria Democratic Congress, the political party whose ticket Peter Obi and Rabiu Musa Kwankwaso are contesting the 2027 presidential election on. TBH One works with the NDC to drive participation, but party membership and TBH One membership are separate things.",
    detail: ["Joining TBH One does not make you a member of the NDC. For party membership, use the NDC’s own official channels."],
    links: [{ label: "NDC", path: "/ndc" }],
    sources: [CN, TICKET],
    related: ["is-tbh-one-the-official-campaign", "who-are-the-ndc-candidates"],
  },
  {
    slug: "when-is-the-2027-presidential-election",
    topic: "Elections & voting",
    question: "When is the 2027 presidential election in Nigeria?",
    answer:
      "Nigeria’s presidential and National Assembly elections are on Saturday 16 January 2027, under INEC’s revised timetable published in February 2026. Governorship and State Assembly elections follow on Saturday 6 February 2027. Always confirm dates with INEC, the official source.",
    detail: ["INEC moved the elections from the original February and March dates after the Electoral Act 2026 came into force."],
    links: [{ label: "Live Election Updates & Timeline", path: "/election" }, { label: "Voter Information", path: "/voter-info" }],
    sources: [INEC, INEC_OFFICIAL],
    related: ["when-does-campaigning-end", "when-is-the-governorship-election", "how-do-i-find-my-polling-unit"],
  },
  {
    slug: "when-is-the-governorship-election",
    topic: "Elections & voting",
    question: "When are the 2027 governorship elections?",
    answer:
      "Governorship and State Assembly elections are scheduled for Saturday 6 February 2027 under INEC’s revised timetable, three weeks after the presidential and National Assembly elections on 16 January 2027. Campaigns for those polls run until Thursday 4 February 2027.",
    detail: ["Check INEC for any changes to the timetable in your state."],
    links: [{ label: "Election timeline", path: "/election" }],
    sources: [INEC, INEC_OFFICIAL],
    related: ["when-is-the-2027-presidential-election", "when-does-campaigning-end"],
  },
  {
    slug: "when-does-campaigning-end",
    topic: "Elections & voting",
    question: "When does campaigning end for the January 2027 election?",
    answer:
      "Campaigning for the presidential and National Assembly elections ends at 11:59 pm on Thursday 14 January 2027, 24 hours before polls open. From then TBH One stops all giveaways, campaign banners, coupons and paid promotion and shows neutral voting information only.",
    detail: ["On Election Day the site links only to INEC’s official results portal. TBH One does not collate or publish results."],
    links: [{ label: "Election timeline", path: "/election" }],
    sources: [INEC, PRDS],
    related: ["when-is-the-2027-presidential-election", "does-tbh-one-publish-election-results"],
  },
  {
    slug: "how-do-i-find-my-polling-unit",
    topic: "Elections & voting",
    question: "How do I find my polling unit?",
    answer:
      "Use INEC’s official voter portal to check your registration and polling unit, or contact INEC’s office in your Local Government Area. TBH One never asks for your PVC number or polling-unit details, and nobody from TBH One will ask you to share them.",
    detail: ["Polling units, PVC collection and voter registration are managed by INEC, not by TBH One or any party."],
    links: [{ label: "Voter Information", path: "/voter-info" }],
    sources: [INEC_OFFICIAL, PRDS],
    related: ["how-do-i-collect-my-pvc", "what-should-i-bring-on-election-day"],
  },
  {
    slug: "how-do-i-collect-my-pvc",
    topic: "Elections & voting",
    question: "How do I collect my Permanent Voter Card (PVC)?",
    answer:
      "PVCs are issued by INEC. Check INEC’s announcements for the collection period and locations, usually the INEC office in your Local Government Area or designated ward centres. Take your registration slip or details. Never give your PVC or its number to anyone, including TBH One.",
    detail: ["TBH One’s platform has no field anywhere for PVC numbers or voting choices (PRD guardrail GR-1)."],
    links: [{ label: "Voter Information", path: "/voter-info" }],
    sources: [INEC_OFFICIAL, PRDS],
    related: ["how-do-i-find-my-polling-unit", "does-tbh-one-record-how-i-vote"],
  },
  {
    slug: "what-should-i-bring-on-election-day",
    topic: "Elections & voting",
    question: "What should I bring to vote on Election Day?",
    answer:
      "Bring your own Permanent Voter Card (PVC) and go to the polling unit where you registered. Arrive early, follow the instructions of INEC officials, and stay calm and peaceful. Check INEC’s guidance for accreditation hours and any rules on phones and cameras.",
    detail: ["Polls for the presidential election open on Saturday 16 January 2027. Results are announced only by INEC."],
    links: [{ label: "Election Day guide", path: "/voter-info#election-day" }],
    sources: [INEC_OFFICIAL],
    related: ["how-do-i-find-my-polling-unit", "does-tbh-one-publish-election-results"],
  },
  {
    slug: "does-tbh-one-publish-election-results",
    topic: "Elections & voting",
    question: "Does TBH One publish election results?",
    answer:
      "No. TBH One does not collate, tally or publish election results. On Election Day the website links only to INEC’s official Result Viewing Portal. Treat any results shared elsewhere as unofficial until INEC announces them.",
    detail: ["This is a product requirement in the PRD: no results collation or tallying, and no replacement for INEC or party systems."],
    links: [{ label: "Live Election Updates", path: "/election" }],
    sources: [PRDS],
    related: ["when-does-campaigning-end", "how-do-i-spot-a-fake-tbh-one-account"],
  },
  {
    slug: "how-do-i-join-tbh-one",
    topic: "Membership",
    question: "How do I join TBH One?",
    answer:
      "Join free on the Become a Member page with your phone number. You confirm a one-time code, choose your language and state, and reach your member dashboard in about two minutes. There are no dues and no invitation is needed — every Nigerian aged 18 or over can join.",
    detail: ["After joining you can earn Impact Points, access member benefits and apply for roles such as street leader, ward leader, creator or translator."],
    links: [{ label: "Become a Member", path: "/join" }],
    sources: [CN, PRDS],
    related: ["is-membership-free", "what-do-members-get", "can-nigerians-abroad-take-part"],
  },
  {
    slug: "is-membership-free",
    topic: "Membership",
    question: "Is TBH One membership free?",
    answer:
      "Yes. TBH One membership is free and open to every Nigerian at home and abroad. There is no paid membership and no invitation requirement. Instead of paying dues, members are encouraged to fund a specific published project they care about.",
    detail: ["Funding a project is optional and never a condition of membership or of any benefit."],
    links: [{ label: "Become a Member", path: "/join" }, { label: "Fund a Project", path: "/projects" }],
    sources: [CN],
    related: ["how-do-i-join-tbh-one", "how-does-project-funding-work"],
  },
  {
    slug: "what-do-members-get",
    topic: "Membership",
    question: "What benefits do TBH One members get?",
    answer:
      "Members can access skill training, job opportunities, business opportunities, giveaways, free airtime and data, free merch, discounts from partner businesses, referral income for verified work, and vendorship opportunities. Benefits are participation rewards and are never conditioned on how anyone votes.",
    detail: ["Referral income is paid only for verified work or activity, never for sign-ups alone, so the model stays clearly distinct from multi-level schemes."],
    links: [{ label: "Member Benefits", path: "/benefits" }],
    sources: [CN, PRDS],
    related: ["how-do-impact-points-work", "how-does-the-daily-giveaway-work"],
  },
  {
    slug: "can-nigerians-abroad-take-part",
    topic: "Membership",
    question: "Can Nigerians abroad join TBH One?",
    answer:
      "Yes. Nigerians abroad can join free and lead Tell One: telling family at home who to vote for. They organise through diaspora chapters run by country coordinators, volunteer skills remotely and offer in-kind support. Cash contributions from abroad need legal clearance first.",
    detail: ["Chapters exist or are planned in countries with Nigerian communities such as Germany, the UK, the United States, Canada, Ghana and Togo."],
    links: [{ label: "Diaspora Chapters", path: "/diaspora" }],
    sources: [CN, PRDS],
    related: ["what-is-tell-one", "can-diaspora-members-donate"],
  },
  {
    slug: "how-does-project-funding-work",
    topic: "Projects & money",
    question: "How does project funding work?",
    answer:
      "TBH One publishes each fundable project with a cost, a target and progress updates. Members and supporters choose the projects they care about — fliers for their street, a radio advert in their city, a community borehole — and pay by card, bank transfer or USSD. Every contribution is recorded against a named contributor.",
    detail: ["Project categories include team and technology, voter contact, media and promotion, street activation, and community and rewards.", "Every project shows amount raised, amount spent and at least one proof item once delivered."],
    links: [{ label: "Fund a Project", path: "/projects" }, { label: "Transparency", path: "/transparency" }],
    sources: [CN, PRDS],
    related: ["where-does-the-money-go", "can-diaspora-members-donate", "can-i-propose-a-community-project"],
  },
  {
    slug: "where-does-the-money-go",
    topic: "Projects & money",
    question: "Where does the money TBH One raises go?",
    answer:
      "Money goes to the specific published project it was given for. Each project shows a live progress bar, and TBH One publishes a monthly public summary of income and spend by category — team, technology, voter contact, media, street activation, community projects and rewards — generated from the ledger, not entered by hand.",
    detail: ["Vendor contracts are listed with the vendor’s name, value and the reason for the award."],
    links: [{ label: "Transparency", path: "/transparency" }],
    sources: [CN, PRDS],
    related: ["how-does-project-funding-work", "how-are-payments-to-leaders-controlled"],
  },
  {
    slug: "can-diaspora-members-donate",
    topic: "Projects & money",
    question: "Can Nigerians in the diaspora donate money?",
    answer:
      "Funds from outside Nigeria need specific legal advice before they can be accepted, because of constitutional restrictions on parties retaining funds from abroad. Until clearance is recorded, diaspora members are directed to non-financial Tell One activity and in-kind support, and payment links are not shown.",
    detail: ["Any cash offer logged by a diaspora chapter is routed to legal review. Orders paid with foreign-issued cards in the Shop are held for review."],
    links: [{ label: "Diaspora Chapters", path: "/diaspora" }],
    sources: [CN, PRDS],
    related: ["can-nigerians-abroad-take-part", "how-does-project-funding-work"],
  },
  {
    slug: "can-i-propose-a-community-project",
    topic: "Projects & money",
    question: "Can I propose a community project?",
    answer:
      "Yes. Citizens submit proposed community projects with an estimated cost, usually through their ward leader. Proposals are reviewed and, where approved, published for funding. Delivered projects earn Impact Points for the people who complete them and are documented with proof of delivery.",
    detail: ["The aim is 7,500 executed projects across all 774 LGAs, delivered by citizens rather than designed centrally."],
    links: [{ label: "Ward Leaders", path: "/ward-leaders" }, { label: "Fund a Project", path: "/projects" }],
    sources: [CN],
    related: ["what-is-help-one", "how-does-project-funding-work"],
  },
  {
    slug: "how-are-payments-to-leaders-controlled",
    topic: "Projects & money",
    question: "How are payments to leaders and vendors controlled?",
    answer:
      "Every payout follows a two-person rule enforced by the system: the person who approves a payment cannot be the person who releases it. Field payments are released only against approved proof of work, duplicate proof is flagged automatically, and large or foreign-source contributions are held until cleared.",
    detail: ["Every create, edit, approve and pay action is written to an audit log visible to administrators."],
    links: [{ label: "Transparency", path: "/transparency" }],
    sources: [PRDS],
    related: ["where-does-the-money-go", "how-do-street-leaders-earn"],
  },
  {
    slug: "how-do-impact-points-work",
    topic: "Shop & rewards",
    question: "How do Impact Points work?",
    answer:
      "Impact Points recognise everyday actions that grow the movement: joining, referring a member, attending an event, completing a project, distributing merch, registering a voter, creating content and joining volunteer groups. Points are recorded in your profile and converted into rewards such as airtime, data or a TBH One T-shirt.",
    detail: ["Planned monthly tiers: 500 points for ₦500 airtime, 1,000 for 1 GB of data, 2,500 for a TBH One T-shirt and 5,000 for a priority training pass. Rewards never depend on how anyone votes."],
    links: [{ label: "Impact Points & Rewards", path: "/rewards" }],
    sources: [CN, PRDS],
    related: ["what-do-members-get", "how-does-the-daily-giveaway-work"],
  },
  {
    slug: "how-does-the-daily-giveaway-work",
    topic: "Shop & rewards",
    question: "How does the TBH One daily giveaway work?",
    answer:
      "A giveaway runs every day until Thursday 14 January 2027, funded by members, businesses and partners through published giveaway projects. Members enter free; winners come from a recorded random draw and are published with the draw record. Entry never depends on voting, a voter’s card or polling-unit data.",
    detail: ["All giveaways stop automatically at the campaign cut-off, 24 hours before polls open."],
    links: [{ label: "Daily Giveaway", path: "/giveaway" }],
    sources: [CN, PRDS],
    related: ["how-do-impact-points-work", "when-does-campaigning-end"],
  },
  {
    slug: "what-does-the-tbh-one-shop-sell",
    topic: "Shop & rewards",
    question: "What does the TBH One Shop sell?",
    answer:
      "The TBH One Shop sells official merch made by partner vendors: T-shirts, caps, key holders, wristbands, banners, stickers, and ward and event packs, plus custom designs with ward or chapter names. Members see member prices automatically and can use coupons, including Impact Points rewards.",
    detail: ["Delivery reaches all 36 states and the FCT, with free pickup at ward-leader hubs. Wrong-size or damaged items can be returned within 7 days."],
    links: [{ label: "Shop", path: "/shop" }, { label: "Delivery & Returns", path: "/shop/delivery-returns" }],
    sources: [PRDS],
    related: ["how-do-impact-points-work"],
  },
  {
    slug: "how-do-i-become-a-ward-leader",
    topic: "Leaders & volunteers",
    question: "How do I become a TBH One ward leader?",
    answer:
      "Join TBH One, then apply for the ward leader role from the Ward Leaders page or your member dashboard. Ward leaders coordinate T-B-H activity, street leaders and community projects in one of Nigeria’s 8,809 wards, alongside the elected councillor. Roles are added after vetting and require two-factor sign-in.",
    detail: ["TBH One aims for 10,000 ward leaders, with more than one in larger wards."],
    links: [{ label: "Ward Leaders", path: "/ward-leaders" }],
    sources: [CN, PRDS],
    related: ["how-do-street-leaders-earn", "how-do-i-become-a-street-leader"],
  },
  {
    slug: "how-do-i-become-a-street-leader",
    topic: "Leaders & volunteers",
    question: "How do I become a TBH One street leader?",
    answer:
      "Join TBH One, then apply for the street leader role. Street leaders lead door-to-door outreach, distribute fliers, posters and merch, and host village meetings on their own street. Before the first task every street leader completes short training on safety, conduct and reporting.",
    detail: ["The street leader app is built for basic Android phones and works offline."],
    links: [{ label: "Street Leaders", path: "/street-leaders" }],
    sources: [CN, PRDS],
    related: ["how-do-street-leaders-earn", "how-do-i-become-a-ward-leader"],
  },
  {
    slug: "how-do-street-leaders-earn",
    topic: "Leaders & volunteers",
    question: "How do street and ward leaders earn?",
    answer:
      "Leaders earn from real work delivered in their area — delivery earnings, vendor brokerage, flier and poster distribution fees, ads management and project management — paid only against approved proof. Referral points are separate, and referral income is never paid for sign-ups alone.",
    detail: ["The launch rate card in the PRD (reviewed every two weeks): flier drop ₦500 per 100 fliers, poster run ₦1,000 per 20 posters, door-to-door ₦1,500 per 4-hour shift, merch distribution ₦500 per 20 items, village meeting host ₦5,000 per meeting."],
    links: [{ label: "Street Leaders", path: "/street-leaders" }],
    sources: [CN, PRDS],
    related: ["how-are-payments-to-leaders-controlled", "how-do-i-become-a-street-leader"],
  },
  {
    slug: "how-can-creators-get-involved",
    topic: "Leaders & volunteers",
    question: "How can creators and translators work with TBH One?",
    answer:
      "Creators, skit-makers, designers and translators pick up paid briefs, submit work, and get paid after a two-step review by a creative lead and compliance. AI-generated content is labelled, and work featuring people needs a consent form. TBH One aims for 500+ creatives and 500+ translators.",
    detail: ["A 5,000-strong UGC creator network earns Impact Points for content produced."],
    links: [{ label: "Creators", path: "/creators" }, { label: "Translators", path: "/translators" }],
    sources: [CN, PRDS],
    related: ["how-do-impact-points-work"],
  },
  {
    slug: "does-tbh-one-record-how-i-vote",
    topic: "Safety & privacy",
    question: "Does TBH One record how I vote?",
    answer:
      "No. TBH One has no field anywhere that records voting intention, PVC numbers or how a person voted. Giveaways, rewards and benefits are never conditioned on voting, PVCs or polling-unit data. These are guardrails built into the platform, not just policies.",
    detail: ["Personal data is handled under the Nigeria Data Protection Act 2023, with consent recorded per purpose and data requests answered within 30 days."],
    links: [{ label: "Privacy Policy", path: "/privacy" }],
    sources: [PRDS],
    related: ["how-do-i-spot-a-fake-tbh-one-account", "how-do-i-report-a-concern"],
  },
  {
    slug: "how-do-i-spot-a-fake-tbh-one-account",
    topic: "Safety & privacy",
    question: "How do I spot a fake TBH One account or payment link?",
    answer:
      "Check the Verify Official Channels page before you pay, share data or meet anyone. Only accounts, numbers and payment links listed there are official, and every leader carries a verified ID card with a QR code you can check. TBH One never asks for passwords, card PINs or PVC numbers.",
    detail: ["If something looks wrong, report it on the Report a Concern page. You can report anonymously."],
    links: [{ label: "Verify Official Channels", path: "/verify" }, { label: "Report a Concern", path: "/report" }],
    sources: [MENU, PRDS],
    related: ["how-do-i-report-a-concern", "does-tbh-one-record-how-i-vote"],
  },
  {
    slug: "how-do-i-report-a-concern",
    topic: "Safety & privacy",
    question: "How do I report a safety, fraud or abuse concern?",
    answer:
      "Use the Report a Concern page, available on every page and every dashboard screen. You can report anonymously. Critical safeguarding incidents are escalated within one hour, high-priority ones within 24 hours and others within 72 hours, and sensitive reports go straight to the safeguarding team.",
    detail: ["Reports of sexual abuse are never shown to ward leaders; they go directly to the National Safeguarding Lead."],
    links: [{ label: "Report a Concern", path: "/report" }],
    sources: [PRDS],
    related: ["how-do-i-spot-a-fake-tbh-one-account"],
  },
  {
    slug: "which-languages-does-tbh-one-use",
    topic: "The movement",
    question: "Which languages is TBH One available in?",
    answer:
      "TBH One runs in five languages: English, Nigerian Pidgin, Yorùbá, Hausa and Igbo. The website has a folder for each language, the tagline is published in all five, and the theme song has recordings in each. Translations are reviewed by TBH One’s translator network.",
    detail: ["The tagline: We will not steal your money (English), We no go thief your money (Pidgin), A ò ní jí owó yín (Yorùbá), Ba za mu saci kuɗinku ba (Hausa), Anyị agaghị ezu ohi ego unu (Igbo)."],
    links: [{ label: "Our Belief", path: "/belief" }, { label: "Translators", path: "/translators" }],
    sources: [CN],
    related: ["what-is-tbh-one", "what-is-the-tbh-one-tagline"],
  },
  {
    slug: "what-is-the-tbh-one-tagline",
    topic: "The movement",
    question: "What is the TBH One tagline?",
    answer:
      "The tagline is “We will not steal your money.” It follows from TBH One’s belief that Nigeria’s money belongs to Nigerians: if politicians do not steal public money, there will be enough for development. The official hashtags are #WeWillNotStealYourMoney and #VotePeopleWhoWillNotStealYourMoney.",
    detail: ["These are the only hashtags to be used across TBH One channels and materials."],
    links: [{ label: "Our Belief", path: "/belief" }, { label: "The Message", path: "/message" }],
    sources: [CN],
    related: ["which-languages-does-tbh-one-use", "what-is-tbh-one"],
  },
];

export const answerBySlug = (s: string) => answers.find((a) => a.slug === s);
export const answerTopics = Array.from(new Set(answers.map((a) => a.topic)));

/**
 * Blog & News article bodies (PRD WEB-7, SEO-17). Articles are written from the Concept Note and
 * the Stakeholder PRD; they are DRAFTS for the editorial team and carry a "Draft article" label until published.
 */
import { articles, type Article } from "./demo";
import { CONCEPT_NOTE, PRD } from "./factsheet";

export type Block = { h?: string; p?: string; list?: string[]; quote?: string };
export type ArticleFull = Article & { updated: string; body: Block[]; sources: { label: string; url?: string }[] };

export const authors = [
  {
    slug: "tbh-one-editorial-desk",
    name: "TBH One Editorial Desk",
    bio: "The TBH One Editorial Desk writes explainers on the movement, its projects and voter information. Every article follows the Editorial & Corrections Policy and lists its sources.",
  },
];

const bodies: Record<string, { body: Block[]; sources: { label: string; url?: string }[] }> = {
  "what-tell-one-bring-one-help-one-asks-of-you": {
    body: [
      { p: "TBH One is built on three person-to-person actions. Each one converts influence you already have — financial, social or relational — into a unit of democratic participation. None of them asks you to become a full-time campaigner. Each asks you to move one person." },
      { h: "Tell One: the diaspora action" },
      { p: "Millions of Nigerians live in Germany, the United Kingdom, the United States, Canada, Ghana, Togo and elsewhere. Many of them support family at home, and that relationship of trust carries real weight in household decisions — including how people vote. Tell One asks Nigerians abroad, who cannot vote from abroad, to make a direct and personal case to their family for Peter Obi and Rabiu Musa Kwankwaso, rather than only encouraging relatives to vote their conscience." },
      { list: ["Join or start a diaspora chapter led by a country coordinator.", "Use the weekly talking points, available in five languages.", "Log the conversation in your dashboard — the count and the relative only. TBH One never records how anyone intends to vote."] },
      { h: "Bring One: the fence-sitter action" },
      { p: "Everyone has meaningful influence over at least one person. Bring One asks you to bring and convince one friend who is sitting on the fence: share the vision, talk about why Nigeria needs leaders who will not steal its money, help them register, and go to the polls together on Saturday 16 January 2027." },
      { h: "Help One: the community action" },
      { p: "People remain loyal to those who help them, even in small ways. Help One asks you to support a community or a person in need. Citizens propose community projects with a cost; approved projects are published for funding, and delivered projects are documented with proof. TBH One’s benchmark is 7,500 community projects across all 774 Local Government Areas." },
      { quote: "This is not Peter Obi alone. This is all of us. TBH One is the vehicle through which millions of ordinary Nigerians make extraordinary history. — TBH One National Coordinator, as quoted in the Concept Note" },
      { h: "Where to start" },
      { list: ["Join TBH One free with your phone number.", "Pick today’s action on your member dashboard.", "Earn Impact Points for verified actions."] },
    ],
    sources: [{ label: CONCEPT_NOTE }, { label: PRD }],
  },
  "how-project-funding-replaces-membership-dues": {
    body: [
      { p: "TBH One does not charge membership dues. Membership is free and open to every Nigerian at home and abroad. Instead, members and supporters are encouraged to fund specific, published projects — turning the funding model itself into an act of civic participation rather than a barrier to entry." },
      { h: "What you can fund" },
      { p: "Each fundable item is published as an adoptable project with a cost, a target and progress updates. The Concept Note groups them into five categories:" },
      { list: ["Team & Technology — help pay the team or fund technology.", "Voter Contact — call centre, toll-free line, SMS broadcasts, WhatsApp API costs and the AI Call Agent.", "Media & Promotion — a radio or TV advert in your city, theme song promotion, social media adverts, translation into a language.", "Street Activation — fliers and posters, and their distribution, on your street.", "Community & Rewards — community projects, giveaways, merch giveaways and discounts from your business."] },
      { h: "How you can follow every naira" },
      { p: "Every published project shows a live progress bar. Once a project is marked delivered it must show the amount raised, the amount spent and at least one proof item, such as delivery photos. A monthly public summary of income and spend by category is generated from the ledger — not typed in by hand — and published on the Transparency page as tables with CSV downloads." },
      { h: "The rules that protect contributors" },
      { list: ["Every contribution is recorded against a named contributor, so the party can meet its disclosure and spending-limit obligations under the Electoral Act 2026.", "Funds originating outside Nigeria are held until legal clearance is recorded.", "Every payout needs two different people: one to approve and one to release.", "Field payments are released only against approved proof of work."] },
      { p: "The premise is simple: full grassroots buy-in removes the need for large external donors — but only if funders can see where their money goes. Transparency is not optional polish; it is the mechanism that makes citizen funding credible." },
    ],
    sources: [{ label: CONCEPT_NOTE }, { label: PRD }],
  },
  "the-tagline-in-five-languages": {
    body: [
      { p: "TBH One’s campaign thesis follows directly from its belief that Nigeria’s money belongs to Nigerians. The country’s core problems — unemployment, insecurity, poor healthcare, weak infrastructure, unreliable power, poor water access and failing education — are traced back to one root cause: corruption and the diversion of public funds. The messaging makes that chain simple and repeatable in one promise." },
      { h: "One promise, five languages" },
      { list: ["English: We will not steal your money.", "Nigerian Pidgin: We no go thief your money.", "Yorùbá: A ò ní jí owó yín.", "Hausa: Ba za mu saci kuɗinku ba.", "Igbo: Anyị agaghị ezu ohi ego unu."] },
      { h: "The only two hashtags" },
      { p: "Across every TBH One channel and material, only two hashtags are used: #WeWillNotStealYourMoney (#WWNSYM) and #VotePeopleWhoWillNotStealYourMoney (#VPWWNSYM). Using one consistent pair keeps the conversation findable and makes fake accounts easier to spot." },
      { h: "Keeping it concrete" },
      { p: "The Concept Note recommends pairing the corruption chain with locally specific proof points — a named road, hospital or school project in each state — so the message stays concrete, avoids direct allegations against named individuals, and withstands fact-checking." },
      { p: "Translators work from a keyword brief in each language rather than translating word for word, so the message sounds natural to native speakers." },
    ],
    sources: [{ label: CONCEPT_NOTE }, { label: PRD }],
  },
};

export const newsArticles: ArticleFull[] = articles.map((a) => ({ ...a, updated: a.date, ...bodies[a.slug] }));
export const articleBySlug = (s: string) => newsArticles.find((a) => a.slug === s);
export const authorBySlug = (s: string) => authors.find((a) => a.slug === s);
export const newsCategories = Array.from(new Set(articles.map((a) => a.category)));

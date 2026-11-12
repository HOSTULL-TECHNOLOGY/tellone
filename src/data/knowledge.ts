/**
 * Approved answers the support assistant may use. Each entry is drawn from the Concept Note (Oct 2026),
 * the Revised Website Menu and the Stakeholder PRD, or from INEC's published timetable.
 * The AI is instructed to answer ONLY from this list; the scripted fallback matches keywords against it.
 */
export type KnowledgeEntry = { id: string; keywords: string[]; answer: string; links: { label: string; path: string }[] };

export const knowledge: KnowledgeEntry[] = [
  {
    id: "what",
    keywords: ["what is", "tbh", "about", "who are", "movement"],
    answer:
      "TBH One — Tell One, Bring One, Help One — is a free, community-powered initiative supporting Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress (NDC), ahead of the election on Saturday 16 January 2027.",
    links: [{ label: "About TBH One", path: "/about" }, { label: "The T-B-H Framework", path: "/framework" }],
  },
  {
    id: "join",
    keywords: ["join", "member", "sign up", "register with", "membership", "free"],
    answer:
      "Membership is free and open to every Nigerian at home and abroad, aged 18 or over. There are no dues. You sign up with your phone number, choose your language and state, and reach your member dashboard in about two minutes.",
    links: [{ label: "Become a Member", path: "/join" }],
  },
  {
    id: "election-date",
    keywords: ["election day", "when is", "date", "16 january", "poll", "vote when"],
    answer:
      "INEC’s revised timetable sets the Presidential and National Assembly elections for Saturday 16 January 2027. Governorship and State Assembly elections follow on Saturday 6 February 2027. Campaigning for the January polls ends at 11:59 pm on Thursday 14 January 2027.",
    links: [{ label: "Election timeline", path: "/election" }, { label: "Voter Information", path: "/voter-info" }],
  },
  {
    id: "polling-unit",
    keywords: ["polling unit", "pvc", "voter card", "where do i vote", "collect"],
    answer:
      "Polling units and PVC collection are managed by INEC, not TBH One. Use INEC’s official portal to check your registration and polling unit. TBH One never asks for your PVC number.",
    links: [{ label: "Voter Information", path: "/voter-info" }],
  },
  {
    id: "framework",
    keywords: ["tell one", "bring one", "help one", "t-b-h", "framework", "t-one", "b-one", "h-one"],
    answer:
      "Tell One: Nigerians abroad who cannot vote tell their family at home who to vote for. Bring One: bring and convince one friend who is sitting on the fence. Help One: support a community or a person in need.",
    links: [{ label: "The T-B-H Framework", path: "/framework" }],
  },
  {
    id: "funding",
    keywords: ["fund", "project", "donate", "money", "contribute", "pay"],
    answer:
      "Instead of paying dues, members fund specific published projects — for example fliers for a street, a radio advert in a city, or a community project. Every project shows its cost, target, money raised and proof of delivery, and a monthly spend summary is published on the Transparency page. Every contribution is recorded against a named contributor.",
    links: [{ label: "Fund a Project", path: "/projects" }, { label: "Transparency", path: "/transparency" }],
  },
  {
    id: "diaspora-money",
    keywords: ["abroad", "diaspora", "foreign", "overseas", "outside nigeria"],
    answer:
      "Nigerians abroad lead Tell One through diaspora chapters. Funds from outside Nigeria need legal clearance before they can be accepted, so diaspora members are directed to non-financial Tell One activity and in-kind support until clearance is recorded.",
    links: [{ label: "Diaspora Chapters", path: "/diaspora" }],
  },
  {
    id: "belief",
    keywords: ["belief", "steal", "tagline", "corruption", "slogan", "hashtag"],
    answer:
      "Our belief: Nigeria’s money belongs to Nigerians. If politicians do not steal money, there will be enough money for development. The tagline is “We will not steal your money.” The official hashtags are #WeWillNotStealYourMoney and #VotePeopleWhoWillNotStealYourMoney.",
    links: [{ label: "Our Belief", path: "/belief" }, { label: "The Message", path: "/message" }],
  },
  {
    id: "candidates",
    keywords: ["obi", "kwankwaso", "candidate", "running mate", "vice", "president"],
    answer:
      "Peter Obi is the NDC presidential candidate and Rabiu Musa Kwankwaso is his running mate, named at the NDC special convention in Abuja on 30 May 2026. TBH One is a supporting initiative, not the candidates’ official campaign site.",
    links: [{ label: "The Candidates", path: "/candidates" }, { label: "The Manifesto", path: "/manifesto" }],
  },
  {
    id: "points",
    keywords: ["points", "impact", "reward", "leaderboard", "earn"],
    answer:
      "Impact Points recognise actions such as joining, referring a member, attending an event, completing a project, distributing merch and creating content. Planned monthly rewards: 500 points for ₦500 airtime, 1,000 for 1 GB data, 2,500 for a TBH One T-shirt. Rewards never depend on how anyone votes.",
    links: [{ label: "Impact Points & Rewards", path: "/rewards" }],
  },
  {
    id: "leaders",
    keywords: ["ward leader", "street leader", "leader", "apply", "coordinator"],
    answer:
      "Ward leaders coordinate activity across one of Nigeria’s 8,809 wards; street leaders lead door-to-door outreach and distribution on their own street. Both can earn from verified work such as deliveries and distribution. Apply from the Ward Leaders or Street Leaders page.",
    links: [{ label: "Ward Leaders", path: "/careers/ward-leaders" }, { label: "Street Leaders", path: "/street-leaders" }],
  },
  {
    id: "giveaway",
    keywords: ["giveaway", "prize", "win", "draw"],
    answer:
      "There is a daily giveaway until Thursday 14 January 2027, funded through published giveaway projects. Entry is free for members, draws are recorded, and entry never depends on voting, a voter’s card or polling-unit data.",
    links: [{ label: "Daily Giveaway", path: "/giveaway" }],
  },
  {
    id: "shop",
    keywords: ["shop", "merch", "t-shirt", "cap", "order", "delivery", "coupon"],
    answer:
      "The TBH One Shop sells official merch made by partner vendors. Members see member prices automatically, delivery reaches all 36 states and the FCT, and wrong-size or damaged items can be returned within 7 days.",
    links: [{ label: "Shop", path: "/shop" }, { label: "Delivery & Returns", path: "/shop/delivery-returns" }],
  },
  {
    id: "scam",
    keywords: ["scam", "fake", "verify", "official", "fraud", "account number"],
    answer:
      "Only trust accounts, phone numbers and payment links listed on our Verify Official Channels page. TBH One will never ask for your password, card PIN or voter’s card number. If something looks wrong, report it.",
    links: [{ label: "Verify Official Channels", path: "/verify" }, { label: "Report a Concern", path: "/report" }],
  },
  {
    id: "contact",
    keywords: ["contact", "talk", "human", "person", "phone", "whatsapp", "call"],
    answer:
      "You can reach the TBH One support team through the Contact page. The official WhatsApp line and toll-free number open at launch on 9 November 2026 and will be listed on the Verify page.",
    links: [{ label: "Contact", path: "/contact" }, { label: "Verify Official Channels", path: "/verify" }],
  },
];

export function scriptedAnswer(question: string): KnowledgeEntry | null {
  const q = question.toLowerCase();
  let best: { e: KnowledgeEntry; score: number } | null = null;
  for (const e of knowledge) {
    const score = e.keywords.reduce((s, k) => (q.includes(k) ? s + k.length : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { e, score };
  }
  return best?.e ?? null;
}

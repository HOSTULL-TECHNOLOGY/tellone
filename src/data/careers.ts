/**
 * TBH One Careers: Ward Leaders (Wave 1). All copy is taken word for word from "TBH One — Careers Landing Page:
 * Ward Leaders (Wave 1)" (23 Oct 2026, @Daniel Oratokhai). Figures marked "sample" are demo data (DEMO_MODE).
 * Requirements CAR-1 to CAR-36 are listed in docs/Careers_Ward_Leaders.md.
 */
import { site } from "@/config/site";

export const WAVE = {
  wards: 8809,
  target: 10000,
  secondLeaders: 1191,
  streetLeaders: 440450,
  filledSample: 3154,
  opens: "2026-11-09",
  firstBatch: "2026-11-16",
  closes: "2026-11-30",
  streetLeadersOpen: "2026-11-23",
  cutoff: "2027-01-14T23:59:00+01:00",
} as const;

export const WA = site.contact.whatsappDisplay; // 0904 569 9268
export const TOLL_FREE = site.contact.tollFree ?? "0800 555 333 111";
export const waLink = (text?: string) => `https://wa.me/${site.contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const seo = {
  title: "Ward Leader Jobs — Lead Your Ward with TBH One (Apply Free)",
  description: "TBH One needs a leader in all 8,809 wards. Lead street leaders, host village meetings, run projects and earn fees. Register free and apply today.",
  ogTitle: "8,809 Wards. One Leader Each. Is Yours Taken? — TBH One",
  ogText: "Lead your ward, run village meetings and projects, and earn for the work you deliver. Free to join.",
  primaryQuery: "ward leader jobs Nigeria",
};

/** Headline tests (A is the default on the page; D is the Pidgin page's headline). */
export const headlines = {
  a: "Become a TBH One Ward Leader: Lead Your Ward and Earn for Your Work",
  b: "8,809 Wards. One Leader Each. Is Yours Taken?",
  c: "Your Ward. Your Movement. Your Leadership.",
  d: "Lead Your Ward, Collect Your Fee — TBH One Dey Pay Per Work",
};

export const hero = {
  eyebrow: "TBH One Careers · Wave 1 · 8,809 wards",
  h1: headlines.a,
  intro:
    "TBH One is recruiting one ward leader for each of Nigeria’s 8,809 electoral wards. As ward leader you coordinate your street leaders, host village meetings, run community projects and keep your ward safe — and you earn fees for the work you deliver, paid to your bank or mobile-money account. It is free to join. Register as a member, complete the application and start from Monday 16 November.",
  primary: "Register Free and Apply",
  secondary: "I’m Already a Member — Apply",
  closes: "Closes 30 November or when every ward is filled",
  finder: "Don’t know your ward? Most people don’t. Find it in 30 seconds:",
  trust: "No fees. No cost to apply. TBH One will never ask you to pay for a role.",
  boostTitle: "Boost your chances (optional):",
  boost: "We prioritise people who believe in the vision. Follow TBH One on 11 platforms and take other simple actions to earn Vision Points, and watch your Vision Meter fill up live. Register free to start earning.",
};

export const finder = {
  title: "Find your ward: help for people who don't know it",
  intro:
    "Most people know their street, their market and their neighbourhood — not their ward. The ward finder starts from what people already know and works out the ward for them. It is public (no registration needed), works on 3G, and the ward it finds carries into registration and the application, so nobody types it twice.",
  entry: "Not sure which ward you live in? Most people aren’t. Tell us where you live and we’ll find it.",
  ways: [
    { key: "location", way: "1. Use my location", bestFor: "People with a phone and GPS, standing in their ward", how: "The browser or app asks permission, finds the ward from the location, and shows the ward outline and a pin on the map", button: "📍 Find my ward with my location" },
    { key: "search", way: "2. Search my area or landmark", bestFor: "People who know their neighbourhood but not the ward", how: "Type a street, market, school, church, mosque, park or motor park. Suggestions show the ward and LGA beside each place, for example “Kawo Market — Kawo ward, Kaduna North”", button: "🔎 Search my area" },
    { key: "list", way: "3. Pick from the list", bestFor: "People who like to browse, or on slow connections", how: "Choose state, then LGA, then ward. Each ward lists the neighbourhoods and landmarks it covers, so people recognise theirs. The map is optional", button: "🗺️ Pick from the list" },
    { key: "ask", way: "4. Ask us to find it", bestFor: "People with a basic phone, or anyone still unsure", how: `Send a location pin or the name of your area on WhatsApp to ${site.contact.whatsappDisplay}, or call ${site.contact.tollFree}. We reply with the ward and an application link`, button: "💬 Ask us on WhatsApp" },
  ],
  confirm: "Is this where you live?",
  yes: "Yes, this is my ward",
  no: "No, show wards near me",
  status: {
    open: { message: (w: string) => `Good news — ${w} ward has no leader yet.`, button: (w: string) => `Register Free and Apply for ${w} Ward` },
    taken: { message: (w: string) => `${w} ward already has a leader.`, button: "Join the Waiting List", button2: "Become a Street Leader from 23 November" },
    nobody: { message: (w: string) => `Know someone who lives in ${w}? Send them this page.`, button: "Share on WhatsApp" },
  },
  helpers: {
    blocked: "No problem — search for your area or pick from the list instead.",
    several: (place: string) => `Several places are called ${place}. Which one?`,
    boundary: (a: string, b: string) => `You’re close to the edge of two wards: ${a} and ${b}. Choose the one you live in. Not sure? Your state team will check it with you.`,
    notFound: "We couldn’t find that place. Try the name of a nearby market, school, church or mosque, or choose your state and LGA.",
    slow: "Light mode is on: the list works without the map.",
    privacy: "We use your location once to find your ward. We don’t save it unless you apply, and we never share it.",
    pvc: "Your ward here is where you live, not where you vote. We never ask for your PVC or polling unit.",
    wrong: "This ward looks wrong",
    wrongThanks: "Tell us — we’ll fix it within a week",
    moved: "If your state team finds you live in a different ward, they’ll move your application for you. You don’t need to start again.",
    otherState: (found: string, chosen: string) => `Your location is in ${found} State, but you chose ${chosen}. Which is your home ward?`,
    slowText: `Light mode is on: the ward list works without the map. You can also text your area to ${site.contact.whatsappDisplay}.`,
  },
  helperTitle: `WhatsApp and phone helper (${site.contact.whatsappDisplay} · ${site.contact.tollFree})`,
  helperRows: [
    ["A location pin", "Hi, I’m the TBH One assistant (an automated helper). Your ward is Ungwan Rimi, Kaduna North, Kaduna. It has no leader yet. Apply here: www.tbhone.com.ng/careers. Reply HELP to talk to a person."],
    ["The name of an area, for example “Kawo market”", "I found two possible wards: 1 Kawo, 2 Ungwan Rimi. Reply 1 or 2."],
    ["“WARD” followed by the area (from the radio jingle)", "Thanks! Your ward is Ungwan Rimi, Kaduna North. Apply free: www.tbhone.com.ng/careers"],
    ["Something we can’t match", `I couldn’t match that. A person from our team will message you within 1 hour. Or call ${site.contact.tollFree}, free.`],
  ] as [string, string][],
  helperNote: "When a message needs a person, the call centre agent sees what the assistant already found, so the caller never repeats themselves.",
  dataSources: [
    "The list of all 8,809 wards with their LGAs and states, from INEC.",
    "Ward boundary maps from publicly available ward boundary data (for example GRID3 Nigeria).",
    "Landmarks (markets, schools, places of worship, motor parks) from open map data, plus local names and nicknames added by state teams and existing leaders.",
    "State coordinators check every ward in their state before launch, and every “This ward looks wrong” report is fixed within a week.",
  ],
  safeguards: [
    "The applicant confirms “I live in this ward”, the endorser confirms it again, and the state team checks it before approval.",
    "The location is used once, kept only if the person applies, and never shared.",
    "No PVC, polling-unit or voting data is used or asked for.",
  ],
};

export const vision = {
  title: "Vision Points: show your support and boost your application",
  intro:
    "TBH One wants ward leaders who believe in the vision and will carry it. Vision Points let applicants show that. Follow our official accounts and take a few other simple actions, and your points appear on a live Vision Meter as you go. A stronger score improves your chance when more than one person applies for the same ward. It is optional, capped and fair: people without social media can still reach 80 out of 100.",
  how: [
    ["1. Register free", "Points belong to your member account, so register first"],
    ["2. Open the Boost panel", "It appears on your dashboard and on this page once you are logged in"],
    ["3. Follow", "Tap a platform tile; it opens our official account; follow or subscribe"],
    ["4. Confirm", "Tap “I’ve followed” and upload a quick screenshot as proof"],
    ["5. Watch your meter", "Points show instantly as pending and become final when checked, usually within 24 hours"],
  ] as [string, string][],
  panelTitle: "Show your support. Boost your application.",
  panelText: "Follow our official accounts, earn Vision Points and watch your meter fill up. Stronger applications are considered first when more than one person applies for a ward.",
  sampleMeter: "Your Vision Meter: 38 / 100 · Level: Supporter · 4 of 11 platforms followed · 10 points pending",
  sampleStrength: "Good · Tip: 3 more follows take you to Advocate.",
  pendingNote: "Pending points show on your meter straight away, so you see progress as you follow. Only verified points count in the final score.",
  tileStates: [
    ["Not followed", "Follow @tbhonenigeria on Instagram · +10 points · Follow"],
    ["Followed, not confirmed", "I’ve followed · Upload proof"],
    ["Checking", "Checking… +10 pending"],
    ["Verified", "✓ Verified · +10 points"],
    ["Needs better proof", "Please upload a clearer screenshot showing your name and the Following button"],
    ["Removed", "Points removed — you no longer follow us here. Follow again to get them back."],
  ] as [string, string][],
  levels: [
    { min: 0, max: 24, name: "Starter", message: "Welcome! Every follow counts." },
    { min: 25, max: 49, name: "Supporter", message: "You’re building momentum." },
    { min: 50, max: 74, name: "Advocate", message: "Your support is clear. Keep going." },
    { min: 75, max: 99, name: "Champion", message: "Almost there." },
    { min: 100, max: 100, name: "Vision Leader", message: "Full marks. Thank you for believing in the vision." },
  ],
  platforms: [
    { key: "instagram", name: "Instagram", account: "@tbhonenigeria", why: "Reels, stories and campaign moments", points: 10 },
    { key: "facebook", name: "Facebook", account: "facebook.com/tbhonenigeria", why: "Events, live videos and community updates", points: 10 },
    { key: "x", name: "X (Twitter)", account: "@tbhonenigeria", why: "Breaking campaign and election updates", points: 10 },
    { key: "tiktok", name: "TikTok", account: "@tbhonenigeria", why: "Short videos and skits", points: 10 },
    { key: "youtube", name: "YouTube", account: "youtube.com/@tbhonenigeria", why: "TBH One TV, town halls and explainers", points: 10 },
    { key: "threads", name: "Threads", account: "@tbhonenigeria", why: "Everyday conversations with the movement", points: 8 },
    { key: "linkedin", name: "LinkedIn", account: "TBH One company page", why: "Professionals and diaspora network", points: 8 },
    { key: "kingschat", name: "KingsChat", account: "@tbhonenigeria", why: "Community messaging and updates", points: 8 },
    { key: "snapchat", name: "Snapchat", account: "@tbhonenigeria", why: "Youth stories and quick updates", points: 8 },
    { key: "substack", name: "Substack", account: "tbhonenigeria.substack.com", why: "Long reads and the TBH One newsletter", points: 6 },
    { key: "pinterest", name: "Pinterest", account: "pinterest.com/tbhonenigeria", why: "Posters, infographics and ideas to save", points: 6 },
  ] as { key: keyof typeof site.social; name: string; account: string; why: string; points: number }[],
  bonus: { label: "Bonus: all 11 platforms", why: "Vision Champion bonus", points: 6 },
  handlesNote: "Official handles follow the confirmed @tbhonenigeria handle. The digital lead must register it on all 11 platforms before launch; where a handle is taken, update this table and the Verify Official Channels page.",
  other: [
    { key: "channel", action: "Join the TBH One WhatsApp Channel", points: 10, limit: "Once", max: 10, check: "Automatic" },
    { key: "event", action: "Attend a TBH One event or village meeting", points: 15, limit: "Twice (30)", max: 30, check: "Event check-in" },
    { key: "quiz", action: "Pass the Vision Quiz (10 questions on our belief, the T-B-H framework and the leader rules; 8 correct to pass)", points: 20, limit: "Once, one retake", max: 20, check: "Automatic" },
    { key: "invite", action: "Invite a friend who registers as a member", points: 5, limit: "Four friends (20)", max: 20, check: "Automatic" },
  ],
  noSocial: "No social media? You can still reach 80 out of 100: join the WhatsApp Channel, attend two events, pass the Vision Quiz and invite four friends.",
  cap: "The cap: all Vision Points together count up to 100 in your score. Anything above 100 is added to your Impact Points for rewards.",
  chooseIntro: "Eligibility is a simple pass or fail: age 18+, living in the ward, valid ID, endorser confirmed. Everyone who passes is scored out of 100.",
  score: [
    ["Community standing and endorsement", 30],
    ["Knowledge of the ward and readiness to lead (streets known, groups led, availability)", 25],
    ["Vision Points (your Vision Meter, counted out of 100, divided by 5)", 20],
    ["Commitment (hours you can give, device, training readiness)", 15],
    ["Complete, verified application", 10],
  ] as [string, number][],
  chooseRules: [
    "If only one person applies for a ward, they are approved as soon as verification and endorsement are complete.",
    "If more than one person applies, we compare scores after 7 days from the first application, or at the close of wave 1. The highest score gets the place; ties go to the earliest verified application.",
    "Everyone else is offered the waiting list for a second-leader place in wave 2, and a street leader place from 23 November.",
    "Vision Points can help you but never decide alone: they are one fifth of the score. They don’t guarantee a place.",
    "The state team reviews every decision, and anyone can ask for a review through Support & Complaints.",
  ],
  honest: [
    "You must have a personal, active account on each platform, and the handle you give must be yours.",
    "Points are removed if you stop following before the decision is made. We re-check every finalist’s follows on decision day and spot-check about 1 in 10 other applicants.",
    "Fake, edited or reused screenshots lead to removal of the points and a warning. A second case rejects the application.",
    "We don’t give points for likes, comments, follower counts or what you post. This is about showing support, not being popular.",
    "Never buy followers or use bots.",
  ],
  privacy: [
    "The social check is optional and has its own consent box. Following a movement can reveal political opinion, which the Nigeria Data Protection Act 2023 treats as sensitive, so we ask clearly and you can say no.",
    "We keep only your handle, which accounts you followed, whether each was verified, and your proof image. Proof images are deleted 90 days after the decision, and handles 12 months after the campaign.",
    "Where we confirm a follow through a platform’s official connect tool, access is read-only and ends as soon as the check is done.",
    "If you withdraw consent, your social points are removed and your proof images deleted. Your application is not rejected for that.",
    "We never share this data, and we never use it for ads.",
  ],
  copy: {
    consent: "(Optional) I agree TBH One may check that I follow its official accounts to give me Vision Points. This shows my support for TBH One. I can withdraw this anytime.",
    proof: "Open the app, go to our profile, and take a screenshot that shows your username and the Following or Subscribed button. Upload it here. We usually confirm within 24 hours.",
    handle: (p: string) => `Your username on ${p} (for example @yourname)`,
    toast: (pts: number, p: string, level: string, total: number) => `+${pts} Vision Points! Your ${p} follow is verified ✓ You’re a ${level} (${total}/100).`,
    levelUp: (level: string, total: number) => `You’re now ${/^[AEIOU]/.test(level) ? "an" : "a"} ${level}! ${total} out of 100.`,
    full: "Vision Leader! 100 out of 100. Thank you for believing in the vision.",
    nudge: (n: number, level: string) => `${n} more follow${n === 1 ? "" : "s"} will make you ${/^[AEIOU]/.test(level) ? "an" : "a"} ${level}.`,
    offline: "No social media? Join our WhatsApp Channel, attend an event or take the Vision Quiz. You can still reach 80 out of 100.",
    fairness: "Vision Points are 20% of your score. They boost your application; they never decide it alone.",
  },
};

export const steps = [
  { step: "1. Register free", what: "Join TBH One as a member with your phone number", time: "2 minutes" },
  { step: "2. Apply", what: "Complete the ward leader application inside your member account", time: "10 minutes" },
  { step: "3. Get endorsed and verified", what: "A recognised local figure confirms you, the state team checks your ID and holds a short call with you", time: "Within 3 working days" },
  { step: "4. Train", what: "Complete the ward leader training: event safety, vetting street leaders, approvals and project management", time: "2 hours, online or at your state session" },
  { step: "5. Start leading", what: "Receive your verified leader ID and dashboard, and begin recruiting street leaders", time: "From 16 November" },
  { step: "Optional: Boost", what: "Earn Vision Points by following our official accounts and joining our WhatsApp Channel. Stronger applications are considered first when more than one person applies for a ward.", time: "5 to 15 minutes" },
];
export const whyRegister = "Your member account is how we verify you, give you access, pay you and keep you safe. It takes two minutes and unlocks every member benefit: skill training, jobs, the Shop, coupons and Impact Points.";

export const duties = [
  ["Lead your street leaders.", "Recruit, endorse and support the street leaders in your ward, and assign them tasks."],
  ["Approve their work.", "Review task proof (photo, location, count) and approve payments in the app within 48 hours."],
  ["Host village meetings.", "Plan safe meetings with the app’s checklist: police notified, marshals assigned, exits mapped."],
  ["Run community projects.", "Propose a project such as a borehole repair or a clinic clean-up, manage it when funded and upload proof of delivery."],
  ["Manage local advertising.", "Buy and manage approved local ads, posters and banners for your ward."],
  ["Run a pickup point.", "Hand over Shop orders to neighbours who collect locally."],
  ["Keep people safe.", "Report any incident through Report a Concern and make sure everyone follows the Code of Conduct."],
] as [string, string][];
export const dutiesNote = "You work alongside your elected Councillor, not instead of them. Ward leader is a TBH One organising role, not a government office.";

export const earnings = [
  ["Host a village meeting (up to 4 a month)", "₦5,000 per meeting", "Attendance list, photos, police notice"],
  ["Manage a funded community project", "5% of the delivered project value, up to ₦50,000 per project", "Proof of delivery uploaded"],
  ["Manage an approved local ad campaign", "₦10,000 per campaign", "Photos and invoices"],
  ["Hand over a Shop order at your pickup point", "₦200 per order", "Delivery code"],
  ["Introduce a vendor whose order is delivered and paid", "2% of the order value", "Paid order record"],
  ["Every action", "Impact Points", "Automatic"],
  ["Recruit a Town Crier", "5% of the total work project the town crier delivers", "Signed town crier agreement and completed work report"],
  ["Flier drop", "₦500 per 100 fliers", "Geo-tagged photo and count"],
  ["Poster run", "₦1,000 per 20 posters", "Geo-tagged photo and count"],
  ["Banner distribution", "₦500 per banner", "Geo-tagged photo of each banner placed, with the owner’s permission"],
  ["Door-to-door shift", "₦1,500 per 4-hour shift", "Check-in and check-out in the app"],
  ["Merch distribution", "₦200 to ₦500 per item", "Photo and count"],
] as [string, string, string][];
export const exampleMonth = { parts: ["4 village meetings (₦20,000)", "1 community project of ₦850,000 (₦42,500)", "40 pickup orders (₦8,000)"], total: "₦70,500", tail: "plus Impact Points you can turn into airtime, data and shop coupons." };
export const howPaid = "Your state team approves each fee claim. A different person always approves and releases a payment, so you cannot approve your own. Approved fees are paid to your bank or mobile-money account within 24 hours.";
export const pleaseNote = "This is task-based work, not a salary or a job offer from a government or political party. Fees are launch rates and are reviewed every two weeks. Earnings depend on the work available in your ward.";

export const requirements = [
  ["Age 18 or over", "Legal requirement"],
  ["Live in the ward you will lead", "You know it and it knows you"],
  ["Respected in your community", "Neighbours must trust you to lead"],
  ["An Android phone (version 8 or later), iPhone or laptop", "To manage approvals, events and projects"],
  ["A bank or mobile-money account in your name", "So we can pay you"],
  ["A valid ID (NIN slip, driver’s licence, international passport or national ID card)", "To keep the movement safe and prevent fake accounts"],
  ["Endorsement from a recognised local figure: a traditional ruler or village head, religious leader, association chairperson or NDC ward officer", "They confirm you are who you say you are"],
  ["Willingness to sign the Code of Conduct", "Seven pledges that protect everyone"],
] as [string, string][];
export const helpful = "Experience leading a group, such as a community, faith, youth, women’s, market or union group. You do not need to hold or have held political office.";
export const goodToKnow = "We never ask how you plan to vote, and we never ask for your PVC number. Ward leaders promote Obi/Kwankwaso x NDC, so you should be comfortable doing that.";

/** Places by region exactly as in the document (wave 1: one per ward). Filled figures are the sample. */
export const regions = [
  { region: "North-West", zone: "North West", wards: 1973, filled: 702 },
  { region: "South-West", zone: "South West", wards: 1650, filled: 640 },
  { region: "South-South", zone: "South South", wards: 1390, filled: 488 },
  { region: "North-Central (incl. FCT)", zone: "North Central", wards: 1377, filled: 495 },
  { region: "South-East", zone: "South East", wards: 1227, filled: 441 },
  { region: "North-East", zone: "North East", wards: 1192, filled: 388 },
];
export const regionsNote = "Regional figures are scaled to the national total of 8,809 wards and are confirmed against INEC’s ward list before launch. When more than one person applies for a ward, the place goes to the highest-scoring applicant (see How we choose under Vision Points). If your ward is taken, join the waiting list for a second-leader place in wave 2.";

export const safety = [
  "Plan every event with the safety checklist: police notified, marshals assigned, exits mapped, no children without parents, no paid attendance.",
  "Always work with others, never alone, and check in on the app during events.",
  `Your verified leader ID has a code anyone can check at ${site.domain}/verify.`,
  "Report any problem in one tap with Report a Concern, or call the toll-free line.",
  "TBH One will never ask you to pay for a role, a uniform, training or an ID. If anyone does, report it.",
  "Read the Street Activation Guide before you start recruiting.",
];

export const support = [
  "Free ward leader training and a verified leader ID",
  "A direct line to your state coordinator",
  "A dashboard with your ward overview, street leader roster, approvals, events, projects and materials",
  "Impact Points and monthly rewards",
  "Priority access to training, associate work and project management",
  "A route to larger roles on your state team",
  `Toll-free support line: ${site.contact.tollFree} (24 hours)`,
];

export const faq: { q: string; a: string }[] = [
  { q: "Do I have to pay anything to apply or to start?", a: "No. Registering, applying, training and your leader ID are free. TBH One never asks for money for a role." },
  { q: "Why must I register as a member first?", a: "Your member account is how we verify you, give you access, pay you and keep you safe. It takes two minutes." },
  { q: "I'm already a member. What do I do?", a: "Log in and open Apply to be a Ward Leader on your dashboard. Your details are already filled in." },
  { q: "Is this a government or party job?", a: "No. Ward leader is a TBH One organising role. You work alongside your Councillor, not instead of them, and you are paid fees for work delivered." },
  { q: "Is this a salary?", a: "No. You earn fees for each meeting, project, ad campaign and order you handle. A typical month with 4 village meetings, 1 project and 40 pickup orders pays ₦70,500." },
  { q: "Who endorses me?", a: "A recognised local figure, such as a traditional ruler or village head, religious leader, association chairperson or NDC ward officer. If you don't have one, apply anyway and the state team will help you connect." },
  { q: "What if my ward already has a leader?", a: "Join the waiting list for a second-leader place in wave 2, or become a street leader when recruitment opens on 23 November." },
  { q: "I want to be a street leader, not a ward leader.", a: "Street leader places open on Monday 23 November 2026. Register as a member now and join the waiting list so you are first in line." },
  { q: "When do I get paid?", a: "Within 24 hours of your state team approving a fee claim, to your bank or mobile-money account." },
  { q: "Do I need to tell you who I will vote for?", a: "No. We never ask how you plan to vote, and we never ask for your PVC number." },
  { q: "Can I do this alongside work or study?", a: "Yes. Most ward leaders give 5 to 15 hours a week and choose their own schedule." },
  { q: "What if I live abroad?", a: "Ward leader places are for people living in the ward in Nigeria. Join your country's diaspora chapter instead." },
  { q: "Is my information safe?", a: "We collect only what we need, never sell it, and you can view or delete it anytime. See our Privacy Policy." },
  { q: "I don't know my ward. How do I find it?", a: `Use the ward finder at the top of this page. Tap Use my location, or type a street, market, school or church near you, or pick your state and LGA and choose from the list. Still stuck? Send your location pin to ${site.contact.whatsappDisplay} on WhatsApp, or call ${site.contact.tollFree} free.` },
  { q: "Is my ward the place where I vote?", a: "Not always. For this role your ward is the ward where you live. We never ask for your PVC or polling unit." },
  { q: "I live near the edge of two wards. Which one do I choose?", a: "Choose the ward you live in. If you're not sure, choose the closest and apply. Your state team will check it with you and move your application if needed, so you won't need to start again." },
  { q: "Does the ward finder track me?", a: "No. If you use your location, we use it once to find your ward. We don't save it unless you apply, and we never share it." },
  { q: "The finder shows the wrong ward. What now?", a: "Tap This ward looks wrong and tell us. We fix it within a week, and your state team will make sure you are applying for the right ward." },
  { q: "Do I have to follow you on social media to be a ward leader?", a: "No. It is optional. Vision Points are 20 of 100 selection points, and you can reach 80 out of 100 without any social media by joining our WhatsApp Channel, attending events, passing the Vision Quiz and inviting friends." },
  { q: "How do Vision Points work?", a: "You earn points for following our official accounts on 11 platforms and for other simple actions. Your Vision Meter shows your points live. A higher score helps if more than one person applies for your ward, but it never decides alone." },
  { q: "How do you know I really follow?", a: "You upload a screenshot showing your username and the Following button. Points show as pending straight away and become final once checked, usually within 24 hours. We re-check finalists on decision day." },
  { q: "What happens if I unfollow?", a: "The points for that platform are removed until you follow again. Please keep following until the decision is made." },
  { q: "Do likes, comments or follower counts matter?", a: "No. Only following our official accounts counts. We don't score likes, comments, posts or how many followers you have." },
  { q: "Is my social media data safe?", a: "The check is optional and needs your separate consent. We keep only your handle, what you followed and your proof image, delete proof images 90 days after the decision, and never share or sell this data. You can withdraw consent anytime." },
];

export const finalCta = {
  h2: "Your ward is waiting. Be its leader.",
  copy: (open: number) => `${open.toLocaleString("en-NG")} wards still need a leader. Register free, apply in ten minutes, and start leading from 16 November.`,
  primary: "Register Free and Apply",
  secondary: `Talk to Us on WhatsApp (${site.contact.whatsappDisplay})`,
};

/** Careers hub (/careers): every role requires free member registration first. */
export const hubRoles = [
  { role: "Ward Leader — 8,809 places, one per ward", status: "Open now", button: "Apply", path: "/careers/ward-leaders" },
  { role: "Street Leader — 440,450 places (one per street)", status: "Opens Monday 23 November 2026", button: "Join the waiting list", path: "/street-leaders#waitlist" },
  { role: "Country Coordinator — 200+ places", status: "Open", button: "Apply", path: "/diaspora#apply" },
  { role: "Creators, Translators and Associates", status: "Open", button: "See briefs", path: "/creators" },
];

/** Sign-up and application flow copy. */
export const flow = {
  phone: { title: "Register free to apply.", text: "Enter your phone number. We’ll send you a 6-digit code.", button: "Send code" },
  code: { text: (masked: string) => `Enter the code we sent to ${masked}.`, button: "Verify" },
  about: { fields: "First name · Last name · Find your ward · Language" },
  consent: { required: "I’m 18 or older and agree to the Terms of Service and Privacy Policy (required)", updates: "Send me updates by SMS and WhatsApp", button: "Register" },
  welcome: { title: (name: string) => `You’re a TBH One member, ${name}!`, text: "One more step: complete your ward leader application. You’ve earned 50 Impact Points.", button: "Continue to Application" },
  submit: "Submit Application",
  confirmation: (name: string, ref: string) => `Thank you, ${name}! Your application ${ref} is in. We’ve texted your endorser to confirm you. The state team will contact you within 3 working days.`,
  tracker: ["Registered", "Applied", "Endorser confirms", "State team review", "Training", "Leader ID", "Recruit street leaders"],
  endorserRoles: ["Traditional ruler or village head", "Religious leader", "Association chairperson", "NDC ward officer"],
  idTypes: ["NIN slip", "Driver’s licence", "International passport", "National ID card"],
  hours: ["5–8", "9–15", "16+"],
  groups: ["Community", "Faith", "Youth", "Women’s", "Market", "Union"],
  pledges: [
    "I have read and will follow the Code of Conduct",
    "I understand TBH One will never ask me to pay for this role",
    "I understand this is a TBH One organising role, not a government office",
  ],
  pledgeOptional: "(Optional) I agree TBH One may check that I follow its official accounts to give me Vision Points; I can withdraw this anytime",
};

/** SMS / WhatsApp messages (shown in the applicant's message timeline). `{name}`, `{ward}`, `{ref}` are filled in. */
export const messages = {
  nudge24h: "Hi {name}, you’re a TBH One member! Finish your ward leader application in 10 minutes: www.tbhone.com.ng/careers. 5,655 wards still need a leader. Reply STOP to opt out.",
  nudge3d: "{name}, your ward needs a leader. Apply before it’s taken: www.tbhone.com.ng/careers",
  received: "Application {ref} received. Your endorser has been asked to confirm you. The state team will be in touch within 3 working days.",
  endorser: "{full} has named you to endorse his application as TBH One ward leader for {ward}. Reply YES to confirm you know him, or NO. TBH One never asks for money.",
  approved: "Great news, {name}! You’re approved. Start your 2-hour ward leader training: www.tbhone.com.ng/training/leader",
  trained: "Training done! Your leader ID is ready. Download it in the app and start recruiting street leaders.",
  taken: "Your ward already has a leader. You’re on the waiting list for a second-leader place, and first in line for street leader recruitment from 23 November.",
  notVerified: `We couldn’t verify your ID or endorsement. Please check your details and reapply, or call ${site.contact.tollFree}.`,
  finderNotRegistered: "Your ward {ward} still needs a leader. Register free and apply: www.tbhone.com.ng/careers. Reply STOP to opt out.",
  moved: "{name}, we’ve moved your application to Kawo ward, where you live. You don’t need to do anything. We’ll update you soon.",
  wardFixed: "Thanks for telling us. We’ve corrected the ward information for Sabon Gari. Please check it again: www.tbhone.com.ng/careers",
  followPending: "Thanks, {name}! Your Instagram follow is being checked. +10 pending points are on your Vision Meter.",
  followVerified: "+10 Vision Points! Your Instagram follow is verified. You’re a Supporter: 38 out of 100.",
  proofUnclear: "We couldn’t see your username and the Following button on X. Please upload a clearer screenshot.",
  unfollowed: "We noticed you no longer follow @tbhonenigeria on X, so 10 Vision Points were removed. Follow again to get them back.",
  nudgeFollow: "{name}, 2 more follows make you an Advocate. Boost your application: www.tbhone.com.ng/careers",
};

/** Error and edge states. */
export const edges = {
  under18: "Ward leader places are for people aged 18 and over. You can still join TBH One as a member when you turn 18.",
  abroad: "Ward leader places are for people living in Nigeria. Join your country’s diaspora chapter instead.",
  taken: "This ward already has a leader. Join the waiting list for a second-leader place in wave 2.",
  notFound: "We couldn’t find that ward. Check the spelling or pick from the list.",
  nameMismatch: "The account name must match your ID. Check it or use a mobile-money number in your name.",
  endorserNo: "Your endorser hasn’t confirmed. Name another local figure, or ask your state team to help.",
  duplicate: (ref: string) => `You’ve already applied. Your application ${ref} is awaiting endorsement.`,
  closed: "Wave 1 is closed. Join the waiting list for wave 2.",
};

/** Rules and compliance (shown on the page and enforced in the application). */
export const rules = [
  "Fees are payment for work done. They are never linked to votes, PVCs or polling units, and never depend on how anyone votes.",
  "Recruitment copy never promises employment, a government job, a political appointment or a fixed income.",
  "No fees are ever charged for applying, training, an ID or a role.",
  "Ward leaders cannot approve their own fee claims; a different person approves and releases every payment.",
  "ID photos and selfies are stored encrypted and kept for the campaign period plus 12 months, then deleted. Consent is recorded under the Nigeria Data Protection Act 2023.",
  "Every ward leader signs the Code of Conduct and completes training before starting.",
  "All recruitment stops at the campaign cut-off, 11:59 pm on Thursday 14 January 2027.",
];

/** The Vision Quiz: 10 questions on the belief, the T-B-H framework and the leader rules (8 correct to pass). */
export const quiz: { q: string; options: string[]; answer: number }[] = [
  { q: "What is TBH One's one promise?", options: ["We will not steal your money", "Free money for every member", "A government job for every leader"], answer: 0 },
  { q: "What does T-B-H stand for?", options: ["Tell One, Bring One, Help One", "Train, Build, Hire", "Talk, Ballot, Hold"], answer: 0 },
  { q: "Who is a ward leader's role alongside — not instead of?", options: ["The elected Councillor", "The state governor", "The INEC officer"], answer: 0 },
  { q: "How much does it cost to apply, train or get a leader ID?", options: ["Nothing — it is always free", "₦5,000", "Your first month's fees"], answer: 0 },
  { q: "Can a ward leader approve their own fee claim?", options: ["No — a different person approves and releases every payment", "Yes, after 48 hours", "Yes, if the state team agrees"], answer: 0 },
  { q: "Which ward do you apply for?", options: ["The ward where you live", "The ward where you vote", "Any ward with no leader"], answer: 0 },
  { q: "Does TBH One ask for your PVC number or how you will vote?", options: ["Never", "Only at the interview", "Only for ward leaders"], answer: 0 },
  { q: "What must be done before a village meeting?", options: ["Police notified, marshals assigned, exits mapped", "Pay people to attend", "Invite children without parents"], answer: 0 },
  { q: "How are ward leaders paid?", options: ["Fees for work delivered, to a bank or mobile-money account", "A monthly salary", "Cash at rallies"], answer: 0 },
  { q: "If someone asks you to pay for a uniform or a role, what do you do?", options: ["Report it — TBH One never charges for these", "Pay and ask for a receipt", "Share it with your street leaders"], answer: 0 },
];

/**
 * TBH One Careers: Ward Leaders (Wave 1). Page copy is taken word for word from the updated "Career Page content" (publish-ready copy,
 * in page order), which follows "TBH One — Careers Landing Page: Ward Leaders (Wave 1)" (23 Oct 2026). Figures marked "sample" are demo data (DEMO_MODE).
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
  ogTitle: "8,809 Wards. One Leader Each. Is Yours Taken?",
  ogText: "Lead your ward, earn for the work you deliver, and help change Nigeria. Free to join.",
  primaryQuery: "ward leader jobs Nigeria",
};

/** Headline variants. A is the page headline; B is the homepage band; D is the Pidgin page's headline. */
export const headlines = {
  a: "Become a TBH One Ward Leader: Lead Your Ward and Earn for Your Work",
  b: "8,809 Wards. One Leader Each. Is Yours Taken?",
  c: "Your Ward. Your Movement. Your Leadership.",
  d: "Lead Your Ward, Collect Your Fee — TBH One Dey Pay Per Work",
};

/** Sticky strip (appears on scroll) and the contact line shown on every careers screen. */
export const stickyStrip = (open: number) => `8,809 wards. One leader each. ${open.toLocaleString("en-NG")} still need one.`;
export const contactLine = { tollFree: `Toll-free ${site.contact.tollFree} (24 hours)`, whatsapp: `Call or WhatsApp ${site.contact.whatsappDisplay}`, email: site.contact.email ?? "" };

export const hero = {
  eyebrow: "TBH One Careers · Wave 1 · 8,809 wards · Applications open",
  h1: headlines.a,
  sub: "Your community already looks to you. Now lead it for a movement that says one thing and means it: we will not steal your money.",
  intro:
    "TBH One is recruiting one ward leader for each of Nigeria's 8,809 electoral wards. You will coordinate street leaders, host village meetings, run community projects and keep your ward safe — and you will be paid fees for the work you deliver, straight to your bank or mobile-money account. It is free to join, we train you, and you start from Monday 16 November.",
  reasons: [
    ["Free", "no cost to register, apply, train or get your ID"],
    ["Paid", "fees for every meeting, project and task, paid within 24 hours of approval"],
    ["Supported", "free training, a verified leader ID and a state team behind you"],
    ["Meaningful", "be part of the 16 January 2027 election, and what comes after"],
  ] as [string, string][],
  primary: "Register Free and Apply",
  secondary: "I'm Already a Member — Apply",
  closes: "Applications close Monday 30 November or when every ward is filled",
  finder: "Is your ward taken? Not sure which ward you live in? Most people aren't.",
  trust: "TBH One will never ask you to pay for a role, a uniform, training or an ID.",
};

/** 2. Why this matters */
export const why = {
  h2: "Every big change in Nigeria starts in a ward.",
  paras: [
    "Nigeria has 8,809 wards and about 440,450 streets. That is where people live, trade, worship, argue and decide. It is also where promises are tested, because neighbours can see for themselves whether something was done.",
    "TBH One believes Nigeria's money belongs to Nigerians. If politicians do not steal, there is enough for jobs, security, power, clean water, hospitals and schools. We want a leader in every ward who people know, trust and can check on — someone from the community, not someone sent from outside.",
  ],
  numbers: [
    ["8,809", "wards"],
    ["440,450", "streets"],
    ["5,000,000", "members to reach"],
    ["16 January 2027", "Election Day"],
  ] as [string, string][],
  quote: { text: "This is not Peter Obi alone. This is all of us.", by: "TBH One National Coordinator" },
};

/** 3. What's in it for you */
export const benefits = {
  h2: "Six reasons ward leaders say yes",
  items: [
    ["💰", "Earn for your work", "Fees for every village meeting, project, ad campaign, order handed over and task you deliver. Approved fees are paid to your bank or mobile-money account within 24 hours."],
    ["🎓", "Learn real skills", "Free ward leader training in event safety, managing people, approvals and project management, plus access to free courses on the Training Calendar. You earn a TBH One certificate."],
    ["👥", "Lead a team", "Build and manage a team of street leaders — about one for each of the roughly 50 streets in your ward — with a dashboard that shows you who is doing what."],
    ["🪪", "Be recognised", "A verified TBH One leader ID, a place on the leaderboard if you choose, Impact Points you can turn into airtime, data, merch and shop coupons, and standing in your community."],
    ["📈", "Grow", "Ward leaders get first access to associate work, project management contracts and larger roles on the state team."],
    ["🇳🇬", "Make history", "Help put the Obi/Kwankwaso x NDC message on every street before 16 January 2027, and help build civic participation that continues after the vote."],
  ] as [string, string, string][],
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
    ["1. Start your application", "The first step is following our official accounts, before you fill anything in"],
    ["2. Follow", "Tap a tile; it opens our official account; follow, subscribe or join"],
    ["3. Confirm", "Tap “I’ve followed” and upload a quick screenshot as proof (the WhatsApp Channel counts as soon as you join)"],
    ["4. Watch your meter", "Points show instantly as pending and become final when checked, usually within 24 hours"],
    ["5. Earn more at the end", "Once your application is in, the last page has events, the Vision Quiz and invites"],
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
    { key: "whatsapp", name: "WhatsApp Channel", account: "TBH One WhatsApp Channel", why: "Official updates straight to your phone", points: 10, auto: true },
    { key: "telegram", name: "Telegram", account: "t.me/tbhonenigeria", why: "Channel updates for low-data phones", points: 8 },
  ] as { key: keyof typeof site.social; name: string; account: string; why: string; points: number; auto?: boolean }[],
  bonus: { label: "Bonus: all 13 accounts", why: "Vision Champion bonus", points: 6 },
  handlesNote: "Official handles follow the confirmed @tbhonenigeria handle. The digital lead must register it on all 11 platforms before launch; where a handle is taken, update this table and the Verify Official Channels page.",
  other: [
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
    ["Commitment (hours a day you can give, device, training readiness)", 15],
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
    offline: "No social media? Join our WhatsApp Channel, attend two events, pass the Vision Quiz and invite four friends. You can still reach 80 out of 100.",
    fairness: "Vision Points are 20% of your score. They boost your application; they never decide it alone.",
  },
};

/** 4. What you will do */
export const duties = [
  ["Lead your street leaders.", "Recruit and endorse the street leaders in your ward, give them tasks and encourage them. Start with ten in your first two weeks."],
  ["Approve their work.", "Check each task's photo, location and count in the app and approve within 48 hours so people are paid on time."],
  ["Host village meetings.", "Bring neighbours together. The app's safety checklist makes sure the police are notified, marshals are assigned and exits are mapped."],
  ["Run community projects.", "Propose a project — a borehole repair, a drainage clean-up, a clinic fix — manage it when members fund it and upload proof of delivery."],
  ["Manage local advertising.", "Buy and manage approved posters, banners and ads for your ward, and recruit town criers to carry the message in markets and communities."],
  ["Keep people safe.", "Make sure everyone follows the Code of Conduct and report any problem through Report a Concern."],
] as [string, string][];
export const dutiesTitle = "Your job, in six parts";
export const dutiesNote = "You work alongside your elected Councillor, not instead of them. Ward leader is a TBH One organising role, not a government office.";

/** 5. What you will earn */
export const earnTitle = "Fees for work delivered. Paid fast. Shown in full.";
export const earnings = [
  ["Host a village meeting (up to 4 a month)", "₦5,000 per meeting", "Attendance list, photos, police notice"],
  ["Manage a funded community project", "5% of the delivered project value, up to ₦50,000 per project", "Proof of delivery"],
  ["Manage an approved local ad campaign", "₦10,000 per campaign", "Photos and invoices"],
  ["Recruit a Town Crier", "5% of the total work project the town crier delivers", "Signed town crier agreement and completed work report"],
  ["Hand over a Shop order at your pickup point", "₦200 per order", "Delivery code"],
  ["Introduce a vendor whose order is delivered and paid", "2% of the order value", "Paid order record"],
  ["Flier drop", "₦500 per 100 fliers", "Geo-tagged photo and count"],
  ["Poster run", "₦1,000 per 20 posters", "Geo-tagged photo and count"],
  ["Banner distribution", "₦500 per banner", "Geo-tagged photo of each banner, with the owner's permission"],
  ["Door-to-door shift", "₦1,500 per 4-hour shift", "Check-in and check-out in the app"],
  ["Merch distribution", "₦200 to ₦500 per item", "Photo and count"],
  ["Every action", "Impact Points", "Automatic"],
] as [string, string, string][];
/** What a month could look like (examples only, not promises). Rows: work, then Starter / Active / Committed. */
export const months = {
  title: "What a month could look like (examples only, not promises)",
  tiers: [
    { key: "starter", name: "Starter", hours: "5–8 hours a week", total: "₦35,000" },
    { key: "active", name: "Active", hours: "9–15 hours a week", total: "₦122,500" },
    { key: "committed", name: "Committed", hours: "16+ hours a week", total: "₦299,000" },
  ],
  rows: [
    ["Village meetings", "2 → ₦10,000", "4 → ₦20,000", "4 → ₦20,000"],
    ["Community projects managed", "—", "1 of ₦850,000 → ₦42,500", "2 of ₦850,000 → ₦85,000"],
    ["Pickup orders", "—", "40 → ₦8,000", "100 → ₦20,000"],
    ["Banner distribution", "—", "20 → ₦10,000", "40 → ₦20,000"],
    ["Door-to-door shifts", "—", "8 → ₦12,000", "16 → ₦24,000"],
    ["Poster runs and flier drops", "5 runs + 10 drops → ₦10,000", "—", "—"],
    ["Merch distribution (at ₦300 an item)", "50 items → ₦15,000", "100 items → ₦30,000", "300 items → ₦90,000"],
    ["Local ad campaign", "—", "—", "1 → ₦10,000"],
    ["Town crier recruited (₦400,000 work project)", "—", "—", "₦20,000"],
    ["Vendor introduced (₦500,000 order)", "—", "—", "₦10,000"],
  ] as [string, string, string, string][],
};
export const howPaidSteps = [
  "You finish the work and log it in the app with proof.",
  "Your state team approves the claim. A different person always releases the payment, so nobody — including you — approves their own.",
  "The money reaches your bank or mobile-money account within 24 hours.",
];
export const howPaid = "Your state team approves each fee claim. A different person always releases the payment, so nobody — including you — approves their own. Approved fees reach your bank or mobile-money account within 24 hours.";
export const pleaseNote = "This is task-based work, not a salary, a government job or a promise of employment. Fees are launch rates and are reviewed every two weeks. What you earn depends on the work available in your ward.";

/** 6. A week in the life (sample) */
export const week = {
  h2: "What a ward leader's week could look like (sample)",
  rows: [
    ["Monday", "30 minutes on your phone approving street leaders' task proofs from the weekend"],
    ["Tuesday", "Evening door-to-door round with two street leaders, in pairs"],
    ["Wednesday", "Order posters and banners for your ward and brief the street leaders"],
    ["Thursday", "Meet the elders and the market association to agree a community project"],
    ["Friday", "Open your pickup point for two hours so neighbours can collect Shop orders"],
    ["Saturday", "Host the village meeting, with marshals and the safety checklist"],
    ["Sunday", "Rest, worship, family. Plan next week in ten minutes on the app."],
  ] as [string, string][],
};

/** 7. Your first 30 days */
export const first30 = {
  h2: "Your first 30 days",
  rows: [
    ["Days 1–3", "Get endorsed and verified", "Decision message and your training link"],
    ["Days 4–7", "Complete the 2-hour ward leader training", "Your TBH One certificate and verified leader ID"],
    ["Week 2", "Map your streets and recruit your first ten street leaders", "Dashboard with your ward overview and street leader roster"],
    ["Week 3", "Host your first village meeting", "First fee: ₦5,000"],
    ["Week 4", "Propose your first community project", "Your ward's first funded project page"],
  ] as [string, string, string][],
};

/** 8. Your support and benefits */
export const supportPage = {
  h2: "You lead your ward. We stand behind you.",
  intro: "Ward leaders are never left on their own. From your first day you have training, tools, people to call and clear rules, and the benefits of free TBH One membership on top.",
  rows: [
    ["Free training and a certificate", "A 2-hour ward leader training, then free courses on the Training Calendar in digital skills, organising, leadership and entrepreneurship"],
    ["A verified leader ID", `An ID with a code anyone can check at ${site.domain}/verify, so your neighbours know you are genuine`],
    ["A direct line to your state team", "Your state coordinator and focal point answer questions, approve your fee claims and help when something goes wrong"],
    ["Your ward dashboard", "Your members, street leaders, tasks to approve, events, projects, materials and earnings in one place, working offline on any Android phone"],
    ["Materials and merch", "Posters, fliers, banners and merch from your state stock, ordered in the app and sent to your ward or a pickup point"],
    ["Safety backing", "An event safety checklist, one-tap Report a Concern, and a safeguarding team that answers critical reports within one hour"],
    ["Clear rules", "A Code of Conduct, a published fee schedule, and simple guidance on what you can and cannot do during the campaign"],
    ["Fast, safe payment", "Fees paid within 24 hours of approval, with a second person releasing every payment"],
    ["Help any time", `Toll-free ${site.contact.tollFree} (24 hours) · Call or WhatsApp ${site.contact.whatsappDisplay} · AI assistant chat · ${site.contact.email}`],
  ] as [string, string][],
  memberTitle: "Member benefits that come with it (all free)",
  member: [
    "Skill training and job opportunities",
    "Business opportunities and vendorship opportunities",
    "Daily giveaways, until Thursday 14 January 2027",
    "Free airtime and data from Impact Points",
    "Free merch",
    "Shop coupons: 10% off every item, a new coupon every week",
    "Discounts at partner businesses near you",
    "Referral income for verified work",
  ],
  rewardsTitle: "Impact Points rewards",
  rewards: [
    ["500", "₦500 airtime"],
    ["1,000", "1 GB of data"],
    ["2,500", "A TBH One T-shirt"],
    ["5,000", "A priority training pass"],
    ["Top 10 in your state each month", "An invitation to a national event"],
  ] as [string, string][],
  rewardsNote: "Benefits reward taking part in the movement. They never depend on how or whether anyone votes.",
  callTitle: "Who to call for what",
  call: [
    ["Finding or changing my ward", `WhatsApp ${site.contact.whatsappDisplay}, or your state team`],
    ["My application", "Your dashboard progress tracker, or Support & Complaints"],
    ["A fee or payment", "Your state team, or Support & Complaints"],
    ["My safety, or someone else's", `Report a Concern in the app, or toll-free ${site.contact.tollFree}. In an emergency, call 112 first`],
    ["Anything else", `Toll-free ${site.contact.tollFree}, 24 hours a day`],
  ] as [string, string][],
};

/** 9. How to apply */
export const stepsTitle = "Five steps. About fifteen minutes. No cost.";
export const steps = [
  { step: "1. Register free", what: "Join TBH One as a member with your phone number", time: "2 minutes" },
  { step: "2. Apply", what: "Complete the ward leader application inside your member account", time: "10 minutes" },
  { step: "3. Get endorsed and verified", what: "A recognised local figure confirms you, the state team checks your ID and holds a short call with you", time: "Within 3 working days" },
  { step: "4. Train", what: "Complete the ward leader training, online or at your state session", time: "2 hours" },
  { step: "5. Start leading", what: "Receive your leader ID and dashboard and begin recruiting street leaders", time: "From 16 November" },
  { step: "Optional boost", what: "Follow our official accounts and take other simple actions to earn Vision Points", time: "5 to 15 minutes" },
];
export const keyDates = [
  ["Monday 9 November 2026", "Applications open"],
  ["Monday 16 November 2026", "First batch of ward leaders starts"],
  ["Monday 23 November 2026", "Street leader recruitment opens to the public"],
  ["Monday 30 November 2026", "Wave 1 closes, or sooner if every ward is filled"],
  ["Thursday 14 January 2027", "Final day of campaigning"],
  ["Saturday 16 January 2027", "Presidential and National Assembly elections"],
] as [string, string][];
export const whyRegister = "Your member account is how we verify you, give you access, pay you and keep you safe. It takes two minutes and unlocks every member benefit: skill training, jobs, the Shop, coupons and Impact Points.";

/** 10. Find your ward (the help section; the finder itself uses `finder` above) */
export const findWard = {
  h2: "Not sure which ward you live in? We'll find it for you.",
  intro: "Most people know their street, their market and their neighbourhood — not their ward. Tell us where you live and we'll work it out.",
  ways: [
    ["📍 Use my location", "Tap once and we find your ward on the map. We use your location once and don't save it unless you apply."],
    ["🔎 Search my area", "Type a street, market, school, church or mosque near you and we show the ward beside it."],
    ["🗺 Pick from the list", "Choose your state and LGA, then pick from the wards. Each one lists the neighbourhoods inside it."],
    ["💬 Ask us on WhatsApp", `Send a location pin or your area name to ${site.contact.whatsappDisplay}, or call ${site.contact.tollFree} free. We reply with your ward and an application link.`],
  ] as [string, string][],
  sample: "Your ward: Ungwan Rimi, Kaduna North LGA, Kaduna State. This ward covers Ungwan Rimi, Ungwan Sarki and Kawo Road.",
  sampleOpen: "Good news — this ward has no leader yet.",
  sampleButton: "Register Free and Apply for Ungwan Rimi Ward",
  taken: "This ward already has a leader. Join the waiting list for a second-leader place, or become a street leader from 23 November.",
  note: "Your ward here is where you live, not where you vote. We never ask for your PVC or polling unit.",
};

/** 11. Places by region */
export const regionsPage = {
  h2: "8,809 wards. One leader each. See where places are open.",
  intro: "Wave 1 has one place for every ward, 8,809 in all. Here is where places are filled and where they are still open (sample figures, refreshed every 60 seconds on the live page).",
  decidedTitle: "How places are decided",
  decided: [
    "If only one person applies for your ward, you are approved as soon as your endorsement and ID check are complete.",
    "If more than one person applies, we compare scores after 7 days from the first application, or at the close of wave 1. The highest score gets the place.",
    "If your ward goes to someone else, you join the waiting list for a second-leader place in wave 2, and you are first in line for street leader recruitment from Monday 23 November.",
  ],
  note: "Regional figures are scaled to the national total of 8,809 wards and confirmed against INEC's ward list before launch.",
};
export const regionsNote = regionsPage.note;

/** 12. Boost your application */
export const boost = {
  h2: "Show your support. Watch your Vision Meter fill up.",
  paras: [
    "We prioritise people who believe in the vision. Follow our official accounts and take a few simple actions to earn Vision Points. Your points show live on your Vision Meter. When more than one person applies for a ward, a stronger score helps.",
    "It is optional, capped and fair. Vision Points are 20 of the 100 points we use to choose, and people without social media can still reach 80 out of 100.",
  ],
  everyone: "Everyone can also earn points by: attending TBH One events (15 each, twice) · passing the Vision Quiz (20) · inviting friends who register (5 each, up to four)",
  levels: "Starter · Supporter · Advocate · Champion · Vision Leader (100)",
  sample: "Your Vision Meter: 38 / 100 · Supporter · 4 of 13 accounts followed",
  choose: "Eligibility is pass or fail. Then each applicant is scored out of 100: community standing and endorsement (30), ward knowledge and readiness (25), Vision Points (20), commitment (15) and a complete application (10). The state team reviews every decision.",
  where: "You follow us in the first step of the application, before you fill anything in. The other ways to earn points open on your last page, once your application is in.",
};

/** 13. Who we are looking for */
export const lookingFor = {
  h2: "You don't need a CV. You need your community's trust.",
  need: [
    "To be 18 or over",
    "To live in the ward you will lead",
    "To be respected where you live",
    "An Android phone (version 8 or later), an iPhone or a laptop",
    "A bank or mobile-money account in your name",
    "A valid ID: NIN slip, driver's licence, international passport or national ID card",
    "An endorsement from a recognised local figure: a traditional ruler or village head, religious leader, association chairperson or NDC ward officer",
    "Willingness to sign the Code of Conduct and complete our training",
  ],
  dontNeed: [
    "Experience in politics. You do not need to hold or have held office.",
    "A degree or a certificate. We train you.",
    "Your PVC. We never ask for it, and we never ask how you plan to vote.",
    "Money. Applying, training and your leader ID are free.",
  ],
  goodToKnow: "Ward leaders promote Obi/Kwankwaso x NDC, so you should be comfortable doing that.",
};

/** 14. Hear from people like you (SAMPLE quotes, replaced with real, consented quotes at launch) */
export const quotes = {
  h2: "Why they joined (sample quotes — replaced with real, consented quotes at launch)",
  items: [
    ["I run a provision store and I know every family on my side of the ward. Now I get paid for what I was already doing for free.", "Chinedu, 34, trader, Ungwan Rimi ward (sample)"],
    ["The training was clear and short. I knew exactly what to do in my first week.", "Halima, 29, teacher, Dala ward (sample)"],
    ["What I like is the proof. Every task has a photo and every payment has a record. Nobody can say we are hiding anything.", "Tunde, 41, artisan, Ibadan North ward (sample)"],
    ["I'm abroad, but I told my brother about the page. He applied for our ward the same night.", "Ngozi, 38, nurse, London chapter (sample)"],
  ] as [string, string][],
};

/** 15. Safety, trust and fairness */
export const safetyTitle = "Built so you can trust it";
export const safety = [
  ["No fees, ever.", "TBH One will never ask you to pay for a role, a uniform, training or an ID. If anyone does, report it."],
  ["Check before you trust.", `Every leader has a verified ID with a code anyone can check at ${site.domain}/verify.`],
  ["Safe by design.", "Every event follows a safety checklist. Work with others, never alone. Report a problem in one tap."],
  ["Paid properly.", "Every payment needs proof and a second person to approve it, and every naira is reported on our Transparency page."],
  ["Fair choices.", "We publish how applicants are scored, the state team reviews every decision, and you can ask for a review through Support & Complaints."],
  ["Your data is yours.", "We collect only what we need, never sell it, and you can see or delete it anytime. The social media check is optional and has its own consent."],
  ["Not a government job.", "This is a TBH One organising role. You are paid fees for work delivered."],
] as [string, string][];

/** 16. Frequently asked questions */
export const faq: { q: string; a: string }[] = [
  { q: "Do I have to pay anything?", a: "No. Registering, applying, training and your leader ID are free. TBH One never asks for money for a role." },
  { q: "Why do I have to register as a member first?", a: "Your member account is how we verify you, give you access, pay you and keep you safe. It takes two minutes." },
  { q: "I'm already a member. What do I do?", a: "Log in and open Apply to be a Ward Leader on your dashboard. Your details are already filled in." },
  { q: "Is this a salary or a government job?", a: "No. It is task-based work. You earn fees for each meeting, project, ad campaign, order and task you deliver." },
  { q: "How much can I earn?", a: "It depends on the work in your ward and the time you give. Our examples show about ₦35,000 for a light month, ₦122,500 for an active month and ₦299,000 for a committed month. They are examples, not promises." },
  { q: "When do I get paid?", a: "Within 24 hours of your state team approving your claim, to your bank or mobile-money account." },
  { q: "Who endorses me?", a: "A recognised local figure, such as a traditional ruler or village head, religious leader, association chairperson or NDC ward officer. If you don't have one, apply anyway and the state team will help you connect." },
  { q: "I don't know my ward. What do I do?", a: `Use the ward finder at the top of the page, or send your location pin to ${site.contact.whatsappDisplay} on WhatsApp.` },
  { q: "What if my ward already has a leader?", a: "Join the waiting list for a second-leader place in wave 2, or become a street leader when recruitment opens on 23 November." },
  { q: "I want to be a street leader. When can I apply?", a: "Street leader places open on Monday 23 November 2026. Register now and join the waiting list so you are first in line." },
  { q: "Do I have to follow you on social media?", a: "No. It is optional. You can still reach 80 out of 100 Vision Points without any social media." },
  { q: "How many hours a week will it take?", a: "Most ward leaders give 5 to 15 hours a week and choose their own schedule." },
  { q: "Do I need to tell you who I will vote for?", a: "No. We never ask how you plan to vote or for your PVC number." },
  { q: "What if I live abroad?", a: "Ward leader places are for people living in the ward in Nigeria. Join your country's diaspora chapter instead." },
  { q: "How do I know this is real?", a: `Check Verify Official Channels at ${site.domain}/verify, or call ${site.contact.tollFree} free.` },
];

/** 17. Final call to action */
export const finalCta = {
  h2: "Your ward is waiting. Be the one who leads it.",
  copy: (open: number) => `${open.toLocaleString("en-NG")} wards still need a leader. Register free, apply in about fifteen minutes, and start leading from Monday 16 November.`,
  primary: "Register Free and Apply",
  secondary: `Talk to Us on WhatsApp (${site.contact.whatsappDisplay})`,
  call: `Call Toll-Free ${site.contact.tollFree}`,
  shareTitle: "Share this page",
  share: "Know someone respected in their ward? Send them this page.",
  shareMessage: `TBH One is recruiting a leader for every ward in Nigeria. It's free to apply and you earn fees for the work. Check if your ward is taken: ${site.domain}/careers`,
};

/** Other roles on the Careers hub: every role starts with free member registration. */
export const hubRoles = [
  { role: "Ward Leader", places: "8,809 (one per ward)", status: "Open now", button: "Apply", path: "/careers/ward-leaders" },
  { role: "Street Leader", places: "440,450 (one per street)", status: "Opens Monday 23 November 2026", button: "Join the Waiting List", path: "/street-leaders#waitlist" },
  { role: "Country Coordinator", places: "200+", status: "Open", button: "Apply", path: "/diaspora#apply" },
  { role: "Creators, Translators and Associates", places: "5,000+", status: "Open", button: "See Briefs", path: "/creators" },
];
export const hubNote = "Every role starts with free member registration.";

/** Microcopy library */
export const microcopy = {
  register: { idle: "Register Free and Apply", busy: "Registering…", done: "You're in! Continue to application" },
  afterRegister: (name: string) => `You're a TBH One member, ${name}! One more step: complete your ward leader application. You've earned 50 Impact Points.`,
  draftSaved: "Saved. Come back anytime — your place isn't lost until the ward is filled.",
  // The application no longer collects the endorser: the state team asks for them on the verification call.
  afterSubmit: (name: string, ref: string) => `Application received, ${name}! Your reference is ${ref}. The state team will contact you within 3 working days and check your ID, endorser and payment details with you on a short call. In the meantime: boost your application and tell a friend.`,
  nextSteps: ["The state team reviews your application", "They verify you on a short call (ID, endorser and payment details)", "You start your training", "You receive your leader ID"],
  exitIntent: { text: "Before you go: your ward may still be open. Check it in 30 seconds.", yes: "Check My Ward", no: "No thanks" },
  regionFull: "Places in your region are full. Join the waiting list and be first in line for the next wave.",
  closed: "Wave 1 is closed. Join the waiting list for wave 2, or become a street leader from 23 November.",
};

/** Places by region exactly as in the document (wave 1: one per ward). Filled figures are the sample. */
export const regions = [
  { region: "North-West", zone: "North West", states: "Kano, Katsina, Kaduna, Jigawa, Kebbi, Sokoto, Zamfara", wards: 1973, filled: 702 },
  { region: "South-West", zone: "South West", states: "Lagos, Oyo, Ogun, Osun, Ondo, Ekiti", wards: 1650, filled: 640 },
  { region: "South-South", zone: "South South", states: "Rivers, Delta, Edo, Akwa Ibom, Cross River, Bayelsa", wards: 1390, filled: 488 },
  { region: "North-Central (incl. FCT)", zone: "North Central", states: "Benue, Kogi, Kwara, Nasarawa, Niger, Plateau, FCT", wards: 1377, filled: 495 },
  { region: "South-East", zone: "South East", states: "Anambra, Enugu, Imo, Abia, Ebonyi", wards: 1227, filled: 441 },
  { region: "North-East", zone: "North East", states: "Borno, Bauchi, Adamawa, Taraba, Gombe, Yobe", wards: 1192, filled: 388 },
];

/** Sign-up and application flow copy. */
export const flow = {
  phone: { title: "Register free to apply.", text: "Enter your phone number. We’ll send you a 6-digit code.", button: "Send code" },
  code: { text: (masked: string) => `Enter the code we sent to ${masked}.`, button: "Verify" },
  about: { fields: "First name · Last name · Find your ward · Language" },
  consent: { required: "I’m 18 or older and agree to the Terms of Service and Privacy Policy (required)", updates: "Send me updates by SMS and WhatsApp", button: "Register Free and Apply", busy: "Registering…" },
  welcome: { title: (name: string) => `You’re a TBH One member, ${name}!`, text: "One more step: complete your ward leader application. You’ve earned 50 Impact Points.", button: "You’re in! Continue to application" },
  submit: "Submit Application",
  confirmation: (name: string, ref: string) => `Thank you, ${name}! Your application ${ref} is in. The state team will review it and contact you within 3 working days. If you are selected, they will call you to check your ID, endorser and payment details.`,
  tracker: ["Registered", "Applied", "State team review", "Verification call", "Training", "Leader ID", "Recruit street leaders"],
  endorserRoles: ["Traditional ruler or village head", "Religious leader", "Association chairperson", "NDC ward officer"],
  idTypes: ["NIN slip", "Driver’s licence", "International passport", "National ID card"],
  hours: ["2 hours a day", "4 hours a day"],
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
  received: "Application {ref} received. The state team will review it and be in touch within 3 working days.",
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
  duplicate: (ref: string) => `You’ve already applied. Your application ${ref} is with the state team for review.`,
  closed: "Wave 1 is closed. Join the waiting list for wave 2, or become a street leader from 23 November.",
  regionFull: "Places in your region are full. Join the waiting list and be first in line for the next wave.",
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

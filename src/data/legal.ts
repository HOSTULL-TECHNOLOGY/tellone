/**
 * Legal and policy pages — DRAFT text based on the PRD's requirements (NDPA 2023, GDPR, guardrails GR-1…GR-10,
 * NF-5…NF-10, EC-26/27, SH-10/13/15). Every page shows "Draft — pending legal review" until the legal adviser
 * and the Data Protection Officer approve it.
 */
export type LegalSection = { h: string; p?: string[]; list?: string[] };
export type LegalPage = { slug: string; title: string; description: string; answer: string; sections: LegalSection[] };

const CONTACT_DPO = "Contact the Data Protection Officer through the Support & Complaints page (choose “Privacy and my data”). A dedicated DPO email address will be published here once confirmed.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How TBH One collects, uses and protects personal data under the Nigeria Data Protection Act 2023 and GDPR.",
    answer:
      "TBH One collects only the personal data needed to run free membership, projects, the Shop and support. Consent is recorded separately for each purpose, you can view, correct, export or delete your data at any time, and requests are answered within 30 days. TBH One never records how you intend to vote, your PVC number or how you voted.",
    sections: [
      { h: "Who we are", p: ["TBH One (Tell One, Bring One, Help One) is a community-powered initiative supporting Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress. For the purposes of the Nigeria Data Protection Act 2023 (NDPA), TBH One is the data controller for the personal data described here. The registered legal entity and address will be published here before launch."] },
      { h: "What we collect", list: ["Account: first name, last name, mobile number, optional email, preferred language, state, LGA, ward and street (or country for diaspora members).", "Activity: Impact Points entries, tasks, event RSVPs, projects funded and giveaway entries.", "Payments: contributor name, amount, method, project and date. Card details are handled by our licensed payment provider and never stored by TBH One.", "Shop: orders, delivery address or pickup point, coupons and returns.", "Leaders and associates: vetting status, training records, proof-of-work photos with time and location (only while you log a task and only with your consent), and payout details.", "Support: messages to the AI assistant, the call centre and the help desk."] },
      { h: "What we never collect", list: ["How you intend to vote or how you voted.", "Your Permanent Voter Card (PVC) number.", "Polling-unit-level data about you."], p: ["These are hard rules built into the platform (guardrail GR-1), not just policies."] },
      { h: "Why we use it and on what basis", list: ["To provide your membership and dashboard — performance of our agreement with you.", "To send updates by SMS, WhatsApp, email or app notifications — your consent, recorded per channel, with a daily cap.", "To record contributions against a named contributor and meet Electoral Act 2026 disclosure duties — legal obligation.", "To keep people safe, prevent fraud and enforce the two-person payment rule — legitimate interests and legal obligation.", "Anonymous analytics — only after you accept analytics cookies."] },
      { h: "Contacts you import", p: ["Connecting your contact list, Gmail or WhatsApp is switched off until the Data Protection Officer approves it. When available it will need your explicit opt-in, and TBH One will never message people you import (requirement NF-9)."] },
      { h: "Who can see your data", p: ["Access is least-privilege by role and geography. Street leaders see first names and status only, never phone numbers. State coordinators see aggregated figures, not individual member records. Safeguarding reports are visible only to the safeguarding team. Every access to personal data is logged."] },
      { h: "Your rights", list: ["Access a copy of your data.", "Correct inaccurate data.", "Export your data in a portable format.", "Delete your account and data.", "Withdraw consent for any purpose — honoured within 24 hours.", "Complain to the Nigeria Data Protection Commission."], p: ["Data requests are fulfilled within 30 days. You can make most requests yourself from Profile & privacy in your dashboard."] },
      { h: "Keeping data safe", p: ["Data is encrypted in transit and at rest, backed up daily, and the platform is penetration-tested before launch and before Election week. Two-factor sign-in is required for every role above Member."] },
      { h: "How long we keep it", p: ["After 17 January 2027 members will be asked to re-consent to continue in TBH One’s longer-term civic platform. Accounts inactive for 12 months are deleted. Financial records are kept for the period required by law."] },
      { h: "Contact", p: [CONTACT_DPO] },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    description: "Which cookies and local storage TBH One uses, and how to change your choices.",
    answer:
      "TBH One uses necessary cookies and local storage to run the site — sign-in, cart, language, theme and security. Analytics and marketing cookies load only after you accept them. You can accept, reject or change your choices at any time from “Cookie settings” in the footer, and rejecting is as easy as accepting.",
    sections: [
      { h: "Necessary (always on)", list: ["Sign-in session and security.", "Shopping cart and saved coupon.", "Language, theme (light, dark or system) and Data Saver preferences.", "Your cookie choices themselves.", "Theme-song pause preference (remembered for 30 days)."] },
      { h: "Analytics (optional)", p: ["Anonymous statistics about which pages are used, so we can improve them. Analytics run in consent mode and do not start until you accept."] },
      { h: "Marketing (optional)", p: ["Measurement of campaign adverts on other sites. These are off unless you accept them."] },
      { h: "Changing your mind", p: ["Use “Cookie settings” in the footer to reopen the banner and change your choices at any time."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "The rules for using the TBH One website, apps, dashboards and Shop.",
    answer:
      "These terms cover your use of the TBH One website, apps and dashboards. Membership is free; you must be 18 or over, give accurate details and keep your sign-in private. You agree to follow the Code of Conduct, never use TBH One to pressure anyone about how they vote, and report anything unsafe. Shop purchases also follow the Delivery & Returns policy.",
    sections: [
      { h: "Eligibility", p: ["You must be 18 or over. Roles above Member (such as street leader or ward leader) are granted only after vetting and require two-factor sign-in."] },
      { h: "Your account", list: ["Give accurate details and keep them up to date.", "Keep your phone, codes and password private. TBH One will never ask for them.", "One person, one account."] },
      { h: "Acceptable use", list: ["Follow the Code of Conduct and Safeguarding Policy.", "Do not offer or ask for anything in exchange for votes.", "Do not upload content you do not have the right to use, or images of people without their consent.", "Do not attempt to access data or dashboards you are not authorised to use."] },
      { h: "Contributions and payments", p: ["Contributions fund the specific project you choose and are recorded against your name. Contributions from outside Nigeria, and large contributions, may be held until checks are complete. Field payments are released only against approved proof of work, with two different people approving and releasing each payout."] },
      { h: "Shop", p: ["Prices, delivery fees and the refund policy are shown before you pay. Delivery is to Nigerian addresses only at launch. See Delivery & Returns."] },
      { h: "Campaign period", p: ["Giveaways, coupons and campaign promotions stop automatically at 11:59 pm on Thursday 14 January 2027."] },
      { h: "Suspension", p: ["We may pause or remove roles or accounts that break these terms, endanger others or attempt fraud."] },
      { h: "Changes", p: ["We will tell you about material changes before they take effect."] },
    ],
  },
  {
    slug: "submission-terms",
    title: "Submission Terms",
    description: "Terms for content, translations, photos and stories you submit to TBH One.",
    answer:
      "When you submit content — a skit, design, translation, photo, story or event — you confirm it is your own work or you have permission, that everyone identifiable in it has consented, and whether you used AI or are sponsored. Work is published only after creative and compliance review, and AI-generated content is labelled.",
    sections: [
      { h: "What you confirm", list: ["You own the work or have the rights to submit it.", "Everyone identifiable in it has signed a consent form.", "You have declared any AI use and any sponsorship.", "It follows the Code of Conduct and contains no allegations against named individuals."] },
      { h: "Licence", p: ["You grant TBH One a licence to publish, translate and adapt your submission across TBH One channels. Paid briefs are governed by the brief’s fee and invoice terms."] },
      { h: "Review", p: ["Work is reviewed in two steps — creative lead, then compliance — and is not published until both approve. We may request changes or decline a submission."] },
      { h: "Testimonials", p: ["Member stories are published only with written consent. You can withdraw consent and we will remove the story."] },
    ],
  },
  {
    slug: "safeguarding",
    title: "Safeguarding Policy",
    description: "How TBH One keeps members, volunteers and communities safe, and how incidents are handled.",
    answer:
      "Everyone taking part in TBH One has the right to be safe. Anyone can report a safety, fraud or abuse concern from any page or dashboard, including anonymously. Critical incidents are escalated within one hour, high-priority incidents within 24 hours and others within 72 hours, and sensitive reports go straight to the safeguarding team.",
    sections: [
      { h: "Our commitments", list: ["A Report a Concern button on every screen.", "Anonymous reporting.", "Restricted access to incident records — safeguarding staff only.", "Reports of sexual abuse go straight to the National Safeguarding Lead and are never shown to ward leaders.", "A suspension tool to pause a person’s roles while a concern is reviewed.", "Escalation contacts for police, medical and legal help."] },
      { h: "Response times", list: ["Critical: escalated within 1 hour.", "High: within 24 hours.", "Low: within 72 hours."] },
      { h: "Events and field work", p: ["Events and village meetings cannot be published until every item on the safety checklist is ticked — including police notice, marshals and exits. Street leaders check in and out of shifts, can share their live location with their ward leader during a shift if they choose, and complete safety training before their first task."] },
      { h: "Report a concern", p: ["Use the Report a Concern page. If someone is in immediate danger, contact the police or emergency services first."] },
    ],
  },
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    description: "How TBH One members, leaders, creators, vendors and staff are expected to behave.",
    answer:
      "TBH One members, leaders, creators, vendors and staff treat people with respect, keep everyone safe, never pressure or pay anyone for their vote, never collect voting information, handle money transparently, respect privacy and consent, and stay peaceful. Leaders and creators sign this code and complete a refresher module.",
    sections: [
      { h: "Respect and safety", list: ["No harassment, hate speech or intimidation.", "No violence or incitement, online or offline.", "Follow the event safety checklist and shift check-ins."] },
      { h: "Elections", list: ["Never offer money, gifts or benefits in exchange for votes.", "Never ask for or record PVC numbers, voting intention or how anyone voted.", "Stop all campaigning at 11:59 pm on Thursday 14 January 2027.", "Direct people to INEC for official voting information and results."] },
      { h: "Money", list: ["Every naira is recorded against a named contributor and a project.", "Never collect cash outside official channels.", "Declare any conflict of interest, including links to TBH One staff or leaders."] },
      { h: "Content", list: ["Use only the official hashtags.", "Label AI-generated content and declare sponsorship.", "Get consent from everyone featured.", "No allegations against named individuals."] },
      { h: "Privacy", list: ["Use personal data only for the task in hand.", "Never share members’ phone numbers or addresses."] },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    description: "TBH One’s commitment to an accessible website and apps, and how to report barriers.",
    answer:
      "TBH One aims to meet WCAG 2.1 level AA across the website and dashboards so everyone can take part, including people using screen readers, keyboards, older Android phones and slow connections. Features include labelled controls, large tap targets, visible focus, light and dark themes, a Data Saver mode and five languages.",
    sections: [
      { h: "What we do", list: ["Semantic headings, landmarks and labelled form controls.", "Keyboard access to every menu, dialog and player.", "Colour contrast checked in light and dark themes.", "Respect for reduced-motion settings.", "Data Saver mode: no autoplay and lighter pages for 3G connections.", "Captions and transcripts for video as it is published."] },
      { h: "Known gaps", list: ["Some translations are drafts awaiting review.", "Video transcripts are added as each video is published."] },
      { h: "Report a barrier", p: ["Tell us through the Support & Complaints page, choosing “Accessibility”. We aim to respond within 5 working days."] },
    ],
  },
  {
    slug: "ndpa",
    title: "Nigeria Data Protection Act (NDPA) Notice",
    description: "How TBH One complies with the Nigeria Data Protection Act 2023.",
    answer:
      "TBH One processes personal data under the Nigeria Data Protection Act 2023. That means a lawful basis for every use, consent captured per purpose with a time stamp, opt-outs honoured within 24 hours, access, correction and deletion requests fulfilled within 30 days, a named Data Protection Officer, a breach notification process and least-privilege access.",
    sections: [
      { h: "Data Protection Officer", p: ["TBH One has appointed a Data Protection Officer who keeps the consent register, handles data requests, approves new data features and runs the breach log. " + CONTACT_DPO] },
      { h: "Consent", p: ["Consent is captured separately for membership, SMS/WhatsApp messages, AI calls and photos, each with a time stamp. Withdrawing consent is as easy as giving it."] },
      { h: "Requests", p: ["Access, correction and deletion requests are completed within 30 days. You can raise most of them from Profile & privacy in your dashboard."] },
      { h: "Breaches", p: ["Breaches are logged and, where required, notified to the Nigeria Data Protection Commission and affected people without undue delay."] },
      { h: "Complaints", p: ["You can complain to the Nigeria Data Protection Commission."] },
    ],
  },
  {
    slug: "gdpr",
    title: "GDPR Notice for Members Abroad",
    description: "Your rights under the UK and EU GDPR if you take part in TBH One from abroad.",
    answer:
      "If you take part in TBH One from the United Kingdom or the European Union, the UK GDPR or EU GDPR may also apply to your personal data. You have the right to access, correct, delete, restrict and port your data and to object to processing, and requests are answered within 30 days.",
    sections: [
      { h: "Your rights", list: ["Access", "Rectification", "Erasure", "Restriction", "Portability", "Objection", "Withdrawing consent at any time"] },
      { h: "International transfers", p: ["Diaspora members’ data is processed in Nigeria. Transfers rely on appropriate safeguards, which will be described here once the legal review is complete."] },
      { h: "Funding from abroad", p: ["Separately from data protection, funds originating outside Nigeria are not accepted until legal clearance is recorded. Diaspora members are directed to Tell One and in-kind support."] },
      { h: "Contact", p: [CONTACT_DPO] },
    ],
  },
];

export const legalBySlug = (s: string) => legalPages.find((p) => p.slug === s);

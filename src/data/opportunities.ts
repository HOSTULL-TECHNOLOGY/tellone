/**
 * DEMO opportunities for members: jobs, training, chapters, groups, WhatsApp groups.
 * Illustrative only and labelled "Demo data" in the UI.
 */
export type Job = {
  slug: string;
  title: string;
  type: "Project-based" | "Part-time" | "Volunteer";
  location: string;
  state: string;
  remote: boolean;
  pay: string;
  posted: string;
  closes: string;
  summary: string;
  duties: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  { slug: "call-centre-agent-abuja", title: "Call centre agent (shift work)", type: "Part-time", location: "Abuja", state: "FCT", remote: false, pay: "Paid per shift (rate published at launch)", posted: "2026-10-20", closes: "2026-11-15", summary: "Answer escalations from the AI Call Agent and help members, funders and voters by phone.", duties: ["Answer calls on the 24-hour line", "Log tickets and route safeguarding or finance issues", "Use the scripted answers library in five languages"], requirements: ["Fluent English plus Hausa, Yorùbá, Igbo or Pidgin", "Calm, polite phone manner", "Completion of conduct and data-protection training"] },
  { slug: "photographer-associate-lagos", title: "Photographer (associate)", type: "Project-based", location: "Lagos", state: "Lagos", remote: false, pay: "Per approved shoot", posted: "2026-10-18", closes: "2026-11-30", summary: "Photograph community projects and events with signed consent forms for everyone featured.", duties: ["Shoot H-One project before-and-after photos", "Collect consent forms", "Upload with captions and locations"], requirements: ["Own camera or good smartphone", "Portfolio link", "Agree to the Code of Conduct"] },
  { slug: "video-editor-remote", title: "Short-form video editor", type: "Project-based", location: "Remote (Nigeria or diaspora)", state: "Online", remote: true, pay: "Per approved piece", posted: "2026-10-17", closes: "2026-12-01", summary: "Edit vertical videos and skits from creators' raw footage for paid social adverts.", duties: ["Edit 30–60 second vertical videos", "Add captions in the requested language", "Declare any AI use"], requirements: ["Editing portfolio", "Reliable internet", "Turnaround within 48 hours"] },
  { slug: "web-developer-associate", title: "Web developer (associate)", type: "Project-based", location: "Remote", state: "Online", remote: true, pay: "Per delivered task", posted: "2026-10-16", closes: "2026-11-20", summary: "Build personal websites for NDC aspirants through TBH One's service line.", duties: ["Build and launch simple aspirant websites", "Follow the brand kit", "Hand over credentials securely"], requirements: ["Portfolio of live sites", "Experience with accessible, fast pages"] },
  { slug: "translator-hausa", title: "Hausa translator", type: "Project-based", location: "Remote", state: "Online", remote: true, pay: "Per approved piece", posted: "2026-10-15", closes: "2026-12-15", summary: "Translate campaign content into natural, idiomatic Hausa from a keyword brief.", duties: ["Translate posts, scripts and voter guides", "Maintain the translation memory", "Review other translators' work"], requirements: ["Native Hausa speaker", "Strong written English", "Sample translation"] },
  { slug: "canvassing-support-kano", title: "Canvassing support (door to door)", type: "Project-based", location: "Kano", state: "Kano", remote: false, pay: "₦1,500 per 4-hour shift (launch rate card)", posted: "2026-10-14", closes: "2026-12-31", summary: "Join street leaders on structured door-to-door outreach in Kano Municipal.", duties: ["Door-to-door conversations", "Distribute fliers", "Log visits with photo proof"], requirements: ["Live in or near the ward", "Complete safety training first"] },
  { slug: "logistics-assistant-ibadan", title: "Logistics assistant (materials)", type: "Part-time", location: "Ibadan", state: "Oyo", remote: false, pay: "Paid per day (rate published at launch)", posted: "2026-10-13", closes: "2026-11-25", summary: "Receive, count and dispatch fliers, posters and merch from the state warehouse to wards.", duties: ["Check stock in and out", "Prepare ward allocations", "Confirm deliveries in the dashboard"], requirements: ["Basic smartphone skills", "Careful record-keeping"] },
  { slug: "community-project-volunteer", title: "Community project volunteer", type: "Volunteer", location: "Your ward", state: "Any", remote: false, pay: "Unpaid; earns Impact Points", posted: "2026-10-12", closes: "2027-01-14", summary: "Help deliver H-One community projects in your own ward.", duties: ["Support project delivery days", "Help collect before-and-after photos"], requirements: ["TBH One member"] },
];
export const jobBySlug = (s: string) => jobs.find((j) => j.slug === s);

export type Training = { id: string; title: string; topic: "Safety & conduct" | "Digital skills" | "Business" | "Media & content" | "Organising"; date: string; mode: "In person" | "Online"; place: string; state: string; seats: number; requiredFor?: string; summary: string };
export const trainings: Training[] = [
  { id: "tr-1", title: "Safety, conduct and reporting", topic: "Safety & conduct", date: "2026-11-12T10:00:00+01:00", mode: "Online", place: "Online", state: "Online", seats: 500, requiredFor: "Street and ward leaders (before the first task)", summary: "Personal safety on outreach, the Code of Conduct, and how to report a concern in one tap." },
  { id: "tr-2", title: "Logging tasks and proof on a basic phone", topic: "Digital skills", date: "2026-11-13T16:00:00+01:00", mode: "Online", place: "Online", state: "Online", seats: 500, requiredFor: "Street leaders", summary: "Take a GPS- and time-stamped photo, log a count and sync later when there is no signal." },
  { id: "tr-3", title: "Running a village meeting", topic: "Organising", date: "2026-11-16T10:00:00+01:00", mode: "In person", place: "Ikeja", state: "Lagos", seats: 60, requiredFor: "Ward leaders", summary: "Plan the meeting, complete the safety checklist, and answer the most common questions." },
  { id: "tr-4", title: "Book-keeping for small businesses", topic: "Business", date: "2026-11-19T14:00:00+01:00", mode: "In person", place: "Kano Municipal", state: "Kano", seats: 80, summary: "Simple records, pricing and cash flow for traders and vendors." },
  { id: "tr-5", title: "Shooting vertical video on a phone", topic: "Media & content", date: "2026-11-20T15:00:00+01:00", mode: "Online", place: "Online", state: "Online", seats: 300, summary: "Framing, sound and captions for 30-second skits and testimonials (with consent)." },
  { id: "tr-6", title: "Intro to digital marketing", topic: "Digital skills", date: "2026-11-26T10:00:00+01:00", mode: "In person", place: "Enugu North", state: "Enugu", seats: 70, summary: "Social media basics for members starting or growing a small business." },
  { id: "tr-7", title: "Applying for vendorship", topic: "Business", date: "2026-12-01T11:00:00+01:00", mode: "Online", place: "Online", state: "Online", seats: 400, summary: "How TBH One's published selection process works and how to bid for requests for quotes." },
  { id: "tr-8", title: "Translation memory and keyword briefs", topic: "Media & content", date: "2026-12-03T17:00:00+01:00", mode: "Online", place: "Online", state: "Online", seats: 200, summary: "For translators: work from native keyword research, not literal translation." },
];

export const chapters = [
  { country: "United Kingdom", city: "London, Manchester, Birmingham" },
  { country: "United States", city: "Houston, Atlanta, Maryland" },
  { country: "Canada", city: "Toronto, Calgary" },
  { country: "Germany", city: "Berlin, Frankfurt" },
  { country: "Ghana", city: "Accra" },
  { country: "Togo", city: "Lomé" },
  { country: "Ireland", city: "Dublin" },
  { country: "South Africa", city: "Johannesburg" },
  { country: "United Arab Emirates", city: "Dubai" },
];

export const groups = [
  { id: "g-youth", name: "Youth volunteers", kind: "Volunteer", text: "Students and young professionals who run online and street activities." },
  { id: "g-women", name: "Women for TBH One", kind: "Support", text: "Women organising market, church, mosque and community outreach." },
  { id: "g-traders", name: "Traders and market associations", kind: "Support", text: "Shop owners and traders who host posters and offer member discounts." },
  { id: "g-drivers", name: "Drivers and transport workers", kind: "Support", text: "Okada, keke, bus and taxi drivers carrying the message on the move." },
  { id: "g-professionals", name: "Professionals' skills bank", kind: "Volunteer", text: "Lawyers, accountants, doctors and engineers volunteering skills." },
  { id: "g-faith", name: "Faith community volunteers", kind: "Volunteer", text: "Members organising respectful, non-partisan voter education in faith communities." },
  { id: "g-disability", name: "Disability inclusion group", kind: "Support", text: "Making events, content and polling information accessible." },
  { id: "g-creatives", name: "Creatives and skit-makers", kind: "Volunteer", text: "UGC creators producing content around #WeWillNotStealYourMoney." },
];

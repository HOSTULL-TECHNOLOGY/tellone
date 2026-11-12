import type { Dict } from "@/i18n";

export type NavLink = { label: string; path: string; desc?: string };
export type NavGroup = { title?: keyof Dict["nav"]; links: NavLink[] };
/** `direct` menus are a single link in the header (no dropdown); their pages are listed on the landing page. */
export type NavMenu = { key: keyof Dict["nav"]; path: string; groups: NavGroup[]; direct?: boolean; feature?: { title: string; text: string; path: string } };

/** The eight header menus, in the order and with the slugs of the Revised Website Menu (21 Oct 2026). */
export const mainNav: NavMenu[] = [
  {
    key: "movement",
    path: "/about",
    groups: [
      {
        links: [
          { label: "About TBH One", path: "/about", desc: "Who we are and the Fact Sheet" },
          { label: "Our Team", path: "/team", desc: "The National Coordination team" },
          { label: "Our Belief", path: "/belief", desc: "Nigeria’s money belongs to Nigerians" },
          { label: "The T-B-H Framework", path: "/framework", desc: "How each action works" },
          { label: "Transparency", path: "/transparency", desc: "Live funding and monthly spend" },
          { label: "Supporting Movements", path: "/movements", desc: "Obidient and Kwankwasiyya" },
        ],
      },
    ],
    feature: { title: "Every naira, in public", text: "Monthly spend reports as tables and CSV.", path: "/transparency" },
  },
  {
    key: "campaign",
    path: "/message",
    groups: [
      {
        links: [
          { label: "The Message", path: "/message", desc: "The corruption chain and ad copy" },
          { label: "Live Election Updates & Timeline", path: "/election", desc: "INEC milestones and countdown" },
          { label: "Event Calendar", path: "/events", desc: "NDC, campaign and support groups" },
          { label: "Voter Information", path: "/voter-info", desc: "PVCs, polling units, Election Day" },
          { label: "Your State", path: "/states", desc: "36 states and the FCT" },
          { label: "Questions Answered", path: "/answers", desc: "Direct answers, with sources" },
          { label: "Fact Check", path: "/fact-check", desc: "Claims checked against evidence" },
          { label: "Presence Map", path: "/map", desc: "Ward, street and diaspora coverage" },
        ],
      },
    ],
  },
  {
    key: "involved",
    path: "/join",
    groups: [
      {
        links: [
          { label: "Become a Member", path: "/join", desc: "Free sign-up" },
          { label: "Fund a Project", path: "/projects", desc: "Projects with live progress" },
          { label: "Ward Leaders", path: "/careers/ward-leaders", desc: "8,809 places, apply free" },
          { label: "Street Leaders", path: "/street-leaders", desc: "Role, earnings, apply" },
          { label: "Diaspora Chapters", path: "/diaspora", desc: "Tell One from abroad" },
        ],
      },
      {
        links: [
          { label: "Volunteer & Support Groups", path: "/groups", desc: "Sub-groups near you" },
          { label: "Creators", path: "/creators", desc: "UGC network and creatives" },
          { label: "Translators", path: "/translators", desc: "Join the translator network" },
          { label: "Impact Points & Rewards", path: "/rewards", desc: "Earn points, get rewards" },
          { label: "WhatsApp Groups", path: "/whatsapp", desc: "State and LGA groups" },
        ],
      },
    ],
  },
  {
    key: "opportunities",
    path: "/benefits",
    groups: [
      {
        title: "forMembers",
        links: [
          { label: "Careers", path: "/careers" },
          { label: "Member Benefits", path: "/benefits" },
          { label: "Jobs", path: "/jobs" },
          { label: "Training Calendar", path: "/training" },
          { label: "Daily Giveaway", path: "/giveaway" },
          { label: "Business Openings", path: "/business" },
          { label: "Vendors Center", path: "/vendors" },
        ],
      },
      {
        title: "forOrgs",
        links: [
          { label: "Partners Program", path: "/partners" },
          { label: "Media Partners", path: "/partners/media" },
          { label: "Service Partners", path: "/partners/services" },
          { label: "Advertise With Us", path: "/partners/advertise" },
          { label: "Unions & Associations", path: "/partners/unions" },
        ],
      },
    ],
  },
  {
    key: "media",
    path: "/media",
    groups: [
      {
        links: [
          { label: "Media Hub Home", path: "/media", desc: "Everything in one place" },
          { label: "TBH One TV", path: "/media/tv", desc: "Live stream and video library" },
          { label: "Theme Song", path: "/media/theme-song", desc: "Stream and download" },
          { label: "Watch Movies", path: "/media/movies", desc: "Vertical drama series" },
          { label: "Social Feed", path: "/media/social", desc: "Official accounts only" },
          { label: "Gallery", path: "/media/gallery", desc: "Photos and videos, with consent" },
        ],
      },
    ],
  },

  {
    key: "party",
    path: "/candidates",
    groups: [
      {
        links: [
          { label: "The Candidates", path: "/candidates", desc: "Peter Obi and Rabiu Musa Kwankwaso" },
          { label: "The Manifesto", path: "/manifesto", desc: "Read, listen, watch, download" },
          { label: "NDC", path: "/ndc", desc: "Nigeria Democratic Congress" },
          { label: "Aspirant Services", path: "/aspirants", desc: "Service line for NDC aspirants" },
        ],
      },
    ],
  },

  {
    key: "shop",
    path: "/shop",
    direct: true,
    groups: [
      {
        links: [
          { label: "Shop Home", path: "/shop" },
          { label: "Merch", path: "/shop/merch" },
          { label: "Bulk & Ward Packs", path: "/shop/bulk" },
          { label: "Custom Designs", path: "/shop/custom" },
        ],
      },
      {
        links: [
          { label: "Member Coupons", path: "/shop/coupons" },
          { label: "Partner Vendor Offers", path: "/shop/offers" },
          { label: "Track My Order", path: "/shop/orders" },
          { label: "Delivery & Returns", path: "/shop/delivery-returns" },
        ],
      },
    ],
  },];

export const footerColumns: { key: "discover" | "participate" | "shopMedia" | "help" | "resources"; links: NavLink[] }[] = [
  {
    key: "discover",
    links: [
      { label: "About TBH One", path: "/about" },
      { label: "Our Belief", path: "/belief" },
      { label: "The Candidates", path: "/candidates" },
      { label: "The Manifesto", path: "/manifesto" },
      { label: "Live Election Updates", path: "/election" },
      { label: "Member Benefits", path: "/benefits" },
    ],
  },
  {
    key: "participate",
    links: [
      { label: "Become a Member", path: "/join" },
      { label: "Fund a Project", path: "/projects" },
      { label: "Careers: Ward & Street Leaders", path: "/careers" },
      { label: "Diaspora Chapters", path: "/diaspora" },
      { label: "Event Calendar", path: "/events" },
      { label: "Impact Points & Rewards", path: "/rewards" },
    ],
  },
  {
    key: "shopMedia",
    links: [
      { label: "Shop Merch", path: "/shop/merch" },
      { label: "Member Coupons", path: "/shop/coupons" },
      { label: "Track My Order", path: "/shop/orders" },
      { label: "Media Hub", path: "/media" },
      { label: "Blog & News", path: "/news" },
      { label: "Get the App", path: "/app" },
    ],
  },
  {
    key: "help",
    links: [
      { label: "Verify Official Channels", path: "/verify" },
      { label: "Transparency", path: "/transparency" },
      { label: "Report a Concern", path: "/report" },
      { label: "Support & Complaints", path: "/support" },
      { label: "FAQ", path: "/faq" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    // Resources lives in the footer only (header menu removed at the client's request)
    key: "resources",
    links: [
      { label: "Blog & News", path: "/news" },
      { label: "Get the App", path: "/app" },
      { label: "Download Center", path: "/downloads" },
      { label: "Tools", path: "/tools" },
      { label: "Media & Press", path: "/press" },
      { label: "Editorial Policy", path: "/editorial-policy" },
    ],
  },
];

export const footerUtility: NavLink[] = [
  { label: "Find Your State", path: "/states" },
  { label: "Questions Answered", path: "/answers" },
  { label: "Fact Check", path: "/fact-check" },
  { label: "Our Team", path: "/team" },
  { label: "Search", path: "/search" },
  { label: "Sitemap", path: "/sitemap" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Cookie Policy", path: "/cookies" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Submission Terms", path: "/submission-terms" },
  { label: "Safeguarding Policy", path: "/safeguarding" },
  { label: "Code of Conduct", path: "/code-of-conduct" },
  { label: "Editorial & Corrections Policy", path: "/editorial-policy" },
  { label: "Accessibility", path: "/accessibility" },
  { label: "NDPA", path: "/ndpa" },
  { label: "GDPR", path: "/gdpr" },
];

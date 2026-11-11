# TBH One — Requirements, Design System and Implementation Plan

Prepared 23 October 2026 from:

- *TBH One Concept Note (Revised)*, October 2026, 18 pp.
- *TBH One — Revised Website Menu*, 21 October 2026, 15 pp.
- *TBH One — Stakeholder Dashboards & E-commerce PRD*, 21 October 2026, 41 pp.
- Your master prompt.
- Supplied assets: the logo, four tagline posters and two theme-song recordings.

Status: **for review.** I have written no code yet.

---

## 1. What we are building, in one paragraph

TBH One (Tell One, Bring One, Help One) is a citizen-funded mobilisation platform supporting the Nigeria Democratic Congress (NDC) ticket of Peter Obi (presidential candidate) and Rabiu Musa Kwankwaso (running mate). The election is on Saturday 16 January 2027.

The platform has five parts:

1. **A public website.** About 70 pages in five languages, plus programmatic pages for states, LGAs, projects, events, answers and fact checks.
2. **A shop.** Merch, bulk and ward packs, member coupons and partner offers.
3. **One authenticated platform** with 16 role-based dashboards.
4. **A floating AI + WhatsApp help channel.**
5. **Hard compliance guardrails.** No vote data; giveaways stop at the campaign cut-off; payouts need two people; foreign money is held until cleared.

The PRD targets an MVP on **9 November 2026**, 17 days from today. Releases 1.1 and 1.2 follow on 30 November and 14 December.

---

## 2. Facts confirmed, and where each comes from

| Fact | Value | Source |
|---|---|---|
| Election Day (Presidential & National Assembly) | Saturday 16 January 2027 | Concept Note p.2; PRD p.1; INEC revised timetable reported by [Channels TV, 26 Feb 2026](https://www.channelstv.com/2026/02/26/inec-releases-revised-election-timetable-presidential-poll-to-hold-jan-16/) and [The Guardian](https://guardian.ng/politics/inec-moves-2027-presidential-election-to-january-16/) |
| Campaign cut-off | 11:59 pm WAT, Thursday 14 January 2027 | Concept Note p.14; PRD EC-25, GR-3 |
| Shop dispatch resumes | 17 January 2027 | PRD EC-25 |
| Ticket | Peter Obi (presidential candidate), Rabiu Musa Kwankwaso (running mate), NDC; Obi declared flagbearer at a special convention in Abuja on 30 May 2026 | [Politico.ng, 31 May 2026](https://www.politico.ng/2026/05/31/2027-peter-obi-names-kwankwaso-as-running-mate-after-securing-ndc-ticket/); [Wikipedia: 2027 Nigerian general election](https://en.wikipedia.org/wiki/2027_Nigerian_general_election) |
| Governorship & State Assembly elections | Saturday 6 February 2027 (needed only for the timeline) | INEC revised timetable, via the sources above |
| Taglines (five languages) and the two official hashtags | As written in Concept Note p.2–3 | Concept Note |
| Electoral structure | 36 states + FCT, 774 LGAs, 8,809 wards | Concept Note p.4 |
| Launch dates | Website and Shop 9 Nov 2026; apps 10 Nov 2026 | PRD §20 |

The documents do not say which candidate holds which position. I took the roles from the public reporting above. Please confirm them before the candidate pages go live.

---

## 3. Conflicts, gaps and how I propose to resolve them

| # | Issue | Resolution I recommend |
|---|---|---|
| C1 | **"Light mode" means two different things.** The master prompt reads PRD WEB-3's "no autoplay in light mode" as the light colour theme. In the PRD, *Light mode* is the low-data mode (SH-7: under 300 KB per screen, images load on tap). | Build two separate controls. **Theme** (Light / Dark / System) is visual only. **Data Saver** ("Light mode" in the PRD's sense) turns off autoplay, loads images on tap and switches to low-bitrate audio. Autoplay is blocked in Data Saver, never by the colour theme. |
| C2 | **Theme song: five languages required, two recordings supplied.** We have Hausa ("Kuɗin Jama'a", 3:07) and Pidgin ("We No Go Thief Your Money", 2:55). | The player lists all five languages. English, Yorùbá and Igbo show as "Recording coming soon" and cannot be selected; they are never filled with a substitute. The default track follows the site language and falls back to Pidgin. |
| C3 | **Only one logo variant, and it is a low-resolution PNG** (655×381, candidate fingerprint portraits). The concept note shows a second "TBH ONE" wordmark lockup that we don't have as a file. | Use the supplied PNG now, never redrawn. I need vector SVG/PDF of both lockups, plus a reversed (white) version for dark surfaces. Until then, dark mode places the logo on a white plate so it stays legible. |
| C4 | **Imagery.** The four supplied images are tagline posters. At least two of their photographs look AI-generated (the shop labels read "HERITABE COFFEE" and similar garbled text). There are no candidate photos, team photos, product photos or project photos. | Use the posters as campaign creative only: the Message page, Our Belief, the Media gallery and a hero language rotation. They are never presented as documentary evidence. Wherever a photo is missing, the slot shows a labelled placeholder ("Approved photo pending"). No stock or Western imagery is used. |
| C5 | **"No blank spaces" vs. "never invent official contact details or payment credentials."** | All official data lives in one file, `site.config.ts`. Harmless content (bios, FAQs, timeline, page copy) is drafted from the documents and public sources, with citations. Dangerous values (phone numbers, WhatsApp number, bank details, social handles, app store links) are **not** invented. The UI shows a filled, honest state instead, e.g. "Official WhatsApp line opens 9 November 2026 — verify at /verify". In demo mode a visible "Demo" chip marks every sample figure. Nothing is left blank, and nothing could send a member's money or messages to a stranger. |
| C6 | **The master prompt cites `Pasted text(2).txt`.** | This is the Stakeholder Dashboards & E-commerce PRD PDF, which I used as the source of truth. |
| C7 | **PRD decision #1 says "buy a CRM, custom-build only the street-leader PWA".** The master prompt asks for the whole platform. | Build the whole platform as one Next.js codebase, with every external system behind an adapter interface. If the national team later buys a CRM, it plugs in behind those adapters without rewriting the UI. |
| C8 | **Dark mode is "Could" in the PRD (SH-16) but required in the master prompt.** | Build it, as part of the token system from day one. |
| C9 | **Translations.** Five full languages are required, and AEO-3 says to work from native keyword research, not literal translation. | I will provide the full i18n structure, the UI strings in all five languages and the approved taglines. Long-form copy in Pidgin, Yorùbá, Hausa and Igbo will be marked **"Draft translation — pending translator review"** and set to noindex until approved. This follows the rule "do not pretend untranslated content is complete." |
| C10 | **Counter figures in the menu doc** ("1,284,560 members", "Halima from Kano") are examples. | Use them only as demo data, labelled "Demo". |
| C11 | **The 774 LGA pages.** | Build the template and data model. Each LGA page is indexed only when it meets the PRD rule (≥1 active ward leader, ≥1 project or event, 150+ unique words); otherwise it is noindex. This avoids thin pages. |
| C12 | **The master prompt mentions an Ullweb/HostULL NAP block and LocalBusiness schema.** | Excluded. The site carries only TBH One, NDC and candidate entities, with no LocalBusiness schema. |

---

## 4. Requirements matrix (condensed)

Legend: **Build** = implemented in code. **Sandbox** = works against the provider's test mode once keys are added. **Demo** = local sample data, clearly labelled. **Ext** = needs something outside the codebase (credentials, legal sign-off, assets).

### 4.1 Shared platform (PRD §4)

| ID | Requirement | Plan | Status at handover |
|---|---|---|---|
| SH-1 | Phone + SMS OTP; email + password; WhatsApp link | OTP service with an SMS adapter (Termii recommended for Nigeria); email/password with argon2 hashing; WhatsApp magic link via the Business API adapter | Build + Sandbox; demo accounts with fixed OTP shown on screen |
| SH-2 | 2FA for roles above Member | TOTP (authenticator app), with SMS as fallback | Build |
| SH-3 | Role switcher | In the header; one account can hold many roles | Build |
| SH-4 | RBAC with geographic scope | Policy layer on the server; every query is scoped by role and area (national → state → LGA → ward → street; chapter; function) | Build |
| SH-5 | Five-language interface | next-intl; language chosen at sign-up and changeable at any time | Build (draft strings flagged) |
| SH-6/7 | Android 8+ with 2 GB RAM, PWA, under 300 KB per screen | Server components, minimal JS, Data Saver mode, performance budget enforced in CI | Build |
| SH-8 | Offline task logging | Service worker + IndexedDB queue + background sync | Build |
| SH-9 | Notifications (in-app, SMS, WhatsApp), opt-in, daily cap | Notification service with per-channel consent and a cap | Build; delivery Ext |
| SH-10 | Report a Concern on every screen | Persistent button in the dashboard shell; /report on the public site; anonymous option | Build |
| SH-11 | Help on every screen | Floating support control (AI + WhatsApp + toll-free + ticket status) | Build; AI needs an API key |
| SH-12/MB-13 | Verified ID card with QR | Downloadable SVG/PNG card with a verification code; /verify checks it | Build |
| SH-13 | Profile, consent, export, delete | Settings pages; export to JSON/CSV; deletion request goes to the DPO queue | Build |
| SH-14 | Audit log | Append-only table written on every create, edit, approve and pay action | Build |
| SH-15 | WCAG 2.1 AA | Tokens checked for contrast, focus rings, 44 px targets, captions | Build |
| SH-16 | Dark mode | Token-based | Build |

### 4.2 Dashboards (PRD §5–13) — 16 role views on one shell

| Dashboard | PRD IDs | MVP priority | Key guardrails enforced in code |
|---|---|---|---|
| Member & Project Funder | MB-1…14 | **P1** | Leaderboard opt-in; Tell One log stores count and relative only, never vote data |
| Street Leader | SL-1…10 | **P1** | Offline queue; GPS and time on photos; duplicate-photo hash flag; first name and status only |
| Ward Leader | WL-1…12 | **P1** | Cannot approve own task or pay; event cannot publish until checklist complete; 48 h escalation |
| Finance Controller | FN-1…7 | **P1** | Approver ≠ releaser (GR-5); foreign and large holds (₦1m checks, ₦5m legal); report built from the ledger |
| Safeguarding | SG-1…5 | **P1** | Timers: Critical 1 h, High 24 h, Low 72 h; restricted case records; sexual-abuse reports bypass ward leaders |
| Data Protection Officer | DP-1…5 | **P1** | 30-day request clock; contact import off until DPO approves (NF-9) |
| National Command Centre | NC-1…11 | P1 core / P2 rest | Giveaway manager auto-stops at cut-off; recorded random draw |
| Shopper | EC-11…22 | **P1** | — |
| Shop Operations | EC-ADM-1…4 | **P1** | Every coupon action logged; no electoral targeting fields exist (EC-10) |
| State Coordinator / Focal Point | ST-1…11 | P2 (Release 1.1) | Drill-down stops at street level; CSV exports are aggregated only |
| Country Coordinator (Diaspora) | CC-1…9 | P2 | Cash offers routed to legal; no payment link until cleared; local time shown alongside WAT |
| Creators / Associates / Translators | CR-1…9 | P2 | Two-step review before publishing; consent form required for featured people; AI-use label applied automatically |
| Vendors / Partners | VN-1…10 | P2 | Invoice only after confirmed delivery; awards published on /transparency |
| Delivery Partner | (EC-17…21) | P2 | Sees assigned shipments only |
| NDC Aspirant | AS-1…7 | P3 (Release 1.2) | Spend statement can be exported at any time |
| Call Centre | CA-1…4 | P3 | Caller lookup shows no payment data; AI transcript handed over |

### 4.3 Shop (PRD §17)

| Area | Requirements | Plan |
|---|---|---|
| Catalogue | EC-1…3, EC-28 | Categories, variants, stock, names in five languages, search, filters, sort, "popular in your state"; design-approval flag before listing |
| Pricing | EC-4, EC-6…10 | Bulk 15% off from 50 items and 20% off from 200; member price 10% below public; coupon engine (%, fixed ₦, free delivery, buy X get Y, reward item); one coupon per order; Impact Points conversion (500 pts = ₦500, 1,000 = free delivery, 2,500 = T-shirt); partner offer codes and QR |
| Checkout | EC-11…16, EC-26/27 | Cart persists (account + local); guest checkout; Paystack test mode (card, transfer, USSD); VAT line; full fee and refund disclosure before payment; Nigerian addresses only; foreign cards held for review |
| Fulfilment | EC-17…24 | Order state machine (Paid → Sent to vendor → Packed → Dispatched → Out for delivery → Delivered); delivery zones (Lagos/Abuja 1–3 days, state capitals 3–5, elsewhere 5–7; free above ₦20,000); pickup points; 7-day returns |
| Campaign rule | EC-25 | Date-driven feature flags: promotions off at 2027-01-14T23:59 WAT; orders still accepted, with "dispatches from 17 January" shown at checkout |

The delivery fees per zone are not in the PRD. I will use configurable placeholders (marked "Demo") until the Merch lead sets them.

### 4.4 Public website (Menu doc + PRD §16, §18)

| ID | Requirement | Plan |
|---|---|---|
| WEB-1 | Election ticker and timeline | Ticker under the top bar; /election timeline with today's position marked; a clock-driven mode switch: **campaign → neutral voter info (cut-off) → INEC results link only (Election Day)** |
| WEB-2 | Live member count | Polls every 60 s; "just joined" feed is opt-in, first name and state only |
| WEB-3 | Theme song player | Directly below the hero; autoplay where the browser allows, otherwise starts muted with "Tap for sound"; pause remembered for 30 days; stops when any video plays; no autoplay in Data Saver |
| WEB-4 | Social feed | Server-cached X and Instagram adapter (15 min), fallback to last good feed, editor hide; until API access exists, it shows "Follow our verified accounts" linking to /verify |
| WEB-5 | Event calendar | Filters; RSVP; .ics export; Event schema |
| WEB-6 | Media Hub | TV player shell with schedule, movies, gallery, transcripts; thumbnails load first |
| WEB-7 | Blog & News | Author pages, categories, NewsArticle schema, news sitemap |
| WEB-8 | Get the App | Badge component; smart app banner once store IDs exist |
| SEO-1…17 | Rendering, hreflang, metadata, sitemaps, robots, schema, programmatic pages, breadcrumbs, redirects, Dataset/CSV, trust signals | Static or server rendering for every public page; per-page metadata in five languages; `/sitemap.xml` index; 301s for `/tv`, `/theme-song`, `/movies`, `/gallery`, `/offers` |
| GEO-1…5, AEO-1…4 | AI crawler policy, `/llms.txt`, one Fact Sheet, entity markup, answer-first intros | Fact Sheet as a single data source reused across pages; H1 names the subject; 40–60-word direct answer under every H1 (the PRD's range; the master prompt's 60–100 conflicts, so I'll target 60 words to satisfy both) |
| Guardrails | GR-1…10 | No vote, PVC or polling-unit fields anywhere in the schema; AI identifies itself at the start of every chat |

---

## 5. Sitemap and route list

Every route below also exists under `/pcm/`, `/yo/`, `/ha/` and `/ig/`.

**Top bar:** Language · Verify `/verify` · Talk to Us `/contact` · Get the App `/app` · Cart `/shop/cart` · Login `/login` · **Join** `/join` · **Fund a Project** `/projects`

**Below the top bar:** the live election ticker.

| Menu | Pages |
|---|---|
| A. The Movement | `/about` `/team` `/belief` `/framework` `/transparency` `/movements` |
| B. Campaign Hub | `/message` `/election` `/events` → `/events/[slug]` `/voter-info` `/states` → `/states/[state]` → `/states/[state]/[lga]` `/answers` → `/answers/[slug]` `/fact-check` → `/fact-check/[slug]` `/map` |
| C. Get Involved | `/join` `/projects` → `/projects/[slug]` `/ward-leaders` `/street-leaders` `/diaspora` `/groups` `/creators` `/translators` `/rewards` `/whatsapp` |
| D. Opportunities — Members | `/benefits` `/jobs` → `/jobs/[slug]` `/training` `/giveaway` `/business` `/vendors` |
| E. Opportunities — Organisations | `/partners` `/partners/media` `/partners/services` `/partners/advertise` `/partners/unions` |
| F. Media Hub | `/media` `/media/tv` `/media/theme-song` `/media/movies` `/media/social` `/media/gallery` |
| G. Shop | `/shop` `/shop/merch` → `/shop/p/[slug]` `/shop/bulk` `/shop/custom` `/shop/coupons` `/shop/offers` `/shop/orders` `/shop/delivery-returns` `/shop/cart` `/shop/checkout` `/shop/checkout/confirmation` |
| H. The Party | `/candidates` → `/candidates/peter-obi` `/candidates/rabiu-musa-kwankwaso` `/manifesto` `/ndc` `/aspirants` |
| Resources | `/news` → `/news/[slug]`, `/news/author/[slug]` `/app` `/downloads` `/tools` `/press` `/faq` `/support` `/report` `/contact` `/verify` `/search` `/sitemap` `/editorial-policy` |
| Legal | `/privacy` `/cookies` `/terms` `/submission-terms` `/safeguarding` `/code-of-conduct` `/accessibility` `/ndpa` `/gdpr` |
| Auth (noindex) | `/login` `/login/verify` `/login/recover` `/login/2fa` |
| Platform (noindex) | `/dashboard` → `/dashboard/[role]/...`, one section per role |
| System | `/404`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` |

**Count:** about 75 hand-built routes, plus the programmatic templates (37 states, up to 774 LGAs, projects, events, answers, fact checks, products and articles).

**Footer:**
- Four columns, exactly as in the menu doc.
- Live counter band.
- App badges.
- Utility row: Find Your State · Questions Answered · Fact Check · Our Team · Search · Sitemap.
- Social row: verified accounts plus the two hashtags.
- Legal bar.
- "© 2026 TBH One. All Rights Reserved."

**Quick-action bar:**
- Desktop: right edge, five items.
- Mobile: bottom bar. It hides on checkout and form-submit screens so it never covers primary buttons.
- Items: Join, Fund, Shop, Giveaway, Talk to Us.

**Separate floating support control** (bottom-right, above the mobile bar): AI chat and WhatsApp.

---

## 6. Design system

### 6.1 Where the identity comes from

The design takes everything from the client's own assets, not from a template:

- **The speech-bubble frame** from the logo: a green outlined rectangle with a chevron tail. This is the signature device. It frames the hero tagline, pull quotes, the AI chat panel and "Today's action" in the dashboard. It is used sparingly, never on every card.
- **The split rule** from the posters: a hairline bar, half red and half green, across the top of every page and the dashboard shell.
- **Adire-style line pattern:** the faint maze texture behind the posters, redrawn as a 2–3% opacity SVG tile behind hero and section breaks only.
- **Tagline as hero.** The memorable moment is typographic: the tagline cycles through the five languages inside the bubble frame, using the posters' type treatment (light high-contrast serif with the key words set heavy: "We Will Not **STEAL** Your **MONEY**"). This is the one place the design is bold; everything else stays quiet and disciplined.

### 6.2 Colour tokens

All colours were measured from the supplied logo and posters. **These are provisional until you supply the official brand guide.**

| Token | Light | Dark | Source / use |
|---|---|---|---|
| `--brand-green` | **#157103** | #5DBB45 | Logo green (measured). Primary buttons, links, active nav. 5.6:1 on paper |
| `--brand-green-deep` | #0F4D02 | #8BD474 | Derived. Hover, headings on tint (9.1:1) |
| `--brand-red` | **#FD0102** | #FF5A4E | Logo red (measured). Decorative only: split rule, "LIVE" dot, the "ONE". **Never body text** (3.7:1 fails AA) |
| `--signal-red-text` | #B00000 | #FF5A4E | Derived. Error text and critical alerts (6.6:1) |
| `--paper` | **#F4F3EE** | #121611 | Poster background (measured). Page background |
| `--surface` | #FFFFFF | #1B2119 | Cards, forms, dashboard panels |
| `--ink` | #1B1A16 | #E9E8E1 | Body and headings (15.7:1) |
| `--ink-muted` | #5C5A52 | #A7A69D | Secondary text (6.2:1 / 7.5:1) |
| `--line` | #D9D7CE | #2C342A | Borders and dividers |
| Status colours | success = brand green; warning #8A5A00; info #1F4E79 | lighter equivalents | Dashboards, chips and charts, each paired with an icon and a label (never colour alone) |

The concept note's gold (#B8962E-ish) and navy are **document styling, not brand**, so they are excluded, as your brief asks.

Charts use a green ramp plus neutral greys. Red appears only for "over threshold" and critical items.

### 6.3 Typography

| Role | Typeface | Why |
|---|---|---|
| Display (H1, hero, tagline, big numbers) | A high-contrast transitional serif matching the posters. Candidate: **Gloock**, or the nearest Google Font with full **Latin Extended Additional** coverage | Matches the posters. Must render Yorùbá and Igbo dot-below and tone marks (ẹ ọ ṣ ị ụ ṅ, á à), which **I will test before committing.** If Gloock fails, the fallback is a serif with full Vietnamese-range coverage |
| Text and UI | **Source Sans 3** | Excellent legibility at small sizes on low-end screens; full diacritic coverage; variable font, one file |

- The logo wordmark stays an image. It is never re-set in a font.
- **Scale** (Bringhurst-style, ratio about 1.25, fluid with `clamp()`): 14 / 16 (body) / 20 / 25 / 31 / 39 / 49 / 61 (hero only).
- **Measure:** 60–72 characters. **Line height:** 1.55 for body.
- **No** all-caps labels, no eyebrow labels, no single-word colour accents in headlines. The posters' heavy-word treatment is the one sanctioned exception, and only for the tagline.
- **Fonts are self-hosted and subset.** Body is preloaded; display is `font-display: swap`.

### 6.4 Layout, shape and motion

- **Grid:** 4 columns on mobile, 8 on tablet, 12 on desktop.
- **Container:** max 1200 px for content, 1440 px for the dashboard.
- **Side gutter:** 16 px on phones.
- **Spacing:** 4-point scale (4, 8, 12, 16, 24, 32, 48, 64, 96).
- **Radius by hierarchy:** 0 on the bubble frame and rules (it is drawn with straight lines); 6 px on inputs and buttons; 12 px on panels. Not one radius everywhere.
- **Elevation:** borders first; a single soft shadow only for overlays (menus, drawers, modals).

**Wireframe — homepage hero, desktop**

```
┌─ red ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ │ green ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ┐
│ Lang  Verify  Talk to Us  Get the App  Cart(2) Login [Join][Fund]│ top bar
│ ● INEC: PVC collection at LGA offices · 85 days · Demo count  │ ticker
│ [LOGO]  Movement  Campaign  Get Involved  Opportunities  Media  Shop  Party  ⌕ │
├────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────┐    line-art portraits (2%) │
│  │  We Will Not                    │                           │
│  │  STEAL Your MONEY               │   Tell One · Bring One ·  │
│  └───────────\/────────────────────┘   Help One (3 short lines)│
│   EN · PCM · YO · HA · IG  ← tagline language dots             │
│   [ Join TBH One — free ]  [ Fund a Project ]                  │
│   85 days 06 h to Election Day · Saturday 16 January 2027      │
├────────────────────────────────────────────────────────────────┤
│ ▶ ❚❚  Kuɗin Jama'a · Hausa  ━━━━━━○──── 1:12 / 3:07   🔈  Lang ▾│ player
└────────────────────────────────────────────────────────────────┘
```

On mobile the hero stacks in this order: bubble tagline → two buttons (full width) → countdown. The player sits directly below as a compact single row.

**Motion:**
- One orchestrated moment: the tagline language rotation (crossfade, 6 s per language, pauses on hover or focus, and does not rotate under `prefers-reduced-motion`).
- Everything else is responsive feedback only: menu open (150 ms), drawer and modal (200 ms), progress bars filling once when they come into view, toast slide, and button press states.
- No scroll-reveal on every section. No animation library; CSS plus a small IntersectionObserver.

### 6.5 Component inventory

These are built once and reused everywhere:

- **Global chrome:** TopBar, ElectionTicker, MegaMenu, MobileDrawer, Breadcrumbs, PageHeader (H1 + QuickAnswer + Sources), Footer, QuickActionBar, SupportLauncher (AI and WhatsApp), CookieBanner (controls far right on desktop), ThemeSwitch, DataSaverToggle, LanguageSwitch.
- **Content:** Countdown, ThemeSongPlayer, VideoPlayer, FAQ (`<details>` with H3), Ticker, CTA band, StatBlock (with "Demo" chip support), ProjectCard + ProgressBar, EventCard + ICS export, ProductCard, Leaderboard, Testimonial (consent-gated), SourceList, FactSheet table, StateMap (SVG).
- **Forms and feedback:** Field, Select, Phone input (+234), OTP input, File/photo capture, Stepper, Toast, Dialog, Drawer, Confirm dialog, Empty / Loading (skeleton) / Error / Success states.
- **Dashboard:** DashboardShell (role-aware nav, role switcher, **Back to Website** and **Sign out** as separate actions, Report a Concern, Help), DataTable (becomes cards below 768 px), filters, KPI tiles, charts (hand-built SVG: bar, line, progress, heat map), ApprovalCard, Timeline, AuditTrail, IDCard + QR.

Token documentation and component variants will live in `/design-system` (a noindex internal route) and in `DESIGN.md`.

---

## 7. Architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Static and server rendering for crawlable public pages (SEO-1); client components only where needed; route-level code splitting |
| Styling | CSS custom properties (tokens) + Tailwind v4 mapped to the tokens | One source for both themes; small CSS output |
| i18n | next-intl, locale prefixes `as-needed` (English at `/`) | Matches the menu doc's URL structure; generates hreflang |
| Data | **PostgreSQL + Prisma** (SQLite for local demo) | Relational ledger, audit, RBAC; the 19 PRD records map directly to tables |
| Auth | Own OTP + session cookies (httpOnly, rotating), TOTP 2FA, RBAC policy module | Provider-agnostic SMS; no third-party lock-in for 5 m users |
| Payments | Paystack adapter (test mode) for card, transfer, USSD; Flutterwave-compatible interface | PRD decision #2 |
| AI chat | Server route calling the **Anthropic API** with a retrieval layer over approved site content and the Fact Sheet; system prompt enforces GR-10 and "no invented facts" | Keys stay on the server; answers carry links to cited pages |
| Offline | Service worker (Workbox-style, hand-rolled to stay small) + IndexedDB queue | SL-2, SH-8 |
| Maps | Hand-made SVG of the 36 states + FCT for public pages; MapLibre + OSM only inside dashboards that need zoom | Keeps public pages light |
| Media | `next/image` (AVIF/WebP); audio transcoded to 64 kbps AAC for Data Saver and 128 kbps standard (I will do this with ffmpeg from your MP3s) | WEB-3, SH-7 |
| Storage | S3-compatible adapter (Cloudflare R2 or AWS) with server-side image compression | Proof photos, content files |
| Hosting | Any Node host (Vercel or your own VPS with PM2/Docker) | Your choice; see questions |

**Integration status at handover**

| Service | Status at handover | What you need to supply |
|---|---|---|
| SMS / OTP (Termii or similar) | Adapter + demo mode | API key, approved sender ID |
| WhatsApp | Click-to-chat link (no API needed) + Business API adapter | Official number; WABA credentials for broadcasts |
| Payments (Paystack) | Test mode end-to-end | Test then live keys; settlement account |
| Payouts | Adapter + two-person workflow | Transfer-enabled account |
| AI | Live if a key is set; otherwise a scripted FAQ bot clearly labelled as such | Anthropic API key |
| Email | Adapter | Resend/SES key, domain DNS |
| Social feed | Fallback state | X API (paid tier) and Instagram Graph access |
| Courier APIs | Manual status updates in Shop Ops | Two courier contracts and APIs |
| Analytics | Consent-mode loader, off until consent | GA4 / Plausible ID |
| App stores | Badge + smart banner shells | Store IDs/URLs (apps are a separate codebase, out of scope here) |

The native Android and iOS apps (APP-1…9) are a separate project. This build provides the PWA, the APIs the apps would use, and the deep-link routes.

---

## 8. Build phases and review checkpoints

| Phase | Output | Your checkpoint |
|---|---|---|
| **0. Setup** | Repo, Next.js scaffold, CI (typecheck, lint, Lighthouse budget), tokens, fonts tested for diacritics, `site.config.ts`, Fact Sheet | — |
| **1. Design system** | Tokens (light, dark, Data Saver), core components, `/design-system` page | Review palette and type in the browser |
| **2. Homepage** | Full chrome (top bar, ticker, mega menu, mobile drawer, footer, quick actions, support launcher, cookie banner) and all 21 homepage sections with real copy, posters and theme-song player | **Review 1: homepage**, as your brief asks |
| **3. Public pages** | All ~75 routes from templates; states/LGA, answers, fact check, projects, events, news; legal pages; SEO (metadata, schema, sitemaps, robots, llms.txt, redirects); five-language routing | Review 2: representative pages |
| **4. Auth + platform core** | Sign-in flows, demo accounts, role switcher, RBAC, audit log, dashboard shell | — |
| **5. P1 dashboards** | Member/Funder, Street Leader (offline), Ward Leader, Finance, Safeguarding, DPO, National (core) | Review 3: dashboards |
| **6. Shop** | Catalogue → cart → checkout (Paystack test) → confirmation → tracking → returns; Shopper and Shop Ops dashboards; cut-off flags | Review 4: shop journey |
| **7. P2/P3 dashboards** | State, Diaspora, Creators, Vendors, Delivery, Aspirant, Call Centre | — |
| **8. AI + WhatsApp** | Support panel, AI with retrieval and guardrails, escalation to a call-centre ticket | — |
| **9. QA** | Playwright tests for all 16 prototype journeys; screenshots at 320/375/390/430/768/1024/1280/1440 in both themes; axe accessibility scan; Lighthouse mobile; link crawler (zero 404s); fixes | Review 5: final |
| **10. Handover** | Route list, DESIGN.md, architecture doc, demo credentials, integration checklist, known limitations | — |

I will run and screenshot the site myself at every checkpoint, and I won't call a feature working until I have exercised it in the browser.

---

## 9. Assets and information I need from you

These are not blocking; placeholders are used until they arrive.

1. **Logo files:** SVG/PDF of both lockups (fingerprint portraits and the "TBH ONE" wordmark), plus white/reversed versions.
2. **Brand guide**, if one exists, to replace the provisional palette and fonts.
3. **Approved photographs:** both candidates (official portraits), team members with names and roles, real community or project photos with consent.
4. **Theme song:** English, Yorùbá and Igbo recordings; lyrics if they should be displayed.
5. **Official channels:** WhatsApp number, toll-free number, email, social handles, NDC official links, office address (if any).
6. **Product list** for the shop: items, prices, sizes, vendor, photos; delivery fees per zone.
7. **The manifesto** (PDF or text) and approved candidate bios.
8. **Any approved FAQ answers or press releases.**

---

## 10. Decisions I need from you before coding

1. **Where should the code live?** This session runs in a temporary cloud container that is deleted after inactivity. I need a GitHub repository (new or existing) to push to; otherwise the work can be lost.
2. **Hosting target:** Vercel (simplest for Next.js) or your own server (Ullweb/HostULL infrastructure)? This affects build configuration, not design.
3. **Approve or adjust** the design direction in §6 (bubble-frame signature, poster-derived palette and type), and the placeholder policy in C5.

# TBH One: completion audit

Last updated after the Netlify and preview work.

Audit of the code against the master prompt, the PRD and the Revised Website Menu, as summarised in `docs/Implementation_Plan.md` §4–5. Every status below comes from code inspection plus tests run on a **production build** (`next build` + `next start`), not from route existence alone.

**Status key**
- **Complete:** built, and its main interactions were exercised in a browser.
- **Incomplete:** works, but something is still missing (named).
- **Not implemented:** absent; the reason is given.

"Demo" means the feature runs on mock data and browser storage, as agreed. No backend is connected.

## How it was tested

| Check | Tool | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | 0 errors |
| Production build | `npm run build` | Passed, no warnings; 5,117 pages pre-rendered |
| Internal links | `npm run qa:links` (crawls every link from `/`, `/dashboard`, `/sitemap`) | 1,028 URLs, 0 broken |
| End-to-end journeys | `npm run qa:flows` | 14 / 14 pass |
| Dashboards | `npm run qa:dashboards` (every section of every role: own H1, no runtime error, unique content) | 129 / 129 sections pass |
| Layout | `npm run qa:browser` on 346 routes × 5 widths (320, 390, 768, 1024, 1440 px): horizontal overflow, console errors, exactly one H1 | See §7 |
| Sitemap routes | Every route in plan §5 requested on the production server | All 200; `/tv`, `/theme-song`, `/movies`, `/gallery`, `/offers` 308-redirect as planned |
| Offline folder | `npm run build:offline`, then opened via `file://` in Chromium | Homepage, shop photos, add to cart, Yorùbá page, LGA page and login all work, with no errors |
| Service worker | Production build, visited pages, then browser set offline | Visited pages reload offline |
| Netlify build | Clean copy: `npm ci`, then `netlify build` (Netlify CLI 27.14.3, Next.js runtime 5.16.4) | Passed: server function and static assets packaged; about 5,000 pre-rendered pages as Netlify Blobs; no edge functions needed |
| Netlify serving | `netlify serve` | **Not verified.** It needs Netlify Blobs from a linked Netlify site, and Netlify's servers are blocked from the build environment. The same production build was served and fully tested with `next start` |
| Preview package | `npm run build:preview`, then `npm run qa:preview`, from disk (`file://`) and over HTTP | 12 / 12 checks pass both ways; 0 failed file requests |

## 1. Public pages and submenus

| Menu | Pages | Status | Notes |
|---|---|---|---|
| Top bar | Language, Verify, Talk to Us, Get the App, Cart, Login, Join, Fund a Project | Complete | Language menu keeps the current page (bug fixed during audit: English links used to go through a redirect) |
| Election ticker | Under the top bar; changes with the campaign phase | Complete | Phases are driven by date: campaign → cut-off → Election Day (INEC IReV link) → post-election |
| A. The Movement | about, team, belief, framework, transparency, movements | Complete | Transparency CSV download tested |
| B. Campaign Hub | message, election, events (+12), voter-info, states (+37 states, +774 LGAs), answers (+38), fact-check (+6), map | Complete | LGA pages are template-generated and kept out of search results |
| C. Get Involved | join, projects (+14), ward-leaders, street-leaders, diaspora, groups, creators, translators, rewards, whatsapp | Complete | WhatsApp channel shows "Coming soon" until the official number is supplied (it is never invented) |
| D. Opportunities (members) | benefits, jobs (+8), training, giveaway, business, vendors | Complete | |
| E. Opportunities (organisations) | partners, partners/media, partners/services, partners/advertise, partners/unions | Complete | |
| F. Media Hub | media, tv, theme-song, movies, social, gallery | Complete | Seven theme songs play. Movie titles are labelled placeholders, because no films exist yet |
| G. Shop | see §3 | Complete (demo) | |
| H. The Party | candidates, peter-obi, rabiu-musa-kwankwaso, manifesto, ndc, aspirants | Complete | Candidate images are the supplied logo artwork. Official photographs are pending |
| Resources | news (+3, author page), app, downloads, tools, press, faq, support, report, contact, verify, search, sitemap, editorial-policy | Complete | Search covers English only, in the browser |
| Legal | privacy, cookies, terms, submission-terms, safeguarding, code-of-conduct, accessibility, ndpa, gdpr | Incomplete | All present, each with a "Draft — pending legal review" banner. Needs a lawyer's sign-off |
| System | 404 per language, robots.txt, sitemap.xml (199 URLs plus hreflang), llms.txt | Complete | |
| Footer | Four columns, live counter band, app badges, utility row, social row and hashtags, legal bar, "© 2026 TBH One. All Rights Reserved.", cookie controls far right | Complete | |
| Quick-action bar and support control | Join, Fund, Shop, Giveaway, Talk to Us; AI chat and WhatsApp | Complete | AI answers come from approved local answers. WhatsApp support is pending the official number |

## 2. Homepage (21 sections)

| # | Section | Status |
|---|---|---|
| 1 | Hero: tagline rotating through 5 languages, T-B-H list, calls to action, candidates, countdown | Complete. Intro paragraph removed as requested |
| 2 | Theme-song player: autoplay or muted fallback, 7 songs, pause remembered for 30 days, stops when a video plays, Data Saver | Complete |
| 3–5 | Our Belief, Meet the Candidates, T-B-H Framework | Complete |
| 6–8 | Live member count, Projects and Transparency, Election timeline | Complete (demo figures) |
| 9–11 | Event calendar, Daily giveaway, Shop (real product photos) | Complete |
| 12–14 | Become a Leader, Member benefits, Impact Points leaderboard | Complete |
| 15 | People Speak | Complete. No invented testimonials; an invitation to share stories instead |
| 16–18 | Media Hub, Blog and News, Social feed | Complete. The social feed shows "Follow our verified accounts" until API access exists |
| 19–21 | Get the App, Stay Safe, Stay Connected (newsletter) | Complete |
| — | Design corrections: light theme by default, lime accent `#A3DE8B`, warm off-white `#F2F3ED` surfaces, softer background pattern | Complete |

## 3. Shop

| Feature | Status | Notes |
|---|---|---|
| Shop home, Merch catalogue, search, category filter, collection filter ("Language series"), sort | Complete | |
| Product detail: gallery (front and back for the hoodie), size and colour required, quantity, member price | Complete | 16 products |
| Product photos | Incomplete | 9 products have the client's photos. Still showing "Product photo pending": the Hausa T-shirt, wristbands, key holders, banners, stickers and packs |
| Cart: quantities, remove, coupon (members-only rules), totals with VAT line, delivery zones | Complete | |
| Checkout: details → delivery (courier or pickup hub) → payment (card, transfer, USSD; simulated Paystack test) → confirmation | Complete (demo) | Foreign cards are held for review. Promotions switch off and dispatch is held after the cut-off |
| Order tracking (Track My Order), signed-in order history, "simulate next status", 7-day returns | Complete (demo) | |
| Bulk tiers, custom designer (minimum 20), coupons page, partner offers and QR codes, Impact Points conversion, delivery and returns policy | Complete (demo) | |
| Real payment, stock and courier integration | Not implemented | Needs a backend (see `Developer_Handoff.md`) |

## 4. Role-based dashboards (16)

Each role has its own sidebar of sections, its own data scope and its own controls. Each was tested by loading every section (129 in total) and by role-specific flows.

| Role | Sections | Status | Key controls verified |
|---|---|---|---|
| Member and Project Funder | 12 | Complete (demo) | ID card with QR, data export, Tell One log, funded projects |
| Street Leader | 10 | Complete (demo) | Safety training gate before logging, photo proof with duplicate flag, offline queue and sync |
| Ward Leader | 12 | Complete (demo) | Approve or reject with a reason, cannot approve own task, 48-hour escalation, event checklist gates Publish |
| State Coordinator | 11 | Complete (demo) | LGA heat map, incident queue with countdown, CSV export of aggregates only |
| Country Coordinator (diaspora) | 9 | Complete (demo) | Cash offers held for legal review, events shown in both local time and West Africa Time |
| Creator / Translator | 9 | Complete (demo) | Consent form required, automatic AI-use label, two-step review before publishing |
| Vendor / Partner | 10 | Complete (demo) | Invoice only after delivery, one-time member-offer codes |
| NDC Aspirant | 7 | Complete (demo) | Approve or request changes, spend statement CSV |
| National Command Centre | 11 | Complete (demo) | Recorded giveaway draw, role grants with vetting, publish validation |
| Finance Controller | 7 | Complete (demo) | Approver cannot be the one who releases (two-person rule) |
| Safeguarding | 5 | Complete (demo) | Timers, restricted records |
| Data Protection Officer | 5 | Complete (demo) | Request clock, feature approval requires a written justification |
| Call Centre | 4 | Complete (demo) | Caller lookup without payment data, ticket from a call |
| Shopper | 6 | Complete (demo) | Orders, returns, addresses, coupons |
| Shop Operations | 7 | Complete (demo) | Order board, coupon guardrails, returns approval |
| Delivery Partner | 4 | Complete (demo) | Delivery code or photo proof, failed-attempt handling |

## 5. Authentication

| Feature | Status | Notes |
|---|---|---|
| Registration (`/join`): phone → code → details → consent → member ID and QR | Complete (demo) | Tested end to end |
| Sign-in by phone and one-time code; wrong code rejected | Complete (demo) | Code `123456` |
| Sign-in by email and password | Complete (demo) | Password `demo1234` |
| Sign-in by WhatsApp link | Not implemented | Needs the WhatsApp Business API and the official number. The tab explains this and its button is disabled |
| `/login/verify` (code page) and password reset (`/login/recover` → `/login/verify?mode=reset`) | Complete (demo) | **Added during this audit** |
| Two-factor for roles above Member: dashboard gate and `/login/2fa` | Complete (demo) | `/login/2fa` **added during this audit**. Code `246810` |
| Demo accounts (15) and role switcher | Complete | Reviewer account holds all 16 roles; switching between staff roles does not ask for 2FA again in the same session |
| Sign-out, and dashboards gated after sign-out | Complete | |

## 6. Site-wide interactions

| Feature | Status |
|---|---|
| Mega menu (desktop), drawer (mobile), active-page highlight, breadcrumbs | Complete |
| Header search and `/search?q=` results | Complete (English index) |
| Theme: Light (default), Dark, System; remembered across pages | Complete |
| Data Saver: low-bitrate audio, no autoplay | Complete |
| Language switching across 5 languages, keeping the page | Complete |
| **Translated content** for Pidgin, Yorùbá, Hausa and Igbo | **Incomplete.** About 20 interface strings per language are drafts. Page bodies fall back to English under a "draft translation" notice, and these pages are kept out of search results. Needs professional translators |
| Forms: inline validation, error focus, success reference numbers | Complete |
| Cookie banner (necessary, analytics and marketing choices; remembered) | Complete |
| Installable app and offline: manifest plus service worker (production builds) | Complete. Service worker **added during this audit**. Visited pages open offline |
| Accessibility basics: skip links, landmarks (dashboard `<main>` added during audit), labelled controls, one H1 per page, focus rings, 44 px targets | Complete for the automated checks. **A formal WCAG 2.1 AA audit (screen reader and contrast tooling) has not been done** |

## 7. Layout: desktop, tablet and mobile

The final sweep of 346 routes at 5 widths (1,730 page loads) is recorded below.

The first sweep found 16 horizontal-overflow issues, mostly at 320 px. The causes were:
- single-column grids sized by their longest content;
- unbreakable hashtags;
- wide tables that clipped instead of scrolling;
- a file input, a badge and a button label that couldn't shrink.

All were fixed at the shared-style level.

| Run | Scope | Result |
|---|---|---|
| Sweep 1 | 344 routes × 5 widths | 16 overflow issues; 0 console errors; 0 H1 problems |
| Sweep 2, after grid and table fixes | 346 routes × 5 widths | 10 overflow issues, plus 1 hydration warning (see §10) |
| Sweep 3, after wrapping fixes | 346 routes × 5 widths (1,730 loads) | **1 issue:** a badge on Ward Leader approvals at 320 px. 0 console errors, 0 H1 problems, every route 200 |
| Final recheck, after the badge fix, on the final build | All 19 routes that ever failed, plus checkout and the new auth pages, × 5 widths | **0 problems** |

The full 1,730-load sweep was not repeated after the last change, which only lets badge labels wrap on screens narrower than 480 px. Every route that ever failed was re-tested.

**Status: Complete.** Desktop (1024, 1440), tablet (768) and mobile (320, 390) layouts have no horizontal scrolling, no console errors and exactly one H1 per page.

## 8. Fixed during this audit

- Language menu "English" links went to `/en/…`, a redirect, on every page; 989 such links.
- `/login/verify` and `/login/2fa` were missing.
- Password reset had no step for setting a new password.
- Dashboards had no `<main>` landmark or skip link.
- Dashboard titles were cut to a few letters on phones.
- Wide data tables clipped columns (`overflow: hidden`) instead of scrolling.
- 16 small-screen overflow issues (see §7).
- Choice and pledge cards only selected when the small radio itself was clicked.
- KPI numbers wrapped onto two lines.
- The Yorùbá top-bar button widened phone pages.
- Form labels lost their link when a field had a custom `id`.
- Street Leader ranking ran names into street names.
- State logistics bars had no labels.
- Map labels were unreadable in dark mode.
- Dashboard links back to the website started prefetches that never finished.
- No service worker existed.
- The project had no Netlify configuration (see §9).
- The offline export now includes the product photos.

## 9. Deployment (Netlify)

| Item | Status |
|---|---|
| `netlify.toml`: build `npm run build`, publish `.next`, Node 22, `@netlify/plugin-nextjs` pinned | Complete |
| English root rewrite moved from `src/middleware.ts` to `next.config.ts` rewrites, so no edge function is needed. All route types re-tested: 5 languages, dashboards, API, assets, redirects, 404s | Complete |
| `.env.example`: names and comments only; no variable is required to build | Complete |
| Most likely cause of the reported "Page not found": the Next.js source was uploaded to Netlify without a build (for example dragged onto Netlify Drop), or a ZIP or folder was uploaded where `index.html` is not at the top level. In both cases Netlify has no page to serve at `/`. The client's Netlify site and build log were not available to confirm this | Explained in the README with three deploy options |
| Live deploy to Netlify | Not done: Netlify's servers are blocked from the build environment, and no account access was provided |

## 9b. Client update round (28 Oct 2026)

| Request | Status | Notes |
|---|---|---|
| New logo ("The Nigeria We Want") | Complete | Header, footer, dashboards, downloads and app icons. The logo sits on a light plate on green and dark backgrounds |
| Colour balance: 50% green, 30% neutral, 20% red, no gray | Complete | Green and red colour bands across the top bar, ticker, player, page headers, homepage sections, calls to action and footer; warm off-white instead of gray; AA contrast in every band, in light and dark mode |
| Candidates' real faces, with the NDC party mark | Complete | Hero, homepage candidates, `/candidates` and both profile pages. The NDC mark is cropped from the supplied photo, and an official vector should replace it when available |
| Photos of Nigerians across the site | Complete for the preview; rights to clear before launch | The client supplied 10 photos in two batches. Nine appear on the homepage ("The Nigerians we’re working for"), with rotating sets of five on About, Join and Diaspora, and single photos on Jobs, Business, Benefits and Training. The tenth, a ballot-counting photo, is on Election and Voter Information. Second batch: one photo has a photographer's mark ("Dexit Media"); one shows a minor in school uniform; one shows a French-language whiteboard, so is probably not Nigerian; one looks like an official portrait, possibly of a public figure. Captions are neutral and claim no support. **Before launch:** one photo is an unlicensed Adobe Stock preview with a visible watermark (#1148191656); the NYSC corps members are barred from partisan politics; the ballot photo shows electoral officials; the others have no known source. See the `rights` notes in `src/data/photos.ts`. More photos can be added with `scripts/add-photos.py` |
| Stay signed in after demo login | Complete | The top bar and mobile menu show the member's name with My dashboard and Sign out on every public page |
| Dark-mode switch | Complete | Moon/sun button in the header, alongside the full Light/Dark/System setting |
| Theme player sticky with the header on all pages | Complete | Public pages. The dashboards are work screens and have no player. On the hosted site playback is continuous across pages; in the file preview it resumes at the same point |
| Autoplay toggle | Complete | Remembered per browser; applies to the first page of a visit; off by default in Data Saver |
| Lyrics view | Complete | Lyrics panel with a song picker (song choice is in this panel on phones) |
| Simple dropdown menus without descriptions | Complete | Page names only |
| Shop as a link, not a menu | Complete | The shop's own section menu sits on every shop page |

## 9c. Client update round (29 Oct 2026)

| Request | Status | Notes |
|---|---|---|
| Shop moved up; Resources only in the footer | Complete | Shop is the first header item; Resources is a fifth footer column (also removed from the mobile menu) |
| Lyrics on a white panel | Complete | |
| Hero: no subtext | Complete | T-B-H lines and the "learn more" link removed |
| "No corruption" box red (homepage and `/belief`); T-B-H letters red, green, red | Complete | |
| Projects: red, green, red cards that scroll, with more projects | Complete | All 14 projects in a swipeable carousel with arrow buttons |
| Register pop-up | Complete | After 15 s or half a page; at most once a week; never for members or on forms; tested |
| Leader CTAs white; benefit boxes animate and change colour; leaderboard text white | Complete | |
| More energy | Complete | Scroll reveal, count-up figures, hover lift, floating app phones, pulsing play button; all off under "reduce motion" |
| Member stories instead of a blank placeholder | Complete (demo) | Six sample stories labelled "Demo data", with a note; never paired with real photos. Replace with consented stories |
| Mobile app UI design | Complete | Home, Projects and Shop screens (`components/AppScreens.tsx`) on the homepage and `/app` |
| Header logo at footer size | Complete | 104 px on desktop, shrinking on scroll |
| Images or patterns in the six light sections | Complete | Belief, Framework, Events, Members get, People speak, Stay safe |
| "Active across … and growing" section | Complete (demo figures) | Every state by zone and every diaspora chapter, with a location panel |
| "Una" changed to "Your" | Complete | The Pidgin T-shirt photo still shows the earlier print (#WNGTUM, "Una"); its description says so |
| Major greens darker, small greens lighter | Complete | Bands #0f4d02, cards #157103 |
| NDC / Obi YouTube video in the Media Hub | Waiting for the client | YouTube was unreachable from the build environment, and links are never invented. Paste an official video ID in `site.featuredVideo.youtubeId` (`src/config/site.ts`). Meanwhile, a designed card with the candidates |
| AI-generated news thumbnails | Done differently | No AI image generator was available. Each article has a custom illustrated thumbnail drawn in code (`components/NewsArt.tsx`) |

## 9d. Client update round (30 Oct 2026)

- [x] "Commit and register" pop-up is white; the side quick-action menu is red (desktop rail and phone bar), with a white outline over red sections.
- [x] Large green areas use #0f4d02 (the hero tagline box too); smaller panels use the lighter green.
- [x] Logo enlarged so "The Nigeria We Want" is readable (140px desktop, 100px when scrolled, 88/72px on phones; sharper 560px file); footer logo matches.
- [x] Shop moved to the end of the main menu, beside the theme, search and account controls, as a red pill.
- [x] Projects carousel: white cards; progress bar, status chip and buttons alternate red, green, red; scrolls through all projects.
- [x] T-B-H boxes: headings match their buttons (Diaspora Voices, New Members, Community Projects) with the T-One / B-One / H-One label above; H shows a classroom photo.
- [x] Event calendar: a calendar illustration built from the event data (the month and the event days marked).
- [x] Our Belief, What members get and People speak: photos shown clearly, not faded; People speak cards in a staggered collage.
- [x] "Active across 36 states" rebuilt like the client's reference: white section, country tiles, a clickable map of all 37 states (shaded by activity), and a "Select a location" panel. Map: svg-maps / MapSVG, CC BY 4.0 (credited on the page).
- [x] Daily giveaway on white with a red box; Get the App on white; Stay safe red with no photo.
- [x] Media Hub: posters replaced by four Peter Obi interview videos from YouTube (also listed on the TBH One TV page). Not playback-tested here: YouTube is blocked in the build environment.
- [x] Social feed: Instagram, X and TikTok panels with sample posts, labelled, until the official handles are listed.

## 10. Known issues and limits

- **Demo data only.** Every record lives in the visitor's own browser. Nothing is shared between devices or users. See `Developer_Handoff.md` for the backend services needed.
- **Translations:** see §6.
- **Legal pages** need legal review.
- **Product photos missing** for 7 products.
- **Official contacts** are deliberately `null` in `src/config/site.ts`: phone, email, WhatsApp, social accounts, app-store links and the NDC website. Pages show "pending".
- **Content to replace:**
  - Demo figures, prices, news and leaderboards are labelled "Demo data".
  - The Impact Points earning values are a proposal.
- **Intermittent hydration warning (React #418):** appears only when the CPU is heavily loaded (reproduced with 10 to 12 browsers loading pages at once; about 1 load in 10 under that load, never with pages loaded one at a time). Instrumenting React showed the cause: under load, hydration of the page root restarts and React's cursor points at `<meta charset>` in `<head>` while it expects the skip link at the top of `<body>`. This is inside Next.js 15.5.28 / React 19.3.1 (already the latest 15.5 release); the site's own components were checked and none renders differently on server and client. React recovers by itself (it re-renders the page in the browser) and the page always ends up correct. The QA scripts report it as a "known framework warning" rather than a failure. Recheck when upgrading to Next.js 16.
- **Offline, unvisited pages:** while offline, a page that was never visited shows the site's "page not found" screen rather than a dedicated offline page.
- **Not yet done:** a formal accessibility audit, performance budgets measured on real low-end Android devices, and load testing.

# TBH One: developer handoff

This is a **frontend prototype**. Every page, form and dashboard works in the browser, but all data is demo data. Every "save" goes to the visitor's own browser storage (`localStorage`). Nothing reaches a real database, payment provider, SMS gateway or messaging service. This document lists what a backend team must build before launch, and what the client must supply or sign off.

## 1. How the prototype fakes a backend

| Area | Prototype behaviour | Where |
|---|---|---|
| Sign-in | Demo users. Phone OTP code `123456`, password `demo1234`, 2FA code `246810` for roles above Member. Session stored in `tbh-session` | `src/lib/auth.ts` |
| Orders | Shared order store in `tbh-orders`, used by checkout, Track My Order and the Shopper, Shop Ops and Delivery dashboards. "Simulate next status" advances it | `src/lib/orders.ts` |
| Cart and coupons | `localStorage` cart; coupon rules applied in the browser | `src/lib/cart.ts`, `src/lib/shop-pricing.ts` |
| Live figures | Member and leader counts are computed in the browser from a seed | `src/lib/stats.ts`, `src/lib/useLiveStats.ts` |
| AI assistant | Matches approved answers locally. A `/api/chat` route exists for production, but the offline build does not call it | `src/data/knowledge.ts`, `src/components/chrome/SupportLauncher.tsx` |
| Forms | `simulate()` waits briefly, then shows a reference number such as TKT-, SG-, RET-, CUS- or TBH-MBR- | `src/components/ui/Form.tsx` |
| Dashboards | Seeded mock data per role | `src/data/mock/`, `src/dashboards/` |

`DEMO_MODE` in `src/config/site.ts` controls the "Demo data" labels across the site.

## 2. Backend services needed

**Identity and members**
- SMS OTP and WhatsApp login, a member database, and real 2FA for staff roles.
- Role grants through the identity provider, with an audit log and vetting status.
- Member ID and QR issuance.
- Leader ID register for `/verify`, including suspended IDs.
- Data export and deletion requests, with an NDPC 72-hour breach clock and a request store for the DPO.

**Money**
- A payment provider with webhooks and receipts for project funding and the shop. Foreign cards and payers outside Nigeria must be held for review; the prototype already enforces this rule.
- Two-person payout release, enforced server-side. In the prototype, whoever approved a payout cannot release it.
- Payments over ₦50,000 need a second review.
- A finance ledger, vendor invoices and profit-share statements.
- Cash offers from the diaspora held for legal review, with no payment link.

**Shop**
- An order engine: stock, coupons, member pricing and bulk tiers.
- Courier APIs and webhooks.
- SMS delivery codes. The prototype uses the fixed code `4321`.
- Photo upload for proof of delivery and returns, and a 7-day returns window.
- Custom-design approval workflow and partner-offer code validation, where each code can be used only once.
- Dispatch pause after the campaign cut-off (14 Jan 2027, 23:59 WAT) until 17 Jan 2027. Implemented in `shop.ts`.

**Field operations**
- Task proofs: photo, GPS and count, plus a duplicate-photo check, and offline sync for street leaders.
- Approval queues with 48-hour escalation.
- Incident routing to the national and safeguarding leads, with response timers.
- Broadcasts to WhatsApp and SMS.
- Points ledger, leaderboards with opt-in, and giveaway entries with a recorded, auditable server-side draw.

**Content and media**
- A CMS for news, answers, fact-checks, events and projects.
- Translator approval for the Pidgin, Yorùbá, Hausa and Igbo drafts.
- A video host and live stream for TBH One TV, and a feed adapter for X and Instagram.
- Search across all five languages. The prototype searches English only, in the browser.
- RSVP and training registration lists, and storage for applications, tickets and enquiries.
- A shared support-ticket queue for the Call Centre.

**Analytics and SEO feeds**
- Core Web Vitals, search and AI-answer visibility feeds for the National dashboard.
- Analytics that load only after cookie consent. The consent banner already stores the choice in `tbh-consent`.

## 3. Content the client must supply or sign off

- **Official contacts.** Phone, email, WhatsApp numbers, social accounts, app-store links and the NDC website are `null` in `src/config/site.ts`. The site shows "pending" and never invents them.
- **Legal review.** The 9 policy pages carry a "Draft — pending legal review" banner.
- **Prices.** All shop prices and aspirant package prices are demo or indicative.
- **Impact Points values.** The earning values on `/rewards` are a proposal, because the Concept Note §7 table was not available.
- **Demo content to replace.** Giveaway prize, TV schedule, movie titles, diaspora chapters, leaderboards, news articles (marked Draft) and live figures.
- **Product photos.** The Hausa Language-series T-shirt and the remaining merch (wristbands, key holders, banners, stickers, packs) still show "Product photo pending".
- **Photo rights.** Clear the supplied photos of people before launch (see the `rights` notes in `src/data/photos.ts`): one is an unlicensed, watermarked Adobe Stock preview; the NYSC corps members are barred from partisan politics; another shows electoral officials. Add owned or consented photos with `scripts/add-photos.py`.
- **NDC logo.** The party mark is cropped from a supplied photo; replace it with the official vector file (`public/brand/ndc-mark.*`).
- **Logo.** A reversed version of the logo for dark mode. The current logo sits on a white plate in dark mode.

## 4. Build and run

See `README.md`.
- `npm run dev` starts the dev server.
- `npx next build` checks the production build.
- `scripts/build-offline.sh <folder>` builds the double-click offline folder.
- QA scripts:
  - `scripts/qa-crawl.mjs` checks every internal link.
  - `scripts/qa-browser.mjs` checks layout overflow, console errors and one H1 per page at 320, 390, 768, 1024 and 1440 px.

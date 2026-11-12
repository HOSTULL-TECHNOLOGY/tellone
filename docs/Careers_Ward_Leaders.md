# Careers: Ward Leaders (Wave 1): implementation notes

Source: *TBH One: Careers Landing Page: Ward Leaders (Wave 1)*, 23 Oct 2026, and the updated publish-ready *Career Page content* (17 sections and a microcopy library). All page copy is in `src/data/careers.ts`.

Application order (client request): 1 Follow us (Vision Points tiles) → 2 Register → 3 Apply (ward, about you, community standing, availability of 2 or 4 hours a day, pledge) → 4 Boost more (events, quiz, invites). ID, endorser and payment details are checked by the state team on a call with the selected candidate, not collected in the form.

This is a front-end prototype with no backend. "Prototype" in the table below means the screen and the rules are built, but the data is demo data or is saved in this browser only. The production service still has to be connected.

## Routes

| Route | What it is |
|---|---|
| `/careers` | Careers hub: roles table, wave panel with live counter |
| `/careers/ward-leaders` | Landing page: hero with ward finder, Vision Points, duties, earnings, requirements, regions, safety, support, FAQ |
| `/careers/ward-leaders/apply` | Members-only register → application → confirmation (noindex) |
| `/careers/street-leaders` | Waiting list until 23 Nov 2026, then the application |
| `/training/leader` | 2-hour ward leader training (4 modules) |
| `/street-activation-guide` | Rules, fees and approvals for street activations |
| `/ward-leaders` | Redirects to `/careers/ward-leaders` (in all five languages) |
| `/dashboard/member/apply` | Application status: tracker, messages, nudges |
| `/dashboard/national/recruitment` | Recruitment funnel, sources, regions, states, measures of success |
| `/dashboard/state-coordinator/ward-applications` | Applicant queue with the score breakdown |

## Requirements

| ID | Requirement (short) | Where / status |
|---|---|---|
| CAR-1 | Hub and landing page, five languages, JobPosting and FAQPage markup, redirect | Built. Key strings are translated as drafts in `src/i18n/careers.ts` and need native-speaker review |
| CAR-2 | Members-only application; register first, then return to the form | Built (`ApplyFlow.tsx`), with simulated authentication |
| CAR-3 | Ward finder and live counter, refreshed every 60 s | Built. The counts are sample figures |
| CAR-4 | One leader per ward; a taken ward offers the waiting list | Built |
| CAR-5 | Route to the state approvals queue (ST-5), or to National if there is no coordinator | Queue built (state dashboard). The routing itself is backend work |
| CAR-6 | Endorser SMS, reminder after 48 h, new endorser after 5 days | Message templates and tracker built. Sending needs an SMS provider |
| CAR-7 | ID, selfie and bank-name check; files encrypted | Upload fields and the name-match check built. The checks themselves are backend work |
| CAR-8 | Decision within 3 working days; escalate after 48 h | Shown in the queue and the KPIs |
| CAR-9 | 2-hour training and Code of Conduct before the leader ID | Built (`/training/leader`, pledge in the application) |
| CAR-10 | Dashboard tracker with messages at each step | Built (`WardLeaderStatus.tsx`) |
| CAR-11 | Nudges after 24 h and 3 days | Templates shown on the dashboard |
| CAR-12 | National funnel by state, region and source | Built, demo data |
| CAR-13 | Street leader waiting list, opening 23 Nov | Built. Switches over at build time, so rebuild after 23 Nov |
| CAR-14 | Fee claims under the two-person rule | Existing finance and ward dashboards |
| CAR-15 | Under-18, outside Nigeria, ward not found and duplicate checks | Built |
| CAR-16 | Closes 30 Nov 2026, or earlier at the cut-off | Built. Checked when the page is built and when the form is submitted |
| CAR-17 | Four finder methods, no login, light mode | Built |
| CAR-18 | Dataset for all 8,809 wards | Built from public data (temikeezy/nigeria-geojson-data, MIT licence). Ward points only, no boundary polygons yet; verify against INEC |
| CAR-19 | Landmark search that tolerates misspellings | Built. 151 seed landmarks, which state teams must verify |
| CAR-20 | Near a ward boundary, show both wards | Built (nearest-ward approximation) |
| CAR-21 | The found ward carries through; "I live in this ward" | Built |
| CAR-22 | Location privacy; no PVC data | Built. GPS is used once in the browser |
| CAR-23 | WhatsApp and phone helper on 0904 569 9268 | Links built. The bot is backend work |
| CAR-24 | "This ward looks wrong" report | Form built |
| CAR-25 | Move an application to another ward | Demo action in the state queue |
| CAR-26 | Vision Points engine, capped at 100, excess to Impact Points | Client-side engine built |
| CAR-27 | Live Vision Meter | Built on the careers page |
| CAR-28 | 11 platform tiles with deep links | Built as 13 tiles: the 11 platforms plus WhatsApp Channel and Telegram (client request). `@tbhonenigeria` on every platform; the WhatsApp Channel link is pending, so its button opens a chat with 0904 569 9268 |
| CAR-29 | Screenshot proof, then pending, then verified | Simulated |
| CAR-30 | Re-verification and audits | Backend work |
| CAR-31 | Route without social media (80 points) | Built |
| CAR-32 | Scoring 30/25/20/15/10 shown in the queue | Built |
| CAR-33 | Decision rule: 7 days, ties, waiting list | Built in the queue, with a demo "compare now" button |
| CAR-34 | Separate consent for the social check; deletion periods | Consent built. Deletion is backend work |
| CAR-35 | Anti-fraud controls and flags | Flags KPI on the dashboard. Detection is backend work |
| CAR-36 | Official accounts on all 11 platforms, listed on Verify | Listed on `/verify`. The accounts must be created before launch |

## Before launch

- Confirm the official email and address. They are still marked pending in `src/config/site.ts`.
- Confirm the social handles exist on every platform.
- Replace the sample ward statuses with the live database.
- Have the four non-English languages reviewed by native speakers.
- The home-page band, the quick link and the street-leader switch are decided at build time. Rebuild on 23 Nov and again after 30 Nov.

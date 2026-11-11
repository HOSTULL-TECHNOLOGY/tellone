# TBH One — website (Next.js)

Tell One, Bring One, Help One. This is the full TBH One website prototype:
- the public website, in 5 languages;
- the shop;
- sign-in;
- 16 role-based dashboards.

It is a **frontend prototype**. Sign-in, orders, payments, approvals and every other record are simulated in the browser with demo data. No backend, database or third-party service is connected. Section 6 below lists what is demo-only, and `docs/Developer_Handoff.md` gives the full list of what production needs.

## 1. Install and run

Requirements:
- **Node.js 20 or 22** (LTS), with npm. Check with `node -v`.
- Python 3 is only needed for the optional offline build.

```bash
npm install          # or: npm ci   (uses package-lock.json for exact versions)
npm run dev          # development server → http://localhost:3000
```

Production build:

```bash
npm run build        # compiles and pre-renders every page (about 5,100)
npm start            # serves the production build → http://localhost:3000
npm run typecheck    # TypeScript check
```

Preview folder, the whole site as plain files that open by double-clicking `index.html` with no server needed (for review, or for Netlify Drop):

```bash
npm run build:preview -- ../TBH-One-Website-Preview   # macOS / Linux, or Git Bash on Windows (needs bash and python3)
```

## 2. Signing in (demo)

Open `/login`. The quickest way in is the **Demo accounts** list on that page.

| What | Demo value |
|---|---|
| SMS / one-time code | `123456` |
| Password (email sign-in) | `demo1234` |
| Two-factor code (roles above Member) | `246810` |
| All-roles reviewer | `reviewer@demo.tbhone` / phone `0800 000 0000` |

The reviewer account holds all 16 roles. Use the **role switcher** at the top of any dashboard to move between them.

Other demo accounts, all signed in with the password `demo1234`:

| Email | Role |
|---|---|
| `member@demo.tbhone` | Member |
| `street@demo.tbhone` | Street leader |
| `ward@demo.tbhone` | Ward leader |
| `state@demo.tbhone` | State coordinator |
| `diaspora@demo.tbhone` | Country coordinator |
| `creator@demo.tbhone` | Creator |
| `vendor@demo.tbhone` | Vendor |
| `aspirant@demo.tbhone` | Aspirant |
| `national@demo.tbhone` | National |
| `finance@demo.tbhone` | Finance |
| `safeguarding@demo.tbhone` | Safeguarding |
| `dpo@demo.tbhone` | Data protection officer |
| `callcentre@demo.tbhone` | Call centre |
| `shopops@demo.tbhone` | Shop operations |

Other auth pages:
- `/join` registers a new member.
- `/login/recover` → `/login/verify?mode=reset` resets a password.
- `/login/2fa` is the second sign-in step.
- `/logout` signs out.

Everything you create is stored in your own browser (`localStorage`). To start fresh, clear the site data.

## 3. Project structure

| Path | What |
|---|---|
| `src/app/[lang]/` | Public pages. English is served at `/`; Pidgin, Yorùbá, Hausa and Igbo at `/pcm`, `/yo`, `/ha`, `/ig` (the English root rewrite is in `next.config.ts`) |
| `src/app/[lang]/page.tsx` | Homepage: 21 sections |
| `src/app/[lang]/shop/` | Shop: catalogue, product, cart, checkout, confirmation, orders, bulk, custom, coupons, offers, delivery and returns |
| `src/app/[lang]/login/`, `logout/` | Sign-in, code verification, 2FA, recovery, sign-out |
| `src/app/dashboard/` | Dashboards: `/dashboard/[role]/[section]` (own root layout, not indexed) |
| `src/dashboards/` | One file per role (16), plus `field/` and `office/` shared helpers |
| `src/data/roles.ts` | The 16 roles, their sections, scopes and 2FA rules |
| `src/components/` | `chrome/` (header, menus, footer, cookie banner, support chat), `ui/` (UI kit), `home/`, `shop/`, `auth/`, `dashboard/`, `participate/`, `content/` |
| `src/app/globals.css` | **Design tokens**: colours (primary green, lime accent `#A3DE8B`, warm off-white `#F2F3ED`), type, spacing, light and dark themes |
| `src/styles/` | Stylesheets per area (chrome, ui, home, content, participate, shop, dashboard, dash-field, dash-office) |
| `src/i18n/` | Interface text: English, plus draft Pidgin, Yorùbá, Hausa and Igbo (pending translator review) |
| `src/data/` | Navigation, content and mock data (states and LGAs, events, projects, news, answers, shop catalogue, demo records in `mock/`) |
| `src/lib/` | Demo logic: `auth.ts`, `cart.ts`, `orders.ts`, `shop-pricing.ts`, `campaign.ts` (date-driven campaign phases), `prefs.ts` (theme, Data Saver) |
| `src/config/site.ts` | Official contacts, social accounts and app links. `null` values are deliberately not invented; fill them in here |
| `public/` | Logo, posters, product photos (`shop/`), candidate artwork, fonts, theme songs (128 kbps and 48 kbps Data Saver versions) |
| `scripts/` | Preview build (`build-preview.sh`, `build-offline.sh`, `make-preview.py`, `flatten-export.py`) and the QA scripts below |
| `netlify.toml` | Netlify build settings (Next.js runtime) |
| `source-assets/` | (Download only) The original files you supplied: posters, logo artwork, songs, product photos. Not used by the site; `public/` holds the optimised copies |
| `docs/` | `Implementation_Plan.md` (requirements, sitemap, design system), `Developer_Handoff.md` (backend needs), `Audit_Checklist.md` (completion audit) |

## 4. Quality checks

All checks run against a running server (`npm run dev` or `npm start`). The browser checks need Playwright's Chromium once: `npx playwright install chromium`.

```bash
npm run qa:links -- http://localhost:3000                       # every internal link returns 200
npm run qa:flows -- http://localhost:3000                       # 14 end-to-end journeys
npm run qa:dashboards -- http://localhost:3000                  # every dashboard section of all 16 roles
npm run qa:browser -- http://localhost:3000 scripts/qa-routes.txt   # 346 routes: overflow, console errors, one H1, at 320/390/768/1024/1440 px
npm run qa:preview -- ../TBH-One-Website-Preview                   # the double-click preview, tested from disk
```

## 5. Deploy to Netlify

This is a **Next.js server application**: it uses dynamic routes, URL rewrites, redirects, security headers and API routes (`/api/chat`, `/api/stats`, `/api/subscribe`). On Netlify it runs on **Netlify's Next.js runtime**, which `netlify.toml` already configures. It must be *built* by Netlify. Uploading this source folder to Netlify Drop serves the raw files without building them, and every address returns **"Page not found"**.

### Option A: full site from Git (recommended)

1. Put this folder in a Git repository (GitHub, GitLab or Bitbucket) and push it.
2. In Netlify: **Add new site → Import an existing project**, then pick the repository.
3. Netlify reads `netlify.toml`. The settings should show:

   | Setting | Value |
   |---|---|
   | Base directory | *(empty)* |
   | Build command | `npm run build` |
   | Publish directory | `.next` |
   | Runtime | Next.js (`@netlify/plugin-nextjs`, pinned in `devDependencies`) |
   | Node version | 22 (set in `netlify.toml`) |

4. Click **Deploy**. The first build takes about 3–5 minutes, because it pre-renders about 5,100 pages.

### Option B: full site from your computer (Netlify CLI)

```bash
npm ci
npx netlify-cli login
npx netlify-cli init            # or: npx netlify-cli link   (an existing site)
npx netlify-cli deploy --build --prod
```

### Option C: quick review link without a build (Netlify Drop)

Run `npm run build:preview`. Then drag the resulting **`TBH-One-Website-Preview` folder itself**, the one that contains `index.html`, onto https://app.netlify.com/drop. It is the static preview: every page works, and nothing runs on a server, so the AI chat uses its local answers.

### Environment variables

All are optional. Set them in Netlify under **Site configuration → Environment variables**, or in `.env.local` for local runs. See `.env.example`.
- `NEXT_PUBLIC_SITE_URL`: the live address, used for canonical links and structured data.
- `NEXT_PUBLIC_DEMO_MODE=false`: hides demo labels once live data is connected.
- `ANTHROPIC_API_KEY`: switches the help chat from approved scripted answers to the live AI assistant.

None is required for the build to succeed. Never commit real keys; `.env*` files are git-ignored (except `.env.example`, which holds names only).

Other Node hosts that support Next.js work too, for example Vercel, or `npm run build && npm start` on your own server.

## 6. Adding photos of people

The homepage ("Faces of the movement"), About, Join and Diaspora pages have photo mosaics. They stay hidden until photos are listed in `src/data/photos.ts`.

1. Put the photos in a folder.
2. Run `python3 scripts/add-photos.py path/to/folder --credit "Photo: TBH One"`. This needs Pillow (`pip install pillow`).
3. Paste the printed entries into `peoplePhotos` in `src/data/photos.ts`, and write each photo's alt text.

Use only photos the campaign owns or has licensed, with consent from the people shown. Stock-photo licences usually forbid using a person in a way that implies they endorse a cause.

## 7. Demo-only features (need a backend for production)

- **Sign-in:** OTP codes, passwords, 2FA, WhatsApp login, member IDs and the leader-ID register.
- **Shop and payments:** payments (simulated Paystack test step), orders, stock, coupons, delivery codes, courier tracking and returns.
- **Field operations:** approvals, payouts and the two-person rule, task proofs and photo uploads, offline sync, broadcasts, giveaway draws, the points ledger and leaderboards.
- **Live figures, search and AI:** live counters, site search (English only, in the browser), the AI assistant (local approved answers unless an API key is set), the social feed, the TV stream and analytics.
- **Content approval:** all prices, figures, news and translations are demo or draft and need the client's sign-off.

Details, and the content the client must still supply, are in `docs/Developer_Handoff.md`.

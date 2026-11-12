// Tests the double-click preview package (scripts/make-preview.py) straight from disk via file://:
// opening, fonts, images, theme song, navigation, mobile menu, theme, language, search, shop to order,
// demo login, role switching and a dashboard action. Reports every failed file request.
//   usage: node scripts/qa-preview.mjs <path-to/TBH-One-Website-Preview>
//          PREVIEW_URL=http://localhost:8080 node scripts/qa-preview.mjs
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";

const dir = resolve(process.argv[2] ?? "../TBH-One-Website-Preview");
// PREVIEW_URL tests the same folder served over http (e.g. a static host such as Netlify Drop)
const root = process.env.PREVIEW_URL ? process.env.PREVIEW_URL.replace(/\/?$/, "/") : pathToFileURL(dir + "/").href;
const launch = () => chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const results = [];
const failedFiles = new Set();

async function check(name, fn, viewport = { width: 1280, height: 900 }) {
  if (process.env.ONLY && !new RegExp(process.env.ONLY, "i").test(name)) return; // e.g. ONLY="signed in" runs one check
  // A fresh browser for every check, like a separate visitor: audio still winding down in one check's browser
  // can otherwise disturb the next check's storage on file:// pages.
  const b = await launch();
  const ctx = await b.newContext({ viewport });
  const page = await ctx.newPage();
  // Pre-set "pop-up seen" and cookie consent once, from the package's README (same file:// storage). Not with an
  // init script: Chromium can lose localStorage writes between file:// pages when a script touches storage the
  // moment each page starts, which made sign-in and the song position fail at random in this test only.
  await page.goto(root + "README.txt");
  await page.evaluate(() => { localStorage.setItem("tbh-register-prompt", String(Date.now())); localStorage.setItem("tbh-consent", JSON.stringify({ necessary: true, at: "qa" })); });
  page.setDefaultTimeout(15000);
  // Act like a person: after a page loads, wait until React has hydrated it before clicking (heavier pages on a
  // busy machine can take a few seconds, and a click before then is not handled yet)
  const hydrated = () => page.waitForFunction(() => { const el = document.querySelector("header, main, .dash-body"); return !!el && Object.keys(el).some((k) => k.startsWith("__react")); }, null, { timeout: 15000 }).catch(() => {});
  for (const m of ["goto", "waitForURL"]) {
    const orig = page[m].bind(page);
    page[m] = async (...args) => { const r = await orig(...args); await hydrated(); return r; };
  }
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
  // Requests cancelled because the test moved to another page (net::ERR_ABORTED) are not missing files
  page.on("requestfailed", (r) => { if (r.url().startsWith(root) && !/ERR_ABORTED/.test(r.failure()?.errorText ?? "")) failedFiles.add(decodeURI(r.url()).replace(decodeURI(root), "")); });
  try {
    const note = await fn(page);
    if (errors.length) throw new Error("runtime error: " + errors[0]);
    results.push(["PASS", name, note ?? ""]);
  } catch (e) {
    results.push(["FAIL", name, String(e.message ?? e).split("\n")[0].slice(0, 180)]);
  }
  await ctx.close();
  await b.close();
}
const here = (page) => decodeURI(page.url()).split("/").slice(-2).join("/");
const settle = (page, ms = 900) => page.waitForTimeout(ms);

await check("index.html opens the homepage (light theme, hero, no sideways scroll)", async (page) => {
  await page.goto(root + "index.html");
  await page.waitForURL(/pages\/index\.html/);
  await settle(page);
  const h1 = await page.locator("h1").innerText();
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  if (theme !== "light" || !/Tell One/.test(h1) || sw > 1281) throw new Error(`${theme} ${h1} ${sw}`);
  return `${here(page)}: "${h1}"`;
});

await check("Fonts: Noto Serif Display and Noto Sans load from the package", async (page) => {
  await page.goto(root + "pages/index.html");
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
  const want = ["Noto Serif Display", "Noto Sans"];
  for (const w of want) if (!fonts.some((f) => f.replace(/"/g, "") === w)) throw new Error(`missing ${w}; loaded: ${[...new Set(fonts)]}`);
  return [...new Set(fonts.map((f) => f.replace(/"/g, "")))].join(", ");
});

await check("Images: logo, candidate artwork, posters and product photos load", async (page) => {
  await page.goto(root + "pages/index.html");
  for (let y = 0; y < 20; y++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(120); }
  await settle(page, 1200);
  const imgs = await page.locator("img").evaluateAll((a) => a.map((i) => ({ ok: i.complete && i.naturalWidth > 0, src: i.currentSrc.split("/").pop() })));
  const broken = imgs.filter((i) => !i.ok);
  if (broken.length) throw new Error(`${broken.length} broken: ${broken.map((b) => b.src).join(", ")}`);
  return `${imgs.length} images on the homepage, all loaded`;
});

await check("Theme song: real MP3 from assets/audio plays", async (page) => {
  await page.goto(root + "pages/index.html");
  await settle(page);
  await page.locator(".splayer-play").click();
  await page.waitForFunction(() => { const a = document.querySelector("audio"); return a && a.currentTime > 0.5; }, null, { timeout: 15000 });
  const a = await page.evaluate(() => { const a = document.querySelector("audio"); return { src: a.currentSrc.split("/").slice(-3).join("/"), t: a.currentTime.toFixed(1), d: Math.round(a.duration) }; });
  await page.locator("#splayer-song").selectOption({ index: 3 });
  await settle(page, 600);
  const second = await page.evaluate(() => document.querySelector("audio").currentSrc.split("/").pop());
  return `${a.src} playing (${a.t}s of ${a.d}s); switched song to ${second}`;
});

await check("Sticky player on every page: lyrics panel, and the song resumes on the next page", async (page) => {
  await page.goto(root + "pages/index.html");
  await settle(page);
  // Autoplay is on by default: wait until it has either started or the player says the browser held it back,
  // then press play only if it is paused (pressing it mid-start would toggle it off)
  await page.waitForFunction(() => { const a = document.querySelector(".splayer audio"); return (a && !a.paused) || /paused autoplay/i.test(document.querySelector(".splayer")?.textContent ?? ""); }, null, { timeout: 8000 }).catch(() => {});
  if (await page.evaluate(() => document.querySelector(".splayer audio").paused)) await page.locator(".splayer-play").click();
  const state = () => page.evaluate(() => { const a = document.querySelector(".splayer audio"); return a ? `paused=${a.paused} t=${a.currentTime.toFixed(1)} ready=${a.readyState}` : "no audio"; });
  // Play past 4s before moving on: the position is saved about every half second, and the next page must show > 2s
  await page.waitForFunction(() => document.querySelector(".splayer audio").currentTime > 4, null, { timeout: 15000 }).catch(async () => { throw new Error(`song did not start (${await state()})`); });
  await page.locator(".splayer-lyrics").click();
  const lines = await page.locator("dialog[open] .song-lyrics p").count();
  await page.keyboard.press("Escape");
  await page.locator("header nav").getByRole("link", { name: /^Shop$/ }).click();
  await page.waitForURL(/en__shop\.html/);
  await page.waitForFunction(() => { const a = document.querySelector(".splayer audio"); return a && a.currentTime > 2; }, null, { timeout: 15000 }).catch(async () => { throw new Error(`position not carried to the Shop page (${await state()})`); });
  const t = await page.evaluate(() => document.querySelector(".splayer audio").currentTime.toFixed(1));
  return `${lines} lyric lines; on the Shop page the song carried on at ${t}s`;
});

await check("Stay signed in: demo login, then back on the public site the top bar shows the member", async (page) => {
  await page.goto(root + "pages/en__login.html");
  await page.getByRole("button", { name: /Adaeze/ }).first().click();
  await page.waitForURL(/dashboard__/);
  await page.goto(root + "pages/en__about.html");
  await settle(page);
  const who = await page.locator(".topbar .acct-name").innerText().catch(async () => {
    const d = await page.evaluate(() => ({ session: !!localStorage.getItem("tbh-session"), url: location.pathname.split("/").pop(), topbar: document.querySelector(".topbar")?.textContent.replace(/\s+/g, " ").slice(0, 160) }));
    throw new Error("member name not in the top bar: " + JSON.stringify(d));
  });
  if (!/Adaeze/.test(who)) throw new Error("not signed in: " + who);
  return `top bar shows ${who}`;
});

await check("Every menu link opens its page: all dropdowns, including every Media Hub page", async (page) => {
  // Each dropdown link must point to a page file that exists in pages/ (the shim maps "/media/tv" to en__media__tv.html)
  await page.goto(root + "pages/index.html");
  const hrefs = await page.locator(".nav-drop a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  const bad = [];
  for (const h of hrefs) {
    const file = await page.evaluate((x) => window.__tbhToFile(x), h);
    if (!existsSync(join(dir, "pages", file.replace(/^\.\//, "").split(/[?#]/)[0]))) bad.push(h);
  }
  if (bad.length) throw new Error("menu links with no page: " + bad.join(", "));
  // And click through every Media Hub page from the menu
  const media = await page.locator("#mega-media a").allInnerTexts();
  for (const name of media) {
    await page.goto(root + "pages/index.html");
    await page.locator("header nav").getByRole("button", { name: /Media Hub/ }).click();
    await page.locator("#mega-media a", { hasText: name }).first().click();
    await page.waitForURL(/en__media(__[a-z-]+)?\.html/);
    if ((await page.locator("h1").count()) !== 1) throw new Error(`${name}: no page heading`);
  }
  return `${hrefs.length} menu links all have pages; ${media.length} Media Hub pages opened from the menu`;
});

await check("Dropdown menu → Get Involved → Street Leaders page", async (page) => {
  await page.goto(root + "pages/index.html");
  await page.locator("header nav").getByRole("button", { name: /Get Involved/ }).click();
  await page.locator(".nav-drop:not([hidden])").getByRole("link", { name: /Street Leaders/ }).first().click();
  await page.waitForURL(/en__street-leaders\.html/);
  return `${here(page)}: ${await page.locator("h1").innerText()}`;
});

await check("Mobile (390px): drawer menu opens and navigates; bottom quick-action bar", async (page) => {
  await page.goto(root + "pages/index.html");
  await page.getByRole("button", { name: /menu/i }).first().click();
  await page.locator(".drawer").getByText(/Get Involved/).first().click();
  await page.locator(".drawer").getByRole("link", { name: /Street Leaders/ }).first().click();
  await page.waitForURL(/en__street-leaders\.html/);
  if (!(await page.locator(".quick").isVisible())) throw new Error("quick bar missing");
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  if (sw > 391) throw new Error("page wider than phone: " + sw);
  return here(page);
}, { width: 390, height: 844 });

await check("Theme switch to Dark persists to the next page", async (page) => {
  await page.goto(root + "pages/index.html");
  await page.locator(".topbar").getByRole("button", { name: /theme/i }).first().click();
  await page.getByRole("radio", { name: /dark/i }).first().check({ force: true });
  await page.waitForFunction(() => localStorage.getItem("tbh-theme") === "dark", null, { timeout: 5000 }).catch(() => {});
  await page.goto(root + "pages/en__about.html");
  const t = await page.evaluate(() => document.documentElement.dataset.theme);
  if (t !== "dark") throw new Error("theme " + t);
});

await check("Language switch: Yorùbá version of the same page", async (page) => {
  await page.goto(root + "pages/en__about.html");
  await page.locator(".topbar").getByRole("button", { name: /language/i }).first().click();
  await page.getByRole("link", { name: /Yorùbá/ }).first().click();
  await page.waitForURL(/yo__about\.html/);
  return `${here(page)} lang=${await page.evaluate(() => document.documentElement.lang)}`;
});

await check("Careers: ward finder works offline (Kawo), apply link opens with the ward; old /ward-leaders redirects", async (page) => {
  await page.goto(root + "pages/en__careers__ward-leaders.html");
  await page.locator("#wf-q").first().fill("Kawo mark");
  await page.locator("#wf-sugs button").first().click();
  await page.getByRole("button", { name: "Yes, this is my ward" }).first().click();
  const apply = page.locator("main a[href*='apply']").filter({ hasText: /apply|register/i }).filter({ visible: true });
  await page.locator(".wf-result, main").filter({ hasText: /Kawo/ }).first().waitFor();
  await page.locator("main a[href*='ward=']").filter({ visible: true }).first().click();
  await page.waitForURL(/careers__ward-leaders__apply\.html/);
  await page.locator("main").filter({ hasText: /Start here: follow TBH One/ }).first().waitFor();
  const applyUrl = here(page) + (page.url().includes("ward=") ? " (ward kept)" : " (NO ward)");
  await page.goto(root + "pages/en__ward-leaders.html");
  await page.waitForURL(/en__careers__ward-leaders\.html/);
  return `${applyUrl}; redirect → ${here(page)}; ${await apply.count()} apply links`;
});

await check("Search: results for “PVC”", async (page) => {
  await page.goto(root + "pages/en__search.html?q=PVC");
  await settle(page);
  const n = await page.locator("main li a, main article a").count();
  if (!n) throw new Error("no results");
  return `${n} results`;
});

await check("Shop: filter, product gallery, size, cart, checkout, confirmation, Track My Order", async (page) => {
  await page.goto(root + "pages/en__shop__merch.html?series=language-series");
  await settle(page);
  await page.goto(root + "pages/en__shop__p__hoodie-the-nigeria-we-want.html");
  await settle(page);
  const thumbs = await page.locator("[aria-label='Product views'] button").count();
  if (thumbs > 1) await page.locator("[aria-label='Product views'] button").nth(1).click();
  await page.getByRole("radio", { name: /^L$/ }).first().check({ force: true }).catch(async () => page.getByRole("button", { name: /^L$/ }).first().click());
  await page.getByRole("button", { name: /add to cart/i }).first().click();
  await settle(page, 500);
  await page.goto(root + "pages/en__shop__cart.html");
  await page.locator("main").getByText(/Nigeria We Want/).first().waitFor();
  await page.getByRole("link", { name: /checkout/i }).first().click();
  await page.waitForURL(/en__shop__checkout\.html/);
  await settle(page);
  await page.getByLabel("Full name").fill("Ada Okafor");
  await page.getByLabel(/^Mobile number/).fill("08031234567");
  await page.getByRole("button", { name: /continue/i }).last().click();
  await page.getByLabel(/^LGA/).fill("Ikeja");
  await page.getByLabel(/^Town or city/).fill("Ikeja");
  await page.getByLabel(/^Street address/).fill("12 Allen Avenue");
  await page.getByRole("button", { name: /continue/i }).last().click();
  for (let i = 0; i < 4 && !/confirmation/.test(page.url()); i++) {
    if (await page.getByLabel("Card number (TEST)").isVisible().catch(() => false)) {
      await page.getByLabel("Card number (TEST)").fill("4084084084084081");
      await page.getByLabel("Expiry (MM/YY)").fill("12/30");
      await page.getByLabel("CVV").fill("408");
    }
    for (const box of await page.getByRole("checkbox").all()) {
      const lbl = (await box.evaluate((el) => el.closest("label")?.innerText ?? "")) || "";
      if (!/outside Nigeria/i.test(lbl) && !(await box.isChecked())) await box.check().catch(() => {});
    }
    await page.getByRole("button", { name: /continue|pay|place order|review/i }).last().click();
    await settle(page, 2500);
  }
  await page.waitForURL(/confirmation/);
  const num = (await page.locator("main").innerText()).match(/TBH-26-\d{6}/)?.[0];
  if (!num) throw new Error("no order number");
  await page.goto(root + "pages/en__shop__orders.html");
  await page.getByLabel("Order number").fill(num);
  await page.getByLabel("Mobile number used at checkout").fill("08031234567");
  await page.getByRole("button", { name: /track|find|look/i }).first().click();
  await page.locator("main").getByText(new RegExp(num)).first().waitFor();
  return `${thumbs} gallery views; order ${num} placed and tracked`;
});

await check("Join form: validation, then member ID with QR", async (page) => {
  await page.goto(root + "pages/en__join.html");
  await page.getByLabel("Mobile number").fill("08031112233");
  await page.getByRole("button", { name: /continue|next|send/i }).first().click();
  await page.getByLabel(/code sent to/i).fill("123456");
  await page.getByRole("button", { name: /^verify$/i }).click();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Okafor");
  await page.getByLabel("State").selectOption({ label: "Lagos" });
  await page.getByLabel("Local government area (LGA)").fill("Ikeja");
  await page.getByRole("radio", { name: /Bring One/ }).check();
  for (let i = 0; i < 4; i++) {
    if (await page.getByText(/TBH-MBR-/).first().isVisible().catch(() => false)) break;
    for (const box of await page.getByRole("checkbox").all()) if (!(await box.isChecked())) await box.check().catch(() => {});
    await page.locator("main form button[type=submit]").first().click();
    await settle(page, 1500);
  }
  await page.getByText(/TBH-MBR-/).first().waitFor();
});

await check("Demo login → dashboard → 2FA → role switch → dashboard action → sign out", async (page) => {
  await page.goto(root + "pages/en__login.html");
  await page.getByRole("button", { name: /All \d+ roles/ }).first().click();
  await page.waitForURL(/dashboard__/);
  await page.locator("#role-switch").waitFor();
  const roles = await page.locator("#role-switch option").count();
  await page.locator("#role-switch").selectOption("ward-leader");
  await page.waitForURL(/dashboard__ward-leader/);
  await page.getByLabel(/authentication code/i).fill("246810");
  await page.getByRole("button", { name: /^verify$/i }).click();
  await page.locator(".dash-nav a").first().waitFor();
  const sections = await page.locator(".dash-nav a").count();
  await page.locator(".dash-nav a").filter({ hasText: /Approv/ }).first().click();
  await page.waitForURL(/approvals/);
  await page.getByRole("button", { name: /^approve/i }).first().click();
  await settle(page, 600);
  await page.locator(".dash-account").click();
  await page.getByRole("button", { name: /sign out/i }).first().click();
  await settle(page, 1200);
  return `${roles} roles; ward leader has ${sections} sections; approved a task; signed out to ${here(page)}`;
});

for (const [s, n, note] of results) console.log(`${s}  ${n}${note ? "  —  " + note : ""}`);
console.log(`\nFailed file requests: ${failedFiles.size ? [...failedFiles].join(", ") : "none"}`);
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`${results.length - failed}/${results.length} checks passed`);
process.exit(failed || failedFiles.size ? 1 : 0);

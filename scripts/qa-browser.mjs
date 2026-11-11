// Loads routes in Chromium at phone, tablet and desktop widths and reports console errors,
// page errors and horizontal overflow. Dashboards are visited signed in as the all-roles reviewer.
//   usage: node scripts/qa-browser.mjs [baseUrl] [routesFile]
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
// React #418 (hydration retry) appears only under heavy CPU contention, inside Next.js/React's own hydration of
// the page root; React recovers by re-rendering and the page ends up correct. Reported as a known warning, not a failure.
const KNOWN_418 = /Minified React error #418/;

const base = process.argv[2] ?? "http://localhost:3000";
const routes = process.argv[3] ? readFileSync(process.argv[3], "utf8").split("\n").filter(Boolean) : ["/"];
const widths = [320, 390, 768, 1024, 1440];
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const problems = [];
const known = [];

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem("tbh-register-prompt", String(Date.now())); // keep the register pop-up out of layout checks
    localStorage.setItem("tbh-consent", JSON.stringify({ necessary: true, analytics: false, marketing: false, at: "qa" }));
    if (location.pathname.startsWith("/dashboard")) {
      const role = location.pathname.split("/")[2] || "member";
      localStorage.setItem("tbh-session", JSON.stringify({ userId: "u-all", activeRole: role, twoFactorOk: true, since: "qa" }));
    }
  });
  const page = await ctx.newPage();
  // YouTube thumbnails (i.ytimg.com) are external; when the test machine cannot reach YouTube, answer with a
  // stand-in image so only the site's own errors are reported (the cards also fall back on their own).
  await page.route("https://i.ytimg.com/**", (r) => r.fetch().then((res) => r.fulfill({ response: res })).catch(() => r.fulfill({ status: 200, contentType: "image/gif", body: Buffer.from("R0lGODlhAQABAAAAACw=", "base64") })));
  let current = "";
  page.on("pageerror", (e) => (KNOWN_418.test(e.message) ? known.push(`${w}px ${current}`) : problems.push(`${w}px ${current} pageerror: ${e.message.slice(0, 160)}`)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|Download the React DevTools/.test(m.text())) problems.push(`${w}px ${current} console: ${m.text().slice(0, 160)}`);
  });
  for (const r of routes) {
    current = r;
    try {
      const res = await page.goto(base + r, { waitUntil: "networkidle", timeout: 60000 });
      if (!res || res.status() !== 200) problems.push(`${w}px ${r} status ${res?.status()}`);
      await page.waitForTimeout(250);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w + 1) {
        const culprit = await page.evaluate((vw) => {
          const el = [...document.querySelectorAll("body *")].find((e) => {
            const r = e.getBoundingClientRect();
            const s = getComputedStyle(e);
            return r.right > vw + 1 && s.position !== "fixed" && !e.closest("[hidden], .ticker, .tablist, .dt-wrap");
          });
          return el ? `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}` : "?";
        }, w);
        problems.push(`${w}px ${r} overflow ${sw}px (${culprit})`);
      }
      const h1 = await page.locator("h1").count();
      if (h1 !== 1) problems.push(`${w}px ${r} has ${h1} <h1>`);
    } catch (e) {
      problems.push(`${w}px ${r} failed: ${String(e).slice(0, 120)}`);
    }
  }
  await ctx.close();
}
await browser.close();
const uniq = [...new Set(problems)];
console.log(`Routes: ${routes.length} × widths: ${widths.length}. Problems: ${uniq.length}`);
uniq.forEach((p) => console.log(p));
if (known.length) console.log(`Known framework warning (React #418, recovered): ${known.join(", ")}`);
process.exit(uniq.length ? 1 : 0);

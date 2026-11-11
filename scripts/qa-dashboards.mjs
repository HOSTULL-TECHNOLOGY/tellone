// Audits every dashboard section. Failures: wrong H1, runtime error, or the same content as another section
// (a generic placeholder). Notes for a human look: little text or no controls (fine for read-only overviews
// and form-only screens, but worth a glance).
//   usage: node scripts/qa-dashboards.mjs [baseUrl]
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  localStorage.setItem("tbh-consent", JSON.stringify({ necessary: true, at: "qa" }));
  const role = location.pathname.split("/")[2] || "member";
  localStorage.setItem("tbh-session", JSON.stringify({ userId: "u-all", activeRole: role, twoFactorOk: true, since: "qa" }));
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 140)));
await page.goto(base + "/dashboard/member", { waitUntil: "networkidle" });
const roles = await page.locator("#role-switch option").evaluateAll((o) => o.map((x) => x.value)).catch(() => []);
const rows = [];
const seen = new Map();
for (const role of roles) {
  await page.goto(`${base}/dashboard/${role}`, { waitUntil: "networkidle" });
  const nav = await page.locator(".dash-nav a").evaluateAll((a) => a.map((x) => [x.getAttribute("href"), x.textContent.trim()]));
  let ok = 0, bad = [];
  for (const [href, label] of nav) {
    const before = errors.length;
    await page.goto(base + href, { waitUntil: "networkidle" });
    const h1 = (await page.locator("h1").first().innerText()).trim();
    const main = page.locator("main");
    const text = (await main.innerText()).replace(/\s+/g, " ");
    const controls = await main.locator("button, a[href], input, select, textarea").count();
    const sig = text.slice(200, 600);
    const dup = seen.get(sig);
    seen.set(sig, href);
    const issues = [];
    const notes = [];
    if (!label.includes(h1) && !h1.includes(label.replace(/\s*\d+$/, ""))) issues.push(`h1 "${h1}" vs nav "${label}"`);
    if (dup && sig.length > 100) issues.push(`same content as ${dup}`);
    if (errors.length > before) issues.push("runtime error: " + errors.slice(before).join("; "));
    if (text.length < 400) notes.push(`light text (${text.length} chars)`);
    if (controls < 1) notes.push("no controls");
    if (issues.length) bad.push(`✗ ${href}: ${issues.join(", ")}`);
    else {
      ok++;
      if (notes.length) bad.push(`· ${href}: ${notes.join(", ")} (review)`);
    }
  }
  rows.push({ role, sections: nav.length, ok, bad });
}
let total = 0, okTotal = 0;
for (const r of rows) {
  total += r.sections; okTotal += r.ok;
  console.log(`${r.role.padEnd(20)} ${r.ok}/${r.sections} sections OK`);
  r.bad.forEach((x) => console.log("   " + x));
}
console.log(`Roles: ${rows.length}. Sections passing: ${okTotal}/${total}.`);
process.exit(okTotal === total ? 0 : 1);
await b.close();

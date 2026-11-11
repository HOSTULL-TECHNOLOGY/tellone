import { chromium } from "playwright";
const [out, ...pages] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const spec of pages) {
  const [path, w, name, full] = spec.split("|");
  const p = await b.newPage({ viewport: { width: +w, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message.slice(0, 100))); p.on("console", m => m.type() === "error" && errs.push(m.text().slice(0, 100)));
  await p.addInitScript(() => localStorage.setItem("tbh-consent", JSON.stringify({ necessary: true, at: "qa" })));
  await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: full === "full" });
  console.log(name, "scrollW", await p.evaluate(() => document.documentElement.scrollWidth), "errors", errs);
  await p.close();
}
await b.close();

// Crawls every internal link reachable from the homepage (English site + dashboards) and reports
// any URL that does not return 200, with the pages that link to it.
//   usage: node scripts/qa-crawl.mjs [baseUrl]
const base = process.argv[2] ?? "http://localhost:3000";
const seen = new Map(); // url -> status
const referrers = new Map(); // url -> Set(from)
const queue = ["/", "/dashboard", "/sitemap"];
const skip = /^(mailto:|tel:|https?:|data:|javascript:|#)/;
const isAsset = /\.(png|jpe?g|webp|svg|mp3|woff2|css|js|ico|webmanifest|pdf|zip|csv|txt|xml)$/i;

async function visit(path) {
  const res = await fetch(base + path, { redirect: "manual" });
  seen.set(path, res.status);
  if (res.status !== 200 || isAsset.test(path)) return;
  const html = await res.text();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    let h = m[1].replace(/&amp;/g, "&");
    if (skip.test(h) || !h.startsWith("/") || h.startsWith("/_next")) continue;
    h = h.split("#")[0];
    if (!h) continue;
    // English + dashboards only; the other four language folders mirror the same routes
    if (/^\/(pcm|yo|ha|ig)(\/|$)/.test(h)) continue;
    if (!referrers.has(h)) referrers.set(h, new Set());
    referrers.get(h).add(path);
    if (!seen.has(h) && !queue.includes(h)) queue.push(h);
  }
}

let n = 0;
while (queue.length) {
  const batch = queue.splice(0, 8);
  await Promise.all(batch.map((p) => visit(p).catch(() => seen.set(p, "ERR"))));
  n += batch.length;
  if (n % 80 < 8) process.stderr.write(`checked ${n}\n`);
}
const bad = [...seen].filter(([, s]) => s !== 200);
console.log(`Checked ${seen.size} URLs. Broken: ${bad.length}`);
for (const [u, s] of bad) console.log(`${s}  ${u}  <- ${[...(referrers.get(u) ?? [])].slice(0, 3).join(", ")}`);
process.exit(bad.length ? 1 : 0);

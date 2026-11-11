# Static link check of the double-click preview: every href/src in every page resolves to a file.
#   usage: python3 scripts/qa-preview-links.py <TBH-One-Website-Preview folder>
import os, re, sys, collections
root = sys.argv[1]; pages = os.path.join(root, "pages")
names = set(os.listdir(pages))
L = ["pcm", "yo", "ha", "ig", "en", "dashboard"]
def to_file(path):
    path = path.split("#")[0].split("?")[0]
    segs = [s for s in path.split("/") if s]
    if not segs or segs[0] not in L: segs.insert(0, "en")
    return "index.html" if segs == ["en"] else "__".join(segs) + ".html"
HREF = re.compile(r'(?:href|src)="([^"]+)"')
broken = collections.Counter(); where = {}
for n in sorted(names):
    if not n.endswith(".html"): continue
    html = open(os.path.join(pages, n), encoding="utf-8").read()
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S)  # inline RSC data, not links
    for u in set(HREF.findall(html)):
        if u.startswith(("http", "mailto:", "tel:", "data:", "#", "javascript:", "sms:", "whatsapp:")): continue
        if u.startswith("/"):
            ok = to_file(u) in names; key = u
        elif u.startswith("../assets/") or u.startswith("./") or not u.startswith(("/",)):
            target = os.path.normpath(os.path.join(pages, u.split("#")[0].split("?")[0]))
            ok = os.path.exists(target); key = u
        if not ok:
            broken[key] += 1; where.setdefault(key, n)
print("pages scanned:", sum(1 for n in names if n.endswith(".html")))
print("distinct broken targets:", len(broken))
for k, c in broken.most_common(40): print(f"{c:6}  {k}   (e.g. {where[k]})")

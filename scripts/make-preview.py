"""Turn the flat offline export (scripts/build-offline.sh) into the review package:

    TBH-One-Website-Preview/
      index.html     opens the site (hands over to pages/index.html)
      README.txt     how to open and use the preview
      pages/         every page of the site as an .html file
      assets/        scripts, styles, images, logos, audio, fonts

Pages stay together in one folder because the offline link script maps "/shop/merch" to "./en__shop__merch.html".
Asset references ("./brand/...", "./_next/...") are rewritten to "../assets/..." in the pages and in the scripts
(scripts resolve paths against the page, which is always in pages/). Stylesheets keep their paths: they move
together with the images they point to.

usage: python3 -I make-preview.py <flat-offline-folder> <destination-folder>
"""
import os
import re
import shutil
import sys

src, dst = sys.argv[1], sys.argv[2]
ASSET_DIRS = ["_next", "brand", "media", "people", "audio", "fonts", "shop", "photos"]
ASSET_FILES = ["manifest.webmanifest", "robots.txt", "sitemap.xml", "llms.txt"]
REF = re.compile(r'(?<=["\'(\s,=`\\])\./(' + "|".join(ASSET_DIRS) + r')/')
FILE_REF = re.compile(r'(?<=["\'(\s,=`\\])\./(' + "|".join(re.escape(f) for f in ASSET_FILES) + r')')

if os.path.exists(dst):
    shutil.rmtree(dst)
pages = os.path.join(dst, "pages")
assets = os.path.join(dst, "assets")
os.makedirs(pages)
os.makedirs(assets)

def fix(text: str) -> str:
    return FILE_REF.sub(r"../assets/\1", REF.sub(r"../assets/\1/", text))

n_pages = 0
for name in os.listdir(src):
    full = os.path.join(src, name)
    if name.endswith(".html"):
        open(os.path.join(pages, name), "w", encoding="utf-8").write(fix(open(full, encoding="utf-8").read()))
        n_pages += 1
    elif name in ASSET_DIRS:
        shutil.copytree(full, os.path.join(assets, name))
    elif name in ASSET_FILES:
        shutil.copy2(full, os.path.join(assets, name))
    # anything else (e.g. sw.js) is for hosted builds only

n_js = 0
for root, _dirs, files in os.walk(os.path.join(assets, "_next")):
    for f in files:
        if f.endswith(".js"):
            p = os.path.join(root, f)
            text = open(p, encoding="utf-8").read()
            new = fix(text)
            if new != text:
                open(p, "w", encoding="utf-8").write(new)
                n_js += 1

open(os.path.join(dst, "index.html"), "w", encoding="utf-8").write("""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TBH One — website preview</title>
<meta http-equiv="refresh" content="0; url=pages/index.html">
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #e9ebe2; color: #1b1a16;
         font-family: "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { text-align: center; padding: 24px; }
  img { width: 180px; height: auto; }
  a { color: #0f4d02; font-weight: 700; }
</style>
</head>
<body>
<main>
  <img src="assets/brand/tbh-one-logo-360.webp" alt="TBH One">
  <p>Opening the TBH One website preview…</p>
  <p><a href="pages/index.html">Click here if it does not open</a></p>
</main>
<script>location.replace("pages/index.html");</script>
</body>
</html>
""")
shutil.copy2(os.path.join(os.path.dirname(os.path.abspath(__file__)), "preview-README.txt"), os.path.join(dst, "README.txt"))
print(f"pages: {n_pages}, scripts rewritten: {n_js}")

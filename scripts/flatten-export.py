"""Turn a Next.js static export into a flat folder that works from file:// (double-click index.html).

- Every page becomes one file in the top folder: /en/shop/merch.html -> en__shop__merch.html,
  /en.html -> index.html. Links are mapped at click time by the FileModeShim script.
- Root-relative asset paths ("/_next/...", "/brand/...") become "./..." so they resolve next to the page.
- Stylesheets live three folders deep (_next/static/css), so their font urls become "../../../fonts/...".

usage: python3 -I flatten-export.py <next-out-dir> <destination-dir>
"""
import os
import base64
import re
import shutil
import sys

src, dst = sys.argv[1], sys.argv[2]
ASSET_DIRS = "_next|brand|people|audio|fonts|photos"
# A root-relative asset path preceded by a quote, escaped quote, bracket, comma or whitespace.
ASSET = re.compile(r'(?<=["\'(\s,=])/(' + ASSET_DIRS + r')/')
ESCAPED = re.compile(r'(\\")/(' + ASSET_DIRS + r')/')
# /shop/ and /media/ are both page routes (/shop/cart, /media/tv) and asset folders (product photos, posters),
# so only files there (with an extension) are assets; "/media/gallery" stays a page link.
DUAL_FILE = re.compile(r'(?<=["\'(\s,=`])/(shop|media)/([\w.-]+\.(?:webp|jpe?g|png|gif|svg|mp4|webm|mp3|pdf))')
# Code also builds poster paths at run time ("/media/poster-" + lang + ".jpg"), so for /media/ everything that is
# not a Media Hub page is an asset. The page names are read from the export itself, so the list never goes stale.
MEDIA_PAGES = sorted(f[:-5] for f in os.listdir(os.path.join(src, "en", "media")) if f.endswith(".html")) if os.path.isdir(os.path.join(src, "en", "media")) else []
MEDIA_ASSET = re.compile(r'(?<=["\'(\s,=`])/media/(?!(?:' + "|".join(map(re.escape, MEDIA_PAGES)) + r')(?![\w.-]))') if MEDIA_PAGES else re.compile(r'(?<=["\'(\s,=`])/media/')
OTHER_FILES = re.compile(r'(?<=["\'(])/(manifest\.webmanifest|robots\.txt|sitemap\.xml|llms\.txt)')

if os.path.exists(dst):
    shutil.rmtree(dst)
os.makedirs(dst)

def flat_name(rel: str) -> str:
    rel = rel[:-5]  # strip .html
    parts = [p for p in rel.split(os.sep) if p]
    if parts == ["en"]:
        return "index.html"
    if parts == ["index"]:  # Next's own root index (unused: middleware is removed in export)
        return "_root.html"
    return "__".join(parts) + ".html"

pages = 0
for root, _dirs, files in os.walk(src):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, src)
        if f.endswith(".html"):
            text = open(full, encoding="utf-8").read()
            text = re.sub(r'<link rel="preload" href="/fonts/[^>]*/>', "", text)  # fonts are embedded in the CSS
            text = ASSET.sub(r"./\1/", text)
            text = ESCAPED.sub(r"\1./\2/", text)
            text = OTHER_FILES.sub(r"./\1", text)
            text = DUAL_FILE.sub(r"./\1/\2", text)
            text = MEDIA_ASSET.sub("./media/", text)
            out = os.path.join(dst, flat_name(rel))
            open(out, "w", encoding="utf-8").write(text)
            pages += 1
            continue
        if f.endswith(".txt") and not rel.startswith(("robots", "llms")):
            continue  # RSC payloads are only used for client-side navigation, which the shim replaces
        out = os.path.join(dst, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if rel.startswith(os.path.join("_next", "static")) and f.endswith((".js", ".css")):
            text = open(full, encoding="utf-8").read()
            if f.endswith(".css"):
                # Browsers refuse font files loaded from file:// (CORS "null" origin), so fonts are embedded.
                def embed_font(m):
                    path = os.path.join(src, "fonts", m.group(2))
                    data = base64.b64encode(open(path, "rb").read()).decode()
                    return f"url(data:font/woff2;base64,{data})"
                text = re.sub(r'url\((["\']?)/fonts/([^)"\']+\.woff2)\1\)', embed_font, text)
                text = re.sub(r'url\((["\']?)/(brand|media|people|photos)/', r'url(\1../../../\2/', text)
            else:
                text = re.sub(r'(["\'`])/(brand|people|audio|fonts|photos)/', r'\1./\2/', text)
                text = DUAL_FILE.sub(r"./\1/\2", text)
                text = MEDIA_ASSET.sub("./media/", text)
                text = text.replace('"/_next/"', '"./_next/"')
            open(out, "w", encoding="utf-8").write(text)
        else:
            shutil.copy2(full, out)

# The 404 page doubles as the fallback for unknown links
if os.path.exists(os.path.join(dst, "404.html")):
    pass
print(f"pages: {pages}")

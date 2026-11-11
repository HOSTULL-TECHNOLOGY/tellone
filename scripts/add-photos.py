"""Add photos of people to the site: resizes each image into public/photos/ (480 and 960 px WebP, plus a JPG
fallback) and prints the entries to paste into src/data/photos.ts.

    python3 scripts/add-photos.py path/to/folder-of-photos [--credit "Photo: TBH One Lagos team"]

Needs Pillow (pip install pillow). Use only photos the campaign owns or has licensed, with consent from
identifiable people. Write each photo's alt text yourself afterwards, describing who and where (the script
fills in a reminder).
"""
import json
import os
import re
import sys

from PIL import Image, ImageOps

if len(sys.argv) < 2:
    sys.exit(__doc__)
src = sys.argv[1]
credit = sys.argv[sys.argv.index("--credit") + 1] if "--credit" in sys.argv else None
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, "public", "photos")
os.makedirs(out, exist_ok=True)

entries = []
for name in sorted(os.listdir(src)):
    if not name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        continue
    slug = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(name)[0].lower()).strip("-")
    im = ImageOps.exif_transpose(Image.open(os.path.join(src, name))).convert("RGB")
    for w in (480, 960):
        r = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(os.path.join(out, f"{slug}-{w}.webp"), quality=80, method=6)
    big = im if im.width <= 1600 else im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    big.save(os.path.join(out, f"{slug}.jpg"), quality=82, optimize=True, progressive=True)
    entry = {"base": f"/photos/{slug}", "alt": "TODO: describe who and where", "ratio": round(im.width / im.height, 3)}
    if credit:
        entry["credit"] = credit
    entries.append(entry)
    print(f"  added {slug}  ({im.width}x{im.height})", file=sys.stderr)

print("\n// Paste into peoplePhotos in src/data/photos.ts, then write the alt text:")
for e in entries:
    print("  " + json.dumps(e, ensure_ascii=False) + ",")

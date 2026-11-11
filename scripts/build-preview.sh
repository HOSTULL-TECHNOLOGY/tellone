#!/bin/bash
# Builds the double-click review package TBH-One-Website-Preview/ (index.html + pages/ + assets/ + README.txt).
#   usage: scripts/build-preview.sh [output-folder]      (default: ../TBH-One-Website-Preview)
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$SRC/../TBH-One-Website-Preview}"
FLAT="$(mktemp -d)"
bash "$SRC/scripts/build-offline.sh" "$FLAT/site"
python3 -I "$SRC/scripts/make-preview.py" "$FLAT/site" "$OUT"
rm -rf "$FLAT"
echo "Preview written to $OUT (open index.html)"

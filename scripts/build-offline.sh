#!/bin/bash
# Builds the offline prototype folder: every page as a flat .html file that opens by double-click,
# no server needed. Builds in a scratch copy so a running dev server is never disturbed.
#   usage: scripts/build-offline.sh [output-folder]
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$SRC/../tbh-one-website}"
WORK="${TBH_EXPORT_WORK:-/tmp/tbh-export-work}"

rm -rf "$WORK" && mkdir -p "$WORK"
( cd "$SRC" && tar --exclude=./node_modules --exclude=./.next --exclude=./out --exclude=./screenshots \
    --exclude=./preview --exclude=./_src --exclude=./.git -cf - . ) | ( cd "$WORK" && tar -xf - )
ln -s "$SRC/node_modules" "$WORK/node_modules"

# Server-only features have no place in a static folder: the client already falls back to in-browser demo logic.
rm -f "$WORK/src/middleware.ts"
rm -rf "$WORK/src/app/api"

( cd "$WORK" && STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_FILE=1 NEXT_TELEMETRY_DISABLED=1 npx next build )

python3 -I "$SRC/scripts/flatten-export.py" "$WORK/out" "$OUT"
echo "Offline site written to $OUT"

"use client";

/**
 * Programmatic navigation that works both on the server-hosted site and in the
 * offline "open index.html" export. Always use this instead of router.push().
 */
export const STATIC_FILE = process.env.NEXT_PUBLIC_STATIC_FILE === "1";

/** "/shop/merch" → "en__shop__merch.html" in the file export (all pages live in one folder). */
export function toFileHref(path: string): string {
  const [pathAndQuery, hash = ""] = path.split("#");
  const [p, query = ""] = pathAndQuery.split("?");
  const segs = p.split("/").filter(Boolean);
  if (!["pcm", "yo", "ha", "ig", "en", "dashboard"].includes(segs[0] ?? "")) segs.unshift("en");
  const name = segs.length === 1 && segs[0] === "en" ? "index" : segs.join("__");
  return `./${name}.html${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function go(path: string) {
  if (typeof window === "undefined") return;
  window.location.href = STATIC_FILE ? toFileHref(path) : path;
}

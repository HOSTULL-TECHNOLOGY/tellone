"use client";

import { useEffect } from "react";

/** Registers /sw.js on production builds served over http(s); never in development or the offline file build. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_STATIC_FILE === "1") return;
    if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}

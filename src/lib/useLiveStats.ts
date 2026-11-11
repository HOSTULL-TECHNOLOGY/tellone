"use client";

import { useEffect, useState } from "react";
import { demoStats, type LiveStats } from "./stats";
import { DEMO_MODE } from "@/config/site";

// One shared poller for the ticker, the home page block and the footer band.
let current: LiveStats | null = null;
let timer: number | null = null;
const subs = new Set<(s: LiveStats | null) => void>();

async function load() {
  if (DEMO_MODE) {
    // Prototype: same demo generator as /api/stats, computed in the browser so the offline export works.
    current = demoStats();
    subs.forEach((f) => f(current));
    return;
  }
  try {
    const res = await fetch("/api/stats", { cache: "no-store" });
    current = res.ok ? ((await res.json()) as LiveStats) : null;
  } catch {
    // keep the last good value when offline
  }
  subs.forEach((f) => f(current));
}

/** Refreshes every 60 seconds (WEB-2). Returns null until data arrives or if live data is not connected. */
export function useLiveStats(): LiveStats | null {
  const [s, setS] = useState<LiveStats | null>(current);
  useEffect(() => {
    subs.add(setS);
    if (timer === null) {
      load();
      timer = window.setInterval(load, 60_000);
    } else setS(current);
    return () => {
      subs.delete(setS);
      if (subs.size === 0 && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return s;
}

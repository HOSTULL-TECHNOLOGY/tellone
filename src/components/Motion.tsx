"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TARGETS = [
  "main .section-head",
  "main .page-head h1",
  "main .card",
  "main .panel",
  "main .tbh-card",
  "main .ben-list li",
  "main .lead-card",
  "main .pcar-card",
  "main .cand",
  "main .people-grid li",
  "main .photo-figure",
  "main .ev",
  "main .news-card",
  "main .prod",
  "main .story-card",
  "main .app-figure",
  "main .reach-tile",
].join(",");

/**
 * Scroll reveal: elements below the fold fade and rise into place as they appear, staggered among siblings.
 * Anything already on screen when the page loads is left alone, so nothing flickers. Off for reduced motion.
 */
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("rv-in");
          io.unobserve(el);
          // Once revealed, drop the classes so hover effects keep their own (fast) transitions
          const delay = parseInt(el.style.getPropertyValue("--rv-delay") || "0", 10);
          window.setTimeout(() => el.classList.remove("rv", "rv-in"), 650 + delay);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
      if (el.classList.contains("rv")) return;
      if (el.getBoundingClientRect().top < vh) return; // already visible: no animation
      const i = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.setProperty("--rv-delay", `${Math.min(i, 6) * 70}ms`);
      el.classList.add("rv");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

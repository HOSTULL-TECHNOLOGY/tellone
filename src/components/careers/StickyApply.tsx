"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Mobile: a sticky "Register Free and Apply" button throughout the page once the hero buttons are out of view. */
export function StickyApply({ href, label }: { href: string; label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".cw-hero .cw-ctas");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`cw-sticky${show ? " is-on" : ""}`} aria-hidden={!show}>
      <Link href={href} className="btn btn-lg cw-btn-primary" tabIndex={show ? 0 : -1}>
        {label}
      </Link>
    </div>
  );
}

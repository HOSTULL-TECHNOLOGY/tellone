"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Sticky strip (appears on scroll, once the hero buttons are out of view): "8,809 wards. One leader each. 5,655 still
 * need one. · Register Free and Apply". On phones the button keeps the full width so it stays easy to tap.
 */
export function StickyApply({ href, label, text }: { href: string; label: string; text: string }) {
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
      <div className="cw-sticky-in">
        <p className="cw-sticky-text">{text}</p>
        <Link href={href} className="btn cw-sticky-btn" tabIndex={show ? 0 : -1}>
          {label}
        </Link>
      </div>
    </div>
  );
}

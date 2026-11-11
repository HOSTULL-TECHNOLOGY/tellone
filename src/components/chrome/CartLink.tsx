"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CART_EVENT, PREF, readPref } from "@/lib/prefs";

export function cartCount(): number {
  try {
    const lines = JSON.parse(readPref(PREF.cart) ?? "[]") as { qty: number }[];
    return lines.reduce((n, l) => n + (Number(l.qty) || 0), 0);
  } catch {
    return 0;
  }
}

/** Cart icon with a live item count, on every page (Revised Website Menu, Top Bar). */
export function CartLink({ to, label, itemsLabel, className = "topbar-btn" }: { to: string; label: string; itemsLabel: string; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(cartCount());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return (
    <Link href={to} className={className} aria-label={`${label}, ${n} ${itemsLabel}`}>
      <ShoppingBag size={18} aria-hidden />
      <span className="cart-count" aria-hidden data-empty={n === 0 ? "true" : undefined}>
        {n}
      </span>
    </Link>
  );
}

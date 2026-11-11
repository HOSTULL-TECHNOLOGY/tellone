"use client";

import { CART_EVENT, PREF, readPref, writePref } from "./prefs";

/** `price` is the public unit price; member pricing and discounts are applied at display time (see shop-pricing). */
export type CartLine = { slug: string; name: string; price: number; qty: number; variant?: string; size?: string; colour?: string };

export const lineKey = (l: CartLine) => `${l.slug}|${l.size ?? ""}|${l.colour ?? ""}|${l.variant ?? ""}`;

export function readCart(): CartLine[] {
  try {
    const v = JSON.parse(readPref(PREF.cart) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  writePref(PREF.cart, JSON.stringify(lines));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(line: CartLine) {
  const lines = readCart();
  const found = lines.find((l) => lineKey(l) === lineKey(line));
  if (found) found.qty += line.qty;
  else lines.push(line);
  writeCart(lines);
}

export function setLineQty(key: string, qty: number) {
  writeCart(readCart().map((l) => (lineKey(l) === key ? { ...l, qty: Math.max(1, Math.min(999, Math.round(qty))) } : l)));
}

export function removeLine(key: string) {
  writeCart(readCart().filter((l) => lineKey(l) !== key));
}

export function clearCart() {
  writeCart([]);
}

const COUPON_KEY = "tbh-cart-coupon";
export const readCartCoupon = () => readPref(COUPON_KEY);
export const writeCartCoupon = (code: string | null) => writePref(COUPON_KEY, code);

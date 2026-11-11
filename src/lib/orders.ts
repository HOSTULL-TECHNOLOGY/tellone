"use client";

import type { OrderState } from "@/data/shop";
import { readPref, writePref } from "./prefs";

/**
 * Shop orders — PROTOTYPE store in localStorage, shared by checkout, Track My Order,
 * the Shopper dashboard, Shop Operations and Delivery Partner screens.
 * Production: orders live in the commerce engine / finance ledger (EC-15) and update from
 * payment and courier webhooks.
 */
export type OrderLine = { slug: string; name: string; unitPrice: number; qty: number; size?: string; colour?: string };
export type Order = {
  number: string; // e.g. TBH-26-104233
  createdAt: string;
  buyer: { name: string; phone: string; email?: string; userId?: string };
  delivery: { method: "courier" | "pickup"; zone: string; state: string; lga?: string; address?: string; pickupPoint?: string; fee: number; estimate: string };
  lines: OrderLine[];
  coupon?: string;
  subtotal: number;
  discount: number;
  vat: number; // VAT included in prices, shown for the receipt (EC-13)
  total: number;
  payment: { method: "card" | "transfer" | "ussd"; status: "Paid (simulated)" | "Held for review" | "Refunded"; reference: string };
  state: OrderState;
  history: { state: OrderState; at: string; note?: string }[];
  dispatchFrom?: string; // EC-25: orders after the cut-off dispatch from 17 Jan 2027
  courier?: string;
  tracking?: string;
};

const KEY = "tbh-orders";
export const ORDERS_EVENT = "tbh:orders";

export function readOrders(): Order[] {
  try {
    const v = JSON.parse(readPref(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function saveOrder(o: Order) {
  const all = readOrders().filter((x) => x.number !== o.number);
  writePref(KEY, JSON.stringify([o, ...all]));
  window.dispatchEvent(new Event(ORDERS_EVENT));
}
export const findOrder = (number: string) => readOrders().find((o) => o.number.toUpperCase() === number.trim().toUpperCase());
export function newOrderNumber() {
  return `TBH-26-${String(Math.floor(100000 + Math.random() * 900000))}`;
}

/** Prototype: move an order to its next EC-17 state (used by "Simulate next status"). */
export function advanceOrder(number: string): Order | undefined {
  const o = findOrder(number);
  if (!o) return undefined;
  const flow = ["Paid", "Sent to vendor", "Packed", "Dispatched", "Out for delivery", "Delivered"] as const;
  const i = flow.indexOf(o.state as (typeof flow)[number]);
  if (i < 0 || i >= flow.length - 1) return o;
  const next = flow[i + 1];
  const at = new Date().toISOString();
  const updated: Order = {
    ...o,
    state: next,
    history: [...o.history, { state: next, at }],
    ...(next === "Dispatched" ? { courier: "Courier partner (demo)", tracking: `TRK${o.number.slice(-6)}NG` } : {}),
  };
  saveOrder(updated);
  return updated;
}

/** EC-22: returns within 7 days of delivery for wrong size or damaged items. */
export function canReturn(o: Order, now = new Date()) {
  if (o.state !== "Delivered") return false;
  const delivered = [...o.history].reverse().find((h) => h.state === "Delivered");
  return !!delivered && now.getTime() - new Date(delivered.at).getTime() <= 7 * 86_400_000;
}

export function requestReturn(number: string, reason: string): Order | undefined {
  const o = findOrder(number);
  if (!o || !canReturn(o)) return undefined;
  const updated: Order = { ...o, state: "Return requested", history: [...o.history, { state: "Return requested", at: new Date().toISOString(), note: reason }] };
  saveOrder(updated);
  return updated;
}

/** Orders that belong to a signed-in user (by user id or phone). */
export const ordersFor = (userId?: string, phone?: string) =>
  readOrders().filter((o) => (userId && o.buyer.userId === userId) || (phone && o.buyer.phone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-10))));

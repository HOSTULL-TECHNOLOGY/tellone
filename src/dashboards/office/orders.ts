"use client";

import { useCallback, useEffect, useState } from "react";
import { readPref, writePref } from "@/lib/prefs";
import { ORDERS_EVENT, readOrders, saveOrder, type Order } from "@/lib/orders";
import { buildDemoOrders } from "@/data/mock/backoffice";

const SEEDED = "tbh-ofc-shop-seeded";

/**
 * Every order in the shared prototype store (real checkouts + clearly-numbered DEMO orders, seeded once),
 * live-updated when another screen or tab changes an order.
 */
export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(() => setOrders(readOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt))), []);
  useEffect(() => {
    if (!readPref(SEEDED)) {
      const have = new Set(readOrders().map((o) => o.number));
      buildDemoOrders()
        .filter((o) => !have.has(o.number))
        .reverse()
        .forEach(saveOrder);
      writePref(SEEDED, "1");
    }
    refresh();
    setReady(true);
    window.addEventListener(ORDERS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ORDERS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);
  return { orders, ready };
}

/** Move an order to a state with a history note (saves to the shared store and notifies other screens). */
export function setOrderState(o: Order, state: Order["state"], note?: string, patch: Partial<Order> = {}) {
  const updated: Order = { ...o, ...patch, state, history: [...o.history, { state, at: new Date().toISOString(), ...(note ? { note } : {}) }] };
  saveOrder(updated);
  return updated;
}

export const itemsIn = (o: Order) => o.lines.reduce((n, l) => n + l.qty, 0);
export const isDemoOrder = (o: Order) => o.number.startsWith("DEMO-");

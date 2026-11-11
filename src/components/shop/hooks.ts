"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth";
import { CART_EVENT } from "@/lib/prefs";
import { readCart, readCartCoupon, type CartLine } from "@/lib/cart";
import { ORDERS_EVENT, readOrders, type Order } from "@/lib/orders";
import { campaignDates, DEMO_MODE } from "@/config/site";

/** EC-6: signed-in members see member prices automatically. */
export function useMember() {
  const { ready, user } = useSession();
  return { ready, user, isMember: !!user?.roles.includes("member") };
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setLines(readCart());
      setCoupon(readCartCoupon());
      setReady(true);
    };
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { lines, coupon, setCoupon, ready };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const sync = () => setOrders(readOrders());
    sync();
    window.addEventListener(ORDERS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ORDERS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return orders;
}

/**
 * EC-25 campaign cut-off. Reviewers can preview it with ?phase=cutoff (demo mode only).
 * Returns null until mounted so server HTML shows the normal campaign state.
 */
export function useShopPhase() {
  const [phase, setPhase] = useState<{ promos: boolean; held: boolean } | null>(null);
  useEffect(() => {
    const forced = DEMO_MODE ? new URLSearchParams(window.location.search).get("phase") : null;
    const now = forced === "cutoff" ? new Date(campaignDates.campaignCutoff.getTime() + 60_000) : forced === "post-election" ? campaignDates.postElection : new Date();
    setPhase({ promos: now < campaignDates.campaignCutoff, held: now >= campaignDates.campaignCutoff && now < campaignDates.shopDispatchResumes });
  }, []);
  return phase;
}

/** Read a query parameter after mount (static export safe — no useSearchParams). */
export function useQueryParam(name: string) {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => setV(new URLSearchParams(window.location.search).get(name)), [name]);
  return v;
}

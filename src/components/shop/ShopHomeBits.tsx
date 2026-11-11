"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { coupons, products } from "@/data/shop";
import { states } from "@/data/states";
import { href, type Locale } from "@/lib/i18n";
import { useMember, useShopPhase } from "./hooks";
import { ProductCard } from "./ProductBits";

/** EC-3 "popular in your state". Defaults to the signed-in member's state. */
export function PopularInState({ locale }: { locale: Locale }) {
  const { user } = useMember();
  const [state, setState] = useState("Lagos");
  useEffect(() => {
    if (user?.state) setState(user.state);
  }, [user]);
  const list = products.filter((p) => p.popularIn?.includes(state));
  const shown = (list.length ? list : products.filter((p) => p.bestSeller)).slice(0, 4);
  return (
    <div>
      <div className="popular-bar">
        <label htmlFor="pop-state">Popular in</label>
        <select id="pop-state" className="input" value={state} onChange={(e) => setState(e.target.value)}>
          {states.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        {!list.length && <span className="small muted">Not enough orders from {state} yet — showing national best sellers.</span>}
      </div>
      <div className="shop-grid-full">
        {shown.map((p) => (
          <ProductCard key={p.slug} p={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}

/** This week's member coupon; hidden after the campaign cut-off (EC-25). */
export function CouponTeaser({ locale }: { locale: Locale }) {
  const phase = useShopPhase();
  const { isMember } = useMember();
  if (phase && !phase.promos) return null;
  const c = coupons[0];
  return (
    <div className="shop-extras">
      <div className="coupon">
        <Tag size={20} aria-hidden />
        <div>
          <p className="small muted">This week&apos;s member coupon</p>
          <p>
            {isMember ? <code>{c.code}</code> : <span className="muted">Sign in to see the code</span>} — {c.label}
          </p>
        </div>
      </div>
      <Link href={href(locale, "/shop/coupons")} className="btn btn-outline">
        All member coupons
      </Link>
    </div>
  );
}

/** Wraps promotional blocks so they disappear after the cut-off. */
export function PromoOnly({ children }: { children: React.ReactNode }) {
  const phase = useShopPhase();
  if (phase && !phase.promos) return null;
  return <>{children}</>;
}

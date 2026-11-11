"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Store } from "lucide-react";
import { memberPrice, type Product } from "@/data/shop";
import { formatNaira } from "@/lib/format";
import { href, stripLocale, type Locale } from "@/lib/i18n";
import { ProductMedia } from "./ProductPhoto";
import { useMember, useShopPhase } from "./hooks";

/** Public price plus member price; signed-in members get the member price highlighted (EC-6). */
export function PriceTag({ price, size = "md" }: { price: number; size?: "md" | "lg" }) {
  const { isMember } = useMember();
  const mp = memberPrice(price);
  return (
    <p className={`price-tag price-${size}${isMember ? " is-member" : ""}`}>
      {isMember ? (
        <>
          <span className="price-now">{formatNaira(mp)}</span>
          <span className="price-was">
            <s>{formatNaira(price)}</s> <span className="price-badge">Member price</span>
          </span>
        </>
      ) : (
        <>
          <span className="price-now">{formatNaira(price)}</span>
          <span className="price-member">Members pay {formatNaira(mp)}</span>
        </>
      )}
    </p>
  );
}

export function stockLabel(p: Product) {
  if (p.stock <= 0) return { tone: "danger" as const, text: "Out of stock" };
  if (p.lowStockAt && p.stock <= p.lowStockAt) return { tone: "warn" as const, text: `Low stock — ${p.stock} left` };
  return { tone: "ok" as const, text: "In stock" };
}

export function ProductCard({ p, locale, headingLevel = 3 }: { p: Product; locale: Locale; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const st = stockLabel(p);
  return (
    <article className="shop-card">
      <Link href={href(locale, `/shop/p/${p.slug}`)} className="shop-card-img" aria-label={p.name} tabIndex={-1}>
        <ProductMedia p={p} decorative />
        {p.bestSeller && <span className="shop-flag">Best seller</span>}
      </Link>
      <div className="shop-card-body">
        <p className="shop-card-cat">
          {p.category}
          {p.series && <span className="shop-card-series"> · {p.series}</span>}
        </p>
        <H className="shop-card-title">
          <Link href={href(locale, `/shop/p/${p.slug}`)}>{p.name}</Link>
        </H>
        <PriceTag price={p.price} />
        <span className={`badge badge-${st.tone}`}>{st.text}</span>
      </div>
    </article>
  );
}

/** EC-25: banner after the campaign cut-off. */
export function ShopPhaseBanner() {
  const phase = useShopPhase();
  if (!phase || phase.promos) return null;
  return (
    <div className="shop-phase" role="status">
      <Clock size={18} aria-hidden />
      <p>
        <strong>Campaign promotions have ended.</strong> {phase.held ? "You can still order — new orders dispatch from Sunday 17 January 2027." : "Orders are dispatching as normal."} Coupons and banners are switched off.
      </p>
    </div>
  );
}

/** Small sub-navigation shared by all shop pages. */
export function ShopNav({ locale }: { locale: Locale }) {
  const current = stripLocale(usePathname() ?? "/shop").replace(/\/$/, "") || "/shop";
  const items = [
    ["/shop", "Shop home"],
    ["/shop/merch", "Merch"],
    ["/shop/bulk", "Bulk & ward packs"],
    ["/shop/custom", "Custom designs"],
    ["/shop/coupons", "Member coupons"],
    ["/shop/offers", "Partner offers"],
    ["/shop/orders", "Track my order"],
    ["/shop/delivery-returns", "Delivery & returns"],
    ["/shop/cart", "Cart"],
  ];
  return (
    <nav className="shop-nav" aria-label="Shop">
      <div className="container shop-nav-row">
        <Store size={18} aria-hidden className="shop-nav-icon" />
        <ul role="list">
          {items.map(([p, l]) => (
            <li key={p}>
              <Link href={href(locale, p)} aria-current={current === p ? "page" : undefined}>
                {l}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function DemoPricesNote() {
  return (
    <p className="proto-note">
      <span className="chip chip-demo">Demo data</span> Products, prices and stock are samples until the Merch lead approves the catalogue.
    </p>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { FREE_DELIVERY_FROM, productBySlug } from "@/data/shop";
import { states } from "@/data/states";
import { lineKey, removeLine, setLineQty, writeCartCoupon } from "@/lib/cart";
import { href, type Locale } from "@/lib/i18n";
import { formatNaira } from "@/lib/format";
import { computeTotals, zoneFor, type Totals } from "@/lib/shop-pricing";
import { ConfirmDialog } from "@/components/ui/Interactive";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import { useCart, useMember, useShopPhase } from "./hooks";
import { ProductArt } from "./ProductArt";
import { ProductMedia } from "./ProductPhoto";
import { QtyStepper } from "./BuyBox";

/** Order summary used by the cart, checkout and confirmation pages. */
export function SummaryLines({ t, deliveryLabel }: { t: Totals; deliveryLabel?: string }) {
  return (
    <dl className="summary">
      <div>
        <dt>Items ({t.qty})</dt>
        <dd>{formatNaira(t.publicSubtotal)}</dd>
      </div>
      {t.memberSaving > 0 && (
        <div className="summary-save">
          <dt>Member price saving</dt>
          <dd>−{formatNaira(t.memberSaving)}</dd>
        </div>
      )}
      {t.bulkDiscount > 0 && (
        <div className="summary-save">
          <dt>Bulk discount ({Math.round(t.bulkRate * 100)}% on {t.bulkQty} items)</dt>
          <dd>−{formatNaira(t.bulkDiscount)}</dd>
        </div>
      )}
      {t.couponDiscount > 0 && t.coupon && (
        <div className="summary-save">
          <dt>Coupon {t.coupon.code}</dt>
          <dd>−{formatNaira(t.couponDiscount)}</dd>
        </div>
      )}
      <div>
        <dt>Delivery{deliveryLabel ? ` (${deliveryLabel})` : ""}</dt>
        <dd>{deliveryLabel === undefined ? "Calculated at checkout" : t.delivery === 0 ? "Free" : formatNaira(t.delivery)}</dd>
      </div>
      <div className="summary-total">
        <dt>Total</dt>
        <dd>{formatNaira(t.total)}</dd>
      </div>
      <div className="summary-vat">
        <dt>Includes VAT (7.5%)</dt>
        <dd>{formatNaira(t.vat)}</dd>
      </div>
    </dl>
  );
}

export function CouponBox({ code, error, onApply, onRemove, disabled }: { code: string | null; error?: string; onApply: (c: string) => void; onRemove: () => void; disabled?: boolean }) {
  const [v, setV] = useState("");
  if (disabled) return <p className="small muted">Coupons are switched off after the campaign cut-off.</p>;
  if (code && !error)
    return (
      <div className="coupon-applied">
        <Tag size={16} aria-hidden />
        <span>
          Coupon <strong>{code}</strong> applied
        </span>
        <button type="button" className="icon-btn" onClick={onRemove} aria-label={`Remove coupon ${code}`}>
          <X size={16} aria-hidden />
        </button>
      </div>
    );
  return (
    <form
      className="coupon-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (v.trim()) onApply(v.trim().toUpperCase());
      }}
    >
      <div className="field">
        <label htmlFor="coupon-in">Coupon code</label>
        <div className="coupon-row">
          <input id="coupon-in" className="input" value={v} onChange={(e) => setV(e.target.value)} placeholder="e.g. TBHWEEK1" autoCapitalize="characters" aria-invalid={!!error} aria-describedby={error ? "coupon-err" : "coupon-hint"} />
          <button type="submit" className="btn btn-outline">
            Apply
          </button>
        </div>
        <p id="coupon-hint" className="field-hint">
          One coupon per order, on top of the member price.
        </p>
        {error && (
          <p id="coupon-err" className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

export function CartView({ locale }: { locale: Locale }) {
  const { lines, coupon, setCoupon, ready } = useCart();
  const { isMember, ready: sReady } = useMember();
  const phase = useShopPhase();
  const promos = phase?.promos ?? true;
  const [state, setState] = useState("Lagos");
  const [removing, setRemoving] = useState<string | null>(null);
  const toast = useToast();
  const totals = computeTotals(lines, { member: isMember, couponCode: promos ? coupon : null });
  const zone = zoneFor(state, true);
  const estimate = totals.goods >= FREE_DELIVERY_FROM || totals.coupon?.type === "free-delivery" ? 0 : zone.fee;

  if (!ready || !sReady) return <div className="cart-loading" aria-busy="true" />;
  if (!lines.length)
    return (
      <EmptyState
        icon={<ShoppingBag size={32} aria-hidden />}
        title="Your cart is empty"
        text="Browse official merch — members see member prices automatically."
        action={
          <Link href={href(locale, "/shop/merch")} className="btn btn-primary">
            Shop merch
          </Link>
        }
      />
    );

  const removingLine = lines.find((l) => lineKey(l) === removing);
  return (
    <div className="split cart">
      <div className="cart-lines">
        {!isMember && (
          <Notice tone="info" title="Members pay 10% less">
            <Link href={href(locale, `/login?next=${encodeURIComponent("/shop/cart")}`)}>Sign in</Link> or <Link href={href(locale, "/join")}>join free</Link> to see member prices.
          </Notice>
        )}
        <ul role="list" className="cart-list">
          {totals.lines.map((l) => {
            const p = productBySlug(l.slug);
            const key = lineKey(l);
            return (
              <li key={key} className="cart-line">
                <Link href={href(locale, `/shop/p/${l.slug}`)} className="cart-thumb" tabIndex={-1} aria-hidden>
                  {p ? <ProductMedia p={p} size={56} label={false} sizes="64px" decorative /> : <ProductArt category="T-shirts" size={56} label={false} />}
                </Link>
                <div className="cart-line-main">
                  <p className="cart-line-name">
                    <Link href={href(locale, `/shop/p/${l.slug}`)}>{l.name}</Link>
                  </p>
                  <p className="small muted">
                    {[l.size && `Size ${l.size}`, l.colour, l.variant].filter(Boolean).join(" · ") || p?.category}
                  </p>
                  <p className="small">
                    {formatNaira(l.unit)} each{isMember && <span className="muted"> (member price)</span>}
                  </p>
                </div>
                <QtyStepper value={l.qty} onChange={(n) => setLineQty(key, n)} label={`Quantity of ${l.name}`} max={Math.max(1, p?.stock ?? 999)} />
                <p className="cart-line-total">{formatNaira(l.lineTotal)}</p>
                <button type="button" className="icon-btn cart-remove" onClick={() => setRemoving(key)} aria-label={`Remove ${l.name}`}>
                  <Trash2 size={18} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
        {totals.bulkQty > 0 && totals.bulkQty < 50 && (
          <p className="small muted">
            Add {50 - totals.bulkQty} more items to unlock 15% bulk pricing. <Link href={href(locale, "/shop/bulk")}>How bulk pricing works</Link>
          </p>
        )}
      </div>
      <aside className="cart-side sticky-side" aria-label="Order summary">
        <div className="form-panel">
          <h2 className="cart-side-title">Order summary</h2>
          <CouponBox
            code={coupon}
            error={totals.couponError}
            disabled={!promos}
            onApply={(c) => {
              writeCartCoupon(c);
              setCoupon(c);
              const check = computeTotals(lines, { member: isMember, couponCode: c });
              if (!check.couponError) toast(`Coupon ${c} applied`);
            }}
            onRemove={() => {
              writeCartCoupon(null);
              setCoupon(null);
            }}
          />
          <div className="field">
            <label htmlFor="cart-state">Estimate delivery to</label>
            <select id="cart-state" className="input" value={state} onChange={(e) => setState(e.target.value)}>
              {states.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="field-hint">
              {zone.days} to {state === "Lagos" || state === "FCT" ? state : `${state}'s capital`} · final fee set at checkout. Free pickup at ward-leader hubs.
            </p>
          </div>
          <SummaryLines t={{ ...totals, delivery: estimate, total: totals.goods + estimate }} deliveryLabel="estimate" />
          <Link href={href(locale, "/shop/checkout")} className="btn btn-primary btn-lg btn-block">
            Go to checkout
          </Link>
          <Link href={href(locale, "/shop/merch")} className="btn btn-ghost btn-block">
            Continue shopping
          </Link>
        </div>
      </aside>
      <ConfirmDialog
        open={!!removing}
        title="Remove this item?"
        text={removingLine ? `${removingLine.qty} × ${removingLine.name} will be removed from your cart.` : ""}
        confirmLabel="Remove"
        danger
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing) removeLine(removing);
          setRemoving(null);
          toast("Item removed from cart");
        }}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { bulkRate, memberPrice, products } from "@/data/shop";
import { addToCart } from "@/lib/cart";
import { href, type Locale } from "@/lib/i18n";
import { formatNaira } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import { QtyStepper } from "./BuyBox";
import { useMember } from "./hooks";

const eligible = products.filter((p) => p.category !== "Packs" && p.stock > 0);

/** EC-4 interactive bulk calculator: 15% off from 50 items, 20% off from 200 items. */
export function BulkCalculator({ locale }: { locale: Locale }) {
  const { isMember } = useMember();
  const [slug, setSlug] = useState(eligible[0].slug);
  const [qty, setQty] = useState(50);
  const [size, setSize] = useState("Mixed");
  const toast = useToast();
  const p = eligible.find((x) => x.slug === slug)!;
  const unit = isMember ? memberPrice(p.price) : p.price;
  const rate = bulkRate(qty);
  const gross = unit * qty;
  const saving = Math.round(gross * rate);
  const toNext = qty < 50 ? 50 - qty : qty < 200 ? 200 - qty : 0;
  const tooMany = qty > p.stock;

  return (
    <div className="bulk-calc form-panel">
      <div className="form-grid form-grid-2">
        <div className="field">
          <label htmlFor="bulk-p">Product</label>
          <select id="bulk-p" className="input" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {eligible.map((x) => (
              <option key={x.slug} value={x.slug}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <p className="field-label" aria-hidden>
            Quantity
          </p>
          <QtyStepper value={qty} onChange={setQty} max={2000} label="Bulk quantity" />
        </div>
        {p.sizes && p.sizes.length > 1 && (
          <div className="field">
            <label htmlFor="bulk-s">Sizes</label>
            <select id="bulk-s" className="input" value={size} onChange={(e) => setSize(e.target.value)}>
              <option>Mixed</option>
              {p.sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="bulk-tiers" role="group" aria-label="Bulk tiers">
        {(
          [
            ["1–49 items", 0],
            ["50–199 items", 15],
            ["200+ items", 20],
          ] as const
        ).map(([label, pct]) => (
          <span key={label} className={`bulk-tier${pct === Math.round(rate * 100) ? " is-on" : ""}`}>
            <strong>{label}</strong> {pct ? `${pct}% off` : "standard price"}
          </span>
        ))}
      </div>
      <dl className="summary" aria-live="polite">
        <div>
          <dt>
            {qty} × {formatNaira(unit)}
            {isMember ? " (member price)" : ""}
          </dt>
          <dd>{formatNaira(gross)}</dd>
        </div>
        <div className="summary-save">
          <dt>Bulk discount ({Math.round(rate * 100)}%)</dt>
          <dd>−{formatNaira(saving)}</dd>
        </div>
        <div className="summary-total">
          <dt>Estimated total</dt>
          <dd>{formatNaira(gross - saving)}</dd>
        </div>
      </dl>
      {toNext > 0 && <p className="small muted">Add {toNext} more to reach the next tier.</p>}
      {tooMany && <p className="field-error">Only {p.stock} in stock (demo). Reduce the quantity or split across products.</p>}
      <button
        type="button"
        className="btn btn-primary"
        disabled={tooMany}
        onClick={() => {
          addToCart({ slug: p.slug, name: p.name, price: p.price, qty, size: size === "Mixed" ? undefined : size, variant: size === "Mixed" ? "Mixed sizes" : undefined });
          toast(`${qty} × ${p.name} added — bulk discount applied in your cart`);
        }}
      >
        <ShoppingBag size={16} aria-hidden /> Add {qty} to cart
      </button>
      <p className="small">
        The discount is applied automatically in the <Link href={href(locale, "/shop/cart")}>cart</Link> and counts all individual items together.
      </p>
    </div>
  );
}

export function AddPackButton({ slug }: { slug: string }) {
  const toast = useToast();
  const p = products.find((x) => x.slug === slug)!;
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      disabled={p.stock <= 0}
      onClick={() => {
        addToCart({ slug: p.slug, name: p.name, price: p.price, qty: 1 });
        toast(`${p.name} added to cart`);
      }}
    >
      <ShoppingBag size={16} aria-hidden /> Add pack
    </button>
  );
}

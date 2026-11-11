"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { FREE_DELIVERY_FROM, type Product } from "@/data/shop";
import { states } from "@/data/states";
import { addToCart } from "@/lib/cart";
import { href, type Locale } from "@/lib/i18n";
import { formatNaira } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import { pickupHubs, zoneFor } from "@/lib/shop-pricing";
import { PriceTag, stockLabel } from "./ProductBits";

export function QtyStepper({ value, onChange, max = 999, label = "Quantity", min = 1 }: { value: number; onChange: (n: number) => void; max?: number; label?: string; min?: number }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" className="icon-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus size={16} aria-hidden />
      </button>
      <input
        className="input qty-input"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, Math.round(n))));
        }}
      />
      <button type="button" className="icon-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}

/** Product purchase box: variants, quantity, stock, delivery estimate by state, add to cart. */
export function BuyBox({ p, locale }: { p: Product; locale: Locale }) {
  const [size, setSize] = useState(p.sizes?.length === 1 ? p.sizes[0] : "");
  const [colour, setColour] = useState(p.colours?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [state, setState] = useState("Lagos");
  const [inCapital, setInCapital] = useState(true);
  const toast = useToast();
  const st = stockLabel(p);
  const out = p.stock <= 0;
  const zone = zoneFor(state, inCapital);
  const hubs = pickupHubs.filter((h) => h.state === state);

  const add = () => {
    if (p.sizes && p.sizes.length > 1 && !size) return setErr("Choose a size first.");
    setErr("");
    addToCart({ slug: p.slug, name: p.name, price: p.price, qty, size: size || undefined, colour: colour || undefined });
    toast(`${qty} × ${p.name}${size ? ` (${size}${colour ? `, ${colour}` : ""})` : colour ? ` (${colour})` : ""} added to cart`);
  };

  return (
    <div className="buybox">
      <PriceTag price={p.price} size="lg" />
      <p>
        <span className={`badge badge-${st.tone}`}>{st.text}</span>
      </p>
      {p.sizes && p.sizes.length > 1 && (
        <fieldset className="plain">
          <legend>
            Size <span className="req">*</span>
          </legend>
          <div className="choice-row">
            {p.sizes.map((s) => (
              <label key={s} className="choice">
                <input type="radio" name={`size-${p.slug}`} value={s} checked={size === s} onChange={() => setSize(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
          {err && (
            <p className="field-error" role="alert">
              {err}
            </p>
          )}
        </fieldset>
      )}
      {p.colours && p.colours.length > 0 && (
        <fieldset className="plain">
          <legend>Colour</legend>
          <div className="choice-row">
            {p.colours.map((c) => (
              <label key={c} className="choice">
                <input type="radio" name={`colour-${p.slug}`} value={c} checked={colour === c} onChange={() => setColour(c)} />
                <span>
                  <i className={`swatch swatch-${c.toLowerCase()}`} aria-hidden /> {c}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="buybox-row">
        <QtyStepper value={qty} onChange={setQty} max={Math.max(1, p.stock)} />
        <button type="button" className="btn btn-primary btn-lg" onClick={add} disabled={out}>
          <ShoppingBag size={18} aria-hidden /> {out ? "Out of stock" : "Add to cart"}
        </button>
      </div>
      <p className="small">
        Buying 50 or more? <Link href={href(locale, "/shop/bulk")}>Bulk pricing saves 15–20%</Link>.
      </p>
      <div className="buybox-delivery">
        <p className="buybox-delivery-title">
          <Truck size={18} aria-hidden /> Delivery estimate
        </p>
        <div className="form-grid form-grid-2">
          <div className="field">
            <label htmlFor={`st-${p.slug}`}>Deliver to</label>
            <select id={`st-${p.slug}`} className="input" value={state} onChange={(e) => setState(e.target.value)}>
              {states.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {state !== "Lagos" && state !== "FCT" && (
            <label className="check buybox-capital">
              <input type="checkbox" checked={inCapital} onChange={(e) => setInCapital(e.target.checked)} />
              <span>In {states.find((s) => s.name === state)?.capital} (state capital)</span>
            </label>
          )}
        </div>
        <p className="small">
          <strong>{zone.days}</strong> by courier · {formatNaira(zone.fee)}, free on orders over {formatNaira(FREE_DELIVERY_FROM)}.
          {hubs.length > 0 && <> Or free pickup at {hubs.length === 1 ? "a ward-leader hub" : `${hubs.length} ward-leader hubs`} in {state}.</>}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { useToast } from "./Toast";

export function AddToCartButton({ slug, name, price, label, addedLabel = "Added to cart", disabled }: { slug: string; name: string; price: number; label: string; addedLabel?: string; disabled?: boolean }) {
  const [done, setDone] = useState(false);
  const toast = useToast();
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline"
      disabled={disabled}
      onClick={() => {
        addToCart({ slug, name, price, qty: 1 });
        setDone(true);
        toast(`${name} — ${addedLabel}`);
        window.setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? <Check size={16} aria-hidden /> : <ShoppingBag size={16} aria-hidden />}
      {done ? addedLabel : label}
    </button>
  );
}

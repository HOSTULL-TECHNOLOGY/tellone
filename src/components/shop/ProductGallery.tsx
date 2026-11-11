"use client";

import { useState } from "react";
import type { Product } from "@/data/shop";
import { ProductArt } from "./ProductArt";
import { Photo } from "./ProductPhoto";

/** Product page gallery: main photo plus thumbnails when there is more than one view. */
export function ProductGallery({ p }: { p: Product }) {
  const imgs = p.images ?? [];
  const [i, setI] = useState(0);
  if (!imgs.length) {
    return (
      <div className="pdp-media">
        <div className="pdp-main-img">
          <ProductArt category={p.category} size={180} />
        </div>
        <p className="small muted">Approved product photography will replace this placeholder.</p>
      </div>
    );
  }
  const cur = imgs[Math.min(i, imgs.length - 1)];
  return (
    <div className="pdp-media">
      <div className="pdp-main-img has-photo">
        <Photo img={cur} sizes="(min-width: 900px) 45vw, 100vw" eager />
      </div>
      {imgs.length > 1 && (
        <div className="pdp-gallery-thumbs" role="group" aria-label="Product views">
          {imgs.map((img, n) => (
            <button key={img.src} type="button" className="pdp-gthumb" aria-pressed={n === i} aria-label={`Show view ${n + 1} of ${imgs.length}: ${img.alt}`} onClick={() => setI(n)}>
              <Photo img={img} sizes="96px" decorative />
            </button>
          ))}
        </div>
      )}
      <p className="small muted">
        {cur.src.includes("/mockup-")
          ? "Design mockup made from the TBH One brand kit; the product photo replaces it once the first batch is produced."
          : "Product render supplied by the campaign. The printed item may vary slightly in colour."}
      </p>
    </div>
  );
}

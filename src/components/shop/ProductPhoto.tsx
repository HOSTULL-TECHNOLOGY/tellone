import { photoSources, type Product, type ProductImage } from "@/data/shop";
import { ProductArt } from "./ProductArt";

/** One product photo: webp at two widths with a jpg fallback. */
export function Photo({ img, sizes = "(min-width: 900px) 25vw, 50vw", eager = false, decorative = false }: { img: ProductImage; sizes?: string; eager?: boolean; decorative?: boolean }) {
  const s = photoSources(img.src);
  return (
    // A design mockup is labelled with CSS (::after), since <picture> may only hold <source> and <img>
    <picture className="shop-photo" data-mockup={img.src.includes("/mockup-") ? "Design mockup" : undefined}>
      <source type="image/webp" srcSet={`${s.webp480} 480w, ${s.webp900} 900w`} sizes={sizes} />
      <img src={s.jpg} alt={decorative ? "" : img.alt} width={900} height={900} loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}

/** The product's main photo, or the line-art placeholder when no photo has been supplied yet. */
export function ProductMedia({ p, size, label, sizes, decorative }: { p: Product; size?: number; label?: boolean; sizes?: string; decorative?: boolean }) {
  const img = p.images?.[0];
  if (!img) return <ProductArt category={p.category} size={size} label={label} />;
  return <Photo img={img} sizes={sizes} decorative={decorative} />;
}

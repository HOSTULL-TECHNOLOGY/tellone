import type { ProductCategory } from "@/data/shop";

/** Neutral line drawing per category, used until approved product photography exists (Plan C4). */
export function ProductArt({ category, size = 88, label = true }: { category: ProductCategory | string; size?: number; label?: boolean }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  let shape;
  switch (category) {
    case "Caps":
      shape = <path d="M20 78c0-24 18-42 40-42s40 18 40 42H20Zm-8 0h104v8H12z" {...s} />;
      break;
    case "Wristbands":
      shape = <ellipse cx="60" cy="60" rx="40" ry="22" {...s} strokeWidth={8} />;
      break;
    case "Key holders":
      shape = (
        <g {...s}>
          <circle cx="38" cy="40" r="14" />
          <path d="M50 50h46v30H74l-10 12-6-12h-8z" />
        </g>
      );
      break;
    case "Banners":
      shape = (
        <g {...s}>
          <rect x="12" y="38" width="96" height="40" />
          <circle cx="20" cy="46" r="3" />
          <circle cx="100" cy="46" r="3" />
          <path d="M30 58h60" />
        </g>
      );
      break;
    case "Stickers":
      shape = (
        <g {...s}>
          <rect x="26" y="18" width="68" height="84" rx="6" />
          <circle cx="46" cy="42" r="10" />
          <rect x="62" y="34" width="20" height="16" />
          <path d="M38 72h44M38 86h30" />
        </g>
      );
      break;
    case "Packs":
      shape = (
        <g {...s}>
          <path d="M20 44 60 26l40 18v42L60 104 20 86z" />
          <path d="M20 44l40 18 40-18M60 62v42" />
        </g>
      );
      break;
    default:
      shape = <path d="M40 20 22 30 12 52l16 8 6-10v52h52V50l6 10 16-8-10-22-18-10c-4 8-12 12-20 12s-16-4-20-12Z" {...s} />;
  }
  return (
    <div className="prod-ph shop-art">
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
        {shape}
      </svg>
      {label && <span>Product photo pending</span>}
    </div>
  );
}

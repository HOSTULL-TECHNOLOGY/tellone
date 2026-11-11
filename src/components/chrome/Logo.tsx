import Link from "next/link";
import { href, type Locale } from "@/lib/i18n";

/** The supplied TBH One wordmark lockup, used as an image (never re-set in a font). */
export function Logo({ locale, size = "md" }: { locale: Locale; size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? 64 : size === "lg" ? 100 : 84;
  const w = Math.round((h * 559) / 362);
  return (
    <Link href={href(locale, "/")} className="logo" aria-label="TBH One — home">
      <img
        src="/brand/tbh-one-logo-360.webp"
        srcSet="/brand/tbh-one-logo-180.webp 180w, /brand/tbh-one-logo-360.webp 360w, /brand/tbh-one-logo-560.webp 560w"
        sizes="(min-width: 768px) 217px, 136px"
        width={w}
        height={h}
        alt="TBH One — The Nigeria We Want: Peter Obi and Rabiu Musa Kwankwaso in a speech bubble"
        fetchPriority="high"
      />
    </Link>
  );
}

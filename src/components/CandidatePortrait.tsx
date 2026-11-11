/**
 * The candidates' real photographs (supplied by the client), with the NDC party mark in the corner so visitors
 * see both the face and the party on the ballot. Square crops: Obi 560 px, Kwankwaso 441 px.
 */
const PHOTOS = {
  "peter-obi": { name: "Peter Obi", base: "/people/peter-obi", wide: 560, pos: "50% 30%" },
  "rabiu-musa-kwankwaso": { name: "Rabiu Musa Kwankwaso", base: "/people/rabiu-musa-kwankwaso", wide: 441, pos: "50% 20%" },
} as const;

export type CandidateSlug = keyof typeof PHOTOS;
export const isCandidateSlug = (s: string): s is CandidateSlug => s in PHOTOS;

export function CandidatePortrait({
  slug,
  size = 280,
  eager = false,
  className = "",
  badge = true,
}: {
  slug: CandidateSlug;
  size?: number;
  eager?: boolean;
  className?: string;
  badge?: boolean;
}) {
  const p = PHOTOS[slug];
  return (
    <figure className={`cand-portrait ${className}`} style={{ maxWidth: size }}>
      <picture>
        <source type="image/webp" srcSet={`${p.base}-320.webp 320w, ${p.base}-${p.wide}.webp ${p.wide}w`} sizes={`${size}px`} />
        <img
          src={`${p.base}.jpg`}
          alt={`${p.name}, NDC ${slug === "peter-obi" ? "presidential" : "vice-presidential"} candidate`}
          width={size}
          height={size}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: p.pos }}
        />
      </picture>
      {badge && (
        <span className="ndc-badge" title="Nigeria Democratic Congress (NDC)">
          <img src="/brand/ndc-mark.webp" alt="NDC" width={34} height={44} loading="lazy" />
        </span>
      )}
    </figure>
  );
}

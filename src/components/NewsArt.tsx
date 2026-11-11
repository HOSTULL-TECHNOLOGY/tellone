/**
 * Illustrated thumbnails for news articles, drawn in the brand colours (SVG, so they stay sharp and light).
 * One design per topic; unknown articles fall back to the tagline design.
 */
const G = "#0f4d02";
const G2 = "#157103";
const L = "#a3de8b";
const R = "#d40000";
const P = "#f2f3ed";

function Frame({ children, bg = P, label }: { children: React.ReactNode; bg?: string; label: string }) {
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label={label} className="news-art" preserveAspectRatio="xMidYMid slice">
      <rect width="480" height="300" fill={bg} />
      <g opacity="0.08" stroke={G} strokeWidth="2" fill="none">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${i * 60 - 20} 300 l60 -60 l-30 -30 l60 -60 l-30 -30 l60 -60`} />
        ))}
      </g>
      <rect x="0" y="0" width="240" height="8" fill={R} />
      <rect x="240" y="0" width="240" height="8" fill={G2} />
      {children}
    </svg>
  );
}

function Person({ x, y, s = 1, c }: { x: number; y: number; s?: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-34" r="16" fill={c} />
      <path d="M-26 22 q0 -42 26 -42 q26 0 26 42 z" fill={c} />
    </g>
  );
}

function TbhArt() {
  return (
    <Frame label="Illustration: three people connected by speech bubbles T, B and H">
      <path d="M118 200 C180 150 300 150 362 200" stroke={G} strokeWidth="4" strokeDasharray="8 8" fill="none" />
      <Person x={110} y={232} c={G} s={1.15} />
      <Person x={240} y={222} c={R} s={1.3} />
      <Person x={370} y={232} c={G2} s={1.15} />
      {[
        [70, 58, "T", R],
        [200, 40, "B", G],
        [330, 58, "H", R],
      ].map(([x, y, t, c]) => (
        <g key={t as string}>
          <rect x={x as number} y={y as number} width="80" height="64" rx="14" fill={c as string} />
          <path d={`M${(x as number) + 26} ${(y as number) + 64} l14 16 l4 -16 z`} fill={c as string} />
          <text x={(x as number) + 40} y={(y as number) + 46} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="42" fill="#fff">
            {t}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function FundingArt() {
  const bars = [60, 95, 130, 170, 210];
  return (
    <Frame bg={G} label="Illustration: rising bar chart, a receipt and a naira coin">
      <g opacity="0.12" stroke="#fff">
        {[80, 130, 180, 230].map((y) => (
          <line key={y} x1="40" x2="300" y1={y} y2={y} />
        ))}
      </g>
      {bars.map((h, i) => (
        <rect key={i} x={50 + i * 50} y={260 - h} width="34" height={h} rx="6" fill={i === bars.length - 1 ? L : i % 2 ? "#ffffff" : L} opacity={i === bars.length - 1 ? 1 : 0.85} />
      ))}
      <path d="M60 205 L110 170 L160 150 L210 110 L260 70" stroke={R} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="260" cy="70" r="9" fill={R} />
      <g transform="translate(318 46)">
        <path d="M0 0 h120 v190 l-15 -10 l-15 10 l-15 -10 l-15 10 l-15 -10 l-15 10 l-15 -10 l-15 10 z" fill="#fff" />
        {[28, 52, 76, 100, 124].map((y, i) => (
          <g key={y}>
            <rect x="14" y={y} width={i % 2 ? 56 : 70} height="8" rx="4" fill={i === 4 ? R : "#cfd5c6"} />
            <rect x="90" y={y} width="18" height="8" rx="4" fill={G2} />
          </g>
        ))}
        <rect x="14" y="150" width="92" height="12" rx="6" fill={G} />
      </g>
      <g transform="translate(420 236)">
        <circle r="36" fill={L} stroke="#fff" strokeWidth="4" />
        <text y="15" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="44" fill={G}>
          ₦
        </text>
      </g>
    </Frame>
  );
}

function TaglineArt() {
  const langs: [string, string, number, number][] = [
    ["EN", R, 40, 50],
    ["PCM", G, 170, 30],
    ["YO", G2, 300, 54],
    ["HA", R, 100, 160],
    ["IG", G, 240, 168],
  ];
  return (
    <Frame label="Illustration: one promise in five languages, shown as five speech bubbles">
      {langs.map(([t, c, x, y]) => (
        <g key={t}>
          <rect x={x} y={y} width="130" height="86" rx="18" fill={c} />
          <path d={`M${x + 34} ${y + 86} l16 20 l6 -20 z`} fill={c} />
          <text x={x + 65} y={y + 56} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize={t.length > 2 ? 30 : 36} fill="#fff">
            {t}
          </text>
        </g>
      ))}
      <text x="440" y="282" textAnchor="end" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill={G}>
        one promise
      </text>
    </Frame>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "what-tell-one-bring-one-help-one-asks-of-you": TbhArt,
  "how-project-funding-replaces-membership-dues": FundingArt,
};

export function NewsArt({ slug }: { slug: string }) {
  const Art = ART[slug] ?? (/fund|transparen|naira|money/.test(slug) ? FundingArt : /tell|bring|help/.test(slug) ? TbhArt : TaglineArt);
  return <Art />;
}

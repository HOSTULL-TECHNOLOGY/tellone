/**
 * Cover art for TBH One TV programmes and films, drawn in the brand colours (SVG: sharp and light).
 * The scene is picked from the title (borehole, ballot, street, receipt, voter card, leader, safety, T-B-H), so each
 * film gets a cover that says what it is about until the finished film's own artwork is supplied.
 */
const G = "#0f4d02";
const G2 = "#157103";
const L = "#a3de8b";
const R = "#d40000";
const W = "#ffffff";

type Scene = "borehole" | "ballot" | "street" | "receipt" | "pvc" | "leader" | "safety" | "tbh" | "music" | "money";

export function sceneFor(title: string): Scene {
  const t = title.toLowerCase();
  if (/borehole|water|pump/.test(t)) return "borehole";
  if (/ballot|vote|poll|mama put/.test(t)) return "ballot";
  if (/receipt|tracked|money|naira|funding/.test(t)) return /receipt/.test(t) ? "receipt" : "money";
  if (/registration|pvc|voter/.test(t)) return "pvc";
  if (/street|one voice|day with/.test(t)) return /day with|leader/.test(t) ? "leader" : "street";
  if (/safety|safe/.test(t)) return "safety";
  if (/song|music/.test(t)) return "music";
  if (/tell one|bring one|help one|t-b-h/.test(t)) return "tbh";
  return "street";
}

function Person({ x, y, s = 1, c }: { x: number; y: number; s?: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-46" r="14" fill={c} />
      <path d="M-22 0 q0 -36 22 -36 q22 0 22 36 z" fill={c} />
    </g>
  );
}

/** Scene drawn in a 200×200 box centred at (0,0). */
function SceneArt({ scene }: { scene: Scene }) {
  switch (scene) {
    case "borehole":
      return (
        <g>
          <rect x="-12" y="-40" width="24" height="100" rx="4" fill={W} />
          <rect x="-50" y="-52" width="70" height="14" rx="7" fill={W} />
          <path d="M20 -45 l40 -18" stroke={W} strokeWidth="8" strokeLinecap="round" />
          <path d="M-46 -38 v22" stroke={W} strokeWidth="8" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${-46 + i * 9} ${-6 + i * 14} q-6 10 0 14 q6 -4 0 -14z`} fill={L} />
          ))}
          <rect x="-70" y="60" width="140" height="10" rx="5" fill={L} />
          <Person x={-70} y={58} s={0.8} c={R} />
          <Person x={72} y={58} s={0.8} c={L} />
        </g>
      );
    case "ballot":
      return (
        <g>
          <rect x="-50" y="-10" width="100" height="70" rx="6" fill={W} />
          <rect x="-28" y="-14" width="56" height="8" rx="4" fill={G} />
          <rect x="-18" y="-58" width="36" height="48" rx="3" fill={L} transform="rotate(-8)" />
          <path d="M-8 -36 l6 8 l12 -16" stroke={G} strokeWidth="5" fill="none" strokeLinecap="round" />
          <text y="36" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="22" fill={R}>
            VOTE
          </text>
          <ellipse cx="76" cy="52" rx="26" ry="8" fill={R} />
          <path d="M50 52 q26 -40 52 0" fill={R} />
          <path d="M66 22 q4 -10 0 -18 M78 20 q4 -10 0 -18" stroke={W} strokeWidth="3" fill="none" opacity="0.8" />
        </g>
      );
    case "receipt":
    case "money":
      return (
        <g>
          <path d="M-46 -70 h92 v140 l-11 -8 l-12 8 l-11 -8 l-12 8 l-12 -8 l-11 8 l-12 -8 l-11 8 z" fill={W} />
          {[-48, -28, -8, 12].map((y, i) => (
            <g key={y}>
              <rect x="-34" y={y} width={i % 2 ? 40 : 52} height="8" rx="4" fill="#cfd5c6" />
              <rect x="22" y={y} width="14" height="8" rx="4" fill={G2} />
            </g>
          ))}
          <rect x="-34" y="34" width="70" height="12" rx="6" fill={R} />
          <circle cx="58" cy="52" r="26" fill={L} stroke={W} strokeWidth="4" />
          <text x="58" y="63" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="30" fill={G}>
            ₦
          </text>
        </g>
      );
    case "pvc":
      return (
        <g>
          <rect x="-74" y="-46" width="148" height="96" rx="10" fill={W} />
          <rect x="-74" y="-46" width="148" height="22" rx="10" fill={G2} />
          <rect x="-74" y="-30" width="148" height="6" fill={G2} />
          <circle cx="-40" cy="10" r="20" fill={L} />
          <path d="M-58 40 q18 -26 36 0" fill={L} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="-6" y={-6 + i * 16} width={i === 1 ? 50 : 66} height="8" rx="4" fill="#cfd5c6" />
          ))}
          <circle cx="62" cy="48" r="22" fill={R} />
          <path d="M51 48 l8 8 l14 -16" stroke={W} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      );
    case "leader":
      return (
        <g>
          <Person x={-20} y={64} s={1.5} c={W} />
          <rect x="-40" y="22" width="38" height="26" rx="4" fill={R} />
          <path d="M22 -10 l40 -18 v52 l-40 -18 z" fill={L} />
          <rect x="10" y="-10" width="14" height="16" rx="3" fill={L} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M72 ${-14 + i * 14} q10 0 16 ${-6 + i * 6}`} stroke={W} strokeWidth="4" fill="none" strokeLinecap="round" />
          ))}
        </g>
      );
    case "safety":
      return (
        <g>
          <path d="M0 -70 l60 22 v34 q0 52 -60 80 q-60 -28 -60 -80 v-34 z" fill={W} />
          <path d="M0 -50 l42 15 v24 q0 38 -42 58 q-42 -20 -42 -58 v-24 z" fill={G2} />
          <path d="M-18 4 l14 14 l26 -30" stroke={W} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "music":
      return (
        <g>
          <circle cx="0" cy="0" r="62" fill={W} />
          <circle cx="0" cy="0" r="22" fill={R} />
          <circle cx="0" cy="0" r="6" fill={W} />
          <path d="M60 -60 v70" stroke={L} strokeWidth="8" />
          <ellipse cx="50" cy="12" rx="14" ry="10" fill={L} />
        </g>
      );
    case "tbh":
      return (
        <g>
          {[
            [-72, -40, "T", R],
            [-20, -64, "B", G2],
            [32, -40, "H", R],
          ].map(([x, y, t, c]) => (
            <g key={t as string}>
              <rect x={x as number} y={y as number} width="46" height="40" rx="10" fill={c as string} stroke={W} strokeWidth="3" />
              <text x={(x as number) + 23} y={(y as number) + 30} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="26" fill={W}>
                {t}
              </text>
            </g>
          ))}
          <Person x={-50} y={66} s={0.9} c={W} />
          <Person x={0} y={66} s={1.05} c={L} />
          <Person x={50} y={66} s={0.9} c={W} />
        </g>
      );
    default:
      return (
        <g>
          {[-70, -18, 34].map((x, i) => (
            <g key={x}>
              <rect x={x} y={-20 - i * 6} width="44" height={60 + i * 6} fill={i === 1 ? L : W} />
              <path d={`M${x - 6} ${-20 - i * 6} l28 -24 l28 24 z`} fill={i === 1 ? R : L} />
              <rect x={x + 16} y={14} width="12" height="26" fill={G} />
            </g>
          ))}
          <rect x="-90" y="40" width="180" height="8" rx="4" fill={W} opacity="0.7" />
          <Person x={-60} y={78} s={0.7} c={R} />
          <Person x={0} y={78} s={0.75} c={W} />
          <Person x={60} y={78} s={0.7} c={L} />
        </g>
      );
  }
}

export function ProgrammeArt({ title, vertical = false, index = 0, label }: { title: string; vertical?: boolean; index?: number; label: string }) {
  const w = vertical ? 360 : 640;
  const h = vertical ? 640 : 360;
  const bg = index % 2 === 0 ? G : "#8a0000";
  const glow = index % 2 === 0 ? G2 : R;
  const id = `pa-${index}-${vertical ? "v" : "h"}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="prog-art" role="img" aria-label={`Cover: ${title}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={id} cx="50%" cy={vertical ? "40%" : "45%"} r="70%">
          <stop offset="0" stopColor={glow} />
          <stop offset="1" stopColor={bg} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
      <g opacity="0.08" stroke={W} strokeWidth="2" fill="none">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${i * 60 - 40} ${h} l60 -60 l-30 -30 l60 -60 l-30 -30 l60 -60`} />
        ))}
      </g>
      <g transform={vertical ? `translate(${w / 2} ${h * 0.4}) scale(1.25)` : `translate(${w * 0.68} ${h / 2}) scale(1.15)`}>
        <SceneArt scene={sceneFor(title)} />
      </g>
      <rect x="0" y="0" width={w / 2} height="8" fill={R} />
      <rect x={w / 2} y="0" width={w / 2} height="8" fill={L} />
      <text x={vertical ? 24 : 28} y={vertical ? 44 : 46} fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.12em" fill={L}>
        {label.toUpperCase()}
      </text>
      {!vertical && (
        <foreignObject x="28" y="70" width={w * 0.42} height={h - 100}>
          <p className="prog-art-title" style={{ fontSize: title.length > 34 ? 26 : 32 }}>{title}</p>
        </foreignObject>
      )}
      {vertical && (
        <foreignObject x="24" y={h - 190} width={w - 48} height="170">
          <p className="prog-art-title prog-art-title-v" style={{ fontSize: title.length > 20 ? 34 : 40 }}>{title}</p>
        </foreignObject>
      )}
    </svg>
  );
}

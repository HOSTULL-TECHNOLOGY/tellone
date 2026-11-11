/**
 * Illustration for the event calendar: a month page in the brand colours with the listed events marked on their
 * days, and a crowd gathering underneath. Built from the event data, so the marked days always match the list.
 */
const G = "#0f4d02";
const G2 = "#157103";
const L = "#a3de8b";
const R = "#d40000";

type Ev = { start: string; category: string };

function Person({ x, s, c }: { x: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} 548) scale(${s * 0.82})`}>
      <circle cx="0" cy="-62" r="15" fill={c} />
      <path d="M-24 0 q0 -44 24 -44 q24 0 24 44 z" fill={c} />
    </g>
  );
}

export function EventCalendarArt({ events }: { events: Ev[] }) {
  const lagos = (iso: string) => new Date(new Date(iso).getTime() + 60 * 60 * 1000); // WAT is UTC+1, no DST
  const first = lagos(events[0]?.start ?? new Date().toISOString());
  const year = first.getUTCFullYear();
  const month = first.getUTCMonth();
  const startDay = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // Monday first
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const marked = new Map<number, number>();
  events.forEach((e, i) => {
    const d = lagos(e.start);
    if (d.getUTCFullYear() === year && d.getUTCMonth() === month) marked.set(d.getUTCDate(), i);
  });
  const monthName = new Date(Date.UTC(year, month, 1)).toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const cell = 44;
  const gx = 24;
  const gy = 150;

  return (
    <svg viewBox="0 0 360 560" className="ev-art" role="img" aria-label={`Calendar for ${monthName} with ${marked.size} TBH One events marked`}>
      <rect width="360" height="560" rx="22" fill="#ffffff" />
      <rect width="360" height="104" rx="22" fill={G} />
      <rect y="80" width="360" height="24" fill={G} />
      {[80, 280].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="-14" width="14" height="40" rx="7" fill={R} />
          <circle cx={x} cy="30" r="5" fill="#ffffff" />
        </g>
      ))}
      <text x="180" y="78" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="30" fill="#ffffff">
        {monthName}
      </text>
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <text key={i} x={gx + i * cell + cell / 2} y="136" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="14" fill={i > 4 ? R : "#5b5b52"}>
          {d}
        </text>
      ))}
      {Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const pos = startDay + i;
        const x = gx + (pos % 7) * cell;
        const y = gy + Math.floor(pos / 7) * cell;
        const ev = marked.get(day);
        const c = ev === undefined ? null : ev % 2 === 0 ? R : G2;
        return (
          <g key={day}>
            {c && <circle cx={x + cell / 2} cy={y + cell / 2 - 4} r="18" fill={c} />}
            <text x={x + cell / 2} y={y + cell / 2 + 1} textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight={c ? 800 : 500} fontSize="15" fill={c ? "#ffffff" : "#1b1a16"}>
              {day}
            </text>
          </g>
        );
      })}
      <rect x="24" y="428" width="312" height="2" fill="#e6e8df" />
      <rect x="0" y="500" width="360" height="60" fill={L} opacity="0.35" />
      {[
        [48, 0.9, G],
        [104, 1.05, R],
        [160, 0.95, G2],
        [214, 1.1, G],
        [268, 0.9, R],
        [318, 1, G2],
      ].map(([x, s, c]) => (
        <Person key={x as number} x={x as number} s={s as number} c={c as string} />
      ))}
      <g transform="translate(180 452)">
        <rect x="-96" y="-16" width="192" height="32" rx="16" fill={R} />
        <text y="5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#ffffff" letterSpacing="0.06em">
          {marked.size} EVENTS NEAR YOU
        </text>
      </g>
      <rect x="0" y="548" width="360" height="12" rx="6" fill={G} />
    </svg>
  );
}

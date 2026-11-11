export function formatNaira(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}m`;
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}

export function formatDate(iso: string, withTime = false) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    weekday: withTime ? "short" : undefined,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: withTime ? "numeric" : undefined,
    minute: withTime ? "2-digit" : undefined,
    timeZone: "Africa/Lagos",
  });
}

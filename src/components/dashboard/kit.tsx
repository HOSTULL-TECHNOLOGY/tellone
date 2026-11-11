"use client";

import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

/** Building blocks for dashboard screens. Role screens compose these; they do not share layouts. */

export function Kpis({ items }: { items: { label: string; value: ReactNode; sub?: ReactNode; trend?: "up" | "down"; tone?: "ok" | "warn" | "danger" }[] }) {
  return (
    <dl className="kpis">
      {items.map((k) => (
        <div key={k.label} className={k.tone ? `kpi kpi-${k.tone}` : "kpi"}>
          <dt>{k.label}</dt>
          <dd>{k.value}</dd>
          {k.sub && (
            <p className="kpi-sub">
              {k.trend === "up" && <TrendingUp size={14} aria-hidden />}
              {k.trend === "down" && <TrendingDown size={14} aria-hidden />}
              {k.sub}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`dpanel ${className}`}>
      {(title || action) && (
        <div className="dpanel-head">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={`dgrid dgrid-${cols}`}>{children}</div>;
}

export type Tone = "ok" | "warn" | "danger" | "info" | "muted";
export function Badge({ tone = "muted", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

/** Accessible horizontal bar chart with a text equivalent (SEO-14: every chart has a text version). */
export function BarChart({ data, format = (n: number) => n.toLocaleString("en-NG"), label }: { data: { label: string; value: number; target?: number }[]; format?: (n: number) => string; label: string }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.value, d.target ?? 0)));
  return (
    <figure className="bars" aria-label={label}>
      <ul role="list">
        {data.map((d) => (
          <li key={d.label}>
            <span className="bars-label">{d.label}</span>
            <span className="bars-track" aria-hidden>
              <span className="bars-fill" style={{ width: `${(d.value / max) * 100}%` }} />
              {d.target !== undefined && <span className="bars-target" style={{ left: `${(d.target / max) * 100}%` }} />}
            </span>
            <span className="bars-value">
              {format(d.value)}
              {d.target !== undefined && <span className="muted"> / {format(d.target)}</span>}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Tiny line chart (SVG) with an accessible summary. */
export function Spark({ values, label }: { values: number[]; label: string }) {
  const w = 240, h = 60, max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / Math.max(1, max - min)) * (h - 8) - 4}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark" role="img" aria-label={`${label}: from ${values[0].toLocaleString()} to ${values[values.length - 1].toLocaleString()}`}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, (value / Math.max(1, max)) * 100);
  return (
    <div className="meter">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Audit trail entry list (SH-14). */
export function AuditList({ items }: { items: { at: string; who: string; what: string }[] }) {
  return (
    <ol className="audit">
      {items.map((a, i) => (
        <li key={i}>
          <time>{a.at}</time>
          <span>
            <strong>{a.who}</strong> {a.what}
          </span>
        </li>
      ))}
    </ol>
  );
}

export const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

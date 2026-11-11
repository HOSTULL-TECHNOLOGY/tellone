"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, SearchX } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/Page";
import { PROJECT_CATEGORIES, STATUS_LABEL, type FundableProject, type ProjectStatus } from "@/data/projects";
import { formatNaira } from "@/lib/format";
import { href, type Locale } from "@/lib/i18n";

type Sort = "newest" | "closest" | "most-funded" | "smallest";

export function ProjectsBrowser({ items, locale }: { items: FundableProject[]; locale: Locale }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  // Allow deep links like /projects?state=Lagos
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("state")) setState(p.get("state")!);
    if (p.get("category")) setCat(p.get("category")!);
  }, []);

  const statesWithProjects = useMemo(() => Array.from(new Set(items.map((p) => p.state))).sort(), [items]);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = items.filter(
      (p) =>
        (!state || p.state === state) &&
        (!cat || p.category === cat) &&
        (!status || p.status === status) &&
        (!needle || `${p.title} ${p.summary} ${p.lga} ${p.state}`.toLowerCase().includes(needle)),
    );
    const remaining = (p: FundableProject) => p.target - p.raised;
    return [...out].sort((a, b) =>
      sort === "closest" ? (a.status === "open" ? remaining(a) : 1e12) - (b.status === "open" ? remaining(b) : 1e12) : sort === "most-funded" ? b.funders - a.funders : sort === "smallest" ? a.target - b.target : b.published.localeCompare(a.published),
    );
  }, [items, q, state, cat, status, sort]);

  const reset = () => {
    setQ("");
    setState("");
    setCat("");
    setStatus("");
  };

  return (
    <div>
      <div className="filters" role="search" aria-label="Filter projects">
        <div className="field">
          <label htmlFor="pq">Search</label>
          <input id="pq" className="input" type="search" placeholder="Fliers, radio, borehole…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="ps">State</label>
          <select id="ps" className="input" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">All states</option>
            {statesWithProjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pc">Category</label>
          <select id="pc" className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pst">Status</label>
          <select id="pst" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any status</option>
            {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pso">Sort by</label>
          <select id="pso" className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">Newest</option>
            <option value="closest">Closest to target</option>
            <option value="most-funded">Most funders</option>
            <option value="smallest">Smallest target</option>
          </select>
        </div>
      </div>
      <p className="small muted" aria-live="polite">
        {list.length} of {items.length} projects
        {(q || state || cat || status) && (
          <>
            {" "}
            ·{" "}
            <button type="button" className="linklike" onClick={reset}>
              Clear filters
            </button>
          </>
        )}
      </p>
      {list.length === 0 ? (
        <EmptyState
          icon={<SearchX size={32} aria-hidden />}
          title="No projects match"
          text="Try another state or category, or propose a project for your area through your ward leader."
          action={
            <button type="button" className="btn btn-outline" onClick={reset}>
              Clear filters
            </button>
          }
        />
      ) : (
        <ul className="pj-grid" role="list">
          {list.map((p) => (
            <li key={p.slug}>
              <ProjectCard p={p} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProjectCard({ p, locale }: { p: FundableProject; locale: Locale }) {
  const pct = Math.min(100, (p.raised / p.target) * 100);
  return (
    <article className="pj panel">
      <div className="pj-top">
        <span className="chip">{p.category}</span>
        <span className={`badge ${p.status === "open" ? "badge-info" : p.status === "delivered" ? "badge-ok" : "badge-warn"}`}>{STATUS_LABEL[p.status]}</span>
      </div>
      <h3>
        <Link href={href(locale, `/projects/${p.slug}`)}>{p.title}</Link>
      </h3>
      <p className="pj-loc">
        <MapPin size={16} aria-hidden /> {p.lga}, {p.state}
      </p>
      <ProgressBar value={pct} label={`${Math.round(pct)}% funded`} />
      <dl className="pj-figs">
        <div>
          <dt>Raised</dt>
          <dd>{formatNaira(p.raised)}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{formatNaira(p.target)}</dd>
        </div>
        <div>
          <dt>Funders</dt>
          <dd>{p.funders}</dd>
        </div>
      </dl>
      <div className="pj-actions">
        <Link href={href(locale, `/projects/${p.slug}`)} className="btn btn-sm btn-ghost">
          View project
        </Link>
        {p.status === "open" && (
          <Link href={href(locale, `/projects/${p.slug}#fund`)} className="btn btn-sm btn-primary">
            Fund this project
          </Link>
        )}
      </div>
    </article>
  );
}

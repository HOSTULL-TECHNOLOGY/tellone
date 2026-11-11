"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Ban, CalendarClock, CheckCircle2, Dice5, FilePlus, Gift, Plus, ShieldCheck, Trophy, UserMinus, UserPlus } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { AuditList, Badge, BarChart, Grid, Kpis, Meter, naira, Panel, Spark, type Tone } from "@/components/dashboard/kit";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { CheckField, SelectField, TextArea, TextField, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { phaseAt, promotionsAllowed, timeToElection } from "@/lib/campaign";
import { campaignDates } from "@/config/site";
import { states } from "@/data/states";
import {
  aiVisibility,
  benchmarks,
  calendarItems,
  contentStats,
  diaspora,
  grantableRoles,
  managedUsers,
  pipeline as seedPipeline,
  spendCategories,
  stateActivity,
  STALLED_DAYS,
  weeklySpend,
  type ManagedUser,
  type PipelineProject,
} from "@/data/mock/backoffice";
import { downloadCsv, fmtDuration, mentionsElectoral, shortDate, stamp, useAudit, useNow, usePersisted } from "./office/common";

const STAGES: PipelineProject["stage"][] = ["Proposed", "Approved", "Published", "Funded", "Delivered"];
const LEADER_ROLES = ["Street leader", "Ward leader", "State coordinator", "Country coordinator"];
const fmtInt = (n: number) => n.toLocaleString("en-NG");
const compact = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}m` : n >= 1e4 ? `${Math.round(n / 1e3)}k` : fmtInt(n));
const nairaM = (n: number) => (n >= 1e6 ? `₦${(n / 1e6).toFixed(1)}m` : naira(n));
const pct = (a: number, b: number) => `${Math.round((a / Math.max(1, b)) * 100)}%`;

export default function NationalDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="national" section={section}>
      {(user) => <National section={section} user={user} />}
    </DashboardShell>
  );
}

function National({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const [projects, setProjects] = usePersisted<PipelineProject[]>("tbh-ofc-pipeline", seedPipeline);
  const [audit, addAudit] = useAudit("tbh-ofc-nc-audit");
  switch (section) {
    case "map":
      return <MapView />;
    case "funding":
      return <Funding />;
    case "pipeline":
      return <Pipeline projects={projects} setProjects={setProjects} me={me} addAudit={addAudit} />;
    case "content":
      return <Content />;
    case "calendar":
      return <Calendar />;
    case "risk":
      return <Risk projects={projects} me={me} addAudit={addAudit} />;
    case "publisher":
      return <Publisher projects={projects} setProjects={setProjects} me={me} addAudit={addAudit} />;
    case "giveaways":
      return <Giveaways me={me} addAudit={addAudit} />;
    case "users":
      return <Users me={me} audit={audit} addAudit={addAudit} />;
    case "visibility":
      return <Visibility />;
    default:
      return <Scorecard projects={projects} />;
  }
}

type AddAudit = (who: string, what: string) => void;

/* ---------------------------------------------------------------- NC-1 Movement scorecard */
function Scorecard({ projects }: { projects: PipelineProject[] }) {
  const stalled = projects.filter((p) => p.daysInStage > STALLED_DAYS && p.stage !== "Delivered").length;
  const raised = spendCategories.reduce((n, c) => n + c.raised, 0);
  const spent = spendCategories.reduce((n, c) => n + c.spent, 0);
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Registered members", value: compact(benchmarks[0].actual), sub: `${fmtInt(benchmarks[0].actual)} · ${pct(benchmarks[0].actual, benchmarks[0].target)} of 5m target`, trend: "up" },
          { label: "Raised to date", value: nairaM(raised), sub: `${naira(raised)} · ${nairaM(spent)} spent and published` },
          { label: "Projects delivered", value: projects.filter((p) => p.stage === "Delivered").length + benchmarks[7].actual, sub: "Executed projects" },
          { label: "Stalled projects", value: stalled, tone: stalled ? "warn" : "ok", sub: `No movement in ${STALLED_DAYS}+ days` },
        ]}
      />
      <Panel title="Benchmarks against the 2027 targets">
        <div className="ofc-scroll">
          <table className="ofc-table">
            <caption className="sr-only">Movement benchmarks: actual against target</caption>
            <thead>
              <tr>
                <th scope="col">Benchmark</th>
                <th scope="col" className="num">Actual</th>
                <th scope="col" className="num">Target</th>
                <th scope="col">Progress</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.label}>
                  <th scope="row">{b.label}</th>
                  <td className="num">{fmtInt(b.actual)}</td>
                  <td className="num">{fmtInt(b.target)}</td>
                  <td style={{ minWidth: 140 }}>
                    <Meter value={b.actual} max={b.target} label={`${b.label} progress`} />
                    <span className="ofc-small ofc-muted">{pct(b.actual, b.target)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Grid cols={2}>
        <Panel title="Top states by members">
          <BarChart label="Members by state, top 8" data={[...stateActivity].sort((a, b) => b.members - a.members).slice(0, 8).map((s) => ({ label: s.state, value: s.members }))} />
        </Panel>
        <Panel title="Weekly spend (₦m)">
          <Spark values={weeklySpend} label="Weekly spend over the last 7 weeks, millions of naira" />
          <p className="ofc-small ofc-muted">Last 7 weeks: {weeklySpend.map((v) => `₦${v}m`).join(", ")}.</p>
        </Panel>
      </Grid>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-2 National map */
const METRICS = [
  { key: "members", label: "Members" },
  { key: "wardLeaders", label: "Ward leaders" },
  { key: "streetLeaders", label: "Street leaders" },
  { key: "delivered", label: "Projects delivered" },
] as const;
type MetricKey = (typeof METRICS)[number]["key"];

function MapView() {
  const [metric, setMetric] = useState<MetricKey>("members");
  const [zone, setZone] = useState("All zones");
  const [sel, setSel] = useState<string>("lagos");
  const rows = stateActivity.filter((s) => zone === "All zones" || s.zone === zone);
  const max = Math.max(...stateActivity.map((s) => s[metric]));
  const level = (v: number) => Math.min(4, Math.floor((v / max) * 5));
  const cur = stateActivity.find((s) => s.slug === sel);
  const capital = states.find((s) => s.slug === sel)?.capital;
  return (
    <div className="ofc-stack">
      <Panel title="Coverage by state">
        <div className="ofc-filters">
          <SelectField label="Show" value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)} options={METRICS.map((m) => ({ value: m.key, label: m.label }))} />
          <SelectField label="Zone" value={zone} onChange={(e) => setZone(e.target.value)} options={["All zones", "North Central", "North East", "North West", "South East", "South South", "South West"]} />
        </div>
        <div className="tile-map" role="group" aria-label={`States shaded by ${metric}`}>
          {rows.map((s) => (
            <button key={s.slug} type="button" data-level={level(s[metric])} aria-pressed={sel === s.slug} onClick={() => setSel(s.slug)} title={`${s.state}: ${fmtInt(s[metric])}`}>
              {s.state}
            </button>
          ))}
        </div>
        <p className="legend">
          Low <i style={{ background: "var(--surface-sunk)" }} />
          <i style={{ background: "color-mix(in srgb, var(--brand-green) 40%, var(--surface))" }} />
          <i style={{ background: "var(--brand-green-deep)" }} /> High · Select a state for detail
        </p>
      </Panel>
      <Grid cols={2}>
        {cur && (
          <Panel title={`${cur.state}${capital ? ` (capital ${capital})` : ""}`}>
            <dl className="facts facts-2">
              <div><dt>Zone</dt><dd>{cur.zone}</dd></div>
              <div><dt>Members</dt><dd>{fmtInt(cur.members)}</dd></div>
              <div><dt>Ward leaders</dt><dd>{fmtInt(cur.wardLeaders)}</dd></div>
              <div><dt>Street leaders</dt><dd>{fmtInt(cur.streetLeaders)}</dd></div>
              <div><dt>Projects delivered</dt><dd>{fmtInt(cur.delivered)}</dd></div>
              <div><dt>National rank (members)</dt><dd>{[...stateActivity].sort((a, b) => b.members - a.members).findIndex((s) => s.slug === cur.slug) + 1} of 37</dd></div>
            </dl>
          </Panel>
        )}
        <Panel title="Diaspora chapters">
          <div className="ofc-scroll">
            <table className="ofc-table">
              <caption className="sr-only">Diaspora chapters by country</caption>
              <thead><tr><th scope="col">Country</th><th scope="col" className="num">Chapters</th><th scope="col" className="num">Members</th><th scope="col" className="num">Tell One</th></tr></thead>
              <tbody>
                {diaspora.map((d) => (
                  <tr key={d.country}><th scope="row">{d.country}</th><td className="num">{d.chapters}</td><td className="num">{fmtInt(d.members)}</td><td className="num">{fmtInt(d.tellOne)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ofc-small ofc-muted">Diaspora members support through chapters, Tell One and in-kind help. Funds from outside Nigeria are held for legal clearance.</p>
        </Panel>
      </Grid>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-3 Funding & spend */
function Funding() {
  const raised = spendCategories.reduce((n, c) => n + c.raised, 0);
  const spent = spendCategories.reduce((n, c) => n + c.spent, 0);
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Raised", value: nairaM(raised), sub: naira(raised) },
          { label: "Spent", value: nairaM(spent), sub: `${pct(spent, raised)} of funds raised` },
          { label: "Unspent balance", value: nairaM(raised - spent), sub: naira(raised - spent) },
          { label: "Spend this week", value: `₦${weeklySpend[weeklySpend.length - 1]}m`, trend: "up", sub: `from ₦${weeklySpend[weeklySpend.length - 2]}m last week` },
        ]}
      />
      <Grid cols={2}>
        <Panel title="Spent against raised, by category">
          <BarChart label="Spend by category against money raised" data={spendCategories.map((c) => ({ label: c.category, value: c.spent, target: c.raised }))} format={naira} />
          <p className="ofc-small ofc-muted">Bar = spent; marker = raised for that category.</p>
        </Panel>
        <Panel
          title="Category table"
          action={
            <button type="button" className="btn btn-sm btn-outline" onClick={() => downloadCsv("tbh-one-spend-by-category.csv", [["Category", "Raised (NGN)", "Spent (NGN)"], ...spendCategories.map((c) => [c.category, c.raised, c.spent])])}>
              Download CSV
            </button>
          }
        >
          <div className="ofc-scroll">
            <table className="ofc-table">
              <caption className="sr-only">Raised and spent by category</caption>
              <thead><tr><th scope="col">Category</th><th scope="col" className="num">Raised</th><th scope="col" className="num">Spent</th></tr></thead>
              <tbody>
                {spendCategories.map((c) => (
                  <tr key={c.category}><th scope="row">{c.category}</th><td className="num">{naira(c.raised)}</td><td className="num">{naira(c.spent)}</td></tr>
                ))}
              </tbody>
              <tfoot><tr><td>Total</td><td className="num">{naira(raised)}</td><td className="num">{naira(spent)}</td></tr></tfoot>
            </table>
          </div>
        </Panel>
      </Grid>
      <Notice title="Public transparency commitment">Every naira raised and spent is published on the public transparency page within 7 days of the Finance Controller releasing it.</Notice>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-4 Project pipeline */
function Pipeline({ projects, setProjects, me, addAudit }: { projects: PipelineProject[]; setProjects: (fn: (p: PipelineProject[]) => PipelineProject[]) => void; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [onlyStalled, setOnlyStalled] = useState(false);
  const advance = (p: PipelineProject) => {
    const next = STAGES[STAGES.indexOf(p.stage) + 1];
    if (!next) return;
    setProjects((all) => all.map((x) => (x.id === p.id ? { ...x, stage: next, daysInStage: 0, raised: next === "Funded" ? x.target : x.raised } : x)));
    addAudit(me, `moved ${p.id} to ${next}`);
    toast(`${p.id} moved to ${next}`);
  };
  const shown = onlyStalled ? projects.filter((p) => p.daysInStage > STALLED_DAYS && p.stage !== "Delivered") : projects;
  return (
    <div className="ofc-stack">
      <div className="ofc-row-between">
        <p className="ofc-muted ofc-small">Projects with no movement in {STALLED_DAYS}+ days are flagged as stalled.</p>
        <CheckField label="Show stalled only" checked={onlyStalled} onChange={(e) => setOnlyStalled(e.target.checked)} />
      </div>
      <div className="ofc-board">
        {STAGES.map((st) => {
          const col = shown.filter((p) => p.stage === st);
          return (
            <section key={st} className="ofc-col" aria-label={`${st} projects`}>
              <div className="ofc-col-head">
                <span>{st}</span>
                <Badge>{col.length}</Badge>
              </div>
              {col.length === 0 && <p className="ofc-small ofc-muted">None</p>}
              {col.map((p) => {
                const stalled = p.daysInStage > STALLED_DAYS && p.stage !== "Delivered";
                return (
                  <article key={p.id} className="ofc-card" data-tone={stalled ? "warn" : undefined}>
                    <div className="ofc-card-title">{p.title}</div>
                    <div className="ofc-meta">
                      <span>{p.id}</span>
                      <span>{p.state}</span>
                      <span>{p.daysInStage} days in stage</span>
                    </div>
                    <Meter value={p.raised} max={p.target} label={`${p.id} funding`} />
                    <span className="ofc-small">{naira(p.raised)} of {naira(p.target)}</span>
                    {stalled && <Badge tone="warn">Stalled</Badge>}
                    {st !== "Delivered" && (
                      <button type="button" className="btn btn-sm btn-outline" onClick={() => advance(p)}>
                        Move to {STAGES[STAGES.indexOf(st) + 1]}
                      </button>
                    )}
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-5 Content & media */
function Content() {
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Open creative briefs", value: contentStats.briefsOpen },
          { label: "Pieces in review", value: contentStats.inReview, tone: contentStats.inReview > 50 ? "warn" : undefined },
          { label: "Published to date", value: fmtInt(contentStats.published) },
          { label: "Paid ad spend", value: nairaM(contentStats.adSpend), sub: "Stops automatically at the cut-off" },
        ]}
      />
      <Grid cols={2}>
        <Panel title="Reach by channel (last 30 days)">
          <BarChart label="Reach by channel" data={contentStats.reach} />
        </Panel>
        <Panel title="Review rules">
          <ul className="rows" role="list">
            <li><div className="row-main"><strong>Brand check</strong><span className="ofc-small ofc-muted">Logo, colours and tagline in the approved form.</span></div><Badge tone="ok">Required</Badge></li>
            <li><div className="row-main"><strong>Fact check</strong><span className="ofc-small ofc-muted">Every claim links to a source in the Resources library.</span></div><Badge tone="ok">Required</Badge></li>
            <li><div className="row-main"><strong>Language review</strong><span className="ofc-small ofc-muted">Pidgin, Yorùbá, Hausa and Igbo versions by vetted translators.</span></div><Badge tone="ok">Required</Badge></li>
            <li><div className="row-main"><strong>No voting inducements</strong><span className="ofc-small ofc-muted">Nothing that offers gifts in exchange for votes or PVC details.</span></div><Badge tone="danger">Blocking</Badge></li>
          </ul>
        </Panel>
      </Grid>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-6 Countdown & calendar */
function Calendar() {
  const now = useNow(1000);
  const t = timeToElection(new Date(now));
  const cutoffMs = campaignDates.campaignCutoff.getTime() - now;
  return (
    <div className="ofc-stack">
      <Panel title="Countdown to Election Day, 16 January 2027">
        <div className="ofc-countdown" aria-live="off">
          <div><strong>{t.days}</strong><span>days</span></div>
          <div><strong>{t.hours}</strong><span>hours</span></div>
          <div><strong>{t.minutes}</strong><span>minutes</span></div>
        </div>
        <p className="ofc-small">
          Campaign cut-off (11:59 pm, Thursday 14 January 2027):{" "}
          <span className="ofc-timer" data-state={cutoffMs < 7 * 86_400_000 ? "danger" : cutoffMs < 30 * 86_400_000 ? "warn" : "ok"}>{cutoffMs > 0 ? fmtDuration(cutoffMs) : "passed"}</span>
        </p>
      </Panel>
      <Panel title="Key dates">
        <ol className="ofc-timeline">
          {calendarItems.map((c) => {
            const d = new Date(`${c.date}T12:00:00+01:00`).getTime();
            const days = Math.ceil((d - now) / 86_400_000);
            const past = days < 0;
            return (
              <li key={c.date} className={past ? "done" : days <= 14 ? "current" : ""}>
                <div className="ofc-row-between">
                  <span>
                    <strong>{shortDate(`${c.date}T12:00:00+01:00`)}</strong> — {c.title}
                  </span>
                  <Badge tone={past ? "muted" : days <= 14 ? "warn" : "info"}>{past ? "Done" : days === 0 ? "Today" : `in ${days} days`}</Badge>
                </div>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-7 Risk panel */
type Risk = { id: string; area: string; title: string; severity: "High" | "Medium" | "Low"; owner: string; status: "Open" | "Mitigating" | "Closed"; note?: string };
const seedRisks: Risk[] = [
  { id: "R-01", area: "Safeguarding", title: "1 critical incident open in the safeguarding queue", severity: "High", owner: "Safeguarding Officer", status: "Open" },
  { id: "R-02", area: "Finance", title: "3 contributions held for legal review (foreign source)", severity: "Medium", owner: "Finance Controller", status: "Mitigating" },
  { id: "R-03", area: "Platform", title: "Load test before the cut-off not yet scheduled", severity: "Medium", owner: "Tech lead", status: "Open" },
  { id: "R-04", area: "Reputation", title: "Fake ‘TBH One giveaway’ pages on social media asking for PVC numbers", severity: "High", owner: "Comms lead", status: "Open" },
  { id: "R-05", area: "Shop", title: "Wristband stock below reorder level", severity: "Low", owner: "Shop Operations", status: "Mitigating" },
];
function Risk({ projects, me, addAudit }: { projects: PipelineProject[]; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [risks, setRisks] = usePersisted<Risk[]>("tbh-ofc-nc-risks", seedRisks);
  const [edit, setEdit] = useState<Risk | null>(null);
  const [note, setNote] = useState("");
  const stalled = projects.filter((p) => p.daysInStage > STALLED_DAYS && p.stage !== "Delivered");
  const tone = (s: Risk["severity"]): Tone => (s === "High" ? "danger" : s === "Medium" ? "warn" : "info");
  const open = risks.filter((r) => r.status !== "Closed");
  return (
    <div className="ofc-stack">
      {open.some((r) => r.severity === "High") && (
        <div className="banner-critical" role="alert">
          <AlertTriangle size={20} aria-hidden /> {open.filter((r) => r.severity === "High").length} high-severity risks need attention.
        </div>
      )}
      <Kpis
        items={[
          { label: "Open risks", value: open.length, tone: open.length ? "warn" : "ok" },
          { label: "High severity", value: open.filter((r) => r.severity === "High").length, tone: open.some((r) => r.severity === "High") ? "danger" : "ok" },
          { label: "Stalled projects", value: stalled.length, tone: stalled.length ? "warn" : "ok" },
        ]}
      />
      <div className="ofc-cards">
        {risks.map((r) => (
          <article key={r.id} className="ofc-card" data-tone={r.status === "Closed" ? "muted" : r.severity === "High" ? "danger" : r.severity === "Medium" ? "warn" : undefined}>
            <div className="ofc-card-head">
              <span className="ofc-card-title">{r.title}</span>
              <span className="ofc-row">
                <Badge tone={tone(r.severity)}>{r.severity}</Badge>
                <Badge tone={r.status === "Closed" ? "ok" : "muted"}>{r.status}</Badge>
              </span>
            </div>
            <div className="ofc-meta">
              <span>{r.id}</span>
              <span>{r.area}</span>
              <span>Owner: {r.owner}</span>
            </div>
            {r.note && <p className="ofc-small">Latest: {r.note}</p>}
            {r.status !== "Closed" && (
              <div className="ofc-actions">
                <button type="button" className="btn btn-sm btn-outline" onClick={() => { setEdit(r); setNote(""); }}>
                  Update
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {stalled.length > 0 && (
        <Panel title="Stalled projects">
          <ul className="rows" role="list">
            {stalled.map((p) => (
              <li key={p.id}>
                <div className="row-main"><strong>{p.title}</strong><span className="ofc-small ofc-muted">{p.id} · {p.state} · {p.stage} for {p.daysInStage} days</span></div>
                <Badge tone="warn">Stalled</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <Dialog
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit ? `Update ${edit.id}` : "Update"}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (!edit) return;
                setRisks((all) => all.map((x) => (x.id === edit.id ? { ...x, status: "Mitigating", note: note.trim() || x.note } : x)));
                addAudit(me, `updated risk ${edit.id} (mitigating)`);
                toast(`${edit.id} marked as mitigating`);
                setEdit(null);
              }}
            >
              Mark mitigating
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!edit) return;
                setRisks((all) => all.map((x) => (x.id === edit.id ? { ...x, status: "Closed", note: note.trim() || x.note } : x)));
                addAudit(me, `closed risk ${edit.id}`);
                toast(`${edit.id} closed`);
                setEdit(null);
              }}
            >
              Close risk
            </button>
          </>
        }
      >
        <TextArea label="What has been done?" value={note} onChange={(e) => setNote(e.target.value)} />
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- NC-8 Project publisher */
function Publisher({ projects, setProjects, me, addAudit }: { projects: PipelineProject[]; setProjects: (fn: (p: PipelineProject[]) => PipelineProject[]) => void; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [f, setF] = useState({ title: "", state: "", category: "", target: "", summary: "", publishNow: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const recent = projects.filter((p) => p.id >= "P-1053");
  return (
    <Grid cols={2}>
      <Panel title="Publish a fundable project">
        {done ? (
          <div className="ofc-stack">
            <Notice tone="ok" title={`${done} created`}>It now appears in the project pipeline{f.publishNow ? " and on the public Fund a Project page" : " awaiting approval"}.</Notice>
            <button type="button" className="btn btn-outline" onClick={() => { setDone(null); setF({ title: "", state: "", category: "", target: "", summary: "", publishNow: true }); }}>
              <Plus size={16} aria-hidden /> Publish another
            </button>
          </div>
        ) : (
          <form
            className="form-grid"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const er: Record<string, string> = {};
              if (f.title.trim().length < 8) er.title = "Give the project a clear title (at least 8 characters).";
              if (!f.state) er.state = "Choose a state.";
              if (!f.category) er.category = "Choose a spend category.";
              const amt = Number(f.target.replace(/[^\d]/g, ""));
              if (!amt || amt < 10_000) er.target = "Enter a target of at least ₦10,000.";
              else if (amt > 50_000_000) er.target = "Projects above ₦50m need board approval.";
              if (f.summary.trim().length < 30) er.summary = "Describe what the money buys and who benefits (at least 30 characters).";
              if (mentionsElectoral(`${f.title} ${f.summary}`)) er.summary = "Projects may not mention votes, PVCs, polling units or ballots.";
              setErrors(er);
              if (Object.keys(er).length) return;
              setBusy(true);
              await simulate(600);
              const id = `P-${1053 + recent.length}`;
              setProjects((all) => [...all, { id, title: f.title.trim(), state: f.state, stage: f.publishNow ? "Published" : "Proposed", target: amt, raised: 0, daysInStage: 0 }]);
              addAudit(me, `${f.publishNow ? "published" : "proposed"} project ${id}`);
              toast(`${id} saved`);
              setBusy(false);
              setDone(id);
            }}
          >
            <TextField label="Project title" value={f.title} onChange={set("title")} error={errors.title} required />
            <div className="form-grid form-grid-2">
              <SelectField label="State" value={f.state} onChange={set("state")} error={errors.state} placeholder="Choose…" options={states.map((s) => s.name)} required />
              <SelectField label="Spend category" value={f.category} onChange={set("category")} error={errors.category} placeholder="Choose…" options={spendCategories.map((c) => c.category)} required />
            </div>
            <TextField label="Target (₦)" inputMode="numeric" value={f.target} onChange={set("target")} error={errors.target} required />
            <TextArea label="What the money buys" value={f.summary} onChange={set("summary")} error={errors.summary} required hint="Shown publicly. Every naira spent will be published." />
            <CheckField label="Publish immediately (I have approval)" checked={f.publishNow} onChange={(e) => setF((x) => ({ ...x, publishNow: e.target.checked }))} />
            <button type="submit" className="btn btn-primary" disabled={busy}>
              <FilePlus size={16} aria-hidden /> {busy ? "Saving…" : f.publishNow ? "Publish project" : "Save as proposal"}
            </button>
          </form>
        )}
      </Panel>
      <Panel title="Recently published here">
        {recent.length === 0 ? (
          <EmptyState title="Nothing published yet" text="Projects you publish appear here and in the pipeline." />
        ) : (
          <ul className="rows" role="list">
            {recent.map((p) => (
              <li key={p.id}>
                <div className="row-main"><strong>{p.title}</strong><span className="ofc-small ofc-muted">{p.id} · {p.state} · target {naira(p.target)}</span></div>
                <Badge tone={p.stage === "Proposed" ? "muted" : "ok"}>{p.stage}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Grid>
  );
}

/* ---------------------------------------------------------------- NC-9 Giveaway manager */
type Prize = { id: string; date: string; prize: string; status: "Scheduled" | "Drawn" | "Published" | "Stopped"; winner?: string; log?: string };
const DEMO_ENTRANTS = [
  ["Adaeze", "Lagos"], ["Musa", "Kano"], ["Chinedu", "Enugu"], ["Aisha", "Kaduna"], ["Tunde", "Oyo"], ["Blessing", "Rivers"], ["Zainab", "Sokoto"], ["Efe", "Edo"],
  ["Ngozi", "Anambra"], ["Ibrahim", "FCT"], ["Kelechi", "Imo"], ["Halima", "Bauchi"], ["Seun", "Ogun"], ["Fatima", "Borno"], ["Emeka", "Abia"], ["Grace", "Benue"],
];
function Giveaways({ me, addAudit }: { me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [prizes, setPrizes] = usePersisted<Prize[]>("tbh-ofc-nc-prizes", [
    { id: "G-01", date: "2026-11-10", prize: "10 TBH One tagline T-shirts", status: "Scheduled" },
    { id: "G-02", date: "2026-11-11", prize: "5 caps and 5 wristband packs", status: "Scheduled" },
  ]);
  const [previewCutoff, setPreviewCutoff] = useState(false);
  const [form, setForm] = useState({ date: "", prize: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<Prize | null>(null);
  const phase = previewCutoff ? "cutoff" : phaseAt();
  const allowed = promotionsAllowed(phase);
  const stopAll = () => setPrizes((all) => all.map((p) => (p.status === "Scheduled" ? { ...p, status: "Stopped" } : p)));

  const draw = (p: Prize) => {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    const idx = buf[0] % DEMO_ENTRANTS.length;
    const [name, st] = DEMO_ENTRANTS[idx];
    const log = [
      `${new Date().toISOString()}  Draw ${p.id} started by ${me}`,
      `Prize: ${p.prize}`,
      `Eligible entries: ${DEMO_ENTRANTS.length} (members who opted in; no PVC or voting data used)`,
      `Random source: crypto.getRandomValues → 0x${buf[0].toString(16).padStart(8, "0")} (check 0x${buf[1].toString(16).padStart(8, "0")})`,
      `Index = ${buf[0]} mod ${DEMO_ENTRANTS.length} = ${idx}`,
      `Winner: entry #${idx + 1} — ${name}, ${st}`,
    ].join("\n");
    setPrizes((all) => all.map((x) => (x.id === p.id ? { ...x, status: "Drawn", winner: `${name}, ${st}`, log } : x)));
    addAudit(me, `ran recorded draw ${p.id}`);
    toast(`Draw recorded: ${name}, ${st}`);
  };

  return (
    <div className="ofc-stack">
      {!allowed ? (
        <Notice tone="warn" title="Giveaways stopped">
          The campaign cut-off has passed (11:59 pm, 14 January 2027). New giveaways, draws and publishing are switched off automatically.
        </Notice>
      ) : (
        <Notice title="Rules">Prizes are merchandise only — never cash. Entry never depends on voting, PVCs or support for any candidate. Winners are published by first name and state only.</Notice>
      )}
      <div className="ofc-switch-row">
        <CheckField
          label="Demo: preview the system after the cut-off"
          checked={previewCutoff}
          onChange={(e) => {
            setPreviewCutoff(e.target.checked);
            if (e.target.checked) stopAll();
          }}
        />
      </div>
      <Grid cols={2}>
        <Panel title="Schedule a daily prize">
          <form
            className="form-grid"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const er: Record<string, string> = {};
              if (!form.date) er.date = "Choose a date.";
              else if (new Date(`${form.date}T12:00:00+01:00`) >= campaignDates.campaignCutoff) er.date = "Giveaways must end before the campaign cut-off on 14 January 2027.";
              if (form.prize.trim().length < 4) er.prize = "Describe the prize.";
              else if (/₦|naira|cash|money|transfer/i.test(form.prize)) er.prize = "Prizes must be merchandise, not cash or transfers.";
              else if (mentionsElectoral(form.prize)) er.prize = "Prizes may not mention votes, PVCs or polling.";
              setErr(er);
              if (Object.keys(er).length) return;
              const id = `G-${String(prizes.length + 1).padStart(2, "0")}`;
              setPrizes((all) => [...all, { id, date: form.date, prize: form.prize.trim(), status: "Scheduled" }]);
              addAudit(me, `scheduled giveaway ${id}`);
              toast(`${id} scheduled`);
              setForm({ date: "", prize: "" });
            }}
          >
            <TextField label="Draw date" type="date" value={form.date} onChange={(e) => setForm((x) => ({ ...x, date: e.target.value }))} error={err.date} disabled={!allowed} required />
            <TextField label="Prize" value={form.prize} onChange={(e) => setForm((x) => ({ ...x, prize: e.target.value }))} error={err.prize} disabled={!allowed} required hint="For example: 10 tagline T-shirts" />
            <button type="submit" className="btn btn-primary" disabled={!allowed}>
              <Gift size={16} aria-hidden /> Schedule
            </button>
          </form>
        </Panel>
        <Panel title="Entrants (demo)">
          <p className="ofc-small ofc-muted">{DEMO_ENTRANTS.length} members opted in. Only first name and state are shown.</p>
          <p className="ofc-small">{DEMO_ENTRANTS.map(([n, s]) => `${n} (${s})`).join(", ")}</p>
        </Panel>
      </Grid>
      <div className="ofc-cards">
        {prizes.map((p) => (
          <article key={p.id} className="ofc-card" data-tone={p.status === "Published" ? "ok" : p.status === "Stopped" ? "muted" : undefined}>
            <div className="ofc-card-head">
              <span className="ofc-card-title">{p.id} · {p.prize}</span>
              <Badge tone={p.status === "Published" ? "ok" : p.status === "Drawn" ? "info" : p.status === "Stopped" ? "muted" : "warn"}>{p.status}</Badge>
            </div>
            <div className="ofc-meta"><span><CalendarClock size={14} aria-hidden /> {shortDate(`${p.date}T12:00:00+01:00`)}</span>{p.winner && <span><Trophy size={14} aria-hidden /> {p.winner}</span>}</div>
            {p.log && <pre className="ofc-log" aria-label={`Draw log for ${p.id}`}>{p.log}</pre>}
            <div className="ofc-actions">
              {p.status === "Scheduled" && (
                <button type="button" className="btn btn-sm btn-primary" disabled={!allowed} onClick={() => setConfirm(p)}>
                  <Dice5 size={16} aria-hidden /> Run recorded draw
                </button>
              )}
              {p.status === "Drawn" && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  disabled={!allowed}
                  onClick={() => {
                    setPrizes((all) => all.map((x) => (x.id === p.id ? { ...x, status: "Published" } : x)));
                    addAudit(me, `published winner of ${p.id}`);
                    toast(`Winner published: ${p.winner}`);
                  }}
                >
                  <CheckCircle2 size={16} aria-hidden /> Publish winner
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) draw(confirm);
          setConfirm(null);
        }}
        title="Run the draw?"
        text="The draw uses your browser's cryptographic random number generator. The result and full log are recorded and cannot be re-run."
        confirmLabel="Run draw"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- NC-10 Users & roles */
type Pending = { kind: "grant" | "revoke" | "suspend" | "reinstate"; user: ManagedUser; role?: string };
function Users({ me, audit, addAudit }: { me: string; audit: { at: string; who: string; what: string }[]; addAudit: AddAudit }) {
  const toast = useToast();
  const [users, setUsers] = usePersisted<ManagedUser[]>("tbh-ofc-nc-users", managedUsers);
  const [grantFor, setGrantFor] = useState<ManagedUser | null>(null);
  const [grantRole, setGrantRole] = useState("");
  const [grantErr, setGrantErr] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState("");
  const [vetFilter, setVetFilter] = useState("All");
  const rows = useMemo(() => users.filter((u) => vetFilter === "All" || u.vetting === vetFilter), [users, vetFilter]);

  const apply = () => {
    if (!pending) return;
    const { kind, user: u, role } = pending;
    if ((kind === "suspend" || kind === "revoke") && reason.trim().length < 5) return setReasonErr("Give a reason (at least 5 characters). It goes in the audit log.");
    setUsers((all) =>
      all.map((x) => {
        if (x.id !== u.id) return x;
        if (kind === "grant" && role) return { ...x, roles: [...x.roles, role] };
        if (kind === "revoke" && role) return { ...x, roles: x.roles.filter((r) => r !== role) };
        if (kind === "suspend") return { ...x, status: "Suspended" };
        return { ...x, status: "Active" };
      }),
    );
    const what = kind === "grant" ? `granted ${role} to ${u.name} (${u.id})` : kind === "revoke" ? `revoked ${role} from ${u.name} (${u.id}) — ${reason.trim()}` : kind === "suspend" ? `suspended ${u.name} (${u.id}) — ${reason.trim()}` : `reinstated ${u.name} (${u.id})`;
    addAudit(me, what);
    toast(what.charAt(0).toUpperCase() + what.slice(1));
    setPending(null);
    setReason("");
    setReasonErr("");
  };

  const columns: Column<ManagedUser>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "state", header: "State", sortable: true },
    {
      key: "roles",
      header: "Roles",
      value: (u) => u.roles.join(", "),
      render: (u) => (
        <span className="ofc-row">
          {u.roles.map((r) =>
            r === "Member" ? (
              <Badge key={r}>{r}</Badge>
            ) : (
              <button key={r} type="button" className="badge badge-info" title={`Revoke ${r}`} aria-label={`Revoke ${r} from ${u.name}`} onClick={() => setPending({ kind: "revoke", user: u, role: r })}>
                {r} ×
              </button>
            ),
          )}
        </span>
      ),
    },
    { key: "vetting", header: "Vetting", sortable: true, render: (u) => <Badge tone={u.vetting === "Vetted" ? "ok" : u.vetting === "Failed" ? "danger" : "warn"}>{u.vetting}</Badge> },
    { key: "status", header: "Status", sortable: true, render: (u) => <Badge tone={u.status === "Active" ? "ok" : "danger"}>{u.status}</Badge> },
  ];

  return (
    <div className="ofc-stack">
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(u) => u.id}
        caption="Users and roles"
        searchPlaceholder="Search name, ID, state or role"
        filters={<SelectField label="Vetting" value={vetFilter} onChange={(e) => setVetFilter(e.target.value)} options={["All", "Vetted", "Pending", "Failed"]} />}
        actions={(u) => (
          <span className="ofc-actions">
            <button type="button" className="btn btn-sm btn-outline" disabled={u.status === "Suspended"} onClick={() => { setGrantFor(u); setGrantRole(""); setGrantErr(""); }}>
              <UserPlus size={14} aria-hidden /> Grant role
            </button>
            {u.status === "Active" ? (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setPending({ kind: "suspend", user: u })}>
                <Ban size={14} aria-hidden /> Suspend
              </button>
            ) : (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setPending({ kind: "reinstate", user: u })}>
                <ShieldCheck size={14} aria-hidden /> Reinstate
              </button>
            )}
          </span>
        )}
      />
      <Panel title="Role changes audit log">{audit.length ? <AuditList items={audit.slice(0, 15)} /> : <p className="ofc-muted">No changes recorded yet.</p>}</Panel>
      <Dialog
        open={!!grantFor}
        onClose={() => setGrantFor(null)}
        title={grantFor ? `Grant a role to ${grantFor.name}` : "Grant role"}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setGrantFor(null)}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!grantFor) return;
                if (!grantRole) return setGrantErr("Choose a role.");
                if (grantFor.roles.includes(grantRole)) return setGrantErr("They already have this role.");
                if (LEADER_ROLES.includes(grantRole) && grantFor.vetting !== "Vetted") return setGrantErr("Leadership roles need completed vetting first.");
                setPending({ kind: "grant", user: grantFor, role: grantRole });
                setGrantFor(null);
              }}
            >
              Continue
            </button>
          </>
        }
      >
        <SelectField label="Role" value={grantRole} onChange={(e) => setGrantRole(e.target.value)} placeholder="Choose…" options={grantableRoles} error={grantErr} hint={grantFor ? `Vetting: ${grantFor.vetting}` : undefined} />
      </Dialog>
      <ConfirmDialog
        open={!!pending}
        onCancel={() => { setPending(null); setReason(""); setReasonErr(""); }}
        onConfirm={apply}
        danger={pending?.kind === "suspend" || pending?.kind === "revoke"}
        title={pending ? { grant: "Grant role?", revoke: "Revoke role?", suspend: "Suspend account?", reinstate: "Reinstate account?" }[pending.kind] : ""}
        confirmLabel={pending ? { grant: "Grant", revoke: "Revoke", suspend: "Suspend", reinstate: "Reinstate" }[pending.kind] : "Confirm"}
        text={
          pending && (
            <div className="form-grid">
              <p>
                {pending.kind === "grant" && <>Give <strong>{pending.user.name}</strong> the <strong>{pending.role}</strong> role? They'll see the matching dashboard next time they sign in.</>}
                {pending.kind === "revoke" && <>Remove <strong>{pending.role}</strong> from <strong>{pending.user.name}</strong>?</>}
                {pending.kind === "suspend" && <><UserMinus size={14} aria-hidden /> <strong>{pending.user.name}</strong> will be signed out and lose access to every dashboard until reinstated.</>}
                {pending.kind === "reinstate" && <>Restore access for <strong>{pending.user.name}</strong>?</>}
              </p>
              {(pending.kind === "suspend" || pending.kind === "revoke") && <TextArea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} error={reasonErr} required />}
              <p className="ofc-small ofc-muted">Recorded in the audit log as {me}, {stamp()}.</p>
            </div>
          )
        }
      />
    </div>
  );
}

/* ---------------------------------------------------------------- NC-11 Search & AI visibility */
function Visibility() {
  const totals = aiVisibility.panel.reduce((a, p) => ({ m: a.m + p.mentioned, c: a.c + p.cited }), { m: 0, c: 0 });
  const n = aiVisibility.panel.length * 50;
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Search visits (30 days)", value: compact(aiVisibility.visitsByLanguage.reduce((s, v) => s + v.value, 0)) },
          { label: "AI answers mentioning TBH One", value: pct(totals.m, n), sub: `${totals.m} of ${n} test questions` },
          { label: "AI answers citing our site", value: pct(totals.c, n), sub: `${totals.c} of ${n}` },
          { label: "Core Web Vitals", value: aiVisibility.vitals.every((v) => v.ok) ? "Passing" : "Failing", tone: aiVisibility.vitals.every((v) => v.ok) ? "ok" : "danger" },
        ]}
      />
      <Grid cols={2}>
        <Panel title="Visits by language">
          <BarChart label="Search visits by language" data={aiVisibility.visitsByLanguage} />
        </Panel>
        <Panel title="Top search queries">
          <div className="ofc-scroll">
            <table className="ofc-table">
              <caption className="sr-only">Top search queries by clicks</caption>
              <thead><tr><th scope="col">Query</th><th scope="col" className="num">Clicks</th></tr></thead>
              <tbody>{aiVisibility.topQueries.map((q) => <tr key={q.q}><td>{q.q}</td><td className="num">{fmtInt(q.clicks)}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="ofc-small ofc-muted">Queries about PVCs are answered with neutral information and a link to INEC.</p>
        </Panel>
        <Panel title="AI answer panel (50 test questions per engine)">
          <div className="ofc-scroll">
            <table className="ofc-table">
              <caption className="sr-only">AI engine answer quality</caption>
              <thead><tr><th scope="col">Engine</th><th scope="col" className="num">Mentioned</th><th scope="col" className="num">Accurate</th><th scope="col" className="num">Cited</th></tr></thead>
              <tbody>{aiVisibility.panel.map((p) => <tr key={p.engine}><th scope="row">{p.engine}</th><td className="num">{p.mentioned}</td><td className="num">{p.accurate}</td><td className="num">{p.cited}</td></tr>)}</tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Core Web Vitals and crawlers">
          <ul className="rows" role="list">
            {aiVisibility.vitals.map((v) => (
              <li key={v.metric}><div className="row-main"><strong>{v.metric}</strong><span className="ofc-small ofc-muted">Target {v.target}</span></div><Badge tone={v.ok ? "ok" : "danger"}>{v.value}</Badge></li>
            ))}
          </ul>
          <BarChart label="Crawler visits, last 30 days" data={aiVisibility.crawlers.map((c) => ({ label: c.bot, value: c.visits }))} />
        </Panel>
      </Grid>
    </div>
  );
}

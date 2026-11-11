"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowUpRight, Check, Download, Lock, ShieldAlert, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { BarChart, Badge, Kpis, Meter, Panel, naira } from "@/components/dashboard/kit";
import { CheckField, SelectField, TextArea, simulate } from "@/components/ui/Form";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { stateApprovals, stateEvents, stateIncidents, stateLgas, stateLogistics, statePayments, statePipeline } from "@/data/mock/field";
import { AuditPanel, DemoTag, download, fmtDate, toCsv, useAudit, usePersisted } from "./field/common";

type Lga = (typeof stateLgas)[number];
const STAGES = ["Proposed", "Approved", "Published", "Funded", "Delivered"] as const;
const coverage = (l: Lga) => Math.round((l.leaders / l.wards) * 100);
/** Response targets by severity (minutes). */
const TARGET_MIN: Record<string, number> = { Critical: 60, High: 24 * 60, Medium: 72 * 60, Low: 7 * 24 * 60 };

export default function StateCoordinatorDashboard({ section }: { section: string }) {
  return <DashboardShell role="state-coordinator" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const audit = useAudit("state", `${user.firstName} ${user.lastName} (state coordinator)`);
  switch (section) {
    case "map":
      return <MapView />;
    case "weak-spots":
      return <WeakSpots log={audit.log} />;
    case "pipeline":
      return <Pipeline />;
    case "approvals":
      return <Approvals log={audit.log} items={audit.items} />;
    case "logistics":
      return <Logistics />;
    case "events":
      return <Events log={audit.log} />;
    case "incidents":
      return <Incidents log={audit.log} />;
    case "payments":
      return <Payments log={audit.log} user={user} />;
    case "leaderboards":
      return <Leaderboards />;
    case "export":
      return <Export log={audit.log} items={audit.items} />;
    default:
      return <Scorecard />;
  }
}

const StateLine = () => (
  <p className="ward-name">
    Kaduna State · {stateLgas.length} of 23 LGAs shown <DemoTag />
  </p>
);

/* ST-1 */
function Scorecard() {
  const tot = stateLgas.reduce((a, l) => ({ wards: a.wards + l.wards, leaders: a.leaders + l.leaders, members: a.members + l.members, streets: a.streets + l.streetsCovered }), { wards: 0, leaders: 0, members: 0, streets: 0 });
  const kpis = [
    { label: "Members", value: tot.members, target: 120000 },
    { label: "Wards led", value: tot.leaders, target: tot.wards },
    { label: "Streets covered", value: tot.streets, target: 900 },
    { label: "Events (month)", value: 14, target: 20 },
    { label: "Projects done", value: 6, target: 12 },
  ];
  return (
    <>
      <StateLine />
      <Kpis
        items={[
          { label: "Members", value: tot.members.toLocaleString("en-NG"), sub: `${Math.round((tot.members / 120000) * 100)}% of target`, trend: "up" },
          { label: "Ward coverage", value: `${Math.round((tot.leaders / tot.wards) * 100)}%`, sub: `${tot.leaders} of ${tot.wards} wards`, tone: "warn" },
          { label: "Open incidents", value: stateIncidents.length, sub: "1 critical", tone: "danger" },
          { label: "Payments awaiting you", value: statePayments.length, sub: "Second review" },
        ]}
      />
      <Panel title="Scorecard against targets">
        <p className="small muted">Bars show progress as a percentage of each target; the marker is 100%.</p>
        <BarChart label="State scorecard, percent of target" format={(n) => `${n}%`} data={kpis.map((k) => ({ label: k.label, value: Math.round((k.value / k.target) * 100), target: 100 }))} />
        <dl className="kv">
          {kpis.map((k) => (
            <div key={k.label} className="kv-row">
              <dt>{k.label}</dt>
              <dd>
                {k.value.toLocaleString("en-NG")} of {k.target.toLocaleString("en-NG")}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
    </>
  );
}

/* ST-2 */
function MapView() {
  const [sel, setSel] = useState<string | null>(null);
  const l = stateLgas.find((x) => x.lga === sel);
  return (
    <>
      <StateLine />
      <Panel title="Activity by LGA">
        <p className="small muted">Select an LGA to see ward detail. A text table follows the map.</p>
        <div className="tile-map tile-map-wide">
          {stateLgas.map((x) => (
            <button key={x.lga} type="button" className="lga-tile" data-level={x.activity} aria-pressed={sel === x.lga} onClick={() => setSel(sel === x.lga ? null : x.lga)}>
              {x.lga}
              <br />
              {coverage(x)}% wards
            </button>
          ))}
        </div>
        <p className="legend">
          {["No activity", "Low", "Moderate", "Good", "Strong"].map((t, i) => (
            <span key={t}>
              <i className="legend-swatch" data-level={i} />
              {t}
            </span>
          ))}
        </p>
        {l && (
          <Notice tone="info" title={l.lga}>
            {l.leaders} ward leaders across {l.wards} wards · {l.streetsCovered} streets covered · {l.members.toLocaleString("en-NG")} members · {l.overdue} overdue approvals
          </Notice>
        )}
      </Panel>
      <Panel title="LGA table (text equivalent)">
        <DataTable
          rows={stateLgas}
          rowKey={(r) => r.lga}
          caption="Activity by LGA"
          searchPlaceholder="Search LGAs"
          columns={[
            { key: "lga", header: "LGA", sortable: true },
            { key: "activity", header: "Activity", sortable: true, value: (r) => r.activity, render: (r) => ["None", "Low", "Moderate", "Good", "Strong"][r.activity] },
            { key: "leaders", header: "Ward leaders", align: "right", sortable: true, value: (r) => r.leaders, render: (r) => `${r.leaders}/${r.wards}` },
            { key: "streetsCovered", header: "Streets", align: "right", sortable: true, value: (r) => r.streetsCovered },
            { key: "members", header: "Members", align: "right", sortable: true, value: (r) => r.members, render: (r) => r.members.toLocaleString("en-NG") },
          ]}
        />
      </Panel>
    </>
  );
}

/* ST-3 */
function WeakSpots({ log }: { log: (w: string) => void }) {
  const weak = stateLgas.filter((l) => coverage(l) < 50 || l.overdue > 1).sort((a, b) => coverage(a) - coverage(b));
  const [actioned, setActioned] = usePersisted<string[]>("tbh-st-weak", []);
  const toast = useToast();
  return (
    <Panel title={`Weak spots · ${weak.length} LGAs`} action={<DemoTag />}>
      <p className="small muted">LGAs under 50% ward coverage or with more than one overdue approval.</p>
      <ul className="rows">
        {weak.map((l) => (
          <li key={l.lga}>
            <span className="row-main">
              <strong>{l.lga}</strong>
              <span className="small muted">
                {coverage(l)}% of wards have a leader · {l.overdue} overdue approvals · {l.streetsCovered} streets covered
              </span>
            </span>
            <span className="row-actions">
              {l.leaders === 0 && <Badge tone="danger">No ward leaders</Badge>}
              {l.overdue > 1 && <Badge tone="warn">Overdue approvals</Badge>}
              {actioned.includes(l.lga) ? (
                <Badge tone="ok">Recruitment drive started</Badge>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setActioned([...actioned, l.lga]);
                    log(`started recruitment drive in ${l.lga}`);
                    toast(`Recruitment drive started in ${l.lga}`);
                  }}
                >
                  Start recruitment drive
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ST-4 */
function Pipeline() {
  const lgas = Array.from(new Set(statePipeline.map((p) => p.lga)));
  return (
    <>
      <Panel title="Projects by stage">
        <BarChart label="Projects by stage" data={STAGES.map((s) => ({ label: s, value: statePipeline.filter((p) => p.stage === s).length }))} />
      </Panel>
      <Panel title="Pipeline by LGA" action={<DemoTag />}>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Pipeline by LGA table">
          <table className="pipe-table">
            <caption className="sr-only">Number of projects at each stage, by LGA</caption>
            <thead>
              <tr>
                <th scope="col">LGA</th>
                {STAGES.map((s) => (
                  <th key={s} scope="col">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lgas.map((l) => (
                <tr key={l}>
                  <th scope="row">{l}</th>
                  {STAGES.map((s) => (
                    <td key={s}>{statePipeline.filter((p) => p.lga === l && p.stage === s).length || "–"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="All projects">
        <DataTable
          rows={statePipeline}
          rowKey={(r) => r.id}
          caption="State project pipeline"
          columns={[
            { key: "title", header: "Project", sortable: true },
            { key: "lga", header: "LGA", sortable: true },
            { key: "cost", header: "Cost", align: "right", sortable: true, value: (r) => r.cost, render: (r) => naira(r.cost) },
            { key: "stage", header: "Stage", sortable: true, render: (r) => <Badge tone={r.stage === "Delivered" ? "ok" : r.stage === "Proposed" ? "warn" : "info"}>{r.stage}</Badge> },
          ]}
        />
      </Panel>
    </>
  );
}

/* ST-5 */
function Approvals({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  const [done, setDone] = usePersisted<Record<string, { d: "Approved" | "Declined"; reason?: string }>>("tbh-st-approvals", {});
  const [declining, setDeclining] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  const toast = useToast();
  const decide = (id: string, d: "Approved" | "Declined", r?: string) => {
    setDone({ ...done, [id]: { d, reason: r } });
    log(`${d.toLowerCase()} ${id}${r ? ` — ${r}` : ""}`);
    toast(`${id} ${d.toLowerCase()}`);
  };
  return (
    <>
      <Panel title="Approvals" action={<DemoTag />}>
        <ul className="rows">
          {stateApprovals.map((a) => {
            const blocked = a.detail.includes("pending");
            return (
              <li key={a.id}>
                <span className="row-main">
                  <strong>
                    {a.kind}: {a.subject}
                  </strong>
                  <span className="small muted">
                    {a.id} · {a.detail} · waiting {a.age}
                  </span>
                </span>
                <span className="row-actions">
                  {done[a.id] ? (
                    <>
                      <Badge tone={done[a.id].d === "Approved" ? "ok" : "danger"}>{done[a.id].d}</Badge>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          const n = { ...done };
                          delete n[a.id];
                          setDone(n);
                          log(`reopened ${a.id}`);
                        }}
                      >
                        Undo
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn btn-sm btn-primary" disabled={blocked} onClick={() => decide(a.id, "Approved")}>
                        <Check size={16} aria-hidden /> Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          setDeclining(a.id);
                          setReason("");
                          setErr("");
                        }}
                      >
                        <X size={16} aria-hidden /> Decline
                      </button>
                      {blocked && <span className="disabled-why"><Lock size={14} aria-hidden /> Approve unlocks when the ID check clears</span>}
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
      <AuditPanel items={items} />
      <Dialog
        open={!!declining}
        onClose={() => setDeclining(null)}
        title={`Decline ${declining ?? ""}`}
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setDeclining(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (reason.trim().length < 5) return setErr("Give a reason; it is shared with the applicant.");
                if (declining) decide(declining, "Declined", reason.trim());
                setDeclining(null);
              }}
            >
              Decline
            </button>
          </>
        }
      >
        <TextArea label="Reason" required value={reason} onChange={(e) => setReason(e.target.value)} error={err} rows={3} />
      </Dialog>
    </>
  );
}

/* ST-6 */
function Logistics() {
  return (
    <Panel title="Materials & logistics" action={<DemoTag />}>
      <DataTable
        rows={stateLogistics}
        rowKey={(r) => r.item}
        caption="Materials from warehouse to wards"
        columns={[
          { key: "item", header: "Item" },
          { key: "warehouse", header: "Received at state", align: "right", render: (r) => r.warehouse.toLocaleString("en-NG") },
          { key: "dispatched", header: "Dispatched to wards", align: "right", render: (r) => r.dispatched.toLocaleString("en-NG") },
          { key: "confirmed", header: "Confirmed by wards", align: "right", render: (r) => r.confirmed.toLocaleString("en-NG") },
          { key: "gap", header: "Unconfirmed", align: "right", render: (r) => <Badge tone={r.dispatched - r.confirmed > 1000 ? "warn" : "muted"}>{(r.dispatched - r.confirmed).toLocaleString("en-NG")}</Badge> },
        ]}
      />
      <p className="small muted" style={{ marginTop: "var(--s4)" }}>
        Share of stock received that wards have confirmed delivering
      </p>
      {stateLogistics.map((r) => (
        <div key={r.item} style={{ display: "grid", gridTemplateColumns: "6rem 1fr 3rem", gap: "var(--s3)", alignItems: "center", marginTop: "var(--s2)" }}>
          <span className="small">{r.item}</span>
          <Meter value={r.confirmed} max={r.warehouse} label={`${r.item}: confirmed delivered of stock received`} />
          <span className="small" style={{ textAlign: "right" }}>
            {Math.round((r.confirmed / Math.max(1, r.warehouse)) * 100)}%
          </span>
        </div>
      ))}
    </Panel>
  );
}

/* ST-7 */
function Events({ log }: { log: (w: string) => void }) {
  const [notices, setNotices] = usePersisted<string[]>("tbh-st-police", []);
  const toast = useToast();
  return (
    <Panel title="Events across the state" action={<DemoTag />}>
      <ul className="rows">
        {stateEvents.map((e) => {
          const police = e.policeNotice || notices.includes(e.id);
          const items = e.checklist + (police && !e.policeNotice ? 1 : 0);
          return (
            <li key={e.id}>
              <span className="row-main">
                <strong>{e.title}</strong>
                <span className="small muted">
                  {e.lga} · {fmtDate(e.date)} · safety checklist {items}/5
                </span>
                <Meter value={items} max={5} label={`${e.title} safety checklist`} />
              </span>
              <span className="row-actions">
                <Badge tone={police ? "ok" : "danger"}>{police ? "Police notice filed" : "Police notice missing"}</Badge>
                <Badge tone={items >= 5 ? "ok" : "warn"}>{items >= 5 ? "Can publish" : "Publishing blocked"}</Badge>
                {!police && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setNotices([...notices, e.id]);
                      log(`recorded police notice for ${e.title}`);
                      toast("Police notice recorded");
                    }}
                  >
                    Record police notice
                  </button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ST-8 — countdown, critical banner, escalate */
function Countdown({ reportedAt, severity }: { reportedAt: number; severity: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (now === null) return <span className="timer">…</span>;
  const left = reportedAt + TARGET_MIN[severity] * 60_000 - now;
  const abs = Math.abs(left);
  const h = Math.floor(abs / 3600_000);
  const m = Math.floor((abs % 3600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const txt = `${h ? `${h}h ` : ""}${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return <span className={`timer ${left < 30 * 60_000 ? "timer-danger" : ""}`}>{left >= 0 ? `${txt} left to respond` : `Overdue by ${txt}`}</span>;
}
function Incidents({ log }: { log: (w: string) => void }) {
  const [state, setState] = usePersisted<Record<string, string>>("tbh-st-incidents", {});
  const [confirm, setConfirm] = useState<string | null>(null);
  const toast = useToast();
  const critical = stateIncidents.filter((i) => i.severity === "Critical" && !state[i.id]);
  return (
    <>
      {critical.map((i) => (
        <div key={i.id} className="banner-critical" role="alert">
          <ShieldAlert size={20} aria-hidden /> Critical: {i.type} ({i.lga}). Respond within 1 hour.
        </div>
      ))}
      <Panel title="Incident queue" action={<DemoTag />}>
        <ul className="plain-list">
          {stateIncidents.map((i) => (
            <li key={i.id} className="incident-card" data-sev={i.severity}>
              <div className="proof-head">
                <strong>{i.type}</strong>
                <Badge tone={i.severity === "Critical" ? "danger" : i.severity === "High" ? "warn" : "muted"}>{i.severity}</Badge>
              </div>
              <p className="small muted">
                {i.id} · {i.lga} · response target {i.severity === "Critical" ? "1 hour" : i.severity === "High" ? "24 hours" : "7 days"}
              </p>
              {state[i.id] ? (
                <p>
                  <Badge tone="info">{state[i.id]}</Badge>
                </p>
              ) : (
                <>
                  <p>
                    <Countdown reportedAt={i.reportedAt} severity={i.severity} />
                  </p>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setState({ ...state, [i.id]: "Acknowledged — responding" });
                        log(`acknowledged ${i.id}`);
                        toast("Acknowledged");
                      }}
                    >
                      Acknowledge
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => setConfirm(i.id)}>
                      <ArrowUpRight size={16} aria-hidden /> Escalate to National Lead
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="small muted">Sexual-abuse reports never appear here; they route directly to the National Safeguarding Lead.</p>
      </Panel>
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        danger
        title="Escalate to the National Lead?"
        text={<p>The national incident desk is paged immediately and takes ownership. You stay copied on updates.</p>}
        confirmLabel="Escalate"
        onConfirm={() => {
          if (confirm) {
            setState({ ...state, [confirm]: "Escalated to National Lead" });
            log(`escalated ${confirm} to National Lead`);
            toast("Escalated to the National Lead");
          }
          setConfirm(null);
        }}
      />
    </>
  );
}

/* ST-9 — payments over threshold need a second reviewer */
function Payments({ log, user }: { log: (w: string) => void; user: DemoUser }) {
  const [done, setDone] = usePersisted<Record<string, string>>("tbh-st-payments", {});
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();
  return (
    <Panel title="Payments awaiting second review" action={<DemoTag />}>
      <Notice tone="info" title="Two-person rule">
        Payments over ₦50,000 need a second reviewer who is not the first approver. You approve; Finance releases (GR-5).
      </Notice>
      <ul className="rows">
        {statePayments.map((p) => (
          <li key={p.id}>
            <span className="row-main">
              <strong>
                {naira(p.amount)} · {p.payee}
              </strong>
              <span className="small muted">
                {p.id} · {p.firstReview} · {p.reason}
              </span>
            </span>
            <span className="row-actions">
              {done[p.id] ? (
                <Badge tone={done[p.id] === "Second review approved" ? "ok" : "danger"}>{done[p.id]}</Badge>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    disabled={busy === p.id}
                    onClick={async () => {
                      setBusy(p.id);
                      await simulate(600);
                      setBusy(null);
                      setDone({ ...done, [p.id]: "Second review approved" });
                      log(`second-review approved ${p.id} (${naira(p.amount)}) as ${user.firstName} ${user.lastName}`);
                      toast("Approved — sent to Finance for release");
                    }}
                  >
                    {busy === p.id ? "Approving…" : "Approve (2nd review)"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setDone({ ...done, [p.id]: "Returned to first reviewer" });
                      log(`returned ${p.id} to first reviewer`);
                    }}
                  >
                    Return
                  </button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ST-10 — opt-in only */
function Leaderboards() {
  const optedIn = stateLgas.filter((_, i) => i % 3 !== 2);
  return (
    <Panel title="Ward leader leaderboards" action={<DemoTag />}>
      <p className="small muted">Only LGAs whose leaders opted in to public ranking are shown. Ranking uses activity, not money raised.</p>
      <ol className="rank-list">
        {[...optedIn]
          .sort((a, b) => b.streetsCovered - a.streetsCovered)
          .map((l, i) => (
            <li key={l.lga}>
              <span className="rank-no">{i + 1}</span>
              <span style={{ flex: 1 }}>{l.lga}</span>
              <span>{l.streetsCovered} streets</span>
            </li>
          ))}
      </ol>
      <p className="small muted">{stateLgas.length - optedIn.length} LGAs hidden because leaders have not opted in.</p>
    </Panel>
  );
}

/* ST-11 — aggregated export only */
function Export({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  const [what, setWhat] = useState("LGA summary");
  const [ack, setAck] = useState(false);
  const [err, setErr] = useState("");
  const toast = useToast();
  const build = () => {
    if (what === "Project pipeline") return statePipeline.map((p) => ({ project_id: p.id, project: p.title, lga: p.lga, cost_naira: p.cost, stage: p.stage }));
    if (what === "Materials") return stateLogistics.map((r) => ({ item: r.item, received: r.warehouse, dispatched: r.dispatched, confirmed: r.confirmed }));
    return stateLgas.map((l) => ({ lga: l.lga, wards: l.wards, wards_with_leader: l.leaders, streets_covered: l.streetsCovered, members_total: l.members, overdue_approvals: l.overdue }));
  };
  const rows = build();
  return (
    <>
      <Panel title="Export aggregated data">
        <Notice tone="warn" title="Aggregated data only">
          Exports contain totals by LGA, project or item. Individual member records (names, phone numbers, addresses) are never exported from this dashboard.
        </Notice>
        <div className="form-grid">
          <SelectField label="Dataset" value={what} onChange={(e) => setWhat(e.target.value)} options={["LGA summary", "Project pipeline", "Materials"]} />
          <CheckField label="I will use this only for campaign coordination and won’t share it outside TBH One." checked={ack} onChange={(e) => setAck(e.target.checked)} error={err} />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (!ack) return setErr("Please confirm before exporting.");
              setErr("");
              download(`tbh-kaduna-${what.toLowerCase().replace(/\s+/g, "-")}.csv`, toCsv(rows), "text/csv");
              log(`exported ${what} CSV (${rows.length} aggregated rows)`);
              toast("CSV downloaded");
            }}
          >
            <Download size={16} aria-hidden /> Download CSV
          </button>
        </div>
        <p className="small muted">
          Preview: {rows.length} rows · columns {Object.keys(rows[0]).join(", ")}
        </p>
      </Panel>
      {items.length > 0 ? <AuditPanel items={items} /> : <EmptyState icon={<AlertTriangle size={20} aria-hidden />} title="No exports yet" text="Each export is logged with who, when and what." />}
    </>
  );
}

"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, Clock, ShieldAlert, ToggleLeft, ToggleRight } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { AuditList, Badge, BarChart, Grid, Kpis, Panel } from "@/components/dashboard/kit";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { SelectField, TextArea, TextField } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { accessLog, BREACH_STEPS, breaches as seedBreaches, consentRegister, dataRequests as seedRequests, featureFlags, type Breach, type DataRequest } from "@/data/mock/backoffice";
import { fmtDuration, shortDate, shortDateTime, stamp, useAudit, useNow, usePersisted } from "./office/common";

const DAY = 86_400_000;
const REQUEST_DAYS = 30; // NF-8
const BREACH_HOURS = 72; // NDPA 2023 notification window

export default function DpoDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="dpo" section={section}>
      {(user) => <Dpo section={section} user={user} />}
    </DashboardShell>
  );
}

function Dpo({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const [audit, addAudit] = useAudit("tbh-ofc-dpo-audit");
  switch (section) {
    case "requests":
      return <Requests me={me} addAudit={addAudit} />;
    case "breaches":
      return <Breaches me={me} addAudit={addAudit} />;
    case "features":
      return <Features me={me} audit={audit} addAudit={addAudit} />;
    case "access-log":
      return <AccessLog />;
    default:
      return <Consents />;
  }
}

/* ---------------------------------------------------------------- DP-1 Consent register */
function Consents() {
  const total = consentRegister.reduce((n, c) => n + c.pendingOptOut, 0);
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Membership consents", value: `${(consentRegister[0].granted / 1e6).toFixed(2)}m`, sub: consentRegister[0].granted.toLocaleString("en-NG") },
          { label: "Opt-outs pending", value: total, tone: total ? "warn" : "ok", sub: "Must be honoured within 24 hours (NF-7)" },
          { label: "Purposes recorded", value: consentRegister.length, sub: "Consent stored per purpose with a timestamp" },
        ]}
      />
      <Panel title="Consent register by purpose">
        <div className="ofc-scroll">
          <table className="ofc-table">
            <caption className="sr-only">Consents granted and withdrawn by purpose</caption>
            <thead>
              <tr>
                <th scope="col">Purpose</th>
                <th scope="col" className="num">
                  Granted
                </th>
                <th scope="col" className="num">
                  Withdrawn
                </th>
                <th scope="col" className="num">
                  Opt-outs pending
                </th>
                <th scope="col">24-hour rule</th>
              </tr>
            </thead>
            <tbody>
              {consentRegister.map((c) => (
                <tr key={c.type}>
                  <td className="ofc-strong">{c.type}</td>
                  <td className="num">{c.granted.toLocaleString("en-NG")}</td>
                  <td className="num">{c.withdrawn.toLocaleString("en-NG")}</td>
                  <td className="num">{c.pendingOptOut}</td>
                  <td>{c.pendingOptOut === 0 ? <Badge tone="ok">On track</Badge> : <Badge tone="warn">{c.pendingOptOut} due within 24 h</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BarChart label="Consents granted by purpose" data={consentRegister.map((c) => ({ label: c.type, value: c.granted }))} />
        <p className="ofc-small ofc-muted">No field anywhere records voting intention, PVC numbers or how a person voted (GR-1). Demo figures.</p>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- DP-2 Data requests, 30-day clock */
function Requests({ me, addAudit }: { me: string; addAudit: (w: string, x: string) => void }) {
  const now = useNow(60_000);
  const toast = useToast();
  const [reqs, setReqs] = usePersisted<DataRequest[]>("tbh-ofc-dpo-requests", seedRequests);
  const [kind, setKind] = useState("");
  const [complete, setComplete] = useState<DataRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const flow: DataRequest["status"][] = ["Received", "Identity verified", "In progress", "Completed"];
  const due = (r: DataRequest) => new Date(r.receivedAt).getTime() + REQUEST_DAYS * DAY;
  const clock = (r: DataRequest) => {
    if (r.status === "Completed") return <span className="ofc-timer" data-state="ok">Completed</span>;
    const left = due(r) - now;
    return (
      <span className="ofc-timer" data-state={left < 0 ? "danger" : left < 7 * DAY ? "warn" : undefined}>
        <Clock size={14} aria-hidden /> {left < 0 ? `${Math.ceil(-left / DAY)} days overdue` : `${Math.ceil(left / DAY)} days left`}
      </span>
    );
  };
  const rows = reqs.filter((r) => !kind || r.kind === kind).sort((a, b) => due(a) - due(b));
  const cols: Column<DataRequest>[] = [
    { key: "id", header: "Request", sortable: true },
    { key: "kind", header: "Type", sortable: true },
    { key: "subject", header: "Data subject" },
    { key: "receivedAt", header: "Received", sortable: true, value: (r) => r.receivedAt, render: (r) => shortDate(r.receivedAt) },
    { key: "due", header: "Due (30 days)", sortable: true, value: (r) => due(r), render: (r) => shortDate(new Date(due(r)).toISOString()) },
    { key: "clock", header: "Clock", render: clock },
    { key: "status", header: "Status", value: (r) => r.status, render: (r) => <Badge tone={r.status === "Completed" ? "ok" : r.status === "Received" ? "warn" : "info"}>{r.status}</Badge> },
  ];
  const overdue = reqs.filter((r) => r.status !== "Completed" && due(r) < now).length;
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Open requests", value: reqs.filter((r) => r.status !== "Completed").length },
          { label: "Due within 7 days", value: reqs.filter((r) => r.status !== "Completed" && due(r) - now < 7 * DAY && due(r) >= now).length, tone: "warn" },
          { label: "Overdue", value: overdue, tone: overdue ? "danger" : "ok", sub: "NDPA 2023 / GDPR: 30 days" },
        ]}
      />
      <Panel title="Data requests queue">
        <DataTable
          rows={rows}
          columns={cols}
          rowKey={(r) => r.id}
          caption="Access, correction and deletion requests with due dates"
          searchPlaceholder="Search requests"
          filters={
            <>
              <label className="sr-only" htmlFor="rk">
                Type
              </label>
              <select id="rk" className="input" value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="">All types</option>
                <option>Access</option>
                <option>Correction</option>
                <option>Deletion</option>
              </select>
            </>
          }
          actions={(r) =>
            r.status === "Completed" ? (
              <span className="ofc-small ofc-muted">{r.notes}</span>
            ) : r.status === "In progress" ? (
              <button type="button" className="btn btn-sm btn-primary" onClick={() => setComplete(r)}>
                Complete
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => {
                  const next = flow[flow.indexOf(r.status) + 1];
                  setReqs((all) => all.map((x) => (x.id === r.id ? { ...x, status: next } : x)));
                  addAudit(me, `moved ${r.id} to ${next}`);
                  toast(`${r.id}: ${next}`);
                }}
              >
                {r.status === "Received" ? "Verify identity" : "Start work"}
              </button>
            )
          }
        />
      </Panel>
      <Dialog
        open={!!complete}
        onClose={() => setComplete(null)}
        title={`Complete ${complete?.id ?? ""}`}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setComplete(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={notes.trim().length < 5 || busy}
              onClick={async () => {
                if (!complete) return;
                setBusy(true);
                await new Promise((r) => setTimeout(r, 500));
                setBusy(false);
                setReqs((all) => all.map((x) => (x.id === complete.id ? { ...x, status: "Completed", notes: notes.trim() } : x)));
                addAudit(me, `completed ${complete.id} (${complete.kind})`);
                toast(`${complete.id} completed — confirmation sent to the data subject (simulated)`);
                setComplete(null);
                setNotes("");
              }}
            >
              {busy ? "Saving…" : "Mark completed"}
            </button>
          </>
        }
      >
        {complete?.kind === "Deletion" && (
          <Notice tone="warn" title="Deletion">
            Deletes personal data across the CRM, shop and points ledger. Financial records required by law (named contributions, Electoral Act 2026) are retained but de-linked where permitted.
          </Notice>
        )}
        <TextArea label="Completion notes" value={notes} onChange={(e) => setNotes(e.target.value)} hint="What was provided, corrected or deleted." />
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- DP-3 Breach log */
function Breaches({ me, addAudit }: { me: string; addAudit: (w: string, x: string) => void }) {
  const now = useNow(1000);
  const toast = useToast();
  const [list, setList] = usePersisted<Breach[]>("tbh-ofc-dpo-breaches", seedBreaches);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sev, setSev] = useState<Breach["severity"]>("Medium");
  const [affected, setAffected] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="ofc-stack">
      <Panel title="Breach log" action={<button type="button" className="btn btn-sm btn-primary" onClick={() => setOpen(true)}><ShieldAlert size={16} aria-hidden /> Log a breach</button>}>
        <div className="ofc-cards">
          {list.map((b) => {
            const left = new Date(b.detectedAt).getTime() + BREACH_HOURS * 3_600_000 - now;
            const notified = !!b.steps["Notify NDPC within 72 hours"];
            return (
              <article key={b.id} className="ofc-card" data-tone={b.status === "Closed" ? "muted" : b.severity === "High" ? "danger" : "warn"}>
                <div className="ofc-card-head">
                  <span className="ofc-card-title">
                    {b.id} · {b.title}
                  </span>
                  <span className="ofc-row">
                    <Badge tone={b.severity === "High" ? "danger" : b.severity === "Medium" ? "warn" : "muted"}>{b.severity}</Badge>
                    {b.status === "Closed" ? (
                      <Badge tone="ok">Closed</Badge>
                    ) : notified ? (
                      <Badge tone="info">Regulator notified</Badge>
                    ) : (
                      <span className="ofc-timer" data-state={left < 0 ? "danger" : left < 24 * 3_600_000 ? "warn" : undefined}>
                        <CalendarClock size={14} aria-hidden /> NDPC notice: {fmtDuration(left)}
                        {left >= 0 ? " left" : ""}
                      </span>
                    )}
                  </span>
                </div>
                <div className="ofc-meta">
                  <span>Detected {shortDateTime(b.detectedAt)}</span>
                  <span>{b.affected.toLocaleString("en-NG")} people affected</span>
                </div>
                <fieldset className="plain">
                  <legend className="ofc-small">Notification workflow</legend>
                  {BREACH_STEPS.map((s) => (
                    <label key={s} className="check">
                      <input
                        type="checkbox"
                        checked={!!b.steps[s]}
                        disabled={b.status === "Closed"}
                        onChange={(e) => {
                          const steps = { ...b.steps, [s]: e.target.checked };
                          const allDone = BREACH_STEPS.filter((x) => x !== "Notify affected people (if high risk)" || b.severity === "High").every((x) => steps[x]);
                          setList((all) => all.map((x) => (x.id === b.id ? { ...x, steps, status: allDone ? "Closed" : steps["Notify NDPC within 72 hours"] ? "Notified" : "Open" } : x)));
                          addAudit(me, `${e.target.checked ? "completed" : "reopened"} “${s}” on ${b.id}`);
                        }}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </fieldset>
              </article>
            );
          })}
        </div>
      </Panel>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Log a personal data breach"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const n = Number(affected);
                if (title.trim().length < 8 || !Number.isFinite(n) || n < 0) return setErr("Describe the breach (8+ characters) and give the number of people affected.");
                const id = `BR-${String(list.length + 7).padStart(2, "0")}`;
                setList((all) => [{ id, title: title.trim(), detectedAt: new Date().toISOString(), severity: sev, affected: n, steps: {}, status: "Open" }, ...all]);
                addAudit(me, `logged breach ${id}`);
                toast(`${id} logged — 72-hour NDPC clock started`);
                setOpen(false);
                setTitle("");
                setAffected("");
                setErr("");
              }}
            >
              Log breach
            </button>
          </>
        }
      >
        <TextField label="What happened" value={title} onChange={(e) => setTitle(e.target.value)} required error={err && title.trim().length < 8 ? err : undefined} />
        <SelectField label="Severity" value={sev} onChange={(e) => setSev(e.target.value as Breach["severity"])} options={["High", "Medium", "Low"]} />
        <TextField label="People affected" inputMode="numeric" value={affected} onChange={(e) => setAffected(e.target.value.replace(/\D/g, ""))} required error={err && !affected ? err : undefined} />
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- DP-4 Feature approvals */
function Features({ me, audit, addAudit }: { me: string; audit: { at: string; who: string; what: string }[]; addAudit: (w: string, x: string) => void }) {
  const toast = useToast();
  const [flags, setFlags] = usePersisted<Record<string, { on: boolean; by?: string; at?: string; why?: string }>>("tbh-ofc-dpo-flags", {});
  const [pending, setPending] = useState<{ key: string; label: string; to: boolean } | null>(null);
  const [why, setWhy] = useState("");
  return (
    <Grid cols={2}>
      <Panel title="Data features (off until signed off)">
        <Notice tone="info" title="NF-9">
          Contact, Gmail and WhatsApp import are disabled by default. They can be enabled only after DPO sign-off, and imported contacts are never messaged by TBH One.
        </Notice>
        <ul className="rows" role="list">
          {featureFlags.map((f) => {
            const st = flags[f.key];
            return (
              <li key={f.key}>
                <div className="row-main">
                  <span className="ofc-strong">{f.label}</span>
                  <span className="ofc-small ofc-muted">{f.risk}</span>
                  {st?.by && (
                    <span className="ofc-small">
                      {st.on ? "Enabled" : "Disabled"} by {st.by} on {st.at}: {st.why}
                    </span>
                  )}
                </div>
                <button type="button" className={`btn btn-sm ${st?.on ? "btn-outline" : "btn-primary"}`} aria-pressed={!!st?.on} onClick={() => setPending({ key: f.key, label: f.label, to: !st?.on })}>
                  {st?.on ? <ToggleRight size={18} aria-hidden /> : <ToggleLeft size={18} aria-hidden />} {st?.on ? "On — switch off" : "Off — sign off and enable"}
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="Sign-off record">{audit.length ? <AuditList items={audit} /> : <p className="ofc-muted">No sign-offs recorded yet.</p>}</Panel>
      <ConfirmDialog
        open={!!pending}
        onCancel={() => {
          setPending(null);
          setWhy("");
        }}
        title={pending?.to ? `Enable ${pending?.label}?` : `Disable ${pending?.label}?`}
        confirmLabel={pending?.to ? "Sign off and enable" : "Disable"}
        text={
          <div className="form-grid">
            {pending?.to && <p>Confirm there is a published privacy notice, clear opt-in consent and a lawful basis under the NDPA 2023.</p>}
            <TextArea label="Justification (recorded)" value={why} onChange={(e) => setWhy(e.target.value)} required />
          </div>
        }
        onConfirm={() => {
          if (!pending) return;
          if (why.trim().length < 10) return toast("Write a justification of at least 10 characters");
          setFlags((f) => ({ ...f, [pending.key]: { on: pending.to, by: me, at: stamp(), why: why.trim() } }));
          addAudit(me, `${pending.to ? "signed off and enabled" : "disabled"} ${pending.label}: ${why.trim()}`);
          toast(`${pending.label} ${pending.to ? "enabled" : "disabled"}`);
          setPending(null);
          setWhy("");
        }}
      />
    </Grid>
  );
}

/* ---------------------------------------------------------------- DP-5 Access log */
function AccessLog() {
  const [who, setWho] = useState("");
  const people = Array.from(new Set(accessLog.map((a) => a.who)));
  const rows = accessLog.filter((a) => !who || a.who === who);
  return (
    <Panel title="Access log review">
      <DataTable
        rows={rows}
        columns={[
          { key: "at", header: "When", sortable: true, value: (a) => a.at, render: (a) => shortDateTime(a.at) },
          { key: "who", header: "Who", sortable: true },
          { key: "what", header: "What they viewed or did" },
          {
            key: "purpose",
            header: "Purpose",
            render: (a) =>
              a.purpose === "—" ? (
                <Badge tone="danger">No purpose — investigate</Badge>
              ) : (
                <span className="ofc-row">
                  <CheckCircle2 size={14} aria-hidden className="ofc-ok" /> {a.purpose}
                </span>
              ),
          },
        ]}
        rowKey={(a) => `${a.at}-${a.who}`}
        caption="Who viewed what and when"
        searchPlaceholder="Search the access log"
        filters={
          <>
            <label className="sr-only" htmlFor="aw">
              Person
            </label>
            <select id="aw" className="input" value={who} onChange={(e) => setWho(e.target.value)}>
              <option value="">Everyone</option>
              {people.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </>
        }
      />
    </Panel>
  );
}


"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, Clock, FolderLock, Lock, PauseCircle, UserCheck } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { AuditList, Badge, BarChart, Grid, Kpis, Panel, type Tone } from "@/components/dashboard/kit";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { SelectField, TextArea, TextField } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { escalationContacts, incidents as seed, managedUsers, SG_TARGET_HOURS, weeklySg, type Incident } from "@/data/mock/backoffice";
import { fmtDuration, shortDateTime, stamp, useAudit, useNow, usePersisted } from "./office/common";

const sevTone = (s: Incident["severity"]): Tone => (s === "Critical" ? "danger" : s === "High" ? "warn" : "info");
const statusTone = (s: Incident["status"]): Tone => (s === "Resolved" ? "ok" : s === "Escalated" ? "info" : s === "New" ? "danger" : "warn");

export default function SafeguardingDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="safeguarding" section={section}>
      {(user) => <Safeguarding section={section} user={user} />}
    </DashboardShell>
  );
}

function Safeguarding({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const [items, setItems] = usePersisted<Incident[]>("tbh-ofc-incidents", seed);
  const [audit, addAudit] = useAudit("tbh-ofc-sg-audit");
  const update = (id: string, f: (i: Incident) => Incident) => setItems((all) => all.map((i) => (i.id === id ? f(i) : i)));
  return (
    <div className="ofc-stack">
      <p className="ofc-lock" role="note">
        <Lock size={16} aria-hidden />
        <span>
          <strong>Restricted.</strong> Incident records are visible only to the Safeguarding Lead and focal points. Ward and state leaders see status only; sexual-abuse reports appear here and nowhere else. Every view is logged.
        </span>
      </p>
      {section === "cases" ? (
        <Cases me={me} items={items} update={update} addAudit={addAudit} />
      ) : section === "contacts" ? (
        <Contacts />
      ) : section === "suspensions" ? (
        <Suspensions me={me} audit={audit} addAudit={addAudit} />
      ) : section === "report" ? (
        <WeeklyReport items={items} />
      ) : (
        <Queue me={me} items={items} update={update} addAudit={addAudit} />
      )}
    </div>
  );
}

function deadline(i: Incident) {
  return new Date(i.reportedAt).getTime() + SG_TARGET_HOURS[i.severity] * 3_600_000;
}

function Timer({ i, now }: { i: Incident; now: number }) {
  if (i.status === "Resolved") return <span className="ofc-timer" data-state="ok">Resolved</span>;
  const left = deadline(i) - now;
  const state = left < 0 ? "danger" : left < SG_TARGET_HOURS[i.severity] * 3_600_000 * 0.25 ? "warn" : undefined;
  return (
    <span className="ofc-timer" data-state={state} role="timer" aria-label={left < 0 ? `Response overdue by ${fmtDuration(-left)}` : `${fmtDuration(left)} left to respond`}>
      <Clock size={14} aria-hidden /> {left < 0 ? fmtDuration(left) : `${fmtDuration(left)} left`}
    </span>
  );
}

/* ---------------------------------------------------------------- SG-1 Incident queue */
function Queue({ me, items, update, addAudit }: { me: string; items: Incident[]; update: (id: string, f: (i: Incident) => Incident) => void; addAudit: (w: string, x: string) => void }) {
  const now = useNow(1000);
  const toast = useToast();
  const [sev, setSev] = useState("");
  const [escalate, setEscalate] = useState<Incident | null>(null);
  const [to, setTo] = useState("Police — Nigeria Police Force state command");
  const open = items.filter((i) => i.status !== "Resolved");
  const criticalOpen = open.filter((i) => i.severity === "Critical" && i.status === "New");
  const overdue = open.filter((i) => deadline(i) < now);
  const list = items
    .filter((i) => !sev || i.severity === sev)
    .sort((a, b) => (a.status === "Resolved" ? 1 : 0) - (b.status === "Resolved" ? 1 : 0) || deadline(a) - deadline(b));
  return (
    <>
      {criticalOpen.length > 0 && (
        <div className="banner-critical" role="alert">
          <AlertTriangle size={20} aria-hidden /> {criticalOpen.length} critical incident{criticalOpen.length > 1 ? "s" : ""} not yet triaged — respond within 1 hour.
        </div>
      )}
      <Kpis
        items={[
          { label: "Open incidents", value: open.length },
          { label: "Critical open", value: open.filter((i) => i.severity === "Critical").length, tone: "danger" },
          { label: "Overdue", value: overdue.length, tone: overdue.length ? "danger" : "ok", sub: "Past the response-time target" },
          { label: "Response targets", value: "1–72h", sub: "Critical 1h · High 24h · Low 72h" },
        ]}
      />
      <Panel
        title="Incident queue"
        action={
          <div className="ofc-row">
            <label htmlFor="sev" className="ofc-small">
              Severity
            </label>
            <select id="sev" className="input" style={{ width: "auto" }} value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="">All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </div>
        }
      >
        <div className="ofc-cards">
          {list.map((i) => (
            <article key={i.id} className="ofc-card" data-tone={i.status === "Resolved" ? "muted" : sevTone(i.severity) === "danger" ? "danger" : "warn"}>
              <div className="ofc-card-head">
                <span className="ofc-card-title">
                  {i.id} · {i.type}
                </span>
                <span className="ofc-row">
                  <Badge tone={sevTone(i.severity)}>{i.severity}</Badge>
                  <Badge tone={statusTone(i.status)}>{i.status}</Badge>
                  <Timer i={i} now={now} />
                </span>
              </div>
              <p>{i.summary}</p>
              <div className="ofc-meta">
                <span>{i.location}</span>
                <span>Reporter: {i.reporter}</span>
                <span>Reported {shortDateTime(i.reportedAt)}</span>
                {i.owner && <span>Owner: {i.owner}</span>}
              </div>
              {i.status !== "Resolved" && (
                <div className="ofc-actions">
                  {i.status === "New" && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        update(i.id, (x) => ({ ...x, status: "Triaged", owner: me, actions: [...x.actions, { at: new Date().toISOString(), by: me, note: "Triaged and assigned to self." }] }));
                        addAudit(me, `triaged ${i.id}`);
                        toast(`${i.id} assigned to you`);
                      }}
                    >
                      <UserCheck size={16} aria-hidden /> Take and triage
                    </button>
                  )}
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => setEscalate(i)}>
                    <ArrowUpRight size={16} aria-hidden /> Escalate
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </Panel>
      <Dialog
        open={!!escalate}
        onClose={() => setEscalate(null)}
        title={`Escalate ${escalate?.id ?? ""}`}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setEscalate(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!escalate) return;
                update(escalate.id, (x) => ({ ...x, status: "Escalated", owner: x.owner ?? me, actions: [...x.actions, { at: new Date().toISOString(), by: me, note: `Escalated to ${to}.` }] }));
                addAudit(me, `escalated ${escalate.id} to ${to}`);
                toast(`${escalate.id} escalated (simulated notification)`);
                setEscalate(null);
              }}
            >
              Escalate
            </button>
          </>
        }
      >
        <SelectField label="Escalate to" value={to} onChange={(e) => setTo(e.target.value)} options={escalationContacts.map((c) => c.role)} />
        <p className="ofc-small ofc-muted">Contact details come from the escalation directory. No contact numbers are shown in this prototype.</p>
      </Dialog>
    </>
  );
}

/* ---------------------------------------------------------------- SG-2 Case records */
function Cases({ me, items, update, addAudit }: { me: string; items: Incident[]; update: (id: string, f: (i: Incident) => Incident) => void; addAudit: (w: string, x: string) => void }) {
  const toast = useToast();
  const [id, setId] = useState(items[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const i = items.find((x) => x.id === id);
  return (
    <Grid cols={2}>
      <Panel title="Cases">
        <ul className="rows" role="list">
          {items.map((x) => (
            <li key={x.id}>
              <div className="row-main">
                <button type="button" className="linklike ofc-strong" aria-pressed={x.id === id} onClick={() => setId(x.id)}>
                  {x.id} · {x.type}
                </button>
                <span className="ofc-small ofc-muted">
                  {x.location} · {x.reporter}
                </span>
              </div>
              <Badge tone={statusTone(x.status)}>{x.status}</Badge>
            </li>
          ))}
        </ul>
      </Panel>
      {i && (
        <Panel title={`Case ${i.id}`} action={<FolderLock size={18} aria-hidden />}>
          <dl className="facts facts-2">
            <div>
              <dt>Type</dt>
              <dd>{i.type}</dd>
            </div>
            <div>
              <dt>Severity</dt>
              <dd>{i.severity}</dd>
            </div>
            <div>
              <dt>Reporter</dt>
              <dd>{i.reporter}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{i.location}</dd>
            </div>
            <div>
              <dt>Subject</dt>
              <dd>{i.subject ?? "Not named"}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{i.owner ?? "Unassigned"}</dd>
            </div>
          </dl>
          <p>{i.summary}</p>
          <h3>Actions taken</h3>
          {i.actions.length ? <AuditList items={i.actions.map((a) => ({ at: shortDateTime(a.at), who: a.by, what: a.note }))} /> : <p className="ofc-muted">No actions yet.</p>}
          {i.outcome && (
            <Notice tone="ok" title="Outcome">
              {i.outcome}
            </Notice>
          )}
          {i.status !== "Resolved" && (
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault();
                if (note.trim().length < 5) return;
                update(i.id, (x) => ({ ...x, actions: [...x.actions, { at: new Date().toISOString(), by: me, note: note.trim() }] }));
                addAudit(me, `added an action note to ${i.id}`);
                setNote("");
                toast("Action recorded");
              }}
            >
              <TextArea label="Add an action" value={note} onChange={(e) => setNote(e.target.value)} hint="What was done, by whom, and next steps. Do not record vote or PVC data." />
              <div className="ofc-actions">
                <button type="submit" className="btn btn-outline btn-sm" disabled={note.trim().length < 5}>
                  Record action
                </button>
              </div>
              <TextField label="Outcome (to close the case)" value={outcome} onChange={(e) => setOutcome(e.target.value)} />
              <div className="ofc-actions">
                <button type="button" className="btn btn-primary btn-sm" disabled={outcome.trim().length < 5} onClick={() => setConfirmClose(true)}>
                  Resolve case
                </button>
              </div>
            </form>
          )}
          <ConfirmDialog
            open={confirmClose}
            onCancel={() => setConfirmClose(false)}
            title={`Resolve ${i.id}?`}
            text={<p>The case will be closed with the outcome: “{outcome}”. It stays in the restricted record.</p>}
            confirmLabel="Resolve"
            onConfirm={() => {
              update(i.id, (x) => ({ ...x, status: "Resolved", outcome: outcome.trim(), actions: [...x.actions, { at: new Date().toISOString(), by: me, note: "Case resolved." }] }));
              addAudit(me, `resolved ${i.id}`);
              setConfirmClose(false);
              setOutcome("");
              toast(`${i.id} resolved`);
            }}
          />
        </Panel>
      )}
    </Grid>
  );
}

/* ---------------------------------------------------------------- SG-3 Escalation contacts */
function Contacts() {
  return (
    <Panel title="Escalation contacts">
      <Notice tone="warn" title="Contact details pending">
        Real numbers and named contacts are added by the National Coordination team after verification. This prototype never shows invented phone numbers.
      </Notice>
      <div className="ofc-scroll">
        <table className="ofc-table">
          <caption className="sr-only">Escalation contacts by role</caption>
          <thead>
            <tr>
              <th scope="col">Contact</th>
              <th scope="col">Use when</th>
              <th scope="col">How to reach</th>
            </tr>
          </thead>
          <tbody>
            {escalationContacts.map((c) => (
              <tr key={c.role}>
                <td className="ofc-strong">{c.role}</td>
                <td>{c.when}</td>
                <td className="ofc-muted">{c.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------- SG-4 Suspensions */
function Suspensions({ me, audit, addAudit }: { me: string; audit: { at: string; who: string; what: string }[]; addAudit: (w: string, x: string) => void }) {
  const toast = useToast();
  const [paused, setPaused] = usePersisted<Record<string, { reason: string; at: string }>>("tbh-ofc-sg-suspended", {});
  const [target, setTarget] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const people = managedUsers.filter((u) => u.roles.length > 1);
  return (
    <Grid cols={2}>
      <Panel title="Pause a user's roles pending review">
        <p className="ofc-small ofc-muted">Suspension pauses every role above Member immediately. The person keeps their member account and data. Reinstating needs a recorded review.</p>
        <ul className="rows" role="list">
          {people.map((u) => {
            const s = paused[u.id];
            return (
              <li key={u.id}>
                <div className="row-main">
                  <span className="ofc-strong">
                    {u.name} <span className="ofc-muted ofc-small">({u.id})</span>
                  </span>
                  <span className="ofc-small ofc-muted">
                    {u.roles.join(", ")} · {u.state}
                  </span>
                  {s && <span className="ofc-small ofc-danger">Suspended {s.at}: {s.reason}</span>}
                </div>
                <div className="row-actions">
                  {s ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setPaused((p) => {
                          const n = { ...p };
                          delete n[u.id];
                          return n;
                        });
                        addAudit(me, `reinstated roles for ${u.name} (${u.id}) after review`);
                        toast(`${u.name} reinstated`);
                      }}
                    >
                      Reinstate
                    </button>
                  ) : (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => setTarget(u.id)}>
                      <PauseCircle size={16} aria-hidden /> Suspend roles
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="Suspension audit">
        {audit.length ? <AuditList items={audit} /> : <p className="ofc-muted">No suspension actions yet.</p>}
      </Panel>
      <ConfirmDialog
        open={!!target}
        onCancel={() => setTarget(null)}
        danger
        title="Suspend this person's roles?"
        confirmLabel="Suspend roles"
        text={
          <div className="form-grid">
            <p>{managedUsers.find((u) => u.id === target)?.name} will lose access to all leader, creator and vendor tools until reinstated.</p>
            <TextField label="Reason (recorded in the case file)" value={reason} onChange={(e) => setReason(e.target.value)} required />
          </div>
        }
        onConfirm={() => {
          if (!target || reason.trim().length < 5) {
            toast("Give a reason of at least 5 characters");
            return;
          }
          const u = managedUsers.find((x) => x.id === target)!;
          setPaused((p) => ({ ...p, [target]: { reason: reason.trim(), at: stamp() } }));
          addAudit(me, `suspended roles for ${u.name} (${u.id}): ${reason.trim()}`);
          toast(`${u.name}'s roles suspended`);
          setTarget(null);
          setReason("");
        }}
      />
    </Grid>
  );
}

/* ---------------------------------------------------------------- SG-5 Weekly report */
function WeeklyReport({ items }: { items: Incident[] }) {
  const byType = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((i) => m.set(i.type, (m.get(i.type) ?? 0) + 1));
    return [...m.entries()].map(([label, value]) => ({ label, value }));
  }, [items]);
  const latest = weeklySg[weeklySg.length - 1];
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "This week: critical", value: latest.critical, tone: "danger" },
          { label: "This week: high", value: latest.high, tone: "warn" },
          { label: "This week: low", value: latest.low },
          { label: "Critical escalated within 1 hour", value: "100%", sub: "Target 100% (PRD success metric)" },
        ]}
      />
      <Grid cols={2}>
        <Panel title="Incidents per week">
          <BarChart label="Incidents per week" data={weeklySg.map((w) => ({ label: w.week, value: w.critical + w.high + w.low }))} />
          <div className="ofc-scroll">
            <table className="ofc-table">
              <caption>Text equivalent</caption>
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  <th scope="col" className="num">
                    Critical
                  </th>
                  <th scope="col" className="num">
                    High
                  </th>
                  <th scope="col" className="num">
                    Low
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklySg.map((w) => (
                  <tr key={w.week}>
                    <td>{w.week}</td>
                    <td className="num">{w.critical}</td>
                    <td className="num">{w.high}</td>
                    <td className="num">{w.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Open queue by type">
          <BarChart label="Incidents by type" data={byType} />
          <p className="ofc-small ofc-muted">Weekly report is shared with the National Coordinator only in aggregate. No names or case details leave this dashboard.</p>
        </Panel>
      </Grid>
    </div>
  );
}

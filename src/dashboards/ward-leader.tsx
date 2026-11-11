"use client";

import { useState } from "react";
import { Ban, Check, Flag, Lock, MapPin, Megaphone, Upload, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { BarChart, Badge, Grid, Kpis, Meter, Panel, naira } from "@/components/dashboard/kit";
import { CheckField, SelectField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { materials, proofQueue, rateCard, recruitment, wardIncidents, wardStreetLeaders, wardStreets, type Proof } from "@/data/mock/field";
import { AuditPanel, Checklist, DemoTag, ProofThumb, fmtDate, useAudit, usePersisted } from "./field/common";

/** Hours since submission for the demo queue (relative, so escalation shows regardless of today's date). */
const AGE_H: Record<string, number> = { "P-5501": 4, "P-5502": 2, "P-5503": 67, "P-5504": 1.5, "P-5505": 18 };
type Decision = { decision: "Approved" | "Rejected" | "Flagged"; reason?: string; at: string };

export default function WardLeaderDashboard({ section }: { section: string }) {
  return <DashboardShell role="ward-leader" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const audit = useAudit("ward", `${user.firstName} ${user.lastName} (ward leader)`);
  const ward = "Gama ward, Nassarawa LGA, Kano"; // demo ward the mock data describes
  switch (section) {
    case "roster":
      return <Roster />;
    case "approvals":
      return <Approvals log={audit.log} items={audit.items} />;
    case "assign":
      return <Assign log={audit.log} />;
    case "coverage":
      return <Coverage ward={ward} />;
    case "events":
      return <Events log={audit.log} />;
    case "projects":
      return <Projects log={audit.log} />;
    case "materials":
      return <Materials log={audit.log} />;
    case "earnings":
      return <Earnings />;
    case "incidents":
      return <Incidents />;
    case "broadcast":
      return <Broadcast log={audit.log} />;
    case "recruitment":
      return <Recruitment log={audit.log} />;
    default:
      return <Overview ward={ward} />;
  }
}

/* WL-1 */
function Overview({ ward }: { ward: string }) {
  const covered = wardStreets.filter((s) => s.leader).length;
  return (
    <>
      <p className="ward-name">
        <MapPin size={16} aria-hidden /> {ward} <DemoTag />
      </p>
      <Kpis
        items={[
          { label: "Members", value: "2,418", sub: "+146 this week", trend: "up" },
          { label: "Street leaders", value: wardStreetLeaders.length, sub: "3 recruits in vetting" },
          { label: "Streets covered", value: `${covered}/${wardStreets.length}`, tone: covered / wardStreets.length < 0.7 ? "warn" : undefined },
          { label: "Proof awaiting review", value: proofQueue.length, sub: "1 past 48 hours", tone: "warn" },
        ]}
      />
      <Grid>
        <Panel title="Houses visited by street">
          <BarChart label="Houses visited by street" data={wardStreets.map((s) => ({ label: s.street, value: s.visited, target: s.houses }))} />
        </Panel>
        <Panel title="This week">
          <ul className="rows">
            <li>
              <span className="row-main">
                <strong>Village meeting, Saturday 4pm</strong>
                <span className="small muted">Safety checklist 3 of 5 complete</span>
              </span>
              <Badge tone="warn">Not published</Badge>
            </li>
            <li>
              <span className="row-main">
                <strong>Borehole repair project</strong>
                <span className="small muted">Fully funded · upload delivery proof</span>
              </span>
              <Badge tone="info">In delivery</Badge>
            </li>
            <li>
              <span className="row-main">
                <strong>3 streets have no leader</strong>
                <span className="small muted">Sabon Gari Lane, Market Close, Unguwa Uku Road</span>
              </span>
              <Badge tone="danger">Recruit</Badge>
            </li>
          </ul>
        </Panel>
      </Grid>
    </>
  );
}

/* WL-2 */
function Roster() {
  return (
    <Panel title="Street leaders" action={<DemoTag />}>
      <DataTable
        rows={wardStreetLeaders}
        rowKey={(r) => r.id}
        caption="Street leaders in this ward"
        searchPlaceholder="Search street leaders"
        columns={[
          { key: "name", header: "Name", sortable: true },
          { key: "street", header: "Street", sortable: true },
          { key: "tasksDone", header: "Tasks done", align: "right", sortable: true, value: (r) => r.tasksDone },
          { key: "approvalRate", header: "Approval rate", align: "right", sortable: true, value: (r) => r.approvalRate, render: (r) => `${r.approvalRate}%` },
          { key: "training", header: "Training", render: (r) => <Badge tone={r.training === "Complete" ? "ok" : r.training === "Not started" ? "danger" : "warn"}>{r.training}</Badge> },
          { key: "lastCheckIn", header: "Last check-in" },
        ]}
      />
    </Panel>
  );
}

/* WL-3 — approve, reject with reason, flag; no self-approval; 48h escalation */
function Approvals({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  const [decisions, setDecisions] = usePersisted<Record<string, Decision>>("tbh-wl-decisions", {});
  const [rejecting, setRejecting] = useState<Proof | null>(null);
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState("");
  const toast = useToast();
  const decide = (p: Proof, d: Decision["decision"], r?: string) => {
    setDecisions({ ...decisions, [p.id]: { decision: d, reason: r, at: new Date().toISOString() } });
    log(`${d.toLowerCase()} ${p.id} (${p.type}, ${p.count}) from ${p.leader}${r ? ` — reason: ${r}` : ""}`);
    toast(`${p.id}: ${d}`);
  };
  const open = proofQueue.filter((p) => !decisions[p.id]);
  return (
    <>
      <Panel title={`Awaiting review · ${open.length}`} action={<DemoTag />}>
        {open.length === 0 && <EmptyState title="Queue is clear" text="New proof appears here as street leaders submit it." />}
        <ul className="proof-list-d">
          {open.map((p) => {
            const age = AGE_H[p.id] ?? 0;
            const escalated = age > 48;
            return (
              <li key={p.id} className="proof-card">
                <ProofThumb hue={p.photoHue} label={`Proof photo for ${p.id}`} />
                <div className="proof-body">
                  <div className="proof-head">
                    <strong>
                      {p.type} · {p.count}
                    </strong>
                    <span className="small muted">{p.id}</span>
                  </div>
                  <p className="small">
                    {p.leader} · taken {fmtDate(p.takenAt, true)} · submitted {age < 1 ? "just now" : `${age} h ago`}
                  </p>
                  <p className="small muted">
                    <MapPin size={12} aria-hidden /> GPS {p.gps}
                  </p>
                  <div className="proof-flags">
                    {p.duplicate && <Badge tone="danger">Duplicate photo detected</Badge>}
                    {escalated && <Badge tone="warn">Escalated to state coordinator (over 48 h)</Badge>}
                    <Badge tone="muted">Pays {naira(Math.round((p.count / (rateCard.find((r) => r.type === p.type)?.per ?? 1)) * (rateCard.find((r) => r.type === p.type)?.rate ?? 0)))}</Badge>
                  </div>
                  {p.ownSubmission ? (
                    <Notice tone="warn" title="You can’t approve your own task">
                      This was submitted by you. It goes to another ward leader or the state coordinator for approval (WL acceptance criteria).
                    </Notice>
                  ) : (
                    <div className="form-actions">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => decide(p, "Approved")}>
                        <Check size={16} aria-hidden /> Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          setRejecting(p);
                          setReason("");
                          setReasonErr("");
                        }}
                      >
                        <X size={16} aria-hidden /> Reject
                      </button>
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => decide(p, "Flagged", "Sent for second review")}>
                        <Flag size={16} aria-hidden /> Flag
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="Decided">
        {Object.keys(decisions).length ? (
          <ul className="rows">
            {Object.entries(decisions).map(([id, d]) => (
              <li key={id}>
                <span className="row-main">
                  <strong>{id}</strong>
                  <span className="small muted">
                    {fmtDate(d.at, true)}
                    {d.reason ? ` · ${d.reason}` : ""}
                  </span>
                </span>
                <span className="row-actions">
                  <Badge tone={d.decision === "Approved" ? "ok" : d.decision === "Rejected" ? "danger" : "warn"}>{d.decision}</Badge>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      const next = { ...decisions };
                      delete next[id];
                      setDecisions(next);
                      log(`reopened ${id}`);
                    }}
                  >
                    Undo
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Nothing decided yet.</p>
        )}
        <p className="small muted">Approved tasks become payable; payment status updates for the street leader within 24 hours (GR-6).</p>
      </Panel>
      <AuditPanel items={items} />
      <Dialog
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title={`Reject ${rejecting?.id ?? ""}`}
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setRejecting(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (reason.trim().length < 5) return setReasonErr("A reason is required so the street leader can fix it.");
                if (rejecting) decide(rejecting, "Rejected", reason.trim());
                setRejecting(null);
              }}
            >
              Reject with reason
            </button>
          </>
        }
      >
        <SelectField label="Common reasons" value="" onChange={(e) => e.target.value && setReason(e.target.value)} placeholder="Choose or write your own…" options={["Photo is unclear", "Count does not match the photo", "Location is outside the assigned street", "Duplicate photo"]} />
        <TextArea label="Reason" required value={reason} onChange={(e) => setReason(e.target.value)} error={reasonErr} rows={3} />
      </Dialog>
    </>
  );
}

/* WL-4 */
function Assign({ log }: { log: (w: string) => void }) {
  type A = { id: string; type: string; qty: number; deadline: string; leaders: string[] };
  const [assigned, setAssigned] = usePersisted<A[]>("tbh-wl-assigned", []);
  const [f, setF] = useState({ type: rateCard[0].type as string, qty: "", deadline: "" });
  const [who, setWho] = useState<string[]>([]);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  return (
    <Grid>
      <Panel title="Create and assign a task">
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            const n = Number(f.qty);
            if (!Number.isInteger(n) || n < 1) x.qty = "Enter a quantity.";
            if (!f.deadline) x.deadline = "Choose a deadline.";
            else if (f.deadline < new Date().toISOString().slice(0, 10)) x.deadline = "Deadline can’t be in the past.";
            if (!who.length) x.who = "Choose at least one street leader.";
            setErrs(x);
            if (Object.keys(x).length) return;
            setBusy(true);
            await simulate();
            setBusy(false);
            setAssigned([{ id: `T-${String(Date.now()).slice(-4)}`, type: f.type, qty: n, deadline: f.deadline, leaders: who }, ...assigned]);
            log(`assigned ${f.type} × ${n} to ${who.join(", ")}`);
            toast(`Task sent to ${who.length} street leader(s)`);
            setF({ ...f, qty: "", deadline: "" });
            setWho([]);
          }}
        >
          <SelectField label="Task type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} options={rateCard.map((r) => r.type)} />
          <TextField label="Quantity" type="number" inputMode="numeric" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} error={errs.qty} />
          <TextField label="Deadline" type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} error={errs.deadline} />
          <fieldset className="plain">
            <legend>Assign to</legend>
            {wardStreetLeaders.map((s) => (
              <label key={s.id} className="check">
                <input type="checkbox" checked={who.includes(s.name)} onChange={(e) => setWho(e.target.checked ? [...who, s.name] : who.filter((x) => x !== s.name))} />
                <span>
                  {s.name} · {s.street}
                  {s.training !== "Complete" ? " (training incomplete — can’t log tasks yet)" : ""}
                </span>
              </label>
            ))}
            {errs.who && <p className="field-error">{errs.who}</p>}
          </fieldset>
          <SubmitButton busy={busy}>Assign task</SubmitButton>
        </form>
      </Panel>
      <Panel title="Assigned this week">
        {assigned.length ? (
          <ul className="rows">
            {assigned.map((a) => (
              <li key={a.id}>
                <span className="row-main">
                  <strong>
                    {a.type} × {a.qty}
                  </strong>
                  <span className="small muted">
                    Due {fmtDate(a.deadline)} · {a.leaders.join(", ")}
                  </span>
                </span>
                <Badge tone="info">Assigned</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No tasks assigned yet" />
        )}
      </Panel>
    </Grid>
  );
}

/* WL-5 */
function Coverage({ ward }: { ward: string }) {
  return (
    <Panel title={`Coverage map · ${ward}`} action={<DemoTag />}>
      <div className="tile-map tile-map-wide">
        {wardStreets.map((s) => {
          const pct = s.visited / s.houses;
          return (
            <span key={s.street} data-level={!s.leader ? 0 : pct < 0.34 ? 1 : pct < 0.67 ? 2 : pct < 0.9 ? 3 : 4}>
              {s.street}
              <br />
              {s.leader ? `${Math.round(pct * 100)}%` : "No leader"}
            </span>
          );
        })}
      </div>
      <p className="legend">
        {["No leader", "Under a third visited", "Up to two thirds", "Most visited", "90%+ visited"].map((t, i) => (
          <span key={t}>
            <i className="legend-swatch" data-level={i} />
            {t}
          </span>
        ))}
      </p>
      <DataTable
        rows={wardStreets}
        rowKey={(r) => r.street}
        caption="Coverage by street (text equivalent of the map)"
        columns={[
          { key: "street", header: "Street", sortable: true },
          { key: "leader", header: "Street leader", render: (r) => r.leader ?? <Badge tone="danger">None</Badge> },
          { key: "visited", header: "Houses visited", align: "right", render: (r) => `${r.visited}/${r.houses}`, value: (r) => r.visited, sortable: true },
          { key: "materials", header: "Materials distributed", align: "right", sortable: true, value: (r) => r.materials },
        ]}
      />
    </Panel>
  );
}

/* WL-6 — publish blocked until every safety item is ticked */
const SAFETY_ITEMS = ["Police notice submitted to the divisional police office", "Marshals assigned (1 per 50 attendees)", "Exits identified and kept clear", "First-aid kit and trained first aider", "Venue capacity checked"];
function Events({ log }: { log: (w: string) => void }) {
  type Ev = { id: string; title: string; date: string; venue: string; checklist: string[]; published: boolean; rsvps: string[] };
  const [events, setEvents] = usePersisted<Ev[]>("tbh-wl-events", [
    { id: "WE-1", title: "Village meeting: why ‘We will not steal your money’ matters", date: "2026-11-28", venue: "Gama primary school hall", checklist: SAFETY_ITEMS.slice(0, 3), published: false, rsvps: ["Abubakar", "Zainab", "Hadiza", "Maryam", "Sadiq"] },
  ]);
  const [form, setForm] = useState({ title: "", date: "", venue: "" });
  const [err, setErr] = useState("");
  const toast = useToast();
  return (
    <>
      {events.map((ev) => {
        const ready = SAFETY_ITEMS.every((i) => ev.checklist.includes(i));
        const update = (patch: Partial<Ev>) => setEvents(events.map((x) => (x.id === ev.id ? { ...x, ...patch } : x)));
        return (
          <Panel key={ev.id} title={ev.title} action={ev.published ? <Badge tone="ok">Published</Badge> : <Badge tone="warn">Draft</Badge>}>
            <p className="small muted">
              {fmtDate(ev.date)} · {ev.venue} · {ev.rsvps.length} RSVPs
            </p>
            <Grid>
              <div>
                <Checklist legend="Safety checklist" items={SAFETY_ITEMS} value={ev.checklist} onChange={(v) => update({ checklist: v, published: ev.published && SAFETY_ITEMS.every((i) => v.includes(i)) })} />
                <Meter value={ev.checklist.length} max={SAFETY_ITEMS.length} label="Checklist progress" />
                <p className="small muted">
                  {ev.checklist.length} of {SAFETY_ITEMS.length} complete
                </p>
              </div>
              <div>
                <h3 className="h3-sm">RSVP list (first names)</h3>
                <p>{ev.rsvps.join(", ")}</p>
              </div>
            </Grid>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!ready || ev.published}
                aria-describedby={`why-${ev.id}`}
                onClick={() => {
                  update({ published: true });
                  log(`published event “${ev.title}”`);
                  toast("Event published to the calendar");
                }}
              >
                {ev.published ? "Published" : "Publish event"}
              </button>
              {!ready && (
                <span id={`why-${ev.id}`} className="small muted">
                  <Lock size={14} aria-hidden /> Tick every safety item to publish.
                </span>
              )}
            </div>
          </Panel>
        );
      })}
      <Panel title="Plan an event or village meeting">
        <form
          className="form-grid form-grid-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.title.trim() || !form.date || !form.venue.trim()) return setErr("Fill in the title, date and venue.");
            setErr("");
            setEvents([...events, { id: `WE-${Date.now()}`, ...form, checklist: [], published: false, rsvps: [] }]);
            log(`created draft event “${form.title}”`);
            setForm({ title: "", date: "", venue: "" });
          }}
        >
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <TextField label="Venue" className="span-2" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} error={err} />
          <button type="submit" className="btn btn-outline">
            Create draft
          </button>
        </form>
      </Panel>
    </>
  );
}

/* WL-7 */
const STAGES = ["Proposed", "Approved", "Published", "Funded", "Delivered"] as const;
function Projects({ log }: { log: (w: string) => void }) {
  type P = { id: string; title: string; cost: number; stage: (typeof STAGES)[number]; raised: number; proof?: string };
  const [projects, setProjects] = usePersisted<P[]>("tbh-wl-projects", [
    { id: "WP-1", title: "Community borehole repair, Gama", cost: 640000, stage: "Funded", raised: 640000 },
    { id: "WP-2", title: "Fliers for Gama Road and Hotoro Road", cost: 120000, stage: "Published", raised: 54000 },
  ]);
  const [f, setF] = useState({ title: "", cost: "", why: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const toast = useToast();
  return (
    <>
      <Panel title="Your ward’s projects" action={<DemoTag />}>
        <ul className="funded">
          {projects.map((p) => (
            <li key={p.id} className="funded-item">
              <div className="funded-head">
                <h3>{p.title}</h3>
                <Badge tone={p.stage === "Delivered" ? "ok" : "info"}>{p.stage}</Badge>
              </div>
              <ol className="pipeline" aria-label="Project stage">
                {STAGES.map((s) => (
                  <li key={s} data-done={STAGES.indexOf(s) <= STAGES.indexOf(p.stage) ? "true" : undefined}>
                    {s}
                  </li>
                ))}
              </ol>
              <Meter value={p.raised} max={p.cost} label={`${p.title} funding`} />
              <p className="small muted">
                {naira(p.raised)} of {naira(p.cost)} raised
              </p>
              {p.stage === "Funded" && (
                <label className="btn btn-sm btn-outline upload-btn">
                  <Upload size={16} aria-hidden /> Upload delivery proof
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setProjects(projects.map((x) => (x.id === p.id ? { ...x, stage: "Delivered", proof: file.name } : x)));
                      log(`uploaded delivery proof “${file.name}” for ${p.title}`);
                      toast("Proof uploaded — the project shows as delivered once the state team verifies it");
                    }}
                  />
                </label>
              )}
              {p.proof && <p className="small">Proof: {p.proof} (kept on this device in the prototype)</p>}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Propose a community project">
        <form
          className="form-grid"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (f.title.trim().length < 6) x.title = "Give the project a clear name.";
            const c = Number(f.cost);
            if (!c || c < 5000) x.cost = "Enter the estimated cost in naira.";
            if (f.why.trim().length < 20) x.why = "Explain what it funds and who benefits.";
            setErrs(x);
            if (Object.keys(x).length) return;
            setProjects([...projects, { id: `WP-${Date.now()}`, title: f.title.trim(), cost: c, stage: "Proposed", raised: 0 }]);
            log(`proposed project “${f.title.trim()}” (${naira(c)})`);
            toast("Proposal sent to the state coordinator");
            setF({ title: "", cost: "", why: "" });
          }}
        >
          <TextField label="Project name" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} error={errs.title} />
          <TextField label="Estimated cost (₦)" type="number" inputMode="numeric" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} error={errs.cost} />
          <TextArea label="What it funds and who benefits" value={f.why} onChange={(e) => setF({ ...f, why: e.target.value })} error={errs.why} />
          <button type="submit" className="btn btn-primary">
            Send proposal
          </button>
        </form>
      </Panel>
    </>
  );
}

/* WL-8 */
function Materials({ log }: { log: (w: string) => void }) {
  const [alloc, setAlloc] = usePersisted<{ item: string; street: string; qty: number; at: string }[]>("tbh-wl-alloc", []);
  const [f, setF] = useState({ item: materials[0].item, street: wardStreets[0].street, qty: "" });
  const [err, setErr] = useState("");
  const toast = useToast();
  const stock = (item: string) => {
    const m = materials.find((x) => x.item === item)!;
    return m.received * 4 - alloc.filter((a) => a.item === item).reduce((s, a) => s + a.qty, 0);
  };
  return (
    <Grid>
      <Panel title="Ward stock (received from state)" action={<DemoTag />}>
        <ul className="rows">
          {materials.map((m) => (
            <li key={m.item}>
              <span className="row-main">
                <strong>{m.item}</strong>
              </span>
              <strong>{stock(m.item).toLocaleString("en-NG")} in stock</strong>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-outline" onClick={() => toast("Reorder request sent to the state logistics team")}>
          Request reorder from state
        </button>
      </Panel>
      <Panel title="Allocate to a street">
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(f.qty);
            if (!Number.isInteger(n) || n < 1) return setErr("Enter a quantity.");
            if (n > stock(f.item)) return setErr(`Only ${stock(f.item)} in stock.`);
            setErr("");
            setAlloc([{ item: f.item, street: f.street, qty: n, at: new Date().toISOString() }, ...alloc]);
            log(`allocated ${n} ${f.item} to ${f.street}`);
            toast("Allocated");
            setF({ ...f, qty: "" });
          }}
        >
          <SelectField label="Item" value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} options={materials.map((m) => m.item)} />
          <SelectField label="Street" value={f.street} onChange={(e) => setF({ ...f, street: e.target.value })} options={wardStreets.filter((s) => s.leader).map((s) => s.street)} />
          <TextField label="Quantity" type="number" inputMode="numeric" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} error={err} />
          <button type="submit" className="btn btn-primary">
            Allocate
          </button>
        </form>
        {alloc.length > 0 && (
          <ul className="rows">
            {alloc.map((a, i) => (
              <li key={i}>
                <span className="row-main">
                  <strong>
                    {a.qty} × {a.item}
                  </strong>
                  <span className="small muted">
                    {a.street} · {fmtDate(a.at, true)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Grid>
  );
}

/* WL-9 */
function Earnings() {
  const rows = [
    { id: "WE-01", source: "Project management — borehole repair", amount: 32000, status: "Approved" },
    { id: "WE-02", source: "Ads management — ward radio mentions", amount: 15000, status: "Paid" },
    { id: "WE-03", source: "Vendor brokerage — sticker order", amount: 8500, status: "Pending" },
    { id: "WE-04", source: "Pickup-point deliveries (6 orders)", amount: 3000, status: "Pending" },
  ];
  return (
    <Panel title="My earnings" action={<DemoTag />}>
      <Kpis items={["Pending", "Approved", "Paid"].map((s) => ({ label: s, value: naira(rows.filter((r) => r.status === s).reduce((a, r) => a + r.amount, 0)) }))} />
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        caption="Earnings by source"
        columns={[
          { key: "source", header: "Source" },
          { key: "amount", header: "Amount", align: "right", render: (r) => naira(r.amount), value: (r) => r.amount, sortable: true },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Paid" ? "ok" : r.status === "Approved" ? "info" : "warn"}>{r.status}</Badge> },
        ]}
      />
      <p className="small muted">Your own earnings are approved by the state team, never by you. Payouts need two people: an approver and a different releaser (GR-5).</p>
    </Panel>
  );
}

/* WL-10 */
function Incidents() {
  return (
    <Panel title="Incidents in your ward" action={<DemoTag />}>
      <ul className="rows">
        {wardIncidents.map((i) => (
          <li key={i.id}>
            <span className="row-main">
              <strong>
                {i.restricted ? (
                  <>
                    <Lock size={14} aria-hidden /> Restricted report — routed to National Safeguarding Lead
                  </>
                ) : (
                  i.type
                )}
              </strong>
              <span className="small muted">
                {i.id} · reported {fmtDate(i.reported)} · {i.status}
              </span>
            </span>
            <Badge tone={i.severity === "Critical" ? "danger" : i.severity === "High" ? "warn" : "muted"}>{i.severity}</Badge>
          </li>
        ))}
      </ul>
      <p className="small muted">Details of sexual-abuse reports are never shown to ward leaders; they go straight to the national lead.</p>
    </Panel>
  );
}

/* WL-11 */
function Broadcast({ log }: { log: (w: string) => void }) {
  const [msg, setMsg] = useState("");
  const [inApp, setInApp] = useState(true);
  const [wa, setWa] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = usePersisted<{ text: string; channels: string; at: string }[]>("tbh-wl-broadcasts", []);
  const toast = useToast();
  const channels = [inApp && "in-app", wa && "WhatsApp"].filter(Boolean).join(" + ");
  return (
    <Grid>
      <Panel title="Message all street leaders">
        <TextArea label="Message" value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} hint={`${msg.length}/500`} error={err} />
        <CheckField label="In-app" checked={inApp} onChange={(e) => setInApp(e.target.checked)} />
        <CheckField label="WhatsApp (Business API, opt-in only)" checked={wa} onChange={(e) => setWa(e.target.checked)} />
        {msg.trim() && (
          <div className="preview-msg">
            <span className="small muted">Preview</span>
            <p>{msg}</p>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (msg.trim().length < 5) return setErr("Write a message first.");
            if (!channels) return setErr("Choose at least one channel.");
            setErr("");
            setConfirm(true);
          }}
        >
          <Megaphone size={16} aria-hidden /> Send to {wardStreetLeaders.length} street leaders
        </button>
      </Panel>
      <Panel title="Sent">
        {sent.length ? (
          <ul className="rows">
            {sent.map((s, i) => (
              <li key={i}>
                <span className="row-main">
                  <strong>{s.text}</strong>
                  <span className="small muted">
                    {s.channels} · {fmtDate(s.at, true)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No broadcasts yet" />
        )}
      </Panel>
      <ConfirmDialog
        open={confirm}
        onCancel={() => setConfirm(false)}
        title="Send this broadcast?"
        confirmLabel="Send"
        text={<p>It goes to {wardStreetLeaders.length} street leaders by {channels}. Messages count towards each person’s daily notification limit. Paid ads and broadcasts stop automatically at the campaign cut-off.</p>}
        onConfirm={() => {
          setSent([{ text: msg.trim(), channels, at: new Date().toISOString() }, ...sent]);
          log(`broadcast to street leaders (${channels})`);
          setMsg("");
          setConfirm(false);
          toast("Broadcast sent (simulated)");
        }}
      />
    </Grid>
  );
}

/* WL-12 */
const FUNNEL = ["Applied", "Interviewed", "Vetted", "Training", "Active"];
function Recruitment({ log }: { log: (w: string) => void }) {
  const [people, setPeople] = usePersisted("tbh-wl-recruits", recruitment);
  const toast = useToast();
  return (
    <>
      <Panel title="Recruitment funnel" action={<DemoTag />}>
        <BarChart label="Applicants by stage" data={FUNNEL.map((s) => ({ label: s, value: people.filter((p) => p.stage === s).length }))} />
      </Panel>
      <Panel title="Applicants">
        <ul className="rows">
          {people.map((p, i) => {
            const idx = FUNNEL.indexOf(p.stage);
            return (
              <li key={p.name}>
                <span className="row-main">
                  <strong>{p.name}</strong>
                  <span className="small muted">
                    {p.street} · {p.vetting}
                  </span>
                </span>
                <span className="row-actions">
                  <Badge tone={p.stage === "Active" ? "ok" : "info"}>{p.stage}</Badge>
                  {idx < FUNNEL.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      disabled={p.stage === "Applied" && p.vetting.includes("pending")}
                      title={p.stage === "Applied" && p.vetting.includes("pending") ? "ID check must clear first" : undefined}
                      onClick={() => {
                        const next = FUNNEL[idx + 1];
                        setPeople(people.map((x, j) => (j === i ? { ...x, stage: next } : x)));
                        log(`moved ${p.name} to ${next}`);
                        toast(`${p.name} → ${next}`);
                      }}
                    >
                      Move to {FUNNEL[idx + 1]}
                    </button>
                  )}
                  {p.stage === "Applied" && p.vetting.includes("pending") && (
                    <span className="small muted">
                      <Ban size={12} aria-hidden /> ID check pending
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </>
  );
}

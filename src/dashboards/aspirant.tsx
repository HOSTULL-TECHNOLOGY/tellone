"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Download, FileText, MessageSquare, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Badge, Grid, Kpis, Meter, Panel, naira } from "@/components/dashboard/kit";
import { CheckField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { aspirantCalendar, aspirantOrders, packages, sharedAdSlots, type AspirantOrder } from "@/data/mock/field";
import { AuditPanel, DemoTag, download, fmtDate, toCsv, useAudit, usePersisted } from "./field/common";

const STAGES = ["Scheduled", "In production", "Review", "Delivered"] as const;
type Booking = { slotId: string; at: string };
const CO_SHARERS: Record<string, string[]> = {
  "SA-1": ["Aspirant, Bosso LGA", "Aspirant, Suleja LGA", "Aspirant, Bida LGA", "Aspirant, Kontagora LGA"],
  "SA-2": ["Aspirant, Chanchaga LGA"],
  "SA-3": ["Aspirant, Lapai LGA", "Aspirant, Mokwa LGA", "Aspirant, Agaie LGA", "Aspirant, Rijau LGA", "Aspirant, Wushishi LGA"],
};

export default function AspirantDashboard({ section }: { section: string }) {
  return <DashboardShell role="aspirant" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

const useOrders = () => usePersisted<AspirantOrder[]>("tbh-as-orders", aspirantOrders);
const useBookings = () => usePersisted<Booking[]>("tbh-as-bookings", []);

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const audit = useAudit("aspirant", `${user.firstName} ${user.lastName} (aspirant)`);
  switch (section) {
    case "orders":
      return <Orders />;
    case "review":
      return <Review log={audit.log} items={audit.items} />;
    case "shared-ads":
      return <SharedAds log={audit.log} />;
    case "invoices":
      return <Invoices user={user} />;
    case "calendar":
      return <Calendar />;
    case "assets":
      return <Assets />;
    default:
      return <Packages log={audit.log} />;
  }
}

/* AS-1 */
function Packages({ log }: { log: (w: string) => void }) {
  const [orders, setOrders] = useOrders();
  const [pick, setPick] = useState<(typeof packages)[number] | null>(null);
  const [f, setF] = useState({ start: "", brief: "", terms: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  return (
    <>
      <Notice tone="info" title="For NDC aspirants">
        Services are provided at cost or discounted. Every package is invoiced and appears in your spend statement for your campaign finance returns.
      </Notice>
      <Panel title="Packages">
        <ul className="pkg-grid">
          {packages.map((p) => (
            <li key={p.id}>
              <h3>{p.name}</h3>
              <span className="pkg-price">{p.price ? naira(p.price) : "Free"}</span>
              <Badge tone={p.price ? "info" : "ok"}>{p.note}</Badge>
              <p className="small">{p.includes}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setPick(p);
                  setF({ start: "", brief: "", terms: false });
                  setErrs({});
                }}
              >
                Order
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      <Dialog open={!!pick} onClose={() => setPick(null)} title={`Order: ${pick?.name ?? ""}`}>
        {pick && (
          <form
            className="form-grid"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const x: Record<string, string> = {};
              if (!f.start) x.start = "Choose a preferred start date.";
              else if (f.start < new Date().toISOString().slice(0, 10)) x.start = "Choose a future date.";
              if (f.brief.trim().length < 15) x.brief = "Tell us a little about what you need.";
              if (!f.terms) x.terms = "Please accept the service terms.";
              setErrs(x);
              if (Object.keys(x).length) return;
              setBusy(true);
              await simulate();
              setBusy(false);
              const id = `AO-${130 + orders.length}`;
              setOrders([...orders, { id, pkg: pick.name, status: "Scheduled", due: f.start, amount: pick.price }]);
              log(`ordered ${pick.name} (${id}, ${pick.price ? naira(pick.price) : "free"})`);
              toast(`Order ${id} placed — we’ll confirm the schedule within 2 working days`);
              setPick(null);
            }}
          >
            <p>
              <strong>{pick.price ? naira(pick.price) : "Free"}</strong> · {pick.includes}
            </p>
            <TextField label="Preferred start date" type="date" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} error={errs.start} />
            <TextArea label="What do you need?" value={f.brief} onChange={(e) => setF({ ...f, brief: e.target.value })} error={errs.brief} rows={3} />
            <CheckField label="I accept the service terms. Content must follow the code of conduct and the Electoral Act." checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} error={errs.terms} />
            <SubmitButton busy={busy}>Place order</SubmitButton>
          </form>
        )}
      </Dialog>
    </>
  );
}

/* AS-2 */
function Orders() {
  const [orders] = useOrders();
  return (
    <Panel title="My orders" action={<DemoTag />}>
      <ul className="funded">
        {orders.map((o) => (
          <li key={o.id} className="funded-item">
            <div className="funded-head">
              <h3>
                {o.pkg} <span className="small muted">· {o.id}</span>
              </h3>
              <Badge tone={o.status === "Delivered" ? "ok" : o.status === "Review" ? "warn" : "info"}>{o.status}</Badge>
            </div>
            <ol className="pipeline" aria-label={`Progress of ${o.id}`}>
              {STAGES.map((s) => (
                <li key={s} data-done={STAGES.indexOf(s) <= STAGES.indexOf(o.status) ? "true" : undefined} data-current={s === o.status ? "true" : undefined} aria-current={s === o.status ? "step" : undefined}>
                  {s}
                </li>
              ))}
            </ol>
            <p className="small muted">
              {o.status === "Delivered" ? "Delivered" : `Due ${fmtDate(o.due)}`} · {o.amount ? naira(o.amount) : "Free"}
              {o.decision ? ` · ${o.decision}` : ""}
            </p>
            {o.status === "Review" && (
              <Link className="btn btn-sm btn-primary" href="/dashboard/aspirant/review">
                Review now
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* AS-3 */
function Review({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  const [orders, setOrders] = useOrders();
  const [changes, setChanges] = useState<AspirantOrder | null>(null);
  const [approve, setApprove] = useState<AspirantOrder | null>(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const toast = useToast();
  const inReview = orders.filter((o) => o.status === "Review");
  const decided = orders.filter((o) => o.decision);
  return (
    <>
      <Panel title="Awaiting your review">
        {inReview.length ? (
          <ul className="funded">
            {inReview.map((o) => (
              <li key={o.id} className="funded-item">
                <div className="funded-head">
                  <h3>{o.pkg}</h3>
                  <span className="small muted">{o.id}</span>
                </div>
                <div className="file-preview">
                  <FileText size={32} aria-hidden />
                  <span>
                    {o.deliverable}
                    <br />
                    <span className="small muted">Preview link sent by the production team</span>
                  </span>
                </div>
                {o.comments && <p className="small">Your last comments: “{o.comments}”</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-primary" onClick={() => setApprove(o)}>
                    <Check size={16} aria-hidden /> Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setChanges(o);
                      setText("");
                      setErr("");
                    }}
                  >
                    <MessageSquare size={16} aria-hidden /> Request changes
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nothing to review" text="Work appears here when it reaches the Review stage." />
        )}
      </Panel>
      <Panel title="Decisions">
        <ul className="rows">
          {decided.map((o) => (
            <li key={o.id}>
              <span className="row-main">
                <strong>{o.pkg}</strong>
                <span className="small muted">
                  {o.id}
                  {o.comments ? ` · “${o.comments}”` : ""}
                </span>
              </span>
              <Badge tone={o.decision === "Approved" ? "ok" : "warn"}>{o.decision}</Badge>
            </li>
          ))}
        </ul>
      </Panel>
      <AuditPanel items={items} />
      <ConfirmDialog
        open={!!approve}
        onCancel={() => setApprove(null)}
        title="Approve this work?"
        confirmLabel="Approve and mark delivered"
        text={<p>Approving confirms you are happy with “{approve?.deliverable}”. The order is marked delivered and the invoice becomes payable.</p>}
        onConfirm={() => {
          if (approve) {
            setOrders(orders.map((o) => (o.id === approve.id ? { ...o, status: "Delivered", decision: "Approved" } : o)));
            log(`approved ${approve.id} (${approve.pkg})`);
            toast("Approved — marked as delivered");
          }
          setApprove(null);
        }}
      />
      <Dialog
        open={!!changes}
        onClose={() => setChanges(null)}
        title="Request changes"
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setChanges(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (text.trim().length < 10) return setErr("Describe the changes you need (at least a sentence).");
                if (changes) {
                  setOrders(orders.map((o) => (o.id === changes.id ? { ...o, status: "In production", decision: "Changes requested", comments: text.trim() } : o)));
                  log(`requested changes on ${changes.id}: ${text.trim()}`);
                  toast("Changes requested — the team will send a new version");
                }
                setChanges(null);
              }}
            >
              Send comments
            </button>
          </>
        }
      >
        <TextArea label="Comments for the production team" value={text} onChange={(e) => setText(e.target.value)} error={err} rows={4} />
      </Dialog>
    </>
  );
}

/* AS-4 */
function SharedAds({ log }: { log: (w: string) => void }) {
  const [bookings, setBookings] = useBookings();
  const [confirm, setConfirm] = useState<(typeof sharedAdSlots)[number] | null>(null);
  const toast = useToast();
  return (
    <>
      <Notice tone="info" title="How shared ads work">
        Several aspirants share one advert and split the cost equally. Each aspirant’s message gets equal time or space. Shared ads stop automatically at the campaign cut-off.
      </Notice>
      <Panel title="Available slots" action={<DemoTag />}>
        <ul className="funded">
          {sharedAdSlots.map((s) => {
            const mine = bookings.some((b) => b.slotId === s.id);
            const taken = s.taken + (mine ? 1 : 0);
            const full = taken >= s.slots;
            const sharers = CO_SHARERS[s.id] ?? [];
            return (
              <li key={s.id} className="funded-item">
                <div className="funded-head">
                  <h3>{s.outlet}</h3>
                  <strong>{naira(s.costPerSlot)} each</strong>
                </div>
                <p className="small muted">
                  Runs {fmtDate(s.date)} · {taken} of {s.slots} places taken · total cost {naira(s.costPerSlot * s.slots)} split {s.slots} ways
                </p>
                <Meter value={taken} max={s.slots} label={`${s.outlet} places taken`} />
                <p className="small">
                  <Users size={14} aria-hidden /> Co-sharers: {sharers.slice(0, s.taken).join(", ") || "none yet"}
                  {mine ? ", you" : ""}
                </p>
                <div className="form-actions">
                  {mine ? (
                    <>
                      <Badge tone="ok">Booked</Badge>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          setBookings(bookings.filter((b) => b.slotId !== s.id));
                          log(`cancelled shared ad booking ${s.id}`);
                        }}
                      >
                        Cancel booking
                      </button>
                    </>
                  ) : full ? (
                    <Badge tone="muted">Full</Badge>
                  ) : (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setConfirm(s)}>
                      Book a place
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        title="Book this shared slot?"
        confirmLabel="Book"
        text={
          <p>
            {confirm?.outlet} on {confirm ? fmtDate(confirm.date) : ""}. Your share: <strong>{confirm ? naira(confirm.costPerSlot) : ""}</strong>, invoiced after the advert runs.
          </p>
        }
        onConfirm={() => {
          if (confirm) {
            setBookings([...bookings, { slotId: confirm.id, at: new Date().toISOString() }]);
            log(`booked shared ad ${confirm.id} (${naira(confirm.costPerSlot)})`);
            toast("Booked");
          }
          setConfirm(null);
        }}
      />
    </>
  );
}

/* AS-5 */
function Invoices({ user }: { user: DemoUser }) {
  const [orders] = useOrders();
  const [bookings] = useBookings();
  const lines = [
    ...orders.map((o) => ({ ref: `INV-${o.id}`, item: o.pkg, date: o.due, amount: o.amount, status: o.status === "Delivered" ? (o.amount ? "Paid" : "No charge") : "Not yet due" })),
    ...bookings.map((b) => {
      const s = sharedAdSlots.find((x) => x.id === b.slotId)!;
      return { ref: `INV-${s.id}`, item: `Shared ad: ${s.outlet}`, date: s.date, amount: s.costPerSlot, status: "Due after advert runs" };
    }),
  ].sort((a, b) => a.date.localeCompare(b.date));
  let run = 0;
  const withRun = lines.map((l) => ({ ...l, running: (run += l.amount) }));
  const paid = lines.filter((l) => l.status === "Paid").reduce((a, l) => a + l.amount, 0);
  return (
    <>
      <Kpis
        items={[
          { label: "Total committed", value: naira(run) },
          { label: "Paid", value: naira(paid), tone: "ok" },
          { label: "Outstanding", value: naira(run - paid), tone: run - paid ? "warn" : undefined },
        ]}
      />
      <Panel title="Invoices & spend">
        <DataTable
          rows={withRun}
          rowKey={(r) => r.ref}
          caption="Invoices with running total"
          columns={[
            { key: "ref", header: "Invoice" },
            { key: "item", header: "Item" },
            { key: "date", header: "Date", render: (r) => fmtDate(r.date), value: (r) => r.date, sortable: true },
            { key: "amount", header: "Amount", align: "right", render: (r) => (r.amount ? naira(r.amount) : "Free") },
            { key: "running", header: "Running total", align: "right", render: (r) => naira(r.running) },
            { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Paid" || r.status === "No charge" ? "ok" : "muted"}>{r.status}</Badge> },
          ]}
        />
        <div className="running-total">
          <span>Running total</span>
          <span>{naira(run)}</span>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              download(
                `tbh-one-spend-statement-${user.lastName.toLowerCase()}.csv`,
                toCsv([...withRun.map((r) => ({ invoice: r.ref, item: r.item, date: r.date, amount_naira: r.amount, running_total_naira: r.running, status: r.status })), { invoice: "TOTAL", item: "", date: "", amount_naira: run, running_total_naira: run, status: "" }]),
                "text/csv",
              )
            }
          >
            <Download size={16} aria-hidden /> Export full spend statement
          </button>
        </div>
        <p className="small muted">Keep this statement for your INEC campaign expenses return.</p>
      </Panel>
    </>
  );
}

/* AS-6 */
function Calendar() {
  const [bookings] = useBookings();
  const items = [
    ...aspirantCalendar,
    ...bookings.map((b) => {
      const s = sharedAdSlots.find((x) => x.id === b.slotId)!;
      return { date: s.date, what: `Shared advert: ${s.outlet}`, kind: "Advert" };
    }),
  ].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Panel title="Calendar" action={<DemoTag />}>
      <ul className="cal-list">
        {items.map((c, i) => {
          const d = new Date(c.date);
          return (
            <li key={i}>
              <span className="cal-date">
                <small>{d.toLocaleDateString("en-GB", { month: "short" })}</small>
                {d.getDate()}
              </span>
              <span>
                <strong>{c.what}</strong>
                <br />
                <span className="small muted">{d.toLocaleDateString("en-GB", { weekday: "long" })}</span>
              </span>
              <Badge tone="info">{c.kind}</Badge>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* AS-7 */
function Assets() {
  const [orders] = useOrders();
  const delivered = orders.filter((o) => o.status === "Delivered");
  return (
    <Grid>
      <Panel title="Your delivered assets">
        {delivered.length ? (
          <ul className="rows">
            {delivered.map((o) => (
              <li key={o.id}>
                <span className="row-main">
                  <strong>{o.pkg}</strong>
                  <span className="small muted">{o.deliverable}</span>
                </span>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => download(`${o.id}-assets.txt`, `Asset manifest for ${o.id} (${o.pkg})\n${o.deliverable}\n\nPrototype: the real files download from secure storage.`)}>
                  <Download size={16} aria-hidden /> Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No delivered assets yet" />
        )}
      </Panel>
      <Panel title="Campaign brand kit">
        <ul className="rows">
          {[
            ["TBH One logo (PNG)", "/brand/tbh-one-logo.png"],
            ["Tagline poster (English)", "/media/poster-en-1320.jpg"],
            ["Tagline poster (Hausa)", "/media/poster-ha-1320.jpg"],
            ["Theme song (English, MP3)", "/audio/we-no-go-thief-your-money-v1-128.mp3"],
          ].map(([t, h]) => (
            <li key={h}>
              <span className="row-main">
                <strong>{t}</strong>
              </span>
              <a className="btn btn-sm btn-outline" href={h} download>
                <Download size={16} aria-hidden /> Download
              </a>
            </li>
          ))}
        </ul>
        <p className="small muted">Use the brand kit as supplied. Any material that says you are an NDC aspirant must carry the party’s approved disclaimer.</p>
      </Panel>
    </Grid>
  );
}

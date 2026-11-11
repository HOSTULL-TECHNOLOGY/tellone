"use client";

import { useState } from "react";
import { Bot, CheckCircle2, Headset, Search, Ticket as TicketIcon, User } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Badge, Grid, Kpis, Panel, type Tone } from "@/components/dashboard/kit";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { CopyButton, Dialog } from "@/components/ui/Interactive";
import { SelectField, TextArea, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { knowledge } from "@/data/knowledge";
import { callerDirectory, escalations as seedEsc, SLA_BY_PRIORITY, tickets as seedTickets, type Escalation, type Ticket } from "@/data/mock/backoffice";
import { fmtDuration, shortDateTime, useAudit, useNow, usePersisted } from "./office/common";

/** Approved taglines (Concept Note p.2). Other script text in non-English languages awaits translator review. */
const TAGLINES: Record<string, string> = {
  English: "We will not steal your money.",
  Pidgin: "We no go thief your money.",
  Yorùbá: "A ò ní jí owó yín.",
  Hausa: "Ba za mu saci kuɗinku ba.",
  Igbo: "Anyị agaghị ezu ohi ego unu.",
};

export default function CallCentreDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="call-centre" section={section}>
      {(user) => <CallCentre section={section} user={user} />}
    </DashboardShell>
  );
}

function CallCentre({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const [tickets, setTickets] = usePersisted<Ticket[]>("tbh-ofc-cc-tickets", seedTickets);
  const [, addAudit] = useAudit("tbh-ofc-cc-audit");
  const addTicket = (t: Omit<Ticket, "id" | "createdAt" | "status" | "slaHours">) => {
    const id = `TK-${4413 + tickets.length}`;
    setTickets((all) => [{ ...t, id, createdAt: new Date().toISOString(), status: "Open", slaHours: SLA_BY_PRIORITY[t.priority] }, ...all]);
    addAudit(me, `created ${id} → ${t.route}`);
    return id;
  };
  switch (section) {
    case "lookup":
      return <Lookup />;
    case "tickets":
      return <Tickets tickets={tickets} setTickets={setTickets} addTicket={addTicket} />;
    case "scripts":
      return <Scripts />;
    default:
      return <Escalations me={me} addTicket={addTicket} />;
  }
}

/* ---------------------------------------------------------------- CA-2 AI hand-off */
function Escalations({ me, addTicket }: { me: string; addTicket: (t: Omit<Ticket, "id" | "createdAt" | "status" | "slaHours">) => string }) {
  const now = useNow(1000);
  const toast = useToast();
  const [list, setList] = usePersisted<Escalation[]>("tbh-ofc-cc-escalations", seedEsc);
  const [active, setActive] = useState<string | null>(null);
  const [route, setRoute] = useState<Ticket["route"]>("Support");
  const [priority, setPriority] = useState<Ticket["priority"]>("Normal");
  const [summary, setSummary] = useState("");
  const [err, setErr] = useState("");
  const cur = list.find((e) => e.id === active) ?? list.find((e) => e.status !== "Resolved");
  const waiting = list.filter((e) => e.status === "Waiting");
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Waiting for a person", value: waiting.length, tone: waiting.length ? "warn" : "ok" },
          { label: "With an agent", value: list.filter((e) => e.status === "With agent").length },
          { label: "Longest wait", value: waiting.length ? fmtDuration(now - Math.min(...waiting.map((w) => new Date(w.waitingSince).getTime()))) : "—" },
        ]}
      />
      <Grid cols={2}>
        <Panel title="Escalations from the AI Call Agent">
          <ul className="rows" role="list">
            {list.map((e) => (
              <li key={e.id}>
                <div className="row-main">
                  <button type="button" className="linklike ofc-strong" aria-pressed={cur?.id === e.id} onClick={() => setActive(e.id)}>
                    {e.id} · {e.reason}
                  </button>
                  <span className="ofc-small ofc-muted">
                    {e.caller} · {e.language} · waiting {fmtDuration(now - new Date(e.waitingSince).getTime())}
                  </span>
                </div>
                <Badge tone={e.status === "Waiting" ? "warn" : e.status === "Resolved" ? "ok" : "info"}>{e.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
        {cur ? (
          <Panel title={`${cur.id}: ${cur.caller}`}>
            <p className="ofc-small">
              <Bot size={14} aria-hidden /> The AI identified itself as automated at the start of the call (GR-10). Full transcript handed over:
            </p>
            <ol className="ofc-transcript" aria-label="AI conversation transcript">
              {cur.transcript.map((t, i) => (
                <li key={i} className={t.who === "AI" ? "ai" : "caller"}>
                  <small>{t.who === "AI" ? "TBH One AI (automated)" : "Caller"}</small>
                  {t.text}
                </li>
              ))}
            </ol>
            {cur.status === "Waiting" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setList((all) => all.map((x) => (x.id === cur.id ? { ...x, status: "With agent" } : x)));
                  toast(`You're connected to ${cur.caller}`);
                }}
              >
                <Headset size={16} aria-hidden /> Accept call
              </button>
            )}
            {cur.status === "With agent" && (
              <form
                className="form-grid"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (summary.trim().length < 8) return setErr("Summarise the call in at least 8 characters.");
                  const id = addTicket({ subject: `${cur.reason} — ${summary.trim()}`, route, priority, caller: cur.caller });
                  setList((all) => all.map((x) => (x.id === cur.id ? { ...x, status: "Resolved" } : x)));
                  setActive(cur.id);
                  toast(`${id} created and routed to ${route}`);
                  setSummary("");
                  setErr("");
                }}
              >
                <TextArea label="Call summary" value={summary} onChange={(e) => setSummary(e.target.value)} error={err} required hint="No card details, PINs or PVC numbers." />
                <div className="form-grid form-grid-2">
                  <SelectField label="Route to" value={route} onChange={(e) => setRoute(e.target.value as Ticket["route"])} options={["Support", "Safeguarding", "Finance"]} />
                  <SelectField label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Ticket["priority"])} options={["Urgent", "High", "Normal"]} hint={`SLA: ${SLA_BY_PRIORITY[priority]} h`} />
                </div>
                {route === "Safeguarding" && (
                  <Notice tone="warn" title="Safeguarding">
                    Only record what the caller said. Details go to the restricted safeguarding queue; you won't see the case afterwards.
                  </Notice>
                )}
                <div className="ofc-actions">
                  <button type="submit" className="btn btn-primary">
                    <TicketIcon size={16} aria-hidden /> Create ticket and close call
                  </button>
                </div>
              </form>
            )}
            {cur.status === "Resolved" && <Notice tone="ok" title="Resolved">This call was closed by {me} with a routed ticket.</Notice>}
          </Panel>
        ) : (
          <Panel>
            <EmptyState icon={<CheckCircle2 size={28} aria-hidden />} title="No escalations waiting" />
          </Panel>
        )}
      </Grid>
    </div>
  );
}

/* ---------------------------------------------------------------- CA-1 Caller lookup */
function Lookup() {
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<(typeof callerDirectory)[number] | null | undefined>(undefined);
  return (
    <Grid cols={2}>
      <Panel title="Find a caller by phone">
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isNgPhone(phone)) return setErr("Enter a Nigerian mobile number, for example 0800 000 0021.");
            setErr("");
            setBusy(true);
            await simulate(500);
            const digits = phone.replace(/\D/g, "").replace(/^234/, "0");
            setResult(callerDirectory.find((c) => c.phone === digits) ?? null);
            setBusy(false);
          }}
        >
          <TextField label="Caller's phone number" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={err} hint="Demo numbers: 0800 000 0021, 0800 000 0023, 0800 000 0001" />
          <button type="submit" className="btn btn-primary" disabled={busy}>
            <Search size={16} aria-hidden /> {busy ? "Searching…" : "Look up"}
          </button>
        </form>
      </Panel>
      <Panel title="Member summary">
        {result === undefined ? (
          <p className="ofc-muted">Search to see the caller's record.</p>
        ) : result === null ? (
          <EmptyState title="No member with this number" text="Offer to help them join, or create a ticket as a guest caller." />
        ) : (
          <>
            <dl className="facts facts-2">
              <div>
                <dt>Member</dt>
                <dd>
                  <User size={14} aria-hidden /> {result.firstName} · {result.memberId}
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>
                  {result.lga}, {result.state}
                  {"country" in result && result.country ? ` · lives in ${result.country}` : ""}
                </dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{result.joined}</dd>
              </div>
              <div>
                <dt>Roles</dt>
                <dd>{result.roles.join(", ")}</dd>
              </div>
              <div>
                <dt>Impact Points</dt>
                <dd>{result.points.toLocaleString("en-NG")}</dd>
              </div>
              <div>
                <dt>Open tickets</dt>
                <dd>{result.openTickets}</dd>
              </div>
            </dl>
            <p className="ofc-lock">
              Payment details are never shown to call centre agents (CA-1). Route payment questions to Finance.
            </p>
          </>
        )}
      </Panel>
    </Grid>
  );
}

/* ---------------------------------------------------------------- CA-3 Tickets */
function Tickets({ tickets, setTickets, addTicket }: { tickets: Ticket[]; setTickets: (f: (t: Ticket[]) => Ticket[]) => void; addTicket: (t: Omit<Ticket, "id" | "createdAt" | "status" | "slaHours">) => string }) {
  const now = useNow(30_000);
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [caller, setCaller] = useState("");
  const [route, setRoute] = useState<Ticket["route"]>("Support");
  const [priority, setPriority] = useState<Ticket["priority"]>("Normal");
  const [err, setErr] = useState("");
  const routeTone: Record<Ticket["route"], Tone> = { Support: "info", Safeguarding: "danger", Finance: "warn" };
  const cols: Column<Ticket>[] = [
    { key: "id", header: "Ticket", sortable: true },
    { key: "subject", header: "Subject" },
    { key: "route", header: "Routed to", value: (t) => t.route, render: (t) => <Badge tone={routeTone[t.route]}>{t.route}</Badge> },
    { key: "priority", header: "Priority", sortable: true },
    {
      key: "sla",
      header: "SLA",
      value: (t) => new Date(t.createdAt).getTime() + t.slaHours * 3_600_000,
      sortable: true,
      render: (t) => {
        if (t.status === "Closed") return <span className="ofc-timer" data-state="ok">Met</span>;
        const left = new Date(t.createdAt).getTime() + t.slaHours * 3_600_000 - now;
        return <span className="ofc-timer" data-state={left < 0 ? "danger" : left < 4 * 3_600_000 ? "warn" : undefined}>{fmtDuration(left)}{left >= 0 ? " left" : ""}</span>;
      },
    },
    { key: "status", header: "Status", value: (t) => t.status, render: (t) => <Badge tone={t.status === "Closed" ? "ok" : t.status === "Open" ? "warn" : "info"}>{t.status}</Badge> },
    { key: "createdAt", header: "Created", sortable: true, value: (t) => t.createdAt, render: (t) => shortDateTime(t.createdAt) },
  ];
  return (
    <Panel title="Tickets" action={<button type="button" className="btn btn-sm btn-primary" onClick={() => setOpen(true)}>New ticket</button>}>
      <DataTable
        rows={tickets}
        columns={cols}
        rowKey={(t) => t.id}
        caption="Support, safeguarding and finance tickets"
        searchPlaceholder="Search tickets"
        actions={(t) =>
          t.status !== "Closed" ? (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => {
                setTickets((all) => all.map((x) => (x.id === t.id ? { ...x, status: x.status === "Open" ? "In progress" : "Closed" } : x)));
                toast(`${t.id} ${t.status === "Open" ? "in progress" : "closed"}`);
              }}
            >
              {t.status === "Open" ? "Start" : "Close"}
            </button>
          ) : null
        }
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="New ticket"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (subject.trim().length < 6) return setErr("Describe the issue in at least 6 characters.");
                const id = addTicket({ subject: subject.trim(), caller: caller.trim() || "Guest caller", route, priority });
                toast(`${id} routed to ${route}`);
                setOpen(false);
                setSubject("");
                setCaller("");
                setErr("");
              }}
            >
              Create and route
            </button>
          </>
        }
      >
        <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} error={err} required />
        <TextField label="Caller (member ID or 'Guest')" value={caller} onChange={(e) => setCaller(e.target.value)} />
        <SelectField label="Route to" value={route} onChange={(e) => setRoute(e.target.value as Ticket["route"])} options={["Support", "Safeguarding", "Finance"]} />
        <SelectField label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Ticket["priority"])} options={["Urgent", "High", "Normal"]} hint={`SLA ${SLA_BY_PRIORITY[priority]} hours`} />
      </Dialog>
    </Panel>
  );
}

/* ---------------------------------------------------------------- CA-4 Scripted answers */
function Scripts() {
  const [lang, setLang] = useState("English");
  const [q, setQ] = useState("");
  const items = knowledge.filter((k) => `${k.id} ${k.keywords.join(" ")} ${k.answer}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="ofc-stack">
      <Panel title="Scripted answers library">
        <div className="ofc-filters">
          <div className="field">
            <label htmlFor="sq">Search scripts</label>
            <input id="sq" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. join, election, scam" />
          </div>
          <SelectField label="Language" value={lang} onChange={(e) => setLang(e.target.value)} options={Object.keys(TAGLINES)} />
        </div>
        <div className="ofc-card" data-tone="ok">
          <div className="ofc-card-head">
            <span className="ofc-card-title">Approved tagline — {lang}</span>
            <CopyButton value={TAGLINES[lang]} />
          </div>
          <p lang={{ English: "en", Pidgin: "pcm", Yorùbá: "yo", Hausa: "ha", Igbo: "ig" }[lang]}>{TAGLINES[lang]}</p>
        </div>
        {lang !== "English" && (
          <Notice tone="warn" title="Translation pending">
            Approved {lang} scripts arrive from the translator network. Until then, answer in {lang} using the English script below as the source of truth.
          </Notice>
        )}
      </Panel>
      <div className="ofc-cards">
        {items.map((k) => (
          <article key={k.id} className="ofc-card">
            <div className="ofc-card-head">
              <span className="ofc-card-title">{k.keywords[0][0].toUpperCase() + k.keywords[0].slice(1)}</span>
              <CopyButton value={k.answer} />
            </div>
            <p>{k.answer}</p>
            <div className="ofc-meta">
              {k.links.map((l) => (
                <span key={l.path}>Send link: {l.path}</span>
              ))}
            </div>
          </article>
        ))}
        {items.length === 0 && <EmptyState title="No script matches" text="Escalate to a supervisor rather than guessing." />}
      </div>
    </div>
  );
}

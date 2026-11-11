"use client";

import { useEffect, useState } from "react";
import { Bell, Clock, Lock, Minus, Phone, Plus, Scale } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { BarChart, Badge, Grid, Kpis, Panel } from "@/components/dashboard/kit";
import { CheckField, SelectField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { CopyButton } from "@/components/ui/Interactive";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { chapter, chapterEvents, chapterRanking, homeStates, hometownProjects, remoteTasks, skillsBank, talkingPoints } from "@/data/mock/field";
import { AuditPanel, DemoTag, download, fmtDate, useAudit, usePersisted } from "./field/common";

export default function CountryCoordinatorDashboard({ section }: { section: string }) {
  return <DashboardShell role="country-coordinator" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const audit = useAudit("country", `${user.firstName} ${user.lastName} (country coordinator)`);
  switch (section) {
    case "home-states":
      return <HomeStates />;
    case "tell-one":
      return <TellOne log={audit.log} />;
    case "events":
      return <Events />;
    case "skills":
      return <Skills log={audit.log} />;
    case "in-kind":
      return <InKind log={audit.log} />;
    case "funding-offers":
      return <FundingOffers log={audit.log} items={audit.items} />;
    case "hometown":
      return <Hometown log={audit.log} />;
    case "leaderboard":
      return <Ranking />;
    default:
      return <Overview />;
  }
}

/* CC-1 */
function Overview() {
  const [convos] = usePersisted<number>("tbh-cc-convos", 0);
  return (
    <>
      <p className="ward-name">
        {chapter.name} · {chapter.timeZone} <DemoTag />
      </p>
      <Kpis
        items={[
          { label: "Chapter members", value: chapter.members.toLocaleString("en-GB"), sub: "+64 this month", trend: "up" },
          { label: "Active this week", value: chapter.activeThisWeek, sub: `${Math.round((chapter.activeThisWeek / chapter.members) * 100)}% of members` },
          { label: "Tell One conversations", value: (chapter.conversations + convos).toLocaleString("en-GB"), sub: "Calls home logged" },
          { label: "Skills volunteers", value: skillsBank.length, sub: `${skillsBank.reduce((a, s) => a + s.hours, 0)} hours a week` },
        ]}
      />
      <Grid>
        <Panel title="Top home states">
          <BarChart label="Chapter members by home state" data={homeStates.slice(0, 6).map((h) => ({ label: h.state, value: h.members }))} />
        </Panel>
        <Panel title="How diaspora members can help">
          <ul className="plain-list">
            <li><strong>Tell One:</strong> call family and friends at home and talk about the campaign.</li>
            <li><strong>Skills:</strong> volunteer professional skills to remote tasks.</li>
            <li><strong>In-kind:</strong> donate equipment, not cash, to hometown projects.</li>
          </ul>
          <Notice tone="warn" title="No foreign cash">
            Nigerian law restricts foreign funding of political activity. Cash offers are logged and held for legal review; they are never accepted through this dashboard.
          </Notice>
        </Panel>
      </Grid>
    </>
  );
}

/* CC-2 */
function HomeStates() {
  const max = Math.max(...homeStates.map((h) => h.members));
  return (
    <Panel title="Members by home state" action={<DemoTag />}>
      <div className="tile-map">
        {homeStates.map((h) => (
          <span key={h.state} data-level={Math.max(1, Math.ceil((h.members / max) * 4))}>
            {h.state}
            <br />
            {h.members}
          </span>
        ))}
      </div>
      <p className="legend">
        {["", "Fewer members", "", "", "Most members"].map((t, i) =>
          t ? (
            <span key={i}>
              <i className="legend-swatch" data-level={i} />
              {t}
            </span>
          ) : null,
        )}
      </p>
      <DataTable
        rows={homeStates}
        rowKey={(r) => r.state}
        caption="Chapter members by home state (text equivalent)"
        columns={[
          { key: "state", header: "Home state", sortable: true },
          { key: "members", header: "Members", align: "right", sortable: true, value: (r) => r.members },
        ]}
      />
    </Panel>
  );
}

/* CC-3 */
function TellOne({ log }: { log: (w: string) => void }) {
  const [convos, setConvos] = usePersisted<number>("tbh-cc-convos", 0);
  const [reminders, setReminders] = usePersisted<{ who: string; when: string; lang: string }[]>("tbh-cc-reminders", []);
  const [f, setF] = useState({ who: "", when: "", lang: "English" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const toast = useToast();
  const ics = (r: { who: string; when: string }) => {
    const d = new Date(r.when);
    const s = d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const e = new Date(d.getTime() + 20 * 60_000).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TBH One//Tell One//EN", "BEGIN:VEVENT", `UID:${s}-${Math.random().toString(36).slice(2)}@tbhone`, `DTSTAMP:${s}`, `DTSTART:${s}`, `DTEND:${e}`, `SUMMARY:Tell One call: ${r.who}`, "DESCRIPTION:Talk about why ‘We will not steal your money’ matters. Never ask for voter card details.", "BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", "DESCRIPTION:Tell One call", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  };
  return (
    <>
      <Panel title="Talking points in five languages">
        <ul className="lang-grid">
          {talkingPoints.map((t) => (
            <li key={t.lang}>
              <span className="today-kind">{t.lang}</span>
              <blockquote lang={{ English: "en", Pidgin: "pcm", "Yorùbá": "yo", Hausa: "ha", Igbo: "ig" }[t.lang]}>{t.text}</blockquote>
              <CopyButton value={t.text} label={`Copy ${t.lang}`} />
            </li>
          ))}
        </ul>
      </Panel>
      <Grid>
        <Panel title="Schedule a call home">
          <form
            className="form-grid"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const x: Record<string, string> = {};
              if (f.who.trim().length < 2) x.who = "Who will you call? A first name or relationship is enough.";
              if (!f.when) x.when = "Choose a date and time.";
              else if (new Date(f.when).getTime() < Date.now()) x.when = "Choose a time in the future.";
              setErrs(x);
              if (Object.keys(x).length) return;
              setReminders([...reminders, { ...f, who: f.who.trim() }].sort((a, b) => a.when.localeCompare(b.when)));
              toast("Reminder set");
              setF({ who: "", when: "", lang: f.lang });
            }}
          >
            <TextField label="Who are you calling?" hint="e.g. Aunty Ngozi, my cousin in Onitsha. No phone numbers needed." value={f.who} onChange={(e) => setF({ ...f, who: e.target.value })} error={errs.who} />
            <TextField label="When (your local time)" type="datetime-local" value={f.when} onChange={(e) => setF({ ...f, when: e.target.value })} error={errs.when} />
            <SelectField label="Language" value={f.lang} onChange={(e) => setF({ ...f, lang: e.target.value })} options={talkingPoints.map((t) => t.lang)} />
            <button type="submit" className="btn btn-primary">
              <Bell size={16} aria-hidden /> Set reminder
            </button>
          </form>
          {reminders.length > 0 && (
            <ul className="rows">
              {reminders.map((r, i) => (
                <li key={i}>
                  <span className="row-main">
                    <strong>{r.who}</strong>
                    <span className="small muted">
                      {new Date(r.when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · {r.lang}
                    </span>
                  </span>
                  <span className="row-actions">
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => download(`tell-one-${i + 1}.ics`, ics(r), "text/calendar")}>
                      Add to calendar
                    </button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setReminders(reminders.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Conversations I’ve had">
          <p className="counter-big" aria-live="polite">
            {convos}
          </p>
          <p className="small muted">Log each conversation after the call. Counts only — no names or numbers are stored.</p>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setConvos(convos + 1);
                log("logged a Tell One conversation");
                toast("Conversation logged — thank you");
              }}
            >
              <Plus size={16} aria-hidden /> Log a conversation
            </button>
            <button type="button" className="btn btn-ghost" disabled={convos === 0} onClick={() => setConvos(Math.max(0, convos - 1))} aria-label="Undo last conversation">
              <Minus size={16} aria-hidden /> Undo
            </button>
          </div>
          <Notice tone="info" title="Keep it lawful">
            Talk about the campaign’s message. Never ask anyone for their voter card (PVC) number, polling unit or how they will vote (GR-1).
          </Notice>
        </Panel>
      </Grid>
    </>
  );
}

/* CC-4 — local time and WAT */
function Events() {
  const [tz, setTz] = useState<string | null>(null);
  const [rsvp, setRsvp] = usePersisted<string[]>("tbh-cc-rsvp", []);
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone), []);
  const fmt = (iso: string, timeZone: string) => new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone, timeZoneName: "short" });
  return (
    <Panel title="Chapter events" action={<DemoTag />}>
      <ul className="rows">
        {chapterEvents.map((e) => (
          <li key={e.id}>
            <span className="row-main">
              <strong>{e.title}</strong>
              <span className="small muted">
                {e.where} · {e.rsvps + (rsvp.includes(e.id) ? 1 : 0)} going
              </span>
              <span className="tz-pair small">
                <span>
                  <Clock size={12} aria-hidden /> Your time{tz ? ` (${tz})` : ""}: <strong>{tz ? fmt(e.startUtc, tz) : "…"}</strong>
                </span>
                <span>
                  <Clock size={12} aria-hidden /> West Africa Time (Lagos): <strong>{fmt(e.startUtc, "Africa/Lagos").replace(/GMT\+1$/, "WAT")}</strong>
                </span>
              </span>
            </span>
            <button type="button" className={`btn btn-sm ${rsvp.includes(e.id) ? "btn-outline" : "btn-primary"}`} aria-pressed={rsvp.includes(e.id)} onClick={() => setRsvp(rsvp.includes(e.id) ? rsvp.filter((x) => x !== e.id) : [...rsvp, e.id])}>
              {rsvp.includes(e.id) ? "Going — cancel" : "RSVP"}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* CC-5 */
function Skills({ log }: { log: (w: string) => void }) {
  const [matches, setMatches] = usePersisted<Record<string, string>>("tbh-cc-matches", {});
  const toast = useToast();
  return (
    <>
      <Panel title="Remote tasks matched to skills" action={<DemoTag />}>
        <ul className="rows">
          {remoteTasks.map((t) => {
            const candidates = skillsBank.filter((s) => s.skills.some((k) => k.startsWith(t.skill)));
            return (
              <li key={t.id}>
                <span className="row-main">
                  <strong>{t.title}</strong>
                  <span className="small muted">
                    Needs: {t.skill} · {candidates.length} match{candidates.length === 1 ? "" : "es"}: {candidates.map((c) => c.name).join(", ") || "none yet"}
                  </span>
                </span>
                <span className="row-actions">
                  {matches[t.id] ? (
                    <Badge tone="ok">Assigned to {matches[t.id]}</Badge>
                  ) : candidates.length ? (
                    candidates.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          setMatches({ ...matches, [t.id]: c.name });
                          log(`matched ${c.name} to ${t.id}`);
                          toast(`${c.name} invited to “${t.title}”`);
                        }}
                      >
                        Assign {c.name}
                      </button>
                    ))
                  ) : (
                    <Badge tone="warn">No match</Badge>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="Skills bank">
        <DataTable
          rows={skillsBank}
          rowKey={(r) => r.name}
          caption="Volunteers and their skills"
          searchPlaceholder="Search skills or names"
          columns={[
            { key: "name", header: "Volunteer", sortable: true },
            { key: "skills", header: "Skills", render: (r) => r.skills.join(", "), value: (r) => r.skills.join(" ") },
            { key: "hours", header: "Hours a week", align: "right", sortable: true, value: (r) => r.hours },
          ]}
        />
      </Panel>
    </>
  );
}

/* CC-6 */
function InKind({ log }: { log: (w: string) => void }) {
  type Item = { what: string; value: string; destination: string; status: string; at: string };
  const [items, setItems] = usePersisted<Item[]>("tbh-cc-inkind", [{ what: "2 laptops for ward data volunteers", value: "£600 (estimated)", destination: "Onitsha North, Anambra", status: "Shipped", at: "2026-11-10T10:00:00Z" }]);
  const [f, setF] = useState({ what: "", value: "", destination: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  return (
    <Grid>
      <Panel title="Log in-kind support">
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (f.what.trim().length < 4) x.what = "Describe the item or service.";
            if (!f.value.trim()) x.value = "Give an estimated value.";
            if (!f.destination.trim()) x.destination = "Where in Nigeria will it go?";
            setErrs(x);
            if (Object.keys(x).length) return;
            setBusy(true);
            await simulate();
            setBusy(false);
            setItems([{ ...f, status: "Logged", at: new Date().toISOString() }, ...items]);
            log(`logged in-kind support: ${f.what}`);
            toast("Logged — compliance will confirm before it ships");
            setF({ what: "", value: "", destination: "" });
          }}
        >
          <TextField label="Item or service" value={f.what} onChange={(e) => setF({ ...f, what: e.target.value })} error={errs.what} />
          <TextField label="Estimated value" hint="Recorded for transparency reports." value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} error={errs.value} />
          <TextField label="Destination (LGA, state)" value={f.destination} onChange={(e) => setF({ ...f, destination: e.target.value })} error={errs.destination} />
          <SubmitButton busy={busy}>Log support</SubmitButton>
        </form>
      </Panel>
      <Panel title="In-kind log">
        <ul className="rows">
          {items.map((i, k) => (
            <li key={k}>
              <span className="row-main">
                <strong>{i.what}</strong>
                <span className="small muted">
                  {i.value} · {i.destination} · {fmtDate(i.at)}
                </span>
              </span>
              <Badge tone={i.status === "Shipped" ? "ok" : "info"}>{i.status}</Badge>
            </li>
          ))}
        </ul>
      </Panel>
    </Grid>
  );
}

/* CC-7 — cash offers held for legal; never a payment link */
function FundingOffers({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  type Offer = { id: string; from: string; amount: string; note: string; at: string };
  const [offers, setOffers] = usePersisted<Offer[]>("tbh-cc-offers", []);
  const [f, setF] = useState({ from: "", amount: "", note: "", ack: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const toast = useToast();
  return (
    <>
      <Notice tone="warn" title="Cash offers from abroad are held">
        A diaspora member may offer money. We log it and send it to the legal team. Nothing is collected and no payment link is ever issued here.
      </Notice>
      <Grid>
        <Panel title="Log a cash offer">
          <form
            className="form-grid"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const x: Record<string, string> = {};
              if (f.from.trim().length < 2) x.from = "Who made the offer?";
              if (!f.amount.trim()) x.amount = "Enter the amount offered, with currency.";
              if (!f.ack) x.ack = "Confirm you have not accepted any money.";
              setErrs(x);
              if (Object.keys(x).length) return;
              const id = `FO-${String(Date.now()).slice(-5)}`;
              setOffers([{ id, from: f.from.trim(), amount: f.amount.trim(), note: f.note.trim(), at: new Date().toISOString() }, ...offers]);
              log(`logged cash offer ${id} (${f.amount.trim()}) — routed to legal`);
              toast("Logged and routed to legal");
              setF({ from: "", amount: "", note: "", ack: false });
            }}
          >
            <TextField label="Offered by" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} error={errs.from} />
            <TextField label="Amount and currency" placeholder="e.g. £500" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} error={errs.amount} />
            <TextArea label="Notes (optional)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} rows={2} />
            <CheckField label="I have not accepted any money and have told the person it is on hold." checked={f.ack} onChange={(e) => setF({ ...f, ack: e.target.checked })} error={errs.ack} />
            <button type="submit" className="btn btn-primary">
              <Scale size={16} aria-hidden /> Log and send to legal
            </button>
          </form>
        </Panel>
        <Panel title="Offers on hold">
          {offers.length ? (
            <ul className="rows">
              {offers.map((o) => (
                <li key={o.id}>
                  <span className="row-main">
                    <strong>
                      {o.amount} from {o.from}
                    </strong>
                    <span className="small muted">
                      {o.id} · {fmtDate(o.at, true)}
                      {o.note ? ` · ${o.note}` : ""}
                    </span>
                  </span>
                  <span className="held">
                    <Lock size={14} aria-hidden /> Held — awaiting legal clearance
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No offers logged" text="Offers you log appear here with their legal status." />
          )}
        </Panel>
      </Grid>
      <AuditPanel items={items} />
    </>
  );
}

/* CC-8 — skills or in-kind only */
function Hometown({ log }: { log: (w: string) => void }) {
  const [pledges, setPledges] = usePersisted<Record<string, string>>("tbh-cc-pledges", {});
  const toast = useToast();
  return (
    <Panel title="Hometown projects" action={<DemoTag />}>
      <p className="small muted">Support projects in your home state with skills or donated items. Cash contributions from abroad are not accepted.</p>
      <ul className="funded">
        {hometownProjects.map((p) => (
          <li key={p.id} className="funded-item">
            <div className="funded-head">
              <h3>{p.title}</h3>
              <Badge tone="info">{p.need.includes("in-kind") ? "In-kind" : "Skills"}</Badge>
            </div>
            <p className="small muted">
              {p.lga} · Need: {p.need}
            </p>
            {pledges[p.id] ? (
              <Badge tone="ok">{pledges[p.id]}</Badge>
            ) : (
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    const kind = p.need.includes("in-kind") ? "In-kind pledge logged" : "Skills offer sent";
                    setPledges({ ...pledges, [p.id]: kind });
                    log(`${kind.toLowerCase()} for ${p.title}`);
                    toast(kind);
                  }}
                >
                  {p.need.includes("in-kind") ? "Pledge items" : "Offer my skills"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* CC-9 */
function Ranking() {
  return (
    <Panel title="Chapter ranking" action={<DemoTag />}>
      <p className="small muted">Ranked by Tell One conversations logged this month.</p>
      <ol className="rank-list">
        {chapterRanking.map((c, i) => (
          <li key={c.chapter} className={c.chapter === chapter.country ? "is-me" : undefined}>
            <span className="rank-no">{i + 1}</span>
            <span style={{ flex: 1 }}>
              <Phone size={14} aria-hidden /> {c.chapter}
            </span>
            <span>{c.conversations.toLocaleString("en-GB")}</span>
          </li>
        ))}
      </ol>
      <BarChart label="Conversations by chapter" data={chapterRanking.map((c) => ({ label: c.chapter, value: c.conversations }))} />
    </Panel>
  );
}

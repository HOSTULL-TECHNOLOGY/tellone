"use client";

import Link from "next/link";
import { WardLeaderStatus } from "@/components/careers/WardLeaderStatus";
import "@/styles/careers.css";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { CalendarDays, CheckCircle2, Circle, Download, Gift, HandCoins, MapPin, Phone, Printer, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Badge, Grid, Kpis, Meter, Panel, naira } from "@/components/dashboard/kit";
import { ConfirmDialog, CopyButton, Dialog } from "@/components/ui/Interactive";
import { CheckField, SelectField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";
import { phaseAt, promotionsAllowed } from "@/lib/campaign";
import { readPref } from "@/lib/prefs";
import type { DemoUser } from "@/lib/auth";
import { dailyActions, memberBenefits, memberDemo, memberEvents, memberGroups, pointActions, recommendedProjects, rewardTiers } from "@/data/mock/field";
import { AuditPanel, DemoTag, download, fmtDate, useAudit, usePersisted } from "./field/common";

type Contribution = { ref: string; projectSlug: string; projectTitle: string; state?: string; amount: number; date: string; target?: number; raised?: number; spent?: number; status?: string; proof?: string[]; method?: string; source: "demo" | "this-browser" };

/** Contributions made through the public Fund-a-Project flow in this browser (key "tbh-contributions"), read defensively. */
function readOwnContributions(): Contribution[] {
  try {
    const raw = JSON.parse(readPref("tbh-contributions") ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map((c: Record<string, unknown>, i: number) => ({
        ref: String(c.reference ?? c.ref ?? `TBH-FND-L${i}`),
        projectSlug: String(c.projectSlug ?? c.slug ?? ""),
        projectTitle: String(c.projectTitle ?? c.title ?? c.project ?? "Project"),
        state: c.state ? String(c.state) : undefined,
        amount: Number(c.amount ?? 0),
        date: String(c.date ?? c.at ?? c.createdAt ?? new Date().toISOString()),
        method: c.method ? String(c.method) : undefined,
        status: c.status ? String(c.status) : "Received (simulated)",
        source: "this-browser" as const,
      }))
      .filter((c) => c.amount > 0);
  } catch {
    return [];
  }
}

export default function MemberDashboard({ section }: { section: string }) {
  return <DashboardShell role="member" section={section}>{(user) => <MemberScreens section={section} user={user} />}</DashboardShell>;
}

function MemberScreens({ section, user }: { section: string; user: DemoUser }) {
  const [done, setDone] = usePersisted<string[]>("tbh-m-done", memberDemo.completed);
  const points = memberDemo.points + done.filter((d) => !memberDemo.completed.includes(d)).reduce((s, k) => s + (pointActions.find((a) => a.key === k)?.points ?? 0), 0);
  switch (section) {
    case "points":
      return <Points points={points} done={done} setDone={setDone} />;
    case "referrals":
      return <Referrals user={user} />;
    case "giveaway":
      return <Giveaway />;
    case "benefits":
      return <Benefits user={user} />;
    case "events":
      return <Events user={user} />;
    case "projects":
      return <Projects user={user} />;
    case "tell-one":
      return <TellOne />;
    case "groups":
      return <Groups />;
    case "id-card":
      return <IdCard user={user} />;
    case "apply":
      return (
        <>
          <WardLeaderStatus user={user} applyHref="/careers/ward-leaders/apply" boostHref="/careers/ward-leaders#boost" trainingHref="/training/leader" />
          <Apply user={user} />
        </>
      );
    case "settings":
      return <Settings user={user} />;
    default:
      return <Today user={user} points={points} />;
  }
}

/* MB-1, MB-2 */
function Today({ user, points }: { user: DemoUser; points: number }) {
  const day = Math.floor(Date.now() / 86_400_000);
  const action = dailyActions[day % dailyActions.length];
  const next = rewardTiers.find((t) => t.points > points) ?? rewardTiers[rewardTiers.length - 1];
  return (
    <>
      <section className="today-card bubble">
        <p className="today-kind">Today’s action · {action.kind}</p>
        <h2>{action.title}</h2>
        <p>{action.text}</p>
        <Link href={action.path} className="btn btn-primary">
          {action.cta}
        </Link>
      </section>
      <Kpis
        items={[
          { label: "Impact Points", value: points.toLocaleString("en-NG"), sub: `+${memberDemo.pointsThisWeek} this week`, trend: "up" },
          { label: "Next reward", value: next.reward, sub: `${Math.max(0, next.points - points)} points to go` },
          { label: "Projects I funded", value: memberDemo.contributions.length + readOwnContributions().length },
          { label: "People I brought", value: memberDemo.referrals.filter((r) => r.status === "Verified").length },
        ]}
      />
      <Grid>
        <Panel title="Progress to your next reward" action={<Link href="/dashboard/member/points">How to earn</Link>}>
          <Meter value={points} max={next.points} label={`${points} of ${next.points} points`} />
          <p className="small muted">
            {points.toLocaleString("en-NG")} of {next.points.toLocaleString("en-NG")} points · reward: {next.reward}. Rewards never depend on how anyone votes.
          </p>
        </Panel>
        <Panel title={`Near you in ${user.state}`} action={<Link href="/dashboard/member/events">All events</Link>}>
          <ul className="rows">
            {memberEvents
              .filter((e) => e.state === user.state || e.state === "All")
              .slice(0, 3)
              .map((e) => (
                <li key={e.id}>
                  <span className="row-main">
                    <strong>{e.title}</strong>
                    <span className="small muted">
                      {fmtDate(e.when, true)} · {e.where}
                    </span>
                  </span>
                </li>
              ))}
          </ul>
        </Panel>
      </Grid>
    </>
  );
}

/* MB-2, MB-3, MB-11 */
function Points({ points, done, setDone }: { points: number; done: string[]; setDone: (v: string[]) => void }) {
  const [optIn, setOptIn] = usePersisted("tbh-m-leaderboard", false);
  const toast = useToast();
  const next = rewardTiers.find((t) => t.points > points) ?? rewardTiers[rewardTiers.length - 1];
  return (
    <>
      <Kpis
        items={[
          { label: "Total points", value: points.toLocaleString("en-NG") },
          { label: "This week", value: `+${memberDemo.pointsThisWeek}` },
          { label: "Next threshold", value: next.points.toLocaleString("en-NG"), sub: next.reward },
        ]}
      />
      <Grid>
        <Panel title="Ways to earn points">
          <ul className="rows">
            {pointActions.map((a) => {
              const isDone = done.includes(a.key);
              return (
                <li key={a.key}>
                  <span className="row-main earn-row">
                    {isDone ? <CheckCircle2 size={20} aria-hidden className="ok-ic" /> : <Circle size={20} aria-hidden className="muted" />}
                    <span>
                      <strong>{a.label}</strong>
                      <span className="small muted"> · {a.points} points</span>
                    </span>
                  </span>
                  {isDone ? (
                    <Badge tone="ok">Done</Badge>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setDone([...done, a.key]);
                        toast(`+${a.points} points for “${a.label}” (demo: verified instantly)`);
                      }}
                    >
                      Mark as done
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="small muted">In production points appear within 60 seconds of an action being verified (MB acceptance criteria).</p>
        </Panel>
        <Panel title="Rewards">
          <ul className="rows">
            {rewardTiers.map((t) => (
              <li key={t.points}>
                <span className="row-main">
                  <strong>{t.reward}</strong>
                  <span className="small muted">{t.points.toLocaleString("en-NG")} points</span>
                </span>
                {points >= t.points ? <Badge tone="ok">Unlocked</Badge> : <Badge tone="muted">{(t.points - points).toLocaleString("en-NG")} to go</Badge>}
              </li>
            ))}
          </ul>
          <p className="small muted">Top 10 per state each month are invited to a national event. Shop coupons from points are in the Shop.</p>
        </Panel>
      </Grid>
      <Panel title="Leaderboard (opt-in)">
        <label className="switch">
          <span>
            <strong>Show me on the leaderboard</strong>
            <span className="small muted">Only your first name and state are shown (GR-9). Off by default.</span>
          </span>
          <input type="checkbox" role="switch" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
        </label>
        <p className="small">
          {optIn ? (
            <>
              You are ranked <strong>#38 in your state</strong> and <strong>#1,204 nationally</strong> <DemoTag />
            </>
          ) : (
            "You are hidden from leaderboards. Your points still count."
          )}
        </p>
      </Panel>
    </>
  );
}

/* MB-4 */
function Referrals({ user }: { user: DemoUser }) {
  const link = `https://tbhone.example/join?ref=${user.id.replace("u-", "").toUpperCase()}`;
  const msg = `I joined TBH One — Tell One, Bring One, Help One. It's free. Join with my link: ${link}`;
  return (
    <>
      <Panel title="Your referral link">
        <div className="ref-link">
          <code>{link}</code>
          <CopyButton value={link} label="Copy link" />
        </div>
        <div className="form-actions">
          <a className="btn btn-outline" href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener">
            Share on WhatsApp
          </a>
          <CopyButton value={msg} label="Copy message" />
        </div>
        <p className="small muted">Referral points are paid when the person you bring verifies their account. Referral income is only ever paid for verified work, never for sign-ups alone (GR-7).</p>
      </Panel>
      <Panel title="People you brought" action={<DemoTag />}>
        <DataTable
          rows={memberDemo.referrals}
          rowKey={(r) => r.firstName}
          caption="Members you referred"
          columns={[
            { key: "firstName", header: "First name", sortable: true },
            { key: "state", header: "State", sortable: true },
            { key: "joined", header: "Joined", render: (r) => fmtDate(r.joined), sortable: true },
            { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Verified" ? "ok" : "warn"}>{r.status}</Badge> },
            { key: "points", header: "Points", align: "right", value: (r) => r.points, sortable: true },
          ]}
        />
      </Panel>
    </>
  );
}

/* MB-5 */
function Giveaway() {
  const open = promotionsAllowed(phaseAt());
  const today = new Date().toISOString().slice(0, 10);
  const [entries, setEntries] = usePersisted<string[]>("tbh-m-giveaway", []);
  const entered = entries.includes(today);
  const toast = useToast();
  return (
    <>
      <Panel title="Today’s giveaway" action={<DemoTag />}>
        {open ? (
          <>
            <p className="gv-prize-d">₦5,000 airtime · 20 winners</p>
            <p className="small muted">Funded through a published giveaway project. Entry closes 11:59 pm. Draws are random and recorded; entry never depends on voting, a voter&apos;s card or polling-unit data (GR-2).</p>
            <button
              type="button"
              className="btn btn-primary"
              disabled={entered}
              onClick={() => {
                setEntries([today, ...entries]);
                toast("You're entered in today's draw");
              }}
            >
              <Gift size={18} aria-hidden /> {entered ? "Entered today" : "Enter today’s giveaway"}
            </button>
          </>
        ) : (
          <Notice tone="info" title="Giveaways have ended">
            All giveaways stopped at the campaign cut-off, 11:59 pm on Thursday 14 January 2027 (GR-3).
          </Notice>
        )}
      </Panel>
      <Panel title="My entries and results">
        <ul className="rows">
          {entries.map((d) => (
            <li key={d}>
              <span className="row-main">
                <strong>{fmtDate(d)}</strong>
                <span className="small muted">Draw after 11:59 pm</span>
              </span>
              <Badge tone="info">Entered</Badge>
            </li>
          ))}
          {memberDemo.giveawayHistory.map((g) => (
            <li key={g.date}>
              <span className="row-main">
                <strong>{fmtDate(g.date)}</strong>
                <span className="small muted">{g.prize}</span>
              </span>
              <Badge tone="muted">{g.result}</Badge>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* MB-6 */
function Benefits({ user }: { user: DemoUser }) {
  const [kind, setKind] = useState("All");
  const [state, setState] = useState(user.state);
  const kinds = ["All", ...Array.from(new Set(memberBenefits.map((b) => b.kind)))];
  const list = memberBenefits.filter((b) => (kind === "All" || b.kind === kind) && (b.states.includes("All") || b.states.includes(state)));
  return (
    <Panel title="Benefits near you" action={<DemoTag />}>
      <div className="filters">
        <SelectField label="Type" value={kind} onChange={(e) => setKind(e.target.value)} options={kinds} />
        <SelectField label="Location" value={state} onChange={(e) => setState(e.target.value)} options={[user.state, "Lagos", "Kano", "FCT", "Kaduna", "Enugu"].filter((v, i, a) => a.indexOf(v) === i)} />
      </div>
      {list.length ? (
        <div className="benefit-grid">
          {list.map((b) => (
            <article key={b.title} className="card">
              <Badge tone="info">{b.kind}</Badge>
              <h3>{b.title}</h3>
              <p className="small muted">
                <MapPin size={14} aria-hidden /> {b.where} · {b.when}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing here yet" text="Try another type or location." />
      )}
      <p className="small muted">Benefits are participation rewards. They are never conditioned on how anyone votes.</p>
    </Panel>
  );
}

/* MB-7 */
function Events({ user }: { user: DemoUser }) {
  const [rsvps, setRsvps] = usePersisted<string[]>("tbh-m-rsvp", []);
  const toast = useToast();
  return (
    <Panel title="Events and village meetings" action={<DemoTag />}>
      <ul className="rows">
        {memberEvents.map((e) => {
          const going = rsvps.includes(e.id);
          const near = e.state === user.state || e.state === "All";
          return (
            <li key={e.id}>
              <span className="row-main">
                <strong>{e.title}</strong>
                <span className="small muted">
                  <CalendarDays size={14} aria-hidden /> {fmtDate(e.when, true)} WAT · {e.where} · {e.organiser}
                </span>
                {near && <Badge tone="ok">Near you</Badge>}
              </span>
              <span className="row-actions">
                <button
                  type="button"
                  className={`btn btn-sm ${going ? "btn-outline" : "btn-primary"}`}
                  aria-pressed={going}
                  onClick={() => {
                    setRsvps(going ? rsvps.filter((x) => x !== e.id) : [...rsvps, e.id]);
                    toast(going ? "RSVP cancelled" : "You're going — we'll remind you the day before");
                  }}
                >
                  {going ? "Going · Cancel" : "RSVP"}
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* MB-8, MB-9 */
function Projects({ user }: { user: DemoUser }) {
  const [own, setOwn] = useState<Contribution[]>([]);
  useEffect(() => setOwn(readOwnContributions()), []);
  const all: Contribution[] = [...own, ...memberDemo.contributions.map((c) => ({ ...c, source: "demo" as const }))];
  const [receipt, setReceipt] = useState<Contribution | null>(null);
  return (
    <>
      <Kpis
        items={[
          { label: "Projects funded", value: all.length },
          { label: "Total given", value: naira(all.reduce((s, c) => s + c.amount, 0)) },
          { label: "Delivered", value: all.filter((c) => c.status === "Delivered").length },
        ]}
      />
      <Panel title="My funded projects">
        {all.length === 0 ? (
          <EmptyState title="No funded projects yet" text="Choose a published project near you." action={<Link href="/projects" className="btn btn-primary">Fund a project</Link>} />
        ) : (
          <ul className="funded">
            {all.map((c) => (
              <li key={c.ref} className="funded-item">
                <div className="funded-head">
                  <h3>{c.projectTitle}</h3>
                  {c.source === "this-browser" ? <Badge tone="info">Made in this browser</Badge> : <DemoTag />}
                </div>
                <p className="small muted">
                  {c.state ? `${c.state} · ` : ""}You gave {naira(c.amount)} on {fmtDate(c.date)} · Ref {c.ref}
                </p>
                {c.target ? (
                  <>
                    <Meter value={c.raised ?? 0} max={c.target} label={`${c.projectTitle} funding`} />
                    <dl className="funded-figs">
                      <div>
                        <dt>Raised</dt>
                        <dd>{naira(c.raised ?? 0)}</dd>
                      </div>
                      <div>
                        <dt>Target</dt>
                        <dd>{naira(c.target)}</dd>
                      </div>
                      <div>
                        <dt>Spent</dt>
                        <dd>{naira(c.spent ?? 0)}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{c.status}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className="small">Status: {c.status}</p>
                )}
                {c.proof?.length ? (
                  <details className="proof-list">
                    <summary>Proof of delivery ({c.proof.length})</summary>
                    <ul>
                      {c.proof.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <p className="small muted">Proof appears here once the project is marked delivered.</p>
                )}
                <div className="form-actions">
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => setReceipt(c)}>
                    <Download size={16} aria-hidden /> Receipt
                  </button>
                  {c.projectSlug && (
                    <Link href={`/projects/${c.projectSlug}`} className="btn btn-sm btn-ghost">
                      View project
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title={`Recommended for you in ${user.state}`} action={<DemoTag />}>
        <ul className="rows">
          {[...recommendedProjects].sort((a) => (a.state === user.state ? -1 : 1)).map((p) => (
            <li key={p.slug}>
              <span className="row-main">
                <strong>{p.title}</strong>
                <span className="small muted">
                  {p.state} · {p.category} · {naira(p.raised)} of {naira(p.target)}
                </span>
              </span>
              <Link href={`/projects/${p.slug}#fund`} className="btn btn-sm btn-primary">
                <HandCoins size={16} aria-hidden /> Fund
              </Link>
            </li>
          ))}
        </ul>
        <p className="small muted">Pay by card, bank transfer or USSD. Every contribution is recorded against your name (GR-4).</p>
      </Panel>
      <Receipt c={receipt} user={user} onClose={() => setReceipt(null)} />
    </>
  );
}

function Receipt({ c, user, onClose }: { c: Contribution | null; user: DemoUser; onClose: () => void }) {
  if (!c) return null;
  const text = `TBH One — contribution receipt (PROTOTYPE)\nReference: ${c.ref}\nContributor: ${user.firstName} ${user.lastName}\nProject: ${c.projectTitle}\nAmount: ${naira(c.amount)}\nDate: ${fmtDate(c.date)}\nStatus: ${c.status ?? ""}\n\nThis is a demo receipt. No money was received.`;
  return (
    <Dialog
      open
      onClose={onClose}
      title="Contribution receipt"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => download(`receipt-${c.ref}.txt`, text)}>
            <Download size={16} aria-hidden /> Download
          </button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} aria-hidden /> Print
          </button>
        </>
      }
    >
      <div className="receipt" id="print-area">
        <p className="receipt-brand">TBH One · Contribution receipt</p>
        <dl>
          <dt>Reference</dt>
          <dd>{c.ref}</dd>
          <dt>Contributor</dt>
          <dd>
            {user.firstName} {user.lastName}
          </dd>
          <dt>Project</dt>
          <dd>{c.projectTitle}</dd>
          <dt>Amount</dt>
          <dd>{naira(c.amount)}</dd>
          <dt>Date</dt>
          <dd>{fmtDate(c.date)}</dd>
        </dl>
        <Notice tone="warn" title="Prototype">
          Demo receipt — no money was received. Real receipts are sent by SMS or email within 5 minutes of payment.
        </Notice>
      </div>
    </Dialog>
  );
}

/* MB-10 */
function TellOne() {
  type Log = { id: string; date: string; relative: string; count: number; channel: string };
  const [logs, setLogs] = usePersisted<Log[]>("tbh-m-tellone", [{ id: "l1", date: "2026-11-15", relative: "Parent", count: 1, channel: "Phone call" }]);
  const [relative, setRelative] = useState("Sibling");
  const [channel, setChannel] = useState("Phone call");
  const [count, setCount] = useState("1");
  const [err, setErr] = useState("");
  const toast = useToast();
  const total = logs.reduce((s, l) => s + l.count, 0);
  return (
    <Grid>
      <Panel title="Log a Tell One conversation">
        <Notice tone="info" title="What we record">
          Only the count and who you spoke to (for example “Mother”). We never record names, phone numbers or how anyone intends to vote (GR-1).
        </Notice>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(count);
            if (!Number.isInteger(n) || n < 1 || n > 50) return setErr("Enter a number from 1 to 50.");
            setErr("");
            setLogs([{ id: `l${Date.now()}`, date: new Date().toISOString(), relative, count: n, channel }, ...logs]);
            toast("Conversation logged");
          }}
        >
          <SelectField label="Who did you talk to?" value={relative} onChange={(e) => setRelative(e.target.value)} options={["Parent", "Sibling", "Spouse", "Child", "Uncle or aunt", "Cousin", "Grandparent", "Other relative"]} />
          <SelectField label="How?" value={channel} onChange={(e) => setChannel(e.target.value)} options={["Phone call", "WhatsApp call", "Chat", "In person (visit home)"]} />
          <TextField label="Number of conversations" type="number" inputMode="numeric" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} error={err} />
          <button type="submit" className="btn btn-primary">
            <Phone size={16} aria-hidden /> Log it
          </button>
        </form>
      </Panel>
      <Panel title={`Your Tell One log · ${total} conversations`}>
        {logs.length ? (
          <ul className="rows">
            {logs.map((l) => (
              <li key={l.id}>
                <span className="row-main">
                  <strong>
                    {l.count} × {l.relative}
                  </strong>
                  <span className="small muted">
                    {l.channel} · {fmtDate(l.date)}
                  </span>
                </span>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setLogs(logs.filter((x) => x.id !== l.id))}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No conversations logged yet" />
        )}
      </Panel>
    </Grid>
  );
}

/* MB-12 */
function Groups() {
  const [joined, setJoined] = usePersisted<string[]>("tbh-m-groups", ["g1"]);
  return (
    <Panel title="Volunteer and support sub-groups" action={<DemoTag />}>
      <ul className="rows">
        {memberGroups.map((g) => {
          const isIn = joined.includes(g.id);
          return (
            <li key={g.id}>
              <span className="row-main">
                <strong>{g.name}</strong>
                <span className="small muted">
                  <Users size={14} aria-hidden /> {g.kind} · {g.members + (isIn ? 1 : 0)} members · WhatsApp link published after verification
                </span>
              </span>
              <button type="button" className={`btn btn-sm ${isIn ? "btn-outline" : "btn-primary"}`} onClick={() => setJoined(isIn ? joined.filter((x) => x !== g.id) : [...joined, g.id])}>
                {isIn ? "Leave" : "Join"}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="small muted">Joining a sub-group earns 20 Impact Points.</p>
    </Panel>
  );
}

/* MB-13 */
function IdCard({ user }: { user: DemoUser }) {
  const [svg, setSvg] = useState("");
  const code = `${memberDemo.memberNo}-${user.id.slice(-3).toUpperCase()}`;
  const payload = `TBHONE|MEMBER|${code}|${user.firstName}|${user.state}`;
  useEffect(() => {
    QRCode.toString(payload, { type: "svg", margin: 0, color: { dark: "#0f4d02", light: "#ffffff" } }).then(setSvg).catch(() => setSvg(""));
  }, [payload]);
  const cardSvg = useMemo(() => {
    const qr = svg.replace(/<svg[^>]*viewBox="([^"]+)"[^>]*>/, '<svg x="430" y="70" width="140" height="140" viewBox="$1">');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="404" viewBox="0 0 640 404"><rect width="640" height="404" rx="28" fill="#157103"/><rect y="390" width="320" height="14" fill="#fd0102"/><rect x="320" y="390" width="320" height="14" fill="#fff"/><text x="40" y="70" font-family="Arial" font-size="30" font-weight="700" fill="#fff">TBH One · Member</text><text x="40" y="170" font-family="Georgia" font-size="40" font-weight="700" fill="#fff">${user.firstName} ${user.lastName}</text><text x="40" y="215" font-family="Arial" font-size="22" fill="#e6efe0">${user.state} · ${user.lga}</text><text x="40" y="300" font-family="Arial" font-size="22" fill="#fff">ID ${code}</text><text x="40" y="335" font-family="Arial" font-size="18" fill="#e6efe0">Verify at /verify · PROTOTYPE</text><rect x="420" y="60" width="160" height="160" rx="12" fill="#fff"/>${qr}</svg>`;
  }, [svg, user, code]);
  return (
    <Grid>
      <Panel title="Your member ID">
        <div className="idcard">
          <div>
            <img className="idlogo" src="/brand/tbh-one-logo-180.webp" width={64} height={41} alt="TBH One" />
            <p className="idname">
              {user.firstName} {user.lastName}
            </p>
            <p className="idmeta">
              {user.state} · {user.lga}
              <br />
              ID {code}
            </p>
          </div>
          <div className="idqr" aria-label={`QR code for member ID ${code}`} role="img" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-primary" onClick={() => download(`tbh-one-member-id-${code}.svg`, cardSvg, "image/svg+xml")} disabled={!svg}>
            <Download size={16} aria-hidden /> Download card
          </button>
          <button type="button" className="btn btn-outline" onClick={() => window.print()}>
            <Printer size={16} aria-hidden /> Print
          </button>
        </div>
      </Panel>
      <Panel title="How the card is used">
        <ul className="plain-list">
          <li>Show it at events and village meetings to check in.</li>
          <li>Anyone can check it on the Verify Official Channels page using the code.</li>
          <li>It never contains your phone number, voter&apos;s card details or anything about how you vote.</li>
        </ul>
        <Notice tone="warn" title="Prototype">
          The QR code holds a demo ID. Production cards carry a signed verification code (SH-12).
        </Notice>
      </Panel>
    </Grid>
  );
}

/* MB-14 */
function Apply({ user }: { user: DemoUser }) {
  type App = { role: string; at: string; status: string };
  const [apps, setApps] = usePersisted<App[]>("tbh-m-apps", []);
  const [role, setRole] = useState("");
  const [why, setWhy] = useState("");
  const [agree, setAgree] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  return (
    <Grid>
      <Panel title="Apply for a role">
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (!role) x.role = "Choose a role.";
            if (why.trim().length < 30) x.why = "Tell us a little more (at least 30 characters).";
            if (!agree) x.agree = "You need to accept the code of conduct and vetting.";
            setErrs(x);
            if (Object.keys(x).length) return;
            setBusy(true);
            await simulate();
            setBusy(false);
            setApps([{ role, at: new Date().toISOString(), status: "Submitted — vetting" }, ...apps]);
            setRole("");
            setWhy("");
            setAgree(false);
            toast("Application submitted");
          }}
        >
          <SelectField label="Role" required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Choose…" options={["Street leader", "Ward leader", "Creator", "Translator", "Associate (project-based)"]} error={errs.role} />
          <TextField label="Where" value={`${user.street ?? ""}${user.street ? ", " : ""}${user.ward ?? ""}${user.ward ? ", " : ""}${user.lga}, ${user.state}`} readOnly />
          <TextArea label="Why you, and what you'll do" required value={why} onChange={(e) => setWhy(e.target.value)} error={errs.why} />
          <CheckField label="I accept the code of conduct, ID checks and vetting before the role is added." checked={agree} onChange={(e) => setAgree(e.target.checked)} error={errs.agree} />
          <SubmitButton busy={busy}>Submit application</SubmitButton>
        </form>
      </Panel>
      <Panel title="My applications">
        {apps.length ? (
          <ul className="rows">
            {apps.map((a, i) => (
              <li key={i}>
                <span className="row-main">
                  <strong>{a.role}</strong>
                  <span className="small muted">{fmtDate(a.at)}</span>
                </span>
                <Badge tone="warn">{a.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No applications yet" text="Roles are added to your account after vetting, and you switch between them from the menu." />
        )}
      </Panel>
    </Grid>
  );
}

/* SH-5, SH-9, SH-13 */
function Settings({ user }: { user: DemoUser }) {
  const [prefs, setPrefs] = usePersisted("tbh-m-settings", { language: "English", consentSms: true, consentWhatsApp: false, consentAiCalls: false, consentPhotos: false, notifyInApp: true, notifySms: false, notifyWhatsApp: false, dailyCap: "3" });
  const [confirm, setConfirm] = useState(false);
  const [deleteReq, setDeleteReq] = usePersisted<string | null>("tbh-m-delete", null);
  const toast = useToast();
  const audit = useAudit("member-settings", `${user.firstName} ${user.lastName}`);
  const upd = (k: keyof typeof prefs, v: string | boolean) => {
    setPrefs({ ...prefs, [k]: v });
    audit.log(`changed ${String(k)} to ${String(v)}`);
  };
  return (
    <>
      <Grid>
        <Panel title="Profile">
          <dl className="kv">
            <dt>Name</dt>
            <dd>
              {user.firstName} {user.lastName}
            </dd>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Location</dt>
            <dd>
              {user.lga}, {user.state}
            </dd>
          </dl>
          <SelectField label="Interface language" value={prefs.language} onChange={(e) => upd("language", e.target.value)} options={["English", "Pidgin", "Yorùbá", "Hausa", "Igbo"]} hint="Changeable any time (SH-5)." />
        </Panel>
        <Panel title="Consent (per purpose)">
          {(
            [
              ["consentSms", "Campaign updates by SMS"],
              ["consentWhatsApp", "Campaign updates on WhatsApp"],
              ["consentAiCalls", "Calls from the AI Call Agent"],
              ["consentPhotos", "Photos of me in TBH One media"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="switch">
              <span>
                <strong>{label}</strong>
              </span>
              <input type="checkbox" role="switch" checked={prefs[k] as boolean} onChange={(e) => upd(k, e.target.checked)} />
            </label>
          ))}
          <p className="small muted">Each consent is stored with a time stamp; opting out takes effect within 24 hours (NF-7).</p>
        </Panel>
      </Grid>
      <Grid>
        <Panel title="Notifications">
          {(
            [
              ["notifyInApp", "In-app"],
              ["notifySms", "SMS"],
              ["notifyWhatsApp", "WhatsApp"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="switch">
              <span>
                <strong>{label}</strong>
              </span>
              <input type="checkbox" role="switch" checked={prefs[k] as boolean} onChange={(e) => upd(k, e.target.checked)} />
            </label>
          ))}
          <SelectField label="Daily limit" value={prefs.dailyCap} onChange={(e) => upd("dailyCap", e.target.value)} options={["1", "3", "5"]} hint="Maximum messages per day across channels (SH-9)." />
        </Panel>
        <Panel title="Your data">
          <p className="small">Download everything we hold about you, or ask us to delete your account. Requests are handled by the Data Protection Officer within 30 days (NDPA 2023).</p>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                download(`tbh-one-my-data-${user.id}.json`, JSON.stringify({ profile: { ...user }, settings: prefs, exportedAt: new Date().toISOString(), note: "Prototype export of demo data" }, null, 2), "application/json");
                audit.log("exported their data");
                toast("Your data file has downloaded");
              }}
            >
              <Download size={16} aria-hidden /> Export my data
            </button>
            <button type="button" className="btn btn-danger" disabled={!!deleteReq} onClick={() => setConfirm(true)}>
              {deleteReq ? "Deletion requested" : "Delete my account"}
            </button>
          </div>
          {deleteReq && (
            <Notice tone="info" title="Request sent to the DPO">
              Your deletion request ({deleteReq}) is due within 30 days. You can keep using your account until then.
            </Notice>
          )}
        </Panel>
      </Grid>
      <AuditPanel items={audit.items} title="Changes to your settings" />
      <ConfirmDialog
        open={confirm}
        onCancel={() => setConfirm(false)}
        danger
        title="Delete your account?"
        confirmLabel="Send deletion request"
        text={<p>Your profile, points and history will be deleted. Contribution records are kept where the law requires (Electoral Act 2026 disclosure). This can’t be undone once processed.</p>}
        onConfirm={() => {
          const ref = `DSR-${String(Date.now()).slice(-6)}`;
          setDeleteReq(ref);
          setConfirm(false);
          audit.log(`requested account deletion (${ref})`);
          toast("Request sent to the DPO — due in 30 days");
        }}
      />
    </>
  );
}


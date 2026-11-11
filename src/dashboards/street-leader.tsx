"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, CloudOff, GraduationCap, ListChecks, LogIn, LogOut, MapPin, Package, RefreshCw, Send, ShieldAlert, UserPlus, Wallet, Wifi } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Badge, Kpis, Meter, Panel, naira } from "@/components/dashboard/kit";
import { CheckField, SelectField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { CopyButton, Dialog } from "@/components/ui/Interactive";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { materials, rateCard, rateFor, streetBlocks, streetEarnings, streetMembers, streetTasks, trainingModules, wardMessages, wardRanking, type FieldTask } from "@/data/mock/field";
import { DemoTag, fmtDate, usePersisted } from "./field/common";

type Queued = { id: string; taskId: string; type: string; count: number; photoName: string; photoHash: string; duplicate: boolean; gps: string; takenAt: string; status: "Queued offline" | "Syncing" | "Synced" };

export default function StreetLeaderDashboard({ section }: { section: string }) {
  return <DashboardShell role="street-leader" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

/** Shared offline state: navigator.onLine AND the visible "Simulate offline" switch (SH-8, SL-2). */
function useConnectivity() {
  const [simOffline, setSimOffline] = usePersisted("tbh-sl-sim-offline", false);
  const [browserOnline, setBrowserOnline] = useState(true);
  useEffect(() => {
    const on = () => setBrowserOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  return { online: browserOnline && !simOffline, simOffline, setSimOffline };
}

/** Offline queue: tasks persist locally and auto-sync within moments of reconnecting. */
function useQueue(online: boolean) {
  const [queue, setQueue] = usePersisted<Queued[]>("tbh-sl-queue", []);
  const pending = queue.some((q) => q.status === "Queued offline" || q.status === "Syncing");
  useEffect(() => {
    if (!online || !pending) return;
    setQueue((p) => p.map((q) => (q.status === "Queued offline" ? { ...q, status: "Syncing" } : q)));
    const t = window.setTimeout(() => setQueue((p) => p.map((q) => (q.status === "Syncing" ? { ...q, status: "Synced" } : q))), 1600);
    return () => window.clearTimeout(t);
  }, [online, pending, setQueue]);
  return { queue, setQueue };
}

function OfflineBar({ online, simOffline, setSimOffline, pending }: { online: boolean; simOffline: boolean; setSimOffline: (v: boolean) => void; pending: number }) {
  return (
    <div className={`net-bar ${online ? "is-online" : "is-offline"}`} role="status">
      {online ? <Wifi size={18} aria-hidden /> : <CloudOff size={18} aria-hidden />}
      <span>{online ? (pending ? `Online · syncing ${pending} task(s)` : "Online") : `Offline · ${pending} task(s) saved on this phone`}</span>
      <label className="switch net-switch">
        <span className="small">Simulate offline</span>
        <input type="checkbox" role="switch" checked={simOffline} onChange={(e) => setSimOffline(e.target.checked)} />
      </label>
    </div>
  );
}

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const net = useConnectivity();
  const { queue, setQueue } = useQueue(net.online);
  const [trained, setTrained] = usePersisted<string[]>("tbh-sl-training", []);
  const pending = queue.filter((q) => q.status !== "Synced").length;
  const bar = <OfflineBar online={net.online} simOffline={net.simOffline} setSimOffline={net.setSimOffline} pending={pending} />;
  let body;
  switch (section) {
    case "log":
      body = <LogTask online={net.online} queue={queue} setQueue={setQueue} trained={trained} />;
      break;
    case "earnings":
      body = <Earnings />;
      break;
    case "street":
      body = <MyStreet user={user} />;
      break;
    case "materials":
      body = <Materials />;
      break;
    case "recruit":
      body = <Recruit user={user} />;
      break;
    case "safety":
      body = <Safety />;
      break;
    case "training":
      body = <Training trained={trained} setTrained={setTrained} />;
      break;
    case "messages":
      body = <Messages />;
      break;
    case "rank":
      body = <Rank user={user} />;
      break;
    default:
      body = <Today queue={queue} trained={trained} />;
  }
  return (
    <div className="field-ui">
      {bar}
      {body}
    </div>
  );
}

/* SL-1 */
function Today({ queue, trained }: { queue: Queued[]; trained: string[] }) {
  const done = new Set(queue.map((q) => q.taskId));
  return (
    <>
      {!trained.includes("safety") && (
        <Notice tone="warn" title="Finish safety training first">
          You need the 8-minute safety module before your first task. <Link href="/dashboard/street-leader/training">Start training</Link>
        </Notice>
      )}
      <div className="big-actions">
        <Link href="/dashboard/street-leader/log" className="big-btn">
          <Camera size={32} aria-hidden />
          Log a task
        </Link>
        <Link href="/dashboard/street-leader/safety" className="big-btn">
          <ShieldAlert size={32} aria-hidden />
          Safety
        </Link>
        <Link href="/dashboard/street-leader/earnings" className="big-btn">
          <Wallet size={32} aria-hidden />
          My money
        </Link>
        <Link href="/dashboard/street-leader/materials" className="big-btn">
          <Package size={32} aria-hidden />
          Materials
        </Link>
      </div>
      <Panel title="Today’s tasks" action={<DemoTag />}>
        <ul className="task-list">
          {streetTasks.map((t) => (
            <li key={t.id} className="task-item">
              <span className="task-main">
                <strong>
                  {t.type} · {t.quantity}
                  {t.type === "Door-to-door" ? " shift" : ""}
                </strong>
                <span className="small muted">
                  {t.area} · due {fmtDate(t.deadline)}
                </span>
                <span className="small muted">Pays {naira(rateFor(t.type, t.quantity))}</span>
              </span>
              {done.has(t.id) ? <Badge tone="ok">Logged</Badge> : <Link href={`/dashboard/street-leader/log?task=${t.id}`} className="btn btn-primary">Log</Link>}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

async function sha256(file: File) {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* SL-2 */
function LogTask({ online, queue, setQueue, trained }: { online: boolean; queue: Queued[]; setQueue: (v: Queued[] | ((p: Queued[]) => Queued[])) => void; trained: string[] }) {
  const [taskId, setTaskId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [hash, setHash] = useState("");
  const [count, setCount] = useState("");
  const [gpsConsent, setGpsConsent] = useState(false);
  const [gps, setGps] = useState("");
  const [gpsNote, setGpsNote] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const [seenHashes, setSeenHashes] = usePersisted<string[]>("tbh-sl-hashes", []);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("task");
    if (t && streetTasks.some((x) => x.id === t)) setTaskId(t);
  }, []);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const task = streetTasks.find((t) => t.id === taskId);
  const duplicate = !!hash && seenHashes.includes(hash);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return setGpsNote("This phone can't share location. The task will be checked by your ward leader.");
    setGpsNote("Getting location…");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setGps(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)} (±${Math.round(p.coords.accuracy)} m)`);
        setGpsNote("");
      },
      () => {
        setGps("");
        setGpsNote("Location not available. The task will be flagged for your ward leader to check.");
      },
      { timeout: 8000, maximumAge: 60000 },
    );
  }, []);

  if (!trained.includes("safety"))
    return (
      <Panel title="Training needed">
        <EmptyState icon={<GraduationCap size={32} />} title="Finish safety training to log tasks" text="The safety module takes about 8 minutes and is required before your first task (SL-8)." action={<Link href="/dashboard/street-leader/training" className="btn btn-primary">Start training</Link>} />
      </Panel>
    );

  return (
    <>
      <Panel title="Log a task">
        <form
          className="form-grid log-form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            const n = Number(count);
            if (!task) x.task = "Pick a task.";
            if (!file) x.photo = "Take one clear photo as proof.";
            if (!Number.isInteger(n) || n < 1) x.count = "Enter how many you did.";
            else if (task && n > task.quantity * 1.5) x.count = `That's much more than the ${task.quantity} assigned. Check the count.`;
            setErrs(x);
            if (Object.keys(x).length || !task || !file) return;
            setBusy(true);
            await simulate(400);
            const item: Queued = {
              id: `Q-${Date.now()}`,
              taskId: task.id,
              type: task.type,
              count: n,
              photoName: file.name,
              photoHash: hash,
              duplicate,
              gps: gps || "Not captured",
              takenAt: new Date(file.lastModified || Date.now()).toISOString(),
              status: online ? "Syncing" : "Queued offline",
            };
            setQueue((p) => [item, ...p]);
            if (hash && !duplicate) setSeenHashes([...seenHashes, hash]);
            if (online) window.setTimeout(() => setQueue((p) => p.map((q) => (q.id === item.id ? { ...q, status: "Synced" } : q))), 1200);
            setBusy(false);
            toast(online ? "Sent to your ward leader" : "Saved on this phone. It will send when you have signal.");
            setFile(null);
            setPreview("");
            setHash("");
            setCount("");
          }}
        >
          <fieldset className="plain">
            <legend>1. Which task?</legend>
            <div className="choice-col">
              {streetTasks.map((t: FieldTask) => (
                <label key={t.id} className="choice choice-big">
                  <input type="radio" name="task" value={t.id} checked={taskId === t.id} onChange={() => setTaskId(t.id)} />
                  <span>
                    <ListChecks size={20} aria-hidden /> {t.type} · {t.quantity}
                  </span>
                </label>
              ))}
            </div>
            {errs.task && <p className="field-error">{errs.task}</p>}
          </fieldset>

          <fieldset className="plain">
            <legend>2. Take a photo</legend>
            <label className="photo-btn">
              <Camera size={28} aria-hidden />
              <span>{file ? "Retake photo" : "Take photo"}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                  try {
                    setHash(await sha256(f));
                  } catch {
                    setHash("");
                  }
                }}
              />
            </label>
            {preview && <img src={preview} alt="Your proof photo" className="photo-preview" />}
            {duplicate && (
              <Notice tone="danger" title="This photo was used before">
                Duplicate photos are flagged automatically. Your ward leader will review it — take a new photo if you can.
              </Notice>
            )}
            {errs.photo && <p className="field-error">{errs.photo}</p>}
          </fieldset>

          <TextField label="3. How many?" type="number" inputMode="numeric" min={1} value={count} onChange={(e) => setCount(e.target.value)} error={errs.count} hint={task ? `Assigned: ${task.quantity}` : undefined} />

          <fieldset className="plain">
            <legend>4. Location (optional)</legend>
            <CheckField
              label="Add my location and time to this photo"
              checked={gpsConsent}
              onChange={(e) => {
                setGpsConsent(e.target.checked);
                if (e.target.checked) locate();
                else {
                  setGps("");
                  setGpsNote("");
                }
              }}
            />
            {gps && (
              <p className="small">
                <MapPin size={14} aria-hidden /> {gps} · {fmtDate(new Date().toISOString(), true)}
              </p>
            )}
            {gpsNote && <p className="small muted">{gpsNote}</p>}
          </fieldset>

          <SubmitButton busy={busy} className="btn btn-primary btn-lg btn-block">
            <Send size={18} aria-hidden /> {online ? "Send" : "Save offline"}
          </SubmitButton>
        </form>
      </Panel>
      <Panel title="Sent and waiting">
        {queue.length ? (
          <ul className="task-list">
            {queue.map((q) => (
              <li key={q.id} className="task-item">
                <span className="task-main">
                  <strong>
                    {q.type} · {q.count}
                  </strong>
                  <span className="small muted">
                    {fmtDate(q.takenAt, true)} · {q.gps}
                  </span>
                  {q.duplicate && <Badge tone="danger">Duplicate photo flagged</Badge>}
                </span>
                <Badge tone={q.status === "Synced" ? "ok" : q.status === "Syncing" ? "info" : "warn"}>
                  {q.status === "Syncing" && <RefreshCw size={12} aria-hidden className="spin" />} {q.status === "Synced" ? "Synced" : q.status}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nothing logged yet" />
        )}
      </Panel>
    </>
  );
}

/* SL-3 */
function Earnings() {
  const [payout, setPayout] = usePersisted<{ method: string; bank: string; account: string; name: string } | null>("tbh-sl-payout", null);
  const [form, setForm] = useState({ method: "Bank account", bank: "", account: "", name: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const sum = (s: string) => streetEarnings.filter((e) => e.status === s).reduce((a, e) => a + e.amount, 0);
  return (
    <>
      <Kpis
        items={[
          { label: "Pending", value: naira(sum("Pending")), tone: "warn" },
          { label: "Approved", value: naira(sum("Approved")) },
          { label: "Paid", value: naira(sum("Paid")) },
        ]}
      />
      <Panel title="Payments" action={<DemoTag />}>
        <ul className="task-list">
          {streetEarnings.map((e) => (
            <li key={e.id} className="task-item">
              <span className="task-main">
                <strong>{naira(e.amount)}</strong>
                <span className="small muted">
                  {e.task} · {fmtDate(e.date)}
                </span>
              </span>
              <Badge tone={e.status === "Paid" ? "ok" : e.status === "Approved" ? "info" : "warn"}>{e.status}</Badge>
            </li>
          ))}
        </ul>
        <p className="small muted">Payments are released only against approved proof, usually within 24 hours of your ward leader’s approval. Next payout: Friday.</p>
      </Panel>
      <Panel title="Rate card">
        <ul className="rows">
          {rateCard.map((r) => (
            <li key={r.type}>
              <span className="row-main">
                <strong>{r.type}</strong>
                <span className="small muted">{r.unit}</span>
              </span>
              <strong>{naira(r.rate)}</strong>
            </li>
          ))}
        </ul>
        <p className="small muted">Launch rate card, reviewed every two weeks.</p>
      </Panel>
      <Panel title="Where we pay you">
        {payout ? (
          <>
            <p>
              <strong>{payout.method}</strong> · {payout.bank} · ****{payout.account.slice(-4)} · {payout.name}
            </p>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setPayout(null)}>
              Change
            </button>
          </>
        ) : (
          <form
            className="form-grid"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const x: Record<string, string> = {};
              if (!form.bank.trim()) x.bank = form.method === "Bank account" ? "Enter your bank." : "Enter your mobile money provider.";
              if (!/^\d{10}$/.test(form.account)) x.account = form.method === "Bank account" ? "Account numbers have 10 digits (NUBAN)." : "Wallet numbers have 10 digits after the 0.";
              if (form.name.trim().length < 3) x.name = "Enter the name on the account.";
              setErrs(x);
              if (Object.keys(x).length) return;
              setBusy(true);
              await simulate();
              setBusy(false);
              setPayout(form);
              toast("Payout details saved");
            }}
          >
            <SelectField label="Pay me by" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} options={["Bank account", "Mobile money"]} />
            <TextField label={form.method === "Bank account" ? "Bank" : "Provider"} value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} error={errs.bank} />
            <TextField label="Account number" inputMode="numeric" maxLength={10} value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value.replace(/\D/g, "") })} error={errs.account} />
            <TextField label="Name on account" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errs.name} hint="Must match your verified name. Repeat accounts are flagged for review (FN-7)." />
            <SubmitButton busy={busy}>Save</SubmitButton>
          </form>
        )}
      </Panel>
    </>
  );
}

/* SL-4 — first names and status only; never phone numbers */
function MyStreet({ user }: { user: DemoUser }) {
  const houses = streetBlocks.reduce((s, b) => s + b.houses, 0);
  const visited = streetBlocks.reduce((s, b) => s + b.visited, 0);
  const newThisWeek = streetMembers.filter((m) => m.joined >= "2026-11-16").length;
  return (
    <>
      <Kpis
        items={[
          { label: "Members on my street", value: streetMembers.length },
          { label: "New this week", value: newThisWeek },
          { label: "Houses visited", value: `${visited}/${houses}` },
        ]}
      />
      <Panel title={`${user.street ?? "My street"} · houses visited by block`} action={<DemoTag />}>
        <div className="tile-map">
          {streetBlocks.map((b) => {
            const pct = b.visited / b.houses;
            return (
              <span key={b.block} data-level={pct === 0 ? 0 : pct < 0.34 ? 1 : pct < 0.67 ? 2 : pct < 1 ? 3 : 4}>
                {b.block}
                <br />
                {b.visited}/{b.houses}
              </span>
            );
          })}
        </div>
        <p className="legend">
          <span><i className="legend-swatch" data-level={0} />Not visited</span>
          <span><i className="legend-swatch" data-level={2} />Part visited</span>
          <span><i className="legend-swatch" data-level={4} />All visited</span>
        </p>
      </Panel>
      <Panel title="Members">
        <ul className="rows">
          {streetMembers.map((m) => (
            <li key={m.firstName}>
              <span className="row-main">
                <strong>{m.firstName}</strong>
                <span className="small muted">Joined {fmtDate(m.joined)}</span>
              </span>
              <Badge tone={m.status === "Verified" ? "ok" : "warn"}>{m.status}</Badge>
            </li>
          ))}
        </ul>
        <p className="small muted">You see first names and status only. Phone numbers and other details are never shown to street leaders.</p>
      </Panel>
    </>
  );
}

/* SL-5 */
function Materials() {
  const [requests, setRequests] = usePersisted<{ item: string; qty: number; at: string }[]>("tbh-sl-mat-req", []);
  const [item, setItem] = useState(materials[0].item);
  const [qty, setQty] = useState("");
  const [err, setErr] = useState("");
  const toast = useToast();
  return (
    <>
      <Panel title="Materials" action={<DemoTag />}>
        <ul className="task-list">
          {materials.map((m) => (
            <li key={m.item} className="task-item">
              <span className="task-main">
                <strong>{m.item}</strong>
                <span className="small muted">
                  {m.distributed} given out of {m.received} received · {m.received - m.distributed} left
                </span>
                <Meter value={m.distributed} max={m.received} label={`${m.item} distributed`} />
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Ask for more">
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(qty);
            if (!Number.isInteger(n) || n < 1 || n > 2000) return setErr("Enter a number from 1 to 2,000.");
            setErr("");
            setRequests([{ item, qty: n, at: new Date().toISOString() }, ...requests]);
            setQty("");
            toast("Request sent to your ward leader");
          }}
        >
          <SelectField label="What" value={item} onChange={(e) => setItem(e.target.value)} options={materials.map((m) => m.item)} />
          <TextField label="How many" type="number" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} error={err} />
          <button type="submit" className="btn btn-primary btn-lg">
            Request
          </button>
        </form>
        {requests.length > 0 && (
          <ul className="rows">
            {requests.map((r, i) => (
              <li key={i}>
                <span className="row-main">
                  <strong>
                    {r.qty} × {r.item}
                  </strong>
                  <span className="small muted">{fmtDate(r.at, true)}</span>
                </span>
                <Badge tone="warn">Waiting for ward leader</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

/* SL-6 */
function Recruit({ user }: { user: DemoUser }) {
  const link = `https://tbhone.example/join?ref=${user.id.replace("u-", "").toUpperCase()}&street=${encodeURIComponent(user.street ?? "")}`;
  const text = `Salam! I'm the TBH One street leader for ${user.street ?? "our street"}. Joining is free — Tell One, Bring One, Help One. Join with my link: ${link}`;
  return (
    <Panel title="Invite neighbours">
      <p>Share your link. Neighbours who join appear on My street.</p>
      <div className="ref-link">
        <code>{link}</code>
        <CopyButton value={link} label="Copy link" />
      </div>
      <TextArea label="WhatsApp message" value={text} readOnly rows={4} />
      <a className="btn btn-primary btn-lg" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">
        <UserPlus size={18} aria-hidden /> Share on WhatsApp
      </a>
      <p className="small muted">Referral points are earned for verified members. Payment is only ever for verified work, never for sign-ups alone (GR-7).</p>
    </Panel>
  );
}

/* SL-7 */
function Safety() {
  const [shift, setShift] = usePersisted<{ in?: string; out?: string; share: boolean }>("tbh-sl-shift", { share: false });
  const [report, setReport] = useState(false);
  const [sent, setSent] = useState("");
  const [what, setWhat] = useState("");
  const toast = useToast();
  const onShift = !!shift.in && !shift.out;
  return (
    <>
      <Panel title="Shift check-in">
        <div className="big-actions">
          <button
            type="button"
            className="big-btn"
            aria-pressed={onShift}
            disabled={onShift}
            onClick={() => {
              setShift({ in: new Date().toISOString(), share: shift.share });
              toast("Checked in. Stay safe.");
            }}
          >
            <LogIn size={32} aria-hidden />
            {onShift ? "On shift" : "Start shift"}
          </button>
          <button
            type="button"
            className="big-btn"
            disabled={!onShift}
            onClick={() => {
              setShift({ ...shift, out: new Date().toISOString() });
              toast("Checked out");
            }}
          >
            <LogOut size={32} aria-hidden />
            End shift
          </button>
          <button type="button" className="big-btn big-btn-danger" onClick={() => setReport(true)}>
            <AlertTriangle size={32} aria-hidden />
            Report a problem
          </button>
        </div>
        <p className="small">
          {shift.in ? `Checked in ${fmtDate(shift.in, true)}` : "Not checked in today."}
          {shift.out ? ` · Checked out ${fmtDate(shift.out, true)}` : ""}
        </p>
        <label className="switch">
          <span>
            <strong>Share my live location with my ward leader during the shift</strong>
            <span className="small muted">Optional. Only while you are checked in. Stops when you end the shift.</span>
          </span>
          <input type="checkbox" role="switch" checked={shift.share} onChange={(e) => setShift({ ...shift, share: e.target.checked })} />
        </label>
        <Notice tone="warn" title="In danger right now?">
          Leave the area and call the police on 112 (emergency). Then report here.
        </Notice>
      </Panel>
      <Dialog
        open={report}
        onClose={() => setReport(false)}
        title="Report a safety problem"
        size="sm"
        footer={
          !sent ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                await simulate(500);
                const ref = `SAFE-${String(Date.now()).slice(-6)}`;
                setSent(ref);
                toast("Report sent to safeguarding");
              }}
            >
              Send now
            </button>
          ) : undefined
        }
      >
        {sent ? (
          <Notice tone="ok" title={`Report ${sent} sent`}>
            Your ward leader and the state safeguarding focal point have been alerted. Critical reports get a response within 1 hour.
          </Notice>
        ) : (
          <>
            <p className="small">One tap is enough. Add a few words if you can — your location is attached only if you are sharing it.</p>
            <TextArea label="What happened? (optional)" value={what} onChange={(e) => setWhat(e.target.value)} rows={3} />
          </>
        )}
      </Dialog>
    </>
  );
}

/* SL-8 */
function Training({ trained, setTrained }: { trained: string[]; setTrained: (v: string[]) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const mod = trainingModules.find((m) => m.id === open);
  const toast = useToast();
  return (
    <>
      <Panel title="Training">
        <ul className="task-list">
          {trainingModules.map((m) => {
            const done = trained.includes(m.id);
            return (
              <li key={m.id} className="task-item">
                <span className="task-main">
                  <strong>{m.title}</strong>
                  <span className="small muted">
                    {m.minutes} min {m.required ? "· required before first task" : "· recommended"}
                  </span>
                </span>
                {done ? (
                  <Badge tone="ok">
                    <CheckCircle2 size={12} aria-hidden /> Badge earned
                  </Badge>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => setOpen(m.id)}>
                    Start
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
      <Dialog
        open={!!mod}
        onClose={() => setOpen(null)}
        title={mod?.title ?? ""}
        footer={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (mod) {
                setTrained([...trained, mod.id]);
                toast(`${mod.title}: completed`);
              }
              setOpen(null);
            }}
          >
            I understand — complete
          </button>
        }
      >
        <ol className="module-points">
          {mod?.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </Dialog>
    </>
  );
}

/* SL-9 */
function Messages() {
  const [replies, setReplies] = usePersisted<{ id: string; text: string; at: string }[]>("tbh-sl-replies", []);
  const [text, setText] = useState("");
  const toast = useToast();
  const thread = [...wardMessages.map((m) => ({ ...m, mine: false })), ...replies.map((r) => ({ id: r.id, from: "You", at: r.at, text: r.text, mine: true }))].sort((a, b) => a.at.localeCompare(b.at));
  return (
    <Panel title="Messages from your ward leader">
      <ul className="thread">
        {thread.map((m) => (
          <li key={m.id} className={m.mine ? "is-mine" : ""}>
            <span className="small muted">
              {m.from} · {fmtDate(m.at, true)}
            </span>
            <p>{m.text}</p>
          </li>
        ))}
      </ul>
      <form
        className="reply-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setReplies([...replies, { id: `r${Date.now()}`, text: text.trim(), at: new Date().toISOString() }]);
          setText("");
          toast("Reply sent");
        }}
      >
        <label htmlFor="reply" className="sr-only">
          Reply
        </label>
        <input id="reply" className="input" placeholder="Reply or ask a question" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
          Send
        </button>
      </form>
    </Panel>
  );
}

/* SL-10 */
function Rank({ user }: { user: DemoUser }) {
  const sorted = [...wardRanking].sort((a, b) => b.points - a.points);
  return (
    <Panel title={`Points and rank in ${user.ward ?? "your ward"}`} action={<DemoTag />}>
      <ol className="rank-list">
        {sorted.map((r, i) => (
          <li key={r.firstName} className={r.firstName === user.firstName ? "is-me" : ""}>
            <span className="rank-no">{i + 1}</span>
            <span className="row-main">
              <strong>{r.firstName === user.firstName ? `${r.firstName} (you)` : r.firstName}</strong>
              <span className="small muted">{r.street}</span>
            </span>
            <strong>{r.points.toLocaleString("en-NG")}</strong>
          </li>
        ))}
      </ol>
      <p className="small muted">Street leader rankings show first names only.</p>
    </Panel>
  );
}

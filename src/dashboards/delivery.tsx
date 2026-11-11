"use client";

import { useState, type ReactNode } from "react";
import { CalendarClock, Camera, CheckCircle2, KeyRound, MapPin, PackageCheck, PackageOpen, PackageX, Phone, RotateCcw, Truck } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Badge, Kpis, naira, Panel } from "@/components/dashboard/kit";
import { ConfirmDialog } from "@/components/ui/Interactive";
import { SelectField, TextArea, TextField, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { go } from "@/lib/navigate";
import type { Order } from "@/lib/orders";
import { dispatchHeld } from "@/data/shop";
import { DELIVERY_CODE_HINT, DEMO_DELIVERY_CODE, FAILED_REASONS } from "@/data/mock/backoffice";
import { shortDate, shortDateTime, stamp, usePersisted } from "./office/common";
import { itemsIn, setOrderState, useAllOrders } from "./office/orders";

type Failure = { number: string; reason: string; note: string; reschedule: string; at: string; by: string; retried?: boolean };

export default function DeliveryDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="delivery" section={section}>
      {(user) => <Delivery section={section} user={user} />}
    </DashboardShell>
  );
}

function Delivery({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const { orders, ready } = useAllOrders();
  const [failures, setFailures] = usePersisted<Failure[]>("tbh-ofc-dl-failed", []);
  if (!ready) return null;
  switch (section) {
    case "pickups":
      return <Pickups orders={orders} me={me} />;
    case "confirm":
      return <Confirm orders={orders} me={me} />;
    case "failed":
      return <Failed orders={orders} me={me} failures={failures} setFailures={setFailures} />;
    default:
      return <Shipments orders={orders} me={me} failures={failures} />;
  }
}

const dest = (o: Order) => {
  if (o.delivery.method === "pickup") return `${o.delivery.pickupPoint}, ${o.delivery.state}`;
  const a = o.delivery.address ?? "";
  const lga = o.delivery.lga && !a.endsWith(o.delivery.lga) ? `, ${o.delivery.lga}` : "";
  return `${a}${lga}, ${o.delivery.state}`;
};
const telHref = (p: string) => `tel:${p.replace(/\s/g, "")}`;

function ShipCard({ o, children, tone }: { o: Order; children?: ReactNode; tone?: string }) {
  return (
    <article className="ofc-card ofc-ship" data-tone={tone}>
      <div className="ofc-card-head">
        <span className="ofc-card-title">{o.number}</span>
        <Badge tone={o.state === "Delivered" ? "ok" : o.state === "Out for delivery" ? "info" : "warn"}>{o.state}</Badge>
      </div>
      <p className="ofc-row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <MapPin size={18} aria-hidden style={{ flex: "none", marginTop: 3 }} />
        <span>
          <strong>{o.buyer.name}</strong> — {dest(o)}
        </span>
      </p>
      <div className="ofc-meta">
        <span>{itemsIn(o)} items</span>
        <span>{o.delivery.estimate}</span>
        {o.tracking && <span className="ofc-mono">{o.tracking}</span>}
        <span>
          <Phone size={14} aria-hidden /> <a href={telHref(o.buyer.phone)}>{o.buyer.phone}</a>
        </span>
      </div>
      {children}
    </article>
  );
}

/* ---------------------------------------------------------------- EC-19 My shipments */
function Shipments({ orders, me, failures }: { orders: Order[]; me: string; failures: Failure[] }) {
  const toast = useToast();
  const onRoad = orders.filter((o) => o.state === "Out for delivery");
  const atDepot = orders.filter((o) => o.state === "Dispatched");
  const today = new Date().toDateString();
  const deliveredToday = orders.filter((o) => o.state === "Delivered" && new Date(o.history[o.history.length - 1].at).toDateString() === today);
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Out for delivery", value: onRoad.length },
          { label: "Collected, not yet out", value: atDepot.length },
          { label: "Delivered today", value: deliveredToday.length, tone: "ok" },
          { label: "Failed attempts", value: failures.filter((f) => !f.retried).length, tone: failures.some((f) => !f.retried) ? "warn" : undefined },
        ]}
      />
      {dispatchHeld() && <Notice tone="warn" title="Dispatch paused">New pickups resume on 17 January 2027 (campaign cut-off rule). Finish shipments already on the road.</Notice>}
      <Panel title="On the road">
        {onRoad.length === 0 ? (
          <EmptyState icon={<Truck size={28} aria-hidden />} title="Nothing out for delivery" text="Start a delivery from the collected shipments below." />
        ) : (
          <div className="ofc-cards">
            {onRoad.map((o) => (
              <ShipCard key={o.number} o={o}>
                <div className="ofc-actions">
                  <button type="button" className="btn btn-primary" onClick={() => go(`/dashboard/delivery/confirm#${o.number}`)}>
                    <PackageCheck size={18} aria-hidden /> Confirm delivery
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => go(`/dashboard/delivery/failed#${o.number}`)}>
                    <PackageX size={18} aria-hidden /> Couldn't deliver
                  </button>
                </div>
              </ShipCard>
            ))}
          </div>
        )}
      </Panel>
      <Panel title="Collected — ready to go out">
        {atDepot.length === 0 ? (
          <p className="ofc-muted">No collected shipments waiting.</p>
        ) : (
          <div className="ofc-cards">
            {atDepot.map((o) => (
              <ShipCard key={o.number} o={o}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setOrderState(o, "Out for delivery", `Out for delivery with ${me}`);
                    toast(`${o.number} is out for delivery — the customer gets an SMS`);
                  }}
                >
                  <Truck size={18} aria-hidden /> Start delivery
                </button>
              </ShipCard>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- EC-19 Pickups */
function Pickups({ orders, me }: { orders: Order[]; me: string }) {
  const toast = useToast();
  const [confirm, setConfirm] = useState<Order | null>(null);
  const held = dispatchHeld();
  const ready = orders.filter((o) => o.state === "Packed");
  const byVendor = new Map<string, Order[]>();
  ready.forEach((o) => {
    const key = o.delivery.method === "pickup" ? "To ward-leader hubs" : `Courier — ${o.delivery.state}`;
    byVendor.set(key, [...(byVendor.get(key) ?? []), o]);
  });
  return (
    <div className="ofc-stack">
      <p className="ofc-muted ofc-small">Packed orders waiting at the vendor. Check the item count and seal before you sign.</p>
      {held && <Notice tone="warn" title="Pickups paused">Pickups resume on 17 January 2027.</Notice>}
      {ready.length === 0 ? (
        <Panel><EmptyState icon={<PackageOpen size={28} aria-hidden />} title="No pickups waiting" text="Shop Operations marks orders as packed when the vendor has them ready." /></Panel>
      ) : (
        [...byVendor].map(([group, list]) => (
          <Panel key={group} title={`${group} (${list.length})`}>
            <div className="ofc-cards">
              {list.map((o) => (
                <ShipCard key={o.number} o={o}>
                  <p className="ofc-small">{o.lines.map((l) => `${l.qty} × ${l.name}`).join("; ")}</p>
                  <button type="button" className="btn btn-primary" disabled={held} onClick={() => setConfirm(o)}>
                    <PackageOpen size={18} aria-hidden /> Confirm pickup
                  </button>
                </ShipCard>
              ))}
            </div>
          </Panel>
        ))
      )}
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        title="Confirm pickup?"
        text={confirm ? `You have ${itemsIn(confirm)} items for ${confirm.number}, sealed and labelled. This hands the order to you.` : ""}
        confirmLabel="Yes, I've collected it"
        onConfirm={() => {
          if (confirm) {
            setOrderState(confirm, "Dispatched", `Collected by ${me}`, { courier: `Delivery partner — ${me}`, tracking: confirm.tracking ?? `TRK${confirm.number.slice(-6)}NG` });
            toast(`${confirm.number} collected`);
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- EC-21 Confirm delivery */
function Confirm({ orders, me }: { orders: Order[]; me: string }) {
  const toast = useToast();
  const onRoad = orders.filter((o) => o.state === "Out for delivery");
  const initial = typeof window !== "undefined" ? decodeURIComponent(window.location.hash.slice(1)) : "";
  const [no, setNo] = useState(onRoad.some((o) => o.number === initial) ? initial : "");
  const [method, setMethod] = useState<"code" | "photo">("code");
  const [code, setCode] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [receiver, setReceiver] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const cur = onRoad.find((o) => o.number === no);
  return (
    <div className="ofc-stack">
      <Notice title="Proof of delivery">{DELIVERY_CODE_HINT} If the customer can't find the code, take a clear photo of the parcel with the receiver at the door.</Notice>
      {done && <Notice tone="ok" title="Delivered">{done} is marked delivered. The customer gets a receipt by SMS.</Notice>}
      {onRoad.length === 0 ? (
        <Panel><EmptyState icon={<CheckCircle2 size={28} aria-hidden />} title="Nothing to confirm" text="Start a delivery from My shipments first." action={<button type="button" className="btn btn-primary" onClick={() => go("/dashboard/delivery")}>My shipments</button>} /></Panel>
      ) : (
        <Panel title="Confirm a delivery">
          <form
            className="form-grid"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const er: Record<string, string> = {};
              if (!cur) er.no = "Choose the shipment.";
              if (method === "code" && code.trim() !== DEMO_DELIVERY_CODE) er.code = code.trim().length !== 4 ? "Enter the 4-digit code from the customer's SMS." : "That code doesn't match. Ask the customer to check their SMS.";
              if (method === "photo" && !photo) er.photo = "Take or choose a photo of the delivered parcel.";
              if (receiver.trim().length < 2) er.receiver = "Who received it?";
              setErr(er);
              if (Object.keys(er).length || !cur) return;
              setBusy(true);
              await simulate(500);
              setOrderState(cur, "Delivered", `Delivered by ${me} to ${receiver.trim()} — ${method === "code" ? "delivery code confirmed" : "photo proof"}`);
              toast(`${cur.number} delivered`);
              setDone(cur.number);
              setNo("");
              setCode("");
              setPhoto(null);
              setReceiver("");
              setBusy(false);
            }}
          >
            <SelectField label="Shipment" value={no} onChange={(e) => { setNo(e.target.value); setDone(null); }} placeholder="Choose…" options={onRoad.map((o) => ({ value: o.number, label: `${o.number} · ${o.buyer.name} · ${o.delivery.lga ?? o.delivery.state}` }))} error={err.no} required />
            {cur && <p className="ofc-small ofc-muted"><MapPin size={14} aria-hidden /> {dest(cur)} · {itemsIn(cur)} items · {naira(cur.total)} (already paid)</p>}
            <fieldset className="ofc-row" aria-label="Proof type">
              <label className="ofc-row" style={{ gap: 6 }}>
                <input type="radio" name="proof" checked={method === "code"} onChange={() => setMethod("code")} /> <KeyRound size={16} aria-hidden /> Customer's code
              </label>
              <label className="ofc-row" style={{ gap: 6 }}>
                <input type="radio" name="proof" checked={method === "photo"} onChange={() => setMethod("photo")} /> <Camera size={16} aria-hidden /> Photo
              </label>
            </fieldset>
            {method === "code" ? (
              <TextField label="4-digit delivery code" inputMode="numeric" autoComplete="one-time-code" maxLength={4} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={err.code} required hint="Demo code: 4321" />
            ) : (
              <div className="ofc-dropzone">
                <label htmlFor="pod-photo" className="ofc-strong">Photo of the delivered parcel</label>
                <input
                  id="pod-photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => setPhoto(String(r.result));
                    r.readAsDataURL(f);
                  }}
                />
                {photo && <img src={photo} alt="Proof of delivery preview" className="ofc-photo" />}
                {err.photo && <p className="ofc-small ofc-danger" role="alert">{err.photo}</p>}
                <span className="ofc-small ofc-muted">Prototype: the photo stays on this device.</span>
              </div>
            )}
            <TextField label="Received by" value={receiver} onChange={(e) => setReceiver(e.target.value)} error={err.receiver} required hint="Name of the person who took the parcel" />
            <button type="submit" className="btn btn-primary" disabled={busy} style={{ minHeight: 52 }}>
              <PackageCheck size={18} aria-hidden /> {busy ? "Confirming…" : "Mark as delivered"}
            </button>
          </form>
        </Panel>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- EC-21 Failed deliveries */
function Failed({ orders, me, failures, setFailures }: { orders: Order[]; me: string; failures: Failure[]; setFailures: (fn: (f: Failure[]) => Failure[]) => void }) {
  const toast = useToast();
  const onRoad = orders.filter((o) => o.state === "Out for delivery");
  const initial = typeof window !== "undefined" ? decodeURIComponent(window.location.hash.slice(1)) : "";
  const [f, setF] = useState({ number: onRoad.some((o) => o.number === initial) ? initial : "", reason: "", note: "", reschedule: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const todayIso = new Date().toISOString().slice(0, 10);
  const attempts = (n: string) => failures.filter((x) => x.number === n).length;
  return (
    <div className="ofc-stack">
      <Panel title="Record a failed delivery">
        {onRoad.length === 0 ? (
          <p className="ofc-muted">No shipments are out for delivery.</p>
        ) : (
          <form
            className="form-grid"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const er: Record<string, string> = {};
              if (!f.number) er.number = "Choose the shipment.";
              if (!f.reason) er.reason = "Choose what happened.";
              if (!f.reschedule) er.reschedule = "Pick a new delivery date.";
              else if (f.reschedule < todayIso) er.reschedule = "The new date can't be in the past.";
              setErr(er);
              if (Object.keys(er).length) return;
              const o = onRoad.find((x) => x.number === f.number);
              if (!o) return;
              const n = attempts(o.number) + 1;
              setOrderState(o, "Dispatched", `Delivery attempt ${n} failed: ${f.reason}${f.note.trim() ? ` — ${f.note.trim()}` : ""}. Rescheduled for ${shortDate(`${f.reschedule}T12:00:00+01:00`)}`);
              setFailures((all) => [{ number: o.number, reason: f.reason, note: f.note.trim(), reschedule: f.reschedule, at: stamp(), by: me }, ...all]);
              toast(`${o.number}: attempt ${n} recorded — the customer gets an SMS with the new date`);
              setF({ number: "", reason: "", note: "", reschedule: "" });
            }}
          >
            <SelectField label="Shipment" value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} placeholder="Choose…" options={onRoad.map((o) => ({ value: o.number, label: `${o.number} · ${o.buyer.name}` }))} error={err.number} required />
            <SelectField label="What happened?" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} placeholder="Choose…" options={FAILED_REASONS} error={err.reason} required />
            {f.reason === "Area unsafe to enter" && <Notice tone="warn">Don't take risks. Leave the area and tell your supervisor. Safety comes before any delivery.</Notice>}
            <TextArea label="Note (optional)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} hint="For example: called twice, no answer" />
            <TextField label="New delivery date" type="date" min={todayIso} value={f.reschedule} onChange={(e) => setF({ ...f, reschedule: e.target.value })} error={err.reschedule} required />
            <button type="submit" className="btn btn-primary" style={{ minHeight: 52 }}>
              <PackageX size={18} aria-hidden /> Record and reschedule
            </button>
          </form>
        )}
      </Panel>
      <Panel title="Failed attempts">
        {failures.length === 0 ? (
          <EmptyState icon={<CheckCircle2 size={28} aria-hidden />} title="No failed deliveries" />
        ) : (
          <div className="ofc-cards">
            {failures.map((x, i) => {
              const o = orders.find((y) => y.number === x.number);
              const n = failures.filter((y) => y.number === x.number).length;
              return (
                <article key={`${x.number}-${i}`} className="ofc-card" data-tone={x.retried ? "muted" : n >= 3 ? "danger" : "warn"}>
                  <div className="ofc-card-head">
                    <span className="ofc-card-title">{x.number}</span>
                    <Badge tone={x.retried ? "muted" : "warn"}>{x.retried ? "Retried" : `Rescheduled ${shortDate(`${x.reschedule}T12:00:00+01:00`)}`}</Badge>
                  </div>
                  <p className="ofc-small">{x.reason}{x.note ? ` — ${x.note}` : ""}</p>
                  <div className="ofc-meta"><span><CalendarClock size={14} aria-hidden /> {x.at}</span><span>{x.by}</span>{o && <span>{o.buyer.name}, {o.delivery.state}</span>}</div>
                  {n >= 3 && !x.retried && <Notice tone="danger">Three failed attempts — return the parcel to the vendor and tell Shop Operations.</Notice>}
                  {!x.retried && o?.state === "Dispatched" && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setOrderState(o, "Out for delivery", `Delivery re-attempted by ${me}`);
                        setFailures((all) => all.map((y, j) => (j === i ? { ...y, retried: true } : y)));
                        toast(`${o.number} is out for delivery again`);
                      }}
                    >
                      <RotateCcw size={16} aria-hidden /> Retry delivery now
                    </button>
                  )}
                  {o && <p className="ofc-small ofc-muted">Last update {shortDateTime(o.history[o.history.length - 1].at)}</p>}
                </article>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}

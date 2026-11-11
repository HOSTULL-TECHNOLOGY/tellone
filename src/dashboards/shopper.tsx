"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { Gift, LifeBuoy, MapPin, Package, Plus, QrCode, ShoppingBag, Star, Ticket as TicketIcon, Trash2, Undo2 } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Badge, Grid, Kpis, naira, Panel, type Tone } from "@/components/dashboard/kit";
import { ConfirmDialog, CopyButton, Dialog } from "@/components/ui/Interactive";
import { CheckField, SelectField, TextArea, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { go } from "@/lib/navigate";
import { readPref, writePref } from "@/lib/prefs";
import { writeCartCoupon } from "@/lib/cart";
import { advanceOrder, canReturn, ORDERS_EVENT, ordersFor, requestReturn, saveOrder, type Order } from "@/lib/orders";
import { coupons, deliveryZones, ORDER_STATES, partnerOffers, pointsRewards, shopPromotionsOpen } from "@/data/shop";
import { states } from "@/data/states";
import { ago, buildDemoOrders, tickets as seedTickets, type Ticket } from "@/data/mock/backoffice";
import { shortDate, shortDateTime, stamp } from "./office/common";
import { usePersisted } from "./office/common";

const DEMO_POINTS = 1240; // same demo balance as the public coupons page (MB-2)
const CANCELLABLE = ["Paid", "Sent to vendor"];

export default function ShopperDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="shopper" section={section}>
      {(user) => <Shopper section={section} user={user} />}
    </DashboardShell>
  );
}

/** The signed-in user's orders, live-updated from the shared prototype order store. Seeds clearly-labelled demo orders once. */
function useMyOrders(user: DemoUser) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(() => setOrders(ordersFor(user.id, user.phone).sort((a, b) => b.createdAt.localeCompare(a.createdAt))), [user.id, user.phone]);
  useEffect(() => {
    const seededKey = `tbh-ofc-shopper-seeded-${user.id}`;
    if (!ordersFor(user.id, user.phone).length && !readPref(seededKey)) {
      const demo = buildDemoOrders();
      const pick: [number, Order["state"], number][] = [
        [0, "Delivered", 50],
        [3, "Out for delivery", 30],
        [1, "Sent to vendor", 4],
      ];
      pick.forEach(([i, st, h], k) => {
        const base = demo[i];
        const flow = ORDER_STATES.slice(0, ORDER_STATES.indexOf(st as (typeof ORDER_STATES)[number]) + 1);
        saveOrder({
          ...base,
          number: `DEMO-26-${user.id.replace(/\W/g, "").toUpperCase().slice(-4)}${k + 1}`,
          createdAt: ago(h),
          buyer: { name: `${user.firstName} ${user.lastName}`, phone: user.phone, email: user.email, userId: user.id },
          delivery: { ...base.delivery, method: "courier", state: user.state, lga: user.lga, address: `${user.street ?? "12 Demo Street"}, ${user.lga}`, pickupPoint: undefined },
          state: st,
          history: flow.map((s, j) => ({ state: s, at: ago(h - j * Math.max(1, Math.floor(h / 8))) })),
          courier: flow.length > 3 ? "Courier partner (demo)" : undefined,
          tracking: flow.length > 3 ? `TRKDEMO${k}NG` : undefined,
        });
      });
      writePref(seededKey, "1");
    }
    refresh();
    setReady(true);
    window.addEventListener(ORDERS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ORDERS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [user, refresh]);
  return { orders, ready, refresh };
}

function Shopper({ section, user }: { section: string; user: DemoUser }) {
  const { orders, ready, refresh } = useMyOrders(user);
  if (!ready) return null;
  switch (section) {
    case "coupons":
      return <Coupons user={user} />;
    case "offers":
      return <Offers user={user} />;
    case "returns":
      return <Returns orders={orders} refresh={refresh} />;
    case "addresses":
      return <Addresses user={user} />;
    case "support":
      return <Support user={user} orders={orders} />;
    default:
      return <Orders orders={orders} refresh={refresh} />;
  }
}

const stateTone = (s: Order["state"]): Tone => (s === "Delivered" ? "ok" : s === "Cancelled" || s === "Refunded" ? "muted" : s === "Return requested" ? "warn" : "info");
const isDemo = (o: Order) => o.number.startsWith("DEMO-");

/* ---------------------------------------------------------------- EC-17 / EC-21 My orders */
function Orders({ orders, refresh }: { orders: Order[]; refresh: () => void }) {
  const toast = useToast();
  const [openNo, setOpenNo] = useState<string | null>(null);
  const [cancel, setCancel] = useState<Order | null>(null);
  const cur = orders.find((o) => o.number === openNo) ?? orders[0];
  const active = orders.filter((o) => !["Delivered", "Cancelled", "Refunded"].includes(o.state));
  if (!orders.length)
    return (
      <Panel>
        <EmptyState icon={<ShoppingBag size={28} aria-hidden />} title="No orders yet" text="Orders you place in the TBH One Shop appear here with live tracking." action={<button type="button" className="btn btn-primary" onClick={() => go("/shop")}>Visit the shop</button>} />
      </Panel>
    );
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Orders", value: orders.length },
          { label: "On the way", value: active.length },
          { label: "Total spent", value: naira(orders.filter((o) => o.state !== "Cancelled" && o.state !== "Refunded").reduce((n, o) => n + o.total, 0)) },
        ]}
      />
      {orders.some(isDemo) && <Notice title="Demo orders">Orders numbered DEMO-… were created so you can try tracking, returns and support. Real checkouts appear alongside them.</Notice>}
      <Grid cols={2}>
        <Panel title="Your orders">
          <ul className="rows" role="list">
            {orders.map((o) => (
              <li key={o.number}>
                <div className="row-main">
                  <button type="button" className="linklike ofc-strong" aria-pressed={cur?.number === o.number} onClick={() => setOpenNo(o.number)}>
                    {o.number}
                  </button>
                  <span className="ofc-small ofc-muted">
                    {shortDate(o.createdAt)} · {o.lines.reduce((n, l) => n + l.qty, 0)} items · {naira(o.total)}
                  </span>
                </div>
                <span className="ofc-row">
                  {isDemo(o) && <Badge>Demo</Badge>}
                  <Badge tone={stateTone(o.state)}>{o.state}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        {cur && (
          <Panel title={`Order ${cur.number}`}>
            <div className="ofc-stack">
              <ol className="ofc-timeline" aria-label="Order progress">
                {ORDER_STATES.map((s) => {
                  const h = cur.history.find((x) => x.state === s);
                  const isCur = cur.state === s;
                  return (
                    <li key={s} className={h ? (isCur ? "done current" : "done") : ""}>
                      {s}
                      {h && <span className="ofc-muted"> · {shortDateTime(h.at)}</span>}
                    </li>
                  );
                })}
                {["Cancelled", "Return requested", "Refunded"].includes(cur.state) && (
                  <li className="current">
                    {cur.state} · {shortDateTime(cur.history[cur.history.length - 1].at)}
                  </li>
                )}
              </ol>
              {cur.tracking && (
                <p className="ofc-small">
                  {cur.courier} · tracking <span className="ofc-mono">{cur.tracking}</span>
                </p>
              )}
              {cur.dispatchFrom && <Notice tone="warn">This order dispatches from {shortDate(cur.dispatchFrom)} (campaign cut-off rule).</Notice>}
              <div className="ofc-scroll">
                <table className="ofc-table">
                  <caption className="sr-only">Items in order {cur.number}</caption>
                  <thead><tr><th scope="col">Item</th><th scope="col" className="num">Qty</th><th scope="col" className="num">Amount</th></tr></thead>
                  <tbody>
                    {cur.lines.map((l, i) => (
                      <tr key={i}><td>{l.name}{l.size ? ` · ${l.size}` : ""}{l.colour ? ` · ${l.colour}` : ""}</td><td className="num">{l.qty}</td><td className="num">{naira(l.unitPrice * l.qty)}</td></tr>
                    ))}
                    <tr><td colSpan={2}>Delivery ({cur.delivery.zone})</td><td className="num">{cur.delivery.fee ? naira(cur.delivery.fee) : "Free"}</td></tr>
                    {cur.discount > 0 && <tr><td colSpan={2}>Discount{cur.coupon ? ` (${cur.coupon})` : ""}</td><td className="num">−{naira(cur.discount)}</td></tr>}
                  </tbody>
                  <tfoot><tr><td colSpan={2}>Total (incl. VAT {naira(cur.vat)})</td><td className="num">{naira(cur.total)}</td></tr></tfoot>
                </table>
              </div>
              <p className="ofc-small ofc-muted">
                {cur.delivery.method === "pickup" ? `Pickup: ${cur.delivery.pickupPoint}` : `Deliver to: ${cur.delivery.address ?? ""}, ${cur.delivery.lga ?? ""}, ${cur.delivery.state}`} · {cur.delivery.estimate}
              </p>
              <div className="ofc-actions">
                {CANCELLABLE.includes(cur.state) && (
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => setCancel(cur)}>
                    Cancel order
                  </button>
                )}
                {canReturn(cur) && (
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => go("/dashboard/shopper/returns")}>
                    <Undo2 size={14} aria-hidden /> Return an item
                  </button>
                )}
                {ORDER_STATES.includes(cur.state as (typeof ORDER_STATES)[number]) && cur.state !== "Delivered" && (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      const u = advanceOrder(cur.number);
                      refresh();
                      if (u) toast(`Demo: ${u.number} is now “${u.state}”`);
                    }}
                  >
                    Simulate next status
                  </button>
                )}
              </div>
            </div>
          </Panel>
        )}
      </Grid>
      <ConfirmDialog
        open={!!cancel}
        onCancel={() => setCancel(null)}
        danger
        title="Cancel this order?"
        text={cancel ? `Order ${cancel.number} hasn't been packed yet, so you can cancel it. ${naira(cancel.total)} is refunded to your original payment method within 5 working days.` : ""}
        confirmLabel="Cancel order"
        onConfirm={() => {
          if (cancel && CANCELLABLE.includes(cancel.state)) {
            const at = new Date().toISOString();
            saveOrder({ ...cancel, state: "Cancelled", payment: { ...cancel.payment, status: "Refunded" }, history: [...cancel.history, { state: "Cancelled", at, note: "Cancelled by customer before packing" }] });
            refresh();
            toast(`${cancel.number} cancelled — refund on its way`);
          }
          setCancel(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- EC-7 / EC-8 Coupons */
function Coupons({ user }: { user: DemoUser }) {
  const toast = useToast();
  const key = `tbh-points-spent-${user.id}`;
  const [spent, setSpent] = useState(0);
  const [codes, setCodes] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<(typeof pointsRewards)[number] | null>(null);
  useEffect(() => {
    setSpent(Number(readPref(key) ?? 0));
    try {
      setCodes(JSON.parse(readPref(`${key}-codes`) ?? "[]"));
    } catch {
      /* ignore */
    }
  }, [key]);
  const balance = DEMO_POINTS - spent;
  const open = shopPromotionsOpen();
  if (!open) return <Notice tone="warn" title="Coupons are paused">Member coupons and promotions stopped at the campaign cut-off (11:59 pm, Thursday 14 January 2027).</Notice>;
  const apply = (code: string) => {
    writeCartCoupon(code);
    toast(`${code} will be applied in your cart`);
  };
  return (
    <div className="ofc-stack">
      <Kpis items={[{ label: "Impact Points balance", value: balance.toLocaleString("en-NG"), sub: "Demo balance" }, { label: "Coupons unlocked with points", value: codes.length }]} />
      <Grid cols={2}>
        <Panel title="Member coupons this period">
          <ul className="rows" role="list">
            {coupons
              .filter((c) => !c.code.startsWith("POINTS"))
              .map((c) => (
                <li key={c.code}>
                  <div className="row-main">
                    <strong>{c.label}</strong>
                    <span className="ofc-small ofc-muted">
                      <span className="ofc-mono">{c.code}</span> · expires {shortDate(`${c.expires}T12:00:00+01:00`)}
                      {c.minOrder ? ` · min ${naira(c.minOrder)}` : ""}
                    </span>
                  </div>
                  <span className="row-actions">
                    <CopyButton value={c.code} />
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => apply(c.code)}>Use in cart</button>
                  </span>
                </li>
              ))}
          </ul>
          <p className="ofc-small ofc-muted">One coupon per order, on top of your 10% member price.</p>
        </Panel>
        <Panel title="Turn Impact Points into rewards">
          <ul className="rows" role="list">
            {pointsRewards.map((r) => {
              const have = codes.includes(r.code);
              return (
                <li key={r.code}>
                  <div className="row-main">
                    <strong>{r.label}</strong>
                    <span className="ofc-small ofc-muted">{r.points.toLocaleString("en-NG")} points</span>
                  </div>
                  <span className="row-actions">
                    {have ? (
                      <>
                        <span className="ofc-mono">{r.code}</span>
                        <button type="button" className="btn btn-sm btn-outline" onClick={() => apply(r.code)}>Use in cart</button>
                      </>
                    ) : (
                      <button type="button" className="btn btn-sm btn-primary" disabled={balance < r.points} onClick={() => setConfirm(r)}>
                        <Gift size={14} aria-hidden /> Convert
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="ofc-small ofc-muted">No coupon or reward is ever linked to voting, PVCs or polling units.</p>
        </Panel>
      </Grid>
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        title="Convert points?"
        text={confirm ? `Spend ${confirm.points.toLocaleString("en-NG")} Impact Points for “${confirm.label}”. Points can't be returned once converted.` : ""}
        confirmLabel="Convert points"
        onConfirm={() => {
          if (confirm && balance >= confirm.points) {
            const ns = spent + confirm.points;
            const nc = [...codes, confirm.code];
            setSpent(ns);
            setCodes(nc);
            writePref(key, String(ns));
            writePref(`${key}-codes`, JSON.stringify(nc));
            toast(`Converted — your code is ${confirm.code}`);
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- EC-9 Partner offers */
function makeCode(memberId: string, offerId: string) {
  let h = 0;
  for (const ch of memberId + offerId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `TBH-${offerId.replace("off-", "P")}-${h.toString(36).toUpperCase().slice(0, 6)}`;
}
function Qr({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString(code, { type: "svg", margin: 1, width: 120, color: { dark: "#1b1a16", light: "#ffffff" } }).then(setSvg).catch(() => setSvg(""));
  }, [code]);
  return svg ? <div style={{ width: 120 }} role="img" aria-label={`QR code for ${code}`} dangerouslySetInnerHTML={{ __html: svg }} /> : <QrCode size={48} aria-hidden />;
}
function Offers({ user }: { user: DemoUser }) {
  const toast = useToast();
  const storeKey = `tbh-offer-codes-${user.id}`;
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [area, setArea] = useState("All areas");
  useEffect(() => {
    try {
      setCodes(JSON.parse(readPref(storeKey) ?? "{}"));
    } catch {
      /* ignore */
    }
  }, [storeKey]);
  if (!shopPromotionsOpen()) return <Notice tone="warn" title="Partner offers are paused">Partner promotions stopped at the campaign cut-off.</Notice>;
  const areas = ["All areas", ...Array.from(new Set(partnerOffers.map((o) => o.area)))];
  const list = partnerOffers.filter((o) => area === "All areas" || o.area === area);
  return (
    <div className="ofc-stack">
      <div className="ofc-filters">
        <SelectField label="Area" value={area} onChange={(e) => setArea(e.target.value)} options={areas} hint={`Your state: ${user.state}`} />
      </div>
      <div className="ofc-cards">
        {list.map((o) => (
          <article key={o.id} className="ofc-card">
            <div className="ofc-card-head">
              <span className="ofc-card-title">{o.partner}</span>
              <Badge tone="info">{o.category}</Badge>
            </div>
            <p>{o.offer}</p>
            <div className="ofc-meta"><span><MapPin size={14} aria-hidden /> {o.area}</span><span>Valid until {shortDate(`${o.expires}T12:00:00+01:00`)}</span></div>
            {codes[o.id] ? (
              <div className="ofc-row">
                <Qr code={codes[o.id]} />
                <div className="ofc-stack" style={{ gap: "var(--s2)" }}>
                  <span className="ofc-small ofc-muted">Show this code in store</span>
                  <span className="ofc-mono ofc-strong">{codes[o.id]}</span>
                  <CopyButton value={codes[o.id]} />
                </div>
              </div>
            ) : (
              <div className="ofc-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const c = makeCode(user.id, o.id);
                    const next = { ...codes, [o.id]: c };
                    setCodes(next);
                    writePref(storeKey, JSON.stringify(next));
                    toast(`Your code for ${o.partner}: ${c}`);
                  }}
                >
                  <QrCode size={14} aria-hidden /> Get my code
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {!list.length && <EmptyState title="No offers in this area yet" />}
    </div>
  );
}

/* ---------------------------------------------------------------- EC-22 Returns */
const RETURN_REASONS = ["Wrong size", "Damaged or faulty item", "Wrong item sent"];
function Returns({ orders, refresh }: { orders: Order[]; refresh: () => void }) {
  const toast = useToast();
  const eligible = orders.filter((o) => canReturn(o));
  const returns = orders.filter((o) => o.state === "Return requested" || o.state === "Refunded" || o.history.some((h) => h.state === "Return requested"));
  const [no, setNo] = useState("");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  return (
    <div className="ofc-stack">
      <Notice title="Return rules">You can return items within 7 days of delivery if they are the wrong size, damaged or not what you ordered. Refunds go back to your original payment method within 5 working days of the item reaching us.</Notice>
      <Grid cols={2}>
        <Panel title="Start a return">
          {eligible.length === 0 ? (
            <EmptyState icon={<Undo2 size={28} aria-hidden />} title="No orders can be returned right now" text="Only orders delivered in the last 7 days can be returned." />
          ) : (
            <form
              className="form-grid"
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                const er: Record<string, string> = {};
                if (!no) er.no = "Choose the order.";
                if (!reason) er.reason = "Choose a reason.";
                if (reason === "Damaged or faulty item" && !photo) er.photo = "Add a photo of the damage.";
                setErr(er);
                if (Object.keys(er).length) return;
                setBusy(true);
                await simulate(500);
                const u = requestReturn(no, `${reason}${detail.trim() ? ` — ${detail.trim()}` : ""}`);
                setBusy(false);
                if (!u) return setErr({ no: "This order is no longer within the 7-day return window." });
                refresh();
                toast(`Return requested for ${no}`);
                setNo("");
                setReason("");
                setDetail("");
                setPhoto(null);
              }}
            >
              <SelectField label="Order" value={no} onChange={(e) => setNo(e.target.value)} placeholder="Choose…" options={eligible.map((o) => ({ value: o.number, label: `${o.number} · ${naira(o.total)}` }))} error={err.no} required />
              <SelectField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Choose…" options={RETURN_REASONS} error={err.reason} required />
              <TextArea label="Anything else? (optional)" value={detail} onChange={(e) => setDetail(e.target.value)} />
              <div className="ofc-dropzone">
                <label htmlFor="ret-photo" className="ofc-strong">Photo of the item {reason === "Damaged or faulty item" ? "(required)" : "(optional)"}</label>
                <input
                  id="ret-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => setPhoto(String(r.result));
                    r.readAsDataURL(f);
                  }}
                />
                {photo && <img src={photo} alt="Preview of the item you are returning" className="ofc-photo" />}
                {err.photo && <p className="ofc-small ofc-danger" role="alert">{err.photo}</p>}
                <span className="ofc-small ofc-muted">Stays on your device in this prototype.</span>
              </div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                <Undo2 size={16} aria-hidden /> {busy ? "Sending…" : "Request return"}
              </button>
            </form>
          )}
        </Panel>
        <Panel title="Your returns">
          {returns.length === 0 ? (
            <p className="ofc-muted">No returns yet.</p>
          ) : (
            <ul className="rows" role="list">
              {returns.map((o) => {
                const h = [...o.history].reverse().find((x) => x.state === "Return requested");
                return (
                  <li key={o.number}>
                    <div className="row-main">
                      <strong>{o.number}</strong>
                      <span className="ofc-small ofc-muted">{h?.note} · {h ? shortDateTime(h.at) : ""}</span>
                    </div>
                    <Badge tone={o.state === "Refunded" ? "ok" : "warn"}>{o.state === "Refunded" ? `Refunded ${naira(o.total)}` : "Awaiting collection"}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </Grid>
    </div>
  );
}

/* ---------------------------------------------------------------- EC-11 Delivery details */
type Address = { id: string; label: string; name: string; phone: string; state: string; lga: string; address: string; pickup: boolean; isDefault: boolean };
function Addresses({ user }: { user: DemoUser }) {
  const toast = useToast();
  const [list, setList] = usePersisted<Address[]>(`tbh-ofc-shopper-addresses-${user.id}`, [
    { id: "a1", label: "Home", name: `${user.firstName} ${user.lastName}`, phone: user.phone, state: user.state, lga: user.lga, address: user.street ?? "", pickup: false, isDefault: true },
  ]);
  const blank = { id: "", label: "", name: `${user.firstName} ${user.lastName}`, phone: user.phone, state: user.state, lga: "", address: "", pickup: false, isDefault: false };
  const [edit, setEdit] = useState<Address | null>(null);
  const [err, setErr] = useState<Record<string, string>>({});
  const [del, setDel] = useState<Address | null>(null);
  const zoneFor = (st: string) => (deliveryZones.find((z) => z.states.includes(st)) ?? deliveryZones[1]).label;
  const save = () => {
    if (!edit) return;
    const er: Record<string, string> = {};
    if (!edit.label.trim()) er.label = "Name this address, for example Home or Shop.";
    if (edit.name.trim().length < 3) er.name = "Enter the receiver's name.";
    if (!isNgPhone(edit.phone)) er.phone = "Enter a Nigerian mobile number.";
    if (!edit.state) er.state = "Choose a state.";
    if (edit.lga.trim().length < 2) er.lga = "Enter the LGA.";
    if (!edit.pickup && edit.address.trim().length < 6) er.address = "Enter the street address with a landmark.";
    setErr(er);
    if (Object.keys(er).length) return;
    setList((all) => {
      const id = edit.id || `a${Date.now()}`;
      let next = edit.id ? all.map((a) => (a.id === edit.id ? { ...edit } : a)) : [...all, { ...edit, id }];
      if (edit.isDefault || next.length === 1) next = next.map((a) => ({ ...a, isDefault: a.id === id }));
      return next;
    });
    toast("Delivery details saved");
    setEdit(null);
  };
  return (
    <div className="ofc-stack">
      <div className="ofc-row-between">
        <p className="ofc-muted ofc-small">Saved details fill in automatically at checkout. Delivery is free above ₦20,000.</p>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => { setEdit({ ...blank }); setErr({}); }}>
          <Plus size={14} aria-hidden /> Add address
        </button>
      </div>
      <div className="ofc-cards">
        {list.map((a) => (
          <article key={a.id} className="ofc-card" data-tone={a.isDefault ? "ok" : undefined}>
            <div className="ofc-card-head">
              <span className="ofc-card-title"><MapPin size={16} aria-hidden /> {a.label}</span>
              {a.isDefault && <Badge tone="ok">Default</Badge>}
            </div>
            <p className="ofc-small">
              {a.name} · {a.phone}
              <br />
              {a.pickup ? `Pickup at the ward-leader hub, ${a.lga}` : `${a.address || "(no street address yet)"}, ${a.lga}`}, {a.state}
            </p>
            <p className="ofc-small ofc-muted">Zone: {a.pickup ? "Free pickup at a ward-leader hub" : zoneFor(a.state)}</p>
            <div className="ofc-actions">
              <button type="button" className="btn btn-sm btn-outline" onClick={() => { setEdit({ ...a }); setErr({}); }}>Edit</button>
              {!a.isDefault && (
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setList((all) => all.map((x) => ({ ...x, isDefault: x.id === a.id }))); toast(`${a.label} is now your default`); }}>
                  <Star size={14} aria-hidden /> Make default
                </button>
              )}
              {list.length > 1 && (
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDel(a)} aria-label={`Delete ${a.label}`}>
                  <Trash2 size={14} aria-hidden /> Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <Dialog
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? `Edit ${edit.label}` : "Add an address"}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </>
        }
      >
        {edit && (
          <div className="form-grid">
            <TextField label="Label" value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} error={err.label} required />
            <div className="form-grid form-grid-2">
              <TextField label="Receiver's name" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} error={err.name} required />
              <TextField label="Phone" type="tel" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} error={err.phone} required />
              <SelectField label="State" value={edit.state} onChange={(e) => setEdit({ ...edit, state: e.target.value })} options={states.map((s) => s.name)} error={err.state} required />
              <TextField label="LGA" value={edit.lga} onChange={(e) => setEdit({ ...edit, lga: e.target.value })} error={err.lga} required />
            </div>
            <CheckField label="I'll collect from my ward-leader hub (free)" checked={edit.pickup} onChange={(e) => setEdit({ ...edit, pickup: e.target.checked })} />
            {!edit.pickup && <TextArea label="Street address and landmark" value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} error={err.address} required />}
            <CheckField label="Make this my default" checked={edit.isDefault} onChange={(e) => setEdit({ ...edit, isDefault: e.target.checked })} />
          </div>
        )}
      </Dialog>
      <ConfirmDialog
        open={!!del}
        onCancel={() => setDel(null)}
        danger
        title="Delete this address?"
        text={del ? `${del.label} will be removed from your saved delivery details.` : ""}
        confirmLabel="Delete"
        onConfirm={() => {
          if (del) {
            setList((all) => {
              const next = all.filter((x) => x.id !== del.id);
              return del.isDefault ? next.map((x, i) => ({ ...x, isDefault: i === 0 })) : next;
            });
            toast("Address deleted");
          }
          setDel(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- SH-11 Order support */
const ISSUES = ["Where is my order?", "Wrong or damaged item", "Payment or refund question", "Change delivery details", "Something else"];
function Support({ user, orders }: { user: DemoUser; orders: Order[] }) {
  const toast = useToast();
  const [mine, setMine] = usePersisted<{ id: string; order: string; issue: string; at: string; status: string }[]>(`tbh-ofc-shopper-tickets-${user.id}`, []);
  const [f, setF] = useState({ order: "", issue: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  return (
    <Grid cols={2}>
      <Panel title="Get help with an order">
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const er: Record<string, string> = {};
            if (!f.issue) er.issue = "Choose what you need help with.";
            if (f.message.trim().length < 10) er.message = "Tell us a little more (at least 10 characters).";
            if (/\b\d{16}\b|\bpin\b|\bcvv\b/i.test(f.message)) er.message = "Never share card numbers, PINs or CVVs — we will never ask for them.";
            setErr(er);
            if (Object.keys(er).length) return;
            setBusy(true);
            await simulate(600);
            // Prototype: the ticket also lands in the Call Centre queue on this device.
            let cc: Ticket[] = seedTickets;
            try {
              const raw = readPref("tbh-ofc-cc-tickets");
              if (raw) cc = JSON.parse(raw);
            } catch {
              /* keep seed */
            }
            const id = `TK-${4413 + cc.length}`;
            const t: Ticket = { id, subject: `${f.issue}${f.order ? ` — ${f.order}` : ""}: ${f.message.trim()}`, route: "Support", priority: f.issue === "Wrong or damaged item" ? "High" : "Normal", caller: `${user.firstName} (${user.phone})`, createdAt: new Date().toISOString(), status: "Open", slaHours: f.issue === "Wrong or damaged item" ? 24 : 48 };
            writePref("tbh-ofc-cc-tickets", JSON.stringify([t, ...cc]));
            setMine((all) => [{ id, order: f.order || "—", issue: f.issue, at: stamp(), status: "Open" }, ...all]);
            toast(`Ticket ${id} created — we reply within ${t.slaHours} hours`);
            setF({ order: "", issue: "", message: "" });
            setBusy(false);
          }}
        >
          <SelectField label="Order (optional)" value={f.order} onChange={(e) => setF({ ...f, order: e.target.value })} placeholder="Not about a specific order" options={orders.map((o) => o.number)} />
          <SelectField label="What do you need help with?" value={f.issue} onChange={(e) => setF({ ...f, issue: e.target.value })} placeholder="Choose…" options={ISSUES} error={err.issue} required />
          <TextArea label="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} error={err.message} required hint="Never include card numbers, PINs or passwords." />
          <button type="submit" className="btn btn-primary" disabled={busy}>
            <LifeBuoy size={16} aria-hidden /> {busy ? "Sending…" : "Send to support"}
          </button>
        </form>
      </Panel>
      <Panel title="Your support tickets">
        {mine.length === 0 ? (
          <EmptyState icon={<TicketIcon size={28} aria-hidden />} title="No tickets yet" text="You can also call the TBH One help line or use the chat on any page." />
        ) : (
          <ul className="rows" role="list">
            {mine.map((t) => (
              <li key={t.id}>
                <div className="row-main"><strong>{t.id} · {t.issue}</strong><span className="ofc-small ofc-muted">Order {t.order} · {t.at}</span></div>
                <Badge tone="info">{t.status}</Badge>
              </li>
            ))}
          </ul>
        )}
        <p className="ofc-small ofc-muted"><Package size={14} aria-hidden /> Track any order without signing in on the Track My Order page.</p>
      </Panel>
    </Grid>
  );
}

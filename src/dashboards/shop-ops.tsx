"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Ban, CheckCircle2, Download, Languages, PackageCheck, Pause, Play, Plus, Send, ShieldCheck, Truck, Undo2, XCircle } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { AuditList, Badge, BarChart, Grid, Kpis, naira, Panel, type Tone } from "@/components/dashboard/kit";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { CheckField, SelectField, TextArea, TextField } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import type { Order } from "@/lib/orders";
import { campaignDates } from "@/config/site";
import { categories, coupons as seedCoupons, dispatchHeld, ORDER_STATES, partnerOffers, products as catalogue, shopPromotionsOpen, VENDORS, type Coupon, type Product, type ProductCategory } from "@/data/shop";
import { shopFraud, vendorPerformance } from "@/data/mock/backoffice";
import { downloadCsv, mentionsElectoral, shortDate, shortDateTime, useAudit, usePersisted } from "./office/common";
import { isDemoOrder, itemsIn, setOrderState, useAllOrders } from "./office/orders";

type AddAudit = (who: string, what: string) => void;
const LANGS = [
  { key: "en", label: "English" },
  { key: "pcm", label: "Pidgin" },
  { key: "yo", label: "Yorùbá" },
  { key: "ha", label: "Hausa" },
  { key: "ig", label: "Igbo" },
] as const;
type LangKey = (typeof LANGS)[number]["key"];
type ManagedProduct = Pick<Product, "slug" | "name" | "category" | "price" | "stock" | "vendor"> & {
  lowStockAt: number;
  listed: boolean;
  design: "Approved" | "Awaiting approval" | "Rejected";
  translations: Partial<Record<LangKey, string>>;
};
const seedProducts: ManagedProduct[] = catalogue.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  price: p.price,
  stock: p.stock,
  vendor: p.vendor,
  lowStockAt: p.lowStockAt ?? 50,
  listed: true,
  design: "Approved",
  translations: { en: p.name },
}));
const PRE_PACK = ["Paid", "Sent to vendor"];
const nairaM = (n: number) => (n >= 1e6 ? `₦${(n / 1e6).toFixed(2)}m` : naira(n));

export default function ShopOpsDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="shop-ops" section={section}>
      {(user) => <ShopOps section={section} user={user} />}
    </DashboardShell>
  );
}

function ShopOps({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const { orders, ready } = useAllOrders();
  const [audit, addAudit] = useAudit("tbh-ofc-shop-audit");
  const [prods, setProds] = usePersisted<ManagedProduct[]>("tbh-ofc-shop-products", seedProducts);
  if (!ready) return null;
  switch (section) {
    case "orders":
      return <OrdersBoard orders={orders} me={me} addAudit={addAudit} />;
    case "products":
      return <Products prods={prods} setProds={setProds} me={me} addAudit={addAudit} />;
    case "coupons":
      return <Coupons me={me} audit={audit} addAudit={addAudit} />;
    case "returns":
      return <Returns orders={orders} me={me} addAudit={addAudit} />;
    case "vendors":
      return <Vendors orders={orders} />;
    case "fraud":
      return <Fraud orders={orders} me={me} addAudit={addAudit} />;
    default:
      return <Overview orders={orders} prods={prods} />;
  }
}

const stateTone = (s: Order["state"]): Tone => (s === "Delivered" ? "ok" : s === "Cancelled" || s === "Refunded" ? "muted" : s === "Return requested" ? "warn" : "info");

/* ---------------------------------------------------------------- EC-ADM-1 Sales overview */
function Overview({ orders, prods }: { orders: Order[]; prods: ManagedProduct[] }) {
  const live = orders.filter((o) => o.state !== "Cancelled" && o.state !== "Refunded");
  const revenue = live.reduce((n, o) => n + o.total, 0);
  const byProduct = new Map<string, number>();
  live.forEach((o) => o.lines.forEach((l) => byProduct.set(l.name, (byProduct.get(l.name) ?? 0) + l.qty)));
  const byState = new Map<string, number>();
  live.forEach((o) => byState.set(o.delivery.state, (byState.get(o.delivery.state) ?? 0) + o.total));
  const low = prods.filter((p) => p.stock <= p.lowStockAt);
  const awaiting = orders.filter((o) => PRE_PACK.includes(o.state)).length;
  return (
    <div className="ofc-stack">
      {dispatchHeld() && <Notice tone="warn" title="Dispatch paused">Orders placed after the campaign cut-off dispatch from 17 January 2027.</Notice>}
      <Kpis
        items={[
          { label: "Revenue (incl. VAT)", value: nairaM(revenue), sub: `${naira(revenue)} · ${live.length} paid orders` },
          { label: "Average order", value: naira(revenue / Math.max(1, live.length)) },
          { label: "Units sold", value: live.reduce((n, o) => n + itemsIn(o), 0).toLocaleString("en-NG") },
          { label: "Awaiting packing", value: awaiting, tone: awaiting > 5 ? "warn" : undefined },
        ]}
      />
      {low.length > 0 && (
        <div className="banner-critical" role="alert" style={{ background: "var(--warn)" }}>
          <AlertTriangle size={20} aria-hidden /> Low stock: {low.map((p) => `${p.name} (${p.stock} left)`).join(", ")}
        </div>
      )}
      <Grid cols={2}>
        <Panel title="Units sold by product">
          {byProduct.size ? <BarChart label="Units sold by product" data={[...byProduct].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }))} /> : <p className="ofc-muted">No sales yet.</p>}
        </Panel>
        <Panel title="Revenue by state">
          {byState.size ? <BarChart label="Revenue by delivery state" format={naira} data={[...byState].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }))} /> : <p className="ofc-muted">No sales yet.</p>}
        </Panel>
      </Grid>
      <Panel title="Orders by status">
        <BarChart label="Orders by status" data={[...ORDER_STATES, "Return requested", "Cancelled", "Refunded"].map((s) => ({ label: s, value: orders.filter((o) => o.state === s).length }))} />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- EC-17 / EC-18 Orders & fulfilment */
const NEXT_ACTION: Record<string, { to: Order["state"]; label: string; icon: typeof Send }> = {
  Paid: { to: "Sent to vendor", label: "Send to vendor", icon: Send },
  "Sent to vendor": { to: "Packed", label: "Mark packed", icon: PackageCheck },
  Packed: { to: "Dispatched", label: "Hand to courier", icon: Truck },
};
function OrdersBoard({ orders, me, addAudit }: { orders: Order[]; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const [cancel, setCancel] = useState<Order | null>(null);
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState("");
  const held = dispatchHeld();
  const shown = orders.filter((o) => !q.trim() || `${o.number} ${o.buyer.name} ${o.delivery.state}`.toLowerCase().includes(q.trim().toLowerCase()));
  const cols: { title: string; states: Order["state"][] }[] = [...ORDER_STATES.map((s) => ({ title: s, states: [s] as Order["state"][] })), { title: "Exceptions", states: ["Cancelled", "Return requested", "Refunded"] }];
  const advance = (o: Order) => {
    const a = NEXT_ACTION[o.state];
    if (!a) return;
    if (a.to === "Dispatched" && held) return toast("Dispatch is paused until 17 January 2027");
    setOrderState(o, a.to, `${a.label} — ${me}`, a.to === "Dispatched" ? { courier: "Courier partner (demo)", tracking: `TRK${o.number.slice(-6)}NG` } : {});
    addAudit(me, `${o.number}: ${o.state} → ${a.to}`);
    toast(`${o.number} → ${a.to}`);
  };
  return (
    <div className="ofc-stack">
      <div className="ofc-row-between">
        <div className="ofc-filters" style={{ flex: "1 1 260px" }}>
          <TextField label="Find an order" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order number, name or state" />
        </div>
        <p className="ofc-small ofc-muted" style={{ flex: "1 1 260px" }}>Orders can be cancelled only before they are packed. Couriers confirm “Out for delivery” and “Delivered”.</p>
      </div>
      {held && <Notice tone="warn" title="Dispatch paused">Campaign cut-off rule: hand-over to couriers resumes on 17 January 2027.</Notice>}
      <div className="ofc-board">
        {cols.map((c) => {
          const list = shown.filter((o) => c.states.includes(o.state));
          return (
            <section key={c.title} className="ofc-col" aria-label={`${c.title} orders`}>
              <div className="ofc-col-head"><span>{c.title}</span><Badge>{list.length}</Badge></div>
              {list.length === 0 && <p className="ofc-small ofc-muted">None</p>}
              {list.map((o) => {
                const a = NEXT_ACTION[o.state];
                return (
                  <article key={o.number} className="ofc-card" data-tone={o.state === "Return requested" ? "warn" : o.state === "Cancelled" ? "muted" : undefined}>
                    <button type="button" className="linklike ofc-card-title" onClick={() => setDetail(o)}>{o.number}</button>
                    <div className="ofc-meta">
                      <span>{o.buyer.name}</span>
                      <span>{o.delivery.state}</span>
                      <span>{itemsIn(o)} items · {naira(o.total)}</span>
                      {o.delivery.method === "pickup" && <span>Hub pickup</span>}
                    </div>
                    {c.title === "Exceptions" && <Badge tone={stateTone(o.state)}>{o.state}</Badge>}
                    <div className="ofc-actions">
                      {a && (
                        <button type="button" className="btn btn-sm btn-primary" disabled={a.to === "Dispatched" && held} onClick={() => advance(o)}>
                          <a.icon size={14} aria-hidden /> {a.label}
                        </button>
                      )}
                      {PRE_PACK.includes(o.state) && (
                        <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setCancel(o); setReason(""); setReasonErr(""); }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
      <Dialog open={!!detail} onClose={() => setDetail(null)} title={detail ? `Order ${detail.number}` : "Order"} size="lg">
        {detail && (
          <div className="ofc-stack">
            <div className="ofc-row">
              <Badge tone={stateTone(detail.state)}>{detail.state}</Badge>
              {isDemoOrder(detail) && <Badge>Demo order</Badge>}
              <span className="ofc-small ofc-muted">Placed {shortDateTime(detail.createdAt)} · {detail.payment.method.toUpperCase()} · {detail.payment.reference}</span>
            </div>
            <dl className="facts facts-2">
              <div><dt>Buyer</dt><dd>{detail.buyer.name} · {detail.buyer.phone}</dd></div>
              <div><dt>Delivery</dt><dd>{detail.delivery.method === "pickup" ? detail.delivery.pickupPoint : `${detail.delivery.address}, ${detail.delivery.lga}, ${detail.delivery.state}`}</dd></div>
              <div><dt>Items</dt><dd>{detail.lines.map((l) => `${l.qty} × ${l.name}${l.size ? ` (${l.size})` : ""}`).join("; ")}</dd></div>
              <div><dt>Total</dt><dd>{naira(detail.total)} (VAT {naira(detail.vat)})</dd></div>
            </dl>
            <ol className="ofc-timeline" aria-label="Order history">
              {detail.history.map((h, i) => (
                <li key={i} className={i === detail.history.length - 1 ? "done current" : "done"}>
                  {h.state} · <span className="ofc-muted">{shortDateTime(h.at)}{h.note ? ` · ${h.note}` : ""}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Dialog>
      <ConfirmDialog
        open={!!cancel}
        onCancel={() => setCancel(null)}
        danger
        title="Cancel this order?"
        confirmLabel="Cancel and refund"
        onConfirm={() => {
          if (!cancel) return;
          if (!PRE_PACK.includes(cancel.state)) {
            setCancel(null);
            return toast("This order is already packed and can no longer be cancelled");
          }
          if (reason.trim().length < 5) return setReasonErr("Give a reason (at least 5 characters).");
          setOrderState(cancel, "Cancelled", `Cancelled by Shop Ops: ${reason.trim()}`, { payment: { ...cancel.payment, status: "Refunded" } });
          addAudit(me, `cancelled ${cancel.number} — ${reason.trim()}`);
          toast(`${cancel.number} cancelled and refunded`);
          setCancel(null);
        }}
        text={
          cancel && (
            <div className="form-grid">
              <p>{cancel.number} ({naira(cancel.total)}) will be refunded in full to the customer and they'll get an SMS.</p>
              <TextArea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} error={reasonErr} required />
            </div>
          )
        }
      />
    </div>
  );
}

/* ---------------------------------------------------------------- EC-ADM-2 Products */
function Products({ prods, setProds, me, addAudit }: { prods: ManagedProduct[]; setProds: (fn: (p: ManagedProduct[]) => ManagedProduct[]) => void; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [edit, setEdit] = useState<ManagedProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [approve, setApprove] = useState<{ p: ManagedProduct; ok: boolean } | null>(null);
  const [cat, setCat] = useState("All");
  const rows = prods.filter((p) => cat === "All" || p.category === cat);
  const save = () => {
    if (!edit) return;
    const er: Record<string, string> = {};
    if (edit.name.trim().length < 3) er.name = "Enter the product name.";
    if (!edit.price || edit.price < 100) er.price = "Enter a price of at least ₦100.";
    if (edit.stock < 0) er.stock = "Stock can't be negative.";
    if (mentionsElectoral(`${edit.name} ${Object.values(edit.translations).join(" ")}`)) er.name = "Product text may not mention votes, PVCs or polling.";
    if (isNew && prods.some((p) => p.slug === edit.slug)) er.name = "A product with this name already exists.";
    setErr(er);
    if (Object.keys(er).length) return;
    const p = { ...edit, translations: { ...edit.translations, en: edit.name.trim() } };
    setProds((all) => (isNew ? [...all, p] : all.map((x) => (x.slug === p.slug ? p : x))));
    addAudit(me, isNew ? `added product “${p.name}” (awaiting design approval)` : `edited product “${p.name}”`);
    toast(isNew ? "Product added — it lists once the design is approved" : "Product saved");
    setEdit(null);
  };
  const columns: Column<ManagedProduct>[] = [
    { key: "name", header: "Product", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "price", header: "Price", sortable: true, align: "right", value: (p) => p.price, render: (p) => naira(p.price) },
    { key: "stock", header: "Stock", sortable: true, align: "right", value: (p) => p.stock, render: (p) => <span className={p.stock <= p.lowStockAt ? "ofc-warn ofc-strong" : ""}>{p.stock.toLocaleString("en-NG")}</span> },
    { key: "translations", header: "Languages", value: (p) => LANGS.filter((l) => p.translations[l.key]).length, render: (p) => `${LANGS.filter((l) => p.translations[l.key]?.trim()).length} of 5` },
    { key: "design", header: "Design", sortable: true, render: (p) => <Badge tone={p.design === "Approved" ? "ok" : p.design === "Rejected" ? "danger" : "warn"}>{p.design}</Badge> },
    { key: "listed", header: "In shop", value: (p) => (p.listed ? "Listed" : "Hidden"), render: (p) => <Badge tone={p.listed ? "ok" : "muted"}>{p.listed ? "Listed" : "Hidden"}</Badge> },
  ];
  return (
    <div className="ofc-stack">
      <Notice title="Design approval">Only designs approved by the Brand lead can be listed (EC-28). New products stay hidden until approved.</Notice>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(p) => p.slug}
        caption="Products"
        searchPlaceholder="Search products"
        filters={
          <div className="ofc-row">
            <SelectField label="Category" value={cat} onChange={(e) => setCat(e.target.value)} options={["All", ...categories]} />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsNew(true);
                setErr({});
                setEdit({ slug: "", name: "", category: "T-shirts", price: 0, stock: 0, vendor: VENDORS[0], lowStockAt: 50, listed: false, design: "Awaiting approval", translations: {} });
              }}
            >
              <Plus size={14} aria-hidden /> Add product
            </button>
          </div>
        }
        actions={(p) => (
          <span className="ofc-actions">
            <button type="button" className="btn btn-sm btn-outline" onClick={() => { setIsNew(false); setErr({}); setEdit({ ...p, translations: { ...p.translations } }); }}>
              <Languages size={14} aria-hidden /> Edit
            </button>
            {p.design === "Awaiting approval" && (
              <>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => setApprove({ p, ok: true })}><ShieldCheck size={14} aria-hidden /> Approve design</button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setApprove({ p, ok: false })}>Reject</button>
              </>
            )}
            {p.design === "Approved" && (
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setProds((all) => all.map((x) => (x.slug === p.slug ? { ...x, listed: !x.listed } : x)));
                  addAudit(me, `${p.listed ? "hid" : "listed"} “${p.name}”`);
                  toast(p.listed ? "Hidden from the shop" : "Listed in the shop");
                }}
              >
                {p.listed ? "Hide" : "List"}
              </button>
            )}
          </span>
        )}
      />
      <Dialog
        open={!!edit}
        onClose={() => setEdit(null)}
        size="lg"
        title={isNew ? "Add a product" : `Edit ${edit?.name ?? ""}`}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </>
        }
      >
        {edit && (
          <div className="form-grid">
            <TextField
              label="Product name (English)"
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value, slug: isNew ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : edit.slug })}
              error={err.name}
              required
            />
            <div className="form-grid form-grid-2">
              <SelectField label="Category" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as ProductCategory })} options={categories} />
              <SelectField label="Vendor" value={edit.vendor} onChange={(e) => setEdit({ ...edit, vendor: e.target.value })} options={VENDORS} />
              <TextField label="Public price (₦, incl. VAT)" inputMode="numeric" value={edit.price ? String(edit.price) : ""} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value.replace(/\D/g, "")) })} error={err.price} required hint={edit.price ? `Member price ${naira(edit.price * 0.9)}` : undefined} />
              <TextField label="Stock" inputMode="numeric" value={String(edit.stock)} onChange={(e) => setEdit({ ...edit, stock: Number(e.target.value.replace(/\D/g, "")) })} error={err.stock} />
              <TextField label="Low-stock alert at" inputMode="numeric" value={String(edit.lowStockAt)} onChange={(e) => setEdit({ ...edit, lowStockAt: Number(e.target.value.replace(/\D/g, "")) })} />
            </div>
            <fieldset className="form-grid">
              <legend className="ofc-strong">Translations</legend>
              <p className="ofc-small ofc-muted">Translations go live only after a vetted translator reviews them. Leave blank to show English.</p>
              <div className="ofc-trans">
                {LANGS.filter((l) => l.key !== "en").map((l) => (
                  <TextField
                    key={l.key}
                    label={l.label}
                    value={edit.translations[l.key] ?? ""}
                    onChange={(e) => setEdit({ ...edit, translations: { ...edit.translations, [l.key]: e.target.value } })}
                    hint={edit.translations[l.key]?.trim() ? "Pending translator review" : "Not translated yet"}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </Dialog>
      <ConfirmDialog
        open={!!approve}
        onCancel={() => setApprove(null)}
        danger={approve ? !approve.ok : false}
        title={approve?.ok ? "Approve this design?" : "Reject this design?"}
        text={approve ? (approve.ok ? `“${approve.p.name}” will be listed in the shop straight away.` : `“${approve.p.name}” stays hidden and goes back to the designer.`) : ""}
        confirmLabel={approve?.ok ? "Approve and list" : "Reject"}
        onConfirm={() => {
          if (approve) {
            setProds((all) => all.map((x) => (x.slug === approve.p.slug ? { ...x, design: approve.ok ? "Approved" : "Rejected", listed: approve.ok } : x)));
            addAudit(me, `${approve.ok ? "approved" : "rejected"} design for “${approve.p.name}”`);
            toast(approve.ok ? "Design approved — product listed" : "Design rejected");
          }
          setApprove(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- EC-ADM-3 Coupons & offers */
type ManagedCoupon = Coupon & { active: boolean; uses: number };
function Coupons({ me, audit, addAudit }: { me: string; audit: { at: string; who: string; what: string }[]; addAudit: AddAudit }) {
  const toast = useToast();
  const [list, setList] = usePersisted<ManagedCoupon[]>("tbh-ofc-shop-coupons", seedCoupons.map((c, i) => ({ ...c, active: true, uses: [412, 1290, 233, 118][i] ?? 0 })));
  const [paused, setPaused] = usePersisted<string[]>("tbh-ofc-shop-offers-paused", []);
  const [f, setF] = useState({ code: "", label: "", type: "percent" as Coupon["type"], value: "", membersOnly: true, minOrder: "", expires: "", scope: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const open = shopPromotionsOpen();
  const cutoffDay = "2027-01-14";
  return (
    <div className="ofc-stack">
      {!open && <Notice tone="warn" title="Promotions stopped">The campaign cut-off has passed. Coupons and partner offers are switched off automatically.</Notice>}
      <Notice title="Rules (EC-10)">No coupon, offer or targeting rule may reference voting, PVCs, polling units or any electoral data. Every change is logged.</Notice>
      <Grid cols={2}>
        <Panel title="Create a coupon">
          <form
            className="form-grid"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const er: Record<string, string> = {};
              const code = f.code.trim().toUpperCase();
              if (!/^[A-Z0-9]{4,16}$/.test(code)) er.code = "4–16 letters or numbers, no spaces.";
              else if (list.some((c) => c.code === code)) er.code = "This code already exists.";
              if (f.label.trim().length < 6) er.label = "Describe the coupon for members.";
              const v = Number(f.value);
              if (f.type === "percent" && (!v || v > 30)) er.value = "Percentage between 1 and 30.";
              if (f.type === "fixed" && (!v || v > 5000)) er.value = "Amount between ₦1 and ₦5,000.";
              if (!f.expires) er.expires = "Choose an expiry date.";
              else if (f.expires > cutoffDay) er.expires = "Coupons must expire by the campaign cut-off (14 January 2027).";
              const all = `${code} ${f.label} ${f.scope}`;
              if (mentionsElectoral(all)) er.label = "Coupons can't mention voting, PVCs, polling units or elections. This is blocked by policy (EC-10).";
              setErr(er);
              if (Object.keys(er).length) return;
              const c: ManagedCoupon = { code, label: f.label.trim(), type: f.type, value: f.type === "free-delivery" ? 0 : v, membersOnly: f.membersOnly, minOrder: f.minOrder ? Number(f.minOrder) : undefined, expires: f.expires, scope: f.scope.trim() || undefined, active: true, uses: 0 };
              setList((l) => [c, ...l]);
              addAudit(me, `created coupon ${code}`);
              toast(`Coupon ${code} created`);
              setF({ code: "", label: "", type: "percent", value: "", membersOnly: true, minOrder: "", expires: "", scope: "" });
            }}
          >
            <div className="form-grid form-grid-2">
              <TextField label="Code" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} error={err.code} required disabled={!open} />
              <SelectField label="Type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as Coupon["type"] })} options={[{ value: "percent", label: "Percent off" }, { value: "fixed", label: "Naira off" }, { value: "free-delivery", label: "Free delivery" }]} disabled={!open} />
            </div>
            <TextField label="Description shown to members" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} error={err.label} required disabled={!open} />
            <div className="form-grid form-grid-2">
              {f.type !== "free-delivery" && <TextField label={f.type === "percent" ? "Percent" : "Amount (₦)"} inputMode="numeric" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value.replace(/\D/g, "") })} error={err.value} required disabled={!open} />}
              <TextField label="Minimum order (₦, optional)" inputMode="numeric" value={f.minOrder} onChange={(e) => setF({ ...f, minOrder: e.target.value.replace(/\D/g, "") })} disabled={!open} />
              <TextField label="Expires" type="date" max={cutoffDay} value={f.expires} onChange={(e) => setF({ ...f, expires: e.target.value })} error={err.expires} required disabled={!open} />
              <TextField label="Applies to (optional)" value={f.scope} onChange={(e) => setF({ ...f, scope: e.target.value })} placeholder="e.g. Caps, Wristbands" disabled={!open} />
            </div>
            <CheckField label="Members only" checked={f.membersOnly} onChange={(e) => setF({ ...f, membersOnly: e.target.checked })} disabled={!open} />
            <button type="submit" className="btn btn-primary" disabled={!open}>
              <Plus size={16} aria-hidden /> Create coupon
            </button>
          </form>
        </Panel>
        <Panel title="Coupons">
          <ul className="rows" role="list">
            {list.map((c) => (
              <li key={c.code}>
                <div className="row-main">
                  <span className="ofc-mono ofc-strong">{c.code}</span>
                  <span className="ofc-small ofc-muted">{c.label} · {c.uses.toLocaleString("en-NG")} uses · expires {shortDate(`${c.expires}T12:00:00+01:00`)}</span>
                </div>
                <span className="row-actions">
                  <Badge tone={c.active && open ? "ok" : "muted"}>{c.active && open ? "Active" : "Off"}</Badge>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    disabled={!open}
                    onClick={() => {
                      setList((l) => l.map((x) => (x.code === c.code ? { ...x, active: !x.active } : x)));
                      addAudit(me, `${c.active ? "paused" : "resumed"} coupon ${c.code}`);
                    }}
                    aria-label={`${c.active ? "Pause" : "Resume"} ${c.code}`}
                  >
                    {c.active ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Partner offers">
          <ul className="rows" role="list">
            {partnerOffers.map((o) => {
              const off = paused.includes(o.id) || !open;
              return (
                <li key={o.id}>
                  <div className="row-main"><strong>{o.partner}</strong><span className="ofc-small ofc-muted">{o.offer} · {o.area}</span></div>
                  <span className="row-actions">
                    <Badge tone={off ? "muted" : "ok"}>{off ? "Paused" : "Live"}</Badge>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      disabled={!open}
                      onClick={() => {
                        setPaused((p) => (p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id]));
                        addAudit(me, `${paused.includes(o.id) ? "resumed" : "paused"} partner offer ${o.partner}`);
                      }}
                    >
                      {paused.includes(o.id) ? "Resume" : "Pause"}
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel title="Change log">{audit.length ? <AuditList items={audit.slice(0, 12)} /> : <p className="ofc-muted">No changes yet.</p>}</Panel>
      </Grid>
    </div>
  );
}

/* ---------------------------------------------------------------- EC-22 Returns & refunds */
function Returns({ orders, me, addAudit }: { orders: Order[]; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [act, setAct] = useState<{ o: Order; ok: boolean } | null>(null);
  const [note, setNote] = useState("");
  const [noteErr, setNoteErr] = useState("");
  const pending = orders.filter((o) => o.state === "Return requested");
  const done = orders.filter((o) => o.state === "Refunded" || (o.state === "Delivered" && o.history.some((h) => h.state === "Return requested")));
  return (
    <div className="ofc-stack">
      <Kpis items={[{ label: "Returns to review", value: pending.length, tone: pending.length ? "warn" : "ok" }, { label: "Refunded", value: orders.filter((o) => o.state === "Refunded").length }, { label: "Refund value", value: naira(orders.filter((o) => o.state === "Refunded").reduce((n, o) => n + o.total, 0)) }]} />
      <Panel title="Return requests">
        {pending.length === 0 ? (
          <EmptyState icon={<Undo2 size={28} aria-hidden />} title="No returns waiting" text="Customers can request a return within 7 days of delivery for wrong size, damage or wrong item." />
        ) : (
          <div className="ofc-cards">
            {pending.map((o) => {
              const h = [...o.history].reverse().find((x) => x.state === "Return requested");
              return (
                <article key={o.number} className="ofc-card" data-tone="warn">
                  <div className="ofc-card-head"><span className="ofc-card-title">{o.number} · {o.buyer.name}</span><Badge tone="warn">Return requested</Badge></div>
                  <p className="ofc-small">Reason: {h?.note ?? "—"}</p>
                  <div className="ofc-meta"><span>{h ? shortDateTime(h.at) : ""}</span><span>{o.lines.map((l) => `${l.qty} × ${l.name}`).join("; ")}</span><span>{naira(o.total)}</span></div>
                  <div className="ofc-actions">
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => { setAct({ o, ok: true }); setNote(""); setNoteErr(""); }}><CheckCircle2 size={14} aria-hidden /> Approve refund</button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setAct({ o, ok: false }); setNote(""); setNoteErr(""); }}><XCircle size={14} aria-hidden /> Decline</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>
      {done.length > 0 && (
        <Panel title="Decided">
          <ul className="rows" role="list">
            {done.map((o) => (
              <li key={o.number}>
                <div className="row-main"><strong>{o.number}</strong><span className="ofc-small ofc-muted">{o.history[o.history.length - 1].note}</span></div>
                <Badge tone={o.state === "Refunded" ? "ok" : "muted"}>{o.state === "Refunded" ? `Refunded ${naira(o.total)}` : "Declined"}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <ConfirmDialog
        open={!!act}
        onCancel={() => setAct(null)}
        danger={act ? !act.ok : false}
        title={act?.ok ? "Approve the refund?" : "Decline the return?"}
        confirmLabel={act?.ok ? "Approve refund" : "Decline"}
        onConfirm={() => {
          if (!act) return;
          if (!act.ok && note.trim().length < 5) return setNoteErr("Explain why to the customer (at least 5 characters).");
          if (act.ok) {
            setOrderState(act.o, "Refunded", `Refund approved by ${me}${note.trim() ? `: ${note.trim()}` : ""}`, { payment: { ...act.o.payment, status: "Refunded" } });
            addAudit(me, `approved refund on ${act.o.number}`);
            toast(`Refund of ${naira(act.o.total)} approved — Finance releases it`);
          } else {
            setOrderState(act.o, "Delivered", `Return declined: ${note.trim()}`);
            addAudit(me, `declined return on ${act.o.number}`);
            toast("Return declined — the customer is told why");
          }
          setAct(null);
        }}
        text={
          act && (
            <div className="form-grid">
              <p>{act.ok ? `${naira(act.o.total)} goes back to the customer's ${act.o.payment.method} payment within 5 working days, once the item is collected.` : "The customer keeps the item and gets your reason by SMS."}</p>
              <TextArea label={act.ok ? "Note (optional)" : "Reason"} value={note} onChange={(e) => setNote(e.target.value)} error={noteErr} required={!act.ok} />
            </div>
          )
        }
      />
    </div>
  );
}

/* ---------------------------------------------------------------- EC-18 / EC-24 Vendors & profit share */
function Vendors({ orders }: { orders: Order[] }) {
  const [vendorShare, setVendorShare] = useState(60);
  const live = useMemo(() => {
    const m = new Map<string, number>();
    orders.filter((o) => PRE_PACK.includes(o.state) || o.state === "Packed").forEach((o) => o.lines.forEach((l) => {
      const v = catalogue.find((p) => p.slug === l.slug)?.vendor ?? "Unassigned";
      m.set(v, (m.get(v) ?? 0) + l.qty);
    }));
    return m;
  }, [orders]);
  const rows = vendorPerformance.map((v) => {
    const margin = v.revenue * v.margin;
    return { ...v, marginNaira: margin, vendorCut: margin * (vendorShare / 100), campaignCut: margin * (1 - vendorShare / 100), queue: live.get(v.vendor) ?? 0 };
  });
  return (
    <div className="ofc-stack">
      <Panel title="Vendor performance">
        <div className="ofc-scroll">
          <table className="ofc-table">
            <caption className="sr-only">Vendor performance and profit share</caption>
            <thead>
              <tr><th scope="col">Vendor</th><th scope="col" className="num">Orders</th><th scope="col" className="num">On time</th><th scope="col" className="num">Returns</th><th scope="col" className="num">In queue (units)</th><th scope="col" className="num">Revenue</th></tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.vendor}>
                  <th scope="row">{v.vendor}</th>
                  <td className="num">{v.orders}</td>
                  <td className={`num ${v.onTime < 0.9 ? "ofc-danger ofc-strong" : ""}`}>{Math.round(v.onTime * 100)}%</td>
                  <td className={`num ${v.returns > 0.025 ? "ofc-warn ofc-strong" : ""}`}>{(v.returns * 100).toFixed(1)}%</td>
                  <td className="num">{v.queue}</td>
                  <td className="num">{naira(v.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ofc-small ofc-muted">Red: on-time below 90% (review the vendor). Amber: returns above 2.5%.</p>
      </Panel>
      <Panel
        title="Profit share"
        action={
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => downloadCsv("tbh-one-vendor-profit-share.csv", [["Vendor", "Revenue (NGN)", "Margin (NGN)", `Vendor share ${vendorShare}%`, `Campaign share ${100 - vendorShare}%`], ...rows.map((r) => [r.vendor, r.revenue, Math.round(r.marginNaira), Math.round(r.vendorCut), Math.round(r.campaignCut)])])}
          >
            <Download size={14} aria-hidden /> Download CSV
          </button>
        }
      >
        <div className="ofc-filters">
          <TextField label="Vendor share of margin (%)" type="number" min={0} max={100} value={String(vendorShare)} onChange={(e) => setVendorShare(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} hint="Demo split — the agreed split is set in each vendor contract." />
        </div>
        <div className="ofc-scroll">
          <table className="ofc-table">
            <caption className="sr-only">Profit share by vendor</caption>
            <thead><tr><th scope="col">Vendor</th><th scope="col" className="num">Margin</th><th scope="col" className="num">Vendor</th><th scope="col" className="num">Campaign</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.vendor}><th scope="row">{r.vendor}</th><td className="num">{naira(r.marginNaira)}</td><td className="num">{naira(r.vendorCut)}</td><td className="num">{naira(r.campaignCut)}</td></tr>)}</tbody>
            <tfoot><tr><td>Total</td><td className="num">{naira(rows.reduce((n, r) => n + r.marginNaira, 0))}</td><td className="num">{naira(rows.reduce((n, r) => n + r.vendorCut, 0))}</td><td className="num">{naira(rows.reduce((n, r) => n + r.campaignCut, 0))}</td></tr></tfoot>
          </table>
        </div>
        <p className="ofc-small ofc-muted">The campaign share is published as income on the transparency page.</p>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- EC-ADM-4 Fraud alerts */
type FraudItem = (typeof shopFraud)[number] & { status: "Open" | "Order held" | "Coupon blocked" | "Dismissed"; note?: string };
function Fraud({ orders, me, addAudit }: { orders: Order[]; me: string; addAudit: AddAudit }) {
  const toast = useToast();
  const [items, setItems] = usePersisted<FraudItem[]>("tbh-ofc-shop-fraud", shopFraud.map((f) => ({ ...f, status: "Open" })));
  const [act, setAct] = useState<{ f: FraudItem; kind: FraudItem["status"] } | null>(null);
  const big = orders.filter((o) => o.total >= 300_000 && !o.buyer.userId && PRE_PACK.includes(o.state));
  const label: Record<string, string> = { "Order held": "Hold related orders", "Coupon blocked": "Block coupon", Dismissed: "Dismiss" };
  return (
    <div className="ofc-stack">
      <Kpis items={[{ label: "Open alerts", value: items.filter((i) => i.status === "Open").length, tone: items.some((i) => i.status === "Open") ? "warn" : "ok" }, { label: "Large guest orders awaiting packing", value: big.length }]} />
      <div className="ofc-cards">
        {items.map((f) => (
          <article key={f.id} className="ofc-card" data-tone={f.status === "Open" ? "danger" : "muted"}>
            <div className="ofc-card-head"><span className="ofc-card-title">{f.id} · {f.kind}</span><Badge tone={f.status === "Open" ? "danger" : "muted"}>{f.status}</Badge></div>
            <p className="ofc-small">{f.detail}</p>
            <div className="ofc-meta"><span>{shortDateTime(f.at)}</span></div>
            {f.status === "Open" && (
              <div className="ofc-actions">
                <button type="button" className="btn btn-sm btn-primary" onClick={() => setAct({ f, kind: "Order held" })}><Ban size={14} aria-hidden /> Hold orders</button>
                {f.kind.includes("coupon") && <button type="button" className="btn btn-sm btn-outline" onClick={() => setAct({ f, kind: "Coupon blocked" })}>Block coupon</button>}
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setAct({ f, kind: "Dismissed" })}>Dismiss</button>
              </div>
            )}
          </article>
        ))}
      </div>
      {big.length > 0 && (
        <Panel title="Large guest orders (auto-flag ≥ ₦300,000)">
          <ul className="rows" role="list">
            {big.map((o) => <li key={o.number}><div className="row-main"><strong>{o.number}</strong><span className="ofc-small ofc-muted">{o.buyer.name} · {o.delivery.state} · {naira(o.total)}</span></div><Badge tone="warn">Check before packing</Badge></li>)}
          </ul>
        </Panel>
      )}
      <ConfirmDialog
        open={!!act}
        onCancel={() => setAct(null)}
        danger={act?.kind !== "Dismissed"}
        title={act ? `${label[act.kind]}?` : ""}
        text={act ? (act.kind === "Dismissed" ? "Mark this alert as a false alarm. It stays in the log." : `Apply “${label[act.kind]}” for ${act.f.id}. Finance and the customer are notified.`) : ""}
        confirmLabel={act ? label[act.kind] : "Confirm"}
        onConfirm={() => {
          if (act) {
            setItems((all) => all.map((x) => (x.id === act.f.id ? { ...x, status: act.kind } : x)));
            addAudit(me, `${act.f.id}: ${act.kind.toLowerCase()}`);
            toast(`${act.f.id}: ${act.kind}`);
          }
          setAct(null);
        }}
      />
      <p className="ofc-small ofc-muted">Cut-off date for promotions: {shortDate(campaignDates.campaignCutoff.toISOString())}.</p>
    </div>
  );
}

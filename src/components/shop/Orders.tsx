"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, PackageSearch, Printer, Truck } from "lucide-react";
import { ORDER_STATES } from "@/data/shop";
import { advanceOrder, canReturn, findOrder, ordersFor, type Order } from "@/lib/orders";
import { href, type Locale } from "@/lib/i18n";
import { formatDate, formatNaira } from "@/lib/format";
import { SubmitButton, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";
import { useMember, useOrders, useQueryParam } from "./hooks";

const payLabel = { card: "Card", transfer: "Bank transfer", ussd: "USSD" } as const;

export function Receipt({ o }: { o: Order }) {
  return (
    <div className="receipt">
      <div className="receipt-head">
        <div>
          <p className="small muted">Order number</p>
          <p className="receipt-no">{o.number}</p>
        </div>
        <div>
          <p className="small muted">Placed</p>
          <p>{formatDate(o.createdAt, true)} WAT</p>
        </div>
      </div>
      <table className="receipt-table">
        <caption className="sr-only">Items in order {o.number}</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col" className="num">
              Qty
            </th>
            <th scope="col" className="num">
              Unit
            </th>
            <th scope="col" className="num">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {o.lines.map((l, i) => (
            <tr key={i}>
              <td>
                {l.name}
                {(l.size || l.colour) && <span className="small muted"> · {[l.size, l.colour].filter(Boolean).join(", ")}</span>}
              </td>
              <td className="num">{l.qty}</td>
              <td className="num">{formatNaira(l.unitPrice)}</td>
              <td className="num">{formatNaira(l.unitPrice * l.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="summary">
        <div>
          <dt>Items at public price</dt>
          <dd>{formatNaira(o.subtotal)}</dd>
        </div>
        {o.discount > 0 && (
          <div className="summary-save">
            <dt>Discounts{o.coupon ? ` (incl. coupon ${o.coupon})` : ""}</dt>
            <dd>−{formatNaira(o.discount)}</dd>
          </div>
        )}
        <div>
          <dt>Delivery ({o.delivery.zone})</dt>
          <dd>{o.delivery.fee === 0 ? "Free" : formatNaira(o.delivery.fee)}</dd>
        </div>
        <div className="summary-total">
          <dt>Total paid</dt>
          <dd>{formatNaira(o.total)}</dd>
        </div>
        <div className="summary-vat">
          <dt>Includes VAT (7.5%)</dt>
          <dd>{formatNaira(o.vat)}</dd>
        </div>
      </dl>
      <dl className="facts facts-2">
        <div>
          <dt>Buyer</dt>
          <dd>
            {o.buyer.name} · {o.buyer.phone}
          </dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{o.delivery.pickupPoint ?? `${o.delivery.address}, ${o.delivery.state}`}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>
            {payLabel[o.payment.method]} · {o.payment.status}
          </dd>
        </div>
        <div>
          <dt>Payment reference</dt>
          <dd>
            <code>{o.payment.reference}</code>
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function Timeline({ o }: { o: Order }) {
  const reached = (s: string) => o.history.find((h) => h.state === s);
  const extra = o.history.filter((h) => !(ORDER_STATES as readonly string[]).includes(h.state));
  return (
    <ol className="order-tl" aria-label={`Status of order ${o.number}`}>
      {ORDER_STATES.map((s) => {
        const h = reached(s);
        const current = o.state === s;
        return (
          <li key={s} className={`${h ? "is-done" : ""}${current ? " is-current" : ""}`} aria-current={current ? "step" : undefined}>
            {h ? <CheckCircle2 size={20} aria-hidden /> : <Circle size={20} aria-hidden />}
            <div>
              <p className="order-tl-state">{s}</p>
              {h ? <p className="small muted">{formatDate(h.at, true)} WAT{h.note ? ` — ${h.note}` : ""}</p> : <p className="small muted">Pending</p>}
            </div>
          </li>
        );
      })}
      {extra.map((h, i) => (
        <li key={i} className="is-done is-current">
          <CheckCircle2 size={20} aria-hidden />
          <div>
            <p className="order-tl-state">{h.state}</p>
            <p className="small muted">
              {formatDate(h.at, true)} WAT{h.note ? ` — ${h.note}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Confirmation({ locale }: { locale: Locale }) {
  const num = useQueryParam("order");
  const [o, setO] = useState<Order | null | undefined>(undefined);
  useEffect(() => {
    if (num !== null) setO(findOrder(num) ?? null);
    else {
      const t = window.setTimeout(() => setO((v) => (v === undefined ? null : v)), 300);
      return () => window.clearTimeout(t);
    }
  }, [num]);
  if (o === undefined) return <div className="cart-loading" aria-busy="true" />;
  if (!o)
    return (
      <EmptyState
        icon={<PackageSearch size={32} aria-hidden />}
        title="We couldn't find that order"
        text="Check the link from your receipt, or look it up with your order number and phone."
        action={
          <Link href={href(locale, "/shop/orders")} className="btn btn-primary">
            Track an order
          </Link>
        }
      />
    );
  return (
    <div className="confirm">
      {o.payment.status === "Held for review" ? (
        <Notice tone="warn" title="Order received — held for review">
          Orders paid with a card issued outside Nigeria are checked by the Finance team before dispatch. We&apos;ll update you by SMS.
        </Notice>
      ) : (
        <div className="form-success" role="status">
          <CheckCircle2 size={22} aria-hidden />
          <div>
            <strong>Thank you — order {o.number} is confirmed.</strong>
            <div className="small">A receipt would be sent by SMS{o.buyer.email ? " and email" : ""} within 5 minutes. (Prototype: nothing is actually sent.)</div>
          </div>
        </div>
      )}
      {o.dispatchFrom && (
        <Notice tone="warn" title="Dispatch from 17 January 2027">
          Your order was placed after the campaign cut-off, so it will be dispatched from Sunday 17 January 2027.
        </Notice>
      )}
      <Receipt o={o} />
      <section className="confirm-next" aria-labelledby="next-h">
        <h2 id="next-h">What happens next</h2>
        <ol className="confirm-flow">
          {ORDER_STATES.map((s, i) => (
            <li key={s} className={i === 0 ? "is-done" : ""}>
              {s}
            </li>
          ))}
        </ol>
        <p className="small muted">
          Partner vendors dispatch within 48 hours. Expected delivery: {o.delivery.estimate}. You get an SMS/WhatsApp update at every step.
        </p>
      </section>
      <div className="form-actions no-print">
        <Link href={href(locale, `/shop/orders?order=${o.number}`)} className="btn btn-primary">
          <Truck size={16} aria-hidden /> Track this order
        </Link>
        <button type="button" className="btn btn-outline" onClick={() => window.print()}>
          <Printer size={16} aria-hidden /> Print receipt
        </button>
        <Link href={href(locale, "/shop")} className="btn btn-ghost">
          Back to the shop
        </Link>
      </div>
    </div>
  );
}

/** Track My Order: look up by order number + phone; signed-in users also see their history. */
export function OrderTracker({ locale }: { locale: Locale }) {
  const pre = useQueryParam("order");
  const { user } = useMember();
  const all = useOrders();
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [errs, setErrs] = useState<{ num?: string; phone?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [found, setFound] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (pre) {
      setNum(pre);
      const o = findOrder(pre);
      if (o) setFound(o.number); // arrived from the confirmation page in the same browser
    }
  }, [pre]);

  const order = found ? all.find((o) => o.number === found) : undefined;
  const mine = user ? ordersFor(user.id, user.phone) : [];

  return (
    <div className="tracker">
      <div className="split">
        <form
          className="form-panel"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const ne: typeof errs = {};
            if (!/^TBH-\d{2}-\d{6}$/i.test(num.trim())) ne.num = "Order numbers look like TBH-26-123456.";
            if (!isNgPhone(phone)) ne.phone = "Enter the mobile number used at checkout.";
            setErrs(ne);
            if (Object.keys(ne).length) return;
            setBusy(true);
            await simulate(500);
            setBusy(false);
            const o = findOrder(num);
            const digits = (s: string) => s.replace(/\D/g, "").slice(-10);
            if (!o || digits(o.buyer.phone) !== digits(phone)) {
              setFound(null);
              return setErrs({ form: "No order matches that number and phone. Check your receipt SMS." });
            }
            setFound(o.number);
          }}
        >
          <h2 className="co-title">Find your order</h2>
          {errs.form && (
            <Notice tone="danger" title="Not found">
              {errs.form}
            </Notice>
          )}
          <TextField label="Order number" required value={num} onChange={(e) => setNum(e.target.value.toUpperCase())} error={errs.num} placeholder="TBH-26-123456" autoCapitalize="characters" />
          <TextField label="Mobile number used at checkout" required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errs.phone} />
          <SubmitButton busy={busy}>Track order</SubmitButton>
        </form>
        <div>
          {order ? (
            <div className="form-panel" aria-live="polite">
              <div className="tracker-head">
                <div>
                  <p className="small muted">Order</p>
                  <h2 className="co-title">{order.number}</h2>
                </div>
                <span className={`badge badge-${order.state === "Delivered" ? "ok" : order.payment.status === "Held for review" ? "warn" : "info"}`}>{order.payment.status === "Held for review" && order.state === "Paid" ? "Held for review" : order.state}</span>
              </div>
              <Timeline o={order} />
              <dl className="facts facts-2">
                <div>
                  <dt>Courier</dt>
                  <dd>{order.courier ?? (order.delivery.method === "pickup" ? "Ward-leader pickup hub" : "Assigned at dispatch")}</dd>
                </div>
                <div>
                  <dt>Tracking number</dt>
                  <dd>{order.tracking ?? "Available once dispatched"}</dd>
                </div>
              </dl>
              <div className="form-actions">
                {order.state !== "Delivered" && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={order.payment.status === "Held for review" || (order.state as string) === "Return requested"}
                    onClick={() => {
                      const u = advanceOrder(order.number);
                      if (u) toast(`Order ${u.number}: ${u.state}`);
                    }}
                  >
                    Simulate next status
                  </button>
                )}
                {canReturn(order) && (
                  <Link className="btn btn-primary" href={href(locale, `/shop/delivery-returns?order=${order.number}#return`)}>
                    Request a return
                  </Link>
                )}
              </div>
              <p className="proto-note">
                <span className="chip chip-demo">Prototype</span> “Simulate next status” stands in for vendor and courier updates (EC-17, EC-21).
              </p>
            </div>
          ) : (
            <EmptyState icon={<PackageSearch size={32} aria-hidden />} title="Enter your order number" text="You'll find it on your receipt SMS, email or confirmation page." />
          )}
        </div>
      </div>
      {user && (
        <section className="tracker-history" aria-labelledby="hist-h">
          <h2 id="hist-h">Your orders</h2>
          <DataTable
            rows={mine}
            rowKey={(o) => o.number}
            caption="Your orders"
            empty="You haven't placed an order with this account yet."
            columns={[
              { key: "number", header: "Order", sortable: true, value: (o) => o.number },
              { key: "date", header: "Placed", sortable: true, value: (o) => o.createdAt, render: (o) => formatDate(o.createdAt) },
              { key: "items", header: "Items", value: (o) => o.lines.reduce((n, l) => n + l.qty, 0) },
              { key: "total", header: "Total", align: "right", sortable: true, value: (o) => o.total, render: (o) => formatNaira(o.total) },
              { key: "state", header: "Status", value: (o) => o.state, render: (o) => <span className="badge badge-info">{o.state}</span> },
            ]}
            actions={(o) => (
              <button type="button" className="btn btn-sm btn-outline" onClick={() => { setFound(o.number); setNum(o.number); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Track
              </button>
            )}
          />
        </section>
      )}
    </div>
  );
}

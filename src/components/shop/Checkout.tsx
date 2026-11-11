"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Landmark, Lock, ShoppingBag, Smartphone } from "lucide-react";
import { states } from "@/data/states";
import { clearCart, writeCartCoupon } from "@/lib/cart";
import { newOrderNumber, saveOrder, type Order } from "@/lib/orders";
import { href, type Locale } from "@/lib/i18n";
import { formatNaira } from "@/lib/format";
import { go } from "@/lib/navigate";
import { computeTotals, pickupHubs, zoneFor } from "@/lib/shop-pricing";
import { CheckField, SelectField, SubmitButton, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useCart, useMember, useShopPhase } from "./hooks";
import { SummaryLines } from "./CartView";
import { ProductMedia } from "./ProductPhoto";
import { productBySlug } from "@/data/shop";

const STEPS = ["Your details", "Delivery", "Payment", "Review & pay"];
type Pay = "card" | "transfer" | "ussd";
const TEST_BANKS = ["Test Bank A", "Test Bank B", "Test Bank C"];

/**
 * Checkout (EC-11 … EC-16, EC-25, EC-26). Payment is a SIMULATED Paystack test step — no money moves,
 * no card data is stored. Production: Paystack/Flutterwave inline checkout + server-side verification webhook.
 */
export function Checkout({ locale }: { locale: Locale }) {
  const { lines, coupon, ready } = useCart();
  const { isMember, user, ready: sReady } = useMember();
  const phase = useShopPhase();
  const promos = phase?.promos ?? true;
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"courier" | "pickup">("courier");
  const [state, setState] = useState("Lagos");
  const [inCapital, setInCapital] = useState(true);
  const [town, setTown] = useState("");
  const [lga, setLga] = useState("");
  const [address, setAddress] = useState("");
  const [hub, setHub] = useState("");
  const [pay, setPay] = useState<Pay>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [foreign, setForeign] = useState(false);
  const [bank, setBank] = useState(TEST_BANKS[0]);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
      setPhone(user.phone);
      setEmail(user.email);
      setState(user.state);
      setLga(user.lga);
    }
  }, [user]);

  const zone = method === "pickup" ? { key: "pickup", label: "Free pickup at a ward-leader hub", days: "Ready in 2–4 working days", fee: 0 } : zoneFor(state, inCapital);
  const totals = computeTotals(lines, { member: isMember, couponCode: promos ? coupon : null, deliveryFee: zone.fee });

  if (!ready || !sReady) return <div className="cart-loading" aria-busy="true" />;
  if (!lines.length)
    return (
      <EmptyState
        icon={<ShoppingBag size={32} aria-hidden />}
        title="Your cart is empty"
        text="Add something to your cart before checking out."
        action={
          <Link href={href(locale, "/shop/merch")} className="btn btn-primary">
            Shop merch
          </Link>
        }
      />
    );

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (name.trim().split(/\s+/).length < 2) e.name = "Enter your first and last name — every order is recorded against a named buyer.";
      if (!isNgPhone(phone)) e.phone = "Enter a Nigerian mobile number, e.g. 0803 123 4567. We send order updates to it.";
      if (email && !isEmail(email)) e.email = "Enter a valid email address or leave it blank.";
    }
    if (s === 1) {
      if (method === "courier") {
        if (!town.trim()) e.town = "Enter the town or city.";
        if (address.trim().length < 8) e.address = "Enter a street address the courier can find.";
      } else if (!hub) e.hub = "Choose a pickup hub.";
    }
    if (s === 2 && pay === "card") {
      if (card.number.replace(/\s/g, "").length < 16) e.card = "Enter the 16-digit test card number.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = "Use MM/YY.";
      if (!/^\d{3}$/.test(card.cvv)) e.cvv = "3 digits.";
    }
    if (s === 3 && !agree) e.agree = "Please confirm you have read the prices, delivery fee, refund policy and terms.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const placeOrder = async () => {
    if (!validate(3)) return;
    setBusy(true);
    await simulate(1200);
    const now = new Date().toISOString();
    const held = pay === "card" && foreign;
    const order: Order = {
      number: newOrderNumber(),
      createdAt: now,
      buyer: { name: name.trim(), phone: phone.trim(), email: email.trim() || undefined, userId: user?.id },
      delivery: {
        method,
        zone: zone.label,
        state,
        lga: lga || undefined,
        address: method === "courier" ? `${address.trim()}, ${town.trim()}` : undefined,
        pickupPoint: method === "pickup" ? pickupHubs.find((h) => h.id === hub)?.label : undefined,
        fee: totals.delivery,
        estimate: zone.days,
      },
      lines: totals.lines.map((l) => ({ slug: l.slug, name: l.name, unitPrice: l.unit, qty: l.qty, size: l.size, colour: l.colour })),
      coupon: totals.coupon?.code,
      subtotal: totals.publicSubtotal,
      discount: totals.memberSaving + totals.bulkDiscount + totals.couponDiscount,
      vat: totals.vat,
      total: totals.total,
      payment: { method: pay, status: held ? "Held for review" : "Paid (simulated)", reference: `TEST_${Date.now().toString(36).toUpperCase()}` },
      state: "Paid",
      history: [{ state: "Paid", at: now, note: held ? "Held for review: foreign-issued card (FN-4). Not sent to the vendor until Finance clears it." : "Payment confirmed (simulated test mode)" }],
      dispatchFrom: phase?.held ? "2027-01-17" : undefined,
    };
    saveOrder(order);
    clearCart();
    writeCartCoupon(null);
    go(`/shop/checkout/confirmation?order=${order.number}`);
  };

  return (
    <div className="split checkout">
      <div className="checkout-main">
        <ol className="stepper" aria-label="Checkout progress">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={i < step ? "is-done" : undefined}>
              {s}
            </li>
          ))}
        </ol>
        {phase?.held && (
          <Notice tone="warn" title="Dispatch from 17 January 2027">
            Campaign activity has stopped. Your order is accepted now and dispatched from Sunday 17 January 2027.
          </Notice>
        )}

        {step === 0 && (
          <section className="form-panel" aria-labelledby="co-0">
            <h2 id="co-0" className="co-title">
              Your details
            </h2>
            {!user && (
              <p className="small">
                Checking out as a guest. <Link href={href(locale, `/login?next=${encodeURIComponent("/shop/checkout")}`)}>Sign in</Link> for member prices and order history.
              </p>
            )}
            <div className="form-grid form-grid-2">
              <TextField label="Full name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errs.name} className="span-2" />
              <TextField label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errs.phone} hint="Order updates by SMS/WhatsApp." />
              <TextField label="Email (optional)" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} hint="For your emailed receipt." />
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="form-panel" aria-labelledby="co-1">
            <h2 id="co-1" className="co-title">
              Delivery
            </h2>
            <fieldset className="plain">
              <legend>How would you like to receive it?</legend>
              <div className="choice-row">
                <label className="choice">
                  <input type="radio" name="dm" checked={method === "courier"} onChange={() => setMethod("courier")} />
                  <span>Courier to my address</span>
                </label>
                <label className="choice">
                  <input type="radio" name="dm" checked={method === "pickup"} onChange={() => setMethod("pickup")} />
                  <span>Free pickup at a ward-leader hub</span>
                </label>
              </div>
            </fieldset>
            <p className="small muted">We deliver to Nigerian addresses only at launch.</p>
            <div className="form-grid form-grid-2">
              <SelectField label="State" required value={state} onChange={(e) => { setState(e.target.value); setHub(""); }} options={states.map((s) => s.name)} />
              {method === "courier" ? (
                <>
                  <TextField label="LGA" value={lga} onChange={(e) => setLga(e.target.value)} autoComplete="address-level2" />
                  <TextField label="Town or city" required value={town} onChange={(e) => setTown(e.target.value)} error={errs.town} autoComplete="address-level2" />
                  {state !== "Lagos" && state !== "FCT" && (
                    <CheckField label={`The address is in ${states.find((s) => s.name === state)?.capital} (state capital)`} checked={inCapital} onChange={(e) => setInCapital(e.target.checked)} />
                  )}
                  <TextField label="Street address" required value={address} onChange={(e) => setAddress(e.target.value)} error={errs.address} autoComplete="street-address" className="span-2" hint="House number, street and a landmark." />
                </>
              ) : (
                <SelectField
                  label="Pickup hub"
                  required
                  value={hub}
                  onChange={(e) => setHub(e.target.value)}
                  error={errs.hub}
                  placeholder="Choose a hub"
                  options={(pickupHubs.some((h) => h.state === state) ? pickupHubs.filter((h) => h.state === state) : pickupHubs).map((h) => ({ value: h.id, label: h.label }))}
                  hint={pickupHubs.some((h) => h.state === state) ? "Bring your order number and phone." : `No hub in ${state} yet — showing hubs nationwide.`}
                />
              )}
            </div>
            <p className="co-zone">
              <strong>{zone.label}</strong> · {zone.days} · {totals.delivery === 0 ? "Free" : formatNaira(totals.delivery)}
              {totals.freeDelivery && method === "courier" && <span className="muted"> (free over ₦20,000)</span>}
            </p>
          </section>
        )}

        {step === 2 && (
          <section className="form-panel" aria-labelledby="co-2">
            <div className="test-banner" role="note">
              <Lock size={16} aria-hidden /> <strong>TEST MODE — no money moves.</strong> This is a simulated Paystack test checkout. Never enter a real card.
            </div>
            <h2 id="co-2" className="co-title">
              Payment method
            </h2>
            <div className="choice-row">
              {(
                [
                  ["card", "Card", CreditCard],
                  ["transfer", "Bank transfer", Landmark],
                  ["ussd", "USSD", Smartphone],
                ] as const
              ).map(([v, l, I]) => (
                <label key={v} className="choice">
                  <input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} />
                  <span>
                    <I size={16} aria-hidden /> {l}
                  </span>
                </label>
              ))}
            </div>
            {pay === "card" && (
              <div className="form-grid form-grid-2">
                <TextField
                  label="Card number (TEST)"
                  inputMode="numeric"
                  autoComplete="off"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })}
                  error={errs.card}
                  hint="Paystack test card: 4084 0840 8408 4081"
                  className="span-2"
                />
                <TextField label="Expiry (MM/YY)" inputMode="numeric" autoComplete="off" placeholder="12/30" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value.slice(0, 5) })} error={errs.expiry} />
                <TextField label="CVV" inputMode="numeric" autoComplete="off" placeholder="408" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} error={errs.cvv} />
                <CheckField
                  className="span-2"
                  label="This card was issued outside Nigeria (orders on foreign-issued cards are held for review before dispatch)"
                  checked={foreign}
                  onChange={(e) => setForeign(e.target.checked)}
                />
              </div>
            )}
            {pay === "transfer" && (
              <div className="test-pay">
                <p>Transfer the exact total to this <strong>TEST</strong> account. In production each order gets its own dedicated account number from the payment provider.</p>
                <dl className="facts facts-2">
                  <div>
                    <dt>Bank</dt>
                    <dd>TEST BANK (sandbox)</dd>
                  </div>
                  <div>
                    <dt>Account number</dt>
                    <dd>0000000000 (TEST)</dd>
                  </div>
                  <div>
                    <dt>Account name</dt>
                    <dd>TBH ONE SHOP — TEST</dd>
                  </div>
                  <div>
                    <dt>Amount</dt>
                    <dd>{formatNaira(totals.total)}</dd>
                  </div>
                </dl>
              </div>
            )}
            {pay === "ussd" && (
              <div className="test-pay">
                <SelectField label="Your bank (TEST)" value={bank} onChange={(e) => setBank(e.target.value)} options={TEST_BANKS} />
                <p>
                  Dial <code className="ussd">*000*000*{totals.total}#</code> <span className="chip chip-demo">TEST</span> on the phone linked to your account and approve with your PIN.
                </p>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="form-panel" aria-labelledby="co-3">
            <h2 id="co-3" className="co-title">
              Review and pay
            </h2>
            <dl className="facts facts-2">
              <div>
                <dt>Buyer</dt>
                <dd>
                  {name}
                  <br />
                  <span className="small muted">
                    {phone}
                    {email ? ` · ${email}` : ""}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>
                  {method === "pickup" ? pickupHubs.find((h) => h.id === hub)?.label : `${address}, ${town}, ${state}`}
                  <br />
                  <span className="small muted">{zone.days}</span>
                </dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>
                  {pay === "card" ? `Card ending ${card.number.replace(/\s/g, "").slice(-4)}${foreign ? " (foreign-issued — held for review)" : ""}` : pay === "transfer" ? "Bank transfer" : `USSD (${bank})`} <span className="chip chip-demo">TEST</span>
                </dd>
              </div>
              <div>
                <dt>Items</dt>
                <dd>
                  {totals.lines.map((l) => (
                    <span key={`${l.slug}${l.size}${l.colour}`} className="co-item">
                      {l.qty} × {l.name}
                      {l.size ? ` (${l.size})` : ""}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <Notice tone="info" title="Before you pay">
              <ul className="co-terms">
                <li>Prices include VAT at 7.5%. Delivery: {totals.delivery === 0 ? "free" : formatNaira(totals.delivery)}. Total to pay: {formatNaira(totals.total)}.</li>
                <li>Returns and exchanges within 7 days of delivery for a wrong size or a damaged item; refunds go back to the original payment method within 5 working days.</li>
                <li>Orders can be cancelled until they are packed.</li>
                <li>Your name and phone number are recorded with the order for transparency and reporting, as the law requires.</li>
              </ul>
            </Notice>
            <CheckField
              label={
                <>
                  I have read the prices, delivery fee, <Link href={href(locale, "/shop/delivery-returns")}>refund policy</Link> and <Link href={href(locale, "/terms")}>terms of service</Link>.
                </>
              }
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              error={errs.agree}
            />
          </section>
        )}

        <div className="form-actions co-actions">
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)} disabled={busy}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={next}>
              Continue to {STEPS[step + 1].toLowerCase()}
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                placeOrder();
              }}
            >
              <SubmitButton busy={busy} className="btn btn-primary btn-lg">
                <Lock size={16} aria-hidden /> Pay {formatNaira(totals.total)} (test)
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
      <aside className="cart-side sticky-side" aria-label="Order summary">
        <div className="form-panel">
          <h2 className="cart-side-title">Order summary</h2>
          <ul role="list" className="co-mini">
            {totals.lines.map((l) => (
              <li key={`${l.slug}${l.size}${l.colour}`}>
                <span className="co-mini-item">
                  <span className="co-mini-thumb" aria-hidden>
                    {(() => {
                      const p = productBySlug(l.slug);
                      return p ? <ProductMedia p={p} size={32} label={false} sizes="48px" decorative /> : null;
                    })()}
                  </span>
                  <span>
                  {l.qty} × {l.name}
                  {l.size ? ` (${l.size})` : ""}
                  </span>
                </span>
                <span>{formatNaira(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <SummaryLines t={totals} deliveryLabel={step >= 1 ? zone.label : undefined} />
          <Link href={href(locale, "/shop/cart")} className="small">
            Edit cart
          </Link>
        </div>
      </aside>
    </div>
  );
}

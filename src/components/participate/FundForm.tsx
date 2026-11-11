"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, CreditCard, Hash, Landmark, Lock, Printer, ShieldCheck } from "lucide-react";
import { CheckField, FormSuccess, SubmitButton, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { useSession } from "@/lib/auth";
import { formatNaira } from "@/lib/format";
import { readPref, writePref } from "@/lib/prefs";

const PRESETS = [1000, 2500, 5000, 10000, 25000];
const LARGE = 1_000_000; // PRD decision 4: ₦1,000,000 triggers ID and source-of-funds checks
const LEGAL_REVIEW = 5_000_000; // ₦5,000,000 triggers legal review before funds are used
type Method = "card" | "transfer" | "ussd";

export type Contribution = { reference: string; projectSlug: string; projectTitle: string; amount: number; name: string; phone: string; email?: string; method: Method; at: string; status: "Paid (simulated)" | "Held for checks" };

/**
 * Fund-a-project flow (MB-9). Every contribution is recorded against a named contributor (GR-4);
 * foreign-source money is not taken until legal clearance (CC-7, FN-4).
 * PROTOTYPE: the Paystack step is simulated — no money moves. Receipts are kept in localStorage "tbh-contributions".
 */
export function FundForm({ slug, title, remaining, open }: { slug: string; title: string; remaining: number; open: boolean }) {
  const { user } = useSession();
  const [amount, setAmount] = useState<number | null>(5000);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [abroad, setAbroad] = useState(false);
  const [method, setMethod] = useState<Method>("card");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"form" | "pay" | "done">("form");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Contribution | null>(null);

  useEffect(() => {
    if (user) {
      setName((n) => n || `${user.firstName} ${user.lastName}`);
      setPhone((p) => p || user.phone);
    }
  }, [user]);

  const value = custom ? Number(custom.replace(/[^\d]/g, "")) : amount ?? 0;

  if (!open)
    return (
      <Notice tone="ok" title="This project is no longer taking contributions">
        It has reached its target. Follow its delivery updates above, or choose another open project.
      </Notice>
    );

  if (stage === "done" && receipt)
    return (
      <div className="form-panel receipt" role="status">
        <FormSuccess title={receipt.status === "Held for checks" ? "Contribution received — held for checks" : "Thank you — your contribution is recorded"}>
          {receipt.status === "Held for checks"
            ? `Contributions of ${formatNaira(LARGE)} or more are held until ID and source-of-funds checks are complete. We'll contact you within two working days.`
            : "A receipt is sent by SMS and email within 5 minutes in production. You can also see it in your dashboard under My funded projects."}
        </FormSuccess>
        <dl className="facts facts-2">
          <div><dt>Reference</dt><dd>{receipt.reference}</dd></div>
          <div><dt>Amount</dt><dd>{formatNaira(receipt.amount)}</dd></div>
          <div><dt>Project</dt><dd>{receipt.projectTitle}</dd></div>
          <div><dt>Contributor</dt><dd>{receipt.name}</dd></div>
          <div><dt>Method</dt><dd>{receipt.method === "card" ? "Card" : receipt.method === "transfer" ? "Bank transfer" : "USSD"}</dd></div>
          <div><dt>Date</dt><dd>{new Date(receipt.at).toLocaleString("en-GB", { timeZone: "Africa/Lagos" })} WAT</dd></div>
        </dl>
        <Notice tone="warn" title="Prototype">
          Simulated payment — no money was taken. Production uses a licensed Nigerian provider (Paystack or Flutterwave) in test mode first.
        </Notice>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => window.print()}>
            <Printer size={16} aria-hidden /> Print receipt
          </button>
          <Link href="/dashboard/member/projects" className="btn btn-ghost">
            See it in my dashboard
          </Link>
        </div>
      </div>
    );

  if (stage === "pay")
    return (
      <div className="form-panel paystep">
        <p className="paystep-head">
          <Lock size={16} aria-hidden /> Secure payment · <span className="chip chip-demo">Test mode</span>
        </p>
        <p>
          You are paying <strong>{formatNaira(value)}</strong> to fund <strong>{title}</strong>.
        </p>
        {method === "card" && (
          <div className="form-grid form-grid-2">
            <TextField label="Card number" inputMode="numeric" placeholder="4084 0840 8408 4081" defaultValue="4084 0840 8408 4081" hint="Test card — the real form is the payment provider's, not ours (no card data is stored by TBH One, EC-12)." className="span-2" />
            <TextField label="Expiry" placeholder="MM/YY" defaultValue="12/29" />
            <TextField label="CVV" inputMode="numeric" placeholder="408" defaultValue="408" />
          </div>
        )}
        {method === "transfer" && (
          <Notice tone="info" title="Bank transfer">
            In production the payment provider shows a one-time virtual account number for this contribution. No account number is shown here because none has been issued.
          </Notice>
        )}
        {method === "ussd" && (
          <Notice tone="info" title="USSD">
            In production you would choose your bank and dial a one-time USSD code generated by the payment provider.
          </Notice>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await simulate(1200);
              const c: Contribution = {
                reference: `TBH-PRJ-${Date.now().toString().slice(-8)}`,
                projectSlug: slug,
                projectTitle: title,
                amount: value,
                name: name.trim(),
                phone,
                email: email.trim() || undefined,
                method,
                at: new Date().toISOString(),
                status: value >= LARGE ? "Held for checks" : "Paid (simulated)",
              };
              try {
                const all = JSON.parse(readPref("tbh-contributions") ?? "[]");
                writePref("tbh-contributions", JSON.stringify([c, ...(Array.isArray(all) ? all : [])]));
              } catch {
                /* storage unavailable */
              }
              setReceipt(c);
              setBusy(false);
              setStage("done");
            }}
          >
            {busy ? "Processing…" : `Pay ${formatNaira(value)} (simulated)`}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setStage("form")} disabled={busy}>
            Back
          </button>
        </div>
      </div>
    );

  return (
    <form
      className="form-panel"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const x: Record<string, string> = {};
        if (!value || value < 500) x.amount = "The minimum contribution is ₦500.";
        if (name.trim().split(/\s+/).length < 2) x.name = "Enter your full name. Every contribution is recorded against a named contributor (Electoral Act requirements).";
        if (!isNgPhone(phone)) x.phone = "Enter a Nigerian mobile number for your receipt.";
        if (email && !isEmail(email)) x.email = "Enter a valid email address or leave it empty.";
        if (!agree) x.agree = "Please confirm the declaration.";
        setErr(x);
        if (Object.keys(x).length || abroad) return;
        setBusy(true);
        await simulate(500);
        setBusy(false);
        setStage("pay");
      }}
    >
      <fieldset className="plain">
        <legend>Choose an amount</legend>
        <div className="choice-row">
          {PRESETS.map((p) => (
            <label key={p} className="choice">
              <input
                type="radio"
                name="amount"
                checked={!custom && amount === p}
                onChange={() => {
                  setAmount(p);
                  setCustom("");
                }}
              />
              <span>{formatNaira(p)}</span>
            </label>
          ))}
        </div>
        <TextField label="Or enter another amount (₦)" inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d,]/g, ""))} error={err.amount} hint={remaining > 0 ? `${formatNaira(remaining)} still needed to reach the target.` : undefined} />
      </fieldset>
      {value >= LARGE && (
        <Notice tone="warn" title="Large contribution checks">
          Contributions of {formatNaira(LARGE)} or more in one payment or one month trigger ID and source-of-funds checks; {formatNaira(LEGAL_REVIEW)} or more also needs legal review before the money is used. Your payment will be held until checks are complete.
        </Notice>
      )}
      <div className="form-grid form-grid-2">
        <TextField label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={err.name} required hint="Shown on your receipt. Not shown publicly." className="span-2" />
        <TextField label="Mobile number (for your receipt)" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={err.phone} required />
        <TextField label="Email (optional)" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} />
      </div>
      <CheckField label="I live outside Nigeria, or this money comes from outside Nigeria" checked={abroad} onChange={(e) => setAbroad(e.target.checked)} />
      {abroad && (
        <Notice tone="warn" title="We can't take money from abroad yet">
          Funds from outside Nigeria need legal clearance before they can be accepted, because of constitutional limits on parties holding money sent from abroad. You can still help today: make the case at home through <Link href="/diaspora">Tell One</Link>, offer skills or equipment through your diaspora chapter, or support a <Link href="/projects">hometown project</Link> in kind.
        </Notice>
      )}
      <fieldset className="plain">
        <legend>Payment method</legend>
        <div className="choice-row">
          {(
            [
              ["card", "Card", CreditCard],
              ["transfer", "Bank transfer", Landmark],
              ["ussd", "USSD", Hash],
            ] as const
          ).map(([v, l, Icon]) => (
            <label key={v} className="choice">
              <input type="radio" name="method" checked={method === v} onChange={() => setMethod(v)} />
              <span>
                <Icon size={16} aria-hidden /> {l}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <CheckField
        label="I confirm this is my own money from a lawful source in Nigeria, and I understand contributions are recorded for the party's disclosure obligations."
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
        error={err.agree}
      />
      {Object.keys(err).length > 0 && (
        <p className="field-error" role="alert">
          <AlertCircle size={16} aria-hidden /> Please fix the highlighted fields.
        </p>
      )}
      <div className="form-actions">
        <SubmitButton busy={busy} disabled={abroad}>
          <ShieldCheck size={16} aria-hidden /> Continue to payment
        </SubmitButton>
        <span className="small muted">Fees, if any, are shown by the payment provider before you pay.</span>
      </div>
    </form>
  );
}

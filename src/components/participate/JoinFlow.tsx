"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AlertCircle, Download, HandCoins, LayoutDashboard, Smartphone } from "lucide-react";
import { CheckField, SelectField, SubmitButton, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { DEMO_OTP, findUser, registerDemoUser, type DemoUser } from "@/lib/auth";
import { stateNames } from "@/data/states";
import { href, localeMeta, locales, type Locale } from "@/lib/i18n";

type Step = 0 | 1 | 2 | 3;
const STEPS = ["Phone", "Verify", "About you", "Consent"];

const PLEDGES = [
  { v: "tell", label: "Tell One", text: "I live abroad and will tell my family at home." },
  { v: "bring", label: "Bring One", text: "I will bring one friend who is on the fence." },
  { v: "help", label: "Help One", text: "I will support one person or community in need." },
];

/**
 * Free membership sign-up (Concept Note §5, PRD MB acceptance: dashboard within 2 minutes).
 * NEVER asks for a PVC number or voting intention (GR-1). SIMULATED: no SMS is sent; data stays in this browser.
 */
export function JoinFlow({ locale, dashboardHref, fundHref }: { locale: Locale; dashboardHref: string; fundHref: string }) {
  const [step, setStep] = useState<Step>(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", state: "", lga: "", ward: "", street: "", language: locale as string, pledge: "", country: "" });
  const [consent, setConsent] = useState({ membership: false, updates: false, ai: false, photos: false, adult: false, terms: false });
  const [user, setUser] = useState<DemoUser | null>(null);

  const up = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  if (user) return <Welcome user={user} pledge={f.pledge} dashboardHref={dashboardHref} fundHref={fundHref} />;

  return (
    <div className="join">
      <ol className="stepper" aria-label="Sign-up progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className={i < step ? "is-done" : undefined}>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form
          className="form-panel"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isNgPhone(phone)) return setErr({ phone: "Enter a Nigerian mobile number, for example 0803 123 4567. Diaspora members can use a family member's Nigerian number or join with email in the app." });
            if (findUser(phone)) return setErr({ phone: "This number already has an account. Sign in instead." });
            setErr({});
            setBusy(true);
            await simulate();
            setBusy(false);
            setStep(1);
          }}
        >
          <h2 className="join-h">Your mobile number</h2>
          <p className="muted">Membership is free and open to every Nigerian aged 18 or over, at home or abroad. There are no dues.</p>
          <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} error={err.phone} required hint="We'll text you a 6-digit code to confirm it's yours." />
          {err.phone?.includes("Sign in") && <Link href={href(locale, "/login")}>Go to sign in</Link>}
          <div className="form-actions">
            <SubmitButton busy={busy}>
              <Smartphone size={16} aria-hidden /> Send code
            </SubmitButton>
          </div>
        </form>
      )}

      {step === 1 && (
        <form
          className="form-panel"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (code !== DEMO_OTP) return setErr({ code: "That code doesn't match. Check the SMS and try again." });
            setErr({});
            setBusy(true);
            await simulate(400);
            setBusy(false);
            setStep(2);
          }}
        >
          <h2 className="join-h">Enter the code</h2>
          <Notice tone="warn" title="Prototype">
            No SMS is sent. The demo code is <strong>{DEMO_OTP}</strong>.
          </Notice>
          <TextField label={`Code sent to ${phone}`} className="otp-field" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={err.code} required />
          <div className="form-actions">
            <SubmitButton busy={busy}>Verify</SubmitButton>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
              Change number
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          className="form-panel"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (!f.firstName.trim()) x.firstName = "Enter your first name.";
            if (!f.lastName.trim()) x.lastName = "Enter your last name.";
            if (f.email && !isEmail(f.email)) x.email = "Enter a valid email address or leave it empty.";
            if (!f.state) x.state = "Choose the state you live in or come from.";
            if (!f.lga.trim()) x.lga = "Enter your local government area.";
            if (!f.pledge) x.pledge = "Choose the action you'll take first.";
            setErr(x);
            if (!Object.keys(x).length) setStep(3);
          }}
        >
          <h2 className="join-h">About you</h2>
          <div className="form-grid form-grid-2">
            <TextField label="First name" autoComplete="given-name" value={f.firstName} onChange={(e) => up("firstName", e.target.value)} error={err.firstName} required />
            <TextField label="Last name" autoComplete="family-name" value={f.lastName} onChange={(e) => up("lastName", e.target.value)} error={err.lastName} required />
            <TextField label="Email (optional)" type="email" autoComplete="email" value={f.email} onChange={(e) => up("email", e.target.value)} error={err.email} />
            <SelectField label="Preferred language" value={f.language} onChange={(e) => up("language", e.target.value)} options={locales.map((l) => ({ value: l, label: localeMeta[l].native }))} hint="You can change this any time." />
            <SelectField label="State" value={f.state} onChange={(e) => up("state", e.target.value)} options={stateNames} placeholder="Choose a state" error={err.state} required hint="Your home state if you live abroad." />
            <TextField label="Local government area (LGA)" value={f.lga} onChange={(e) => up("lga", e.target.value)} error={err.lga} required />
            <TextField label="Ward (optional)" value={f.ward} onChange={(e) => up("ward", e.target.value)} />
            <TextField label="Street (optional)" value={f.street} onChange={(e) => up("street", e.target.value)} hint="Helps us connect you with your street leader." />
            <TextField label="Country you live in (if not Nigeria)" value={f.country} onChange={(e) => up("country", e.target.value)} hint="Diaspora members join a country chapter for Tell One." className="span-2" />
          </div>
          <fieldset className="plain">
            <legend>
              Which action will you take first?<span className="req" aria-hidden> *</span>
            </legend>
            <div className="pledge-grid">
              {PLEDGES.map((p) => (
                <label key={p.v} className="pledge">
                  <input type="radio" name="pledge" value={p.v} checked={f.pledge === p.v} onChange={() => up("pledge", p.v)} />
                  <span>
                    <strong>{p.label}</strong>
                    <span className="small muted">{p.text}</span>
                  </span>
                </label>
              ))}
            </div>
            {err.pledge && (
              <p className="field-error">
                <AlertCircle size={16} aria-hidden /> {err.pledge}
              </p>
            )}
          </fieldset>
          <p className="small muted">We never ask how you will vote, for your voter&apos;s card (PVC) number or your polling unit.</p>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form
          className="form-panel"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (!consent.membership) x.membership = "Membership consent is needed to create your account.";
            if (!consent.adult) x.adult = "Members must be 18 or over.";
            if (!consent.terms) x.terms = "Please accept the Terms of Service and Privacy Policy.";
            setErr(x);
            if (Object.keys(x).length) return;
            setBusy(true);
            await simulate();
            const u = registerDemoUser({
              firstName: f.firstName.trim(),
              lastName: f.lastName.trim(),
              phone,
              email: f.email.trim() || `${phone.replace(/\D/g, "")}@member.demo`,
              state: f.state,
              lga: f.lga.trim(),
              ward: f.ward.trim() || undefined,
              street: f.street.trim() || undefined,
              country: f.country.trim() || undefined,
            });
            setBusy(false);
            setUser(u);
          }}
        >
          <h2 className="join-h">Your consent</h2>
          <p className="muted">Each purpose is separate and you can change any of them later in Profile &amp; privacy. Only the first is needed to join (Nigeria Data Protection Act 2023).</p>
          <div className="consent-list">
            <CheckField label={<><strong>Membership (required).</strong> TBH One may store my name, phone, state and LGA to run my membership and dashboard.</>} checked={consent.membership} onChange={(e) => setConsent({ ...consent, membership: e.target.checked })} error={err.membership} />
            <CheckField label={<><strong>SMS and WhatsApp updates.</strong> Event reminders and campaign updates, at most a few a day.</>} checked={consent.updates} onChange={(e) => setConsent({ ...consent, updates: e.target.checked })} />
            <CheckField label={<><strong>AI calls.</strong> The automated TBH One AI Call Agent may call me with voter information.</>} checked={consent.ai} onChange={(e) => setConsent({ ...consent, ai: e.target.checked })} />
            <CheckField label={<><strong>Photos.</strong> Photos of me at TBH One events may be used in the gallery and on social media.</>} checked={consent.photos} onChange={(e) => setConsent({ ...consent, photos: e.target.checked })} />
            <CheckField label={<><strong>I am 18 or over (required).</strong></>} checked={consent.adult} onChange={(e) => setConsent({ ...consent, adult: e.target.checked })} error={err.adult} />
            <CheckField
              label={
                <>
                  <strong>I accept the</strong> <Link href={href(locale, "/terms")}>Terms of Service</Link> and <Link href={href(locale, "/privacy")}>Privacy Policy</Link> (required).
                </>
              }
              checked={consent.terms}
              onChange={(e) => setConsent({ ...consent, terms: e.target.checked })}
              error={err.terms}
            />
          </div>
          <div className="form-actions">
            <SubmitButton busy={busy}>Join TBH One</SubmitButton>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Welcome({ user, pledge, dashboardHref, fundHref }: { user: DemoUser; pledge: string; dashboardHref: string; fundHref: string }) {
  const memberId = `TBH-MBR-${user.id.slice(-6).toUpperCase()}`;
  const [qr, setQr] = useState("");
  useEffect(() => {
    QRCode.toDataURL(`TBHONE:${memberId}`, { margin: 1, width: 200, color: { dark: "#0f4d02", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [memberId]);
  const pledgeText = PLEDGES.find((p) => p.v === pledge)?.label ?? "Bring One";
  return (
    <div className="join-done" role="status">
      <div>
        <h2>Welcome to TBH One, {user.firstName}.</h2>
        <p className="lead">You&apos;re a member. Your first action is <strong>{pledgeText}</strong> — your dashboard shows how to start today and earns you Impact Points.</p>
        <p className="muted small">You earned 100 Impact Points for joining (shown once verified in production).</p>
        <div className="form-actions">
          <Link href={dashboardHref} className="btn btn-primary">
            <LayoutDashboard size={18} aria-hidden /> Go to my dashboard
          </Link>
          <Link href={fundHref} className="btn btn-outline">
            <HandCoins size={18} aria-hidden /> Fund a project
          </Link>
        </div>
      </div>
      <figure className="member-card" aria-label="Your member ID card">
        <div className="member-card-top">
          <img src="/brand/tbh-one-logo-180.webp" alt="TBH One" width={90} height={58} />
          <span>Member</span>
        </div>
        <p className="member-card-name">
          {user.firstName} {user.lastName}
        </p>
        <p className="member-card-meta">
          {memberId} · {user.state}
        </p>
        {qr ? <img src={qr} alt={`QR code for member ID ${memberId}`} width={140} height={140} className="member-card-qr" /> : <span className="member-card-qr" />}
        {qr && (
          <a href={qr} download={`${memberId}.png`} className="btn btn-sm btn-ghost member-card-dl">
            <Download size={16} aria-hidden /> Download QR
          </a>
        )}
      </figure>
    </div>
  );
}

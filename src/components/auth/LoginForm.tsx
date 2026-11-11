"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KeyRound, MessageCircle, Smartphone } from "lucide-react";
import { Tabs } from "@/components/ui/Interactive";
import { SubmitButton, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { DEMO_OTP, DEMO_PASSWORD, demoUsers, findUser, signIn, type DemoUser } from "@/lib/auth";
import { roleByKey } from "@/data/roles";
import { go } from "@/lib/navigate";
import { site } from "@/config/site";

function nextPath(user: DemoUser) {
  const n = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
  if (n && n.startsWith("/") && !n.startsWith("//")) return n;
  return `/dashboard/${user.roles[0]}`;
}

/** SH-1 sign-in: phone + one-time SMS code; optional email + password; WhatsApp link where available. SIMULATED. */
export function LoginForm() {
  return (
    <div className="auth-card">
      <Tabs
        label="Sign-in method"
        tabs={[
          { label: "Phone & code", content: <PhoneOtp /> },
          { label: "Email & password", content: <EmailPassword /> },
          { label: "WhatsApp", content: <WhatsAppLink /> },
        ]}
      />
    </div>
  );
}

function PhoneOtp() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  if (step === "phone")
    return (
      <form
        className="form-grid"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isNgPhone(phone)) return setErr("Enter a Nigerian mobile number, for example 0803 123 4567.");
          setErr("");
          setBusy(true);
          await simulate();
          setBusy(false);
          setStep("code");
          setResendIn(30);
        }}
      >
        <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} error={err} required hint="We'll text you a 6-digit code. Standard SMS rates may apply." />
        <SubmitButton busy={busy}>
          <Smartphone size={16} aria-hidden /> Send code
        </SubmitButton>
      </form>
    );
  return (
    <form
      className="form-grid"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (code !== DEMO_OTP) return setErr("That code doesn't match. Check the SMS and try again.");
        const user = findUser(phone);
        if (!user) return setErr("No account uses this number yet. Join TBH One first — it's free.");
        setBusy(true);
        await simulate(400);
        signIn(user);
        go(nextPath(user));
      }}
    >
      <Notice tone="warn" title="Prototype">
        No SMS is sent. The demo code is <strong>{DEMO_OTP}</strong>.
      </Notice>
      <TextField label={`Code sent to ${phone}`} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="otp-field" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={err} required />
      <div className="form-actions">
        <SubmitButton busy={busy}>Sign in</SubmitButton>
        <button type="button" className="btn btn-ghost" disabled={resendIn > 0} onClick={() => setResendIn(30)}>
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
        </button>
        <button type="button" className="linklike" onClick={() => setStep("phone")}>
          Change number
        </button>
      </div>
    </form>
  );
}

function EmailPassword() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errs, setErrs] = useState<{ email?: string; pw?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="form-grid"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const next: typeof errs = {};
        if (!isEmail(email)) next.email = "Enter a valid email address.";
        if (pw.length < 8) next.pw = "Passwords have at least 8 characters.";
        setErrs(next);
        if (Object.keys(next).length) return;
        setBusy(true);
        await simulate();
        const user = findUser(email);
        if (!user || pw !== DEMO_PASSWORD) {
          setBusy(false);
          return setErrs({ form: "Email or password is incorrect." });
        }
        signIn(user);
        go(nextPath(user));
      }}
    >
      {errs.form && (
        <Notice tone="danger" title="Couldn't sign in">
          {errs.form}
        </Notice>
      )}
      <TextField label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} required />
      <TextField label="Password" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} error={errs.pw} required />
      <div className="form-actions">
        <SubmitButton busy={busy}>
          <KeyRound size={16} aria-hidden /> Sign in
        </SubmitButton>
        <Link href="/login/recover">Forgot password?</Link>
      </div>
    </form>
  );
}

function WhatsAppLink() {
  return (
    <div className="form-grid">
      <p>Get a one-tap sign-in link on WhatsApp instead of an SMS code.</p>
      <Notice tone="info" title="Not available yet">
        {site.contact.whatsappNumber
          ? "WhatsApp sign-in links need the WhatsApp Business API connection."
          : "WhatsApp sign-in opens with the official TBH One WhatsApp line at launch. Use your phone number for now."}
      </Notice>
      <button type="button" className="btn btn-outline" disabled>
        <MessageCircle size={16} aria-hidden /> Send me a WhatsApp link
      </button>
    </div>
  );
}

/** Demo account picker so reviewers can reach every dashboard. */
export function DemoAccounts() {
  return (
    <div className="demo-accounts">
      <h2>Demo accounts</h2>
      <p className="small muted">
        Prototype only. Every account uses code <strong>{DEMO_OTP}</strong> or password <strong>{DEMO_PASSWORD}</strong>. Roles above Member ask for the authenticator code <strong>246810</strong>.
      </p>
      <ul role="list">
        {demoUsers.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              className="demo-acct"
              onClick={() => {
                signIn(u);
                go(nextPath(u));
              }}
            >
              <span className="demo-acct-name">
                {u.firstName} {u.lastName}
              </span>
              <span className="demo-acct-roles">{u.roles.length > 3 ? `All ${u.roles.length} roles` : u.roles.map((r) => roleByKey(r)?.short).join(", ")}</span>
              <span className="demo-acct-id small muted">{u.email}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

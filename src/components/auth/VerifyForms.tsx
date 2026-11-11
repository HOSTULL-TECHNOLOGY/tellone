"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FormSuccess, SubmitButton, TextField, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { confirmTwoFactor, DEMO_2FA, DEMO_OTP, findUser, readSession, signIn, signOut, userById } from "@/lib/auth";
import { go } from "@/lib/navigate";

const query = () => (typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search));

/**
 * /login/verify — the page an SMS sign-in link or a password-reset message opens.
 * ?id=<phone or email> pre-fills the account; ?mode=reset asks for a new password as well. SIMULATED.
 */
export function CodeVerifyForm() {
  const [id, setId] = useState("");
  const [reset, setReset] = useState(false);
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const q = query();
    setId(q.get("id") ?? "");
    setReset(q.get("mode") === "reset");
  }, []);

  if (done)
    return (
      <div className="auth-card form-grid">
        <FormSuccess title="Password updated">Your new password is set. Use it the next time you sign in with email.</FormSuccess>
        <Notice tone="warn" title="Prototype">
          Nothing was saved. Demo accounts keep the password <strong>demo1234</strong>.
        </Notice>
        <Link className="btn btn-primary" href="/login">
          Back to sign in
        </Link>
      </div>
    );

  return (
    <form
      className="auth-card form-grid"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        const user = findUser(id.trim());
        if (!id.trim()) next.id = "Enter the phone number or email address you joined with.";
        else if (!user) next.id = "No account uses this phone number or email yet.";
        if (code !== DEMO_OTP) next.code = "That code doesn't match. Check the message and try again.";
        if (reset && pw.length < 8) next.pw = "Use at least 8 characters.";
        if (reset && pw2 !== pw) next.pw2 = "The two passwords don't match.";
        setErr(next);
        if (Object.keys(next).length || !user) return;
        setBusy(true);
        await simulate(400);
        setBusy(false);
        if (reset) return setDone(true);
        signIn(user);
        go(`/dashboard/${user.roles[0]}`);
      }}
    >
      <Notice tone="warn" title="Prototype">
        No message is sent. The demo code is <strong>{DEMO_OTP}</strong>.
      </Notice>
      <TextField label="Phone number or email" autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} error={err.id} required />
      <TextField label="6-digit code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="otp-field" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={err.code} required />
      {reset && (
        <>
          <TextField label="New password" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} error={err.pw} hint="At least 8 characters." required />
          <TextField label="Confirm new password" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} error={err.pw2} required />
        </>
      )}
      <div className="form-actions">
        <SubmitButton busy={busy}>{reset ? "Set new password" : "Verify and sign in"}</SubmitButton>
        <Link className="btn btn-ghost" href="/login/recover">
          Send a new code
        </Link>
      </div>
    </form>
  );
}

/** /login/2fa — second step for roles above Member (PRD SH-2). SIMULATED: the authenticator code is fixed. */
export function TwoFactorForm() {
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const s = readSession();
    const u = s ? userById(s.userId) : undefined;
    setName(u ? `${u.firstName} ${u.lastName}` : null);
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!name)
    return (
      <div className="auth-card form-grid">
        <p>Sign in first. The second step comes after your phone code or password.</p>
        <Link className="btn btn-primary" href="/login">
          Go to sign in
        </Link>
      </div>
    );

  return (
    <form
      className="auth-card form-grid"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (code !== DEMO_2FA) return setErr("That code is not correct. Check your authenticator app and try again.");
        setBusy(true);
        await simulate(300);
        confirmTwoFactor();
        const s = readSession();
        go(s ? `/dashboard/${s.activeRole}` : "/dashboard");
      }}
    >
      <p>
        Signed in as <strong>{name}</strong>. Enter the 6-digit code from your authenticator app.
      </p>
      <TextField label="Authentication code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="otp-field" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={err} hint={<>Demo code: <strong>{DEMO_2FA}</strong></>} required />
      <div className="form-actions">
        <SubmitButton busy={busy}>Verify</SubmitButton>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            signOut();
            go("/login");
          }}
        >
          Sign out
        </button>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { FormSuccess, SubmitButton, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";

/** Account recovery: by phone (new SMS code) or email (reset link). SIMULATED — nothing is sent. */
export function RecoverForm() {
  const [v, setV] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div className="auth-card form-grid">
        <FormSuccess title="Check your phone or inbox">
          If an account uses <strong>{v}</strong>, we've sent instructions to reset access. The link expires in 30 minutes.
        </FormSuccess>
        <Notice tone="warn" title="Prototype">
          No message was actually sent. Use the demo code <strong>123456</strong> on the next screen, or sign in with a demo account.
        </Notice>
        <div className="form-actions">
          <Link href={`/login/verify?mode=reset&id=${encodeURIComponent(v)}`} className="btn btn-primary">
            Enter the code and set a new password
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  return (
    <form
      className="auth-card form-grid"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!isEmail(v) && !isNgPhone(v)) return setErr("Enter the email address or Nigerian mobile number on your account.");
        setErr("");
        setBusy(true);
        await simulate();
        setDone(true);
      }}
    >
      <TextField label="Email or mobile number" value={v} onChange={(e) => setV(e.target.value)} error={err} required autoComplete="username" hint="For security we show the same message whether or not an account exists." />
      <div className="form-actions">
        <SubmitButton busy={busy}>Send reset instructions</SubmitButton>
        <Link href="/login">Back to sign in</Link>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { Dict } from "@/i18n";

/** SH-9: consent-based email and WhatsApp opt-in. Honest about the demo state on success. */
export function ConnectForm({ t, privacyHref, whatsappHref }: { t: Dict["connect"]; privacyHref: string; whatsappHref: string }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ contact?: string; consent?: string }>({});
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    const phoneOk = /^(\+?234|0)[789]\d{9}$/.test(phone.replace(/[\s-]/g, ""));
    if (!emailOk && !phoneOk) errs.contact = t.errorEmail;
    if (!consent) errs.consent = t.errorConsent;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("busy");
    try {
      // Prototype: messaging providers are not connected, so nothing is stored or sent.
      await new Promise((r) => setTimeout(r, 600));
      setState("done");
    } catch {
      setState("idle");
      setErrors({ contact: "Something went wrong. Please try again." });
    }
  }

  if (state === "done")
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={22} aria-hidden />
        <p>{t.success}</p>
      </div>
    );

  return (
    <form className="connect-form" onSubmit={submit} noValidate>
      <div className="connect-fields">
        <div className="field">
          <label htmlFor="c-email">{t.email}</label>
          <input id="c-email" className="input" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "c-err" : undefined} />
        </div>
        <div className="field">
          <label htmlFor="c-phone">{t.phone}</label>
          <input id="c-phone" className="input" type="tel" autoComplete="tel" inputMode="tel" placeholder="+234" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "c-err" : undefined} />
        </div>
      </div>
      {errors.contact && (
        <p id="c-err" className="field-error">
          <AlertCircle size={16} aria-hidden /> {errors.contact}
        </p>
      )}
      <label className="check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "c-cerr" : undefined} />
        <span>
          {t.consent} <Link href={privacyHref}>Privacy Policy</Link>
        </span>
      </label>
      {errors.consent && (
        <p id="c-cerr" className="field-error">
          <AlertCircle size={16} aria-hidden /> {errors.consent}
        </p>
      )}
      <div className="connect-actions">
        <button type="submit" className="btn btn-primary" disabled={state === "busy"}>
          {state === "busy" && <Loader2 size={16} className="spin" aria-hidden />}
          {t.submit}
        </button>
        <Link href={whatsappHref}>{t.whatsappGroups}</Link>
      </div>
    </form>
  );
}

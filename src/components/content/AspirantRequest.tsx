"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckField, FormSuccess, SelectField, SubmitButton, TextArea, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { states } from "@/data/states";

type Pkg = { id: string; name: string };
const OFFICES = ["President", "Governor", "Senate", "House of Representatives", "State House of Assembly", "LGA Chairman", "Councillor"];

/** Service request form for NDC aspirants. Prototype: validates and simulates submission; nothing leaves the browser. */
export function AspirantRequest({ packages }: { packages: Pkg[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const err: Record<string, string> = {};
    if (!String(f.get("name") || "").trim()) err.name = "Enter your full name.";
    if (!isNgPhone(String(f.get("phone") || ""))) err.phone = "Enter a Nigerian phone number, e.g. 0803 123 4567.";
    if (!isEmail(String(f.get("email") || ""))) err.email = "Enter a valid email address.";
    if (!f.get("office")) err.office = "Choose the office you are aspiring to.";
    if (!f.get("state")) err.state = "Choose your state.";
    if (!picked.length) err.pkgs = "Choose at least one service.";
    if (!f.get("consent")) err.consent = "Confirm you agree to be contacted.";
    setErrors(err);
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0];
      (e.currentTarget.querySelector(first === "pkgs" ? "fieldset input" : `[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setBusy(true);
    await simulate();
    setBusy(false);
    setRef(`ASP-${Math.floor(100000 + Math.random() * 900000)}`);
  }

  if (ref)
    return (
      <FormSuccess title="Request received">
        <p>
          Your reference is <strong>{ref}</strong>. The Aspirant Services desk will call you within two working days to confirm scope, dates and the invoice. In the prototype, nothing has been sent.
        </p>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/dashboard/aspirant" className="btn btn-primary">
            Open the aspirant dashboard
          </Link>
          <button type="button" className="btn btn-outline" onClick={() => { setRef(null); setPicked([]); }}>
            Make another request
          </button>
        </p>
      </FormSuccess>
    );

  return (
    <form noValidate onSubmit={submit} className="stack" style={{ display: "grid", gap: 16, maxWidth: 640 }}>
      <TextField name="name" label="Full name" required autoComplete="name" error={errors.name} />
      <TextField name="phone" label="Phone number" required type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />
      <TextField name="email" label="Email address" required type="email" autoComplete="email" error={errors.email} />
      <SelectField name="office" label="Office you are aspiring to" required placeholder="Choose an office" options={OFFICES} error={errors.office} />
      <SelectField name="state" label="State" required placeholder="Choose a state" options={states.map((s) => ({ value: s.slug, label: s.name }))} error={errors.state} />
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby={errors.pkgs ? "asp-pkgs-e" : undefined}>
        <legend style={{ fontWeight: 650, marginBottom: 8 }}>
          Services you need <span className="req" aria-hidden>*</span>
        </legend>
        <div style={{ display: "grid", gap: 4 }}>
          {packages.map((p, i) => (
            <CheckField
              key={p.id}
             
              label={p.name}
              checked={picked.includes(p.id)}
              onChange={(e) => setPicked((x) => (e.target.checked ? [...x, p.id] : x.filter((y) => y !== p.id)))}
            />
          ))}
        </div>
        {errors.pkgs && (
          <p id="asp-pkgs-e" className="field-error">
            {errors.pkgs}
          </p>
        )}
      </fieldset>
      <TextArea name="notes" label="Anything we should know" hint="Timelines, languages, existing materials. Optional." rows={4} />
      <CheckField name="consent" label="I agree to be contacted about this request under the privacy notice." error={errors.consent} />
      <div>
        <SubmitButton busy={busy}>Send request</SubmitButton>
      </div>
    </form>
  );
}

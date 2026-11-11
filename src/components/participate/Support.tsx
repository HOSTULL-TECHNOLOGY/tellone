"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bot, Search, ShieldAlert } from "lucide-react";
import { CheckField, FormSuccess, SelectField, SubmitButton, TextArea, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { readPref, writePref } from "@/lib/prefs";

/** Opens the floating AI/WhatsApp support panel directly on the AI chat. */
export function OpenChatButton({ label = "Chat with TBH One AI" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("tbh:support", { detail: "ai" }))}>
      <Bot size={18} aria-hidden /> {label}
    </button>
  );
}

type Ticket = { number: string; category: string; subject: string; status: "Open" | "In progress" | "Resolved"; at: string; name: string };
const TKEY = "tbh-tickets";
const readTickets = (): Ticket[] => {
  try {
    const v = JSON.parse(readPref(TKEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export const SUPPORT_CATEGORIES = ["Membership and sign-in", "Project funding and receipts", "Shop order", "Impact Points and rewards", "Leader roles and payments", "Events", "Data and privacy request", "Something else"];

/** Help desk: create a ticket (number stored locally) and look up its status. PROTOTYPE. */
export function SupportDesk() {
  const [f, setF] = useState({ category: "", subject: "", details: "", name: "", contact: "", order: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [made, setMade] = useState<Ticket | null>(null);
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<Ticket | null | "none">(null);
  const up = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  // /support?topic=story comes from the homepage "Share your story" button (People Speak, with consent)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("topic") === "story")
      setF((s) => ({ ...s, category: "Something else", subject: "My TBH One story (for People Speak)", details: s.details || "I'd like to share my story. I consent to TBH One contacting me to agree how it may be published." }));
  }, []);

  return (
    <div className="split">
      <div>
        <h2 className="h-sub">Open a ticket</h2>
        {made ? (
          <div className="form-panel">
            <FormSuccess title={`Ticket ${made.number} created`}>We reply within one working day by SMS or email. Keep this number to check progress.</FormSuccess>
            <button type="button" className="btn btn-ghost" onClick={() => { setMade(null); setF({ category: "", subject: "", details: "", name: "", contact: "", order: "" }); }}>
              Open another ticket
            </button>
          </div>
        ) : (
          <form
            className="form-panel"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const x: Record<string, string> = {};
              if (!f.category) x.category = "Choose what your question is about.";
              if (f.subject.trim().length < 4) x.subject = "Give your ticket a short subject.";
              if (f.details.trim().length < 15) x.details = "Tell us a little more (at least 15 characters).";
              if (!f.name.trim()) x.name = "Enter your name.";
              if (!isEmail(f.contact) && !isNgPhone(f.contact)) x.contact = "Enter an email address or Nigerian mobile number so we can reply.";
              setErr(x);
              if (Object.keys(x).length) return;
              setBusy(true);
              await simulate();
              const t: Ticket = { number: `TKT-${Math.floor(100000 + Math.random() * 900000)}`, category: f.category, subject: f.subject.trim(), status: "Open", at: new Date().toISOString(), name: f.name.trim() };
              writePref(TKEY, JSON.stringify([t, ...readTickets()]));
              setBusy(false);
              setMade(t);
            }}
          >
            <div className="form-grid form-grid-2">
              <SelectField label="What is it about?" options={SUPPORT_CATEGORIES} placeholder="Choose a topic" value={f.category} onChange={(e) => up("category", e.target.value)} error={err.category} required className="span-2" />
              {f.category === "Shop order" && <TextField label="Order number (optional)" placeholder="TBH-26-123456" value={f.order} onChange={(e) => up("order", e.target.value)} className="span-2" />}
              <TextField label="Subject" value={f.subject} onChange={(e) => up("subject", e.target.value)} error={err.subject} required className="span-2" />
              <TextArea label="Details" value={f.details} onChange={(e) => up("details", e.target.value)} error={err.details} required hint="Don't include passwords, card numbers or your voter's card number." />
              <TextField label="Your name" autoComplete="name" value={f.name} onChange={(e) => up("name", e.target.value)} error={err.name} required />
              <TextField label="Email or mobile number" value={f.contact} onChange={(e) => up("contact", e.target.value)} error={err.contact} required />
            </div>
            <div className="form-actions">
              <SubmitButton busy={busy}>Submit ticket</SubmitButton>
            </div>
          </form>
        )}
      </div>
      <div>
        <h2 className="h-sub">Check a ticket</h2>
        <form
          className="form-panel"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const t = readTickets().find((x) => x.number.toUpperCase() === lookup.trim().toUpperCase());
            setFound(t ?? "none");
          }}
        >
          <TextField label="Ticket number" placeholder="TKT-123456" value={lookup} onChange={(e) => setLookup(e.target.value)} />
          <div className="form-actions">
            <button type="submit" className="btn btn-outline">
              <Search size={16} aria-hidden /> Check status
            </button>
          </div>
          <div aria-live="polite">
            {found === "none" && (
              <p className="field-error">
                <AlertCircle size={16} aria-hidden /> We couldn&apos;t find that ticket in this browser. Check the number, or contact support.
              </p>
            )}
            {found && found !== "none" && (
              <dl className="facts">
                <div><dt>Ticket</dt><dd>{found.number}</dd></div>
                <div><dt>Status</dt><dd><span className="badge badge-info">{found.status}</span></dd></div>
                <div><dt>Topic</dt><dd>{found.category}</dd></div>
                <div><dt>Subject</dt><dd>{found.subject}</dd></div>
                <div><dt>Opened</dt><dd>{new Date(found.at).toLocaleString("en-GB", { timeZone: "Africa/Lagos" })} WAT</dd></div>
              </dl>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const TYPES = ["Safety — someone is at risk", "Harassment or abuse", "Sexual abuse or exploitation", "Fraud or someone asking for money", "Fake TBH One account or scam", "Misuse of personal data", "Violence or threats at an event", "Other concern"];
const SEVERITY = [
  { v: "Critical", text: "Someone is in danger now or was seriously harmed — response within 1 hour" },
  { v: "High", text: "Serious harm or risk, not immediate — response within 24 hours" },
  { v: "Low", text: "A concern to look into — response within 72 hours" },
];

/** Report a Concern (SH-10, SG-1/SG-2). Anonymous option hides contact fields. PROTOTYPE: nothing is sent. */
export function ReportForm() {
  const [f, setF] = useState({ type: "", severity: "", where: "", when: "", details: "", name: "", contact: "" });
  const [anon, setAnon] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<{ ref: string; severity: string } | null>(null);
  const up = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const sexual = f.type.startsWith("Sexual");

  if (ref)
    return (
      <div className="form-panel" role="status">
        <FormSuccess title={`Report received — reference ${ref.ref}`}>
          {ref.severity === "Critical" ? "Critical reports alert the National Safeguarding Lead immediately and are answered within 1 hour." : ref.severity === "High" ? "High-severity reports are answered within 24 hours." : "We'll look into it within 72 hours."}{" "}
          {anon ? "You reported anonymously, so we can't contact you — keep this reference if you want to add information later." : "A safeguarding focal point will contact you using the details you gave."}
        </FormSuccess>
        <Notice tone="warn" title="Prototype">
          This report was not sent anywhere. In production it goes straight to the restricted safeguarding queue.
        </Notice>
      </div>
    );

  return (
    <form
      className="form-panel"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const x: Record<string, string> = {};
        if (!f.type) x.type = "Choose the kind of concern.";
        if (!f.severity) x.severity = "Choose how urgent it is.";
        if (f.details.trim().length < 20) x.details = "Describe what happened (at least 20 characters).";
        if (!anon && !isEmail(f.contact) && !isNgPhone(f.contact)) x.contact = "Enter an email or Nigerian mobile number, or choose to report anonymously.";
        if (!ok) x.ok = "Please confirm before sending.";
        setErr(x);
        if (Object.keys(x).length) return;
        setBusy(true);
        await simulate(800);
        setBusy(false);
        setRef({ ref: `SG-${Date.now().toString().slice(-7)}`, severity: f.severity });
      }}
    >
      <Notice tone="danger" title="If someone is in immediate danger">
        Call the police or emergency services first (112 from any phone in Nigeria, or 767 in Lagos), then report here.
      </Notice>
      <SelectField label="What kind of concern is it?" options={TYPES} placeholder="Choose one" value={f.type} onChange={(e) => up("type", e.target.value)} error={err.type} required />
      {sexual && (
        <Notice tone="info" title="Handled by the national lead only">
          Reports of sexual abuse or exploitation go straight to the National Safeguarding Lead. Ward and state leaders never see the details.
        </Notice>
      )}
      <fieldset className="plain">
        <legend>
          How urgent is it?<span className="req" aria-hidden> *</span>
        </legend>
        <div className="sev-list">
          {SEVERITY.map((s) => (
            <label key={s.v} className="sev">
              <input type="radio" name="severity" checked={f.severity === s.v} onChange={() => up("severity", s.v)} />
              <span>
                <strong>{s.v}</strong> <span className="small muted">{s.text}</span>
              </span>
            </label>
          ))}
        </div>
        {err.severity && (
          <p className="field-error">
            <AlertCircle size={16} aria-hidden /> {err.severity}
          </p>
        )}
      </fieldset>
      <div className="form-grid form-grid-2">
        <TextField label="Where did it happen?" placeholder="State, LGA, event or website" value={f.where} onChange={(e) => up("where", e.target.value)} />
        <TextField label="When?" type="date" value={f.when} onChange={(e) => up("when", e.target.value)} />
        <TextArea label="What happened?" value={f.details} onChange={(e) => up("details", e.target.value)} error={err.details} required className="span-2" hint="Include names of TBH One accounts or leaders involved if you know them. You don't need proof to report." />
      </div>
      <CheckField label="Report anonymously (we won't ask who you are)" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
      {!anon && (
        <div className="form-grid form-grid-2">
          <TextField label="Your name (optional)" value={f.name} onChange={(e) => up("name", e.target.value)} />
          <TextField label="Email or mobile number" value={f.contact} onChange={(e) => up("contact", e.target.value)} error={err.contact} required hint="Only the safeguarding team sees this." />
        </div>
      )}
      <CheckField label="I understand false reports can harm people, and this report is made in good faith." checked={ok} onChange={(e) => setOk(e.target.checked)} error={err.ok} />
      <div className="form-actions">
        <SubmitButton busy={busy}>
          <ShieldAlert size={16} aria-hidden /> Send report
        </SubmitButton>
      </div>
    </form>
  );
}

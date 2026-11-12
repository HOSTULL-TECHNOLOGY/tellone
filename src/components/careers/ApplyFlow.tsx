"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Dot } from "lucide-react";
import { CheckField, SelectField, SubmitButton, TextArea, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import { DEMO_OTP, findUser, registerDemoUser, signIn, useSession, type DemoUser } from "@/lib/auth";
import { loadWards, readApplications, readFound, saveApplication, saveFound, type Application, type FoundWard, type Ward } from "@/lib/wards";
import { edges, flow, messages, vision, WAVE } from "@/data/careers";
import { readVision, visionTotals } from "./VisionMeter";
import { WardFinder } from "./WardFinder";

/**
 * Sign-up and application flow (CAR-2, CAR-4, CAR-15, CAR-16, CAR-21). New visitors register as members first and
 * return to the application automatically; members go straight to it. SIMULATED: nothing leaves the browser.
 */
type Hrefs = { careers: string; street: string; diaspora: string; dashboard: string; boost: string; terms: string; privacy: string; conduct: string; login: string };

export function ApplyFlow({ hrefs }: { hrefs: Hrefs }) {
  const { ready, user } = useSession();
  const [ward, setWard] = useState<Ward | FoundWard | null>(null);
  const [wardMissing, setWardMissing] = useState(false);
  const [justRegistered, setJustRegistered] = useState<DemoUser | null>(null);

  // The ward found by the finder (?ward=… or remembered) carries into registration and the application
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("ward");
    if (id) {
      loadWards().then(({ wards }) => {
        const w = wards.find((x) => x.id === id);
        if (w) {
          setWard(w);
          saveFound(w);
        } else setWardMissing(true);
      });
    } else {
      const f = readFound();
      if (f) loadWards().then(({ wards }) => setWard(wards.find((x) => x.id === f.id) ?? f));
    }
  }, []);

  if (!ready) return <div className="ap-card" aria-busy="true" />;
  if (Date.now() > new Date(`${WAVE.closes}T23:59:59+01:00`).getTime())
    return (
      <div className="ap-card">
        <Notice tone="warn" title="Wave 1 is closed">
          {edges.closed}
        </Notice>
      </div>
    );

  if (!user || justRegistered) {
    return justRegistered ? (
      <Welcome name={justRegistered.firstName} onContinue={() => setJustRegistered(null)} />
    ) : (
      <Register ward={ward} setWard={setWard} wardMissing={wardMissing} hrefs={hrefs} onDone={(u) => setJustRegistered(u)} />
    );
  }
  return <Application user={user} ward={ward} setWard={setWard} wardMissing={wardMissing} hrefs={hrefs} />;
}

/* --------------------------------------------------------------------------------------------- Step 1: register */
function Register({ ward, setWard, wardMissing, hrefs, onDone }: { ward: Ward | FoundWard | null; setWard: (w: Ward) => void; wardMissing: boolean; hrefs: Hrefs; onDone: (u: DemoUser) => void }) {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [f, setF] = useState({ first: "", last: "", lang: "English" });
  const [ok18, setOk18] = useState(false);
  const [updates, setUpdates] = useState(true);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const masked = phone.replace(/\D/g, "").replace(/^234/, "0").replace(/^(\d{4})\d{3}(\d{4})$/, "$1 *** $2");
  const STEPS = ["Phone", "Code", "About you", "Consent"];
  return (
    <div className="ap-card">
      <ol className="ap-steps" aria-label="Registration steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className={i < step ? "is-done" : ""}>
            {s}
          </li>
        ))}
      </ol>
      {wardMissing && <Notice tone="warn">{edges.notFound}</Notice>}

      {step === 0 && (
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isNgPhone(phone)) return setErr({ phone: "Enter a Nigerian mobile number, for example 0803 123 4521." });
            setErr({});
            setBusy(true);
            await simulate(500);
            setBusy(false);
            setStep(1);
          }}
        >
          <p className="ap-lead">
            <strong>{flow.phone.title}</strong> {flow.phone.text}
          </p>
          <TextField label="Phone number" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={err.phone} required />
          <SubmitButton busy={busy}>{flow.phone.button}</SubmitButton>
          <p className="small muted">
            Already a member? <Link href={hrefs.login}>Log in</Link> and your details are filled in.
          </p>
        </form>
      )}

      {step === 1 && (
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (code !== DEMO_OTP) return setErr({ code: "That code is not correct. Check the SMS and try again." });
            setErr({});
            const existing = findUser(phone);
            if (existing) {
              signIn(existing);
              toast(`Welcome back, ${existing.firstName}. Your details are already filled in.`);
              return;
            }
            setStep(2);
          }}
        >
          <p>{flow.code.text(masked || "your phone")}</p>
          <TextField label="6-digit code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="otp-field" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={err.code} hint={<>Demo code: <strong>{DEMO_OTP}</strong></>} required />
          <SubmitButton busy={false}>{flow.code.button}</SubmitButton>
        </form>
      )}

      {step === 2 && (
        <form
          className="form-grid"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (!f.first.trim()) x.first = "Enter your first name.";
            if (!f.last.trim()) x.last = "Enter your last name.";
            if (!ward) x.ward = "Find your ward first: use your location, search your area or pick from the list.";
            setErr(x);
            if (!Object.keys(x).length) setStep(3);
          }}
        >
          <div className="form-row">
            <TextField label="First name" autoComplete="given-name" value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} error={err.first} required />
            <TextField label="Last name" autoComplete="family-name" value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} error={err.last} required />
          </div>
          <div className="ap-ward">
            <p className="ap-label">Find your ward</p>
            {ward ? (
              <p className="ap-ward-chosen">
                <strong>{ward.name}</strong>, {ward.lga} LGA, {ward.stateName} State{" "}
                <span className="small muted">(filled in from the ward finder)</span>
              </p>
            ) : (
              <p className="small muted">Use my location, search my area, or pick from the list.</p>
            )}
            <details open={!ward}>
              <summary className="small">{ward ? "Change it" : "Open the ward finder"}</summary>
              <WardFinder applyHref="#" streetHref={hrefs.street} shareUrl="www.tbhone.com.ng/careers" compact onSelect={setWard} />
            </details>
            {err.ward && <p className="field-error">{err.ward}</p>}
          </div>
          <SelectField label="Language" options={["English", "Pidgin", "Yorùbá", "Hausa", "Igbo"]} value={f.lang} onChange={(e) => setF({ ...f, lang: e.target.value })} />
          <SubmitButton busy={false}>Next</SubmitButton>
        </form>
      )}

      {step === 3 && (
        <form
          className="form-grid"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!ok18) return setErr({ ok18: "You must be 18 or older and agree to the Terms and Privacy Policy to register." });
            setBusy(true);
            await simulate(600);
            const w = ward!;
            const u = registerDemoUser({ firstName: f.first.trim(), lastName: f.last.trim(), phone, email: `${phone.replace(/\D/g, "")}@member.demo`, state: w.stateName, lga: w.lga, ward: w.name });
            setBusy(false);
            onDone(u);
          }}
        >
          <CheckField
            label={
              <>
                I’m 18 or older and agree to the <a href={hrefs.terms} target="_blank" rel="noopener">Terms of Service</a> and <a href={hrefs.privacy} target="_blank" rel="noopener">Privacy Policy</a> (required)
              </>
            }
            checked={ok18}
            onChange={(e) => setOk18(e.target.checked)}
            error={err.ok18}
          />
          <CheckField label={flow.consent.updates} checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
          <SubmitButton busy={busy}>{flow.consent.button}</SubmitButton>
        </form>
      )}
    </div>
  );
}

function Welcome({ name, onContinue }: { name: string; onContinue: () => void }) {
  return (
    <div className="ap-card ap-welcome">
      <CheckCircle2 size={44} aria-hidden />
      <h2>{flow.welcome.title(name)}</h2>
      <p>{flow.welcome.text}</p>
      <button type="button" className="btn btn-primary btn-lg" onClick={onContinue}>
        {flow.welcome.button}
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------------------- Step 2: the application */
const age = (dob: string) => {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return -1;
  const now = new Date();
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
};
const sameName = (a: string, first: string, last: string) => {
  const t = a.toLowerCase().split(/[\s,.-]+/).filter(Boolean);
  return t.includes(first.toLowerCase()) && t.includes(last.toLowerCase());
};

function Application({ user, ward, setWard, wardMissing, hrefs }: { user: DemoUser; ward: Ward | FoundWard | null; setWard: (w: Ward) => void; wardMissing: boolean; hrefs: Hrefs }) {
  const toast = useToast();
  const [done, setDone] = useState<Application | null>(null);
  const [existing, setExisting] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [f, setF] = useState({ live: false, years: "", streets: "", dob: "", occupation: "", languages: "", device: "Android", groups: [] as string[], groupYears: "", helped: "", eName: "", eRole: flow.endorserRoles[0], ePhone: "", idType: flow.idTypes[0], idNumber: "", idPhoto: false, selfie: false, payType: "bank", bank: "", account: "", accountName: "", momo: "", hours: flow.hours[1], pledges: [false, false, false], socialConsent: false });
  useEffect(() => {
    const mine = readApplications().find((a) => a.userId === user.id);
    if (mine) setExisting(mine);
  }, [user.id]);
  const set = (k: keyof typeof f, v: unknown) => setF((x) => ({ ...x, [k]: v }));

  if (user.country)
    return (
      <div className="ap-card">
        <Notice tone="warn" title="Ward leader places are for people living in Nigeria">
          {edges.abroad} <Link href={hrefs.diaspora}>Find your diaspora chapter</Link>
        </Notice>
      </div>
    );
  if (done) return <Confirmation app={done} name={user.firstName} hrefs={hrefs} />;
  if (existing)
    return (
      <div className="ap-card">
        <Notice tone="info" title="You’ve already applied">
          {edges.duplicate(existing.ref)}
        </Notice>
        <Tracker stage={existing.stage} />
        <Link href={hrefs.dashboard} className="btn btn-primary">
          Open your dashboard
        </Link>
      </div>
    );

  const taken = ward && "status" in ward && ward.status === 1;
  const otherState = ward && user.state && user.state !== ward.stateName && !(user.state === "FCT" && ward.state === "fct");

  return (
    <form
      className="ap-card ap-form"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const x: Record<string, string> = {};
        if (!ward) x.ward = edges.notFound;
        else if (taken) x.ward = edges.taken;
        if (!f.live) x.live = "Confirm that you live in this ward.";
        const a = age(f.dob);
        if (a < 0) x.dob = "Enter your date of birth.";
        else if (a < 18) x.dob = edges.under18;
        if (!f.occupation.trim()) x.occupation = "Enter your occupation.";
        if (f.helped.trim().split(/\s+/).length < 6) x.helped = "In two sentences, tell us how you have helped your community.";
        if (!f.eName.trim()) x.eName = "Enter your endorser's name.";
        if (!isNgPhone(f.ePhone)) x.ePhone = "Enter your endorser's Nigerian mobile number. They receive an SMS to confirm.";
        if (f.idNumber.trim().length < 6) x.idNumber = "Enter your ID number.";
        if (!f.idPhoto) x.idPhoto = "Upload a photo of your ID.";
        if (!f.selfie) x.selfie = "Upload a selfie holding your ID.";
        if (f.payType === "bank") {
          if (!f.bank) x.bank = "Choose your bank.";
          if (!/^\d{10}$/.test(f.account)) x.account = "Enter your 10-digit account number.";
          if (!sameName(f.accountName, user.firstName, user.lastName)) x.accountName = edges.nameMismatch;
        } else if (!isNgPhone(f.momo)) x.momo = "Enter the mobile-money number in your name.";
        if (f.pledges.some((p) => !p)) x.pledges = "Tick all three pledges to apply.";
        setErr(x);
        if (Object.keys(x).length) {
          document.querySelector(".field-error")?.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
        setBusy(true);
        await simulate(900);
        const ref = `TBH-WL-${String(287 + readApplications().length).padStart(5, "0")}`;
        const app: Application = {
          ref,
          userId: user.id,
          ward: { id: ward!.id, name: ward!.name, lga: ward!.lga, state: ward!.state, stateName: ward!.stateName },
          at: new Date().toISOString(),
          endorser: { name: f.eName.trim(), role: f.eRole, phone: f.ePhone.trim() },
          stage: 2,
          vision: visionTotals(readVision(user.id)).verified,
        };
        saveApplication(app);
        setBusy(false);
        setDone(app);
        toast(`Application ${ref} received.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <p className="ap-lead">
        Applying as <strong>{user.firstName} {user.lastName}</strong> · {user.phone.replace(/^(\d{4})\d{3}(\d{4})$/, "$1 *** $2")}
      </p>

      <fieldset className="ap-sec">
        <legend>Your ward</legend>
        {wardMissing && <p className="field-error">{edges.notFound}</p>}
        {ward ? (
          <p className="ap-ward-chosen">
            <strong>{ward.name}</strong>, {ward.lga} LGA, {ward.stateName} State <span className="small muted">(filled in from the ward finder; change it if wrong)</span>
          </p>
        ) : (
          <p className="small muted">Find the ward you live in.</p>
        )}
        {otherState && <Notice tone="warn">{`Your member details say ${user.state}, but you chose a ward in ${ward!.stateName}. Which is your home ward? Your ward is where you live.`}</Notice>}
        <details open={!ward}>
          <summary className="small">{ward ? "Change the ward" : "Open the ward finder"}</summary>
          <WardFinder applyHref="#" streetHref={hrefs.street} shareUrl="www.tbhone.com.ng/careers" compact onSelect={setWard} />
        </details>
        {ward && (
          <p className={`ap-auto ${taken ? "is-taken" : ""}`}>
            Does your ward already have a TBH One leader? <strong>{taken ? "Yes" : "No — this ward is open"}</strong> <span className="small muted">(checked automatically)</span>
          </p>
        )}
        {taken && (
          <Notice tone="warn" title="This ward already has a leader">
            {edges.taken}{" "}
            <button type="button" className="linklike" onClick={() => toast(`You’re on the waiting list for a second-leader place in ${ward!.name}.`)}>
              Join the waiting list
            </button>{" "}
            · <Link href={hrefs.street}>Become a street leader from 23 November</Link>
          </Notice>
        )}
        {err.ward && !taken && <p className="field-error">{err.ward}</p>}
        <CheckField label="I live in this ward" checked={f.live} onChange={(e) => set("live", e.target.checked)} error={err.live} />
        <div className="form-row">
          <TextField label="Years living in the ward" type="number" min={0} value={f.years} onChange={(e) => set("years", e.target.value)} />
          <TextField label="Approximate number of streets" type="number" min={1} value={f.streets} onChange={(e) => set("streets", e.target.value)} />
        </div>
      </fieldset>

      <fieldset className="ap-sec">
        <legend>About you</legend>
        <div className="form-row">
          <TextField label="Date of birth (must be 18+)" type="date" value={f.dob} onChange={(e) => set("dob", e.target.value)} error={err.dob} required />
          <TextField label="Occupation" value={f.occupation} onChange={(e) => set("occupation", e.target.value)} error={err.occupation} required />
        </div>
        <div className="form-row">
          <TextField label="Languages you speak" placeholder="e.g. Hausa, English" value={f.languages} onChange={(e) => set("languages", e.target.value)} />
          <SelectField label="Phone type" options={["Android", "iPhone", "Laptop"]} value={f.device} onChange={(e) => set("device", e.target.value)} />
        </div>
      </fieldset>

      <fieldset className="ap-sec">
        <legend>Community standing</legend>
        <p className="ap-label">Groups you belong to or lead</p>
        <div className="ap-chips">
          {flow.groups.map((g) => (
            <label key={g} className="ap-chip">
              <input type="checkbox" checked={f.groups.includes(g)} onChange={(e) => set("groups", e.target.checked ? [...f.groups, g] : f.groups.filter((x) => x !== g))} />
              <span>{g}</span>
            </label>
          ))}
        </div>
        <TextField label="Years in that role" type="number" min={0} value={f.groupYears} onChange={(e) => set("groupYears", e.target.value)} />
        <TextArea label="In two sentences, how have you helped your community?" rows={3} value={f.helped} onChange={(e) => set("helped", e.target.value)} error={err.helped} required />
      </fieldset>

      <fieldset className="ap-sec">
        <legend>Endorsement</legend>
        <div className="form-row">
          <TextField label="Endorser’s name" value={f.eName} onChange={(e) => set("eName", e.target.value)} error={err.eName} required />
          <SelectField label="Their role" options={flow.endorserRoles} value={f.eRole} onChange={(e) => set("eRole", e.target.value)} />
        </div>
        <TextField label="Their phone number" type="tel" inputMode="tel" value={f.ePhone} onChange={(e) => set("ePhone", e.target.value)} error={err.ePhone} hint="They receive an SMS to confirm." required />
      </fieldset>

      <fieldset className="ap-sec">
        <legend>Verification</legend>
        <div className="form-row">
          <SelectField label="ID type" options={flow.idTypes} value={f.idType} onChange={(e) => set("idType", e.target.value)} />
          <TextField label="ID number" value={f.idNumber} onChange={(e) => set("idNumber", e.target.value)} error={err.idNumber} required />
        </div>
        <div className="form-row">
          <FileField label="Photo of ID" error={err.idPhoto} onChange={(v) => set("idPhoto", v)} />
          <FileField label="Selfie holding your ID" error={err.selfie} onChange={(v) => set("selfie", v)} capture />
        </div>
        <p className="small muted">ID photos and selfies are stored encrypted and kept for the campaign period plus 12 months, then deleted.</p>
      </fieldset>

      <fieldset className="ap-sec">
        <legend>Payment</legend>
        <div className="ap-chips" role="radiogroup" aria-label="How we pay you">
          {[
            ["bank", "Bank account"],
            ["momo", "Mobile money"],
          ].map(([k, l]) => (
            <label key={k} className="ap-chip">
              <input type="radio" name="pay" checked={f.payType === k} onChange={() => set("payType", k)} />
              <span>{l}</span>
            </label>
          ))}
        </div>
        {f.payType === "bank" ? (
          <>
            <div className="form-row">
              <SelectField label="Bank name" placeholder="Choose your bank" options={["Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank", "Fidelity Bank", "Union Bank", "Sterling Bank", "Wema Bank", "Ecobank", "FCMB", "Stanbic IBTC", "Opay", "Moniepoint", "Kuda", "PalmPay"]} value={f.bank} onChange={(e) => set("bank", e.target.value)} error={err.bank} />
              <TextField label="Account number" inputMode="numeric" maxLength={10} value={f.account} onChange={(e) => set("account", e.target.value.replace(/\D/g, ""))} error={err.account} />
            </div>
            <TextField label="Name on the account (must match your ID)" value={f.accountName} onChange={(e) => set("accountName", e.target.value)} error={err.accountName} />
          </>
        ) : (
          <TextField label="Mobile-money number (in your name)" type="tel" inputMode="tel" value={f.momo} onChange={(e) => set("momo", e.target.value)} error={err.momo} />
        )}
      </fieldset>

      <fieldset className="ap-sec">
        <legend>Availability</legend>
        <div className="ap-chips" role="radiogroup" aria-label="Hours per week you can give">
          {flow.hours.map((h) => (
            <label key={h} className="ap-chip">
              <input type="radio" name="hours" checked={f.hours === h} onChange={() => set("hours", h)} />
              <span>{h} hours a week</span>
            </label>
          ))}
        </div>
        <p className="small muted">
          Optional: your usernames on our 11 platforms earn Vision Points. <Link href={hrefs.boost}>Open the Boost panel</Link> (your current score: {visionTotals(readVision(user.id)).verified} / 100).
        </p>
      </fieldset>

      <fieldset className="ap-sec">
        <legend>Pledge</legend>
        {flow.pledges.map((p, i) => (
          <CheckField
            key={p}
            label={i === 0 ? <>I have read and will follow the <a href={hrefs.conduct} target="_blank" rel="noopener">Code of Conduct</a> <span className="small muted">(opens in a new tab)</span></> : p}
            checked={f.pledges[i]}
            onChange={(e) => set("pledges", f.pledges.map((x, j) => (j === i ? e.target.checked : x)))}
          />
        ))}
        <CheckField label={flow.pledgeOptional} checked={f.socialConsent} onChange={(e) => set("socialConsent", e.target.checked)} />
        {err.pledges && <p className="field-error">{err.pledges}</p>}
      </fieldset>

      {Object.keys(err).length > 0 && <Notice tone="danger">Please check the highlighted fields.</Notice>}
      <SubmitButton busy={busy} className="btn btn-primary btn-lg" disabled={!!taken}>
        {flow.submit}
      </SubmitButton>
      <p className="small muted">{vision.copy.fairness}</p>
    </form>
  );
}

function FileField({ label, error, onChange, capture }: { label: string; error?: string; onChange: (v: boolean) => void; capture?: boolean }) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="file" accept="image/*" {...(capture ? { capture: "user" as const } : {})} onChange={(e) => onChange(!!e.target.files?.length)} aria-invalid={!!error} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function Tracker({ stage }: { stage: number }) {
  return (
    <ol className="ap-tracker" aria-label="Your application progress">
      {flow.tracker.map((s, i) => (
        <li key={s} className={i < stage ? "is-done" : i === stage ? "is-now" : ""} aria-current={i === stage ? "step" : undefined}>
          {i < stage ? <CheckCircle2 size={18} aria-hidden /> : i === stage ? <Dot size={22} aria-hidden /> : <Circle size={16} aria-hidden />}
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function Confirmation({ app, name, hrefs }: { app: Application; name: string; hrefs: Hrefs }) {
  const fill = (m: string) => m.replace("{name}", name).replace("{ref}", app.ref).replace("{ward}", app.ward.name);
  return (
    <div className="ap-card ap-done">
      <CheckCircle2 size={44} aria-hidden />
      <h2>Application {app.ref}</h2>
      <p className="ap-lead">{flow.confirmation(name, app.ref)}</p>
      <Tracker stage={app.stage} />
      <div className="ap-sms">
        <p className="small muted">SMS sent to you</p>
        <p>{fill(messages.received)}</p>
      </div>
      <div className="form-actions">
        <Link href={hrefs.dashboard} className="btn btn-primary">
          Track it on your dashboard
        </Link>
        <Link href={hrefs.boost} className="btn btn-outline">
          Boost your application
        </Link>
      </div>
    </div>
  );
}

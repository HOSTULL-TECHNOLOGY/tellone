"use client";

import { useState } from "react";
import { FormSuccess, SubmitButton, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { readPref, writePref } from "@/lib/prefs";
import { formatNaira } from "@/lib/format";
import { bulkRate } from "@/data/shop";
import { QtyStepper } from "./BuyBox";

type Template = "tshirt" | "cap" | "banner";
const TEMPLATES: Record<Template, { label: string; colours: { name: string; fill: string; ink: string }[]; unit: number; maxChars: number }> = {
  tshirt: { label: "T-shirt", colours: [{ name: "White", fill: "#ffffff", ink: "#157103" }, { name: "Green", fill: "#157103", ink: "#ffffff" }, { name: "Black", fill: "#1b1a16", ink: "#ffffff" }], unit: 8500, maxChars: 22 },
  cap: { label: "Cap", colours: [{ name: "Green", fill: "#157103", ink: "#ffffff" }, { name: "White", fill: "#ffffff", ink: "#157103" }], unit: 6000, maxChars: 14 },
  banner: { label: "Street banner (3 m)", colours: [{ name: "White", fill: "#ffffff", ink: "#157103" }, { name: "Green", fill: "#157103", ink: "#ffffff" }], unit: 19000, maxChars: 30 },
};
const MIN_QTY = 20;

function Preview({ t, line1, line2, colour }: { t: Template; line1: string; line2: string; colour: { fill: string; ink: string } }) {
  const text1 = line1 || "Your ward name";
  const text2 = line2 || "Tell One · Bring One · Help One";
  const stroke = colour.fill === "#ffffff" ? "#b9b6aa" : "none";
  return (
    <svg viewBox="0 0 320 300" className="custom-preview" role="img" aria-label={`Preview: ${TEMPLATES[t].label} reading “${text1}”, “${text2}”`}>
      {t === "tshirt" && <path d="M105 30 55 55 25 115l42 20 14-26v170h158V109l14 26 42-20-30-60-50-25c-10 20-32 30-55 30s-45-10-55-30Z" fill={colour.fill} stroke={stroke} strokeWidth="2" />}
      {t === "cap" && (
        <g>
          <path d="M60 190c0-70 45-120 100-120s100 50 100 120Z" fill={colour.fill} stroke={stroke} strokeWidth="2" />
          <path d="M40 190h240c0 16-20 26-50 26H90c-30 0-50-10-50-26Z" fill={colour.fill} stroke={stroke === "none" ? "#0f4d02" : stroke} strokeWidth="2" />
        </g>
      )}
      {t === "banner" && (
        <g>
          <rect x="10" y="80" width="300" height="130" fill={colour.fill} stroke={stroke === "none" ? "#0f4d02" : stroke} strokeWidth="2" />
          {[20, 300].map((x) => (
            <circle key={x} cx={x} cy="92" r="4" fill="#b9b6aa" />
          ))}
        </g>
      )}
      {/* speech-bubble mark from the logo */}
      <g transform={t === "banner" ? "translate(26 102)" : t === "cap" ? "translate(140 98)" : "translate(140 92)"}>
        <rect x="0" y="0" width="40" height="30" fill="none" stroke={colour.ink} strokeWidth="4" />
        <path d="M10 30 18 40 26 30" fill="none" stroke={colour.ink} strokeWidth="4" />
        <rect x="31" y="6" width="3" height="18" fill="#fd0102" />
      </g>
      <text x={t === "banner" ? 180 : 160} y={t === "banner" ? 142 : t === "cap" ? 160 : 170} textAnchor="middle" fill={colour.ink} fontFamily="Noto Serif Display, Georgia, serif" fontWeight="800" fontSize={t === "cap" ? 18 : 20}>
        {text1}
      </text>
      <text x={t === "banner" ? 180 : 160} y={t === "banner" ? 168 : t === "cap" ? 180 : 194} textAnchor="middle" fill={colour.ink} fontFamily="Noto Sans, system-ui, sans-serif" fontWeight="600" fontSize="11">
        {text2}
      </text>
      {t === "tshirt" && (
        <text x="160" y="226" textAnchor="middle" fill={colour.ink} fontFamily="Noto Sans, system-ui, sans-serif" fontSize="9" opacity="0.85">
          #WeWillNotStealYourMoney
        </text>
      )}
    </svg>
  );
}

/** EC-5 custom designs from approved templates; brand approval within 24 hours before printing. */
export function CustomDesigner() {
  const [t, setT] = useState<Template>("tshirt");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [colourName, setColourName] = useState("White");
  const [qty, setQty] = useState(MIN_QTY);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const tpl = TEMPLATES[t];
  const colour = tpl.colours.find((c) => c.name === colourName) ?? tpl.colours[0];
  const est = Math.round(tpl.unit * qty * (1 - bulkRate(qty)));

  if (ref)
    return (
      <FormSuccess title={`Design request ${ref} submitted`}>
        The brand team checks every custom design against the brand kit and official hashtags and replies within 24 hours. Printing starts only after approval and payment. (Prototype: request saved in this browser only.)
      </FormSuccess>
    );

  return (
    <div className="custom split split-even">
      <div className="custom-stage">
        <Preview t={t} line1={line1} line2={line2} colour={colour} />
        <p className="small muted">Live preview. Final artwork is prepared by the brand team from approved templates.</p>
      </div>
      <form
        className="form-panel"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          const ne: Record<string, string> = {};
          if (line1.trim().length < 3) ne.line1 = "Enter the ward, LGA or chapter name (at least 3 characters).";
          if (qty < MIN_QTY) ne.qty = `Custom designs start at ${MIN_QTY} pieces.`;
          if (name.trim().length < 3) ne.name = "Enter your full name.";
          if (!isNgPhone(phone)) ne.phone = "Enter a Nigerian mobile number.";
          setErrs(ne);
          if (Object.keys(ne).length) return;
          setBusy(true);
          await simulate();
          const r = `CUS-${Date.now().toString().slice(-6)}`;
          let prev: unknown[] = [];
          try {
            prev = JSON.parse(readPref("tbh-custom-requests") ?? "[]");
          } catch {}
          writePref("tbh-custom-requests", JSON.stringify([{ ref: r, template: t, line1, line2, colour: colourName, qty, name, phone, at: new Date().toISOString(), status: "Awaiting brand approval" }, ...prev]));
          setRef(r);
        }}
      >
        <fieldset className="plain">
          <legend>1. Choose an approved template</legend>
          <div className="choice-row">
            {(Object.keys(TEMPLATES) as Template[]).map((k) => (
              <label key={k} className="choice">
                <input
                  type="radio"
                  name="tpl"
                  checked={t === k}
                  onChange={() => {
                    setT(k);
                    setColourName(TEMPLATES[k].colours[0].name);
                  }}
                />
                <span>{TEMPLATES[k].label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="plain">
          <legend>2. Add your text</legend>
          <TextField label="Ward, LGA or chapter name" required maxLength={tpl.maxChars} value={line1} onChange={(e) => setLine1(e.target.value)} error={errs.line1} hint={`${line1.length}/${tpl.maxChars} characters`} />
          <TextField label="Second line (optional)" maxLength={34} value={line2} onChange={(e) => setLine2(e.target.value)} hint="Defaults to “Tell One · Bring One · Help One”." />
        </fieldset>
        <fieldset className="plain">
          <legend>3. Colour</legend>
          <div className="choice-row">
            {tpl.colours.map((c) => (
              <label key={c.name} className="choice">
                <input type="radio" name="col" checked={colourName === c.name} onChange={() => setColourName(c.name)} />
                <span>
                  <i className="swatch" style={{ background: c.fill }} aria-hidden /> {c.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="plain">
          <legend>4. Quantity (minimum {MIN_QTY})</legend>
          <QtyStepper value={qty} onChange={setQty} min={1} max={5000} label="Custom design quantity" />
          {errs.qty && <p className="field-error">{errs.qty}</p>}
          <p className="small">
            Estimated {formatNaira(est)} <span className="chip chip-demo">Demo data</span>
            {bulkRate(qty) > 0 && <span className="muted"> — includes {Math.round(bulkRate(qty) * 100)}% bulk pricing</span>}
          </p>
        </fieldset>
        <div className="form-grid form-grid-2">
          <TextField label="Your name" required value={name} onChange={(e) => setName(e.target.value)} error={errs.name} autoComplete="name" />
          <TextField label="Mobile number" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errs.phone} autoComplete="tel" />
        </div>
        <SubmitButton busy={busy}>Submit for brand approval</SubmitButton>
      </form>
    </div>
  );
}

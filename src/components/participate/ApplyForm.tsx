"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { CheckField, FormSuccess, SelectField, SubmitButton, TextArea, TextField, isEmail, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { readPref, writePref } from "@/lib/prefs";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "checkboxes" | "check" | "url" | "number";
  required?: boolean;
  options?: string[];
  hint?: string;
  placeholder?: string;
  span?: boolean; // full width in a two-column grid
};

/**
 * Configurable application / enquiry form used across Get Involved, Opportunities and Partners.
 * Validates inline, shows a loading state, and confirms with a reference number.
 * PROTOTYPE: submissions are kept in this browser only (localStorage "tbh-applications").
 */
export function ApplyForm({
  fields,
  submitLabel,
  successTitle,
  successText,
  refPrefix,
  kind,
}: {
  fields: FieldDef[];
  submitLabel: string;
  successTitle: string;
  successText: string;
  refPrefix: string;
  kind: string;
}) {
  const [values, setValues] = useState<Record<string, string | string[] | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  const set = (k: string, v: string | string[] | boolean) => setValues((s) => ({ ...s, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name];
      const empty = v === undefined || v === "" || v === false || (Array.isArray(v) && v.length === 0);
      if (f.required && empty) {
        e[f.name] = f.type === "check" ? "Please tick this box to continue." : f.type === "checkboxes" ? "Choose at least one option." : `Enter your ${f.label.toLowerCase()}.`;
        continue;
      }
      if (!empty && f.type === "email" && !isEmail(String(v))) e[f.name] = "Enter a valid email address, for example name@example.com.";
      if (!empty && f.type === "tel" && !isNgPhone(String(v))) e[f.name] = "Enter a Nigerian mobile number, for example 0803 123 4567.";
      if (!empty && f.type === "url" && !/^https?:\/\/\S+\.\S+/.test(String(v))) e[f.name] = "Enter a full link starting with https://";
    }
    return e;
  }

  if (ref)
    return (
      <div className="form-panel">
        <FormSuccess title={successTitle}>
          {successText} Your reference is <strong>{ref}</strong>.
        </FormSuccess>
        <Notice tone="warn" title="Prototype">
          Saved in this browser only. In production the application goes to the vetting queue and you get an SMS or email confirmation.
        </Notice>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setRef(null);
            setValues({});
          }}
        >
          Submit another
        </button>
      </div>
    );

  return (
    <form
      className="form-panel"
      noValidate
      onSubmit={async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) {
          const first = fields.find((f) => e[f.name]);
          if (first) document.getElementsByName(first.name)[0]?.focus();
          return;
        }
        setBusy(true);
        await simulate();
        const r = `${refPrefix}-${String(Math.floor(100000 + Math.random() * 900000))}`;
        try {
          const all = JSON.parse(readPref("tbh-applications") ?? "[]");
          writePref("tbh-applications", JSON.stringify([{ ref: r, kind, at: new Date().toISOString(), values }, ...(Array.isArray(all) ? all : [])].slice(0, 50)));
        } catch {
          /* storage unavailable: the confirmation still shows */
        }
        setBusy(false);
        setRef(r);
      }}
    >
      {Object.keys(errors).length > 0 && (
        <p className="field-error" role="alert">
          <AlertCircle size={16} aria-hidden /> Please fix the {Object.keys(errors).length === 1 ? "highlighted field" : `${Object.keys(errors).length} highlighted fields`}.
        </p>
      )}
      <div className="form-grid form-grid-2">
        {fields.map((f) => {
          const common = { name: f.name, required: f.required, error: errors[f.name], hint: f.hint };
          const cls = f.span || f.type === "textarea" || f.type === "checkboxes" || f.type === "check" ? "span-2" : "";
          if (f.type === "select")
            return <SelectField key={f.name} {...common} className={cls} label={f.label} options={f.options ?? []} placeholder="Choose…" value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
          if (f.type === "textarea")
            return <TextArea key={f.name} {...common} className={cls} label={f.label} placeholder={f.placeholder} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
          if (f.type === "check")
            return <CheckField key={f.name} name={f.name} className={cls} label={f.label} error={errors[f.name]} checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />;
          if (f.type === "checkboxes") {
            const cur = (values[f.name] as string[]) ?? [];
            return (
              <fieldset key={f.name} className={`plain ${cls}`}>
                <legend>
                  {f.label}
                  {f.required && <span className="req" aria-hidden> *</span>}
                </legend>
                <div className="choice-row">
                  {(f.options ?? []).map((o) => (
                    <label key={o} className="choice">
                      <input type="checkbox" name={f.name} checked={cur.includes(o)} onChange={(e) => set(f.name, e.target.checked ? [...cur, o] : cur.filter((x) => x !== o))} />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
                {f.hint && <p className="field-hint">{f.hint}</p>}
                {errors[f.name] && (
                  <p className="field-error">
                    <AlertCircle size={16} aria-hidden /> {errors[f.name]}
                  </p>
                )}
              </fieldset>
            );
          }
          return (
            <TextField
              key={f.name}
              {...common}
              className={cls}
              label={f.label}
              type={f.type === "number" ? "number" : f.type}
              inputMode={f.type === "tel" ? "tel" : f.type === "number" ? "numeric" : undefined}
              autoComplete={f.type === "email" ? "email" : f.type === "tel" ? "tel" : undefined}
              placeholder={f.placeholder}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            />
          );
        })}
      </div>
      <div className="form-actions">
        <SubmitButton busy={busy}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

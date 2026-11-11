"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type Base = { label: string; error?: string; hint?: ReactNode; required?: boolean };

/** Labelled input with inline error, hint and required marker. */
export function TextField({ label, error, hint, required, className = "", ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = rest.id ?? autoId; // a caller-supplied id must keep the label linked
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden> *</span>}
      </label>
      <input id={id} className="input" required={required} aria-invalid={!!error} aria-describedby={`${error ? `${id}-e` : ""} ${hint ? `${id}-h` : ""}`.trim() || undefined} {...rest} />
      {hint && (
        <p id={`${id}-h`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-e`} className="field-error">
          <AlertCircle size={16} aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({ label, error, hint, required, className = "", ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const id = rest.id ?? autoId; // a caller-supplied id must keep the label linked
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden> *</span>}
      </label>
      <textarea id={id} className="input textarea" required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} {...rest} />
      {hint && (
        <p id={`${id}-h`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-e`} className="field-error">
          <AlertCircle size={16} aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({ label, error, hint, required, options, placeholder, className = "", ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: (string | { value: string; label: string })[]; placeholder?: string }) {
  const autoId = useId();
  const id = rest.id ?? autoId; // a caller-supplied id must keep the label linked
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden> *</span>}
      </label>
      <select id={id} className="input" required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          );
        })}
      </select>
      {hint && <p className="field-hint">{hint}</p>}
      {error && (
        <p id={`${id}-e`} className="field-error">
          <AlertCircle size={16} aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function CheckField({ label, error, className = "", ...rest }: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = rest.id ?? autoId; // a caller-supplied id must keep the label linked
  return (
    <div className={className}>
      <label className="check" htmlFor={id}>
        <input id={id} type="checkbox" aria-invalid={!!error} {...rest} />
        <span>{label}</span>
      </label>
      {error && (
        <p className="field-error">
          <AlertCircle size={16} aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ busy, children, className = "btn btn-primary", disabled }: { busy?: boolean; children: ReactNode; className?: string; disabled?: boolean }) {
  return (
    <button type="submit" className={className} disabled={busy || disabled} aria-busy={busy}>
      {busy && <Loader2 size={16} className="spin" aria-hidden />}
      {children}
    </button>
  );
}

export function FormSuccess({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="form-success" role="status">
      <CheckCircle2 size={22} aria-hidden />
      <div>
        <strong>{title}</strong>
        {children && <div className="small">{children}</div>}
      </div>
    </div>
  );
}

/** Simulated network delay so loading states are visible in the prototype. */
export const simulate = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isNgPhone = (v: string) => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, ""));

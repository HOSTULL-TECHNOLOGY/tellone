"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/** Accessible tabs (roving arrow keys). */
export function Tabs({ tabs, initial = 0, label, onChange }: { tabs: { label: string; content: ReactNode; badge?: ReactNode }[]; initial?: number; label: string; onChange?: (i: number) => void }) {
  const [i, setI] = useState(initial);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (n: number) => {
    setI(n);
    onChange?.(n);
    refs.current[n]?.focus();
  };
  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tablist">
        {tabs.map((t, n) => (
          <button
            key={n}
            ref={(el) => {
              refs.current[n] = el;
            }}
            role="tab"
            id={`${id}-t${n}`}
            aria-selected={i === n}
            aria-controls={`${id}-p${n}`}
            tabIndex={i === n ? 0 : -1}
            className="tab"
            onClick={() => select(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") select((i + 1) % tabs.length);
              if (e.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length);
              if (e.key === "Home") select(0);
              if (e.key === "End") select(tabs.length - 1);
            }}
          >
            {t.label}
            {t.badge}
          </button>
        ))}
      </div>
      {tabs.map((t, n) => (
        <div key={n} role="tabpanel" id={`${id}-p${n}`} aria-labelledby={`${id}-t${n}`} hidden={i !== n} className="tabpanel" tabIndex={0}>
          {i === n && t.content}
        </div>
      ))}
    </div>
  );
}

/** Modal dialog using the native <dialog> element (focus trap and Escape handled by the browser). */
export function Dialog({ open, onClose, title, children, footer, size = "md" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`dialog dialog-${size}`} aria-labelledby={id} onClose={onClose} onCancel={onClose}>
      <div className="dialog-head">
        <h2 id={id}>{title}</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={20} aria-hidden />
        </button>
      </div>
      <div className="dialog-body">{children}</div>
      {footer && <div className="dialog-foot">{footer}</div>}
    </dialog>
  );
}

/** Confirmation for destructive or irreversible actions. */
export function ConfirmDialog({ open, onCancel, onConfirm, title, text, confirmLabel = "Confirm", danger }: { open: boolean; onCancel: () => void; onConfirm: () => void; title: string; text: ReactNode; confirmLabel?: string; danger?: boolean }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <div>{text}</div>
    </Dialog>
  );
}

/** Copy-to-clipboard button with feedback. */
export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* clipboard blocked: still show the value */
        }
        setDone(true);
        window.setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const EVENT = "tbh:toast";

/** Fire a toast from anywhere on the client. */
export function useToast() {
  return (message: string) => window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

/** Polite live region that shows short confirmations. Mounted once in the layout. */
export function Toaster() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs.slice(-2), { id, msg: (e as CustomEvent<string>).detail }]);
      window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3500);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {items.map((x) => (
        <div key={x.id} className="toast">
          <CheckCircle2 size={18} aria-hidden />
          <span>{x.msg}</span>
        </div>
      ))}
    </div>
  );
}

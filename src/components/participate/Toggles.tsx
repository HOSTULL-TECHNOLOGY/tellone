"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { readPref, writePref } from "@/lib/prefs";
import { simulate } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/Interactive";
import { EmptyState } from "@/components/ui/Page";
import type { Training } from "@/data/opportunities";

function useSet(key: string) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const v = JSON.parse(readPref(key) ?? "[]");
      setIds(Array.isArray(v) ? v : []);
    } catch {
      setIds([]);
    }
  }, [key]);
  const save = (next: string[]) => {
    setIds(next);
    writePref(key, JSON.stringify(next));
  };
  return { ids, save };
}

/** Join / leave toggle for volunteer groups and diaspora chapters (prototype: saved in this browser). */
export function JoinToggle({ id, label, storeKey }: { id: string; label: string; storeKey: string }) {
  const { ids, save } = useSet(storeKey);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const toast = useToast();
  const joined = ids.includes(id);
  return (
    <>
      <button
        type="button"
        className={`btn btn-sm ${joined ? "btn-outline" : "btn-primary"}`}
        aria-pressed={joined}
        disabled={busy}
        onClick={async () => {
          if (joined) return setAsk(true);
          setBusy(true);
          await simulate(400);
          save([...ids, id]);
          setBusy(false);
          toast(`Joined ${label}`);
        }}
      >
        {joined ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
        {joined ? "Joined" : busy ? "Joining…" : "Join"}
        <span className="sr-only"> {label}</span>
      </button>
      <ConfirmDialog
        open={ask}
        title={`Leave ${label}?`}
        text="You'll stop getting this group's updates. You can join again at any time."
        confirmLabel="Leave group"
        danger
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          save(ids.filter((x) => x !== id));
          setAsk(false);
          toast(`Left ${label}`);
        }}
      />
    </>
  );
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** Deterministic WAT (UTC+1) label so server and browser render identical text. */
function watLabel(iso: string) {
  const d = new Date(new Date(iso).getTime() + 3_600_000);
  const h = d.getUTCHours();
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${String(h).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Training calendar with filters and registration (Course schema rendered by the page). */
export function TrainingCalendar({ items }: { items: Training[] }) {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("");
  const { ids, save } = useSet("tbh-training");
  const toast = useToast();
  const list = useMemo(() => items.filter((t) => (!topic || t.topic === topic) && (!mode || t.mode === mode)), [items, topic, mode]);
  const topics = Array.from(new Set(items.map((t) => t.topic)));
  return (
    <div>
      <div className="filters" role="search" aria-label="Filter training">
        <div className="field">
          <label htmlFor="tt">Topic</label>
          <select id="tt" className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="tm">Format</label>
          <select id="tm" className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="">Online and in person</option>
            <option>Online</option>
            <option>In person</option>
          </select>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState title="No sessions match" text="Try another topic or format." />
      ) : (
        <ul className="tr-list" role="list">
          {list.map((t) => {
            const reg = ids.includes(t.id);
            return (
              <li key={t.id} className="tr card">
                <div className="tr-top">
                  <span className="chip">{t.topic}</span>
                  <span className="chip">{t.mode}</span>
                  {t.requiredFor && <span className="badge badge-warn">Required: {t.requiredFor}</span>}
                </div>
                <h3>{t.title}</h3>
                <p className="muted">{t.summary}</p>
                <p className="small">
                  <strong>{watLabel(t.date)} WAT</strong> · {t.place} · {t.seats} seats
                </p>
                <button
                  type="button"
                  className={`btn btn-sm ${reg ? "btn-outline" : "btn-primary"}`}
                  aria-pressed={reg}
                  onClick={() => {
                    save(reg ? ids.filter((x) => x !== t.id) : [...ids, t.id]);
                    toast(reg ? `Registration cancelled: ${t.title}` : `Registered: ${t.title}`);
                  }}
                >
                  {reg ? <Check size={16} aria-hidden /> : null}
                  {reg ? "Registered — cancel" : "Register"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

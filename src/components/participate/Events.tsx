"use client";

import { icsFor } from "./ics";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, List, MapPin, SearchX, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/Page";
import { Tabs } from "@/components/ui/Interactive";
import { FormSuccess, SubmitButton, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { ORGANISERS, type CalEvent } from "@/data/events";
import { href, type Locale } from "@/lib/i18n";
import { readPref, writePref } from "@/lib/prefs";
import { useSession } from "@/lib/auth";

const fmtDay = (iso: string) => new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
const fmtTime = (iso: string) => new Date(iso).toLocaleString("en-GB", { hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });
const watDay = (iso: string) => new Date(new Date(iso).getTime() + 3_600_000).toISOString().slice(0, 10);

export function EventsBrowser({ items, locale }: { items: CalEvent[]; locale: Locale }) {
  const [state, setState] = useState("");
  const [org, setOrg] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const states = useMemo(() => Array.from(new Set(items.map((e) => e.state))).sort(), [items]);
  const list = useMemo(
    () => items.filter((e) => (!state || e.state === state) && (!org || e.organiser === org) && (!from || watDay(e.start) >= from) && (!to || watDay(e.start) <= to)).sort((a, b) => a.start.localeCompare(b.start)),
    [items, state, org, from, to],
  );
  const reset = () => {
    setState("");
    setOrg("");
    setFrom("");
    setTo("");
  };
  return (
    <div>
      <div className="filters" role="search" aria-label="Filter events">
        <div className="field">
          <label htmlFor="es">State</label>
          <select id="es" className="input" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">All states and online</option>
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="eo">Organiser</label>
          <select id="eo" className="input" value={org} onChange={(e) => setOrg(e.target.value)}>
            <option value="">All organisers</option>
            {ORGANISERS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ef">From</label>
          <input id="ef" type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="et">To</label>
          <input id="et" type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      <p className="small muted" aria-live="polite">
        {list.length} event{list.length === 1 ? "" : "s"}
        {(state || org || from || to) && (
          <>
            {" "}
            ·{" "}
            <button type="button" className="linklike" onClick={reset}>
              Clear filters
            </button>
          </>
        )}
      </p>
      <Tabs
        label="Event view"
        tabs={[
          {
            label: "List",
            badge: <List size={16} aria-hidden />,
            content:
              list.length === 0 ? (
                <EmptyState icon={<SearchX size={32} aria-hidden />} title="No events match" text="Try another state or date range." action={<button type="button" className="btn btn-outline" onClick={reset}>Clear filters</button>} />
              ) : (
                <ul className="evl" role="list">
                  {list.map((e) => (
                    <li key={e.slug} className="evl-item">
                      <div className="evl-date" aria-hidden>
                        <span>{new Date(e.start).toLocaleString("en-GB", { month: "short", timeZone: "Africa/Lagos" })}</span>
                        <strong>{new Date(e.start).toLocaleString("en-GB", { day: "numeric", timeZone: "Africa/Lagos" })}</strong>
                      </div>
                      <div className="evl-body">
                        <span className="chip">{e.organiser}</span>
                        <h3>
                          <Link href={href(locale, `/events/${e.slug}`)}>{e.title}</Link>
                        </h3>
                        <p className="evl-meta">
                          <CalendarDays size={16} aria-hidden /> {fmtDay(e.start)}, {fmtTime(e.start)}–{fmtTime(e.end)} WAT
                        </p>
                        <p className="evl-meta">
                          <MapPin size={16} aria-hidden /> {e.place}
                          {e.state !== "Online" ? `, ${e.state}` : ""}
                        </p>
                      </div>
                      <div className="evl-actions">
                        <Link href={href(locale, `/events/${e.slug}#rsvp`)} className="btn btn-sm btn-primary">
                          RSVP
                        </Link>
                        <a href={icsFor(e)} download={`${e.slug}.ics`} className="btn btn-sm btn-ghost">
                          <CalendarPlus size={16} aria-hidden /> Add to calendar
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ),
          },
          { label: "Month", badge: <CalendarDays size={16} aria-hidden />, content: <MonthView items={list} locale={locale} /> },
        ]}
      />
    </div>
  );
}

function MonthView({ items, locale }: { items: CalEvent[]; locale: Locale }) {
  const first = items[0] ? new Date(items[0].start) : new Date();
  const [cursor, setCursor] = useState({ y: first.getUTCFullYear(), m: first.getUTCMonth() });
  const days = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const lead = (new Date(Date.UTC(cursor.y, cursor.m, 1)).getUTCDay() + 6) % 7; // Monday first
  const byDay = (d: number) => items.filter((e) => watDay(e.start) === `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  const label = new Date(Date.UTC(cursor.y, cursor.m, 1)).toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const move = (n: number) => setCursor((c) => ({ y: c.y + Math.floor((c.m + n) / 12), m: (((c.m + n) % 12) + 12) % 12 }));
  return (
    <div className="month">
      <div className="month-head">
        <button type="button" className="icon-btn" onClick={() => move(-1)} aria-label="Previous month">
          <ChevronLeft size={20} aria-hidden />
        </button>
        <h3 aria-live="polite">{label}</h3>
        <button type="button" className="icon-btn" onClick={() => move(1)} aria-label="Next month">
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
      <div className="month-grid" role="grid" aria-label={`Events in ${label}`}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="month-dow" role="columnheader">
            {d}
          </div>
        ))}
        {Array.from({ length: lead }).map((_, i) => (
          <div key={`b${i}`} className="month-cell is-blank" aria-hidden />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const evs = byDay(i + 1);
          return (
            <div key={i} className={`month-cell${evs.length ? " has-ev" : ""}`} role="gridcell">
              <span className="month-num">{i + 1}</span>
              {evs.map((e) => (
                <Link key={e.slug} href={href(locale, `/events/${e.slug}`)} className="month-ev">
                  {e.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Rsvp = { slug: string; name: string; phone: string; guests: number; at: string };
/** RSVP stored locally (prototype). Production: RSVP list on the event record (Event.RSVPs, WL-6). */
export function RsvpForm({ slug, title }: { slug: string; title: string }) {
  const { user } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("0");
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Rsvp | null>(null);
  useEffect(() => {
    try {
      const all: Rsvp[] = JSON.parse(readPref("tbh-rsvps") ?? "[]");
      setDone(all.find((r) => r.slug === slug) ?? null);
    } catch {
      /* ignore */
    }
  }, [slug]);
  useEffect(() => {
    if (user) {
      setName((n) => n || user.firstName);
      setPhone((p) => p || user.phone);
    }
  }, [user]);
  if (done)
    return (
      <div className="form-panel">
        <FormSuccess title={`You're going, ${done.name}`}>
          RSVP saved for {title}
          {done.guests > 0 ? ` with ${done.guests} guest${done.guests > 1 ? "s" : ""}` : ""}. A reminder is sent the day before (in production, with your consent).
        </FormSuccess>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            try {
              const all: Rsvp[] = JSON.parse(readPref("tbh-rsvps") ?? "[]");
              writePref("tbh-rsvps", JSON.stringify(all.filter((r) => r.slug !== slug)));
            } catch {
              /* ignore */
            }
            setDone(null);
          }}
        >
          Cancel my RSVP
        </button>
      </div>
    );
  return (
    <form
      className="form-panel"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const x: Record<string, string> = {};
        if (!name.trim()) x.name = "Enter your first name.";
        if (!isNgPhone(phone)) x.phone = "Enter a Nigerian mobile number for the reminder.";
        setErr(x);
        if (Object.keys(x).length) return;
        setBusy(true);
        await simulate();
        const r: Rsvp = { slug, name: name.trim(), phone, guests: Number(guests), at: new Date().toISOString() };
        try {
          const all: Rsvp[] = JSON.parse(readPref("tbh-rsvps") ?? "[]");
          writePref("tbh-rsvps", JSON.stringify([r, ...all.filter((a) => a.slug !== slug)]));
        } catch {
          /* ignore */
        }
        setBusy(false);
        setDone(r);
      }}
    >
      <div className="form-grid form-grid-2">
        <TextField label="First name" value={name} onChange={(e) => setName(e.target.value)} error={err.name} required />
        <TextField label="Mobile number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={err.phone} required />
        <div className="field">
          <label htmlFor="guests">Guests coming with you</label>
          <select id="guests" className="input" value={guests} onChange={(e) => setGuests(e.target.value)}>
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <SubmitButton busy={busy}>
          <Users size={16} aria-hidden /> RSVP
        </SubmitButton>
      </div>
    </form>
  );
}

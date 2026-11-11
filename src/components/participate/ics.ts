import type { CalEvent } from "@/data/events";

/** .ics calendar export (WEB-5). */
export function icsFor(e: CalEvent) {
  const st = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/[\\,;]/g, (m) => `\\${m}`);
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TBH One//Event Calendar//EN", "BEGIN:VEVENT", `UID:${e.slug}@tbh-one`, `DTSTAMP:${st(e.start)}`, `DTSTART:${st(e.start)}`, `DTEND:${st(e.end)}`, `SUMMARY:${esc(e.title)}`, `LOCATION:${esc(e.place)}`, `DESCRIPTION:${esc(`Organiser: ${e.organiserName}`)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

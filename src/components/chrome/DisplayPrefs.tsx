"use client";

import { useEffect, useId, useState } from "react";
import { Monitor, Moon, SlidersHorizontal, Sun } from "lucide-react";
import { Popover } from "./Popover";
import { PREF, readPref, writePref } from "@/lib/prefs";
import type { Dict } from "@/i18n";

type Theme = "light" | "dark" | "system";

export function applyTheme(t: Theme) {
  const d = document.documentElement;
  // Light is the default; "System" follows the device setting when the visitor picks it.
  const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  d.setAttribute("data-theme", dark ? "dark" : "light");
  writePref(PREF.theme, t === "light" ? null : t);
  window.dispatchEvent(new Event("tbh:prefs"));
}
export function applyDataSaver(on: boolean) {
  const d = document.documentElement;
  if (on) d.setAttribute("data-saver", "on");
  else d.removeAttribute("data-saver");
  writePref(PREF.dataSaver, on ? "on" : "off");
  window.dispatchEvent(new Event("tbh:data-saver"));
  window.dispatchEvent(new Event("tbh:prefs"));
}

/** Theme (visual) and Data Saver (bandwidth) are separate controls — see Plan C1. */
export function DisplayControls({ t }: { t: Dict["prefs"] }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [saver, setSaver] = useState(false);
  const group = useId(); // each instance (top bar, mobile menu) needs its own radio group
  useEffect(() => {
    const sync = () => {
      const v = readPref(PREF.theme);
      setTheme(v === "dark" || v === "system" ? v : "light");
      setSaver(document.documentElement.getAttribute("data-saver") === "on");
    };
    window.addEventListener("tbh:prefs", sync);
    return () => window.removeEventListener("tbh:prefs", sync);
  }, []);
  useEffect(() => {
    const v = readPref(PREF.theme);
    setTheme(v === "dark" || v === "system" ? v : "light");
    setSaver(document.documentElement.getAttribute("data-saver") === "on");
  }, []);

  const opts: { v: Theme; label: string; icon: typeof Sun }[] = [
    { v: "light", label: t.light, icon: Sun },
    { v: "dark", label: t.dark, icon: Moon },
    { v: "system", label: t.system, icon: Monitor },
  ];
  return (
    <div className="prefs">
      <fieldset className="seg">
        <legend>{t.theme}</legend>
        <div className="seg-row">
          {opts.map(({ v, label, icon: Icon }) => (
            <label key={v} className="seg-opt">
              <input
                type="radio"
                name={`theme-${group}`}
                value={v}
                checked={theme === v}
                onChange={() => {
                  setTheme(v);
                  applyTheme(v);
                }}
              />
              <span>
                <Icon size={16} aria-hidden />
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="switch">
        <span>
          <strong>{t.dataSaver}</strong>
          <span className="muted small">{t.dataSaverText}</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={saver}
          onChange={(e) => {
            setSaver(e.target.checked);
            applyDataSaver(e.target.checked);
          }}
        />
      </label>
    </div>
  );
}

export function DisplayPrefs({ t }: { t: Dict["prefs"] }) {
  return (
    <Popover label={`${t.theme} / ${t.dataSaver}`} align="end" button={<SlidersHorizontal size={16} aria-hidden />}>
      {() => <DisplayControls t={t} />}
    </Popover>
  );
}

/** One-tap Light/Dark switch in the header (the full Light/Dark/System choice stays in Display settings). */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const sync = () => setDark(document.documentElement.getAttribute("data-theme") === "dark");
    sync();
    window.addEventListener("tbh:prefs", sync);
    return () => window.removeEventListener("tbh:prefs", sync);
  }, []);
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={() => applyTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
    </button>
  );
}

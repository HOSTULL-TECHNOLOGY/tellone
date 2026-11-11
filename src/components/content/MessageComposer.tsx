"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CopyButton } from "@/components/ui/Interactive";
import { messages, msgLangs, msgPurposes, type MsgLang, type MsgPurpose } from "@/data/messages";
import { readPref, writePref } from "@/lib/prefs";

const KEY = "tbh-composer";

/** Builds a WhatsApp-ready message in one of five languages. Copies to clipboard or opens WhatsApp's share sheet. */
export function MessageComposer() {
  const [lang, setLang] = useState<MsgLang>("en");
  const [purpose, setPurpose] = useState<MsgPurpose>("bring");
  const [name, setName] = useState("");
  useEffect(() => {
    const saved = readPref(KEY);
    if (saved) {
      const [l, p] = saved.split(":");
      if (msgLangs.some((x) => x.code === l)) setLang(l as MsgLang);
      if (msgPurposes.some((x) => x.code === p)) setPurpose(p as MsgPurpose);
    }
  }, []);
  useEffect(() => writePref(KEY, `${lang}:${purpose}`), [lang, purpose]);
  const text = messages[lang][purpose].replace("{name}", name.trim() || (lang === "en" ? "friend" : lang === "pcm" ? "my person" : lang === "yo" ? "ọ̀rẹ́ mi" : lang === "ha" ? "abokina" : "enyi m"));
  return (
    <div className="composer">
      <div style={{ display: "grid", gap: 16 }}>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 650, marginBottom: 8 }}>Who is it for?</legend>
          <div style={{ display: "grid", gap: 6 }}>
            {msgPurposes.map((p) => (
              <label key={p.code} className="check">
                <input type="radio" name="purpose" value={p.code} checked={purpose === p.code} onChange={() => setPurpose(p.code)} />
                <span>
                  {p.label}
                  <br />
                  <span className="small muted">{p.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="cmp-lang">Language</label>
          <select id="cmp-lang" className="input" value={lang} onChange={(e) => setLang(e.target.value as MsgLang)}>
            {msgLangs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cmp-name">Their first name (optional)</label>
          <input id="cmp-name" className="input" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        </div>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <p className="small muted" style={{ margin: 0 }} id="cmp-preview-label">
          Preview
        </p>
        <div className="composer-preview" lang={lang} aria-labelledby="cmp-preview-label" aria-live="polite">
          {text}
        </div>
        {lang !== "en" && <p className="small muted" style={{ margin: 0 }}>Draft translation, pending review by the TBH One translator pool.</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <CopyButton value={text} label="Copy message" />
          <a className="btn btn-sm btn-primary" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} aria-hidden /> Open in WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

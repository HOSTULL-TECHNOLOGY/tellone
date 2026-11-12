"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, MessageCircle, Search, Share2, ShieldCheck, Map as MapIcon } from "lucide-react";
import { finder, waLink } from "@/data/careers";
import { nigeriaMapPaths, nigeriaMapViewBox, projectLatLon } from "@/data/nigeria-map";
import { appliedWardIds, loadWards, nearBoundary, nearest, neighbours, saveFound, search, sharedName, type Place, type Suggestion, type Ward } from "@/lib/wards";
import { states } from "@/data/states";
import { useToast } from "@/components/ui/Toast";

type Mode = "location" | "search" | "list" | "ask";
type Data = { wards: Ward[]; places: Place[] };

/**
 * Public ward finder (no registration needed): use my location, search my area or landmark, pick from the list,
 * or ask on WhatsApp. The ward found is remembered and carries into registration and the application.
 */
/** With `onSelect`, confirming a ward selects it for a form (registration, the application) instead of showing apply buttons. */
export function WardFinder({ applyHref, streetHref, shareUrl, compact = false, onSelect }: { applyHref: string; streetHref: string; shareUrl: string; compact?: boolean; onSelect?: (w: Ward) => void }) {
  const [mode, setMode] = useState<Mode>("search");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [ward, setWard] = useState<Ward | null>(null);
  const [choices, setChoices] = useState<Ward[] | null>(null);
  const [choicesNote, setChoicesNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [light, setLight] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const saver = document.documentElement.getAttribute("data-saver") === "on";
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    setLight(saver || !!conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? ""));
  }, []);

  const ensure = async () => {
    if (data) return data;
    setLoading(true);
    const d = await loadWards();
    setData(d);
    setLoading(false);
    return d;
  };

  const show = (w: Ward, opts: { others?: Ward[]; othersNote?: string } = {}) => {
    setWard(w);
    setConfirmed(false);
    setChoices(opts.others ?? null);
    setChoicesNote(opts.othersNote ?? "");
  };

  const useLocation = async () => {
    setMode("location");
    setNote("");
    if (!("geolocation" in navigator)) return setNote(finder.helpers.blocked);
    const d = await ensure();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = nearest(d.wards, { lat: pos.coords.latitude, lon: pos.coords.longitude });
        const edge = nearBoundary(near);
        if (edge) show(edge[0], { others: edge, othersNote: finder.helpers.boundary(edge[0].name, edge[1].name) });
        else show(near[0].w);
      },
      () => {
        setNote(finder.helpers.blocked);
        setMode("search");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const choose = (w: Ward) => {
    setWard(w);
    setConfirmed(true);
    setChoices(null);
    saveFound(w);
    onSelect?.(w);
  };

  return (
    <div className={`wf${compact ? " wf-compact" : ""}`}>
      <p className="wf-entry">{finder.entry}</p>
      <div className="wf-ways" role="group" aria-label="Ways to find your ward">
        <button type="button" className="wf-way" aria-pressed={mode === "location"} onClick={useLocation}>
          <MapPin size={18} aria-hidden /> {finder.ways[0].button.replace(/^📍 /, "")}
        </button>
        <button
          type="button"
          className="wf-way"
          aria-pressed={mode === "search"}
          onClick={() => {
            setMode("search");
            void ensure();
          }}
        >
          <Search size={18} aria-hidden /> {finder.ways[1].button.replace(/^🔎 /, "")}
        </button>
        <button
          type="button"
          className="wf-way"
          aria-pressed={mode === "list"}
          onClick={() => {
            setMode("list");
            void ensure();
          }}
        >
          <MapIcon size={18} aria-hidden /> {finder.ways[2].button.replace(/^🗺️ /, "")}
        </button>
        <button type="button" className="wf-way" aria-pressed={mode === "ask"} onClick={() => setMode("ask")}>
          <MessageCircle size={18} aria-hidden /> {finder.ways[3].button.replace(/^💬 /, "")}
        </button>
      </div>

      {note && (
        <p className="wf-note" role="status">
          {note}
        </p>
      )}
      {loading && (
        <p className="wf-note" role="status">
          <Loader2 size={16} className="spin" aria-hidden /> Loading the ward list…
        </p>
      )}

      {mode === "search" && <SearchBox ensure={ensure} onPick={(s, all) => (all ? show(s.ward, { others: all.map((x) => x.ward), othersNote: finder.helpers.several(sharedName(all) ?? s.ward.name) }) : show(s.ward))} />}
      {mode === "list" && data && <ListPicker data={data} onPick={(w) => show(w)} />}
      {mode === "location" && !ward && !note && (
        <p className="wf-note" role="status">
          <Loader2 size={16} className="spin" aria-hidden /> Finding your ward… {finder.helpers.privacy}
        </p>
      )}
      {mode === "ask" && <AskUs />}

      {choices && choices.length > 1 && (
        <div className="wf-choices" role="group" aria-label="Choose your ward">
          <p>{choicesNote}</p>
          <ul role="list">
            {choices.map((w) => (
              <li key={w.id}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => choose(w)}>
                  {w.name}, {w.lga}, {w.stateName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ward && data && (
        <ResultCard
          ward={ward}
          data={data}
          light={light}
          confirmed={confirmed}
          onYes={() => {
            setConfirmed(true);
            saveFound(ward);
            onSelect?.(ward);
          }}
          onNo={() => {
            setChoices(neighbours(data.wards, ward, 5));
            setChoicesNote("Wards near " + ward.name + ":");
            setConfirmed(false);
          }}
          applyHref={applyHref}
          streetHref={streetHref}
          shareUrl={shareUrl}
          onWaitlist={() => toast(`You’re on the waiting list for a second-leader place in ${ward.name}.`)}
          onWrong={() => toast("Thanks for telling us. Your state team will check this ward within a week.")}
          selectOnly={!!onSelect}
        />
      )}

      <p className="wf-fine small">
        <ShieldCheck size={14} aria-hidden /> {finder.helpers.privacy} {finder.helpers.pvc}
      </p>
      {light && <p className="wf-fine small">{finder.helpers.slowText}</p>}
    </div>
  );
}

function SearchBox({ ensure, onPick }: { ensure: () => Promise<Data>; onPick: (s: Suggestion, all?: Suggestion[]) => void }) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState<Suggestion[]>([]);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(0);
  const timer = useRef<number>(undefined);
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setSugs([]);
      setDone(false);
      return;
    }
    timer.current = window.setTimeout(async () => {
      const d = await ensure();
      setSugs(search(d, q));
      setActive(0);
      setDone(true);
    }, 150);
    return () => window.clearTimeout(timer.current);
  }, [q, ensure]);
  const shared = sharedName(sugs);
  return (
    <div className="wf-search">
      <label htmlFor="wf-q" className="sr-only">
        Search for a street, market, school, church, mosque, park or motor park
      </label>
      <div className="wf-input">
        <Search size={18} aria-hidden />
        <input
          id="wf-q"
          type="search"
          autoComplete="off"
          placeholder="e.g. Kawo Market, Ariaria, Sabon Gari"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          role="combobox"
          aria-expanded={sugs.length > 0}
          aria-controls="wf-sugs"
          aria-autocomplete="list"
          aria-activedescendant={sugs[active] ? `wf-s-${active}` : undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, sugs.length - 1));
            if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
            if (e.key === "Enter" && sugs[active]) {
              e.preventDefault();
              onPick(sugs[active], shared ? sugs.filter((s) => s.kind === "ward") : undefined);
            }
          }}
        />
      </div>
      {shared && <p className="wf-note">{finder.helpers.several(shared)}</p>}
      {sugs.length > 0 && (
        <ul id="wf-sugs" role="listbox" className="wf-sugs" aria-label="Suggestions">
          {sugs.map((s, i) => (
            <li key={s.ward.id + s.label} id={`wf-s-${i}`} role="option" aria-selected={i === active}>
              <button type="button" onClick={() => onPick(s)} onMouseEnter={() => setActive(i)}>
                <strong>{s.label}</strong> <span>— {s.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {done && sugs.length === 0 && (
        <p className="wf-note" role="status">
          {finder.helpers.notFound}
        </p>
      )}
    </div>
  );
}

function ListPicker({ data, onPick }: { data: Data; onPick: (w: Ward) => void }) {
  const [st, setSt] = useState("");
  const [lga, setLga] = useState("");
  const lgas = useMemo(() => Array.from(new Set(data.wards.filter((w) => w.state === st).map((w) => w.lga))).sort(), [data, st]);
  const wards = useMemo(() => data.wards.filter((w) => w.state === st && w.lga === lga).sort((a, b) => a.name.localeCompare(b.name)), [data, st, lga]);
  return (
    <div className="wf-list">
      <label>
        <span>State</span>
        <select
          value={st}
          onChange={(e) => {
            setSt(e.target.value);
            setLga("");
          }}
        >
          <option value="">Choose your state</option>
          {states.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>LGA</span>
        <select value={lga} onChange={(e) => setLga(e.target.value)} disabled={!st}>
          <option value="">{st ? "Choose your LGA" : "Choose a state first"}</option>
          {lgas.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      {lga && (
        <ul className="wf-wards" role="list" aria-label={`Wards in ${lga}`}>
          {wards.map((w) => {
            const places = data.places.filter((p) => p.ward.id === w.id).map((p) => p.place);
            const near = neighbours(data.wards, w, 2).map((n) => n.name);
            return (
              <li key={w.id}>
                <button type="button" onClick={() => onPick(w)}>
                  <strong>{w.name}</strong>
                  <span className="small muted">{places.length ? `Covers ${places.join(", ")}` : `Next to ${near.join(" and ")}`}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AskUs() {
  const [area, setArea] = useState("");
  return (
    <div className="wf-ask">
      <p>{finder.ways[3].how}.</p>
      <label htmlFor="wf-area" className="sr-only">
        Your area
      </label>
      <div className="wf-ask-row">
        <input id="wf-area" type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Type your area, e.g. Kawo market" />
        <a className="btn btn-primary" href={waLink(`WARD ${area}`.trim())} target="_blank" rel="noopener">
          <MessageCircle size={18} aria-hidden /> {finder.ways[3].button.replace(/^💬 /, "")}
        </a>
      </div>
    </div>
  );
}

function MiniMap({ ward }: { ward: Ward }) {
  const ref = useRef<SVGPathElement>(null);
  const [box, setBox] = useState<string>(nigeriaMapViewBox);
  useEffect(() => {
    const b = ref.current?.getBBox();
    if (b) {
      const pad = Math.max(b.width, b.height) * 0.12;
      setBox(`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
    }
  }, [ward.state]);
  const [x, y] = projectLatLon(ward.lat, ward.lon);
  const r = Math.max(2.2, Number(box.split(" ")[2]) / 40);
  return (
    <svg viewBox={box} className="wf-map" role="img" aria-label={`Map of ${ward.stateName} State with a pin on ${ward.name} ward`}>
      {Object.entries(nigeriaMapPaths).map(([slug, d]) => (
        <path key={slug} d={d} ref={slug === ward.state ? ref : undefined} className={slug === ward.state ? "wf-map-state" : "wf-map-other"} />
      ))}
      <circle cx={x} cy={y} r={r * 2.4} className="wf-map-area" />
      <g transform={`translate(${x} ${y})`}>
        <path d={`M0 0 C ${-r * 1.2} ${-r * 1.6} ${-r * 1.4} ${-r * 2.6} 0 ${-r * 3.4} C ${r * 1.4} ${-r * 2.6} ${r * 1.2} ${-r * 1.6} 0 0 Z`} className="wf-map-pin" />
        <circle cy={-r * 2.3} r={r * 0.5} fill="#fff" />
      </g>
    </svg>
  );
}

function ResultCard({ ward, data, light, confirmed, onYes, onNo, applyHref, streetHref, shareUrl, onWaitlist, onWrong, selectOnly }: { ward: Ward; data: Data; light: boolean; confirmed: boolean; onYes: () => void; onNo: () => void; applyHref: string; streetHref: string; shareUrl: string; onWaitlist: () => void; onWrong: () => void; selectOnly?: boolean }) {
  const [showMap, setShowMap] = useState(!light);
  const [wrong, setWrong] = useState(false);
  const [wrongText, setWrongText] = useState("");
  const [applied, setApplied] = useState(false);
  useEffect(() => setApplied(appliedWardIds().has(ward.id)), [ward.id]);
  const places = data.places.filter((p) => p.ward.id === ward.id).map((p) => p.place);
  const near = neighbours(data.wards, ward, 3).map((n) => n.name);
  const covers = places.length ? `This ward covers ${places.join(", ")}.` : `This ward is next to ${near.slice(0, -1).join(", ")} and ${near.at(-1)}.`;
  const href = `${applyHref}${applyHref.includes("?") ? "&" : "?"}ward=${encodeURIComponent(ward.id)}`;
  const share = `${ward.name} ward (${ward.lga}, ${ward.stateName}) needs a TBH One ward leader. Find your ward and apply free: ${shareUrl}`;
  return (
    <div className="wf-result" aria-live="polite">
      <div className="wf-result-text">
        <p className="wf-result-title">
          Your ward: <strong>{ward.name}</strong>, {ward.lga} LGA, {ward.stateName} State. {covers}
        </p>
        {!confirmed ? (
          <div className="wf-confirm">
            <p>{finder.confirm}</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={onYes}>
              {finder.yes}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={onNo}>
              {finder.no}
            </button>
          </div>
        ) : selectOnly ? (
          <p className="wf-status wf-status-open">✓ {ward.name} ward selected.</p>
        ) : applied ? (
          <p className="wf-status wf-status-mine">You have applied for {ward.name} ward. Track it on your dashboard.</p>
        ) : ward.status === 1 ? (
          <div className="wf-status wf-status-taken">
            <p>{finder.status.taken.message(ward.name)}</p>
            <div className="wf-btns">
              <button type="button" className="btn btn-primary" onClick={onWaitlist}>
                {finder.status.taken.button}
              </button>
              <Link href={streetHref} className="btn btn-outline">
                {finder.status.taken.button2}
              </Link>
            </div>
          </div>
        ) : (
          <div className={`wf-status ${ward.status === 2 ? "wf-status-nobody" : "wf-status-open"}`}>
            <p>{finder.status.open.message(ward.name)}</p>
            <div className="wf-btns">
              <Link href={href} className="btn btn-primary">
                {finder.status.open.button(ward.name)}
              </Link>
            </div>
            {ward.status === 2 && (
              <div className="wf-share">
                <p>{finder.status.nobody.message(ward.name)}</p>
                <a className="btn btn-outline btn-sm" href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener">
                  <Share2 size={16} aria-hidden /> {finder.status.nobody.button}
                </a>
              </div>
            )}
          </div>
        )}
        <div className="wf-wrong">
          {!wrong ? (
            <button type="button" className="linklike small" onClick={() => setWrong(true)}>
              {finder.helpers.wrong}
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setWrong(false);
                setWrongText("");
                onWrong();
              }}
            >
              <label htmlFor="wf-wrong" className="small">
                {finder.helpers.wrong} · {finder.helpers.wrongThanks}
              </label>
              <textarea id="wf-wrong" rows={2} value={wrongText} onChange={(e) => setWrongText(e.target.value)} placeholder="What is wrong? For example: my street is in Kawo, not Gaji." required />
              <button className="btn btn-sm btn-outline" type="submit">
                Send
              </button>
            </form>
          )}
          <p className="small muted">{finder.helpers.moved}</p>
        </div>
      </div>
      <div className="wf-result-map">
        {showMap ? (
          <MiniMap ward={ward} />
        ) : (
          <div className="wf-map-off">
            <p className="small">{finder.helpers.slow}</p>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setShowMap(true)}>
              Show the map
            </button>
          </div>
        )}
        <p className="small muted wf-map-cap">Pin: centre of {ward.name} ward. Ward outlines are added from GRID3 boundary data before launch.</p>
      </div>
    </div>
  );
}

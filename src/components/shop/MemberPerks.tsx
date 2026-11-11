"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Gift, QrCode, Ticket } from "lucide-react";
import { coupons, partnerOffers, pointsRewards } from "@/data/shop";
import { href, type Locale } from "@/lib/i18n";
import { readPref, writePref } from "@/lib/prefs";
import { CopyButton } from "@/components/ui/Interactive";
import { Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import { useMember, useShopPhase } from "./hooks";

const DEMO_POINTS = 1240; // demo balance until the points ledger is connected (MB-2)

function SignInPrompt({ locale, next, what }: { locale: Locale; next: string; what: string }) {
  return (
    <Notice tone="info" title="Members only">
      <Link href={href(locale, `/login?next=${encodeURIComponent(next)}`)}>Sign in</Link> or <Link href={href(locale, "/join")}>join TBH One free</Link> to {what}.
    </Notice>
  );
}

/** Member coupon list + Impact Points conversion (EC-7, EC-8). */
export function CouponsClient({ locale }: { locale: Locale }) {
  const { isMember, user, ready } = useMember();
  const phase = useShopPhase();
  const promos = phase?.promos ?? true;
  const toast = useToast();
  const key = user ? `tbh-points-spent-${user.id}` : "";
  const [spent, setSpent] = useState(0);
  const [revealed, setRevealed] = useState<string[]>([]);
  useEffect(() => {
    if (!user) return;
    setSpent(Number(readPref(key) ?? 0));
    try {
      setRevealed(JSON.parse(readPref(`${key}-codes`) ?? "[]"));
    } catch {}
  }, [user, key]);
  const balance = DEMO_POINTS - spent;

  if (!promos) return <Notice tone="warn" title="Coupons are paused">Member coupons and promotions stop at the campaign cut-off (11:59 pm, Thursday 14 January 2027).</Notice>;

  return (
    <div className="perks">
      <section aria-labelledby="cp-h">
        <h2 id="cp-h">This period&apos;s member coupons</h2>
        <ul role="list" className="coupon-list">
          {coupons
            .filter((c) => !c.code.startsWith("POINTS"))
            .map((c) => (
              <li key={c.code} className="coupon-card">
                <Ticket size={22} aria-hidden />
                <div>
                  <p className="coupon-label">{c.label}</p>
                  <p className="small muted">
                    {c.membersOnly ? "Members only" : "Everyone"} · expires {new Date(c.expires).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    {c.minOrder ? ` · minimum order ₦${c.minOrder.toLocaleString("en-NG")}` : ""}
                  </p>
                </div>
                {ready && isMember ? (
                  <div className="coupon-code">
                    <code>{c.code}</code>
                    <CopyButton value={c.code} />
                  </div>
                ) : (
                  <span className="small muted">Sign in to see the code</span>
                )}
              </li>
            ))}
        </ul>
        {ready && !isMember && <SignInPrompt locale={locale} next="/shop/coupons" what="see coupon codes" />}
      </section>
      <section aria-labelledby="pts-h">
        <h2 id="pts-h">Turn Impact Points into coupons</h2>
        {ready && isMember && (
          <p className="pts-balance">
            Your balance: <strong>{balance.toLocaleString("en-NG")} points</strong> <span className="chip chip-demo">Demo data</span>
          </p>
        )}
        <table className="dt-table pts-table">
          <caption className="sr-only">Impact Points to coupon conversion</caption>
          <thead>
            <tr>
              <th scope="col">Points</th>
              <th scope="col">Reward</th>
              <th scope="col">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pointsRewards.map((r) => (
              <tr key={r.code}>
                <td data-label="Points">{r.points.toLocaleString("en-NG")}</td>
                <td data-label="Reward">{r.label}</td>
                <td className="dt-actions">
                  {ready && isMember ? (
                    revealed.includes(r.code) ? (
                      <span className="coupon-code">
                        <code>{r.code}</code>
                        <CopyButton value={r.code} />
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        disabled={balance < r.points}
                        onClick={() => {
                          const ns = spent + r.points;
                          const nr = [...revealed, r.code];
                          setSpent(ns);
                          setRevealed(nr);
                          writePref(key, String(ns));
                          writePref(`${key}-codes`, JSON.stringify(nr));
                          toast(`Converted ${r.points} points — code ${r.code}`);
                        }}
                      >
                        <Gift size={14} aria-hidden /> Convert points
                      </button>
                    )
                  ) : (
                    <span className="small muted">Members only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ready && !isMember && <SignInPrompt locale={locale} next="/shop/coupons" what="convert your Impact Points" />}
      </section>
    </div>
  );
}

function makeCode(memberId: string, offerId: string) {
  let h = 0;
  for (const ch of memberId + offerId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `TBH-${offerId.replace("off-", "P")}-${h.toString(36).toUpperCase().slice(0, 6)}`;
}

function OfferCode({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString(code, { type: "svg", margin: 1, width: 140, color: { dark: "#1b1a16", light: "#ffffff" } }).then(setSvg).catch(() => setSvg(""));
  }, [code]);
  return (
    <div className="offer-code">
      {svg ? <div className="offer-qr" role="img" aria-label={`QR code for ${code}`} dangerouslySetInnerHTML={{ __html: svg }} /> : <QrCode size={64} aria-hidden />}
      <div>
        <p className="small muted">Your unique code</p>
        <p className="offer-code-text">
          <code>{code}</code>
        </p>
        <CopyButton value={code} />
      </div>
    </div>
  );
}

/** EC-9 partner vendor offers with a unique code + QR per member and offer. */
export function OffersClient({ locale }: { locale: Locale }) {
  const { isMember, user, ready } = useMember();
  const phase = useShopPhase();
  const [area, setArea] = useState("");
  const [cat, setCat] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});
  const toast = useToast();
  const storeKey = user ? `tbh-offer-codes-${user.id}` : "";
  useEffect(() => {
    if (!user) return;
    try {
      setCodes(JSON.parse(readPref(storeKey) ?? "{}"));
    } catch {}
  }, [user, storeKey]);
  const areas = useMemo(() => Array.from(new Set(partnerOffers.map((o) => o.area))), []);
  const cats = useMemo(() => Array.from(new Set(partnerOffers.map((o) => o.category))), []);
  const list = partnerOffers.filter((o) => (!area || o.area === area) && (!cat || o.category === cat));

  if (phase && !phase.promos) return <Notice tone="warn" title="Partner offers are paused">Partner promotions stop at the campaign cut-off and resume after the election if partners choose.</Notice>;

  return (
    <div>
      <div className="filters">
        <div className="field">
          <label htmlFor="of-a">Area</label>
          <select id="of-a" className="input" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">All areas</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="of-c">Category</label>
          <select id="of-c" className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      {ready && !isMember && <SignInPrompt locale={locale} next="/shop/offers" what="get your personal offer codes" />}
      <ul role="list" className="offer-list">
        {list.map((o) => (
          <li key={o.id} className="offer-card">
            <div className="offer-main">
              <p className="offer-cat">
                {o.category} · {o.area}
              </p>
              <h3>{o.partner}</h3>
              <p className="offer-deal">{o.offer}</p>
              <p className="small muted">Valid until {new Date(o.expires).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            {codes[o.id] ? (
              <OfferCode code={codes[o.id]} />
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!ready || !isMember}
                onClick={() => {
                  if (!user) return;
                  const c = makeCode(user.id, o.id);
                  const next = { ...codes, [o.id]: c };
                  setCodes(next);
                  writePref(storeKey, JSON.stringify(next));
                  toast(`Your code for ${o.partner}: ${c}`);
                }}
              >
                <QrCode size={16} aria-hidden /> Get my code
              </button>
            )}
          </li>
        ))}
      </ul>
      {!list.length && <p className="muted">No offers in this area yet.</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { BadgeCheck, Check, Download, Lock, Search, Upload } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { BarChart, Badge, Grid, Kpis, Panel, naira } from "@/components/dashboard/kit";
import { CheckField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import type { DemoUser } from "@/lib/auth";
import { profitShare, rfqs, sponsorships, vendorBids, vendorOffers, vendorOrders, vendorProfile, type VendorOrder } from "@/data/mock/field";
import { AuditPanel, DemoTag, download, fmtDate, toCsv, useAudit, usePersisted } from "./field/common";

type Bid = { id: string; rfq: string; amount: number; outcome: string; reason: string };
type Offer = (typeof vendorOffers)[number] & { redeemed?: string[] };

export default function VendorDashboard({ section }: { section: string }) {
  return <DashboardShell role="vendor" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const audit = useAudit("vendor", `${user.firstName} ${user.lastName} (${vendorProfile.company})`);
  switch (section) {
    case "requests":
      return <Requests log={audit.log} />;
    case "bids":
      return <Bids />;
    case "orders":
      return <Orders log={audit.log} />;
    case "invoices":
      return <Invoices log={audit.log} items={audit.items} />;
    case "profit-share":
      return <ProfitShare />;
    case "offers":
      return <Offers log={audit.log} />;
    case "sponsorships":
      return <Sponsorships />;
    case "reports":
      return <Reports />;
    case "conflicts":
      return <Conflicts user={user} log={audit.log} />;
    default:
      return <Profile log={audit.log} />;
  }
}

const useBids = () => usePersisted<Bid[]>("tbh-vn-bids", vendorBids);
const useOrders = () => usePersisted<VendorOrder[]>("tbh-vn-orders", vendorOrders);

/* VN-1 */
function Profile({ log }: { log: (w: string) => void }) {
  const [cats, setCats] = usePersisted<string[]>("tbh-vn-cats", vendorProfile.categories);
  const toast = useToast();
  const ALL = ["Print", "Merch", "Logistics", "Media production", "Events", "Food & catering", "IT services"];
  return (
    <Grid>
      <Panel title="Company profile" action={<DemoTag />}>
        <dl className="kv">
          <dt>Company</dt>
          <dd>{vendorProfile.company}</dd>
          <dt>Registration</dt>
          <dd>{vendorProfile.rc}</dd>
          <dt>City</dt>
          <dd>{vendorProfile.city}</dd>
          <dt>Verification</dt>
          <dd>
            <Badge tone="ok">
              <BadgeCheck size={12} aria-hidden /> {vendorProfile.verification}
            </Badge>{" "}
            <span className="small muted">since {fmtDate(vendorProfile.since)}</span>
          </dd>
        </dl>
        <p className="small muted">Verification checks CAC registration, tax ID, bank account name and directors against conflict-of-interest declarations.</p>
      </Panel>
      <Panel title="Categories you supply">
        <fieldset className="plain">
          <legend className="sr-only">Categories</legend>
          {ALL.map((c) => (
            <label key={c} className="check">
              <input
                type="checkbox"
                checked={cats.includes(c)}
                onChange={(e) => {
                  const next = e.target.checked ? [...cats, c] : cats.filter((x) => x !== c);
                  setCats(next);
                  log(`${e.target.checked ? "added" : "removed"} category ${c}`);
                }}
              />
              <span>{c}</span>
            </label>
          ))}
        </fieldset>
        <button type="button" className="btn btn-outline" onClick={() => toast("Categories saved — new categories are re-verified within 3 working days")}>
          Save categories
        </button>
      </Panel>
    </Grid>
  );
}

/* VN-2 */
function Requests({ log }: { log: (w: string) => void }) {
  const [bids, setBids] = useBids();
  const [open, setOpen] = useState<(typeof rfqs)[number] | null>(null);
  const [f, setF] = useState({ amount: "", days: "", notes: "", coi: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const bidFor = (id: string) => bids.find((b) => b.rfq.startsWith(id));
  return (
    <>
      <Panel title="Open requests for quotation" action={<DemoTag />}>
        <ul className="funded">
          {rfqs.map((r) => (
            <li key={r.id} className="funded-item">
              <div className="funded-head">
                <h3>{r.title}</h3>
                <Badge tone="info">{r.category}</Badge>
              </div>
              <p className="small muted">
                {r.id} · delivery to {r.location} · closes {fmtDate(r.closes)}
              </p>
              <p className="small">
                <strong>Published evaluation criteria:</strong> {r.criteria}
              </p>
              <div className="form-actions">
                {bidFor(r.id) ? (
                  <Badge tone="ok">Bid submitted · {naira(bidFor(r.id)!.amount)}</Badge>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setOpen(r);
                      setF({ amount: "", days: "", notes: "", coi: false });
                      setErrs({});
                    }}
                  >
                    Submit a bid
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <Dialog open={!!open} onClose={() => setOpen(null)} title={`Bid for ${open?.id ?? ""}`}>
        {open && (
          <form
            className="form-grid"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const x: Record<string, string> = {};
              const amt = Number(f.amount);
              if (!amt || amt < 1000) x.amount = "Enter your total price in naira.";
              const d = Number(f.days);
              if (!Number.isInteger(d) || d < 1) x.days = "Enter delivery time in days.";
              if (!f.coi) x.coi = "You must confirm the conflict-of-interest statement.";
              setErrs(x);
              if (Object.keys(x).length) return;
              setBusy(true);
              await simulate();
              setBusy(false);
              setBids([{ id: `BID-${String(Date.now()).slice(-3)}`, rfq: `${open.id} · ${open.title}`, amount: amt, outcome: "Under evaluation", reason: `Evaluation closes ${fmtDate(open.closes)}` }, ...bids]);
              log(`submitted bid on ${open.id} for ${naira(amt)}, ${d} days`);
              toast("Bid submitted — sealed until the closing date");
              setOpen(null);
            }}
          >
            <p className="small">
              <strong>Criteria:</strong> {open.criteria}
            </p>
            <TextField label="Total price (₦, including VAT)" type="number" inputMode="numeric" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} error={errs.amount} />
            <TextField label="Delivery time (days)" type="number" inputMode="numeric" value={f.days} onChange={(e) => setF({ ...f, days: e.target.value })} error={errs.days} />
            <TextArea label="Notes (samples, past work)" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} />
            <CheckField label="No TBH One official, candidate or their family has an interest in my company, or I have declared it." checked={f.coi} onChange={(e) => setF({ ...f, coi: e.target.checked })} error={errs.coi} />
            <SubmitButton busy={busy}>Submit bid</SubmitButton>
          </form>
        )}
      </Dialog>
    </>
  );
}

/* VN-3 */
function Bids() {
  const [bids] = useBids();
  return (
    <Panel title="My bids">
      <DataTable
        rows={bids}
        rowKey={(r) => r.id}
        caption="Bids and outcomes"
        columns={[
          { key: "rfq", header: "Request" },
          { key: "amount", header: "Your price", align: "right", sortable: true, value: (r) => r.amount, render: (r) => naira(r.amount) },
          { key: "outcome", header: "Outcome", render: (r) => <Badge tone={r.outcome === "Awarded" ? "ok" : r.outcome === "Not awarded" ? "danger" : "info"}>{r.outcome}</Badge> },
          { key: "reason", header: "Published reason" },
        ]}
      />
      <p className="small muted">Every award and its reason is published, so all bidders can see why a decision was made.</p>
    </Panel>
  );
}

/* VN-4 */
function Orders({ log }: { log: (w: string) => void }) {
  const [orders, setOrders] = useOrders();
  const toast = useToast();
  return (
    <Panel title="Purchase orders" action={<DemoTag />}>
      <ul className="funded">
        {orders.map((o) => (
          <li key={o.id} className="funded-item">
            <div className="funded-head">
              <h3>
                {o.id} · {o.item}
              </h3>
              <strong>{naira(o.value)}</strong>
            </div>
            <p className="small muted">
              {o.qty.toLocaleString("en-NG")} units · due {fmtDate(o.due)}
            </p>
            {o.delivered ? (
              <p className="small">
                <Badge tone="ok">Delivery confirmed</Badge> by {o.confirmedBy}
              </p>
            ) : (
              <>
                <p className="small">
                  <Badge tone="warn">Awaiting delivery confirmation</Badge>
                </p>
                <label className="btn btn-sm btn-outline upload-btn">
                  <Upload size={16} aria-hidden /> Upload signed delivery note
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const n = e.target.files?.[0]?.name;
                      if (!n) return;
                      setOrders(orders.map((x) => (x.id === o.id ? { ...x, delivered: true, confirmedBy: `signed delivery note “${n}” (pending logistics check)` } : x)));
                      log(`uploaded delivery confirmation ${n} for ${o.id}`);
                      toast("Delivery confirmation uploaded — you can now raise the invoice");
                    }}
                  />
                </label>
              </>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* VN-5 — invoices only after delivery confirmed */
function Invoices({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  const [orders, setOrders] = useOrders();
  const [confirm, setConfirm] = useState<VendorOrder | null>(null);
  const toast = useToast();
  const paid = orders.filter((o) => o.paid === "Paid").reduce((a, o) => a + o.value, 0);
  const processing = orders.filter((o) => o.invoiced && o.paid !== "Paid").reduce((a, o) => a + o.value, 0);
  return (
    <>
      <Kpis
        items={[
          { label: "Paid", value: naira(paid), tone: "ok" },
          { label: "Invoiced, processing", value: naira(processing) },
          { label: "Not yet invoiceable", value: orders.filter((o) => !o.delivered).length, sub: "Awaiting delivery confirmation", tone: "warn" },
        ]}
      />
      <Panel title="Invoices & payments">
        <ul className="rows">
          {orders.map((o) => (
            <li key={o.id}>
              <span className="row-main">
                <strong>
                  {o.id} · {naira(o.value)}
                </strong>
                <span className="small muted">{o.item}</span>
              </span>
              <span className="row-actions">
                <Badge tone={o.paid === "Paid" ? "ok" : o.invoiced ? "info" : "muted"}>{o.paid === "Paid" ? "Paid" : o.invoiced ? "Payment processing" : "Not invoiced"}</Badge>
                {!o.invoiced &&
                  (o.delivered ? (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setConfirm(o)}>
                      Raise invoice
                    </button>
                  ) : (
                    <>
                      <button type="button" className="btn btn-sm btn-primary" disabled aria-describedby={`why-${o.id}`}>
                        Raise invoice
                      </button>
                      <span id={`why-${o.id}`} className="disabled-why">
                        <Lock size={14} aria-hidden /> Can’t invoice until delivery is confirmed
                      </span>
                    </>
                  ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="small muted">Payment runs within 14 days of an approved invoice. Approver and releaser are always different people (GR-5).</p>
      </Panel>
      <AuditPanel items={items} />
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        title={`Raise invoice for ${confirm?.id ?? ""}?`}
        confirmLabel="Raise invoice"
        text={<p>Invoice for {confirm ? naira(confirm.value) : ""}. It goes to Finance for approval and cannot be edited after submission.</p>}
        onConfirm={() => {
          if (confirm) {
            setOrders(orders.map((x) => (x.id === confirm.id ? { ...x, invoiced: true, paid: "Processing" } : x)));
            download(`invoice-${confirm.id}.txt`, [`${vendorProfile.company} — INVOICE`, `PO: ${confirm.id}`, `Item: ${confirm.item} × ${confirm.qty}`, `Amount: ${naira(confirm.value)}`, `Delivery confirmed by: ${confirm.confirmedBy}`, `Date: ${new Date().toLocaleDateString("en-GB")}`, "", "Prototype invoice — not a tax document."].join("\n"));
            log(`raised invoice for ${confirm.id} (${naira(confirm.value)})`);
            toast("Invoice raised and sent to Finance");
          }
          setConfirm(null);
        }}
      />
    </>
  );
}

/* VN-6 */
function ProfitShare() {
  return (
    <Panel title="Merch profit-share statements" action={<DemoTag />}>
      <DataTable
        rows={profitShare}
        rowKey={(r) => r.period}
        caption="Weekly profit-share statements"
        columns={[
          { key: "period", header: "Period" },
          { key: "units", header: "Units sold", align: "right" },
          { key: "revenue", header: "Revenue", align: "right", render: (r) => naira(r.revenue) },
          { key: "vendorShare", header: "Your share (70%)", align: "right", render: (r) => naira(r.vendorShare) },
          { key: "campaignMargin", header: "Campaign margin", align: "right", render: (r) => naira(r.campaignMargin) },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Settled" ? "ok" : "warn"}>{r.status}</Badge> },
        ]}
      />
      <button type="button" className="btn btn-outline" onClick={() => download("profit-share-statements.csv", toCsv(profitShare as unknown as Record<string, string | number>[]), "text/csv")}>
        <Download size={16} aria-hidden /> Download statements (CSV)
      </button>
    </Panel>
  );
}

/* VN-7 */
function Offers({ log }: { log: (w: string) => void }) {
  const [offers, setOffers] = usePersisted<Offer[]>("tbh-vn-offers", vendorOffers);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ tone: "ok" | "danger" | "warn"; text: string } | null>(null);
  const [f, setF] = useState({ title: "", terms: "" });
  const [err, setErr] = useState("");
  const toast = useToast();
  return (
    <>
      <Grid>
        <Panel title="Validate a member code">
          <form
            className="code-check"
            onSubmit={(e) => {
              e.preventDefault();
              const c = code.trim().toUpperCase();
              if (!c) return setResult({ tone: "warn", text: "Enter the code shown on the member’s screen." });
              const o = offers.find((x) => x.codes.includes(c));
              if (!o) return setResult({ tone: "danger", text: `${c} is not a valid code for your offers.` });
              if (!o.active) return setResult({ tone: "warn", text: `${c} belongs to a paused offer.` });
              if (o.redeemed?.includes(c)) return setResult({ tone: "danger", text: `${c} was already redeemed.` });
              setOffers(offers.map((x) => (x.id === o.id ? { ...x, redemptions: x.redemptions + 1, redeemed: [...(x.redeemed ?? []), c] } : x)));
              log(`redeemed member code ${c} for ${o.id}`);
              setResult({ tone: "ok", text: `Valid — “${o.title}”. Redemption recorded.` });
              setCode("");
            }}
          >
            <TextField label="Member code" placeholder="TBH-OF1-K7P2" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" />
            <button type="submit" className="btn btn-primary">
              <Search size={16} aria-hidden /> Validate
            </button>
          </form>
          {result && (
            <div aria-live="polite">
              <Notice tone={result.tone} title={result.tone === "ok" ? "Code valid" : "Not redeemed"}>
                {result.text}
              </Notice>
            </div>
          )}
          <p className="small muted">Demo codes: {vendorOffers.flatMap((o) => o.codes).join(", ")}. You only see the code, never the member’s name or phone number.</p>
        </Panel>
        <Panel title="Create an offer">
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              if (f.title.trim().length < 6 || f.terms.trim().length < 6) return setErr("Give the offer a title and terms.");
              setErr("");
              const id = `OF-${offers.length + 1}`;
              const codes = Array.from({ length: 3 }, () => `TBH-${id.replace("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
              setOffers([...offers, { id, title: f.title.trim(), redemptions: 0, active: true, codes }]);
              log(`created offer ${id}: ${f.title.trim()}`);
              toast("Offer submitted for approval");
              setF({ title: "", terms: "" });
            }}
          >
            <TextField label="Offer title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            <TextArea label="Terms" value={f.terms} onChange={(e) => setF({ ...f, terms: e.target.value })} rows={2} error={err} />
            <button type="submit" className="btn btn-primary">
              Create offer
            </button>
          </form>
        </Panel>
      </Grid>
      <Panel title="My offers">
        <ul className="rows">
          {offers.map((o) => (
            <li key={o.id}>
              <span className="row-main">
                <strong>{o.title}</strong>
                <span className="small muted">
                  {o.id} · {o.redemptions} redemptions
                </span>
              </span>
              <span className="row-actions">
                <Badge tone={o.active ? "ok" : "muted"}>{o.active ? "Active" : "Paused"}</Badge>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setOffers(offers.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)));
                    log(`${o.active ? "paused" : "resumed"} offer ${o.id}`);
                  }}
                >
                  {o.active ? "Pause" : "Resume"}
                </button>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* VN-8 */
function Sponsorships() {
  return (
    <Panel title="Sponsorships" action={<DemoTag />}>
      <ul className="rows">
        {sponsorships.map((s) => (
          <li key={s.id}>
            <span className="row-main">
              <strong>{s.what}</strong>
              <span className="small muted">{s.reach}</span>
            </span>
            <Badge tone={s.status === "Booked" ? "ok" : "warn"}>{s.status}</Badge>
          </li>
        ))}
      </ul>
      <p className="small muted">Sponsored content is always labelled as sponsored. Sponsorship stops automatically at the campaign promotions cut-off.</p>
    </Panel>
  );
}

/* VN-9 */
function Reports() {
  const data = [
    { label: "Week 45", value: 290 },
    { label: "Week 46", value: 412 },
    { label: "Week 47", value: 538 },
  ];
  return (
    <>
      <Kpis
        items={[
          { label: "Merch units (3 weeks)", value: "1,240", trend: "up" },
          { label: "Offer redemptions", value: vendorOffers.reduce((a, o) => a + o.redemptions, 0) },
          { label: "On-time delivery", value: "94%", tone: "ok" },
          { label: "Average rating", value: "4.6 / 5" },
        ]}
      />
      <Panel title="Units sold by week" action={<DemoTag />}>
        <BarChart label="Units sold by week" data={data} />
        <button type="button" className="btn btn-outline" onClick={() => download("partner-report.csv", toCsv(data.map((d) => ({ week: d.label, units: d.value }))), "text/csv")}>
          <Download size={16} aria-hidden /> Download report (CSV)
        </button>
      </Panel>
    </>
  );
}

/* VN-10 */
function Conflicts({ user, log }: { user: DemoUser; log: (w: string) => void }) {
  type Dec = { has: "No" | "Yes"; detail: string; at: string; by: string };
  const [decs, setDecs] = usePersisted<Dec[]>("tbh-vn-coi", []);
  const [has, setHas] = useState<"No" | "Yes" | "">("");
  const [detail, setDetail] = useState("");
  const [truth, setTruth] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const toast = useToast();
  return (
    <Grid>
      <Panel title="Conflict-of-interest declaration">
        <form
          className="form-grid"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const x: Record<string, string> = {};
            if (!has) x.has = "Choose yes or no.";
            if (has === "Yes" && detail.trim().length < 10) x.detail = "Describe the relationship.";
            if (!truth) x.truth = "Confirm the declaration is true.";
            setErrs(x);
            if (Object.keys(x).length) return;
            setDecs([{ has: has as "No" | "Yes", detail: detail.trim(), at: new Date().toISOString(), by: `${user.firstName} ${user.lastName}` }, ...decs]);
            log(`filed conflict-of-interest declaration (${has})`);
            toast("Declaration filed");
            setHas("");
            setDetail("");
            setTruth(false);
          }}
        >
          <fieldset className="plain">
            <legend>Does any TBH One official, NDC aspirant, or their family member own, direct or work for your company?</legend>
            {(["No", "Yes"] as const).map((v) => (
              <label key={v} className="check">
                <input type="radio" name="coi" checked={has === v} onChange={() => setHas(v)} />
                <span>{v}</span>
              </label>
            ))}
            {errs.has && <p className="field-error">{errs.has}</p>}
          </fieldset>
          {has === "Yes" && <TextArea label="Who, and what is the relationship?" value={detail} onChange={(e) => setDetail(e.target.value)} error={errs.detail} rows={3} />}
          <CheckField label="This declaration is true. I will update it within 7 days if anything changes." checked={truth} onChange={(e) => setTruth(e.target.checked)} error={errs.truth} />
          <button type="submit" className="btn btn-primary">
            File declaration
          </button>
        </form>
      </Panel>
      <Panel title="Declarations on file">
        {decs.length ? (
          <ul className="rows">
            {decs.map((d, i) => (
              <li key={i}>
                <span className="row-main">
                  <strong>{d.has === "No" ? "No conflicts declared" : "Conflict declared"}</strong>
                  <span className="small muted">
                    {fmtDate(d.at, true)} · {d.by}
                    {d.detail ? ` · ${d.detail}` : ""}
                  </span>
                </span>
                <Badge tone={d.has === "No" ? "ok" : "warn"}>{d.has === "No" ? "Clear" : "Under review"}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<Check size={20} aria-hidden />} title="No declaration yet" text="You must file one before bids can be awarded." />
        )}
      </Panel>
    </Grid>
  );
}

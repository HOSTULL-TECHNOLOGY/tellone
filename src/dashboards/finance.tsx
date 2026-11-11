"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CircleSlash, Download, FileCheck2, Lock, Send, ShieldAlert, UserRoundCog } from "lucide-react";
import "@/styles/dash-office.css";
import { DashboardShell } from "@/components/dashboard/Shell";
import { AuditList, Badge, BarChart, Grid, Kpis, Panel, naira, type Tone } from "@/components/dashboard/kit";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ConfirmDialog, Dialog } from "@/components/ui/Interactive";
import { SelectField, TextArea, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import { readPref } from "@/lib/prefs";
import type { DemoUser } from "@/lib/auth";
import { contributions as seedLedger, fraudFlags, payouts as seedPayouts, reconLines as seedRecon, SECOND_REVIEWER, type Contribution, type Payout, type ReconLine } from "@/data/mock/backoffice";
import { downloadCsv, shortDateTime, stamp, useAudit, usePersisted, type AuditEntry, nairaShort } from "./office/common";

const LARGE = 1_000_000; // PRD decision 4: ID + source-of-funds checks
const LEGAL = 5_000_000; // PRD decision 4: legal review before funds are used

const statusTone = (s: Contribution["status"]): Tone => (s === "Settled" ? "ok" : s === "Returned" ? "muted" : s === "Held — legal review" ? "danger" : "warn");

/** Contributions written by the public "Fund a project" flow (localStorage), read defensively. */
function localContributions(): Contribution[] {
  try {
    const raw = JSON.parse(readPref("tbh-contributions") ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map((c: Record<string, unknown>, i: number) => {
      const amount = Number(c.amount ?? 0);
      const country = String(c.country ?? (c.abroad || c.foreign ? "Outside Nigeria" : "Nigeria"));
      const status: Contribution["status"] = country !== "Nigeria" ? "Held — foreign source" : amount >= LEGAL ? "Held — legal review" : amount >= LARGE ? "Held — ID check" : "Settled";
      return {
        id: String(c.reference ?? c.ref ?? `WEB-${i + 1}`),
        at: String(c.at ?? c.date ?? c.createdAt ?? new Date().toISOString()),
        contributor: String(c.contributor ?? c.name ?? c.fullName ?? "Named contributor"),
        method: (String(c.method ?? "Card").toLowerCase().includes("ussd") ? "USSD" : String(c.method ?? "").toLowerCase().includes("transfer") ? "Bank transfer" : "Card") as Contribution["method"],
        project: String(c.projectTitle ?? c.project ?? c.slug ?? "Website project"),
        category: String(c.category ?? "Community projects"),
        amount,
        country,
        status,
        ref: String(c.reference ?? c.ref ?? `WEB-${i + 1}`),
      };
    });
  } catch {
    return [];
  }
}

const payoutCategory = (p: Payout) => (p.kind === "Creator fee" ? "Media" : p.kind === "Vendor invoice" ? "Street activation" : p.kind === "Delivery fee" ? "Rewards" : p.kind === "Ward leader project mgmt" ? "Community projects" : "Street activation");

export default function FinanceDashboard({ section }: { section: string }) {
  return (
    <DashboardShell role="finance" section={section}>
      {(user) => <Finance section={section} user={user} />}
    </DashboardShell>
  );
}

function Finance({ section, user }: { section: string; user: DemoUser }) {
  const me = `${user.firstName} ${user.lastName}`;
  const [ledger, setLedger] = usePersisted<Contribution[]>("tbh-ofc-ledger", seedLedger);
  const [web, setWeb] = useState<Contribution[]>([]);
  useEffect(() => setWeb(localContributions()), []);
  const [payouts, setPayouts] = usePersisted<Payout[]>("tbh-ofc-payouts", seedPayouts);
  const [audit, addAudit] = useAudit("tbh-ofc-fin-audit", [
    { at: "22 Oct, 16:40", who: "Ngozi Adebayo", what: "approved PO-5503 (Ankara Prints Ltd, ₦185,000)" },
    { at: "21 Oct, 11:02", who: "Emeka Obi", what: "released PO-5506 (Kano Textile Works, ₦1,120,000) — approved by Ngozi Adebayo" },
  ]);
  const allLedger = useMemo(() => [...web.filter((w) => !ledger.some((l) => l.id === w.id)), ...ledger], [web, ledger]);

  switch (section) {
    case "payouts":
      return <Payouts me={me} payouts={payouts} setPayouts={setPayouts} addAudit={addAudit} />;
    case "reconciliation":
      return <Reconciliation me={me} addAudit={addAudit} />;
    case "holds":
      return <Holds me={me} ledger={allLedger} setLedger={setLedger} webIds={web.map((w) => w.id)} setWeb={setWeb} addAudit={addAudit} />;
    case "reports":
      return <Reports me={me} ledger={allLedger} payouts={payouts} addAudit={addAudit} />;
    case "fraud":
      return <Fraud me={me} addAudit={addAudit} />;
    case "audit":
      return <AuditView audit={audit} />;
    default:
      return <Ledger ledger={allLedger} webCount={web.length} />;
  }
}

/* ---------------------------------------------------------------- FN-1 Inflows ledger */
function Ledger({ ledger, webCount }: { ledger: Contribution[]; webCount: number }) {
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");
  const rows = ledger.filter((c) => (!method || c.method === method) && (!status || (status === "Held" ? c.status.startsWith("Held") : c.status === status)));
  const settled = ledger.filter((c) => c.status === "Settled").reduce((n, c) => n + c.amount, 0);
  const held = ledger.filter((c) => c.status.startsWith("Held")).reduce((n, c) => n + c.amount, 0);
  const cols: Column<Contribution>[] = [
    { key: "at", header: "Date", sortable: true, value: (c) => c.at, render: (c) => shortDateTime(c.at) },
    { key: "contributor", header: "Named contributor", sortable: true },
    { key: "project", header: "Project", value: (c) => c.project },
    { key: "method", header: "Method", sortable: true },
    { key: "amount", header: "Amount", align: "right", sortable: true, value: (c) => c.amount, render: (c) => naira(c.amount) },
    { key: "country", header: "Source", value: (c) => c.country },
    { key: "status", header: "Status", value: (c) => c.status, render: (c) => <Badge tone={statusTone(c.status)}>{c.status}</Badge> },
    { key: "ref", header: "Gateway ref", render: (c) => <span className="ofc-mono">{c.ref}</span> },
  ];
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Settled inflows", value: nairaShort(settled), sub: `${naira(settled)} · ${ledger.filter((c) => c.status === "Settled").length} contributions` },
          { label: "Held pending clearance", value: nairaShort(held), tone: held ? "warn" : undefined, sub: `${naira(held)} · ID, legal or foreign-source checks` },
          { label: "Named contributors", value: `${ledger.length}/${ledger.length}`, sub: "Every line has a named contributor (GR-4)" },
          { label: "From the website (this browser)", value: webCount, sub: "Fund-a-project test payments" },
        ]}
      />
      <Panel title="Inflows ledger">
        <DataTable
          rows={rows}
          columns={cols}
          rowKey={(c) => c.id}
          caption="Every contribution with named contributor, method, project and status"
          searchPlaceholder="Search contributor, project or reference"
          filters={
            <>
              <label className="sr-only" htmlFor="lf-m">
                Method
              </label>
              <select id="lf-m" className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="">All methods</option>
                <option>Card</option>
                <option>Bank transfer</option>
                <option>USSD</option>
              </select>
              <label className="sr-only" htmlFor="lf-s">
                Status
              </label>
              <select id="lf-s" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All statuses</option>
                <option>Settled</option>
                <option value="Held">Held</option>
                <option>Returned</option>
              </select>
            </>
          }
        />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- FN-2 Payout queue, two-person rule */
function Payouts({ me, payouts, setPayouts, addAudit }: { me: string; payouts: Payout[]; setPayouts: (f: (p: Payout[]) => Payout[]) => void; addAudit: (who: string, what: string) => void }) {
  const toast = useToast();
  const [actor, setActor] = useState<"me" | "second">("me");
  const acting = actor === "me" ? me : SECOND_REVIEWER;
  const [confirm, setConfirm] = useState<{ p: Payout; action: "approve" | "release" } | null>(null);
  const [reject, setReject] = useState<Payout | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const act = async (p: Payout, action: "approve" | "release") => {
    setBusy(true);
    await simulate(500);
    setBusy(false);
    setPayouts((all) =>
      all.map((x) => (x.id !== p.id ? x : action === "approve" ? { ...x, status: "Approved — awaiting release", approver: acting } : { ...x, status: "Released", releaser: acting })),
    );
    addAudit(acting, action === "approve" ? `approved ${p.id} (${p.payee}, ${naira(p.amount)})` : `released ${p.id} (${p.payee}, ${naira(p.amount)}) — approved by ${p.approver}`);
    toast(action === "approve" ? `${p.id} approved — a different controller must release it` : `${p.id} released (simulated transfer)`);
    setConfirm(null);
  };

  const groups: { title: string; filter: (p: Payout) => boolean }[] = [
    { title: "Awaiting approval", filter: (p) => p.status === "Awaiting approval" },
    { title: "Approved — awaiting release", filter: (p) => p.status === "Approved — awaiting release" },
    { title: "Released & rejected", filter: (p) => p.status === "Released" || p.status === "Rejected" },
  ];
  return (
    <div className="ofc-stack">
      <Notice tone="info" title="Two-person rule (GR-5)">
        The controller who approves a payout can never release it. Field payments are released only against approved proof (GR-6); vendor invoices only after delivery is confirmed.
      </Notice>
      <div className="ofc-switch-row" role="group" aria-label="Acting controller (prototype)">
        <UserRoundCog size={18} aria-hidden />
        <span>
          <strong>Prototype:</strong> acting as
        </span>
        <label className="choice">
          <input type="radio" name="actor" checked={actor === "me"} onChange={() => setActor("me")} />
          <span>{me} (you)</span>
        </label>
        <label className="choice">
          <input type="radio" name="actor" checked={actor === "second"} onChange={() => setActor("second")} />
          <span>{SECOND_REVIEWER} (second reviewer)</span>
        </label>
      </div>
      {groups.map((g) => {
        const list = payouts.filter(g.filter);
        return (
          <Panel key={g.title} title={`${g.title} (${list.length})`}>
            {list.length === 0 ? (
              <p className="ofc-muted">Nothing here.</p>
            ) : (
              <div className="ofc-cards">
                {list.map((p) => {
                  const proofOk = p.proof !== "Proof pending";
                  const sameAsApprover = p.approver === acting;
                  return (
                    <article key={p.id} className="ofc-card" data-tone={p.status === "Released" ? "ok" : p.status === "Rejected" ? "muted" : p.status.startsWith("Approved") ? "warn" : undefined}>
                      <div className="ofc-card-head">
                        <span className="ofc-card-title">
                          {p.id} · {p.payee}
                        </span>
                        <span className="ofc-strong ofc-num">{naira(p.amount)}</span>
                      </div>
                      <div className="ofc-meta">
                        <span>{p.kind}</span>
                        <span>{p.reference}</span>
                        <span>{p.account}</span>
                        <span>
                          <Badge tone={proofOk ? "ok" : "warn"}>{p.proof}</Badge>
                        </span>
                      </div>
                      <div className="ofc-meta">
                        {p.approver && <span>Approved by {p.approver}</span>}
                        {p.releaser && <span>Released by {p.releaser}</span>}
                      </div>
                      {p.status === "Awaiting approval" && (
                        <div className="ofc-actions">
                          <button type="button" className="btn btn-sm btn-primary" disabled={!proofOk || busy} onClick={() => setConfirm({ p, action: "approve" })}>
                            <BadgeCheck size={16} aria-hidden /> Approve
                          </button>
                          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setReject(p)}>
                            <CircleSlash size={16} aria-hidden /> Reject
                          </button>
                          {!proofOk && <span className="ofc-small ofc-warn">Cannot approve until the ward leader approves the proof.</span>}
                        </div>
                      )}
                      {p.status === "Approved — awaiting release" && (
                        <div className="ofc-actions">
                          <button type="button" className="btn btn-sm btn-primary" disabled={sameAsApprover || busy} aria-describedby={sameAsApprover ? `blk-${p.id}` : undefined} onClick={() => setConfirm({ p, action: "release" })}>
                            <Send size={16} aria-hidden /> Release payment
                          </button>
                          {sameAsApprover && (
                            <p id={`blk-${p.id}`} className="ofc-lock" role="note">
                              <Lock size={16} aria-hidden /> You approved this payout — a different Finance Controller must release it.
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </Panel>
        );
      })}
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm && act(confirm.p, confirm.action)}
        title={confirm?.action === "release" ? "Release this payment?" : "Approve this payout?"}
        confirmLabel={confirm?.action === "release" ? "Release (simulated)" : "Approve"}
        text={
          confirm && (
            <p>
              {confirm.p.payee} · {naira(confirm.p.amount)} · {confirm.p.reference}. Acting as <strong>{acting}</strong>.
              {confirm.action === "release" && " This sends money and cannot be undone."}
            </p>
          )
        }
      />
      <Dialog
        open={!!reject}
        onClose={() => setReject(null)}
        title={`Reject ${reject?.id ?? ""}`}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setReject(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={reason.trim().length < 5}
              onClick={() => {
                if (!reject) return;
                setPayouts((all) => all.map((x) => (x.id === reject.id ? { ...x, status: "Rejected" } : x)));
                addAudit(acting, `rejected ${reject.id}: ${reason.trim()}`);
                toast(`${reject.id} rejected`);
                setReject(null);
                setReason("");
              }}
            >
              Reject payout
            </button>
          </>
        }
      >
        <TextArea label="Reason (shared with the payee)" value={reason} onChange={(e) => setReason(e.target.value)} required hint="At least 5 characters." />
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- FN-3 Reconciliation */
function Reconciliation({ me, addAudit }: { me: string; addAudit: (who: string, what: string) => void }) {
  const toast = useToast();
  const [lines, setLines] = usePersisted<ReconLine[]>("tbh-ofc-recon", seedRecon);
  const unmatched = lines.filter((l) => !l.matched);
  const gateway = lines.filter((l) => l.source === "Paystack settlement").reduce((n, l) => n + l.amount, 0);
  const bank = lines.filter((l) => l.source === "Bank statement").reduce((n, l) => n + l.amount, 0);
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Gateway settlements", value: nairaShort(gateway), sub: naira(gateway) },
          { label: "Bank statement lines", value: nairaShort(bank), sub: naira(bank) },
          { label: "Unmatched lines", value: unmatched.length, tone: unmatched.length ? "warn" : "ok", sub: unmatched.length ? "Resolve before the monthly report" : "All matched" },
        ]}
      />
      <Panel title="Bank and payment-gateway reconciliation">
        <div className="ofc-scroll">
          <table className="ofc-table">
            <caption className="sr-only">Settlement and bank lines</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Source</th>
                <th scope="col">Reference</th>
                <th scope="col" className="num">
                  Amount
                </th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id}>
                  <td>{shortDateTime(l.date)}</td>
                  <td>{l.source}</td>
                  <td>
                    <span className="ofc-mono">{l.reference}</span>
                    {l.note && <div className="ofc-small ofc-muted">{l.note}</div>}
                  </td>
                  <td className="num">{naira(l.amount)}</td>
                  <td>{l.matched ? <Badge tone="ok">Matched</Badge> : <Badge tone="warn">Unmatched</Badge>}</td>
                  <td>
                    {!l.matched && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          setLines((all) => all.map((x) => (x.id === l.id ? { ...x, matched: true } : x)));
                          addAudit(me, `marked ${l.reference} as matched`);
                          toast(`${l.reference} marked as matched`);
                        }}
                      >
                        Mark matched
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- FN-4 Holds */
function Holds({ me, ledger, setLedger, webIds, setWeb, addAudit }: { me: string; ledger: Contribution[]; setLedger: (f: (l: Contribution[]) => Contribution[]) => void; webIds: string[]; setWeb: (f: (w: Contribution[]) => Contribution[]) => void; addAudit: (who: string, what: string) => void }) {
  const toast = useToast();
  const held = ledger.filter((c) => c.status.startsWith("Held"));
  const [confirm, setConfirm] = useState<{ c: Contribution; action: "clear" | "return" } | null>(null);
  const update = (c: Contribution, status: Contribution["status"]) => {
    const f = (all: Contribution[]) => all.map((x) => (x.id === c.id ? { ...x, status } : x));
    if (webIds.includes(c.id)) setWeb(f);
    else setLedger(f);
  };
  const why = (c: Contribution) =>
    c.status === "Held — foreign source"
      ? "Funds from outside Nigeria need legal clearance before acceptance (Concept Note compliance note, CC-7)."
      : c.amount >= LEGAL
        ? `₦${(LEGAL / 1_000_000).toFixed(0)}m or more: legal review before funds are used.`
        : `₦${(LARGE / 1_000_000).toFixed(0)}m or more in one payment or month: ID and source-of-funds checks.`;
  return (
    <div className="ofc-stack">
      <Notice tone="warn" title="Held money cannot be spent">
        Foreign-source and large contributions stay on hold until clearance is recorded against the contributor (GR-4, FN-4). Clearing records your name in the audit log.
      </Notice>
      {held.length === 0 ? (
        <Panel>
          <p className="ofc-muted">No contributions are on hold.</p>
        </Panel>
      ) : (
        <div className="ofc-cards">
          {held.map((c) => (
            <article key={c.id} className="ofc-card" data-tone={c.status === "Held — legal review" ? "danger" : "warn"}>
              <div className="ofc-card-head">
                <span className="ofc-card-title">
                  {c.contributor} · {naira(c.amount)}
                </span>
                <Badge tone={statusTone(c.status)}>{c.status}</Badge>
              </div>
              <div className="ofc-meta">
                <span>{c.project}</span>
                <span>{c.method}</span>
                <span>Source: {c.country}</span>
                <span className="ofc-mono">{c.ref}</span>
              </div>
              <p className="ofc-small">{why(c)}</p>
              <div className="ofc-actions">
                <button type="button" className="btn btn-sm btn-primary" onClick={() => setConfirm({ c, action: "clear" })}>
                  <FileCheck2 size={16} aria-hidden /> Record clearance
                </button>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setConfirm({ c, action: "return" })}>
                  Return funds
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        danger={confirm?.action === "return"}
        title={confirm?.action === "clear" ? "Record clearance?" : "Return these funds?"}
        confirmLabel={confirm?.action === "clear" ? "Record clearance" : "Return (simulated)"}
        text={confirm && <p>{confirm.action === "clear" ? `Confirm that the required checks for ${confirm.c.contributor} (${naira(confirm.c.amount)}) are complete and documented.` : `Refund ${naira(confirm.c.amount)} to ${confirm.c.contributor} through the original payment method.`}</p>}
        onConfirm={() => {
          if (!confirm) return;
          update(confirm.c, confirm.action === "clear" ? "Settled" : "Returned");
          addAudit(me, `${confirm.action === "clear" ? "recorded clearance for" : "returned"} ${confirm.c.ref} (${confirm.c.contributor}, ${naira(confirm.c.amount)})`);
          toast(confirm.action === "clear" ? "Clearance recorded — funds can now be used" : "Return started (simulated)");
          setConfirm(null);
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- FN-5/6 Reports generated from the ledger */
function Reports({ me, ledger, payouts, addAudit }: { me: string; ledger: Contribution[]; payouts: Payout[]; addAudit: (who: string, what: string) => void }) {
  const toast = useToast();
  const now = new Date();
  const months = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) };
  });
  const [month, setMonth] = useState(months[0].key);
  const [report, setReport] = useState<null | { rows: { category: string; income: number; spend: number }[]; at: string; month: string }>(null);
  const [published, setPublished] = usePersisted<string[]>("tbh-ofc-published-reports", []);
  const [busy, setBusy] = useState(false);
  const inMonth = (iso: string) => iso.slice(0, 7) === month;

  const generate = async () => {
    setBusy(true);
    await simulate(600);
    const cats = new Map<string, { income: number; spend: number }>();
    for (const c of ledger) if (c.status === "Settled" && inMonth(c.at)) cats.set(c.category, { income: (cats.get(c.category)?.income ?? 0) + c.amount, spend: cats.get(c.category)?.spend ?? 0 });
    for (const p of payouts) if (p.status === "Released" && inMonth(p.at)) {
      const k = payoutCategory(p);
      cats.set(k, { income: cats.get(k)?.income ?? 0, spend: (cats.get(k)?.spend ?? 0) + p.amount });
    }
    setReport({ rows: [...cats.entries()].map(([category, v]) => ({ category, ...v })).sort((a, b) => a.category.localeCompare(b.category)), at: stamp(), month });
    setBusy(false);
  };
  const totals = report?.rows.reduce((t, r) => ({ income: t.income + r.income, spend: t.spend + r.spend }), { income: 0, spend: 0 });
  const label = months.find((m) => m.key === (report?.month ?? month))?.label;
  const dueFifth = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 5 ? 1 : 0), 5);

  return (
    <div className="ofc-stack">
      <Notice tone="info" title="Generated from the ledger, never typed (GR-8)">
        The public spend report sums settled contributions and released payouts for the chosen month. Held contributions are excluded until cleared.
      </Notice>
      <Panel title="Monthly public spend report (FN-5)">
        <div className="ofc-filters">
          <SelectField label="Month" value={month} onChange={(e) => setMonth(e.target.value)} options={months.map((m) => ({ value: m.key, label: m.label }))} />
          <button type="button" className="btn btn-primary" onClick={generate} disabled={busy}>
            {busy ? "Generating…" : "Generate from ledger"}
          </button>
        </div>
        {report && totals && (
          <div className="ofc-report">
            <h3>TBH One spend report — {label}</h3>
            <p className="ofc-small ofc-muted">Generated {report.at} by {me} from {ledger.length} ledger lines and {payouts.length} payout records. Figures are demo data.</p>
            {report.rows.length === 0 ? (
              <p>No settled contributions or released payouts in this month.</p>
            ) : (
              <div className="ofc-scroll">
                <table className="ofc-table">
                  <caption className="sr-only">Income and spend by category</caption>
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col" className="num">
                        Income received
                      </th>
                      <th scope="col" className="num">
                        Spend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((r) => (
                      <tr key={r.category}>
                        <td>{r.category}</td>
                        <td className="num">{naira(r.income)}</td>
                        <td className="num">{naira(r.spend)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td className="num">{naira(totals.income)}</td>
                      <td className="num">{naira(totals.spend)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            <div className="ofc-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  downloadCsv(`tbh-one-spend-report-${report.month}.csv`, [["Category", "Income received (NGN)", "Spend (NGN)"], ...report.rows.map((r) => [r.category, r.income, r.spend]), ["Total", totals.income, totals.spend]]);
                  addAudit(me, `downloaded the ${label} spend report CSV`);
                }}
              >
                <Download size={16} aria-hidden /> Download CSV
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={published.includes(report.month)}
                onClick={async () => {
                  await simulate(500);
                  setPublished((p) => [...p, report.month]);
                  addAudit(me, `published the ${label} spend report to the Transparency page`);
                  toast("Published to the Transparency page (simulated)");
                }}
              >
                {published.includes(report.month) ? "Published" : "Publish to Transparency page"}
              </button>
            </div>
          </div>
        )}
      </Panel>
      <Panel title="Campaign-spend summary for the NDC campaign (FN-6)">
        <p>
          Monthly summary by category for the NDC campaign finance team, due by <strong>{dueFifth.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong>. Full records are handed over for the party&apos;s audited return within six months of the election (Electoral Act 2026, s.93 — PRD decision 5).
        </p>
        <button
          type="button"
          className="btn btn-outline"
          disabled={!report}
          onClick={() => {
            if (!report || !totals) return;
            downloadCsv(`ndc-campaign-spend-summary-${report.month}.csv`, [["TBH One — campaign-spend summary", label ?? ""], ["Category", "Spend (NGN)"], ...report.rows.map((r) => [r.category, r.spend]), ["Total", totals.spend]]);
            addAudit(me, `exported the NDC campaign-spend summary for ${label}`);
          }}
        >
          <Download size={16} aria-hidden /> Export summary (CSV)
        </button>
        {!report && <p className="ofc-small ofc-muted">Generate the monthly report first.</p>}
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- FN-7 Fraud flags */
function Fraud({ me, addAudit }: { me: string; addAudit: (who: string, what: string) => void }) {
  const toast = useToast();
  const [status, setStatus] = usePersisted<Record<string, string>>("tbh-ofc-fraud", {});
  return (
    <div className="ofc-stack">
      <Kpis
        items={[
          { label: "Open flags", value: fraudFlags.filter((f) => !status[f.id]).length, tone: "warn" },
          { label: "Payouts frozen", value: Object.values(status).filter((s) => s === "Payouts frozen").length },
        ]}
      />
      <div className="ofc-cards">
        {fraudFlags.map((f) => (
          <article key={f.id} className="ofc-card" data-tone={status[f.id] ? "muted" : f.severity === "High" ? "danger" : "warn"}>
            <div className="ofc-card-head">
              <span className="ofc-card-title">
                <ShieldAlert size={16} aria-hidden /> {f.kind}
              </span>
              <Badge tone={f.severity === "High" ? "danger" : f.severity === "Medium" ? "warn" : "muted"}>{f.severity}</Badge>
            </div>
            <p>{f.detail}</p>
            <div className="ofc-meta">
              <span>{f.id}</span>
              <span>{shortDateTime(f.at)}</span>
              {status[f.id] && <span className="ofc-strong">{status[f.id]}</span>}
            </div>
            {!status[f.id] && (
              <div className="ofc-actions">
                {(["Payouts frozen", "Dismissed — false positive", "Sent to safeguarding"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`btn btn-sm ${a === "Payouts frozen" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => {
                      setStatus((s) => ({ ...s, [f.id]: a }));
                      addAudit(me, `${a.toLowerCase()} for ${f.id} (${f.kind})`);
                      toast(`${f.id}: ${a}`);
                    }}
                  >
                    {a === "Payouts frozen" ? "Freeze payouts" : a === "Dismissed — false positive" ? "Dismiss" : "Refer to safeguarding"}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function AuditView({ audit }: { audit: AuditEntry[] }) {
  const [q, setQ] = useState("");
  const rows = audit.filter((a) => `${a.who} ${a.what}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Grid cols={2}>
      <Panel title="Audit log (SH-14)" action={<span className="ofc-small ofc-muted">{audit.length} entries · append-only</span>}>
        <label className="sr-only" htmlFor="aq">
          Filter audit log
        </label>
        <input id="aq" className="input" type="search" placeholder="Filter by person or action" value={q} onChange={(e) => setQ(e.target.value)} />
        <AuditList items={rows} />
      </Panel>
      <Panel title="Actions recorded">
        <BarChart
          label="Audit entries by type"
          data={["approved", "released", "rejected", "clearance", "published", "matched"].map((k) => ({ label: k[0].toUpperCase() + k.slice(1), value: audit.filter((a) => a.what.includes(k)).length }))}
        />
        <p className="ofc-small ofc-muted">Every create, edit, approve and pay action is written here and visible to admins. Production stores it server-side and append-only.</p>
      </Panel>
    </Grid>
  );
}

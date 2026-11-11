"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Check, Download, FileText, Lock, Search, Upload, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { BarChart, Badge, Grid, Kpis, Panel, naira } from "@/components/dashboard/kit";
import { CheckField, SelectField, SubmitButton, TextArea, TextField, simulate } from "@/components/ui/Form";
import { CopyButton, Dialog } from "@/components/ui/Interactive";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, Notice } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import type { DemoUser } from "@/lib/auth";
import { briefs, creatorPerformance, translationMemory, type Brief } from "@/data/mock/field";
import { AuditPanel, DemoTag, download, fmtDate, useAudit, usePersisted } from "./field/common";

type Decision = "Approved" | "Changes requested";
type Work = {
  id: string;
  briefId: string;
  submitted: boolean;
  fileName?: string;
  ai?: boolean;
  sponsored?: boolean;
  sponsor?: string;
  consentFile?: string;
  notes?: string;
  creative?: Decision;
  creativeNote?: string;
  compliance?: Decision;
  complianceNote?: string;
  published?: boolean;
  invoiced?: boolean;
  paid?: boolean;
};
const SEED: Work[] = [
  { id: "W-1", briefId: "BR-401", submitted: false },
  { id: "W-0", briefId: "BR-403", submitted: true, fileName: "corruption-chain-carousel.pdf", ai: false, sponsored: false, creative: "Approved", compliance: "Approved", published: true, invoiced: true, paid: true },
];
const COLS = ["In progress", "Submitted", "In review", "Approved", "Changes requested"] as const;
const stage = (w: Work): (typeof COLS)[number] => {
  if (!w.submitted) return "In progress";
  if (w.creative === "Changes requested" || w.compliance === "Changes requested") return "Changes requested";
  if (w.creative === "Approved" && w.compliance === "Approved") return "Approved";
  if (w.creative === "Approved") return "In review";
  return "Submitted";
};
const briefOf = (id: string) => briefs.find((b) => b.id === id) as Brief;

export default function CreatorDashboard({ section }: { section: string }) {
  return <DashboardShell role="creator" section={section}>{(user) => <Screens section={section} user={user} />}</DashboardShell>;
}

function useWork() {
  return usePersisted<Work[]>("tbh-cr-work", SEED);
}

function Screens({ section, user }: { section: string; user: DemoUser }) {
  const audit = useAudit("creator", `${user.firstName} ${user.lastName} (creator)`);
  switch (section) {
    case "work":
      return <Kanban />;
    case "submit":
      return <Submit log={audit.log} />;
    case "reviews":
      return <Reviews log={audit.log} items={audit.items} />;
    case "earnings":
      return <Earnings user={user} log={audit.log} />;
    case "assets":
      return <Assets />;
    case "performance":
      return <Performance />;
    case "translation-memory":
      return <Memory />;
    case "conduct":
      return <Conduct user={user} log={audit.log} />;
    default:
      return <Briefs log={audit.log} />;
  }
}

function WorkTags({ w }: { w: Work }) {
  return (
    <span className="proof-flags">
      {w.ai && (
        <Badge tone="info">
          <Bot size={12} aria-hidden /> AI-generated
        </Badge>
      )}
      {w.sponsored && <Badge tone="warn">Sponsored{w.sponsor ? `: ${w.sponsor}` : ""}</Badge>}
      {briefOf(w.briefId)?.peopleFeatured && <Badge tone={w.consentFile ? "ok" : "danger"}>{w.consentFile ? "Consent form on file" : "Consent form missing"}</Badge>}
    </span>
  );
}

/* CR-1 */
function Briefs({ log }: { log: (w: string) => void }) {
  const [work, setWork] = useWork();
  const [kind, setKind] = useState("All");
  const toast = useToast();
  const accepted = new Set(work.map((w) => w.briefId));
  const list = briefs.filter((b) => kind === "All" || b.kind === kind);
  return (
    <>
      <Kpis
        items={[
          { label: "Open briefs", value: briefs.filter((b) => !accepted.has(b.id)).length },
          { label: "In progress", value: work.filter((w) => stage(w) === "In progress").length },
          { label: "Awaiting review", value: work.filter((w) => ["Submitted", "In review"].includes(stage(w))).length },
          { label: "Approved", value: work.filter((w) => stage(w) === "Approved").length, tone: "ok" },
        ]}
      />
      <Panel title="Open briefs" action={<DemoTag />}>
        <div className="filters">
          <SelectField label="Type" value={kind} onChange={(e) => setKind(e.target.value)} options={["All", "Video", "Graphic", "Translation", "Copy", "Audio"]} />
        </div>
        <ul className="funded">
          {list.map((b) => (
            <li key={b.id} className="funded-item">
              <div className="funded-head">
                <h3>{b.title}</h3>
                <strong>{naira(b.fee)}</strong>
              </div>
              <p className="small muted">
                {b.id} · {b.kind} · {b.language} · {b.location} · due {fmtDate(b.deadline)} · skills: {b.skills.join(", ")}
              </p>
              {b.peopleFeatured && <p className="small">People appear in this piece: a signed consent form is required for each person.</p>}
              <div className="form-actions">
                {accepted.has(b.id) ? (
                  <Badge tone="ok">Accepted</Badge>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setWork([...work, { id: `W-${Date.now()}`, briefId: b.id, submitted: false }]);
                      log(`accepted brief ${b.id}`);
                      toast("Brief accepted — it’s in My work");
                    }}
                  >
                    Accept brief
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* CR-2 */
function Kanban() {
  const [work] = useWork();
  return (
    <Panel title="My work">
      <div className="kanban">
        {COLS.map((c) => {
          const items = work.filter((w) => stage(w) === c);
          return (
            <section key={c} className="kanban-col" aria-label={c}>
              <h3>
                {c} <span>{items.length}</span>
              </h3>
              <ul>
                {items.map((w) => (
                  <li key={w.id} className="kcard">
                    <strong>{briefOf(w.briefId)?.title}</strong>
                    <p className="small muted">
                      {w.briefId} · due {fmtDate(briefOf(w.briefId)?.deadline)}
                    </p>
                    <WorkTags w={w} />
                    {c === "In progress" && (
                      <Link className="btn btn-sm btn-outline" href={`/dashboard/creator/submit?work=${w.id}`}>
                        Submit
                      </Link>
                    )}
                    {(c === "Submitted" || c === "In review" || c === "Changes requested") && (
                      <Link className="btn btn-sm btn-ghost" href="/dashboard/creator/reviews">
                        See review
                      </Link>
                    )}
                  </li>
                ))}
                {!items.length && <li className="small muted">Nothing here</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </Panel>
  );
}

/* CR-3 */
function Submit({ log }: { log: (w: string) => void }) {
  const [work, setWork] = useWork();
  const open = work.filter((w) => !w.submitted || stage(w) === "Changes requested");
  const [sel, setSel] = useState("");
  const [file, setFile] = useState<{ name: string; url: string; type: string } | null>(null);
  const [consent, setConsent] = useState("");
  const [ai, setAi] = useState(false);
  const [aiTools, setAiTools] = useState("");
  const [sponsored, setSponsored] = useState(false);
  const [sponsor, setSponsor] = useState("");
  const [notes, setNotes] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("work");
    if (q) setSel(q);
  }, []);
  useEffect(() => () => void (file && URL.revokeObjectURL(file.url)), [file]);
  const current = work.find((w) => w.id === sel);
  const brief = current ? briefOf(current.briefId) : undefined;
  if (!open.length) return <EmptyState icon={<Upload size={20} aria-hidden />} title="Nothing to submit" text="Accept a brief first." action={<Link className="btn btn-primary" href="/dashboard/creator">Open briefs</Link>} />;
  return (
    <Panel title="Submit work">
      <form
        className="form-grid"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          const x: Record<string, string> = {};
          if (!current) x.sel = "Choose the brief you are submitting for.";
          if (!file) x.file = "Attach your file.";
          if (ai && aiTools.trim().length < 2) x.ai = "Name the AI tools used.";
          if (sponsored && sponsor.trim().length < 2) x.sponsor = "Name the sponsor.";
          setErrs(x);
          if (Object.keys(x).length || !current || !file) return;
          setBusy(true);
          await simulate();
          setBusy(false);
          setWork(work.map((w) => (w.id === current.id ? { ...w, submitted: true, fileName: file.name, ai, sponsored, sponsor: sponsored ? sponsor.trim() : undefined, consentFile: consent || w.consentFile, notes: notes.trim(), creative: undefined, compliance: undefined, creativeNote: undefined, complianceNote: undefined } : w)));
          log(`submitted ${file.name} for ${current.briefId}${ai ? " (AI-generated)" : ""}${sponsored ? ` (sponsored by ${sponsor.trim()})` : ""}`);
          toast("Submitted for review");
          setFile(null);
          setSel("");
        }}
      >
        <SelectField label="Brief" value={sel} onChange={(e) => setSel(e.target.value)} placeholder="Choose a brief…" options={open.map((w) => ({ value: w.id, label: `${w.briefId} · ${briefOf(w.briefId)?.title}` }))} error={errs.sel} />
        <div>
          <label className="btn btn-outline upload-btn">
            <Upload size={16} aria-hidden /> {file ? "Replace file" : "Choose file"}
            <input
              type="file"
              className="sr-only"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile({ name: f.name, url: URL.createObjectURL(f), type: f.type });
              }}
            />
          </label>
          {errs.file && <p className="field-error">{errs.file}</p>}
          {file && (
            <div className="file-preview" aria-live="polite">
              {file.type.startsWith("image/") ? <img src={file.url} alt="Preview of your upload" /> : file.type.startsWith("video/") ? <video src={file.url} controls muted /> : file.type.startsWith("audio/") ? <audio src={file.url} controls /> : <FileText size={32} aria-hidden />}
              <span className="small">
                {file.name}
                <br />
                <span className="muted">Preview stays on this device in the prototype.</span>
              </span>
            </div>
          )}
        </div>
        {brief?.peopleFeatured && (
          <div>
            <Notice tone="warn" title="Consent form required">
              This brief features people. Attach a signed consent form for each person. Without it the piece cannot be approved.
            </Notice>
            <label className="btn btn-sm btn-outline upload-btn">
              <Upload size={16} aria-hidden /> {consent || current?.consentFile ? "Replace consent form" : "Attach consent form"}
              <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => setConsent(e.target.files?.[0]?.name ?? "")} />
            </label>
            {(consent || current?.consentFile) && <p className="small">Consent form: {consent || current?.consentFile}</p>}
          </div>
        )}
        <fieldset className="plain">
          <legend>Declarations</legend>
          <CheckField label="I used AI tools to create or edit this work" checked={ai} onChange={(e) => setAi(e.target.checked)} />
          {ai && (
            <>
              <TextField label="Which AI tools?" value={aiTools} onChange={(e) => setAiTools(e.target.value)} error={errs.ai} />
              <p className="small">
                <Badge tone="info">
                  <Bot size={12} aria-hidden /> AI-generated
                </Badge>{" "}
                This label is added automatically and shown wherever the piece is published.
              </p>
            </>
          )}
          <CheckField label="This work is sponsored or I was paid by a third party" checked={sponsored} onChange={(e) => setSponsored(e.target.checked)} />
          {sponsored && <TextField label="Sponsor name" value={sponsor} onChange={(e) => setSponsor(e.target.value)} error={errs.sponsor} />}
        </fieldset>
        <TextArea label="Notes for the reviewer (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        <SubmitButton busy={busy}>Submit for review</SubmitButton>
      </form>
    </Panel>
  );
}

/* CR-4 — two-step review: creative lead, then compliance */
function Reviews({ log, items }: { log: (w: string) => void; items: { at: string; who: string; what: string }[] }) {
  const [work, setWork] = useWork();
  const [note, setNote] = useState<{ id: string; step: "creative" | "compliance" } | null>(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const toast = useToast();
  const update = (id: string, patch: Partial<Work>) => setWork(work.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const submitted = work.filter((w) => w.submitted);
  return (
    <>
      <Notice tone="info" title="How review works">
        Every piece is checked by the creative lead first, then by compliance. It can only be published when both approve. In this prototype you can play the reviewers to try the flow.
      </Notice>
      {!submitted.length && <EmptyState title="Nothing submitted yet" />}
      {submitted.map((w) => {
        const b = briefOf(w.briefId);
        const needsConsent = b?.peopleFeatured && !w.consentFile;
        const both = w.creative === "Approved" && w.compliance === "Approved";
        return (
          <Panel key={w.id} title={b?.title ?? w.briefId} action={<Badge tone={both ? "ok" : stage(w) === "Changes requested" ? "danger" : "info"}>{w.published ? "Published" : stage(w)}</Badge>}>
            <p className="small muted">
              {w.fileName} · {w.briefId}
            </p>
            <WorkTags w={w} />
            {needsConsent && (
              <div className="form-actions">
                <label className="btn btn-sm btn-outline upload-btn">
                  <Upload size={16} aria-hidden /> Attach consent form
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const n = e.target.files?.[0]?.name;
                      if (n) {
                        update(w.id, { consentFile: n });
                        log(`attached consent form ${n} to ${w.id}`);
                      }
                    }}
                  />
                </label>
              </div>
            )}
            <ol className="review-steps">
              <li>
                <span>
                  <strong>1. Creative lead</strong>
                  {w.creativeNote && <span className="small muted"> · “{w.creativeNote}”</span>}
                </span>
                {w.creative ? (
                  <Badge tone={w.creative === "Approved" ? "ok" : "danger"}>{w.creative}</Badge>
                ) : (
                  <span className="row-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      disabled={needsConsent}
                      onClick={() => {
                        update(w.id, { creative: "Approved" });
                        log(`creative lead approved ${w.id}`);
                        toast("Creative lead approved");
                      }}
                    >
                      <Check size={16} aria-hidden /> Approve (demo)
                    </button>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => (setNote({ id: w.id, step: "creative" }), setText(""), setErr(""))}>
                      Request changes
                    </button>
                    {needsConsent && (
                      <span className="disabled-why">
                        <Lock size={14} aria-hidden /> Can’t approve: consent form missing for people featured
                      </span>
                    )}
                  </span>
                )}
              </li>
              <li>
                <span>
                  <strong>2. Compliance</strong>
                  {w.complianceNote && <span className="small muted"> · “{w.complianceNote}”</span>}
                </span>
                {w.compliance ? (
                  <Badge tone={w.compliance === "Approved" ? "ok" : "danger"}>{w.compliance}</Badge>
                ) : w.creative !== "Approved" ? (
                  <span className="disabled-why">
                    <Lock size={14} aria-hidden /> Waiting for creative lead
                  </span>
                ) : (
                  <span className="row-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        update(w.id, { compliance: "Approved" });
                        log(`compliance approved ${w.id}`);
                        toast("Compliance approved");
                      }}
                    >
                      <Check size={16} aria-hidden /> Approve (demo)
                    </button>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => (setNote({ id: w.id, step: "compliance" }), setText(""), setErr(""))}>
                      Request changes
                    </button>
                  </span>
                )}
              </li>
            </ol>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!both || w.published}
                onClick={() => {
                  update(w.id, { published: true });
                  log(`published ${w.id}${w.ai ? " with AI-generated label" : ""}`);
                  toast("Published");
                }}
              >
                {w.published ? "Published" : "Publish"}
              </button>
              {!both && (
                <span className="disabled-why">
                  <Lock size={14} aria-hidden /> Publishing needs both approvals
                </span>
              )}
              {stage(w) === "Changes requested" && (
                <Link className="btn btn-outline" href={`/dashboard/creator/submit?work=${w.id}`}>
                  Resubmit
                </Link>
              )}
            </div>
          </Panel>
        );
      })}
      <AuditPanel items={items} />
      <Dialog
        open={!!note}
        onClose={() => setNote(null)}
        title="Request changes"
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setNote(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (text.trim().length < 5) return setErr("Explain what needs to change.");
                if (note) {
                  update(note.id, note.step === "creative" ? { creative: "Changes requested", creativeNote: text.trim() } : { compliance: "Changes requested", complianceNote: text.trim() });
                  log(`${note.step} requested changes on ${note.id}: ${text.trim()}`);
                }
                setNote(null);
              }}
            >
              <X size={16} aria-hidden /> Request changes
            </button>
          </>
        }
      >
        <TextArea label="What needs to change?" value={text} onChange={(e) => setText(e.target.value)} error={err} rows={3} />
      </Dialog>
    </>
  );
}

/* CR-5 */
function Earnings({ user, log }: { user: DemoUser; log: (w: string) => void }) {
  const [work, setWork] = useWork();
  const toast = useToast();
  const approved = work.filter((w) => stage(w) === "Approved");
  const sum = (f: (w: Work) => boolean) => approved.filter(f).reduce((a, w) => a + (briefOf(w.briefId)?.fee ?? 0), 0);
  const invoice = (w: Work) => {
    const b = briefOf(w.briefId);
    const no = `INV-CR-${w.id.replace(/\D/g, "").slice(-5) || "0"}`;
    return [`TBH ONE — CREATOR INVOICE`, `Invoice: ${no}`, `Date: ${new Date().toLocaleDateString("en-GB")}`, `From: ${user.firstName} ${user.lastName}`, `To: TBH One Creative, Abuja`, ``, `Brief: ${b.id} — ${b.title}`, `Amount: ${naira(b.fee)}`, `AI-generated: ${w.ai ? "Yes" : "No"}`, `Sponsored: ${w.sponsored ? `Yes (${w.sponsor})` : "No"}`, ``, `Prototype invoice — not a tax document.`].join("\n");
  };
  return (
    <>
      <Kpis
        items={[
          { label: "Paid", value: naira(sum((w) => !!w.paid)), tone: "ok" },
          { label: "Invoiced, awaiting payment", value: naira(sum((w) => !!w.invoiced && !w.paid)) },
          { label: "Approved, not invoiced", value: naira(sum((w) => !w.invoiced)), tone: "warn" },
        ]}
      />
      <Panel title="Invoices and payouts">
        {approved.length ? (
          <ul className="rows">
            {approved.map((w) => {
              const b = briefOf(w.briefId);
              return (
                <li key={w.id}>
                  <span className="row-main">
                    <strong>
                      {b.title} · {naira(b.fee)}
                    </strong>
                    <span className="small muted">{w.paid ? "Paid to your bank account" : w.invoiced ? "Payout processing — usually 5 working days" : "Ready to invoice"}</span>
                  </span>
                  <span className="row-actions">
                    <Badge tone={w.paid ? "ok" : w.invoiced ? "info" : "warn"}>{w.paid ? "Paid" : w.invoiced ? "Processing" : "Not invoiced"}</Badge>
                    {!w.invoiced ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setWork(work.map((x) => (x.id === w.id ? { ...x, invoiced: true } : x)));
                          download(`invoice-${w.id}.txt`, invoice(w));
                          log(`raised invoice for ${w.id} (${naira(b.fee)})`);
                          toast("Invoice raised and downloaded");
                        }}
                      >
                        Raise invoice
                      </button>
                    ) : (
                      <button type="button" className="btn btn-sm btn-outline" onClick={() => download(`invoice-${w.id}.txt`, invoice(w))}>
                        <Download size={16} aria-hidden /> Invoice
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title="No approved work yet" text="Invoices can be raised once both reviewers approve a piece." />
        )}
      </Panel>
    </>
  );
}

/* CR-6 */
const ASSETS = [
  { kind: "Logo", title: "TBH One logo (PNG)", href: "/brand/tbh-one-logo.png", img: "/brand/tbh-one-logo-360.webp" },
  { kind: "Logo", title: "TBH One logo with portraits", href: "/brand/tbh-one-logo-portraits.png", img: "/brand/tbh-one-logo-portraits.webp" },
  { kind: "App icon", title: "Icon 512 px", href: "/brand/icon-512.png", img: "/brand/icon-192.png" },
  ...["en", "ha", "ig", "yo"].map((l) => ({ kind: "Poster", title: `Tagline poster (${{ en: "English", ha: "Hausa", ig: "Igbo", yo: "Yorùbá" }[l]})`, href: `/media/poster-${l}-1320.jpg`, img: `/media/poster-${l}-480.webp` })),
  ...[
    ["we-no-go-thief-your-money-v1", "Theme song v1 (English)"],
    ["we-no-go-thief-your-money-pidgin", "Theme song (Pidgin)"],
    ["a-ki-i-ji-owo-yin", "A kì í jí owó yín (Yorùbá)"],
    ["kudin-jamaa", "Kuɗin jama’a (Hausa)"],
    ["money-meant-for-all", "Money meant for all"],
  ].map(([f, t]) => ({ kind: "Audio", title: t, href: `/audio/${f}-128.mp3`, audio: `/audio/${f}-48.mp3` })),
] as { kind: string; title: string; href: string; img?: string; audio?: string }[];
function Assets() {
  const [kind, setKind] = useState("All");
  return (
    <Panel title="Asset library">
      <p className="small muted">Approved brand assets. Use them as supplied; don’t recolour the logo or change the tagline wording.</p>
      <div className="filters">
        <SelectField label="Type" value={kind} onChange={(e) => setKind(e.target.value)} options={["All", "Logo", "App icon", "Poster", "Audio"]} />
      </div>
      <ul className="asset-grid">
        {ASSETS.filter((a) => kind === "All" || a.kind === kind).map((a) => (
          <li key={a.href}>
            {a.img && <img src={a.img} alt="" loading="lazy" />}
            {a.audio && <audio src={a.audio} controls preload="none" aria-label={a.title} />}
            <strong>{a.title}</strong>
            <span className="small muted">{a.kind}</span>
            <a className="btn btn-sm btn-outline" href={a.href} download>
              <Download size={16} aria-hidden /> Download
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* CR-7 */
function Performance() {
  return (
    <>
      <Kpis
        items={[
          { label: "Total views", value: creatorPerformance.reduce((a, p) => a + p.views, 0).toLocaleString("en-NG") },
          { label: "Shares", value: creatorPerformance.reduce((a, p) => a + p.shares, 0).toLocaleString("en-NG") },
          { label: "Average engagement", value: `${(creatorPerformance.reduce((a, p) => a + p.engagement, 0) / creatorPerformance.length).toFixed(1)}%` },
        ]}
      />
      <Panel title="Views by piece" action={<DemoTag />}>
        <BarChart label="Views by piece" data={creatorPerformance.map((p) => ({ label: p.title, value: p.views }))} />
        <DataTable
          rows={creatorPerformance}
          rowKey={(r) => r.title}
          caption="Performance of published work"
          columns={[
            { key: "title", header: "Piece" },
            { key: "views", header: "Views", align: "right", sortable: true, value: (r) => r.views, render: (r) => r.views.toLocaleString("en-NG") },
            { key: "shares", header: "Shares", align: "right", sortable: true, value: (r) => r.shares, render: (r) => r.shares.toLocaleString("en-NG") },
            { key: "engagement", header: "Engagement", align: "right", sortable: true, value: (r) => r.engagement, render: (r) => `${r.engagement}%` },
          ]}
        />
      </Panel>
    </>
  );
}

/* CR-8 */
const LANGS = ["English", "Pidgin", "Yorùbá", "Hausa", "Igbo"] as const;
function Memory() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? translationMemory.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(s))) : translationMemory;
  }, [q]);
  const tagline = translationMemory[0];
  return (
    <>
      <Panel title="The tagline in five languages">
        <ul className="lang-grid">
          {LANGS.map((l) => (
            <li key={l}>
              <span className="today-kind">{l}</span>
              <blockquote>{tagline[l]}</blockquote>
              <CopyButton value={tagline[l]} label={`Copy ${l}`} />
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Translation memory">
        <TextField label="Search terms in any language" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. owó, Bring One, kuɗi" />
        <p className="small muted" aria-live="polite">
          <Search size={12} aria-hidden /> {rows.length} of {translationMemory.length} terms
        </p>
        <ul className="funded">
          {rows.map((r) => (
            <li key={r.term} className="funded-item">
              <span className="tm-term">{r.term}</span>
              <div className="tm-row">
                {LANGS.map((l) => (
                  <div key={l}>
                    <span className="tm-lang">{l}</span>
                    {r[l]}
                  </div>
                ))}
              </div>
            </li>
          ))}
          {!rows.length && <EmptyState title="No matching terms" text="Ask the translator network to add it." />}
        </ul>
      </Panel>
    </>
  );
}

/* CR-9 */
const CODE = [
  "Tell the truth. No fabricated quotes, figures or images of real people.",
  "No hate speech, ethnic or religious attacks, or content that incites violence.",
  "Label AI-generated or AI-edited content, every time.",
  "Declare any sponsorship or third-party payment.",
  "Get signed consent before featuring anyone; never feature children without a guardian’s consent.",
  "Never ask for or show voter card (PVC) details.",
];
const QUIZ = [
  { q: "You used an AI voice to narrate a skit. What do you do?", options: ["Nothing, it’s just audio", "Declare AI use so it’s labelled AI-generated", "Mention it only if asked"], answer: 1 },
  { q: "A market trader appears clearly in your vox pop. You need…", options: ["Their signed consent form", "Nothing if it’s a public place", "A verbal OK only"], answer: 0 },
  { q: "A business offers to pay you to post a campaign video.", options: ["Accept quietly", "Declare the sponsorship on submission", "Post from a different account"], answer: 1 },
];
function Conduct({ user, log }: { user: DemoUser; log: (w: string) => void }) {
  const [signed, setSigned] = usePersisted<string | null>("tbh-cr-coc", "2026-05-02T10:00:00Z");
  const [agree, setAgree] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const [ans, setAns] = useState<number[]>([]);
  const [qerr, setQerr] = useState("");
  const toast = useToast();
  const due = signed ? new Date(new Date(signed).getTime() + 182 * 86400_000) : null;
  const overdue = due ? due.getTime() < Date.now() : true;
  return (
    <Grid>
      <Panel title="Code of conduct">
        <ol className="module-points">
          {CODE.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
        {signed ? (
          <p>
            <Badge tone="ok">Signed {fmtDate(signed)}</Badge> by {user.firstName} {user.lastName}
          </p>
        ) : (
          <>
            <CheckField label="I have read and agree to the code of conduct" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <button
              type="button"
              className="btn btn-primary"
              disabled={!agree}
              onClick={() => {
                const now = new Date().toISOString();
                setSigned(now);
                log("signed the code of conduct");
                toast("Signed");
              }}
            >
              Sign
            </button>
          </>
        )}
      </Panel>
      <Panel title="Refresher training">
        <p>
          {due ? (
            <>
              Refresher {overdue ? "was due" : "due"} <strong>{fmtDate(due.toISOString())}</strong> <Badge tone={overdue ? "danger" : "muted"}>{overdue ? "Overdue" : "Every 6 months"}</Badge>
            </>
          ) : (
            "Sign the code first."
          )}
        </p>
        <p className="small muted">Overdue refreshers pause new brief acceptance until completed.</p>
        <button type="button" className="btn btn-outline" disabled={!signed} onClick={() => (setQuiz(true), setAns([]), setQerr(""))}>
          Take the 3-question refresher
        </button>
      </Panel>
      <Dialog
        open={quiz}
        onClose={() => setQuiz(false)}
        title="Refresher"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setQuiz(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (ans.length < QUIZ.length || QUIZ.some((q, i) => ans[i] === undefined)) return setQerr("Answer every question.");
                const wrong = QUIZ.filter((q, i) => ans[i] !== q.answer).length;
                if (wrong) return setQerr(`${wrong} answer${wrong > 1 ? "s" : ""} not quite right — have another look.`);
                setSigned(new Date().toISOString());
                log("completed code-of-conduct refresher");
                toast("Refresher complete — next one in 6 months");
                setQuiz(false);
              }}
            >
              Submit answers
            </button>
          </>
        }
      >
        {QUIZ.map((q, i) => (
          <fieldset key={q.q} className="plain">
            <legend>{q.q}</legend>
            {q.options.map((o, j) => (
              <label key={o} className="check">
                <input
                  type="radio"
                  name={`q${i}`}
                  checked={ans[i] === j}
                  onChange={() => {
                    const n = [...ans];
                    n[i] = j;
                    setAns(n);
                  }}
                />
                <span>{o}</span>
              </label>
            ))}
          </fieldset>
        ))}
        {qerr && <p className="field-error">{qerr}</p>}
      </Dialog>
    </Grid>
  );
}

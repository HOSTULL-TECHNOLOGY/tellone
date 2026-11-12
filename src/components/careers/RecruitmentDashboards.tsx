"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, BarChart, Grid, Kpis, Meter, Panel } from "@/components/dashboard/kit";
import { useToast } from "@/components/ui/Toast";
import "@/styles/dash-office.css";
import { regions, vision, WAVE } from "@/data/careers";
import { loadWards, readApplications, type Ward } from "@/lib/wards";

/**
 * Careers dashboards (DEMO data). National: recruitment funnel by region, state and source (CAR-12), with fraud
 * flags (CAR-35) and the document's measures of success. State coordinator: ward leader applicants with the
 * selection score breakdown (CAR-32), the decision rule (CAR-33) and "move to another ward" (CAR-25).
 */
const VISITS = 186_400; // sample visits to the careers pages since 9 November
const FUNNEL = [
  { label: "Visited the careers pages", value: VISITS },
  { label: "Registered as members (target 25%)", value: Math.round(VISITS * 0.262) },
  { label: "Completed the application (target 30%)", value: Math.round(VISITS * 0.262 * 0.31) },
  { label: "Endorsed and verified in 3 working days (target 90%)", value: 4_212 },
  { label: "Approved and trained (target 85%)", value: WAVE.filledSample },
  { label: "Recruited 10+ street leaders in 14 days (target 80%)", value: 1_018 },
];
const SOURCES = [
  { label: "Home-page band and side menu", value: 4_310 },
  { label: "WhatsApp status and channel posts", value: 3_580 },
  { label: "Radio jingles: Text WARD to 0904 569 9268", value: 2_240 },
  { label: "Traditional rulers, religious leaders, associations", value: 1_960 },
  { label: "QR codes on posters and fliers", value: 1_470 },
  { label: "Referral links from members", value: 1_230 },
  { label: "Creators and influencers (disclosed)", value: 980 },
  { label: "Opportunity Alerts and the Jobs page", value: 760 },
];
const MEASURES: [string, string, string][] = [
  ["Visitors who register as members", "25%", "26.2%"],
  ["Registered members who complete the application", "30%", "31%"],
  ["Applications endorsed and verified within 3 working days", "90%", "88%"],
  ["Approved applicants who finish training", "85%", "86%"],
  ["New ward leaders who recruit at least 10 street leaders within 14 days", "80%", "32% (first leaders started 16 Nov)"],
  ["Wards with a leader by 30 November 2026", "8,809", "3,154"],
  ["Visitors who find their ward without help", "85%", "87%"],
  ["Median time to find a ward", "Under 30 seconds", "22 seconds"],
  ["Visitors who need WhatsApp or phone help to find their ward", "Under 10%", "7%"],
  ["Applications moved to a different ward by the state team", "Under 5%", "3.1%"],
  ["Ward data corrections after launch", "Under 3% of wards", "0.9%"],
  ["Applicants who follow at least 3 platforms", "60%", "58%"],
  ["Follow proofs verified at first review", "90%", "92%"],
  ["Applications flagged for fake or reused proof", "Under 3%", "1.4%"],
  ["Wards won by an applicant with under 50 Vision Points (monthly fairness review)", "Tracked, above 25%", "34%"],
];

export function NationalRecruitment() {
  const [wards, setWards] = useState<Ward[] | null>(null);
  useEffect(() => {
    loadWards().then((d) => setWards(d.wards));
  }, []);
  const byState = useMemo(() => {
    if (!wards) return [];
    const m = new Map<string, { label: string; value: number; target: number }>();
    for (const w of wards) {
      const r = m.get(w.state) ?? { label: w.stateName, value: 0, target: 0 };
      r.target++;
      if (w.status === 1) r.value++;
      m.set(w.state, r);
    }
    return [...m.values()].sort((a, b) => b.value / b.target - a.value / a.target);
  }, [wards]);
  const open = WAVE.wards - WAVE.filledSample;
  return (
    <>
      <Kpis
        items={[
          { label: "Wards with a leader", value: WAVE.filledSample.toLocaleString("en-NG"), sub: `of ${WAVE.wards.toLocaleString("en-NG")} · sample` },
          { label: "Wards still open", value: open.toLocaleString("en-NG"), sub: "closes 30 Nov or when all are filled", tone: "warn" },
          { label: "Applications in review", value: "1,058", sub: "escalated to National after 48 hours: 37", tone: "warn" },
          { label: "Fraud flags (CAR-35)", value: "61", sub: "reused or edited proof, duplicate handles", tone: "danger" },
        ]}
      />
      <Grid>
        <Panel title="Recruitment funnel (wave 1)">
          <BarChart data={FUNNEL} label="Recruitment funnel" />
        </Panel>
        <Panel title="Applications by source">
          <BarChart data={SOURCES} label="Applications by source" />
        </Panel>
      </Grid>
      <Grid>
        <Panel title="Wards filled by region">
          <ul className="nr-list" role="list" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--s3)" }}>
            {regions.map((r) => (
              <li key={r.region}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--s2)", fontSize: "var(--step--1)", marginBottom: 4 }}>
                  <strong>{r.region}</strong>
                  <span>
                    {r.filled.toLocaleString("en-NG")} of {r.wards.toLocaleString("en-NG")} ({Math.round((r.filled / r.wards) * 100)}%)
                  </span>
                </div>
                <Meter value={r.filled} max={r.wards} label={`${r.region}: ${r.filled.toLocaleString("en-NG")} of ${r.wards.toLocaleString("en-NG")}`} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Wards filled by state">
          {wards ? <BarChart data={byState.slice(0, 37)} label="Wards filled by state" /> : <p className="small muted">Loading the ward list…</p>}
        </Panel>
      </Grid>
      <Panel title="Measures of success">
        <div className="table-wrap">
          <table className="ofc-table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Target</th>
                <th scope="col">Now (sample)</th>
              </tr>
            </thead>
            <tbody>
              {MEASURES.map(([m, t, n]) => (
                <tr key={m}>
                  <td>{m}</td>
                  <td>{t}</td>
                  <td>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

type Applicant = { ref: string; name: string; ward: string; lga: string; at: string; days: number; parts: [number, number, number, number, number]; endorsed: boolean; verified: boolean; status: "Awaiting endorser" | "In review" | "Approved" | "Waiting list" };
const DEMO_APPLICANTS: Applicant[] = [
  { ref: "TBH-WL-00287", name: "Chinedu Okafor", ward: "Unguwan Sarki", lga: "Kaduna North", at: "10 Nov", days: 2, parts: [26, 21, 8, 13, 10], endorsed: false, verified: true, status: "Awaiting endorser" },
  { ref: "TBH-WL-00301", name: "Aisha Lawal", ward: "Unguwan Sarki", lga: "Kaduna North", at: "10 Nov", days: 2, parts: [28, 22, 16, 14, 10], endorsed: true, verified: true, status: "In review" },
  { ref: "TBH-WL-00118", name: "Joseph Danladi", ward: "Kawo", lga: "Kaduna North", at: "9 Nov", days: 3, parts: [24, 20, 12, 12, 10], endorsed: true, verified: true, status: "Approved" },
  { ref: "TBH-WL-00342", name: "Hauwa Musa", ward: "Badarawa", lga: "Kaduna North", at: "11 Nov", days: 1, parts: [27, 23, 18, 15, 10], endorsed: true, verified: true, status: "In review" },
  { ref: "TBH-WL-00355", name: "Samuel Bako", ward: "Badarawa", lga: "Kaduna North", at: "11 Nov", days: 1, parts: [22, 18, 6, 11, 8], endorsed: true, verified: false, status: "In review" },
  { ref: "TBH-WL-00377", name: "Fatima Sani", ward: "Barnawa", lga: "Kaduna South", at: "12 Nov", days: 0, parts: [25, 19, 10, 13, 10], endorsed: false, verified: true, status: "Awaiting endorser" },
];
const PARTS = vision.score.map(([l]) => l.split(" (")[0]);

export function StateApplicants() {
  const toast = useToast();
  const [list, setList] = useState<Applicant[]>(DEMO_APPLICANTS);
  useEffect(() => {
    // Applications made in this browser join the queue
    const mine: Applicant[] = readApplications().map((a) => ({ ref: a.ref, name: "You (this browser)", ward: a.ward.name, lga: a.ward.lga, at: new Date(a.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), days: 0, parts: [22, 18, Math.round(a.vision / 5), 12, 10], endorsed: a.stage > 2, verified: true, status: "Awaiting endorser" }));
    setList((l) => [...mine.filter((m) => !l.some((x) => x.ref === m.ref)), ...l]);
  }, []);
  const total = (a: Applicant) => a.parts.reduce((s, n) => s + n, 0);
  const contested = (a: Applicant) => list.filter((x) => x.ward === a.ward && x.lga === a.lga).length > 1;
  const best = (a: Applicant) => list.filter((x) => x.ward === a.ward && x.lga === a.lga).sort((x, y) => total(y) - total(x))[0]?.ref === a.ref;
  const due = (a: Applicant) => !contested(a) || a.days >= 7;
  const compareNow = (a: Applicant) => {
    setList((l) => l.map((x) => (x.ward === a.ward && x.lga === a.lga ? { ...x, days: 7 } : x)));
    toast(`Scores compared for ${a.ward} ward. The highest score can now be approved; the others are offered the waiting list.`);
  };
  const setStatus = (ref: string, status: Applicant["status"], msg: string) => {
    setList((l) => l.map((x) => (x.ref === ref ? { ...x, status } : x)));
    toast(msg);
  };
  return (
    <>
      <Panel title="Ward leader applicants (ST-5)">
        <p className="small muted">
          Eligibility is pass or fail: 18+, lives in the ward, valid ID, endorser confirmed. Everyone who passes is scored out of 100. A sole applicant is approved once verified and endorsed; with several, scores are compared 7 days after the first application or at the close of wave 1, and ties go to the earliest verified application.
        </p>
        <div className="table-wrap">
          <table className="ofc-table">
            <thead>
              <tr>
                <th scope="col">Applicant</th>
                <th scope="col">Ward</th>
                <th scope="col">Score breakdown</th>
                <th scope="col" className="num">
                  Score
                </th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.ref}>
                  <td>
                    <strong>{a.name}</strong>
                    <br />
                    <span className="small muted">
                      {a.ref} · {a.at}
                    </span>
                  </td>
                  <td>
                    {a.ward}, {a.lga}
                    {contested(a) && (
                      <>
                        <br />
                        <Badge tone={due(a) ? "info" : "warn"}>{best(a) ? "Highest score" : "Competing"} · {due(a) ? "compared" : `compare in ${7 - a.days} days`}</Badge>
                      </>
                    )}
                  </td>
                  <td>
                    <ul role="list" className="small" style={{ listStyle: "none", padding: 0, margin: 0, minWidth: 150 }}>
                      {a.parts.map((n, i) => (
                        <li key={i} title={PARTS[i]}>
                          {["Standing", "Ward know-how", "Vision Points", "Commitment", "Complete"][i]}: {n} / {vision.score[i][1]}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="num">
                    <strong>{total(a)}</strong>
                  </td>
                  <td>
                    <Badge tone={a.status === "Approved" ? "ok" : a.status === "Waiting list" ? "muted" : a.status === "In review" ? "info" : "warn"}>{a.status}</Badge>
                    {!a.verified && (
                      <>
                        <br />
                        <span className="small muted">ID check pending</span>
                      </>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                      {a.status !== "Approved" && a.endorsed && a.verified && due(a) && (!contested(a) || best(a)) && (
                        <button type="button" className="btn btn-sm btn-primary" onClick={() => setStatus(a.ref, "Approved", `${a.name} approved: training link sent by SMS.`)}>
                          Approve
                        </button>
                      )}
                      {contested(a) && !due(a) && best(a) && (
                        <button type="button" className="btn btn-sm btn-outline" onClick={() => compareNow(a)}>
                          Demo: compare now
                        </button>
                      )}
                      {contested(a) && due(a) && !best(a) && a.status !== "Waiting list" && (
                        <button type="button" className="btn btn-sm btn-outline" onClick={() => setStatus(a.ref, "Waiting list", `${a.name} offered a second-leader place in wave 2 and street leader recruitment from 23 November.`)}>
                          Waiting list
                        </button>
                      )}
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => toast(`Application ${a.ref} moved to Kawo ward; SMS sent to the applicant and the endorser.`)}>
                        Move ward
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">Weights are set by the National Coordination team and every change is logged (SH-14). Decisions are due within 3 working days and escalate to National after 48 hours.</p>
      </Panel>
    </>
  );
}

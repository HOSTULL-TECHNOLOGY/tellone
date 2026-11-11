"use client";

import { Download } from "lucide-react";
import { useLiveStats } from "@/lib/useLiveStats";
import { formatNaira } from "@/lib/format";
import { monthlyReports, reportsToCsv, spendCategories } from "@/data/transparency";

/** Live funding counter (demo), refreshed every 60 seconds with the rest of the site. */
export function FundingCounter() {
  const s = useLiveStats();
  return (
    <div className="counter-row" aria-live="polite">
      <div className="counter">
        <span className="small muted">Raised for published projects</span>
        <span className="counter-num">{s ? formatNaira(s.raisedNaira) : "—"}</span>
        <span className="chip chip-demo" style={{ justifySelf: "start" }}>
          Demo data
        </span>
      </div>
      <div className="counter">
        <span className="small muted">Registered members</span>
        <span className="counter-num">{s ? s.members.toLocaleString("en-NG") : "—"}</span>
        <span className="small muted">Updates every 60 seconds</span>
      </div>
    </div>
  );
}

/** Client-side CSV export of the monthly report (SEO-14: tables plus CSV downloads). */
export function DownloadCsvButton() {
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={() => {
        const blob = new Blob([reportsToCsv(monthlyReports)], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tbh-one-monthly-spend-demo.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }}
    >
      <Download size={16} aria-hidden /> Download CSV
    </button>
  );
}

export { spendCategories };

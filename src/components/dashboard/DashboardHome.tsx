"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth";
import { go } from "@/lib/navigate";

/** /dashboard: sends signed-in users to their active role; otherwise offers sign-in. */
export function DashboardHome() {
  const { ready, session, user } = useSession();
  useEffect(() => {
    if (ready && session && user) go(`/dashboard/${session.activeRole}`);
  }, [ready, session, user]);
  if (!ready || session) return <div className="dash-loading" aria-busy="true" />;
  return (
    <main className="dash-gate">
      <div className="dash-gate-card">
        <img src="/brand/tbh-one-logo-180.webp" width={120} height={78} alt="TBH One" />
        <h1>Your TBH One dashboard</h1>
        <p className="muted">Sign in to see your tasks, Impact Points, funded projects and the tools for your role.</p>
        <div className="form-actions">
          <Link href="/login?next=/dashboard" className="btn btn-primary">
            Sign in
          </Link>
          <Link href="/join" className="btn btn-outline">
            Join free
          </Link>
          <Link href="/" className="btn btn-ghost">
            <ArrowLeft size={16} aria-hidden /> Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}

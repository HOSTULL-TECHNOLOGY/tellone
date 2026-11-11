"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Bell, ChevronDown, CircleHelp, LogOut, Menu, ShieldAlert, X } from "lucide-react";
import { roleByKey, roles, type RoleKey } from "@/data/roles";
import { confirmTwoFactor, DEMO_2FA, signOut, switchRole, useSession, type DemoUser } from "@/lib/auth";
import { go } from "@/lib/navigate";
import { dashIcons } from "./icons";
import { DisplayControls } from "@/components/chrome/DisplayPrefs";
import { getDict } from "@/i18n";

const t = getDict("en");

export function RoleIcon({ name, size = 18 }: { name: string; size?: number }) {
  const I = dashIcons[name] ?? dashIcons.Circle;
  return <I size={size} aria-hidden />;
}

const dash = (role: string, section = "overview") => (section === "overview" ? `/dashboard/${role}` : `/dashboard/${role}/${section}`);

/**
 * Authenticated shell. "Back to website" and "Sign out" are separate actions (master prompt §9).
 * Access is checked client-side against the demo session — production must enforce it on the server (SH-4).
 */
export function DashboardShell({ role, section, children }: { role: RoleKey; section: string; children: (user: DemoUser) => ReactNode }) {
  const { ready, session, user } = useSession();
  const [nav, setNav] = useState(false);
  const r = roleByKey(role)!;
  const cur = r.sections.find((s) => s.slug === section) ?? r.sections[0];

  useEffect(() => {
    if (ready && session && user && user.roles.includes(role) && session.activeRole !== role) switchRole(role);
  }, [ready, session, user, role]);
  useEffect(() => setNav(false), [section]);

  if (!ready) return <div className="dash-loading" aria-busy="true" />;

  if (!session || !user) {
    return (
      <Gate title="Sign in to continue" text={`The ${r.label} dashboard is only available to signed-in accounts with that role.`}>
        <Link className="btn btn-primary" href={`/login?next=${encodeURIComponent(dash(role, section))} prefetch={false}`}>
          Sign in
        </Link>
        <Link className="btn btn-ghost" href="/" prefetch={false}>
          <ArrowLeft size={16} aria-hidden /> Back to website
        </Link>
      </Gate>
    );
  }
  if (!user.roles.includes(role)) {
    return (
      <Gate title="You don't have access to this dashboard" text={`Your account doesn't hold the ${r.label} role. Roles are added after vetting.`}>
        <Link className="btn btn-primary" href={dash(user.roles[0])}>
          Go to my dashboard
        </Link>
        <Link className="btn btn-ghost" href="/" prefetch={false}>
          <ArrowLeft size={16} aria-hidden /> Back to website
        </Link>
      </Gate>
    );
  }
  if (r.twoFactor && !session.twoFactorOk) return <TwoFactorGate role={r.label} />;

  return (
    <div className="dash" data-role={role}>
      <aside className={`dash-side${nav ? " is-open" : ""}`} aria-label={`${r.short} navigation`}>
        <div className="dash-side-head">
          <Link href="/" prefetch={false} className="dash-logo" aria-label="TBH One — back to website">
            <img src="/brand/tbh-one-logo-180.webp" width={96} height={62} alt="TBH One" />
          </Link>
          <button type="button" className="icon-btn dash-close" onClick={() => setNav(false)} aria-label="Close menu">
            <X size={20} aria-hidden />
          </button>
        </div>
        <RoleSwitcher user={user} role={role} />
        <nav className="dash-nav">
          <ul role="list">
            {r.sections.map((s) => (
              <li key={s.slug}>
                <Link href={dash(role, s.slug)} aria-current={s.slug === cur.slug ? "page" : undefined}>
                  <RoleIcon name={s.icon} />
                  <span>{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dash-side-foot">
          <Link href="/" prefetch={false} className="dash-back">
            <ArrowLeft size={16} aria-hidden /> Back to website
          </Link>
        </div>
      </aside>
      {nav && <div className="dash-scrim" onClick={() => setNav(false)} aria-hidden />}
      <div className="dash-main">
        <header className="dash-top">
          <button type="button" className="icon-btn dash-menu" onClick={() => setNav(true)} aria-label="Open dashboard menu">
            <Menu size={22} aria-hidden />
          </button>
          <div className="dash-title">
            <p className="dash-role">{r.label}</p>
            <h1>{cur.label}</h1>
          </div>
          <div className="dash-top-actions">
            <Link href="/" prefetch={false} className="btn btn-sm btn-ghost dash-back-top">
              <ArrowLeft size={16} aria-hidden /> <span>Back to website</span>
            </Link>
            <Link href="/report" prefetch={false} className="btn btn-sm btn-outline dash-report" title="Report a concern">
              <ShieldAlert size={16} aria-hidden /> <span>Report a concern</span>
            </Link>
            <Notifications role={role} />
            <Link href="/support" prefetch={false} className="icon-btn" aria-label="Help and support">
              <CircleHelp size={20} aria-hidden />
            </Link>
            <AccountMenu user={user} />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="dash-content">
          <p className="dash-desc">
            {r.description} <span className="muted">Data scope: {r.scope}.</span>
          </p>
          {children(user)}
        </main>
        <footer className="dash-foot small muted">
          <span className="chip chip-demo">Prototype</span> Demo data and simulated actions. Nothing here reaches a real database, payment provider or messaging service.
        </footer>
      </div>
    </div>
  );
}

function Gate({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="dash-gate">
      <div className="dash-gate-card">
        <img src="/brand/tbh-one-logo-180.webp" width={120} height={78} alt="TBH One" />
        <h1>{title}</h1>
        <p className="muted">{text}</p>
        <div className="form-actions">{children}</div>
      </div>
    </main>
  );
}

function TwoFactorGate({ role }: { role: string }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  return (
    <Gate title="Two-factor verification" text={`${role} accounts need a second step (PRD SH-2). Enter the 6-digit code from your authenticator app.`}>
      <form
        className="form-grid"
        style={{ width: "100%" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim() === DEMO_2FA) confirmTwoFactor();
          else setErr("That code is not correct. Check your authenticator app and try again.");
        }}
      >
        <div className="field">
          <label htmlFor="tfa">Authentication code</label>
          <input id="tfa" className="input otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} aria-invalid={!!err} aria-describedby="tfa-hint tfa-err" />
          <p id="tfa-hint" className="field-hint">
            Demo code: <strong>{DEMO_2FA}</strong>
          </p>
          {err && (
            <p id="tfa-err" className="field-error">
              {err}
            </p>
          )}
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Verify
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              signOut();
              go("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </form>
    </Gate>
  );
}

/** SH-3: role switcher for accounts with more than one role. */
function RoleSwitcher({ user, role }: { user: DemoUser; role: RoleKey }) {
  if (user.roles.length < 2) return <p className="dash-single-role">{roleByKey(role)?.short}</p>;
  return (
    <div className="dash-switch">
      <label htmlFor="role-switch" className="small muted">
        Viewing as
      </label>
      <select
        id="role-switch"
        className="input"
        value={role}
        onChange={(e) => {
          switchRole(e.target.value as RoleKey);
          go(dash(e.target.value));
        }}
      >
        {roles
          .filter((x) => user.roles.includes(x.key))
          .map((x) => (
            <option key={x.key} value={x.key}>
              {x.short}
            </option>
          ))}
      </select>
    </div>
  );
}

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return { open, setOpen, ref };
}

const NOTES: Partial<Record<RoleKey, string[]>> = {
  member: ["Your Impact Points for joining were verified (+100).", "A project you funded posted delivery photos."],
  "street-leader": ["New task: flier drop, 300 fliers, due Saturday.", "Payment of ₦1,500 approved."],
  "ward-leader": ["4 task proofs waiting for review.", "An approval is close to the 48-hour escalation limit."],
  "state-coordinator": ["Critical incident in Zaria LGA — 38 min left to respond.", "3 ward leader applications to vet."],
  finance: ["2 payouts approved and waiting for a second person to release.", "A ₦1,250,000 contribution is held for ID checks."],
  safeguarding: ["New critical incident reported (anonymous).", "Weekly safeguarding report due Monday."],
  dpo: ["2 deletion requests due within 7 days."],
  "shop-ops": ["Low stock: caps (XL).", "5 orders past the 48-hour dispatch window."],
};

function Notifications({ role }: { role: RoleKey }) {
  const { open, setOpen, ref } = usePopover();
  const [read, setRead] = useState(false);
  const items = NOTES[role] ?? ["You're all caught up."];
  const unread = read ? 0 : NOTES[role]?.length ?? 0;
  return (
    <div className="dash-pop" ref={ref}>
      <button type="button" className="icon-btn dash-bell" aria-expanded={open} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} onClick={() => setOpen(!open)}>
        <Bell size={20} aria-hidden />
        {unread > 0 && <span className="dash-dot">{unread}</span>}
      </button>
      {open && (
        <div className="dash-pop-panel" role="dialog" aria-label="Notifications">
          <div className="dash-pop-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button type="button" className="linklike small" onClick={() => setRead(true)}>
                Mark all read
              </button>
            )}
          </div>
          <ul role="list">
            {items.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="small muted">In-app, SMS and WhatsApp notifications are opt-in with a daily cap (SH-9).</p>
        </div>
      )}
    </div>
  );
}

function AccountMenu({ user }: { user: DemoUser }) {
  const { open, setOpen, ref } = usePopover();
  return (
    <div className="dash-pop" ref={ref}>
      <button type="button" className="dash-account" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="dash-avatar" aria-hidden>
          {user.firstName[0]}
          {user.lastName[0]}
        </span>
        <span className="dash-account-name">{user.firstName}</span>
        <ChevronDown size={16} aria-hidden />
      </button>
      {open && (
        <div className="dash-pop-panel dash-account-panel" role="dialog" aria-label="Account">
          <p>
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            <br />
            <span className="small muted">
              {user.email} · {user.state}
            </span>
          </p>
          <DisplayControls t={t.prefs} />
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={() => {
              signOut();
              go("/logout");
            }}
          >
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

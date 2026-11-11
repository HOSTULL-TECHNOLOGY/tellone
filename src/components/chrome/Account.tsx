"use client";

import Link from "next/link";
import { LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import { signOut, useSession } from "@/lib/auth";
import { roleByKey } from "@/data/roles";
import { go } from "@/lib/navigate";
import { Popover } from "./Popover";

/**
 * Top-bar account control. Signed out: "Login". Signed in (simulated session in localStorage, shared with the
 * dashboards): the member's first name, with links to their dashboard and Sign out, on every public page.
 */
export function AccountMenu({ loginHref, loginLabel }: { loginHref: string; loginLabel: string }) {
  const { ready, user, session } = useSession();
  if (!ready || !user || !session)
    return (
      <Link className="topbar-btn hide-sm" href={loginHref}>
        <LogIn size={16} aria-hidden />
        <span>{loginLabel}</span>
      </Link>
    );
  const role = roleByKey(session.activeRole);
  return (
    <Popover
      label={`Signed in as ${user.firstName}`}
      align="end"
      button={
        <>
          <span className="acct-avatar" aria-hidden>
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
          <span className="acct-name">{user.firstName}</span>
        </>
      }
    >
      {(close) => (
        <div className="acct-panel">
          <p className="acct-who">
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            <span className="small muted">{role?.label ?? "Member"}</span>
          </p>
          <ul role="list" className="menu-list">
            <li>
              <Link href={`/dashboard/${session.activeRole}`} prefetch={false} onClick={close}>
                <LayoutDashboard size={16} aria-hidden /> My dashboard
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="menu-btn"
                onClick={() => {
                  signOut();
                  close();
                  go("/");
                }}
              >
                <LogOut size={16} aria-hidden /> Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </Popover>
  );
}

/** Mobile menu equivalent: Login, or the dashboard link and Sign out when signed in. */
export function DrawerAccount({ loginHref, loginLabel, onNavigate }: { loginHref: string; loginLabel: string; onNavigate: () => void }) {
  const { ready, user, session } = useSession();
  if (!ready || !user || !session)
    return (
      <li>
        <Link href={loginHref} onClick={onNavigate}>
          <LogIn size={18} aria-hidden /> {loginLabel}
        </Link>
      </li>
    );
  return (
    <>
      <li>
        <Link href={`/dashboard/${session.activeRole}`} prefetch={false} onClick={onNavigate}>
          <UserRound size={18} aria-hidden /> {user.firstName}: my dashboard
        </Link>
      </li>
      <li>
        <button
          type="button"
          className="drawer-linklike"
          onClick={() => {
            signOut();
            onNavigate();
            go("/");
          }}
        >
          <LogOut size={18} aria-hidden /> Sign out
        </button>
      </li>
    </>
  );
}

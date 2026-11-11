"use client";

import { useEffect, useState } from "react";
import type { RoleKey } from "@/data/roles";
import { readPref, writePref } from "./prefs";

/**
 * SIMULATED AUTHENTICATION — prototype only.
 * Production needs: SMS OTP provider (SH-1), server sessions in httpOnly cookies, TOTP 2FA (SH-2),
 * and role grants from the National team's user admin (NC-10). Nothing here is secure.
 */
export type DemoUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string; // demo numbers use the reserved 0800 000 xxxx pattern, never real
  email: string;
  state: string;
  lga: string;
  ward?: string;
  street?: string;
  country?: string;
  roles: RoleKey[];
};

export const DEMO_OTP = "123456";
export const DEMO_PASSWORD = "demo1234";
export const DEMO_2FA = "246810";

export const demoUsers: DemoUser[] = [
  { id: "u-ada", firstName: "Adaeze", lastName: "Okafor", phone: "08000000001", email: "member@demo.tbhone", state: "Lagos", lga: "Surulere", ward: "Ward 4", street: "Adeniran Ogunsanya Street", roles: ["member", "shopper"] },
  { id: "u-musa", firstName: "Musa", lastName: "Garba", phone: "08000000002", email: "street@demo.tbhone", state: "Kano", lga: "Nassarawa", ward: "Gama", street: "Gama Road", roles: ["member", "street-leader", "shopper"] },
  { id: "u-funmi", firstName: "Funmilayo", lastName: "Adeyemi", phone: "08000000003", email: "ward@demo.tbhone", state: "Lagos", lga: "Surulere", ward: "Ward 4", roles: ["member", "ward-leader", "delivery"] },
  { id: "u-ibrahim", firstName: "Ibrahim", lastName: "Sule", phone: "08000000004", email: "state@demo.tbhone", state: "Kaduna", lga: "Kaduna North", roles: ["member", "state-coordinator"] },
  { id: "u-chika", firstName: "Chika", lastName: "Nwosu", phone: "08000000005", email: "diaspora@demo.tbhone", state: "Anambra", lga: "Onitsha North", country: "United Kingdom", roles: ["member", "country-coordinator"] },
  { id: "u-tobi", firstName: "Tobi", lastName: "Bello", phone: "08000000006", email: "creator@demo.tbhone", state: "Oyo", lga: "Ibadan North", roles: ["member", "creator"] },
  { id: "u-ngozi", firstName: "Ngozi", lastName: "Eze", phone: "08000000007", email: "vendor@demo.tbhone", state: "Enugu", lga: "Enugu North", roles: ["vendor"] },
  { id: "u-yusuf", firstName: "Yusuf", lastName: "Abdullahi", phone: "08000000008", email: "aspirant@demo.tbhone", state: "Niger", lga: "Chanchaga", roles: ["aspirant"] },
  { id: "u-grace", firstName: "Grace", lastName: "Etim", phone: "08000000009", email: "national@demo.tbhone", state: "FCT", lga: "Abuja Municipal", roles: ["member", "national"] },
  { id: "u-emeka", firstName: "Emeka", lastName: "Obi", phone: "08000000010", email: "finance@demo.tbhone", state: "FCT", lga: "Abuja Municipal", roles: ["finance"] },
  { id: "u-halima", firstName: "Halima", lastName: "Bako", phone: "08000000011", email: "safeguarding@demo.tbhone", state: "FCT", lga: "Abuja Municipal", roles: ["safeguarding"] },
  { id: "u-kemi", firstName: "Kemi", lastName: "Lawal", phone: "08000000012", email: "dpo@demo.tbhone", state: "Lagos", lga: "Ikeja", roles: ["dpo"] },
  { id: "u-sani", firstName: "Sani", lastName: "Umar", phone: "08000000013", email: "callcentre@demo.tbhone", state: "FCT", lga: "Bwari", roles: ["call-centre"] },
  { id: "u-bisi", firstName: "Bisi", lastName: "Afolabi", phone: "08000000014", email: "shopops@demo.tbhone", state: "Lagos", lga: "Ikeja", roles: ["shop-ops", "shopper"] },
  { id: "u-all", firstName: "Demo", lastName: "Reviewer", phone: "08000000000", email: "reviewer@demo.tbhone", state: "FCT", lga: "Abuja Municipal", ward: "City Centre", street: "Demo Street", country: "United Kingdom", roles: ["member", "street-leader", "ward-leader", "state-coordinator", "country-coordinator", "creator", "vendor", "aspirant", "national", "finance", "safeguarding", "dpo", "call-centre", "shopper", "shop-ops", "delivery"] },
];

export type Session = { userId: string; activeRole: RoleKey; twoFactorOk: boolean; since: string };
const KEY = "tbh-session";
const EVT = "tbh:session";

export function readSession(): Session | null {
  try {
    return JSON.parse(readPref(KEY) ?? "null");
  } catch {
    return null;
  }
}
function writeSession(s: Session | null) {
  writePref(KEY, s ? JSON.stringify(s) : null);
  window.dispatchEvent(new Event(EVT));
}
/** Members who joined through /join in this browser (prototype only). */
const REG_KEY = "tbh-demo-registered";
export function registeredUsers(): DemoUser[] {
  try {
    const v = JSON.parse(readPref(REG_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
/** Prototype registration: stores the new member locally and signs them in as Member. */
export function registerDemoUser(u: Omit<DemoUser, "id" | "roles">): DemoUser {
  const user: DemoUser = { ...u, phone: normalisePhone(u.phone), id: `u-new-${Date.now()}`, roles: ["member", "shopper"] };
  writePref(REG_KEY, JSON.stringify([user, ...registeredUsers().filter((x) => x.phone !== user.phone)]));
  signIn(user);
  return user;
}
const allUsers = () => [...registeredUsers(), ...demoUsers];
const normalisePhone = (v: string) => v.trim().toLowerCase().replace(/[\s-]/g, "").replace(/^\+234/, "0");
export const userById = (id: string) => allUsers().find((u) => u.id === id);
export const findUser = (idOrPhoneOrEmail: string) => {
  const v = normalisePhone(idOrPhoneOrEmail);
  return allUsers().find((u) => u.phone === v || u.email.toLowerCase() === v);
};

export function signIn(user: DemoUser, role?: RoleKey) {
  const activeRole = role && user.roles.includes(role) ? role : user.roles[0];
  writeSession({ userId: user.id, activeRole, twoFactorOk: false, since: new Date().toISOString() });
}
export function confirmTwoFactor() {
  const s = readSession();
  if (s) writeSession({ ...s, twoFactorOk: true });
}
export function switchRole(role: RoleKey) {
  const s = readSession();
  if (s) writeSession({ ...s, activeRole: role });
}
export function signOut() {
  writeSession(null);
}

/** Current session + user. `ready` is false until localStorage has been read (avoids hydration flashes). */
export function useSession() {
  const [state, setState] = useState<{ ready: boolean; session: Session | null; user: DemoUser | null }>({ ready: false, session: null, user: null });
  useEffect(() => {
    const sync = () => {
      const s = readSession();
      setState({ ready: true, session: s, user: s ? userById(s.userId) ?? null : null });
    };
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}

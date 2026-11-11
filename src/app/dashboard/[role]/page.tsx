import { notFound } from "next/navigation";
import { dashboards } from "@/dashboards";
import { roleByKey, roles, type RoleKey } from "@/data/roles";

export const dynamicParams = false;
export function generateStaticParams() {
  return roles.map((r) => ({ role: r.key }));
}
export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  return { title: roleByKey(role)?.label ?? "Dashboard" };
}

export default async function DashboardRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!roleByKey(role)) notFound();
  const C = dashboards[role as RoleKey];
  return <C section="overview" />;
}

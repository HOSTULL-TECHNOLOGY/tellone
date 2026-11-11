import { notFound } from "next/navigation";
import { dashboards } from "@/dashboards";
import { dashboardPaths, roleByKey, type RoleKey } from "@/data/roles";

export const dynamicParams = false;
export function generateStaticParams() {
  return dashboardPaths().filter((p) => p.section !== "overview");
}
export async function generateMetadata({ params }: { params: Promise<{ role: string; section: string }> }) {
  const { role, section } = await params;
  const r = roleByKey(role);
  return { title: `${r?.sections.find((s) => s.slug === section)?.label ?? "Dashboard"} — ${r?.short ?? ""}` };
}

export default async function DashboardSectionPage({ params }: { params: Promise<{ role: string; section: string }> }) {
  const { role, section } = await params;
  const r = roleByKey(role);
  if (!r || !r.sections.some((s) => s.slug === section)) notFound();
  const C = dashboards[role as RoleKey];
  return <C section={section} />;
}

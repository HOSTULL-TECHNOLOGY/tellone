import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CandidateProfile } from "@/components/content/CandidateProfile";
import { candidateBySlug } from "@/data/candidates";

const c = candidateBySlug("rabiu-musa-kwankwaso")!;
export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/candidates/rabiu-musa-kwankwaso", `${c.name}: ${c.role}`, `Who is ${c.name}? A factual profile from public records: career, offices held and the 2027 NDC ticket, with sources.`);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <CandidateProfile locale={lang} c={c} />;
}

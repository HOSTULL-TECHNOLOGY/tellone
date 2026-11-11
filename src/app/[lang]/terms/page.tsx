import { localeParams } from "@/lib/meta";
import { LegalDoc, legalMeta } from "@/components/content/LegalDoc";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return legalMeta(lang, "terms");
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalDoc lang={lang} slug="terms" />;
}

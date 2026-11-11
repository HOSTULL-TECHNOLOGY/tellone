import { notFound } from "next/navigation";
import "@/styles/content.css";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { PageHeader, Section } from "@/components/ui/Page";
import { SiteSearch } from "@/components/content/SiteSearch";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/search", "Search TBH One", "Search TBH One pages, answers, fact checks, news and states.", { noindex: true });
}

export default async function SearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Search" }]}
        title="Search TBH One"
        answer="Search every TBH One page, answer, fact check, news article and state page from one box. Results rank pages whose titles match your words first. Search runs in your browser, so nothing you type is sent anywhere or stored. Searching works in English today; Pidgin, Yorùbá, Hausa and Igbo search follows the translated pages."
      />
      <Section narrow>
        <SiteSearch locale={lang as Locale} />
      </Section>
    </>
  );
}

import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Breadcrumbs, Section } from "@/components/ui/Page";
import { Confirmation } from "@/components/shop/Orders";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/checkout/confirmation", "Order confirmed — TBH One Shop", "Your TBH One Shop order confirmation and receipt.", { noindex: true });
}

export default async function ConfirmationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <div className="container" style={{ paddingTop: "var(--s5)" }}>
        <Breadcrumbs locale={lang} items={[{ label: "Shop", path: "/shop" }, { label: "Order confirmation" }]} />
        <h1 style={{ marginTop: "var(--s4)" }}>Order confirmation</h1>
      </div>
      <Section>
        <Confirmation locale={lang} />
      </Section>
    </>
  );
}

import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { PageHeader, Section } from "@/components/ui/Page";
import { OrderTracker } from "@/components/shop/Orders";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/orders", "Track my order — TBH One Shop", "Track a TBH One Shop order with your order number and phone number, and see your order history.", { noindex: true });
}

export default async function OrdersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Track my order" }]}
        title="Track my order"
        answer="Enter your order number and the phone number you used at checkout to see where your order is: paid, sent to the vendor, packed, dispatched, out for delivery or delivered. You also get an SMS or WhatsApp update at every step. Signed-in members see their full order history below."
      />
      <Section>
        <OrderTracker locale={lang} />
      </Section>
    </>
  );
}

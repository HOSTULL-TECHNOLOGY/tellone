import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { Checkout } from "@/components/shop/Checkout";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/checkout", "Checkout — TBH One Shop", "Enter your details, choose delivery or free pickup and pay by card, bank transfer or USSD.", { noindex: true });
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Cart", path: "/shop/cart" }, { label: "Checkout" }]}
        title="Checkout"
        answer="Four short steps: your details, delivery, payment and review. Every order is recorded against a named buyer with a Nigerian phone number. Choose courier delivery anywhere in Nigeria or free pickup at a ward-leader hub, then pay by card, bank transfer or USSD. You see the full price, delivery fee and refund policy before paying."
      />
      <Section>
        <Checkout locale={lang} />
        <div style={{ marginTop: "var(--s5)" }}>
          <PrototypeNote>Payment runs in simulated test mode. Production uses one licensed Nigerian payment provider (Paystack or Flutterwave) with server-side verification; TBH One never stores card data.</PrototypeNote>
        </div>
      </Section>
    </>
  );
}

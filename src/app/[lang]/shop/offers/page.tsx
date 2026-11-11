import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { OffersClient } from "@/components/shop/MemberPerks";
import { ShopPhaseBanner } from "@/components/shop/ProductBits";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/offers", "Partner vendor offers — discounts for TBH One members", "Discounts for TBH One members at partner businesses across Nigeria, redeemed in store with a personal code or QR that the partner checks in the vendor portal or by USSD.");
}

export default async function OffersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Partner vendor offers" }]}
        title="Partner vendor offers"
        answer="Local businesses that support TBH One offer discounts to members — on food, grooming, printing, electronics and more. Each signed-in member gets a unique code and QR for every offer. Show it at the till; the partner checks it in the TBH One vendor portal or by USSD, and every redemption is counted per offer and per member."
      />
      <Section>
        <ShopPhaseBanner />
        <OffersClient locale={lang} />
        <PrototypeNote>The partners listed are demo examples. Codes are generated in your browser; in production they are issued and validated by the vendor portal (VN-7).</PrototypeNote>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Can I share my code?", a: "No. Each code is unique to you and to one offer, so partners can count redemptions fairly." },
            { q: "My business wants to offer a discount. How?", a: "Register in the Vendors Center or Partners Program. Approved partners manage their offers and see redemption numbers in the vendor portal." },
          ]}
        />
      </Section>
    </>
  );
}

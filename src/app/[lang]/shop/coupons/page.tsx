import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, Notice, PageHeader, Section } from "@/components/ui/Page";
import { CouponsClient } from "@/components/shop/MemberPerks";
import { ShopPhaseBanner } from "@/components/shop/ProductBits";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/coupons", "Member coupons and Impact Points rewards — TBH One Shop", "TBH One members get weekly coupon codes and can turn Impact Points into shop rewards: 500 points for ₦500 off, 1,000 for free delivery, 2,500 for a free T-shirt.");
}

export default async function CouponsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Member coupons" }]}
        title="Member coupons"
        answer="Signed-in TBH One members get coupon codes for the shop and can turn their Impact Points into rewards: 500 points for ₦500 off, 1,000 points for free delivery and 2,500 points for a free TBH One T-shirt. Use one coupon per order, on top of the 10% member price, by typing the code in your cart."
      />
      <Section>
        <ShopPhaseBanner />
        <CouponsClient locale={lang} />
      </Section>
      <Section alt narrow>
        <Notice tone="info" title="Fair rewards">
          No coupon, offer or reward is ever linked to voting, a voter&apos;s card (PVC) or a polling unit, and none is targeted using electoral data. Every coupon created, edited or redeemed is logged.
        </Notice>
        <div style={{ marginTop: "var(--s6)" }}>
          <Faq
            items={[
              { q: "How do I use a coupon?", a: "Copy the code, open your cart and enter it in the coupon box. The discount appears in the order summary before you pay." },
              { q: "Can I combine coupons?", a: "One coupon per order, applied on top of the member price and any bulk discount." },
              { q: "How do I earn Impact Points?", a: "By joining, referring members, attending events, completing projects, distributing merch, creating content and joining volunteer groups. See the Impact Points & Rewards page." },
            ]}
          />
        </div>
      </Section>
    </>
  );
}

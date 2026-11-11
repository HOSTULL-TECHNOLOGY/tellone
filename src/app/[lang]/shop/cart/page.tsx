import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { PageHeader, Section } from "@/components/ui/Page";
import { CartView } from "@/components/shop/CartView";
import { ShopPhaseBanner } from "@/components/shop/ProductBits";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/cart", "Your cart — TBH One Shop", "Review the items in your TBH One Shop cart, apply a coupon and see your delivery estimate.", { noindex: true });
}

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Cart" }]}
        title="Your cart"
        answer="Check your items, sizes and quantities before checkout. Member prices apply automatically when you are signed in, bulk pricing starts at 50 items, and you can add one coupon per order. Delivery is free on orders over ₦20,000 and pickup at a ward-leader hub is always free."
      />
      <Section>
        <ShopPhaseBanner />
        <CartView locale={lang} />
      </Section>
    </>
  );
}

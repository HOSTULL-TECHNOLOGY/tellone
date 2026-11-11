import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { PageHeader, Section } from "@/components/ui/Page";
import { Catalogue } from "@/components/shop/Catalogue";
import { DemoPricesNote, ShopPhaseBanner } from "@/components/shop/ProductBits";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/merch", "TBH One merch — T-shirts, caps, wristbands and more", "Browse official TBH One merch: tagline T-shirts in five Nigerian languages, caps, key holders, wristbands, banners, stickers and ward packs.");
}

export default async function MerchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Merch" }]}
        title="TBH One merch"
        answer="All official TBH One merch in one place: tagline T-shirts in English, Pidgin, Yorùbá, Hausa and Igbo, embroidered caps, key holders, wristbands, street banners, sticker sheets and ready-made ward packs. Search or filter by category, price, size and colour. Signed-in members see the 10% member price automatically."
      />
      <Section>
        <ShopPhaseBanner />
        <DemoPricesNote />
        <div style={{ marginTop: "var(--s5)" }}>
          <Catalogue locale={lang} />
        </div>
      </Section>
    </>
  );
}

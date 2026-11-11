import { notFound } from "next/navigation";
import "@/styles/shop.css";
import { isLocale } from "@/lib/i18n";
import { ShopNav } from "@/components/shop/ProductBits";

/** Shop section: shared sub-navigation above every shop page. */
export default async function ShopLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <ShopNav locale={lang} />
      {children}
    </>
  );
}

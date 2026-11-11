import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { SignedOut } from "@/components/auth/SignedOut";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/logout", "Signed out", "You have signed out of TBH One.", { noindex: true });
}

export default async function LogoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <div className="auth-page pattern">
      <div className="container container-narrow">
        <h1>Signed out</h1>
        <SignedOut />
      </div>
    </div>
  );
}

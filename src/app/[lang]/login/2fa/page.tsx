import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Breadcrumbs } from "@/components/ui/Page";
import { TwoFactorForm } from "@/components/auth/VerifyForms";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/login/2fa", "Two-factor verification", "Second sign-in step for TBH One staff and leader accounts.", { noindex: true });
}

export default async function TwoFactorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <div className="auth-page pattern">
      <div className="container container-narrow">
        <Breadcrumbs locale={lang} items={[{ label: "Sign in", path: "/login" }, { label: "Two-factor verification" }]} />
        <h1>Two-factor verification</h1>
        <p className="muted">Leader and staff accounts need a second step after the phone code or password.</p>
        <TwoFactorForm />
      </div>
    </div>
  );
}

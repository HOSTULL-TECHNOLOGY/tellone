import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Breadcrumbs } from "@/components/ui/Page";
import { CodeVerifyForm } from "@/components/auth/VerifyForms";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/login/verify", "Enter your code", "Enter the code we sent to finish signing in or resetting your TBH One password.", { noindex: true });
}

export default async function VerifyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <div className="auth-page pattern">
      <div className="container container-narrow">
        <Breadcrumbs locale={lang} items={[{ label: "Sign in", path: "/login" }, { label: "Enter your code" }]} />
        <h1>Enter your code</h1>
        <p className="muted">Type the 6-digit code from your text message. If you asked to reset your password, you will set a new one here.</p>
        <CodeVerifyForm />
      </div>
    </div>
  );
}

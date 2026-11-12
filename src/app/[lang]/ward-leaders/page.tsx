import Link from "next/link";
import type { Metadata } from "next";
import { href, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { localeOf } from "@/components/participate/pageKit";
import { Redirect } from "@/components/careers/Redirect";

export const generateStaticParams = localeParams;
/** The ward leader page moved to /careers/ward-leaders (CAR-1). The server redirects; this page covers the offline preview. */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = pageMeta(lang as Locale, "/careers/ward-leaders", "Ward Leaders have moved to Careers", "The ward leader page is now at TBH One Careers.", { noindex: true });
  return m;
}

export default async function WardLeadersMoved({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const to = href(locale, "/careers/ward-leaders");
  return (
    <section className="section">
      <div className="container container-narrow">
        <h1>Ward leaders: now on TBH One Careers</h1>
        <p>
          The ward leader page has moved. <Link href={to}>Go to Become a TBH One Ward Leader</Link>.
        </p>
        <Redirect to="/careers/ward-leaders" />
      </div>
    </section>
  );
}

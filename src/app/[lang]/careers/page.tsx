import "@/styles/participate.css";
import "@/styles/careers.css";
import Link from "next/link";
import { Briefcase, Globe2, MapPin, PenTool } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { WardCounter } from "@/components/careers/Recruitment";
import { hubRoles, WAVE, whyRegister } from "@/data/careers";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/careers",
  "TBH One Careers — ward leaders, street leaders, coordinators and creators",
  "TBH One Careers: 8,809 ward leader places open now, 440,450 street leader places from 23 November 2026, 200+ country coordinators, and briefs for creators, translators and associates. Register free first.",
);

const icons = [MapPin, Briefcase, Globe2, PenTool];

export default async function CareersHub({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Careers" }]}
        title="TBH One Careers"
        kicker="Lead where you live. Get paid for the work you deliver."
        answer={`TBH One is recruiting ward leaders now: one for each of Nigeria’s ${WAVE.wards.toLocaleString("en-NG")} electoral wards in wave 1. Street leader places open on Monday 23 November 2026, and country coordinator, creator, translator and associate roles are open. Every role requires free member registration first: ${whyRegister}`}
      />
      <Section title="Roles">
        <ul className="ch-roles" role="list">
          {hubRoles.map((r, i) => {
            const Icon = icons[i];
            const open = r.status.startsWith("Open");
            return (
              <li key={r.role} className={i === 0 ? "ch-role ch-role-main" : "ch-role"}>
                <Icon size={26} aria-hidden />
                <div>
                  <h3>{r.role}</h3>
                  <p className={`chip ${open ? "chip-ok" : "chip-soon"}`}>{r.status}</p>
                </div>
                <Link href={L(r.path)} className={`btn ${i === 0 ? "btn-primary" : "btn-outline"}`}>
                  {r.button}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="ch-note">
          <strong>Every role requires free member registration first.</strong> <Link href={L("/join")}>Register free</Link>
        </p>
      </Section>
      <Section alt title="Ward leaders: wave 1" intro="One ward leader for each ward. Closes 30 November 2026 or when every ward is filled.">
        <div className="ch-wave">
          <WardCounter variant="band" />
          <div className="form-actions">
            <Link href={L("/careers/ward-leaders#find-your-ward")} className="btn btn-outline">
              Find your ward
            </Link>
            <Link href={L("/careers/ward-leaders/apply")} className="btn btn-primary">
              Register Free and Apply
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

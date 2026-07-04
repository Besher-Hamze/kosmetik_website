import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSettings } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = { title: "Impressum" };

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const { contact } = settings;

  return (
    <>
      <PageHero title="Impressum" />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-primary-100/70 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink-950">
              {locale === "ar" ? "بيانات وفق § 5 TMG" : "Angaben gemäß § 5 TMG"}
            </h2>
            <address className="mt-6 space-y-1 not-italic leading-relaxed text-ink-700">
              <p className="font-semibold">{loc(settings.siteName, locale)}</p>
              <p>{contact.ownerName}</p>
              <p>{contact.address.street}</p>
              <p>
                {contact.address.zip} {contact.address.city}
              </p>
              <p>{loc(contact.address.country, locale)}</p>
            </address>
            <div className="mt-6 space-y-1 text-ink-700">
              <p>
                <span className="font-semibold">
                  {locale === "ar" ? "الهاتف: " : "Telefon: "}
                </span>
                <span dir="ltr">{contact.phone}</span>
              </p>
              <p>
                <span className="font-semibold">E-Mail: </span>
                {contact.email}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

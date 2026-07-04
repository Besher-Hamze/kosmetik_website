import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/api";
import { loc, SITE_URL } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return { title: t("title"), description: t("description") };
}

const DAY_KEYS: Record<string, { de: string; ar: string }> = {
  monday: { de: "Montag", ar: "الاثنين" },
  tuesday: { de: "Dienstag", ar: "الثلاثاء" },
  wednesday: { de: "Mittwoch", ar: "الأربعاء" },
  thursday: { de: "Donnerstag", ar: "الخميس" },
  friday: { de: "Freitag", ar: "الجمعة" },
  saturday: { de: "Samstag", ar: "السبت" },
  sunday: { de: "Sonntag", ar: "الأحد" },
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, t] = await Promise.all([
    getSettings(),
    getTranslations("contact"),
  ]);
  const { contact } = settings;
  const whatsappDigits = contact.whatsapp.replace(/\D/g, "");
  const closedLabel = locale === "ar" ? "مغلق" : "Geschlossen";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "Karmen Kosmetik Akademie",
    url: SITE_URL,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      postalCode: contact.address.zip,
      addressLocality: contact.address.city,
      addressCountry: "DE",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero title={t("title")} subtitle={t("subtitle")} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-5">
            <div className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-primary-100/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-plum-700 text-white">
                <MapPin className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div>
                <h2 className="font-semibold text-ink-950">{t("addressTitle")}</h2>
                <address className="mt-1.5 text-sm not-italic leading-relaxed text-ink-600">
                  {contact.ownerName}
                  <br />
                  {contact.address.street}
                  <br />
                  {contact.address.zip} {contact.address.city},{" "}
                  {loc(contact.address.country, locale)}
                </address>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-primary-100/70 transition hover:shadow-lift"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white">
                <Phone className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div>
                <h2 className="font-semibold text-ink-950">{t("phoneTitle")}</h2>
                <p className="mt-1.5 text-sm text-ink-600" dir="ltr">
                  {contact.phone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-primary-100/70 transition hover:shadow-lift"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-white">
                <Mail className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div>
                <h2 className="font-semibold text-ink-950">{t("emailTitle")}</h2>
                <p className="mt-1.5 text-sm text-ink-600">{contact.email}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-primary-100/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-plum-500 to-plum-700 text-white">
                <Clock className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div className="flex-1">
                <h2 className="font-semibold text-ink-950">{t("hoursTitle")}</h2>
                <dl className="mt-2 space-y-1 text-sm text-ink-600">
                  {settings.openingHours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-6">
                      <dt>{DAY_KEYS[h.day]?.[locale as "de" | "ar"] ?? h.day}</dt>
                      <dd dir="ltr">
                        {h.closed ? closedLabel : `${h.open} – ${h.close}`}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-[2rem] bg-blush p-8 ring-1 ring-primary-100 sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarCheck, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTreatment, getTreatments, mediaUrl } from "@/lib/api";
import type { PageSection, Treatment } from "@/lib/types";
import { loc, SITE_URL } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { TreatmentCard } from "@/components/sections/treatment-card";
import { BeforeAfterGallery } from "@/components/sections/before-after-gallery";
import { TreatmentGallery } from "@/components/sections/treatment-gallery";
import { TreatmentPager } from "@/components/sections/treatment-pager";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

/** Re-fetch treatment pages within 60s so dashboard edits appear quickly. */
export const revalidate = 60;

export async function generateStaticParams() {
  const treatments = await getTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const treatment = await getTreatment(slug);
  if (!treatment) return {};
  return {
    title: loc(treatment.name, locale),
    description: loc(treatment.excerpt, locale),
    openGraph: {
      title: loc(treatment.name, locale),
      description: loc(treatment.excerpt, locale),
      images: treatment.image ? [{ url: mediaUrl(treatment.image) }] : undefined,
    },
  };
}

/** Falls back to description-only when no sections are stored. */
function resolveSections(treatment: Treatment): PageSection[] {
  if (treatment.sections?.length) return treatment.sections;
  return [
    {
      heading: { de: "Über diese Behandlung", ar: "عن هذه المعالجة" },
      body: treatment.description,
    },
  ];
}

function bodyParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function SectionBody({ text }: { text: string }) {
  const lines = bodyParagraphs(text);
  const nodes: ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (!bulletBuffer.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="space-y-2">
        {bulletBuffer.map((b, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-base leading-relaxed text-ink-700"
          >
            <span className="mt-0.5 shrink-0 text-primary-500">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>,
    );
    bulletBuffer = [];
  };

  for (const line of lines) {
    if (line.startsWith("• ") || line.startsWith("- ")) {
      bulletBuffer.push(line.replace(/^[•-]\s*/, ""));
      continue;
    }
    flushBullets();

    const boldMatch = /^\*\*(.+)\*\*$/.exec(line);
    if (boldMatch) {
      nodes.push(
        <h3
          key={nodes.length}
          className="mt-2 font-semibold text-ink-900 first:mt-0"
        >
          {boldMatch[1]}
        </h3>,
      );
      continue;
    }

    if (
      line.length < 60 &&
      line === line.toUpperCase() &&
      /[A-ZÄÖÜ]/.test(line) &&
      !line.includes(".")
    ) {
      nodes.push(
        <h3
          key={nodes.length}
          className="mt-6 font-semibold text-ink-900 first:mt-0"
        >
          {line}
        </h3>,
      );
      continue;
    }

    nodes.push(
      <p key={nodes.length} className="text-base leading-relaxed text-ink-700">
        {line}
      </p>,
    );
  }
  flushBullets();

  return <div className="space-y-4">{nodes}</div>;
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [treatment, allTreatments, t, tNav] = await Promise.all([
    getTreatment(slug),
    getTreatments(),
    getTranslations("treatments"),
    getTranslations("nav"),
  ]);
  if (!treatment) notFound();

  const sections = resolveSections(treatment);
  const hasSectionImages = sections.some((s) => s.images?.length);
  const legacyGallery =
    treatment.gallery?.length
      ? treatment.gallery
      : treatment.image
        ? [{ src: treatment.image, alt: treatment.name }]
        : [];
  const others = allTreatments.filter((x) => x.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: loc(treatment.name, locale),
    description: loc(treatment.description, locale),
    provider: {
      "@type": "BeautySalon",
      name: "Karmen Kosmetik Akademie",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Schillerstraße 16",
        postalCode: "71638",
        addressLocality: "Ludwigsburg",
        addressCountry: "DE",
      },
    },
    url: `${SITE_URL}/${locale}/behandlungen/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[58vh] items-end overflow-hidden">
        <Image
          src={mediaUrl(treatment.image)}
          alt={loc(treatment.name, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/95 via-plum-950/50 to-plum-950/35" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-36 sm:px-6 lg:px-8">
          <Reveal>
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: tNav("home"), href: "/" },
                { label: tNav("treatments"), href: "/behandlungen" },
                { label: loc(treatment.name, locale) },
              ]}
            />
            <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              {loc(treatment.name, locale)}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-100/90">
              {loc(treatment.excerpt, locale)}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.65fr_1fr] lg:gap-16">
          {/* Main content */}
          <div className="min-w-0">
            {sections.map((section, i) => (
              <Reveal key={i} delay={i * 0.05} className={i > 0 ? "mt-14" : ""}>
                <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
                  {loc(section.heading, locale)}
                </h2>
                <div className="mt-5">
                  <SectionBody text={loc(section.body, locale)} />
                </div>
                {section.images && section.images.length > 0 ? (
                  <div className="mt-6">
                    <TreatmentGallery
                      images={section.images}
                      locale={locale}
                      title={loc(treatment.name, locale)}
                      variant="inline"
                    />
                  </div>
                ) : null}
              </Reveal>
            ))}

            {treatment.benefits.length > 0 ? (
              <Reveal className="mt-14">
                <h2 className="font-display text-2xl font-semibold text-ink-950">
                  {t("benefits")}
                </h2>
                <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
                  {treatment.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-primary-100/70"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-200">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-700">
                        {loc(benefit, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {!hasSectionImages && legacyGallery.length > 0 ? (
              <Reveal className="mt-14">
                <h2 className="font-display text-2xl font-semibold text-ink-950">
                  {t("gallery")}
                </h2>
                <p className="mt-2 text-sm text-ink-500">{t("galleryHint")}</p>
                <div className="mt-6">
                  <TreatmentGallery
                    images={legacyGallery}
                    locale={locale}
                    title={loc(treatment.name, locale)}
                  />
                </div>
              </Reveal>
            ) : null}

            {treatment.beforeAfter && treatment.beforeAfter.length > 0 ? (
              <Reveal className="mt-14">
                <h2 className="font-display text-2xl font-semibold text-ink-950">
                  {t("beforeAfter")}
                </h2>
                <div className="mt-6">
                  <BeforeAfterGallery
                    pairs={treatment.beforeAfter}
                    locale={locale}
                    beforeLabel={t("before")}
                    afterLabel={t("after")}
                  />
                </div>
              </Reveal>
            ) : null}

            <TreatmentPager
              treatments={allTreatments}
              currentSlug={slug}
              locale={locale}
              prevLabel={t("previous")}
              nextLabel={t("next")}
            />
          </div>

          {/* Sticky booking card */}
          <Reveal delay={0.15}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-plum-800 p-8 text-white shadow-lift">
                <h3 className="font-display text-2xl font-semibold">
                  {loc(treatment.name, locale)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-100/90">
                  {loc(treatment.excerpt, locale)}
                </p>
                <Link
                  href={`/termin?type=treatment&service=${treatment.slug}`}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-semibold text-primary-700 shadow-soft transition hover:shadow-glow active:scale-[0.98]"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden />
                  {t("bookThis")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {others.length > 0 ? (
          <div className="mt-24 border-t border-primary-100 pt-16">
            <h2 className="font-display text-3xl font-semibold text-ink-950">
              {t("otherTreatments")}
            </h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other, i) => (
                <TreatmentCard
                  key={other.slug}
                  treatment={other}
                  imageUrl={mediaUrl(other.image)}
                  index={i}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

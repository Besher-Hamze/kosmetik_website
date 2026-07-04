import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Award,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCourse, getCourses } from "@/lib/api";
import { loc, SITE_URL } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { CourseCard } from "@/components/sections/course-card";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return {
    title: loc(course.name, locale),
    description: loc(course.excerpt, locale),
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [course, allCourses, t] = await Promise.all([
    getCourse(slug),
    getCourses(),
    getTranslations("courses"),
  ]);
  if (!course) notFound();

  const others = allCourses.filter((x) => x.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: loc(course.name, locale),
    description: loc(course.description, locale),
    provider: {
      "@type": "Organization",
      name: "Karmen Kosmetik Akademie",
      sameAs: SITE_URL,
    },
    ...(course.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            price: course.priceFrom,
            priceCurrency: "EUR",
          },
        }
      : {}),
  };

  const facts = [
    { icon: Clock, label: t("duration"), value: loc(course.duration, locale) },
    {
      icon: CalendarDays,
      label: t("schedule"),
      value: loc(course.schedule, locale),
    },
    {
      icon: Award,
      label: t("price"),
      value: course.priceFrom
        ? t("priceFrom", { price: course.priceFrom })
        : t("priceOnRequest"),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title={loc(course.name, locale)}
        subtitle={
          course.subtitle ? loc(course.subtitle, locale) : loc(course.excerpt, locale)
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Fact chips */}
        <Reveal className="grid gap-5 sm:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-primary-100/70"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-plum-700 text-white">
                <fact.icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  {fact.label}
                </p>
                <p className="mt-0.5 font-semibold text-ink-950">{fact.value}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-ink-700">
                {loc(course.description, locale)}
              </p>
            </Reveal>

            {course.curriculum.length > 0 ? (
              <Reveal className="mt-12">
                <h2 className="font-display text-2xl font-semibold text-ink-950">
                  {t("curriculum")}
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.curriculum.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-primary-100/70"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-200">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-700">
                        {loc(item, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-gold-50 p-7 ring-1 ring-gold-200">
                <Award className="h-8 w-8 text-gold-600" aria-hidden />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink-950">
                  {t("certificate")}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {loc(course.certificate, locale)}
                </p>
              </div>
              <div className="rounded-3xl bg-blush p-7 ring-1 ring-primary-100">
                <Users className="h-8 w-8 text-primary-600" aria-hidden />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink-950">
                  {t("audience")}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {loc(course.audience, locale)}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="sticky top-28 rounded-3xl bg-gradient-to-br from-primary-600 to-plum-800 p-8 text-white shadow-lift">
              <h3 className="font-display text-2xl font-semibold">
                {loc(course.name, locale)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-100/90">
                {loc(course.excerpt, locale)}
              </p>
              <p className="mt-5 font-display text-3xl font-bold text-gold-300">
                {course.priceFrom
                  ? t("priceFrom", { price: course.priceFrom })
                  : t("priceOnRequest")}
              </p>
              <Link
                href={`/termin?type=course&service=${course.slug}`}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-semibold text-primary-700 shadow-soft transition hover:shadow-glow active:scale-[0.98]"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden />
                {t("bookThis")}
              </Link>
            </div>
          </Reveal>
        </div>

        {others.length > 0 ? (
          <div className="mt-24">
            <h2 className="font-display text-3xl font-semibold text-ink-950">
              {t("otherCourses")}
            </h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other, i) => (
                <CourseCard key={other.slug} course={other} index={i} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

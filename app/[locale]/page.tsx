import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  CalendarCheck,
  Check,
  GraduationCap,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getCoursesIntro,
  getCourses,
  getFaqs,
  getGallery,
  getHomepage,
  getSettings,
  getTestimonials,
  getTreatments,
  mediaUrl,
} from "@/lib/api";
import { loc } from "@/lib/utils";
import { Hero } from "@/components/sections/hero";
import { TreatmentCard } from "@/components/sections/treatment-card";
import { CourseCard } from "@/components/sections/course-card";
import { TestimonialsMarquee } from "@/components/sections/testimonials";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { Stats } from "@/components/sections/stats";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    homepage,
    treatments,
    courses,
    coursesIntro,
    faqs,
    testimonials,
    gallery,
    settings,
    t,
    tNav,
  ] = await Promise.all([
    getHomepage(),
    getTreatments(),
    getCourses(),
    getCoursesIntro(),
    getFaqs(),
    getTestimonials(),
    getGallery(),
    getSettings(),
    getTranslations("home"),
    getTranslations("nav"),
  ]);
  const activeLocale = await getLocale();

  const heroSlides = treatments.slice(0, 6);
  const heroImages = heroSlides.map((s) => mediaUrl(s.image));
  const featuredTreatments = treatments.slice(0, 6);
  const featuredCourses = courses.slice(0, 6);
  const academyAlbum = gallery[0];
  const whatsappDigits = settings.contact.whatsapp.replace(/\D/g, "");

  return (
    <>
      <Hero homepage={homepage} slides={heroSlides} imageUrls={heroImages} />

      {/* Intro points */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Karmen Kosmetik Akademie"
          title={t("whyTitle")}
          subtitle={t("whySubtitle")}
        />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {homepage.heroPoints.map((point, i) => (
            <StaggerItem key={i}>
              <div className="h-full rounded-3xl bg-white p-8 shadow-soft ring-1 ring-primary-100/70 transition hover:shadow-lift">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-plum-700 text-white shadow-soft">
                  <Sparkles className="h-6 w-6" aria-hidden />
                </span>
                <p className="leading-relaxed text-ink-700">
                  {loc(point, activeLocale)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Treatments */}
      <section className="bg-blush py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={tNav("treatments")}
            title={t("treatmentsTitle")}
            subtitle={t("treatmentsSubtitle")}
          />
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTreatments.map((treatment, i) => (
              <TreatmentCard
                key={treatment.slug}
                treatment={treatment}
                imageUrl={mediaUrl(treatment.image)}
                index={i}
              />
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link
              href="/behandlungen"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-primary-300 px-8 font-semibold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50"
            >
              {t("allTreatments")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={tNav("courses")}
            title={t("coursesTitle")}
            subtitle={t("coursesSubtitle")}
          />
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course, i) => (
              <CourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link
              href="/kurse"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-primary-300 px-8 font-semibold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50"
            >
              <GraduationCap className="h-5 w-5" aria-hidden />
              {t("allCourses")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why us checklist + stats */}
      <section className="relative overflow-hidden bg-gradient-to-br from-plum-950 via-primary-950 to-plum-900 py-24">
        <div
          className="pointer-events-none absolute -top-32 end-0 h-96 w-96 rounded-full bg-primary-500/20 blur-[120px]"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {t("whyTitle")}
              </h2>
              <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
                {coursesIntro.whyUs.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300 ring-1 ring-gold-400/40">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-primary-100/90">
                      {loc(item, activeLocale)}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Stats
              items={[
                {
                  value: settings.foundedYear,
                  label: t("statsYears"),
                  asIs: true,
                },
                {
                  value: treatments.length,
                  suffix: "+",
                  label: t("statsTreatments"),
                },
                {
                  value: coursesIntro.courseList.length,
                  suffix: "+",
                  label: t("statsCourses"),
                },
                { value: 2, label: t("statsLanguages") },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      {academyAlbum && academyAlbum.images.length > 0 ? (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={tNav("gallery")}
              title={t("galleryTitle")}
              subtitle={t("gallerySubtitle")}
            />
            <Stagger className="mt-14 grid gap-6 sm:grid-cols-3">
              {academyAlbum.images.slice(0, 3).map((img, i) => (
                <StaggerItem
                  key={i}
                  className={i === 0 ? "sm:row-span-1" : undefined}
                >
                  <Link
                    href="/galerie"
                    className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft"
                  >
                    <Image
                      src={mediaUrl(img.src)}
                      alt={loc(img.alt, activeLocale)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      <section className="bg-blush py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("testimonialsTitle")}
            subtitle={t("testimonialsSubtitle")}
          />
        </div>
        <div className="mt-14">
          <TestimonialsMarquee items={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("faqTitle")} subtitle={t("faqSubtitle")} />
          <Reveal className="mt-12">
            <FaqAccordion faqs={faqs.slice(0, 5)} />
          </Reveal>
          <Reveal className="mt-8 text-center">
            <Link
              href="/faq"
              className="font-semibold text-primary-600 underline-offset-4 hover:underline"
            >
              {t("allFaq")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 via-plum-700 to-plum-900 px-8 py-16 text-center shadow-lift sm:px-16">
            <div
              className="pointer-events-none absolute -top-24 start-1/4 h-64 w-64 rounded-full bg-white/10 blur-[80px]"
              aria-hidden
            />
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100/90">
              {t("ctaText")}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/termin"
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-white px-8 text-base font-semibold text-primary-700 shadow-lift transition hover:shadow-glow active:scale-[0.98]"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden />
                {t("ctaButton")}
              </Link>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-[#25D366] px-8 text-base font-semibold text-white shadow-lift transition hover:brightness-105 active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                {t("ctaWhatsapp")}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

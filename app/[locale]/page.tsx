import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  CalendarCheck,
  Check,
  Gem,
  GraduationCap,
  Heart,
  MessageCircle,
  ShieldCheck,
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

const POINT_ICONS = [Sparkles, Heart, ShieldCheck, Gem] as const;

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
      <section className="section-mesh relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Karmen Kosmetik Akademie"
          title={t("whyTitle")}
          subtitle={t("whySubtitle")}
        />
        <Stagger className="mt-16 grid gap-6 md:grid-cols-3">
          {homepage.heroPoints.map((point, i) => {
            const Icon = POINT_ICONS[i % POINT_ICONS.length];
            return (
              <StaggerItem key={i}>
                <div className="luxury-card h-full p-8 sm:p-9">
                  <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-plum-800 text-white shadow-soft">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="text-base leading-relaxed text-ink-700">
                    {loc(point, activeLocale)}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Treatments */}
      <section className="section-mesh-blush py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={tNav("treatments")}
            title={t("treatmentsTitle")}
            subtitle={t("treatmentsSubtitle")}
          />
          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTreatments.map((treatment, i) => (
              <TreatmentCard
                key={treatment.slug}
                treatment={treatment}
                imageUrl={mediaUrl(treatment.image)}
                index={i}
              />
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <Link
              href="/behandlungen"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-9 font-semibold text-primary-700 shadow-soft ring-1 ring-primary-200 transition hover:shadow-lift hover:ring-primary-300"
            >
              {t("allTreatments")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Courses */}
      <section className="section-mesh py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={tNav("courses")}
            title={t("coursesTitle")}
            subtitle={t("coursesSubtitle")}
          />
          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course, i) => (
              <CourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <Link
              href="/kurse"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-9 font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              <GraduationCap className="h-5 w-5" aria-hidden />
              {t("allCourses")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why us + stats */}
      <section className="relative overflow-hidden bg-gradient-to-br from-plum-950 via-primary-950 to-plum-900 py-28 noise-overlay">
        <div
          className="pointer-events-none absolute -top-32 end-0 h-[28rem] w-[28rem] rounded-full bg-primary-500/20 blur-[130px] motion-safe:animate-glow-pulse"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 start-0 h-80 w-80 rounded-full bg-gold-400/10 blur-[100px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <SectionHeading
                title={t("whyTitle")}
                align="start"
                light
                className="max-w-none"
              />
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {coursesIntro.whyUs.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300 ring-1 ring-gold-400/30">
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

      {/* Gallery bento */}
      {academyAlbum && academyAlbum.images.length > 0 ? (
        <section className="py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={tNav("gallery")}
              title={t("galleryTitle")}
              subtitle={t("gallerySubtitle")}
            />
            <Stagger className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4 lg:gap-5">
              {academyAlbum.images.slice(0, 4).map((img, i) => (
                <StaggerItem
                  key={i}
                  className={
                    i === 0
                      ? "col-span-2 row-span-2"
                      : i === 3
                        ? "col-span-2 lg:col-span-1"
                        : ""
                  }
                >
                  <Link
                    href="/galerie"
                    className="editorial-frame group relative block h-full min-h-[200px] overflow-hidden"
                  >
                    <Image
                      src={mediaUrl(img.src)}
                      alt={loc(img.alt, activeLocale)}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-plum-950/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-10 text-center">
              <Link
                href="/galerie"
                className="text-sm font-semibold text-primary-600 underline-offset-4 hover:underline"
              >
                {tNav("gallery")} →
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      <section className="section-mesh-blush py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("testimonialsTitle")}
            subtitle={t("testimonialsSubtitle")}
          />
        </div>
        <div className="mt-16">
          <TestimonialsMarquee items={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-mesh py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("faqTitle")} subtitle={t("faqSubtitle")} />
          <Reveal className="mt-14">
            <FaqAccordion faqs={faqs.slice(0, 5)} />
          </Reveal>
          <Reveal className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 font-semibold text-primary-600 underline-offset-4 hover:underline"
            >
              {t("allFaq")} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 via-plum-700 to-plum-950 px-8 py-20 text-center shadow-lift noise-overlay sm:px-16">
            <div
              className="pointer-events-none absolute -top-32 start-1/4 h-72 w-72 rounded-full bg-white/10 blur-[90px] motion-safe:animate-glow-pulse"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 end-1/4 h-64 w-64 rounded-full bg-gold-400/15 blur-[80px]"
              aria-hidden
            />
            <p className="relative text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300">
              Karmen Kosmetik Akademie
            </p>
            <h2 className="relative mt-4 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-primary-100/90">
              {t("ctaText")}
            </p>
            <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/termin"
                className="btn-shimmer inline-flex h-14 items-center gap-2.5 rounded-full bg-white px-9 text-base font-semibold text-primary-700 shadow-lift transition hover:shadow-glow active:scale-[0.98]"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden />
                {t("ctaButton")}
              </Link>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-[#25D366] px-9 text-base font-semibold text-white shadow-lift transition hover:brightness-105 active:scale-[0.98]"
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

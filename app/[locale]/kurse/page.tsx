import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, GraduationCap, Sparkles } from "lucide-react";
import { getCourses, getCoursesIntro } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { CourseCard } from "@/components/sections/course-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.courses" });
  return { title: t("title"), description: t("description") };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [courses, intro, t] = await Promise.all([
    getCourses(),
    getCoursesIntro(),
    getTranslations("courses"),
  ]);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-ink-700">
            {loc(intro.description, locale)}
          </p>
        </Reveal>

        {/* Complete course vs single courses */}
        <div className="mt-16 grid gap-7 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl bg-gradient-to-br from-primary-600 to-plum-800 p-9 text-white shadow-lift">
              <GraduationCap className="h-10 w-10 text-gold-300" aria-hidden />
              <h2 className="mt-5 font-display text-2xl font-semibold">
                {t("completeCourseTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-primary-100/90">
                {loc(intro.completeCourse, locale)}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="h-full rounded-3xl bg-white p-9 shadow-soft ring-1 ring-primary-100/70">
              <Sparkles className="h-10 w-10 text-primary-500" aria-hidden />
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink-950">
                {t("singleCoursesTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-600">
                {loc(intro.singleCourses, locale)}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Course list badges */}
        <Reveal className="mt-16">
          <h2 className="text-center font-display text-2xl font-semibold text-ink-950">
            {t("availableCourses")}
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {intro.courseList.map((item, i) => (
              <span
                key={i}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink-700 shadow-soft ring-1 ring-primary-100"
              >
                {loc(item, locale)}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Course cards */}
        <div className="mt-20 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <CourseCard key={course.slug} course={course} index={i} />
          ))}
        </div>

        {/* Why us */}
        <Stagger className="mt-20 grid gap-4 sm:grid-cols-2">
          {intro.whyUs.map((item, i) => (
            <StaggerItem key={i}>
              <div className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-primary-100/70">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-200">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-sm leading-relaxed text-ink-700">
                  {loc(item, locale)}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}

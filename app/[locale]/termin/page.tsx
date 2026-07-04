import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCourses, getTreatments } from "@/lib/api";
import { PageHero } from "@/components/ui/page-hero";
import { BookingForm } from "@/components/sections/booking-form";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.booking" });
  return { title: t("title"), description: t("description") };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [treatments, courses, t] = await Promise.all([
    getTreatments(),
    getCourses(),
    getTranslations("booking"),
  ]);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-[2rem] bg-blush p-8 ring-1 ring-primary-100 sm:p-10">
            <Suspense>
              <BookingForm treatments={treatments} courses={courses} />
            </Suspense>
          </div>
        </Reveal>
      </section>
    </>
  );
}

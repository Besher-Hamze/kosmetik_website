import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTreatments, mediaUrl } from "@/lib/api";
import { PageHero } from "@/components/ui/page-hero";
import { TreatmentCard } from "@/components/sections/treatment-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.treatments" });
  return { title: t("title"), description: t("description") };
}

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [treatments, t] = await Promise.all([
    getTreatments(),
    getTranslations("treatments"),
  ]);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment, i) => (
            <TreatmentCard
              key={treatment.slug}
              treatment={treatment}
              imageUrl={mediaUrl(treatment.image)}
              index={i}
            />
          ))}
        </div>
      </section>
    </>
  );
}

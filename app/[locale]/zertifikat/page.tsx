import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/page-hero";
import { CertificateChecker } from "@/components/sections/certificate-checker";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.certificate" });
  return { title: t("title"), description: t("description") };
}

export default async function CertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale } = await params;
  const { code } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("certificate");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <CertificateChecker initialCode={code} />
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAbout, mediaUrl } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [about, t] = await Promise.all([getAbout(), getTranslations("about")]);
  const paragraphs = loc(about.body, locale)
    .split("\n\n")
    .filter(Boolean);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-display text-2xl font-medium leading-relaxed text-ink-950"
                      : "leading-relaxed text-ink-600"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          {about.image ? (
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
                <Image
                  src={mediaUrl(about.image)}
                  alt={loc(about.title, locale)}
                  width={900}
                  height={800}
                  className="h-auto w-full object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-plum-950/10" />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}

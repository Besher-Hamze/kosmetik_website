import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGallery, mediaUrl } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.gallery" });
  return { title: t("title"), description: t("description") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [albums, t] = await Promise.all([
    getGallery(),
    getTranslations("gallery"),
  ]);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {albums.map((album) => (
          <div key={album.slug} className="mb-16">
            <h2 className="mb-8 font-display text-3xl font-semibold text-ink-950">
              {loc(album.title, locale)}
            </h2>
            <Stagger className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
              {album.images.map((img, i) => (
                <StaggerItem key={i} className="break-inside-avoid">
                  <figure className="group relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-primary-100/70">
                    <Image
                      src={mediaUrl(img.src)}
                      alt={loc(img.alt, locale)}
                      width={800}
                      height={900}
                      className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-plum-950/85 to-transparent p-5 pt-10 text-sm font-medium text-white transition-transform duration-500 group-hover:translate-y-0">
                      {loc(img.alt, locale)}
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}
      </section>
    </>
  );
}

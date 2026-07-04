import type { MetadataRoute } from "next";
import { getCourses, getTreatments } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treatments, courses] = await Promise.all([
    getTreatments(),
    getCourses(),
  ]);

  const staticPaths = [
    "",
    "/behandlungen",
    "/kurse",
    "/ueber-uns",
    "/galerie",
    "/faq",
    "/kontakt",
    "/termin",
    "/zertifikat",
    "/datenschutz",
    "/agb",
    "/impressum",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
    for (const treatment of treatments) {
      entries.push({
        url: `${SITE_URL}/${locale}/behandlungen/${treatment.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    for (const course of courses) {
      entries.push({
        url: `${SITE_URL}/${locale}/kurse/${course.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

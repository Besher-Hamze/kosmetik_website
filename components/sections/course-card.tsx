"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Award, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/utils";
import type { Course } from "@/lib/types";

export function CourseCard({
  course,
  index = 0,
}: {
  course: Course;
  index?: number;
}) {
  const locale = useLocale();
  const t = useTranslations("courses");

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.12,
        ease: [0.21, 0.65, 0.32, 0.99],
      }}
    >
      <Link
        href={`/kurse/${course.slug}`}
        className="luxury-card group flex h-full flex-col overflow-hidden p-7 sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-plum-800 text-white shadow-soft ring-1 ring-primary-200/50">
            <Award className="h-7 w-7" aria-hidden />
          </span>
          <span className="rounded-full bg-gradient-to-r from-gold-50 to-gold-100/80 px-4 py-2 text-xs font-bold text-gold-800 ring-1 ring-gold-200/80">
            {course.priceFrom
              ? t("priceFrom", { price: course.priceFrom })
              : t("priceOnRequest")}
          </span>
        </div>

        <h3 className="font-display text-2xl font-semibold leading-snug text-ink-950">
          {loc(course.name, locale)}
        </h3>
        {course.subtitle ? (
          <p className="mt-1.5 text-sm font-semibold text-primary-600">
            {loc(course.subtitle, locale)}
          </p>
        ) : null}

        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
          {loc(course.excerpt, locale)}
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-primary-50/80 px-4 py-2.5 text-xs font-semibold text-primary-800">
          <Clock className="h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden />
          {loc(course.duration, locale)}
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 border-t border-primary-100 pt-5 text-sm font-semibold text-primary-600 transition group-hover:text-primary-700">
          {t("more")}
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-y-0.5" aria-hidden />
        </span>
      </Link>
    </motion.article>
  );
}

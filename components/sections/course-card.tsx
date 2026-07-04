"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Clock, BadgeEuro, Award } from "lucide-react";
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
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.21, 0.65, 0.32, 0.99],
      }}
    >
      <Link
        href={`/kurse/${course.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-soft ring-1 ring-primary-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-plum-700 text-white shadow-soft">
            <Award className="h-6 w-6" aria-hidden />
          </span>
          <span className="rounded-full bg-gold-50 px-3.5 py-1.5 text-xs font-bold text-gold-700 ring-1 ring-gold-200">
            {course.priceFrom
              ? t("priceFrom", { price: course.priceFrom })
              : t("priceOnRequest")}
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug text-ink-950">
          {loc(course.name, locale)}
        </h3>
        {course.subtitle ? (
          <p className="mt-1 text-sm font-medium text-primary-600">
            {loc(course.subtitle, locale)}
          </p>
        ) : null}

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
          {loc(course.excerpt, locale)}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-ink-500">
          <Clock className="h-3.5 w-3.5 text-primary-500" aria-hidden />
          {loc(course.duration, locale)}
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 border-t border-primary-50 pt-5 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
          {t("more")}
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
        </span>
      </Link>
    </motion.article>
  );
}

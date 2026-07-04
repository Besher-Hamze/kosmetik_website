"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/utils";
import type { Treatment } from "@/lib/types";

export function TreatmentCard({
  treatment,
  imageUrl,
  index = 0,
}: {
  treatment: Treatment;
  imageUrl: string;
  index?: number;
}) {
  const locale = useLocale();
  const t = useTranslations("treatments");
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
      className="group relative"
    >
      <Link
        href={`/behandlungen/${treatment.slug}`}
        className="block overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-primary-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={loc(treatment.name, locale)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-950/60 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
          <h3 className="absolute bottom-4 start-5 end-5 font-display text-2xl font-semibold text-white drop-shadow-sm">
            {loc(treatment.name, locale)}
          </h3>
        </div>
        <div className="p-6">
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
            {loc(treatment.excerpt, locale)}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
            {t("more")}
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

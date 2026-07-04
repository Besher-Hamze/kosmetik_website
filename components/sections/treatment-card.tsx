"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
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
      className="group relative"
    >
      <Link
        href={`/behandlungen/${treatment.slug}`}
        className="luxury-card block overflow-hidden"
      >
        <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
          <Image
            src={imageUrl}
            alt={loc(treatment.name, locale)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-[900ms] ease-out group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-950/95 via-plum-950/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-600/20 opacity-0 transition duration-500 group-hover:opacity-100" />

          {/* Index badge */}
          <span className="absolute start-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
            <h3 className="font-display text-2xl font-semibold leading-tight text-white sm:text-[1.65rem]">
              {loc(treatment.name, locale)}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-primary-100/85">
              {loc(treatment.excerpt, locale)}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 opacity-0 transition duration-300 group-hover:opacity-100">
              {t("more")}
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpRight,
  CalendarCheck,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/utils";
import type { HomepageContent, Treatment } from "@/lib/types";

const ROTATE_MS = 6000;

export function Hero({
  homepage,
  slides,
  imageUrls,
}: {
  homepage: HomepageContent;
  slides: Treatment[];
  imageUrls: string[];
}) {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [reduce, slides.length]);

  const current = slides[index];

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      {/* Background imagery with Ken Burns */}
      <div className="absolute inset-0 noise-overlay" aria-hidden>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="absolute inset-0 motion-safe:animate-ken-burns">
              <Image
                src={imageUrls[index] ?? imageUrls[0]}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-plum-950/85 via-plum-950/60 to-primary-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgb(221_58_136/0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgb(196_162_102/0.12),transparent)]" />
      </div>

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute -end-32 top-20 h-[28rem] w-[28rem] rounded-full bg-primary-500/20 blur-[120px] motion-safe:animate-glow-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-32 bottom-0 h-96 w-96 rounded-full bg-gold-400/10 blur-[100px] motion-safe:animate-float-slow"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-36">
        {/* Copy */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.65, 0.32, 0.99] }}
        >
          <span className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-primary-100 ring-1 ring-white/20 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-gold-300" aria-hidden />
            {t("badge")}
          </span>

          <h1 className="font-display text-[2.75rem] font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl xl:text-[4.5rem]">
            {t("titleLine1")}
            <span className="mt-1 block bg-gradient-to-r from-primary-300 via-plum-200 to-gold-300 bg-clip-text text-transparent">
              {t("titleLine2")}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-primary-100/90 sm:text-lg">
            {loc(homepage.heroIntro, locale)}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/termin"
              className="btn-shimmer inline-flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-plum-700 px-9 text-base font-semibold text-white shadow-glow ring-1 ring-white/20 transition hover:brightness-110 active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              {t("cta")}
            </Link>
            <Link
              href="/kurse"
              className="inline-flex h-14 items-center gap-2.5 rounded-full bg-white/10 px-9 text-base font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/18 active:scale-[0.98]"
            >
              <GraduationCap className="h-5 w-5" aria-hidden />
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* Slide indicators */}
          {slides.length > 1 ? (
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={loc(s.name, locale)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === index
                        ? "w-10 bg-gradient-to-r from-gold-300 to-gold-500"
                        : "w-3 bg-white/25 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={current?.slug}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="text-sm font-medium tracking-wide text-primary-100/80"
                >
                  {current ? loc(current.name, locale) : null}
                </motion.span>
              </AnimatePresence>
            </div>
          ) : null}
        </motion.div>

        {/* Featured treatment card — desktop */}
        {current ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.65, 0.32, 0.99] }}
            className="hidden lg:block"
          >
            <Link
              href={`/behandlungen/${current.slug}`}
              className="editorial-frame group block aspect-[4/5] max-h-[32rem]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={imageUrls[index] ?? imageUrls[0]}
                    alt={loc(current.name, locale)}
                    fill
                    sizes="(max-width: 1280px) 40vw, 480px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-plum-950/90 via-plum-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-[3] p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">
                  {tNav("treatments")}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">
                  {loc(current.name, locale)}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-primary-100/85">
                  {loc(current.excerpt, locale)}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 transition group-hover:gap-2.5">
                  {t("cta")}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          </motion.div>
        ) : null}
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 start-1/2 z-10 -translate-x-1/2 rtl:translate-x-1/2"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-primary-100/60">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
            {t("scroll")}
          </span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1.5">
            <motion.span
              className="h-1.5 w-1 rounded-full bg-gold-300"
              animate={reduce ? {} : { y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}

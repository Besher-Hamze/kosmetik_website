"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CalendarCheck, ChevronDown, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/utils";
import type { HomepageContent, Treatment } from "@/lib/types";

const ROTATE_MS = 5000;

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
      {/* Rotating treatment imagery */}
      <div className="absolute inset-0" aria-hidden>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <Image
              src={imageUrls[index] ?? imageUrls[0]}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Luxury overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-plum-950/70 via-plum-950/55 to-primary-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(51_19_53/0.5)_100%)]" />
      </div>

      {/* Floating petals decoration */}
      <div
        className="pointer-events-none absolute -end-24 top-24 h-80 w-80 rounded-full bg-primary-400/25 blur-[100px] motion-safe:animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-24 bottom-24 h-96 w-96 rounded-full bg-plum-400/20 blur-[110px] motion-safe:animate-float-slow"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.21, 0.65, 0.32, 0.99] }}
          className="max-w-3xl"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-primary-100 ring-1 ring-white/25 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-gold-300" aria-hidden />
            {t("badge")}
          </span>

          <h1 className="font-display text-5xl font-semibold leading-[1.06] text-white sm:text-6xl lg:text-7xl">
            {t("titleLine1")}{" "}
            <span className="text-gradient bg-gradient-to-r from-primary-300 via-plum-200 to-gold-300 bg-clip-text text-transparent">
              {t("titleLine2")}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-100/90 sm:text-lg">
            {loc(homepage.heroIntro, locale)}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/termin"
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-r from-primary-500 to-plum-600 px-8 text-base font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              {t("cta")}
            </Link>
            <Link
              href="/kurse"
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-white/10 px-8 text-base font-semibold text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
            >
              <GraduationCap className="h-5 w-5" aria-hidden />
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* Current treatment label */}
          {current ? (
            <div className="mt-12 flex items-center gap-3" aria-hidden>
              <div className="flex gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.slug}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? "w-8 bg-gold-300" : "w-3 bg-white/30"
                    }`}
                    tabIndex={-1}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm font-medium tracking-wide text-primary-100/90"
                >
                  {loc(current.name, locale)}
                </motion.span>
              </AnimatePresence>
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 start-1/2 z-10 -translate-x-1/2 rtl:translate-x-1/2"
        animate={reduce ? {} : { y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-1 text-primary-100/70">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em]">
            {t("scroll")}
          </span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </motion.div>
    </section>
  );
}

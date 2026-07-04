"use client";

import { useLocale } from "next-intl";
import { Star, Quote } from "lucide-react";
import { loc } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

function TestimonialCard({ item, locale }: { item: Testimonial; locale: string }) {
  return (
    <figure className="relative flex w-[320px] shrink-0 flex-col gap-5 overflow-hidden rounded-3xl bg-white p-8 shadow-soft ring-1 ring-primary-100/60 sm:w-[400px]">
      <div
        className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-primary-100/60 blur-2xl"
        aria-hidden
      />
      <Quote className="relative h-8 w-8 text-primary-300" aria-hidden />
      <blockquote className="relative flex-1 text-[15px] leading-relaxed text-ink-700">
        &ldquo;{loc(item.text, locale)}&rdquo;
      </blockquote>
      <figcaption className="relative flex items-center justify-between border-t border-primary-100 pt-5">
        <div>
          <span className="block text-sm font-bold text-ink-950">{item.name}</span>
          <span className="mt-0.5 text-xs text-ink-400">Kundin</span>
        </div>
        <span className="flex gap-0.5" aria-label={`${item.rating}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < item.rating
                  ? "fill-gold-400 text-gold-400"
                  : "fill-ink-100 text-ink-100"
              }`}
              aria-hidden
            />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsMarquee({ items }: { items: Testimonial[] }) {
  const locale = useLocale();
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className="group relative overflow-hidden py-2"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
      dir="ltr"
    >
      <div className="flex w-max gap-6 motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <div key={i} dir={locale === "ar" ? "rtl" : "ltr"}>
            <TestimonialCard item={item} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}

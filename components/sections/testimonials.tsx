"use client";

import { useLocale } from "next-intl";
import { Star, Quote } from "lucide-react";
import { loc } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

function TestimonialCard({ item, locale }: { item: Testimonial; locale: string }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col gap-4 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-primary-100/70 sm:w-[380px]">
      <Quote className="h-7 w-7 text-primary-200" aria-hidden />
      <blockquote className="flex-1 text-sm leading-relaxed text-ink-700">
        {loc(item.text, locale)}
      </blockquote>
      <figcaption className="flex items-center justify-between border-t border-primary-50 pt-4">
        <span className="text-sm font-semibold text-ink-950">{item.name}</span>
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

  // Duplicate for a seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
      dir="ltr"
    >
      <div className="flex w-max gap-6 py-2 motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <div key={i} dir={locale === "ar" ? "rtl" : "ltr"}>
            <TestimonialCard item={item} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
